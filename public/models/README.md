# 3D model goes here

Drop a `vr-headset.glb` file in this folder (`public/models/vr-headset.glb`) and
the hero scene will load it automatically — no code changes needed. Until then,
the scene shows an interactive procedural placeholder so the page still works.

## Where to get a free model

- **Sketchfab** — search "VR headset", then filter by *Downloadable* + a
  CC0/CC-BY license. Export/download as `.glb`. If the license is CC-BY,
  keep the attribution and credit the author somewhere on the site.
- **Poly Pizza** (poly.pizza) — low-poly models, most CC0, `.glb` ready to use.
- **Quaternius** (quaternius.com) — free CC0 low-poly asset packs, some
  include tech/sci-fi props.

Keep the file size reasonable (under a few MB) so it loads quickly — Sketchfab
downloads sometimes include high-res textures you can strip out or compress
with a tool like `gltf-transform` if the model feels heavy.
