// ============================================
//  Smashing Grapes — cinematic hero sequence
//  Scroll-scrubbed canvas: grapes crush -> juice pours ->
//  crystal glass fills -> wine color shifts per region.
//  Vanilla canvas 2D, no dependencies.
// ============================================
(function () {
  "use strict";

  var canvas = document.getElementById("grape-canvas");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var stage = document.querySelector(".cinema");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var W = 0, H = 0, DPR = 1;
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener("resize", resize);
  resize();

  // ---- scroll progress through the tall stage [0..1] ----
  function getProgress() {
    if (!stage) return 0;
    var r = stage.getBoundingClientRect();
    var total = r.height - window.innerHeight;
    if (total <= 0) return 0;
    return clamp(-r.top / total, 0, 1);
  }

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function smooth(t) { return t * t * (3 - 2 * t); }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function range(p, a, b) { return clamp((p - a) / (b - a), 0, 1); }

  // ---- wine color (shifts when a region card is hovered) ----
  var wineTarget = [122, 15, 36];   // default crimson
  var wineNow = [58, 17, 48];       // starts violet
  window.__setWine = function (rgb) { wineTarget = rgb; };
  window.__resetWine = function () { wineTarget = [122, 15, 36]; };

  // ---- build a cluster of grapes ----
  var grapes = [];
  function buildGrapes() {
    grapes = [];
    var cx = W * 0.5, cy = H * 0.34;
    var unit = Math.min(W, H) * 0.052;
    // triangular bunch
    var rows = [1, 2, 3, 4, 4, 3, 2, 1];
    var gy = cy - unit * 2.2;
    for (var r = 0; r < rows.length; r++) {
      var n = rows[r];
      for (var i = 0; i < n; i++) {
        var gx = cx + (i - (n - 1) / 2) * unit * 1.7 + (r % 2 ? unit * 0.4 : 0);
        grapes.push({
          x: gx, y: gy + r * unit * 1.35,
          r: unit * (0.92 + Math.random() * 0.16),
          seed: Math.random(),
          burst: 0
        });
      }
    }
  }
  buildGrapes();
  window.addEventListener("resize", buildGrapes);

  // ---- juice particle system ----
  var parts = [];
  function spawn(x, y, n, speed, col) {
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2;
      var s = speed * (0.3 + Math.random() * 0.9);
      parts.push({
        x: x + (Math.random() - 0.5) * 20, y: y + (Math.random() - 0.5) * 12,
        vx: Math.cos(a) * s, vy: Math.sin(a) * s - speed * 0.4,
        r: 1.5 + Math.random() * 4, life: 1, col: col
      });
    }
    if (parts.length > 320) parts.splice(0, parts.length - 320);
  }
  function updateParts() {
    for (var i = parts.length - 1; i >= 0; i--) {
      var p = parts[i];
      p.vy += 0.35;            // gravity
      p.vx *= 0.99;
      p.x += p.vx; p.y += p.vy;
      p.life -= 0.018;
      if (p.life <= 0 || p.y > H + 40) parts.splice(i, 1);
    }
  }

  // ============================================
  //  DRAW HELPERS
  // ============================================
  function rgba(c, a) { return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")"; }

  function drawBackdrop(p) {
    var g = ctx.createRadialGradient(W * 0.5, H * 0.4, 20, W * 0.5, H * 0.5, Math.max(W, H) * 0.75);
    g.addColorStop(0, "#1a0c12");
    g.addColorStop(0.5, "#120a0d");
    g.addColorStop(1, "#0a0709");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  function drawGrape(g, crush, col) {
    // crush 0..1 -> squash + sink + tear
    var squashY = 1 - 0.55 * crush;
    var squashX = 1 + 0.30 * crush;
    var sink = crush * (H * 0.10);
    var rr = g.r * (1 - 0.25 * g.burst);
    ctx.save();
    ctx.translate(g.x, g.y + sink);
    ctx.scale(squashX, squashY);
    // body
    var grd = ctx.createRadialGradient(-rr * 0.35, -rr * 0.4, rr * 0.1, 0, 0, rr);
    grd.addColorStop(0, rgba([Math.min(col[0] + 70, 255), col[1] + 40, col[2] + 60], 1));
    grd.addColorStop(0.55, rgba(col, 1));
    grd.addColorStop(1, rgba([Math.max(col[0] - 40, 0), Math.max(col[1] - 8, 0), Math.max(col[2] - 20, 0)], 1));
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(0, 0, rr, 0, Math.PI * 2);
    ctx.fill();
    // specular highlight
    ctx.fillStyle = "rgba(255,235,245," + (0.5 * (1 - crush)) + ")";
    ctx.beginPath();
    ctx.ellipse(-rr * 0.34, -rr * 0.42, rr * 0.22, rr * 0.13, -0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawGrapes(p) {
    var crushP = range(p, 0.04, 0.40);          // overall crush
    var fade = 1 - range(p, 0.34, 0.46);         // fade as pour starts
    if (fade <= 0) return;
    ctx.globalAlpha = fade;
    var col = [
      Math.round(lerp(58, wineNow[0], crushP)),
      Math.round(lerp(17, wineNow[1], crushP)),
      Math.round(lerp(48, wineNow[2], crushP))
    ];
    // pressing plate descending
    var plateY = lerp(-H * 0.2, H * 0.16, easeOut(crushP));
    for (var i = 0; i < grapes.length; i++) {
      var g = grapes[i];
      var local = clamp(crushP * 1.3 - g.seed * 0.3, 0, 1);
      g.burst = local;
      drawGrape(g, local, col);
      // emit juice while actively crushing
      if (crushP > 0.30 && crushP < 1 && Math.random() < crushP * 0.5) {
        spawn(g.x, g.y + g.r, 1, 5 + crushP * 8, col);
      }
    }
    // press plate (gold bar)
    if (crushP > 0.05) {
      ctx.globalAlpha = fade * clamp(crushP * 2, 0, 1) * 0.9;
      var pg = ctx.createLinearGradient(0, plateY, 0, plateY + 26);
      pg.addColorStop(0, "#e3c987"); pg.addColorStop(1, "#9a7a32");
      ctx.fillStyle = pg;
      roundRect(W * 0.22, plateY, W * 0.56, 22, 6); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // crystal wine glass + fill
  function drawGlass(p) {
    var appear = range(p, 0.30, 0.46);
    if (appear <= 0) return;
    var fill = easeOut(range(p, 0.34, 0.74));      // fill level 0..1

    var cx = W * 0.5;
    var rise = lerp(H * 0.22, 0, easeOut(appear)); // glass rises into place
    var baseY = H * 0.92 - rise;
    var bowlW = Math.min(W, H) * 0.20;
    var bowlH = bowlW * 1.18;
    var bowlCy = baseY - bowlH * 1.15;

    ctx.save();
    ctx.globalAlpha = appear;

    // spotlight behind glass (scene 3)
    var spot = range(p, 0.60, 0.78);
    if (spot > 0) {
      var sg = ctx.createRadialGradient(cx, bowlCy, 10, cx, bowlCy, bowlW * 3.4);
      sg.addColorStop(0, "rgba(201,162,75," + (0.22 * spot) + ")");
      sg.addColorStop(1, "rgba(201,162,75,0)");
      ctx.fillStyle = sg; ctx.fillRect(0, 0, W, H);
    }

    // bowl path (rounded U)
    function bowlPath() {
      ctx.beginPath();
      ctx.moveTo(cx - bowlW, bowlCy - bowlH * 0.55);
      ctx.bezierCurveTo(cx - bowlW, bowlCy + bowlH * 0.5, cx - bowlW * 0.5, bowlCy + bowlH, cx, bowlCy + bowlH);
      ctx.bezierCurveTo(cx + bowlW * 0.5, bowlCy + bowlH, cx + bowlW, bowlCy + bowlH * 0.5, cx + bowlW, bowlCy - bowlH * 0.55);
    }

    // stem + foot
    ctx.strokeStyle = "rgba(231,201,135,0.5)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx, bowlCy + bowlH);
    ctx.lineTo(cx, baseY - 6);
    ctx.stroke();
    ctx.fillStyle = "rgba(231,201,135,0.18)";
    ctx.beginPath();
    ctx.ellipse(cx, baseY, bowlW * 0.7, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // wine fill (clipped to bowl)
    ctx.save();
    bowlPath();
    ctx.closePath();
    ctx.clip();
    var topFill = (bowlCy + bowlH) - fill * (bowlH * 1.5);
    var wg = ctx.createLinearGradient(0, topFill, 0, bowlCy + bowlH);
    wg.addColorStop(0, rgba([Math.min(wineNow[0] + 40, 255), wineNow[1] + 20, wineNow[2] + 24], 0.95));
    wg.addColorStop(1, rgba(wineNow, 0.98));
    ctx.fillStyle = wg;
    ctx.fillRect(cx - bowlW, topFill, bowlW * 2, bowlH * 2);
    // surface shimmer
    if (fill > 0.02) {
      ctx.fillStyle = "rgba(255,240,230,0.22)";
      ctx.beginPath();
      ctx.ellipse(cx, topFill, bowlW * 0.92, 7, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // glass body (rim + walls) over wine
    bowlPath();
    var glassGrad = ctx.createLinearGradient(cx - bowlW, 0, cx + bowlW, 0);
    glassGrad.addColorStop(0, "rgba(255,255,255,0.32)");
    glassGrad.addColorStop(0.5, "rgba(255,255,255,0.05)");
    glassGrad.addColorStop(1, "rgba(255,255,255,0.22)");
    ctx.strokeStyle = glassGrad;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    // rim
    ctx.strokeStyle = "rgba(231,201,135,0.7)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(cx, bowlCy - bowlH * 0.55, bowlW, bowlW * 0.16, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
    return { cx: cx, mouthY: bowlCy - bowlH * 0.55, fill: fill };
  }

  // pouring stream from top into the glass
  function drawPour(p, glass) {
    var pourP = range(p, 0.40, 0.74);
    if (pourP <= 0 || !glass || glass.fill >= 0.995) return;
    var strength = Math.sin(pourP * Math.PI);    // ramps up then down
    if (strength <= 0.01) return;
    var cx = glass.cx;
    var topY = H * 0.10;
    var w = lerp(3, 9, strength);
    ctx.save();
    ctx.globalAlpha = strength;
    ctx.beginPath();
    ctx.moveTo(cx - w, topY);
    var t = (Date.now() % 1000) / 1000;
    for (var y = topY; y <= glass.mouthY; y += 14) {
      var wob = Math.sin((y * 0.05) + t * 6) * 3 * (1 - (y - topY) / (glass.mouthY - topY));
      ctx.lineTo(cx + wob + w * 0.5, y);
    }
    for (var y2 = glass.mouthY; y2 >= topY; y2 -= 14) {
      var wob2 = Math.sin((y2 * 0.05) + t * 6) * 3 * (1 - (y2 - topY) / (glass.mouthY - topY));
      ctx.lineTo(cx + wob2 - w * 0.5, y2);
    }
    ctx.closePath();
    var sg = ctx.createLinearGradient(0, topY, 0, glass.mouthY);
    sg.addColorStop(0, rgba([wineNow[0] + 30, wineNow[1] + 16, wineNow[2] + 20], 0.85));
    sg.addColorStop(1, rgba(wineNow, 0.95));
    ctx.fillStyle = sg;
    ctx.fill();
    // refraction shimmer line
    ctx.strokeStyle = "rgba(255,240,230,0.5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 1, topY); ctx.lineTo(cx - 1, glass.mouthY);
    ctx.stroke();
    ctx.restore();
    // splash particles at the glass mouth
    if (Math.random() < strength * 0.6) spawn(cx, glass.mouthY, 2, 4, wineNow);
  }

  function drawParticles() {
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      ctx.globalAlpha = clamp(p.life, 0, 1) * 0.9;
      ctx.fillStyle = rgba(p.col, 1);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function vignette() {
    var g = ctx.createRadialGradient(W * 0.5, H * 0.5, H * 0.3, W * 0.5, H * 0.5, H * 0.85);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.6)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // ============================================
  //  PHASE -> UI (captions + region cards)
  // ============================================
  var caps = {
    grapes: document.querySelector('[data-cap="grapes"]'),
    pour: document.querySelector('[data-cap="pour"]'),
    regions: document.querySelector('[data-cap="regions"]')
  };
  var regionStage = document.getElementById("region-stage");
  var scrollHint = document.getElementById("scroll-hint");

  function setUI(p) {
    toggle(caps.grapes, p < 0.30);
    toggle(caps.pour, p >= 0.34 && p < 0.58);
    toggle(caps.regions, p >= 0.60 && p < 0.96);
    if (regionStage) {
      var show = p >= 0.74;
      regionStage.classList.toggle("show", show);
      regionStage.setAttribute("aria-hidden", show ? "false" : "true");
    }
    if (scrollHint) scrollHint.style.opacity = p < 0.04 ? "1" : "0";
  }
  function toggle(el, on) { if (el) el.classList.toggle("show", on); }

  // ============================================
  //  RENDER LOOP (eased progress for weighty feel)
  // ============================================
  var shown = 0;
  function frame() {
    var target = getProgress();
    shown += (target - shown) * 0.10;
    if (Math.abs(target - shown) < 0.0002) shown = target;

    // ease wine color toward target
    for (var c = 0; c < 3; c++) wineNow[c] += (wineTarget[c] - wineNow[c]) * 0.08;

    ctx.clearRect(0, 0, W, H);
    drawBackdrop(shown);
    updateParts();
    drawGrapes(shown);
    var glass = drawGlass(shown);
    drawPour(shown, glass);
    drawParticles();
    vignette();
    setUI(shown);

    requestAnimationFrame(frame);
  }

  if (reduce) {
    // Static elegant final frame: full glass + regions visible (CSS handles layout)
    wineNow = wineTarget.slice();
    ctx.clearRect(0, 0, W, H);
    drawBackdrop(1);
    drawGlass(1);
    vignette();
    if (regionStage) regionStage.classList.add("show");
    if (caps.regions) caps.regions.classList.add("show");
  } else {
    requestAnimationFrame(frame);
  }
})();
