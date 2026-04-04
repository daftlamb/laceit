# Lace It ✦

> Turn letters and images into lace.

Lace It is an experimental generative art tool that renders text and photos as intricate lace patterns — thread paths traced along contours, woven into meshes, animated in real time. Export as PNG or SVG.

---

## What it does

Type a word (up to 4 letters) and watch each character bloom into a lace embroidery. Or upload a photo and let Lace It trace its edges into thread. Every parameter — density, stitch type, thread weight, color — is live-editable.

---

## Modes

### Text mode
- Up to 4 uppercase letters rendered as lace
- Thread follows the contour of each letterform
- Running thread connects letters like loose embroidery

### Image mode
- Upload any photo — contours are extracted automatically
- Each edge layer becomes a thread path
- Brush render: lace traces image outlines in real time

---

## Controls

| Parameter | Description |
|-----------|-------------|
| **Mesh** | Thread density — more mesh, more detail |
| **Stitch** | Pattern type: lace / hex / diamond |
| **Straight** | Toggle curved vs. straight thread segments |
| **Thread weight** | Line thickness |
| **C1 / C2 / C3** | Three thread colors |
| **Background** | Canvas background color |
| **Color presets** | Quick palette swatches |

Hit **Regenerate** to reseed with a new random layout.

---

## Export

- **PNG** — High-res flat render
- **SVG** — Vector export, scalable to any size, ready for plotters or print

---

## Tech

- Canvas 2D API — thread rendering, animation loop
- WebGL — brush/image lace render pass
- Moore neighborhood contour tracing — edge extraction from images
- Douglas-Peucker simplification — contour smoothing
- No framework. No build step. One HTML file.

---

## Try it

→ **[laceitapp.com](https://laceitapp.com)** *(coming soon)*

Or clone and open `index.html` in a browser.

---

## Made by

Design by [Mog](mailto:daftlamb@gmail.com)

Part of the *\*It* series of single-purpose creative tools.
