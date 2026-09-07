from html import escape
from pathlib import Path
from string import Template
import json

from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, TableStyle

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / 'site'
DATA = json.loads((SITE / 'guide.json').read_text())
BASE = 'https://aayush9029.github.io/guides/'
TITLE = DATA['title'] + ' Guide: Pairing, Shortcuts & RGB'
DESCRIPTION = 'Set up your NuPhy Air75 V3 on Mac or Windows. Find connection modes, dongle pairing, Bluetooth, RGB, sleep and screenshot shortcuts in one English guide.'


def icon(name):
    return f'<svg class="icon" aria-hidden="true"><use href="assets/icons.svg#{escape(name)}"/></svg>'


def shortcut_table(group):
    rows = []
    for index, row in enumerate(group['shortcuts']):
        keys = ' + '.join(f'<kbd>{escape(key)}</kbd>' for key in row['keys'])
        hold = f'<span class="duration">{escape(row["hold"])}</span>' if row.get('hold') else ''
        rows.append(f'<tr id="{group["id"]}-{index}" data-shortcut data-search="{escape(row.get("aliases", ""))}" tabindex="-1"><th scope="row">{escape(row["action"])}</th><td><span class="keys">{keys}</span>{hold}</td></tr>')
    return '<table><thead class="sr-only"><tr><th>Action</th><th>Shortcut</th></tr></thead><tbody>\n' + '\n'.join(rows) + '\n</tbody></table>'


def group_html(group):
    hint = f'<p class="hint">{escape(group["hint"])}</p>' if group['hint'] else ''
    return f'<section id="{group["id"]}" data-jump="{group["title"]}" data-icon="{group["icon"]}" data-search="{group["aliases"]}"><h3>{icon(group["icon"])}{group["title"]}</h3>\n{shortcut_table(group)}{hint}</section>'


def light_html(light):
    choices = ''.join(f'<button type="button" data-color="{color}" aria-pressed="{str(index == 0).lower()}" aria-label="Preview {name}: {label}"><i style="--light:{color}" aria-hidden="true"></i>{label}</button>' for index, (label, name, color) in enumerate(light['values']))
    return f'<div class="light-control" style="--light:{light["values"][0][2]}"><button class="led-strip" type="button" aria-label="Cycle {light["title"].lower()} light preview"></button><div><h3>{icon(light["icon"])}{light["title"]}</h3><div class="light-options">{choices}</div></div></div>'


def faq_html(faq):
    answer = ''.join(f'<p>{escape(p)}</p>' for p in faq['answer'])
    if faq.get('link'):
        answer += f'<p><a href="{escape(faq["link"][1])}">{escape(faq["link"][0])}</a></p>'
    return f'<details id="{faq["id"]}" name="help" data-jump="{escape(faq["question"])}" data-icon="{faq["icon"]}" data-search="{faq["aliases"]}"><summary>{escape(faq["question"])}</summary><div class="answer">{answer}</div></details>'


schema = {'@context': 'https://schema.org', '@type': 'Article', 'headline': TITLE, 'description': DESCRIPTION, 'url': BASE, 'mainEntityOfPage': BASE, 'author': {'@type': 'Person', 'name': 'Aayush9029', 'url': 'https://github.com/Aayush9029'}, 'inLanguage': 'en', 'datePublished': '2026-09-04', 'dateModified': DATA['modified'], 'image': {'@type': 'ImageObject', 'contentUrl': BASE + 'assets/nuphy-air75-v3.png', 'width': 624, 'height': 500, 'creditText': 'NuPhy'}, 'citation': [DATA['source'], DATA['manual']]}
values = {**{key: escape(DATA[key]) for key in ('title', 'layout', 'source', 'manual')}, 'base': BASE, 'page_title': escape(TITLE), 'description': DESCRIPTION, 'schema': json.dumps(schema, ensure_ascii=False), 'pairing': ''.join(f'<li>{escape(step)}</li>' for step in DATA['pairing']), 'groups': '\n'.join(map(group_html, DATA['groups'])), 'lights': ''.join(map(light_html, DATA['lights'])), 'faqs': '\n'.join(map(faq_html, DATA['faqs']))}
values.update({name.replace('-', '_') + '_icon': icon(name) for name in ('download', 'radio', 'command', 'search')})
(SITE / 'index.html').write_text(Template((ROOT / 'templates/index.html').read_text()).substitute(values))

styles = getSampleStyleSheet()
styles['Title'].alignment = 0
styles['BodyText'].fontSize = 10
styles['BodyText'].leading = 12
styles['BodyText'].spaceAfter = 4
for heading in ('Heading2', 'Heading3'):
    styles[heading].spaceBefore = 9
    styles[heading].spaceAfter = 5
    styles[heading].keepWithNext = True
text = []
story = []


def paragraph(value, style='BodyText'):
    value = value.translate(str.maketrans({'↑': 'Up', '↓': 'Down', '←': 'Left', '→': 'Right', '·': '|', '–': '-', '’': "'"}))
    text.append(value)
    return Paragraph(escape(value), styles[style])


story.extend([paragraph(DATA['title'], 'Title'), paragraph(DATA['layout'] + ' default assignments.'), paragraph('Pair your dongle', 'Heading2')])
for index, step in enumerate(DATA['pairing'], 1):
    story.append(paragraph(f'{index}. {step}'))
for group in DATA['groups']:
    story.append(paragraph(group['title'], 'Heading2'))
    rows = []
    for row in group['shortcuts']:
        keys = ' + '.join(row['keys']) + (f' (hold {row["hold"]})' if row.get('hold') else '')
        rows.append([paragraph(row['action']), paragraph(keys)])
    table = Table(rows, colWidths=[260, 245], hAlign='LEFT')
    table.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),0),('TOPPADDING',(0,0),(-1,-1),3),('BOTTOMPADDING',(0,0),(-1,-1),3),('LINEBELOW',(0,0),(-1,-2),0.4,colors.HexColor('#dddddd'))]))
    story.append(table)
    if group['hint']:
        story.append(paragraph(group['hint']))
for light in DATA['lights']:
    story.append(paragraph(light['title'] + ' lights', 'Heading2'))
    story.append(paragraph('; '.join(f'{name}: {label}' for label, name, color in light['values'])))
for faq in DATA['faqs']:
    story.append(paragraph(faq['question'], 'Heading2'))
    story.extend(paragraph(p) for p in faq['answer'])
    if faq.get('link'):
        label, url = faq['link']
        text.append(f'{label}: {url}')
        story.append(Paragraph(f'<link href="{escape(url)}" color="#315e49">{escape(label)}</link>', styles['BodyText']))
story.append(paragraph('Sources', 'Heading2'))
for label, url in [('Quick Guide & FAQ', DATA['source']), ('Full ANSI manual', DATA['manual']), ('Online guide', BASE)]:
    text.append(f'{label}: {url}')
    story.append(Paragraph(f'<link href="{escape(url)}" color="#315e49">{escape(label)}</link>', styles['BodyText']))


def footer(canvas, doc):
    canvas.setFont('Helvetica', 8)
    canvas.drawString(50, 24, DATA['title'] + ' | Independent guide | ' + DATA['modified'])
    canvas.drawRightString(562, 24, str(doc.page))


SimpleDocTemplate(str(SITE / 'air75-v3-english-guide.pdf'), pagesize=(612,792), leftMargin=50, rightMargin=50, topMargin=40, bottomMargin=45, title=TITLE, author='Aayush9029').build(story, onFirstPage=footer, onLaterPages=footer)
(SITE / 'air75-v3-guide.txt').write_text('\n\n'.join(text) + '\n')
print('Built HTML, PDF and text from site/guide.json')
