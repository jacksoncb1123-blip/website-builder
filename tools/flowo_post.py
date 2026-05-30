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

# ============================================================ FAUCET
# Built on its own RGBA layer so we can drop a soft shadow under it.
fx = Image.new("RGBA", (W, H), (0, 0, 0, 0))
fd = ImageDraw.Draw(fx)

def stamp(d, pts, r, color, off=(0, 0)):
    rr = s(r)
    ox, oy = s(off[0]), s(off[1])
    for (x, y) in pts:
        cx, cy = s(x) + ox, s(y) + oy
        d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=color)

# --- centred inverted-U arch path (the rotating arm) ---
CX = 540
LX, RX = 460, 620          # leg x positions  (centre 540)
TOP_Y = 440                # where legs meet the arc
BOT_Y = 600                # leg bottoms
R = (RX - LX) / 2          # arc radius = 80

path = []
step = 0.6
# left leg (bottom -> top)
y = BOT_Y
while y >= TOP_Y:
    path.append((LX, y)); y -= step
# semicircular shoulder, 180deg -> 0deg over the top
t = math.pi
while t >= 0:
    path.append((CX + R * math.cos(t), TOP_Y - R * math.sin(t))); t -= step / R
# right leg (top -> bottom)
y = TOP_Y
while y <= BOT_Y:
    path.append((RX, y)); y += step

# chrome tube: concentric layers dark(edge) -> bright(core)
LAYERS = [
    (20, (74, 82, 86),   (0, 0)),
    (17, (122, 133, 139),(0, 0)),
    (13, (168, 179, 185),(-1, -1)),
    (9,  (208, 217, 221),(-2, -3)),
    (5,  (242, 246, 248),(-3, -4)),
]
for r, col, off in LAYERS:
    stamp(fd, path, r, col + (255,), off)

# --- aerator / spout outlet on the right leg (distinguishes it as a faucet) ---
aw, ah = 56, 34
ax, ay = RX, BOT_Y + 4
for i in range(s(ah)):                      # vertical chrome gradient top(light)->bottom(dark)
    f = i / max(1, s(ah) - 1)
    c = tuple(int(225 - f * 150) for _ in range(3))
    yy = s(ay - ah / 2) + i
    fd.line([(s(ax - aw / 2), yy), (s(ax + aw / 2), yy)], fill=c + (255,), width=1)
# rounded chrome cap silhouette + dark base lip
fd.rounded_rectangle([s(ax - aw / 2), s(ay - ah / 2), s(ax + aw / 2), s(ay + ah / 2)],
                     radius=s(8), outline=(70, 78, 82, 255), width=s(2))
fd.line([(s(ax - aw / 2 + 3), s(ay + ah / 2 - 2)), (s(ax + aw / 2 - 3), s(ay + ah / 2 - 2))],
        fill=(60, 66, 70, 255), width=s(3))

# ---- soft grounding shadow ----
sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
sd = ImageDraw.Draw(sh)
sd.ellipse([s(LX - 30), s(BOT_Y + 34), s(RX + 50), s(BOT_Y + 78)], fill=(60, 55, 45, 70))
sh = sh.filter(ImageFilter.GaussianBlur(s(14)))
img.paste(Image.alpha_composite(Image.new("RGBA", (W, H), (0, 0, 0, 0)), sh), (0, 0), sh)

# ---- faint 360 rotation arc (behind, very subtle) ----
ring = Image.new("RGBA", (W, H), (0, 0, 0, 0))
rd = ImageDraw.Draw(ring)
RCX, RCY, RR = 540, 470, 250
rd.arc([s(RCX - RR), s(RCY - RR), s(RCX + RR), s(RCY + RR)],
       start=-35, end=215, fill=(168, 196, 178, 255), width=s(5))
# clean arrowhead at the open end (~ -35 deg) indicating rotation
a = math.radians(-35)
tx, ty = RCX + RR * math.cos(a), RCY + RR * math.sin(a)   # tip on the arc
tang = (math.cos(a - math.pi / 2), math.sin(a - math.pi / 2))  # tangential dir
rad = (math.cos(a), math.sin(a))                                # radial dir
L, Wd = 24, 11
tip  = (tx + tang[0] * L * 0.5,  ty + tang[1] * L * 0.5)
back = (tx - tang[0] * L * 0.5,  ty - tang[1] * L * 0.5)
b1 = (back[0] + rad[0] * Wd, back[1] + rad[1] * Wd)
b2 = (back[0] - rad[0] * Wd, back[1] - rad[1] * Wd)
rd.polygon([(s(tip[0]), s(tip[1])), (s(b1[0]), s(b1[1])), (s(b2[0]), s(b2[1]))],
           fill=(168, 196, 178, 255))
img.paste(ring, (0, 0), ring)

# faucet on top of ring + shadow
img.paste(fx, (0, 0), fx)

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
cyb = s(772)
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
