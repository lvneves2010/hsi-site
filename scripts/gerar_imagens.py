# Generates the site images from the HSI logo and the app icons kept in the sibling repos.
# Usage (from hsi-site/): python scripts/gerar_imagens.py
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
HSI = ROOT.parent
OUT = ROOT / 'public'
IMG = OUT / 'img'

LOGO = HSI / 'marcador-jogos/assets/icon/logo_hsi_512.png'
APPS = {
    'planevento': HSI / 'planevento/assets/icone_playstore_512.png',
    'marcador-de-jogos': HSI / 'marcador-jogos/store/icone_playstore_512.png',
    'kira': HSI / 'kira/store/icone_playstore_512.png',
    'my-spot': HSI / 'my-spot/store/icone_playstore_512.png',
}
RED = (178, 24, 30)
FONT_BOLD = 'C:/Windows/Fonts/segoeuib.ttf'
FONT = 'C:/Windows/Fonts/segoeui.ttf'


def resized(im, size):
    return im.resize((size, size), Image.LANCZOS)


def on_white(im):
    bg = Image.new('RGBA', im.size, 'white')
    bg.alpha_composite(im)
    return bg.convert('RGB')


logo = Image.open(LOGO).convert('RGBA')
IMG.mkdir(parents=True, exist_ok=True)
resized(logo, 96).save(IMG / 'logo-hsi-96.webp', quality=90)
resized(logo, 400).save(IMG / 'logo-hsi-400.webp', quality=90)
resized(logo, 512).save(IMG / 'logo-hsi-512.png', optimize=True)  # used by JSON-LD (Organization.logo)
resized(logo, 48).save(OUT / 'favicon.png', optimize=True)
# Apple ignores transparency (renders black), so the touch icon gets a white margin.
touch = Image.new('RGBA', (180, 180), 'white')
touch.alpha_composite(resized(logo, 148), (16, 16))
touch.convert('RGB').save(OUT / 'apple-touch-icon.png', optimize=True)

for slug, src in APPS.items():
    icon = Image.open(src).convert('RGBA')
    resized(icon, 256).save(IMG / 'apps' / f'{slug}.webp', quality=88)
    on_white(resized(icon, 512)).save(IMG / 'apps' / f'{slug}-512.png', optimize=True)

# Social preview (1200x630): logo + company name.
og = Image.new('RGB', (1200, 630), 'white')
d = ImageDraw.Draw(og)
d.rectangle((0, 610, 1200, 630), fill=RED)
og.paste(resized(logo, 300), (90, 150), resized(logo, 300))
d.text((450, 205), 'Help Soluções', font=ImageFont.truetype(FONT_BOLD, 78), fill=(15, 23, 42))
d.text((450, 300), 'em Informática', font=ImageFont.truetype(FONT_BOLD, 78), fill=(15, 23, 42))
d.text((452, 410), 'Apps para Android · HSI', font=ImageFont.truetype(FONT, 40), fill=RED)
og.save(IMG / 'og-image.jpg', quality=88)
print('ok')
