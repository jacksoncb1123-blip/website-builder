#!/usr/bin/env python3
"""Build a clean chrome illustration of the Flowo faucet extender as SVG, render to PNG.

Silhouette from the real product: a knurled cylindrical swivel spray-head (the
business end, pointing down), a ball swivel joint (the 360deg rotation), a chrome
gooseneck arm, and a ribbed threaded collar that screws onto the faucet.
"""
import math
import cairosvg

W = H = 760

def chrome_defs():
    return f"""
  <defs>
    <linearGradient id="chromeH" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0"    stop-color="#5d656a"/>
      <stop offset="0.08" stop-color="#9aa3a8"/>
      <stop offset="0.24" stop-color="#eef2f4"/>
      <stop offset="0.34" stop-color="#ffffff"/>
      <stop offset="0.44" stop-color="#d2d9dc"/>
      <stop offset="0.57" stop-color="#8f989d"/>
      <stop offset="0.72" stop-color="#cdd4d8"/>
      <stop offset="0.88" stop-color="#787f84"/>
      <stop offset="1"    stop-color="#525a5f"/>
    </linearGradient>
    <linearGradient id="capV" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fbfdfe"/>
      <stop offset="1" stop-color="#c2cacf"/>
    </linearGradient>
    <radialGradient id="sphere" cx="0.35" cy="0.30" r="0.75">
      <stop offset="0"    stop-color="#ffffff"/>
      <stop offset="0.25" stop-color="#e3e9ec"/>
      <stop offset="0.62" stop-color="#9aa3a8"/>
      <stop offset="1"    stop-color="#4f575c"/>
    </radialGradient>
    <radialGradient id="recess" cx="0.5" cy="0.42" r="0.62">
      <stop offset="0"   stop-color="#aab2b7"/>
      <stop offset="0.6" stop-color="#6c747a"/>
      <stop offset="1"   stop-color="#3c4347"/>
    </radialGradient>
  </defs>"""

def head(cx, top, w, h):
    """Knurled spray-head cylinder pointing down (outlet at bottom)."""
    hw = w / 2
    bot = top + h
    rx = hw
    out = [f'<g>']
    # body
    out.append(f'<rect x="{cx-hw:.1f}" y="{top:.1f}" width="{w:.1f}" height="{h:.1f}" '
               f'rx="6" fill="url(#chromeH)"/>')
    # vertical knurl (grip) lines
    n = 17
    for i in range(1, n):
        x = cx - hw + i * (w / n)
        shade = "#23292c" if i % 2 else "#f4f8fa"
        op = 0.16 if i % 2 else 0.22
        out.append(f'<line x1="{x:.1f}" y1="{top+10:.1f}" x2="{x:.1f}" y2="{bot-14:.1f}" '
                   f'stroke="{shade}" stroke-width="2" opacity="{op}"/>')
    # a darker seam band (the rotating collar ring) near the top third
    bandY = top + h * 0.30
    out.append(f'<rect x="{cx-hw:.1f}" y="{bandY:.1f}" width="{w:.1f}" height="7" '
               f'fill="#3a4145" opacity="0.35"/>')
    out.append(f'<rect x="{cx-hw:.1f}" y="{bandY+8:.1f}" width="{w:.1f}" height="2" '
               f'fill="#ffffff" opacity="0.5"/>')
    # top cap
    out.append(f'<ellipse cx="{cx:.1f}" cy="{top:.1f}" rx="{rx:.1f}" ry="16" fill="url(#capV)"/>')
    # bottom rim + recessed aerator face with spray holes
    out.append(f'<ellipse cx="{cx:.1f}" cy="{bot:.1f}" rx="{rx:.1f}" ry="20" fill="url(#chromeH)"/>')
    out.append(f'<ellipse cx="{cx:.1f}" cy="{bot+1:.1f}" rx="{rx-14:.1f}" ry="14" fill="url(#recess)"/>')
    # spray holes grid
    for ring_r, count in ((rx-30, 10), (rx-46, 7), (12, 1)):
        for k in range(count):
            a = 2*math.pi*k/count
            hx = cx + ring_r*math.cos(a)
            hy = bot+1 + (ring_r*0.27)*math.sin(a)
            out.append(f'<circle cx="{hx:.1f}" cy="{hy:.1f}" r="2.1" fill="#2a3033" opacity="0.8"/>')
    out.append('</g>')
    return "\n".join(out)

def arm(points, layers):
    d = "M " + " L ".join(f"{x:.1f} {y:.1f}" for x, y in points)
    out = []
    for wdt, col in layers:
        out.append(f'<path d="{d}" fill="none" stroke="{col}" stroke-width="{wdt}" '
                   f'stroke-linecap="round" stroke-linejoin="round"/>')
    return "\n".join(out)

def collar(x, y, ang, w, ln):
    """Ribbed threaded coupling that screws onto the faucet."""
    hw = w/2
    out = [f'<g transform="translate({x:.1f},{y:.1f}) rotate({ang:.1f})">']
    out.append(f'<rect x="{-hw:.1f}" y="{-ln:.1f}" width="{w:.1f}" height="{ln:.1f}" rx="7" '
               f'fill="url(#chromeH)"/>')
    # thread rings
    for i in range(1, 6):
        yy = -ln + i*(ln/6)
        out.append(f'<line x1="{-hw+3:.1f}" y1="{yy:.1f}" x2="{hw-3:.1f}" y2="{yy:.1f}" '
                   f'stroke="#2a3033" stroke-width="2.4" opacity="0.32"/>')
        out.append(f'<line x1="{-hw+3:.1f}" y1="{yy+2.6:.1f}" x2="{hw-3:.1f}" y2="{yy+2.6:.1f}" '
                   f'stroke="#ffffff" stroke-width="1.4" opacity="0.45"/>')
    # female opening at the far (faucet) end
    out.append(f'<ellipse cx="0" cy="{-ln:.1f}" rx="{hw:.1f}" ry="10" fill="url(#recess)"/>')
    out.append(f'<ellipse cx="0" cy="{-ln:.1f}" rx="{hw-9:.1f}" ry="6" fill="#2c3236"/>')
    out.append('</g>')
    return "\n".join(out)

# ---------- compose ----------
arm_pts = [(290, 360), (286, 300), (300, 256), (352, 240),
           (420, 232), (470, 232), (516, 214)]
arm_layers = [
    (52, "#565e63"),
    (44, "#929ca1"),
    (33, "#c8cfd3"),
    (21, "#eef3f5"),
    (10, "#ffffff"),
]

svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
{chrome_defs()}
{arm(arm_pts, arm_layers)}
{collar(528, 206, -52, 78, 92)}
<circle cx="290" cy="384" r="30" fill="url(#sphere)"/>
{head(272, 394, 156, 150)}
</svg>"""

with open("/tmp/product.svg", "w") as f:
    f.write(svg)
cairosvg.svg2png(bytestring=svg.encode(), write_to="/tmp/product.png",
                 output_width=3200, output_height=3200)
print("rendered /tmp/product.png")
