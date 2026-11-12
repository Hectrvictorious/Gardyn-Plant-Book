#!/usr/bin/env python3
"""Add or swap a plant's reference photo.

  python3 tools/photo.py <plant-id> "File:Some photo.jpg"            a Wikimedia Commons file (credit fetched)
  python3 tools/photo.py <plant-id> <image-url> --by NAME --lic "CC BY 2.0" --licurl URL --page URL --title TEXT
                                                                       anything else, with its credit typed in
  options: --fx 0.5 --fy 0.5 (where to center the 4:3 crop, as fractions) --stand "green leaf celery, ..."
           --tag "Ready to pick" (the photo's label; default by plant group)

Writes site/img/<id>.webp (4:3, up to 1024 wide, kept near 140 KB), site/img/t/<id>.webp (160 square) and the
credit in src/photos.json, with a new version so phones fetch the new file. Use only freely licensed photos
(Creative Commons or public domain), and rebuild afterwards (tools/build.py). Needs Pillow."""
import argparse, hashlib, html, io, json, os, re, urllib.parse, urllib.request
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = 'SwansIslandPlantBook/1.0 (personal garden app; https://github.com/Hectrvictorious/Gardyn-Plant-Book)'

def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=60).read()

def strip(s):
    s = html.unescape(re.sub(r'<[^>]+>', ' ', s or '')); return re.sub(r'\s+', ' ', s).strip(' .,')

def commons(title):
    title = re.sub(r'^https?://commons\.wikimedia\.org/wiki/', '', title); title = urllib.parse.unquote(title).replace('_', ' ')
    if not title.startswith('File:'): title = 'File:' + title
    q = {'action': 'query', 'format': 'json', 'titles': title, 'prop': 'imageinfo', 'iiprop': 'url|size|extmetadata', 'iiurlwidth': 1280}
    pg = next(iter(json.loads(get('https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(q)))['query']['pages'].values()))
    ii = pg['imageinfo'][0]; m = ii.get('extmetadata', {})
    url = ii['thumburl'] if ii.get('width', 0) > 1280 else ii['url']
    return url, {'by': strip(m.get('Artist', {}).get('value'))[:60] or 'Unknown', 'at': 'Wikimedia Commons',
                 'lic': strip(m.get('LicenseShortName', {}).get('value')).replace(' us', ' US'),
                 'licurl': re.sub(r'^(https?:)?//', 'https://', strip(m.get('LicenseUrl', {}).get('value'))),
                 'page': ii['descriptionurl'], 'title': re.sub(r'\.(jpe?g|png|webp)$', '', title[5:], flags=re.I)}

def crop(im, ratio, fx, fy):
    W, H = im.size
    cw, ch = (round(H * ratio), H) if W / H > ratio else (W, round(W / ratio))
    x = min(max(0, round(fx * W - cw / 2)), W - cw); y = min(max(0, round(fy * H - ch / 2)), H - ch)
    return im.crop((x, y, x + cw, y + ch))

def main():
    a = argparse.ArgumentParser(); a.add_argument('pid'); a.add_argument('source')
    for k in ('by', 'lic', 'licurl', 'page', 'title', 'stand', 'tag'): a.add_argument('--' + k)
    a.add_argument('--fx', type=float, default=.5); a.add_argument('--fy', type=float, default=.5)
    o = a.parse_args()
    if o.source.startswith('File:') or 'commons.wikimedia.org/wiki/' in o.source:
        url, rec = commons(o.source)
    else:
        if not (o.by and o.lic and o.page): raise SystemExit('Give --by, --lic and --page for a photo outside Commons.')
        url, rec = o.source, {'by': o.by, 'at': 'Flickr' if 'flickr' in (o.page or '') else 'the web', 'lic': o.lic, 'licurl': o.licurl or '', 'page': o.page, 'title': o.title or ''}
    im = ImageOps.exif_transpose(Image.open(io.BytesIO(get(url)))).convert('RGB')
    big = crop(im, 4 / 3, o.fx, o.fy); base = big = big.resize((1024, 768), Image.LANCZOS) if big.width > 1024 else big
    q = 66
    while True:
        b1 = io.BytesIO(); big.save(b1, 'WEBP', quality=q, method=6)
        if len(b1.getvalue()) <= 140 * 1024: break
        if q > 51: q -= 5; continue
        if big.width <= 760: break
        big = base.resize((round(big.width * .88), round(big.height * .88)), Image.LANCZOS); q = 60
    b2 = io.BytesIO(); crop(im, 1, o.fx, o.fy).resize((160, 160), Image.LANCZOS).save(b2, 'WEBP', quality=72, method=6)
    os.makedirs(os.path.join(ROOT, 'site', 'img', 't'), exist_ok=True)
    open(os.path.join(ROOT, 'site', 'img', o.pid + '.webp'), 'wb').write(b1.getvalue())
    open(os.path.join(ROOT, 'site', 'img', 't', o.pid + '.webp'), 'wb').write(b2.getvalue())
    rec['v'] = hashlib.sha1(b1.getvalue() + b2.getvalue()).hexdigest()[:8]
    for k in ('stand', 'tag'):
        if getattr(o, k): rec[k] = getattr(o, k)
    pj = os.path.join(ROOT, 'src', 'photos.json'); photos = json.load(open(pj, encoding='utf-8')) if os.path.exists(pj) else {}
    photos[o.pid] = dict(sorted(rec.items())); json.dump(dict(sorted(photos.items())), open(pj, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(o.pid, '%dx%d' % big.size, '%.0f KB' % (len(b1.getvalue()) / 1024), '·', rec['by'], '·', rec['lic'], '\nNow run: python3 tools/build.py')

if __name__ == '__main__':
    main()
