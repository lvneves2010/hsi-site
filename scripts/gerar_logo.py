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


def cap_label(gap, spacing, edge, xscale=0.82, weight=800, spread=None, cc=None, rc=None, uniform=False):
    """Stylized "HSI" filling the top-left slice. Glyphs follow arc C (parallel to the slices) with their
    tops toward the outside of the sphere, centered where the slice is thickest. Each letter is as tall as
    the slice allows where it sits (so the middle "S" is the biggest), keeping `gap` from the upper piece
    and `edge` from the sphere outline. Glyphs are condensed by `xscale`."""
    font = _font(weight)
    glyphs, cmap = font.getGlyphSet(), font.getBestCmap()
    capu = font['OS/2'].sCapHeight
    CC_, RC_ = cc or CC, rc or RC
    phi0 = math.atan2(-CC_[1], -CC_[0])  # direction from the cut center to the sphere center: thickest part
    rb = RC_ - gap  # baseline radius around the cut center (glyph tops point to it)
    c_left, c_top = sorted(circle_intersections((0, 0), R, CC_, RC_), key=lambda pt: pt[0])
    ang = lambda pt: math.atan2(pt[1] - CC_[1], pt[0] - CC_[0])
    span = ang(c_left) - ang(c_top)

    def place(caps):
        widths = [glyphs[cmap[ord(ch)]].width * c / capu * xscale for ch, c in zip('HSI', caps)]
        gaps = spacing * sum(caps) / 3 * 2
        if spread:  # spread the letters over a fraction of the slice
            gaps = max(gaps, span * spread * rb - sum(widths))
        total = sum(widths) + gaps
        phi = phi0 + total / rb / 2  # reading direction decreases phi (from lower left to top)
        out = []
        for ch, w, cap in zip('HSI', widths, caps):
            pc = phi - (w / 2) / rb
            tangent = (math.sin(pc), -math.cos(pc))
            up = (-math.cos(pc), -math.sin(pc))
            mid = (CC_[0] + rb * math.cos(pc), CC_[1] + rb * math.sin(pc))
            origin = (mid[0] - tangent[0] * w / 2, mid[1] - tangent[1] * w / 2)
            sx, sy = cap / capu * xscale, cap / capu
            corners = [(origin[0] + tangent[0] * gx + up[0] * gy, origin[1] + tangent[1] * gx + up[1] * gy)
                       for gx in (0, w / 2, w) for gy in (0, cap)]
            out.append((ch, origin, tangent, up, sx, sy, corners))
            phi -= (w + gaps / 2) / rb
        return out

    ok = lambda c: math.hypot(*c) <= R - edge and math.dist(c, CC_) <= RC_ - gap + 0.5
    caps = [60.0, 60.0, 60.0]
    for _ in range(400):  # shrink each letter until all of them fit; repeat since positions depend on sizes
        laid = place(caps)
        bad = [i for i, g in enumerate(laid) if not all(ok(c) for c in g[6])]
        if not bad:
            break
        for i in bad:
            caps[i] -= 0.5
    else:
        raise SystemExit('cap label does not fit')
    if uniform:  # same size for every letter (the smallest one fits everywhere)
        caps = [min(caps)] * 3
        laid = place(caps)
    paths = []
    for ch, origin, tangent, up, sx, sy, _ in laid:
        pen = SVGPathPen(glyphs)
        glyphs[cmap[ord(ch)]].draw(TransformPen(pen, (sx * tangent[0], sx * tangent[1], sy * up[0], sy * up[1], *origin)))
        paths.append(pen.getCommands())
    return ' '.join(paths), caps


def clipped_cap_label(gap, cap, fill, xscale=0.9, weight=800):
    """Big "HSI" along arc C, spread over `fill` of the top-left slice and clipped to the slice
    (sphere ∩ disk(CC, RC - gap)), so the letter edges complete the sphere outline."""
    font = _font(weight)
    glyphs, cmap = font.getGlyphSet(), font.getBestCmap()
    capu = font['OS/2'].sCapHeight
    c_left, c_top = sorted(circle_intersections((0, 0), R, CC, RC), key=lambda pt: pt[0])
    ang = lambda pt: math.atan2(pt[1] - CC[1], pt[0] - CC[0])
    span = ang(c_left) - ang(c_top)  # angular length of the slice seen from CC
    phi0 = (ang(c_left) + ang(c_top)) / 2
    rb = RC - gap
    sx, sy = cap / capu * xscale, cap / capu
    widths = [glyphs[cmap[ord(ch)]].width * sx for ch in 'HSI']
    target = span * fill * rb
    spacing = (target - sum(widths)) / 2
    phi = phi0 + target / rb / 2
    out = []
    for ch, w in zip('HSI', widths):
        pc = phi - (w / 2) / rb
        tangent = (math.sin(pc), -math.cos(pc))
        up = (-math.cos(pc), -math.sin(pc))
        mid = (CC[0] + rb * math.cos(pc), CC[1] + rb * math.sin(pc))
        origin = (mid[0] - tangent[0] * w / 2, mid[1] - tangent[1] * w / 2)
        pen = SVGPathPen(glyphs)
        glyphs[cmap[ord(ch)]].draw(TransformPen(pen, (sx * tangent[0], sx * tangent[1], sy * up[0], sy * up[1], *origin)))
        out.append(pen.getCommands())
        phi -= (w + spacing) / rb
    return ' '.join(out), rb


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
    if variant.startswith('cap-'):  # stylized "HSI" filling the top-left slice
        # (extra depth of the top cut, gap to the upper piece, edge margin, x condensing, letter spacing, weight, uniform size)
        depth, gap, edge, xscale, spacing, weight, uniform = {
            'cap-a': (0, 6.0, 2.0, 0.72, 0.06, 800, False),  # card cut, middle "S" bigger
            'cap-b': (0, 6.0, 2.0, 0.78, 0.10, 800, True),  # card cut, same size
            'cap-c': (10, 7.0, 2.0, 0.78, 0.06, 800, False),  # deeper cut, middle "S" bigger
            'cap-d': (10, 7.0, 2.0, 0.82, 0.12, 800, True),  # deeper cut, same size
            'cap-e': (16, 8.0, 2.0, 0.90, 0.22, 900, True),  # deepest cut, heavy letters a bit apart
        }[variant]
        rc = RC + depth
        mark = [(upper_piece(CC, rc), RED), (piece(CB, RB, keep_inside=False), RED)]
        label, caps = cap_label(gap, spacing, edge, xscale, weight, None, CC, rc, uniform)
        print(f'  {variant}: cap heights', [round(c, 1) for c in caps])
        return svg((-R - pad, -R - pad, R + pad, R + pad), mark + [(label, RED)])
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


VARIANTS = ['cap-a', 'cap-b', 'cap-c', 'cap-d', 'cap-e', 'inside', 'mark', 'side', 'exit', 'below', 'lockup']


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
