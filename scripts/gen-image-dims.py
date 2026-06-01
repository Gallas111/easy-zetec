# -*- coding: utf-8 -*-
"""
DEPRECATED: superseded by scripts/gen-image-dims.mjs, which runs automatically
as the first step of `npm run build` (so new posts' body-image dims are picked
up on every build, locally and on Cloudflare Pages CI). This .py is kept only as
a manual fallback; the Node version emits a byte-identical JSON. Prefer the .mjs.

Generate a static image-dimensions map for body images referenced in content/.
Walks every category subdirectory under content/ for .mdx files, extracts
markdown image refs ![alt](/images/...), looks them up under public/, and
emits src/data/image-dims.json: { "/images/posts/x-body-1.webp": [w, h], ... }.

Injecting real width/height into the rendered <img> lets the browser reserve
aspect-ratio space (with .prose img { width:100%; height:auto }) -> zero CLS.

Build-independent static commit: run this script after adding body images,
commit the JSON. Missing files / non-raster (SVG) refs are reported but NOT
included (the img component falls back to omitting the attributes safely).
"""
import os
import re
import json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(ROOT, "content")
PUBLIC = os.path.join(ROOT, "public")
OUT = os.path.join(ROOT, "src", "data", "image-dims.json")

from PIL import Image

# Alt text may itself contain markdown links with [..](..), e.g.
#   ![설명 [내집마련](/blog/x)까지](/images/infographic/y.webp)
# A naive [^\]]* stops at the first nested ']' and misses the real src.
# Anchor on the image URL group "(/images/...)" and let the alt span greedily
# up to the "]" that immediately precedes it.
IMG_RE = re.compile(r"!\[.*?\]\((/images/[^)\s]+)\)")

refs = set()
for dirpath, _dirnames, filenames in os.walk(CONTENT):
    for fn in filenames:
        if not fn.endswith(".mdx"):
            continue
        with open(os.path.join(dirpath, fn), "r", encoding="utf-8") as f:
            text = f.read()
        for m in IMG_RE.finditer(text):
            refs.add(m.group(1))

dims = {}
missing = []
errors = []
for ref in sorted(refs):
    fs_path = os.path.join(PUBLIC, ref.lstrip("/").replace("/", os.sep))
    if not os.path.isfile(fs_path):
        missing.append(ref)
        continue
    try:
        with Image.open(fs_path) as im:
            w, h = im.size
        if w > 0 and h > 0:
            dims[ref] = [w, h]
        else:
            errors.append(ref + " (zero dim)")
    except Exception as e:
        errors.append(ref + " (" + str(e) + ")")

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w", encoding="utf-8") as f:
    json.dump(dims, f, ensure_ascii=False, indent=0, sort_keys=True)
    f.write("\n")

print("referenced body images:", len(refs))
print("dims written:", len(dims))
print("missing (not on disk, will fallback):", len(missing))
for m in missing[:50]:
    print("  MISSING:", m)
print("errors (e.g. SVG, will fallback):", len(errors))
for e in errors[:50]:
    print("  ERROR:", e)
print("output:", OUT)
