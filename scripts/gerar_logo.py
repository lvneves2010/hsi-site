# Draws the HSI logo as a clean vector (SVG), based on the original business-card logo:
# a red sphere sliced like an orange (a curved top-left slice and a curved swoosh), plus "HSI".
# Usage (from hsi-site/):
#   python scripts/gerar_logo.py                  ->  public/logo-hsi.svg (variant VARIANT)
#   python scripts/gerar_logo.py --variants DIR   ->  DIR/logo-<variant>.svg for every variant (to compare)
import math
import sys
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parents[1]
RED = '#c8102e'
R = 100.0  # sphere radius; the sphere is centered at (0, 0)

# Swoosh: the upper piece is the sphere inside circle A, the lower piece is the sphere outside
# circle B. Both centers sit up-left of the sphere, so the swoosh bows downward like the original.
# B is shifted along the swoosh so the gap is thin at the lower left and opens to the right.
TILT = math.radians(33)  # swoosh slope (rises to the right)
NORMAL = (-math.sin(TILT), -math.cos(TILT))  # points up-left
ALONG = (math.cos(TILT), -math.sin(TILT))  # points along the swoosh, to the right
D = 170.0
CA = (NORMAL[0] * D, NORMAL[1] * D)
RA = D + 12.0
# B (lower edge of the swoosh) per variant: (shift along the swoosh, RB - RA).
# With "HSI" inside the sphere the opening on the right must be wider.
SWOOSH = {
    'card': (10.0, 24.0),  # gap ~18 left, ~26 middle, ~29 right (as on the card)
    'wide': (20.0, 28.6),  # gap ~17 left, ~27 middle, ~39 right, room for a horizontal "HSI"
}
CB, RB = (0.0, 0.0), 0.0  # set by set_swoosh()
CAP = 13.0  # cap height of "HSI" inside the sphere
MARGIN = 2.5
INK = '#1a1d24'
VARIANT = 'inside'  # the one written to public/logo-hsi.svg
# Top-left slice (as on the card): the upper piece is also cut by an arc parallel to the swoosh
# (center shifted along it), which removes the top-left cap of the sphere. The logo then reads as
# two curved slices, like an orange cut into segments. The arc meets the sphere at about -172 deg
# (left) and -88 deg (top), measured on the card.
CUT_SHIFT = -21.0
CC = (CA[0] + ALONG[0] * CUT_SHIFT, CA[1] + ALONG[1] * CUT_SHIFT)
RC = 118.0


def set_swoosh(kind):
    global CB, RB
    shift, dr = SWOOSH[kind]
    CB = (CA[0] + ALONG[0] * shift, CA[1] + ALONG[1] * shift)
    RB = RA + dr


def lower_y(c, r, x):
    """y of the lower half of circle (c, r) at x."""
    return c[1] + math.sqrt(r * r - (x - c[0]) ** 2)


def circle_intersections(c1, r1, c2, r2):
    dx, dy = c2[0] - c1[0], c2[1] - c1[1]
    d = math.hypot(dx, dy)
    a = (r1 * r1 - r2 * r2 + d * d) / (2 * d)
    h = math.sqrt(r1 * r1 - a * a)
    mx, my = c1[0] + a * dx / d, c1[1] + a * dy / d
    return [(mx + h * dy / d, my - h * dx / d), (mx - h * dy / d, my + h * dx / d)]


def arc_to(c, r, p, q, via):
    """SVG arc command from p to q on circle (c, r), going through the point `via`."""
    ang = lambda pt: math.atan2(pt[1] - c[1], pt[0] - c[0])
    a0, a1, am = ang(p), ang(q), ang(via)
    ccw = lambda a, b: (b - a) % (2 * math.pi)  # angle from a to b, increasing angle (clockwise on screen)
    sweep = 1 if ccw(a0, am) < ccw(a0, a1) else 0
    span = ccw(a0, a1) if sweep else ccw(a1, a0)
    large = 1 if span > math.pi else 0
    return f'A{r:.2f} {r:.2f} 0 {large} {sweep} {q[0]:.2f} {q[1]:.2f}'


def piece(c, r, keep_inside):
    """Sphere ∩ disk(c, r) (keep_inside) or sphere minus disk(c, r)."""
    p, q = circle_intersections((0, 0), R, c, r)
    # the sphere arc lies inside disk(c, r) on the side facing c
    toward = math.atan2(c[1], c[0])
    sphere_mid = (R * math.cos(toward), R * math.sin(toward))
    if not keep_inside:
        sphere_mid = (-sphere_mid[0], -sphere_mid[1])
    # the cut arc lies inside the sphere, on the side of circle c facing the sphere center
    away = math.atan2(-c[1], -c[0])
    cut_mid = (c[0] + r * math.cos(away), c[1] + r * math.sin(away))
    return f'M{p[0]:.2f} {p[1]:.2f} ' + arc_to((0, 0), R, p, q, sphere_mid) + ' ' + arc_to(c, r, q, p, cut_mid) + 'Z'


def upper_piece(cc=None, rc=None):
    """Sphere ∩ disk A, minus disk C (the top-left slice)."""
    cc, rc = cc or CC, rc or RC
    ang = lambda pt: math.atan2(pt[1], pt[0])
    on_sphere = lambda a: (R * math.cos(a), R * math.sin(a))
    a_left, a_right = sorted(circle_intersections((0, 0), R, CA, RA), key=lambda pt: pt[0])
    c_left, c_top = sorted(circle_intersections((0, 0), R, cc, rc), key=lambda pt: pt[0])
    toward = lambda c, r: (c[0] + r * -c[0] / math.hypot(*c), c[1] + r * -c[1] / math.hypot(*c))  # point of the circle facing the sphere center
    # sphere arcs: top cut end -> right end of A (short way), left end of A -> left cut end (through 180 deg)
    mid_tr = on_sphere((ang(c_top) + ang(a_right)) / 2)
    a_l = ang(a_left) % (2 * math.pi)
    c_l = ang(c_left) % (2 * math.pi)
    mid_l = on_sphere((a_l + c_l) / 2)
    return (
        f'M{c_top[0]:.2f} {c_top[1]:.2f} '
        + arc_to((0, 0), R, c_top, a_right, mid_tr) + ' '
        + arc_to(CA, RA, a_right, a_left, toward(CA, RA)) + ' '
        + arc_to((0, 0), R, a_left, c_left, mid_l) + ' '
        + arc_to(cc, rc, c_left, c_top, toward(cc, rc))
        + 'Z'
    )


_fonts = {}


def _font(weight):
    if weight not in _fonts:
        woff = ROOT / 'node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'
        _fonts[weight] = instantiateVariableFont(TTFont(woff), {'wght': weight})
    return _fonts[weight]


def text_width(text, height, weight=700):
    font = _font(weight)
    glyphs, cmap = font.getGlyphSet(), font.getBestCmap()
    return sum(glyphs[cmap[ord(ch)]].width for ch in text) * height / font['OS/2'].sCapHeight


def text_path(text, height, origin, tangent=(1, 0), up=(0, -1), weight=700):
    """Outline of `text` in Inter (given weight) with cap height `height`, baseline starting at
    `origin`, running along the unit vector `tangent`, with glyph "up" along the unit vector `up`."""
    font = _font(weight)
    glyphs, cmap = font.getGlyphSet(), font.getBestCmap()
    s = height / font['OS/2'].sCapHeight
    out, advance = [], 0.0
    for ch in text:
        g = glyphs[cmap[ord(ch)]]
        pen = SVGPathPen(glyphs)
        ox = origin[0] + tangent[0] * advance
        oy = origin[1] + tangent[1] * advance
        g.draw(TransformPen(pen, (s * tangent[0], s * tangent[1], s * up[0], s * up[1], ox, oy)))
        out.append(pen.getCommands())
        advance += g.width * s
    return ' '.join(out)


def place_label():
    """Put "HSI" horizontally (as on the card) in the opening of the swoosh, as far right as it fits."""
    width = CAP * 2.3  # approximate advance of "HSI" in Inter Bold
    for xr10 in range(990, 0, -5):
        xr = xr10 / 10
        xl = xr - width
        base = lower_y(CB, RB, xr) - MARGIN  # lower edge of the gap rises to the right: tightest at xr
        top = base - CAP
        if top < lower_y(CA, RA, xl) + MARGIN:  # upper edge of the gap is lowest at xl
            continue
        if any(math.hypot(x, y) > R - MARGIN for x in (xl, xr) for y in (top, base)):
            continue
        return text_path('HSI', CAP, (xl, base), (1, 0), (0, -1))
    raise SystemExit('label does not fit')


def neg_label(where, weight, tracking, scale, margin=7.0):
    """Horizontal "HSI" inside the lower slice (sphere outside disk B), keeping `margin` from its edges.
    Always horizontally centered. where='low': the vertical position where it can be biggest;
    'mid': vertically centered between the swoosh and the bottom of the sphere."""
    font = _font(weight)
    glyphs, cmap = font.getGlyphSet(), font.getBestCmap()
    capu = font['OS/2'].sCapHeight
    adv = [glyphs[cmap[ord(ch)]].width / capu for ch in 'HSI']  # advances per unit of cap height
    width_per_cap = sum(adv) + tracking * 2

    def fits(cap, cx, cy):
        w = width_per_cap * cap
        pts = [(cx + dx, cy + dy) for dx in (-w / 2, 0, w / 2) for dy in (-cap / 2, cap / 2)]
        return all(math.hypot(*p) <= R - margin and math.dist(p, CB) >= RB + margin for p in pts)

    def biggest(cx, cy):
        lo, hi = 0.0, 80.0
        for _ in range(30):
            mid = (lo + hi) / 2
            lo, hi = (mid, hi) if fits(mid, cx, cy) else (lo, mid)
        return lo

    if where == 'mid':
        cy = (lower_y(CB, RB, 0.0) + R) / 2
        best = (biggest(0.0, cy), 0.0, cy)
    else:
        best = max((biggest(0.0, cy2 / 2), 0.0, cy2 / 2) for cy2 in range(0, 200))
    cap, cx, cy = best
    cap *= scale
    s = cap / capu
    x = cx - width_per_cap * cap / 2
    base = cy + cap / 2
    out = []
    for ch, a in zip('HSI', adv):
        pen = SVGPathPen(glyphs)
        glyphs[cmap[ord(ch)]].draw(TransformPen(pen, (s, 0, 0, -s, x, base)))
        out.append(pen.getCommands())
        x += (a + tracking) * cap
    print(f'  neg {where}: cap {cap:.1f} at ({cx:.1f}, {cy:.1f})')
    return ' '.join(out)


def svg(view, paths, extra=''):
    """paths: list of (d, fill)."""
    x0, y0, x1, y1 = view
    body = ''.join(f'<path fill="{fill}" d="{d}"/>' for d, fill in paths) + extra
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0:.1f} {y0:.1f} {x1 - x0:.1f} {y1 - y0:.1f}" '
        f'role="img" aria-label="HSI">{body}</svg>\n'
    )


def build(variant):
    """Return the SVG of one variant."""
    set_swoosh('wide' if variant == 'inside' else 'card')
    mark = [(upper_piece(), RED), (piece(CB, RB, keep_inside=False), RED)]
    pad = 2
    if variant == 'inside':  # "HSI" in the swoosh opening, inside the sphere
        return svg((-R - pad, -R - pad, R + pad, R + pad), mark + [(place_label(), RED)])
    if variant.startswith('neg-'):  # "HSI" knocked out (negative) of the lower slice, horizontal
        # (horizontal position: 'center' or 'best', weight, tracking in caps, size relative to the largest that fits)
        # (vertical placement: 'low' = as big as fits, 'mid' = middle of the slice height; weight, tracking, scale, margin)
        where, weight, tracking, scale, margin = {
            'neg-a': ('low', 800, 0.04, 1.0, 7.0),  # centered, as big as fits
            'neg-b': ('low', 800, 0.04, 1.0, 4.0),  # bigger, closer to the edge
            'neg-c': ('low', 900, 0.14, 1.0, 7.0),  # heavier, a bit apart
            'neg-d': ('low', 700, 0.32, 0.72, 7.0),  # smaller, widely spaced
        }[variant]
        lower = piece(CB, RB, keep_inside=False)
        label = neg_label(where, weight, tracking, scale, margin)
        # even-odd fill turns the letters into holes in the lower slice
        body = f'<path fill="{RED}" d="{upper_piece()}"/><path fill="{RED}" fill-rule="evenodd" d="{lower} {label}"/>'
        return svg((-R - pad, -R - pad, R + pad, R + pad), [], body)
    if variant == 'mark':  # sphere only (favicon, app footers)
        return svg((-R - pad, -R - pad, R + pad, R + pad), mark)
    if variant == 'side':  # big "HSI" to the right of the sphere
        cap = 64.0
        x = R + 30
        w = text_width('HSI', cap)
        return svg((-R - pad, -R - pad, x + w + pad, R + pad), mark + [(text_path('HSI', cap, (x, cap / 2)), RED)])
    if variant == 'exit':  # "HSI" just outside the sphere, where the swoosh leaves it
        a_right = max(circle_intersections((0, 0), R, CA, RA), key=lambda p: p[0])
        b_right = max(circle_intersections((0, 0), R, CB, RB), key=lambda p: p[0])
        y_mid = (a_right[1] + b_right[1]) / 2
        cap = 30.0
        x = math.sqrt(R * R - y_mid * y_mid) + 10
        w = text_width('HSI', cap)
        return svg((-R - pad, -R - pad, x + w + pad, R + pad), mark + [(text_path('HSI', cap, (x, y_mid + cap / 2)), RED)])
    if variant == 'below':  # "HSI" centered under the sphere
        cap = 44.0
        w = text_width('HSI', cap)
        base = R + 22 + cap
        return svg((-R - pad, -R - pad, R + pad, base + pad), mark + [(text_path('HSI', cap, (-w / 2, base)), RED)])
    if variant == 'lockup':  # sphere + "HSI" + company name (header)
        cap, cap2 = 70.0, 15.5
        x = R + 30
        name = 'Help Soluções em Informática'
        w = max(text_width('HSI', cap), text_width(name, cap2, 500))
        return svg(
            (-R - pad, -R - pad, x + w + pad, R + pad),
            mark + [(text_path('HSI', cap, (x, 18)), RED), (text_path(name, cap2, (x, 18 + 22 + cap2), weight=500), INK)],
        )
    raise SystemExit(f'unknown variant {variant}')


VARIANTS = ['neg-a', 'neg-b', 'neg-c', 'neg-d', 'inside', 'mark', 'side', 'exit', 'below', 'lockup']


def main():
    if len(sys.argv) == 3 and sys.argv[1] == '--variants':
        out = Path(sys.argv[2])
        out.mkdir(parents=True, exist_ok=True)
        for v in VARIANTS:
            (out / f'logo-{v}.svg').write_text(build(v), encoding='utf-8')
        print('variants written to', out)
        return
    (ROOT / 'public/logo-hsi.svg').write_text(build(VARIANT), encoding='utf-8')
    print('ok', VARIANT)


main()
