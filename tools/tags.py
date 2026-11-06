#!/usr/bin/env python3
"""Write site/tags.html: a printable sheet of QR tags, one per yPod seat on both towers.

Each code opens that seat in the Plant Book (…/#seat-S9R), so a tag on the Column shows whatever
is planted there now. Seats never move, so the sheet only needs regenerating if the app's address
changes.  Needs segno:  pip install segno   then   python3 tools/tags.py"""
import os
import segno

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://hectrvictorious.github.io/Gardyn-Plant-Book/'
COL = {'L': 'left', 'C': 'center', 'R': 'right'}
TOWER = {'S': 'Salad tower', 'F': 'Fruiting tower'}


def tag(slot):
    t, r, c = slot[0], int(slot[1:-1]), slot[-1]
    svg = segno.make(SITE + '#seat-' + slot, error='m').svg_inline(scale=1, dark='#142019', light='#ffffff', border=2, omitsize=True)
    face = '►' if r % 2 else '◄'
    return (f'<figure class="tag"><div class="qr">{svg}</div><figcaption><span class="tw">{TOWER[t]}</span>'
            f'<b>Row {r} · {COL[c]}</b><span class="fc">faces {face}</span></figcaption></figure>')


def sheet(t):
    tags = ''.join(tag(f'{t}{r}{c}') for r in range(1, 11) for c in 'LCR')
    return f'<section><h2>{TOWER[t]}</h2><div class="grid">{tags}</div></section>'


PAGE = """<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>yPod Tags</title>
<link rel="icon" type="image/png" sizes="32x32" href="favicon-v3-32.png">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@500;600;700&family=Literata:opsz,wght@7..72,400&display=swap">
<style>
:root { --ink: #142019; --ink-2: #3c4d42; --muted: #66786d; --line: #cdd8cd; --band: #1b3929; --bg: #edf1ec; --surface: #fbfcfa; --accent: #a3205a; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--ink); font: 15px/1.5 Literata, Georgia, serif; }
.wrap { max-width: 7.5in; margin: 0 auto; padding-block: 20px 40px; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); }
h1, h2, b, .tw, .fc, button { font-family: "Barlow Semi Condensed", "Arial Narrow", sans-serif; }
h1 { font-size: 30px; margin: 0 0 4px; }
h2 { font-size: 18px; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); margin: 22px 0 8px; }
p { margin: 0 0 8px; color: var(--ink-2); max-width: 62ch; }
button { font-size: 16px; font-weight: 600; padding: 9px 16px; border-radius: 10px; border: 0; background: var(--accent); color: #fff; cursor: pointer; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(1.35in, 1fr)); gap: 8px; }
.tag { margin: 0; background: #fff; border: 1px dashed #b9c6b9; border-radius: 10px; padding: 8px 8px 7px; display: grid; justify-items: center; gap: 3px; break-inside: avoid; page-break-inside: avoid; }
.tag .qr svg { width: 1.05in; height: 1.05in; display: block; }
figcaption { display: grid; justify-items: center; line-height: 1.1; text-align: center; }
.tw { font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); font-weight: 600; }
.tag b { font-size: 15px; color: var(--ink); }
.fc { font-size: 11px; color: var(--muted); }
@media print { body { background: #fff; } .wrap { padding: 0; max-width: none; } .noprint { display: none; } h2 { margin-top: 0; } section { break-after: page; } .grid { grid-template-columns: repeat(5, 1fr); } }
@page { margin: 0.4in; }
</style></head><body><div class="wrap">
<div class="noprint"><h1>yPod tags</h1>
<p>One code per seat on each tower. Scan one with your phone and the Plant Book opens on that seat, showing whatever is planted there now, so the tags never need reprinting when plants change.</p>
<p>Print on sticker paper or card stock, cut on the dashed lines, and fix each tag to the Column beside its yPod. Each tower prints on its own page.</p>
<p><button onclick="window.print()">Print</button></p></div>
%s
</div></body></html>
"""

out = PAGE % (sheet('S') + sheet('F'))
with open(os.path.join(ROOT, 'site', 'tags.html'), 'w', encoding='utf-8') as f:
    f.write(out)
print('wrote site/tags.html (%d KB)' % (len(out) // 1024))
