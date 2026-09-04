# NuPhy Air65 V3 Field Guide

[Open the guide](https://aayush9029.github.io/nuphy-air65-guide/)

An independent English guide to Windows dongle pairing, all 21 shortcuts in the Air65 V3 quick guide, RGB lighting, battery indicators, and sleep settings. Includes a one-page printable PDF.

Static HTML, CSS and JavaScript. No build step, third-party scripts, tracking, cookies or runtime dependencies. NuPhy product photography is stored locally in optimized formats. Search works locally; every shortcut remains readable with JavaScript disabled.

## Run locally

```sh
python3 -m http.server 8766 --directory site
```

Open `http://localhost:8766`.

## Validate

```sh
python3 scripts/check_site.py
node --check site/assets/guide.js
```

After deployment:

```sh
python3 scripts/check_site.py --live
```

The validation checks canonical URLs, metadata, structured-data references, the sitemap, image dimensions and alt text, local links, asset sizes, and the presence of all 21 shortcut entries. Live validation checks that the deployed HTML matches the source and the site assets are reachable.

## Publish

GitHub Actions validates and deploys `site/` to GitHub Pages when `main` changes. The workflow uses official GitHub Pages actions pinned to commit IDs. Enable Pages with GitHub Actions as the publishing source.

## Sources and contributions

Shortcuts follow the [official Air65 V3 quick guide](https://cdn.shopify.com/s/files/1/0268/7297/1373/files/NuPhy_Air_65_v3_260203.pdf?v=1770194323), dated February 3, 2026. Connection troubleshooting also references [NuPhy IO support](https://www.nuphy.io/en-US/commonProblem).

This project is not affiliated with NuPhy. Product images and branding belong to NuPhy; see [asset credits](ASSETS.md). The software license does not cover those third-party assets.

[Report an error](https://github.com/Aayush9029/nuphy-air65-guide/issues) with the keyboard model, physical layout and a source for the correction. Keep the guide English-only and the default instructions focused on US/UK keyboards.
