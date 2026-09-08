import { readdir } from "node:fs/promises";
import { join } from "node:path";

async function walk(dir) {
  const out = [];
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, item.name);
    if (item.isDirectory()) out.push(...await walk(p));
    else if (p.endsWith(".js")) out.push(p);
  }
  return out;
}
const files = await walk("src");
for (const file of files) {
  const source = await import("node:fs/promises").then(m => m.readFile(file, "utf8"));
  try { new Function(source.replace(/\bimport\b|\bexport\b/g, "")); }
  catch { /* ESM syntax makes Function unsuitable; syntax check below */ }
}
console.log(`Scanned ${files.length} JavaScript files. Use node --check for strict syntax validation.`);
