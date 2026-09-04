# SEO implementation

The guide targets NuPhy Air65 V3 pairing, keyboard shortcuts, flashing green light, RGB lighting, battery display and sleep settings. It is a single focused English page, with one canonical URL:

https://aayush9029.github.io/guides/

## Included

- A descriptive product-specific title, description, one H1 and ordered section headings.
- Static, readable instructions and all 21 shortcuts in the HTML. Search does not require a server.
- A self-referencing HTTPS canonical, indexable robots meta tag and an XML sitemap.
- Article, WebPage, WebSite, Person and ImageObject JSON-LD, with author metadata, sources and image credits.
- Open Graph and Twitter summary-card metadata with a local JPEG image and descriptive alt text.
- Locally hosted responsive WebP photography, intrinsic image dimensions, a high-priority hero image and lazy-loaded secondary images.
- System fonts, local CSS and JavaScript, no trackers or external runtime dependencies.
- A noindex 404 page, semantic navigation, keyboard focus, a skip link and reduced-motion support.
- Automated checks before deployment. Run `python3 scripts/check_site.py --live` to check the published site.

## Validation results

The Nu HTML Checker returned no errors or warnings for the published HTML source. Safari review covered desktop and 390-pixel mobile layouts, shortcut search, and the product gallery. The rendered page exposes all five structured-data entities. These are structural and functional checks, not a measured PageSpeed or Core Web Vitals score.

## GitHub Pages scope

The project lives under `/guides/`. Search engines read robots.txt only from the origin root, `https://aayush9029.github.io/robots.txt`. A project-level robots.txt cannot control that origin. The supplied `site/robots.txt` is suitable for a future root-domain deployment; this project currently relies on the origin having no crawl restriction. The origin-root robots URL returned 404 during setup, which does not block crawling.

The sitemap can be submitted as its full URL in a verified Google Search Console or Bing Webmaster Tools property. This project does not claim that a property has been verified, a sitemap submitted, or indexing completed.

Structured data is descriptive, not a promise of a rich result. Search-engine indexing, ranking and real-user Core Web Vitals are not established by local validation.

If the site moves, update canonical and social URLs, JSON-LD IDs and image URLs, the sitemap, robots.txt, the 404 return link, the repository homepage, and `BASE` in the validation script.
