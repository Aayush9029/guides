# Guides

[NuPhy Air75 V3 guide](https://aayush9029.github.io/guides/) — visible shortcuts, quick pairing steps and compact help.

Press **Command+K / Ctrl+K**, or click the bottom-right button, to find a section or shortcut. Try `Fn+4`, `sleep`, `brightness` or `pair`.

## Edit and build

`site/guide.json` is the source of truth for shortcuts, help, colors and search aliases. `templates/index.html` defines the layout. CSS and browser interactions live in `site/assets/`.

```sh
uv run --with reportlab==5.0.1 python scripts/build_guide.py
python3 scripts/check_site.py
python3 -m http.server 8765 --directory site
```

The build generates `site/index.html`, the English PDF and the text download. Edit the data or template, then rebuild. The site has no frontend framework or external runtime dependencies. GitHub Pages rebuilds and publishes `site/` on pushes to `main`.

[Manual and OCR records](sources/README.md) · [Asset credits](ASSETS.md) · [Report a mistake](https://github.com/Aayush9029/guides/issues)
