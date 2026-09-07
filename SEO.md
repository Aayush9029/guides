# SEO implementation

The guide targets NuPhy Air75 V3 pairing, keyboard shortcuts, flashing green light, RGB lighting, battery display and sleep settings. It is a single focused English page, with one canonical URL:

https://aayush9029.github.io/guides/

## Included

- A descriptive product-specific title, description, one H1 and ordered section headings.
- All 21 shortcuts visible in static HTML, plus five native help disclosures. Instructions work without JavaScript.
- A self-referencing HTTPS canonical, indexable robots meta tag and an XML sitemap.
- Article JSON-LD with author, source manual links and image credits.
- Open Graph and Twitter summary-card metadata with a local PNG image and descriptive alt text.
- A locally hosted NuPhy PNG product image with intrinsic dimensions and high-priority loading.
- System fonts, local CSS and JavaScript, no trackers or external runtime dependencies.
- A noindex 404 page, keyboard focus, a skip link and reduced-motion support.
- Automated checks before deployment. Run `python3 scripts/check_site.py --live` to check the published site.

## Validation

Run `python3 scripts/check_site.py` for local HTML, metadata, structured data, shortcuts, links and asset checks. The Air75 V3 rewrite was reviewed locally in Safari at desktop and mobile widths, including disclosures and the ⌘K section menu. The generated PDF was rendered and visually inspected. These checks do not establish a PageSpeed or Core Web Vitals score.

Run the `--live` check after publication to confirm the deployed HTML matches the local source. Local validation does not establish that the rewrite has been deployed.

## GitHub Pages scope

The project lives under `/guides/`. Search engines read robots.txt only from the origin root, `https://aayush9029.github.io/robots.txt`. A project-level robots.txt cannot control that origin. The supplied `site/robots.txt` is suitable for a future root-domain deployment; this project currently relies on the origin having no crawl restriction. The origin-root robots URL returned 404 during setup, which does not block crawling.

The sitemap can be submitted as its full URL in a verified Google Search Console or Bing Webmaster Tools property. This project does not claim that a property has been verified, a sitemap submitted, or indexing completed.

Structured data is descriptive, not a promise of a rich result. Search-engine indexing, ranking and real-user Core Web Vitals are not established by local validation.

If the site moves, update canonical and social URLs, structured-data and image URLs, the sitemap, robots.txt, the 404 return link, the repository homepage, and `BASE` in the build and validation scripts.
