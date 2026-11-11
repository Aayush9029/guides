# Guides

A static, framework-free web guide for the NuPhy Air75 V3 keyboard: shortcuts, pairing steps, help, an English PDF, and a text download. Published at `https://aayush9029.github.io/guides/`. Status: active. Public repository `Aayush9029/guides`, MIT license (NuPhy assets excluded).

## Commands

| Task | Command |
|------|---------|
| Build HTML, PDF, and text | `uv run --with reportlab==5.0.1 python scripts/build_guide.py` |
| Check the local site | `python3 scripts/check_site.py` |
| Check the published site | `python3 scripts/check_site.py --live` |
| Serve locally | `python3 -m http.server 8765 --directory site` |
| Deploy | Push to `main`. `.github/workflows/pages.yml` builds, checks, and publishes `site/`. |

## Architecture

- `site/guide.json` is the source of truth for shortcuts, help, colors, and search aliases.
- `templates/index.html` is the layout. `site/assets/` holds the CSS, the JavaScript (the ⌘K section menu), icons, and images.
- `scripts/build_guide.py` writes `site/index.html`, `site/air75-v3-english-guide.pdf`, and `site/air75-v3-guide.txt`. Do not edit these outputs by hand.
- `sources/` holds the NuPhy manual PDF and its OCR text. `sources/README.md` records how each fact was checked.
- `SEO.md` records the SEO setup. `ASSETS.md` records the asset credits.

## Rules

- Edit `site/guide.json` or `templates/index.html`, then rebuild and run `check_site.py`.
- Keep the site free of frameworks, trackers, and external runtime dependencies. Instructions must work without JavaScript.
- Check each shortcut against the manual in `sources/` before you add or change it.
- Add a credit to `ASSETS.md` for each third-party asset.
- If the site URL changes, update `BASE` in both scripts, the canonical and social URLs, structured data, the sitemap, `robots.txt`, and the 404 link. `SEO.md` has the full list.
