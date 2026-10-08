import assert from "node:assert/strict";
import { test } from "node:test";
import { brokenLinks } from "./links.js";

const fixture = new Map([
  ["index.html", '<h1 id="main">Home</h1>'],
  ["404.html", '<a href="/">Home</a><a href="#main">Skip</a><main id="main"></main><link rel="stylesheet" href="/style.css">'],
  ["style.css", undefined],
]);

test("checks missing root assets and fragments on a custom domain", async () => {
  const files = new Map(fixture);
  files.set("index.html", '<a href="/missing.css">Missing</a><a href="#absent">Absent</a><a href="https://agents.agent-pilled.com/">Product</a>');
  assert.deepEqual(await brokenLinks(files, "index.html"), [
    "/missing.css: no file missing.css",
    "#absent: no id absent in index.html",
  ]);
});

test("keeps root assets and local fragments working on a nested 404", async () => {
  assert.deepEqual(await brokenLinks(fixture, "404.html", "no/such/page"), []);
});

test("reports relative assets that break on a nested 404", async () => {
  const files = new Map(fixture);
  files.set("404.html", '<link rel="stylesheet" href="style.css">');
  assert.deepEqual(await brokenLinks(files, "404.html", "no/such/page"), [
    "style.css: no file no/such/style.css",
  ]);
});
