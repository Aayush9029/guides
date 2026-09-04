from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse, unquote
from urllib.request import Request, urlopen
import argparse
import json
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / 'site'
BASE = 'https://aayush9029.github.io/guides/'

class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.tags = []
        self.ids = set()
        self.metadata = {}
        self.title = ''
        self.in_title = False
        self.in_schema = False
        self.schema_text = ''
        self.schemas = []
        self.text = []

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        self.tags.append((tag, values))
        if values.get('id'):
            assert values['id'] not in self.ids, f"Duplicate ID: {values['id']}"
            self.ids.add(values['id'])
        if tag == 'meta':
            self.metadata[values.get('name', values.get('property'))] = values.get('content', '')
        self.in_title = self.in_title or tag == 'title'
        if tag == 'script' and values.get('type') == 'application/ld+json':
            self.in_schema = True
            self.schema_text = ''

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False
        if tag == 'script' and self.in_schema:
            self.schemas.append(json.loads(self.schema_text))
            self.in_schema = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        if self.in_schema:
            self.schema_text += data
        else:
            self.text.append(data)

def validate():
    markup = (SITE / 'index.html').read_text()
    page = Page()
    page.feed(markup)
    assert not any(term in markup for term in ['localhost', '127.0.0.1', 'file://', '/tmp/']), 'Local URL in public page'
    assert len([t for t,a in page.tags if t == 'h1']) == 1, 'Expected one H1'
    assert 'NuPhy Air65 V3' in page.title and 30 <= len(page.title) <= 65, 'Title needs product name and readable length'
    assert 120 <= len(page.metadata['description']) <= 160, 'Description needs a concise search summary'
    assert page.metadata['robots'] == 'index, follow, max-image-preview:large', 'Indexing disabled'
    assert ('html', {'lang':'en'}) in page.tags, 'Page must be English'
    canonicals = [a['href'] for t,a in page.tags if t == 'link' and a.get('rel') == 'canonical']
    assert canonicals == [BASE], 'Canonical must match deployment URL'
    assert page.metadata['og:url'] == BASE
    assert page.metadata['og:image'].startswith(BASE)
    assert page.metadata['twitter:card'] == 'summary_large_image'
    assert 'og:image:alt' in page.metadata and 'twitter:image:alt' in page.metadata
    assert len([a for t,a in page.tags if 'data-shortcut' in a]) == 21, 'Missing keyboard shortcuts'
    assert len(page.schemas) == 1
    graph = page.schemas[0]['@graph']
    assert page.schemas[0]['@context'] == 'https://schema.org'
    article = next(item for item in graph if item['@type'] == 'Article')
    assert article['headline'] == page.title
    assert article['inLanguage'] == 'en' and article['author']['@id'] == BASE+'#author'
    assert article['mainEntityOfPage']['@id'] == BASE+'#webpage'
    assert article['dateModified'] in markup
    schema_ids = {item['@id'] for item in graph}
    def check_references(value):
        if isinstance(value,dict):
            if set(value) == {'@id'}:
                assert value['@id'] in schema_ids, f'Unresolved schema reference: {value}'
            for child in value.values():
                check_references(child)
        elif isinstance(value,list):
            for child in value:
                check_references(child)
    check_references(graph)
    files = set()
    for tag, attrs in page.tags:
        if tag == 'img':
            assert attrs.get('alt'), 'Image missing alt text'
            assert int(attrs['width']) > 0 and int(attrs['height']) > 0, 'Image dimensions required'
        candidates = []
        if attrs.get('src'):
            candidates.append(attrs['src'])
        if attrs.get('href'):
            candidates.append(attrs['href'])
        if attrs.get('srcset'):
            candidates.extend(item.strip().split()[0] for item in attrs['srcset'].split(','))
        for candidate in candidates:
            parsed = urlparse(candidate)
            if parsed.scheme or parsed.netloc:
                continue
            if parsed.fragment and not parsed.path:
                assert parsed.fragment in page.ids, f'Missing fragment: {candidate}'
                continue
            local = (SITE / unquote(parsed.path)).resolve()
            assert local.is_relative_to(SITE), f'Asset escapes site directory: {candidate}'
            if local.is_dir():
                local /= 'index.html'
            assert local.is_file(), f'Missing asset: {candidate}'
            files.add(local.relative_to(SITE).as_posix())
    for path in SITE.glob('assets/*'):
        assert path.stat().st_size < 200_000, f'Asset too large: {path.name}'
    sitemap = ET.parse(SITE/'sitemap.xml')
    locations = [el.text for el in sitemap.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
    assert locations == [BASE], 'Sitemap canonical mismatch'
    assert BASE+'sitemap.xml' in (SITE/'robots.txt').read_text()
    error = Page()
    error.feed((SITE/'404.html').read_text())
    assert error.metadata['robots'] == 'noindex'
    assert (SITE/'air65-v3-english-guide.pdf').read_bytes().startswith(b'%PDF-')
    print(f'PASS: English HTML, canonical, metadata, schema, 21 shortcuts, sitemap, 404, {len(files)} local resources.')
    print('PASS: Every image has dimensions and alt text; every static asset is under 200 KB.')
    return files

def validate_live(files):
    targets = ['', 'sitemap.xml', 'air65-v3-english-guide.pdf', *sorted(files)]
    for path in dict.fromkeys(targets):
        url = urljoin(BASE,path)
        with urlopen(Request(url,headers={'User-Agent':'Air65GuideValidation/1.0'}),timeout=30) as response:
            assert response.status == 200, f'{url}: {response.status}'
            if path == '':
                deployed = response.read().decode()
                assert deployed == (SITE/'index.html').read_text(), 'Live HTML differs from validated source'
    print('PASS: Live homepage matches source; sitemap, PDF, CSS, JavaScript and images return HTTP 200.')

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--live',action='store_true')
    args = parser.parse_args()
    assets = validate()
    if args.live:
        validate_live(assets)
