# Generates the site images.
# Usage (from hsi-site/): python scripts/gerar_logo.py && python scripts/gerar_imagens.py
#  - logo PNGs (favicon, apple-touch-icon, 512px for JSON-LD) rendered from public/logo-hsi.svg with Edge headless
#  - app icons from the sibling app repos
#  - photos (Wikimedia Commons, CC0 / public domain; see public/img/services/CREDITS.md), downloaded once to scripts/.cache
#  - social previews og-image.jpg (PT) and og-image-en.jpg (EN)
import subprocess
import tempfile
import time
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
HSI = ROOT.parent
OUT = ROOT / 'public'
IMG = OUT / 'img'
CACHE = ROOT / 'scripts/.cache'
EDGE = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
RED = (200, 16, 46)
INK = (26, 29, 36)
FONT_BOLD = 'C:/Windows/Fonts/segoeuib.ttf'
FONT = 'C:/Windows/Fonts/segoeui.ttf'

APPS = {
    'planevento': HSI / 'planevento/assets/icone_playstore_512.png',
    'marcador-de-jogos': HSI / 'marcador-jogos/store/icone_playstore_512.png',
    'kira': HSI / 'kira/store/icone_playstore_512.png',
    'my-spot': HSI / 'my-spot/store/icone_playstore_512.png',
}

# Wikimedia Commons files (CC0), downloaded through Special:FilePath.
COMMONS = {
    'hero': 'Working in open office space (Unsplash).jpg',
    'code': 'Colorful code (Unsplash).jpg',
    'web': 'Typing on a mac (Unsplash).jpg',
    'mobile': 'Samsung phones Google play (Unsplash).jpg',
    'consulting': 'Businessman working and writing notes in office (Unsplash).jpg',
    'support': 'Desks in an open office space (Unsplash).jpg',
    'cta': 'Laptops and plants on terrace (Unsplash).jpg',
}
# Public-domain photos already used (and credited) in the portfolio site.
PORTFOLIO = HSI / 'leoneves-site/public/img'
FROM_PORTFOLIO = {'integration': 'skills/erp.webp', 'cloud': 'skills/devops.webp', 'ai': 'skills/ai.webp'}


def commons(key):
    CACHE.mkdir(parents=True, exist_ok=True)
    path = CACHE / f'{key}.jpg'
    if not path.exists():
        url = 'https://commons.wikimedia.org/wiki/Special:FilePath/' + urllib.parse.quote(COMMONS[key]) + '?width=1600'
        req = urllib.request.Request(url, headers={'User-Agent': 'hsi-site-image-fetch/1.0 (static site build script)'})
        path.write_bytes(urllib.request.urlopen(req, timeout=60).read())
        time.sleep(3)  # be gentle with the Commons rate limit
    return Image.open(path).convert('RGB')


def cover(im, w, h):
    return ImageOps.fit(im, (w, h), Image.LANCZOS, centering=(0.5, 0.5))


def render_svg(svg, size, out):
    """Render the SVG to a transparent PNG with Edge headless."""
    with tempfile.TemporaryDirectory() as tmp:
        html = Path(tmp) / 'r.html'
        html.write_text(
            f'<html><body style="margin:0;background:transparent"><img src="{svg.as_uri()}" width="{size}" height="{size}"></body></html>',
            encoding='utf-8',
        )
        shot = Path(tmp) / 'r.png'
        subprocess.run(
            [EDGE, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
             '--default-background-color=00000000', f'--window-size={size},{size}', f'--screenshot={shot}', html.as_uri()],
            check=True, capture_output=True,
        )
        Image.open(shot).convert('RGBA').crop((0, 0, size, size)).save(out, optimize=True)


def main():
    IMG.mkdir(parents=True, exist_ok=True)
    svg = OUT / 'logo-hsi.svg'

    # Logo rasters
    render_svg(svg, 512, IMG / 'logo-hsi-512.png')
    logo = Image.open(IMG / 'logo-hsi-512.png').convert('RGBA')
    logo.resize((48, 48), Image.LANCZOS).save(OUT / 'favicon.png', optimize=True)
    touch = Image.new('RGBA', (180, 180), 'white')  # iOS ignores transparency
    touch.alpha_composite(logo.resize((148, 148), Image.LANCZOS), (16, 16))
    touch.convert('RGB').save(OUT / 'apple-touch-icon.png', optimize=True)

    # App icons
    (IMG / 'apps').mkdir(exist_ok=True)
    for slug, src in APPS.items():
        icon = Image.open(src).convert('RGBA')
        icon.resize((256, 256), Image.LANCZOS).save(IMG / 'apps' / f'{slug}.webp', quality=88)
        flat = Image.new('RGBA', (512, 512), 'white')
        flat.alpha_composite(icon.resize((512, 512), Image.LANCZOS))
        flat.convert('RGB').save(IMG / 'apps' / f'{slug}-512.png', optimize=True)

    # Photos
    (IMG / 'services').mkdir(exist_ok=True)
    for key in ['code', 'web', 'mobile', 'consulting', 'support']:
        cover(commons(key), 640, 360).save(IMG / 'services' / f'{key}.webp', quality=78)
    for key, rel in FROM_PORTFOLIO.items():
        cover(Image.open(PORTFOLIO / rel).convert('RGB'), 640, 360).save(IMG / 'services' / f'{key}.webp', quality=78)
    hero = commons('hero')
    cover(hero, 1040, 780).save(IMG / 'hero-1040.webp', quality=78)
    cover(hero, 640, 480).save(IMG / 'hero-640.webp', quality=78)
    cover(commons('cta'), 1600, 640).save(IMG / 'cta.webp', quality=70)
    Image.open(PORTFOLIO / 'leonardo-neves-440.webp').save(IMG / 'leonardo-neves-440.webp', quality=85)

    # Social previews (1200x630)
    for name, line in {'og-image.jpg': 'Software, sites e apps · desde 2018', 'og-image-en.jpg': 'Software, websites and apps · since 2018'}.items():
        og = Image.new('RGB', (1200, 630), 'white')
        d = ImageDraw.Draw(og)
        d.rectangle((0, 606, 1200, 630), fill=RED)
        mark = logo.resize((330, 330), Image.LANCZOS)
        og.paste(mark, (80, 140), mark)
        d.text((470, 200), 'Help Soluções', font=ImageFont.truetype(FONT_BOLD, 76), fill=INK)
        d.text((470, 292), 'em Informática', font=ImageFont.truetype(FONT_BOLD, 76), fill=INK)
        d.text((472, 400), line, font=ImageFont.truetype(FONT, 38), fill=RED)
        og.save(IMG / name, quality=88)
    print('ok')


main()
