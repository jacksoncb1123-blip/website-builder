#!/usr/bin/env python3
"""Render the 'Flowo' branded Instagram post at 1080x1080 (3x supersampled)."""
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

S = 3                      # supersample factor
W = H = 1080 * S
def s(v): return int(round(v * S))

# ---- palette ----
BG    = (242, 237, 230)    # warm cream  #f2ede6
GREEN = (45, 106, 79)      # forest green #2d6a4f
INK   = (43, 41, 36)       # near-black warm ink
WHITE = (245, 247, 244)

PLAYFAIR = "/tmp/fonts/PlayfairDisplay.ttf"
DMSANS   = "/tmp/fonts/DMSans.ttf"

def font(path, size, axes=None):
    f = ImageFont.truetype(path, s(size))
    if axes:
        try:
            f.set_variation_by_axes(axes)
        except Exception:
            pass
    return f

img  = Image.new("RGB", (W, H), BG)
draw = ImageDraw.Draw(img)

# ============================================================ PRODUCT
# Faithful chrome illustration of the real faucet extender, rendered separately
# (tools/make_product.py -> /tmp/product.png), here cropped, scaled and dropped
# onto the canvas with a soft grounding shadow.
prod = Image.open("/tmp/product.png").convert("RGBA")
prod = prod.crop(prod.getbbox())                     # trim transparent margins
PROD_H = s(424)                                       # target height on canvas
scale = PROD_H / prod.height
prod = prod.resize((int(prod.width * scale), PROD_H), Image.LANCZOS)
px = (W - prod.width) // 2
py = s(268)                                           # top of product block

# soft grounding shadow beneath the product
sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
sd = ImageDraw.Draw(sh)
scy = py + prod.height - s(24)
sd.ellipse([W // 2 - s(150), scy, W // 2 + s(110), scy + s(54)], fill=(60, 55, 45, 65))
sh = sh.filter(ImageFilter.GaussianBlur(s(16)))
img.paste(sh, (0, 0), sh)

img.paste(prod, (px, py), prod)
draw = ImageDraw.Draw(img)

# ============================================================ HEADLINE
headline = "Your sink, but better."
size = 104
while size > 40:
    hf = font(PLAYFAIR, size, [800])
    if draw.textlength(headline, font=hf) <= s(900):
        break
    size -= 2
draw.text((W // 2, s(168)), headline, font=hf, fill=INK, anchor="mm")

# ============================================================ BADGE PILL
badge = "360° Rotating  ·  Anti-Splash  ·  10-sec Install"
bf = font(DMSANS, 25, [14, 600])
bw = draw.textlength(badge, font=bf)
padx, padyh = s(38), s(27)
cyb = py + prod.height + s(58)                         # sit just below the product
x0, x1 = W // 2 - bw // 2 - padx, W // 2 + bw // 2 + padx
draw.rounded_rectangle([x0, cyb - padyh, x1, cyb + padyh],
                       radius=(cyb + padyh) - (cyb - padyh), fill=GREEN)
draw.text((W // 2, cyb), badge, font=bf, fill=WHITE, anchor="mm")

# ============================================================ FOOTER
brand = font(PLAYFAIR, 40, [600])
draw.text((s(80), s(1002)), "Flowo", font=brand, fill=GREEN, anchor="lm")

price = font(DMSANS, 40, [14, 700])
draw.text((W - s(80), s(1002)), "$24.99", font=price, fill=GREEN, anchor="rm")

# ============================================================ EXPORT
out = img.resize((1080, 1080), Image.LANCZOS)
out.save("/home/user/website-builder/assets/flowo-instagram-1080.png")
print("saved")
