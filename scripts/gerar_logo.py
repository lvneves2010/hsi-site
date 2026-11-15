# Draws the HSI logo as a clean vector (SVG), based on the original business-card logo:
# a red sphere split by a curved white swoosh into a large upper piece and a lower crescent,
# with "HSI" in the opening of the swoosh on the right.
# Usage (from hsi-site/): python scripts/gerar_logo.py  ->  public/logo-hsi.svg
import math
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
SHIFT = 10.0
CB = (CA[0] + ALONG[0] * SHIFT, CA[1] + ALONG[1] * SHIFT)
RB = RA + 24.0  # gap: ~18 at the left end, ~26 in the middle, ~29 at the right end (as on the card)
CAP = 14.0  # cap height of "HSI"
MARGIN = 2.5


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


def text_path(text, height, origin, tangent, up):
    """Outline of `text` in Inter Bold with cap height `height`, baseline starting at `origin`,
    running along the unit vector `tangent`, with glyph "up" along the unit vector `up`."""
    woff = ROOT / 'node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'
    font = instantiateVariableFont(TTFont(woff), {'wght': 700})
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
    """Put "HSI" along the swoosh, as far right as it fits inside the opening and the sphere."""
    width = CAP * 2.25  # approximate advance of "HSI" in Inter Bold
    inside = lambda p: (
        math.dist(p, CA) >= RA + MARGIN and math.dist(p, CB) <= RB - MARGIN and math.hypot(*p) <= R - MARGIN
    )
    # walk along circle A from its right end (angles decrease towards the right/up side)
    for i in range(0, 3000):
        ang = math.radians(90 - i * 0.05)
        n = (math.cos(ang), math.sin(ang))  # from CA into the gap
        x = (CA[0] + RA * n[0], CA[1] + RA * n[1])
        if math.hypot(*x) > R:
            continue
        t = (-n[1], n[0])  # tangent pointing right/up along the swoosh
        if t[0] < 0:
            t = (-t[0], -t[1])
        up = (-n[0], -n[1])
        gap = RB - math.dist(x, CB)
        off = (gap - CAP) / 2  # center the text across the gap
        base_r = (x[0] + n[0] * (off + CAP), x[1] + n[1] * (off + CAP))
        base_l = (base_r[0] - t[0] * width, base_r[1] - t[1] * width)
        corners = [base_l, base_r, (base_l[0] + up[0] * CAP, base_l[1] + up[1] * CAP), (base_r[0] + up[0] * CAP, base_r[1] + up[1] * CAP)]
        if all(inside(c) for c in corners):
            return text_path('HSI', CAP, base_l, t, up)
    raise SystemExit('label does not fit')


def main():
    upper = piece(CA, RA, keep_inside=True)
    lower = piece(CB, RB, keep_inside=False)
    label = place_label()
    pad = 2
    vb = f'{-R - pad} {-R - pad} {2 * (R + pad)} {2 * (R + pad)}'
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="HSI">'
        f'<g fill="{RED}"><path d="{upper}"/><path d="{lower}"/><path d="{label}"/></g></svg>\n'
    )
    (ROOT / 'public/logo-hsi.svg').write_text(svg, encoding='utf-8')
    print('ok', len(svg), 'bytes')


main()
