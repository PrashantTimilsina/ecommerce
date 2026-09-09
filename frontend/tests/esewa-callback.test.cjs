const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");
const path = require("node:path");
const source = fs.readFileSync(path.join(__dirname, "../lib/esewa-callback.ts"), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const helper = { exports: {} };
new Function("module", "exports", compiled)(helper, helper.exports);
const { readEsewaCallback } = helper.exports;

for (const query of ["data=abc%2Bdef%3D", "method=esewa&data=abc%2Bdef%3D", "method=esewa?data=abc%2Bdef%3D", "data=abc+def="]) {
  test(`reads callback ${query}`, () => {
    assert.deepEqual(readEsewaCallback(new URLSearchParams(query)), { method: "esewa", data: "abc+def=" });
  });
}
test("does not invent data for a bare success page", () => {
  assert.deepEqual(readEsewaCallback(new URLSearchParams()), { method: null, data: null });
});
test("does not treat another payment method as eSewa", () => {
  assert.equal(readEsewaCallback(new URLSearchParams("method=khalti&data=abc")).method, "khalti");
});
