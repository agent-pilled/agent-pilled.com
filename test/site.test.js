import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { test } from "node:test";
import { brokenLinks } from "./links.js";

const files = new Map();
for (const entry of await readdir(new URL("../site/", import.meta.url))) {
  files.set(entry, entry.endsWith(".html")
    ? await readFile(new URL(`../site/${entry}`, import.meta.url), "utf8")
    : undefined);
}

test("the site has a homepage and a custom 404", () => {
  assert.ok(files.has("index.html"));
  assert.ok(files.has("404.html"));
});

for (const page of [...files.keys()].filter((path) => path.endsWith(".html"))) {
  test(`${page} has working local links and assets`, async () => {
    assert.deepEqual(await brokenLinks(files, page), []);
  });
}

test("the custom 404 works at any missing address", async () => {
  assert.deepEqual(await brokenLinks(files, "404.html", "no/such/page.html"), []);
});
