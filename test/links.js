import { HtmlValidate, Parser } from "html-validate";

const SITE_URL = "https://agent-pilled.com/";
const validator = new HtmlValidate();

/** Check local links and assets, including a 404 served at a nested address. */
export async function brokenLinks(files, page, servedAt = page) {
  const config = await validator.getConfigFor(page);
  const parse = (path) => new Parser(config).parseHtml(files.get(path));
  const root = parse(page);
  const address = new URL(servedAt, SITE_URL);
  const failures = [];
  for (const element of root.querySelectorAll("[href], [src], meta[property='og:url']")) {
    const reference = element.getAttributeValue("href")
      ?? element.getAttributeValue("src")
      ?? element.getAttributeValue("content");
    const url = new URL(reference, address);
    if (url.origin !== new URL(SITE_URL).origin) continue;
    const sameDocument = url.href.split("#")[0] === address.href.split("#")[0];
    let target = sameDocument ? page : decodeURIComponent(url.pathname).slice(1);
    if (target === "" || target.endsWith("/")) target += "index.html";
    if (!files.has(target)) {
      failures.push(`${reference}: no file ${target}`);
      continue;
    }
    const id = decodeURIComponent(url.hash.slice(1));
    if (id && !parse(target).querySelectorAll("[id]").some((node) => node.id === id)) {
      failures.push(`${reference}: no id ${id} in ${target}`);
    }
  }
  return failures;
}
