#!/usr/bin/env python3
"""Build the Plant Book from src/ into one page.

  python3 tools/build.py            -> site/index.html and site/sw.js (the installable app on GitHub Pages)
  python3 tools/build.py --artifact -> also artifact/plant-book.html (the same page, no head, for a claude.ai preview)

src/body.html holds the page; its /*@@CSS@@*/, /*@@DATA@@*/ and /*@@APP@@*/ markers are filled from
src/style.css, src/data.js + taste.js + explore.js + forbidden.js + printer.js + harvest.js, and src/app.js. Every build gets a new BUILD stamp, which is how installed
phones notice an update (see src/sw.js)."""
import datetime, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = lambda n: open(os.path.join(ROOT, 'src', n), encoding='utf-8').read()
BUILD = os.environ.get('BUILD') or datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M')

page = src('body.html')
for marker, names in (('/*@@CSS@@*/', ['style.css']), ('/*@@DATA@@*/', ['data.js', 'taste.js', 'explore.js', 'forbidden.js', 'printer.js', 'harvest.js']), ('/*@@APP@@*/', ['app.js'])):
    assert page.count(marker) == 1, marker
    page = page.replace(marker, '\n'.join(src(n).strip() for n in names))

split = page.index('<header class="mast">')
head_part, body_part = page[:split].strip(), page[split:].strip()

HEAD = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#1b3929">
<meta name="color-scheme" content="light dark">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Plant Book">
<link rel="manifest" href="manifest.json">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-v3-32.png">
<link rel="apple-touch-icon" href="apple-touch-icon-v3.png">
<script>window.__STANDALONE_SITE__ = true; window.__BUILD__ = '%s';</script>
<style>:root{color-scheme:light;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}html{scroll-padding-top:env(safe-area-inset-top,0px)}body{margin:0;padding:0;font:14px -apple-system,BlinkMacSystemFont,sans-serif;background:#1b3929;color:#000}img{max-width:100%%}[hidden]:not([hidden=until-found i]){display:none!important}</style>
""" % BUILD

site = os.path.join(ROOT, 'site')
with open(os.path.join(site, 'index.html'), 'w', encoding='utf-8') as fh:
    fh.write(HEAD + head_part + '\n</head>\n<body>\n' + body_part + '\n</body>\n</html>\n')
with open(os.path.join(site, 'sw.js'), 'w', encoding='utf-8') as fh:
    fh.write(src('sw.js').replace('@@BUILD@@', BUILD))

if '--artifact' in sys.argv:
    os.makedirs(os.path.join(ROOT, 'artifact'), exist_ok=True)
    with open(os.path.join(ROOT, 'artifact', 'plant-book.html'), 'w', encoding='utf-8') as fh:
        fh.write(page.replace("/* Swan's Island Plant Book: the app.", "window.__BUILD__ = '%s';\n/* Swan's Island Plant Book: the app." % BUILD, 1))

print('built', BUILD, '(%d KB)' % (len(page.encode('utf-8')) // 1024))
