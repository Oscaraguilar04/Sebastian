import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve, relative, isAbsolute } from "node:path";

const dist = resolve("dist");
const base = "/Sebastian/";
const origin = "https://oscaraguilar04.github.io";
const placeholder = "%BASE_URL%";

function verifyFile(url) {
  assert(url.startsWith(base), `Asset is outside the Pages base: ${url}`);
  const file = resolve(dist, decodeURIComponent(url.slice(base.length)));
  const path = relative(dist, file);
  assert(!path.startsWith("..") && !isAbsolute(path), `Invalid asset path: ${url}`);
  assert(existsSync(file), `Missing production asset: ${url}`);
  return file;
}

for (const filename of ["index.html", "404.html"]) {
  const html = readFileSync(resolve(dist, filename), "utf8");
  assert(!html.includes("main.tsx"), `${filename} references the development entry`);
  assert(!html.includes(placeholder), `${filename} contains an unprocessed base placeholder`);
  assert(!/(?:src|href)=["'][^"']*\/src\//.test(html), `${filename} loads source code`);
  const urls = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/g)].map(match => match[1]);
  urls.forEach(verifyFile);
  const scripts = urls.filter(url => url.endsWith(".js"));
  const styles = urls.filter(url => url.endsWith(".css"));
  assert(scripts.length > 0 && styles.length > 0, `${filename} lacks production JS/CSS`);
  for (const url of [...scripts, ...styles]) {
    assert(/^\/Sebastian\/assets\/.+-[\w-]+\.(?:js|css)$/.test(url), `Not a hashed build asset: ${url}`);
  }
  const fonts = new Set();
  for (const url of styles) {
    const css = readFileSync(verifyFile(url), "utf8");
    assert(!css.includes(placeholder), "CSS contains an unprocessed base placeholder");
    for (const match of css.matchAll(/url\(["']?([^\s)"']+)["']?\)/g)) {
      if (match[1].startsWith("data:")) continue;
      const asset = new URL(match[1], origin + url);
      assert.equal(asset.origin, origin, `Unexpected external CSS asset: ${asset.href}`);
      verifyFile(asset.pathname);
      if (asset.pathname.endsWith(".woff2")) fonts.add(asset.pathname);
    }
  }
  assert.equal(fonts.size, 3, "Expected Cormorant normal/italic and Manrope fonts");
  for (const preload of urls.filter(url => url.endsWith(".woff2"))) {
    assert(fonts.has(preload), `Font preload does not match a CSS font: ${preload}`);
  }
  console.log(`${filename}: verified ${[...scripts, ...styles, ...fonts].join(", ")}`);
}

function checkDirectory(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = resolve(directory, entry.name);
    if (entry.isDirectory()) checkDirectory(file);
    else assert(!/\.(?:tsx?|jsx)$/.test(entry.name), `Source file in Pages artifact: ${file}`);
  }
}
checkDirectory(dist);
assert(existsSync(resolve(dist, ".nojekyll")), "Missing .nojekyll");
console.log("Pages artifact verified: compiled assets and fonts exist; no development entry or unresolved base placeholders.");
