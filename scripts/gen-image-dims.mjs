// Generate a static image-dimensions map for body images referenced in content/.
//
// Walks every category subdirectory under content/ for .mdx files, extracts
// markdown image refs ![alt](/images/...), looks them up under public/, and
// emits src/data/image-dims.json: { "/images/posts/x-body-1.webp": [w, h], ... }.
//
// Injecting real width/height into the rendered <img> lets the browser reserve
// aspect-ratio space (.prose img { max-width:100%; height:auto }) -> zero CLS.
//
// This is wired into `npm run build` (prepended) so adding a new post with new
// body images automatically regenerates the map on every build — local AND on
// the Cloudflare Pages CI. No manual re-run required. The JSON is also committed
// as a fallback. (Node rewrite of the original scripts/gen-image-dims.py.)
//
// Missing files / non-raster (SVG) refs are reported but NOT included (the img
// component falls back to omitting the attributes safely).

import { readFileSync, writeFileSync, mkdirSync, statSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { imageSize } from "image-size";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = join(ROOT, "content");
const PUBLIC = join(ROOT, "public");
const OUT = join(ROOT, "src", "data", "image-dims.json");

// Alt text may itself contain markdown links with [..](..), e.g.
//   ![설명 [내집마련](/blog/x)까지](/images/infographic/y.webp)
// A naive [^\]]* stops at the first nested ']' and misses the real src.
// Anchor on the image URL group "(/images/...)" and let the alt span (lazily,
// including newlines) up to the "]" that immediately precedes it.
const IMG_RE = /!\[[\s\S]*?\]\((\/images\/[^)\s]+)\)/g;

function walkMdx(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkMdx(full));
    } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
      out.push(full);
    }
  }
  return out;
}

const refs = new Set();
for (const file of walkMdx(CONTENT)) {
  const text = readFileSync(file, "utf-8");
  for (const m of text.matchAll(IMG_RE)) {
    refs.add(m[1]);
  }
}

const dims = {};
const missing = [];
const errors = [];
for (const ref of [...refs].sort()) {
  // ref is a posix-style "/images/..." URL; build the OS path from segments.
  const fsPath = join(PUBLIC, ...ref.replace(/^\/+/, "").split("/"));
  let isFile = false;
  try {
    isFile = statSync(fsPath).isFile();
  } catch {
    isFile = false;
  }
  if (!isFile) {
    missing.push(ref);
    continue;
  }
  // Skip non-raster (SVG) refs — same as the original python (PIL couldn't open
  // them, so they fell through to the fallback). image-size *can* parse an SVG's
  // declared width/height, but to preserve the existing map exactly and keep the
  // img component's behavior unchanged we leave SVGs to the safe attribute-less
  // fallback path.
  if (/\.svg$/i.test(ref)) {
    errors.push(`${ref} (svg, skipped)`);
    continue;
  }
  try {
    const { width, height } = imageSize(readFileSync(fsPath));
    if (width > 0 && height > 0) {
      dims[ref] = [width, height];
    } else {
      errors.push(`${ref} (zero dim)`);
    }
  } catch (e) {
    errors.push(`${ref} (${e && e.message ? e.message : e})`);
  }
}

// Match the original python `json.dump(indent=0, sort_keys=True,
// ensure_ascii=False)` output byte-for-byte so the committed diff stays clean
// and the format is identical: each token on its own line, keys sorted, a
// space after the ":", non-ASCII kept literal, trailing newline. (LF here; git
// core.autocrlf handles the CRLF on checkout — same as the python-written file.)
const keys = Object.keys(dims).sort();
let out;
if (keys.length === 0) {
  out = "{}\n";
} else {
  const entries = keys.map((k) => {
    const [w, h] = dims[k];
    return `${JSON.stringify(k)}: [\n${w},\n${h}\n]`;
  });
  out = `{\n${entries.join(",\n")}\n}\n`;
}
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, out, "utf-8");

console.log("referenced body images:", refs.size);
console.log("dims written:", Object.keys(dims).length);
console.log("missing (not on disk, will fallback):", missing.length);
for (const m of missing.slice(0, 50)) console.log("  MISSING:", m);
console.log("errors (e.g. SVG, will fallback):", errors.length);
for (const e of errors.slice(0, 50)) console.log("  ERROR:", e);
console.log("output:", OUT);
