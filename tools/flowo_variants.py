#!/usr/bin/env python3
"""Two more Flowo Instagram post variants (1080x1080), 3x supersampled.

B = soft tonal-spotlight + two-line headline + 3 feature columns
C = bold forest-green base band, product on a green 'shelf'
Reuses the chrome product illustration from /tmp/product.png.
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter

S = 3
W = H = 1080 * S
def s(v): return int(round(v * S))

BG    = (242, 237, 230)
GREEN = (45, 106, 79)
INK   = (43, 41, 36)
WHITE = (245, 247, 244)
MUTED = (132, 126, 114)
TONAL = (232, 237, 231)
CREAM = (242, 237, 230)

PLAYFAIR = "/tmp/fonts/PlayfairDisplay.ttf"
DMSANS   = "/tmp/fonts/DMSans.ttf"

def font(path, size, axes=None):
    f = ImageFont.truetype(path, s(size))
    if axes:
        try: f.set_variation_by_axes(axes)
        except Exception: pass
    return f

_raw = Image.open("/tmp/product.png").convert("RGBA")
_raw = _raw.crop(_raw.getbbox())

def product(target_h, mirror=False):
    p = _raw.transpose(Image.FLIP_LEFT_RIGHT) if mirror else _raw
    th = s(target_h)
    sc = th / p.height
    return p.resize((int(p.width * sc), th), Image.LANCZOS)

def shadow(img, cx, cy, rx, ry, alpha=64, blur=16):
    sh = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=(60, 55, 45, alpha))
    sh = sh.filter(ImageFilter.GaussianBlur(s(blur)))
    img.paste(sh, (0, 0), sh)

def tracked(draw, text, cx, y, fnt, fill, track):
    track = s(track)
    widths = [draw.textlength(c, font=fnt) for c in text]
    total = sum(widths) + track * (len(text) - 1)
    x = cx - total / 2
    for c, wch in zip(text, widths):
        draw.text((x, y), c, font=fnt, fill=fill, anchor="lm")
        x += wch + track

# ============================================================ VARIANT B
def variant_b():
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    # two-line headline, second line in green
    hf = font(PLAYFAIR, 82, [800])
    d.text((W // 2, s(108)), "Splash less.", font=hf, fill=INK, anchor="mm")
    d.text((W // 2, s(186)), "Reach more.", font=hf, fill=GREEN, anchor="mm")

    # soft tonal spotlight circle behind the product
    cx, cy, r = W // 2, s(500), s(272)
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=TONAL)

    p = product(392)
    shadow(img, W // 2, cy + s(196), s(150), s(40))
    img.paste(p, ((W - p.width) // 2, cy - p.height // 2), p)
    d = ImageDraw.Draw(img)

    # 3 feature columns with thin dividers
    feats = [("360°", "Swivel head"), ("Anti-Splash", "Smart aerator"), ("10-Sec", "Tool-free fit")]
    xs = [s(300), s(540), s(780)]
    fy = s(836)
    lf = font(DMSANS, 27, [14, 700])
    sf = font(DMSANS, 18, [14, 500])
    d.line([(s(420), fy - s(6)), (s(420), fy + s(56))], fill=(216, 210, 200), width=s(2))
    d.line([(s(660), fy - s(6)), (s(660), fy + s(56))], fill=(216, 210, 200), width=s(2))
    for xc, (lab, sub) in zip(xs, feats):
        d.ellipse([xc - s(6), fy - s(22), xc + s(6), fy - s(10)], fill=GREEN)
        d.text((xc, fy + s(12)), lab, font=lf, fill=INK, anchor="mm")
        d.text((xc, fy + s(44)), sub, font=sf, fill=MUTED, anchor="mm")

    # footer
    d.text((s(80), s(1004)), "Flowo", font=font(PLAYFAIR, 40, [600]), fill=GREEN, anchor="lm")
    d.text((W - s(80), s(1004)), "$24.99", font=font(DMSANS, 40, [14, 700]), fill=GREEN, anchor="rm")
    img.resize((1080, 1080), Image.LANCZOS).save("/home/user/website-builder/assets/flowo-instagram-b.png")

# ============================================================ VARIANT C
def variant_c():
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    # eyebrow
    ef = font(DMSANS, 20, [14, 600])
    tracked(d, "UNIVERSAL FAUCET EXTENDER", W // 2, s(118), ef, MUTED, 6)

    # forest-green base band (top corners rounded, bottom runs off-canvas)
    band_top = s(688)
    d.rounded_rectangle([0, band_top, W, H + s(60)], radius=s(46), fill=GREEN)

    # product mirrored, standing on the green shelf
    p = product(372, mirror=True)
    px, py = (W - p.width) // 2, s(300)
    shadow(img, W // 2, py + p.height - s(6), s(150), s(34), alpha=70, blur=14)
    img.paste(p, (px, py), p)
    d = ImageDraw.Draw(img)

    # headline on the band
    d.text((W // 2, s(792)), "Your sink, upgraded.",
           font=font(PLAYFAIR, 62, [800]), fill=WHITE, anchor="mm")

    # cream pill badge (reversed: green text on cream)
    badge = "360° Rotating  ·  Anti-Splash  ·  10-sec Install"
    bf = font(DMSANS, 24, [14, 600])
    bw = d.textlength(badge, font=bf)
    cyb = s(874); padx, pady = s(36), s(25)
    d.rounded_rectangle([W // 2 - bw // 2 - padx, cyb - pady, W // 2 + bw // 2 + padx, cyb + pady],
                        radius=pady * 2, fill=CREAM)
    d.text((W // 2, cyb), badge, font=bf, fill=GREEN, anchor="mm")

    # footer on band
    d.text((s(80), s(992)), "Flowo", font=font(PLAYFAIR, 40, [600]), fill=WHITE, anchor="lm")
    d.text((W - s(80), s(992)), "$24.99", font=font(DMSANS, 40, [14, 700]), fill=WHITE, anchor="rm")
    img.resize((1080, 1080), Image.LANCZOS).save("/home/user/website-builder/assets/flowo-instagram-c.png")

variant_b()
variant_c()
print("saved b + c")
