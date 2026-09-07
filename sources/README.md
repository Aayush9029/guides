# Air75 V3 source records

Retrieved and checked on 2026-09-07. The guide covers the Air75 V3 ANSI / US layout with default assignments.

## Quick Guide & FAQ

[Original PDF](https://cdn.shopify.com/s/files/1/0268/7297/1373/files/Air75_V3_Quick_Guide_FAQ.pdf?v=1753438891) · [Local PDF](Air75_V3_Quick_Guide_FAQ.pdf) · [Raw OCR](Air75_V3_Quick_Guide_FAQ.ocr.txt)

The PDF has 17 image-only pages. `pdftotext -layout` found no text. Pages were rendered with `pdftoppm -scale-to 1700 -png` and processed with Tesseract 5.5.3. The raw OCR is retained for traceability; non-English text and key diagrams are not reliably recognized. The relevant English pages and diagrams were inspected visually.

| PDF pages | Content used |
| --- | --- |
| 2 | Wired mode; Bluetooth on Fn + 1/2/3; 2.4 GHz on Fn + 4 |
| 3 | Backlight brightness, effect, color and animation speed |
| 4–6 | Knob module tools and installation diagrams |
| 9 | Bluetooth troubleshooting; 2.4 GHz selection and pairing; green light states; interference advice |
| 10 | Key faults, NuPhy IO, battery advice, auto sleep toggle and support contact |

The FAQ covers multiple keyboards. Its Fn + R reference applies to other models; the Air75 instruction is Fn + 4. The supplied URL identifies an Air75 V3 manual, not an Air65 V3 manual. No claim is made that its timestamp establishes it as the newest revision.

## Full ANSI manual

The official [NuPhy IO manual center](https://www.nuphy.io/en-US/keyboardDescription) lists Air75 V3 ANSI, ISO and JIS separately. The ANSI entry links to this [Markdown resource](https://cdn.nuphy.io/image/2025/07/10/da3924ff0fbc4944959c986d727de766.md), which embeds the [full manual image](https://www.nuphy.io/ali-oss/image/2025/07/10/469a9eceb212498ea8bc42e4f62ec877.png).

The full image was inspected to verify:

- Win/Mac layout selection and Off/Wired/Wireless connection selection are separate physical switches.
- Short presses select a wireless channel; holding for three seconds enters pairing.
- Side lighting uses Fn + M with arrows, comma or period.
- Fn + ] toggles sleep; enabled sleep starts after six minutes of inactivity.
- Fn + backslash toggles persistent battery display; holding Fn + [ for three seconds resets factory settings.
- Left connection/Caps Lock colors, right battery ranges and three-flash system/sleep feedback.
- The screenshot key selects an area in Mac or Windows mode; Fn plus that key captures the full screen in Mac mode.
- The default knob controls volume and mute; Mac layers are 0–3 and Windows layers are 4–7.

The manual does not document the previous site's Fn + Tab or Fn + M + slash lighting toggles. Those entries are omitted from this reference. Custom assignments may differ; inspect them in NuPhy IO.

## Readable outputs

[English text](../site/air75-v3-guide.txt) and [English PDF](../site/air75-v3-english-guide.pdf) are rewritten references. Rebuild both from `site/guide.json` with the command in the repository README.
