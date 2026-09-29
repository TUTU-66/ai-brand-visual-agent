# Asset index

All visual assets are local derivatives of the user-supplied Photoshop Large Document. No external search or generated imagery was used.

- Source: `M:\20240826拨云计划\顶部动态.psb`
- Source canvas: 750×750 px, RGB, 8-bit
- Extraction: `psd-tools` composite export, preserving each visible pixel layer and its original bounding box
- Reference motion only: `C:\Users\NINGMEI\Downloads\联盟来信信封微动效前置视频.mp4` (960×960, 24 fps, 5.04 s)

## Frozen local layers

| File | Original layer | Placement on 750×750 canvas |
| --- | --- | --- |
| `layer-00.png` | 背景 | x 0, y 0, 750×750 |
| `layer-01.png` | 背景装饰 | x -39, y 167, 843×515 |
| `layer-02.png` | 信封 | x 7, y 67, 735×549 |
| `layer-03.png` | 印章 | x 327, y 446, 97×127 |
| `layer-04.png` | 三角形 1 拷贝 | x 355, y 639, 40×20; source opacity 40% |
| `layer-05.png` | 三角形 1 | x 360, y 631, 30×16 |

`layers.json` preserves the machine-readable layer names, paths, sizes, opacities, blend modes, and bounding boxes. `psb-preview.png` is the full visual reference for pixel-alignment checks.

Semantic aliases used by the composition: `background.png`, `gold-waves.png`, `gold-waves-sheen.png`, `envelope.png`, `seal.png`, `arrow-soft.png`, and `arrow-main.png`. The sheen file is a byte-identical local alias used only to give the animated overlay a distinct media identity.

`gsap.min.js` is a local frozen copy of GSAP 3.14.2 so preview and render do not depend on an external CDN.
