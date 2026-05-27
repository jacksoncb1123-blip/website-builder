// ============================================
//  Smashing Grapes — interactions
// ============================================
(function () {
  "use strict";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var doc = document.documentElement;

  // remove preload guard after first paint
  requestAnimationFrame(function () { document.body.classList.remove("preload"); });

  /* ---- year ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---- sticky header + scroll progress + back-to-top ---- */
  var header = document.getElementById("header");
  var bar = document.getElementById("scroll-progress");
  var toTop = document.getElementById("to-top");
  function onScroll() {
    var sy = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("scrolled", sy > 30);
    if (bar) {
      var max = doc.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? (sy / max) * 100 : 0) + "%";
    }
    if (toTop) toTop.classList.toggle("show", sy > window.innerHeight * 1.2);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- smooth anchor scrolling with cinematic ease ---- */
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function smoothScrollTo(targetY, duration) {
    var startY = window.scrollY, dist = targetY - startY, start = null;
    if (reduce || Math.abs(dist) < 4) { window.scrollTo(0, targetY); return; }
    function step(ts) {
      if (start === null) start = ts;
      var t = Math.min((ts - start) / duration, 1);
      window.scrollTo(0, startY + dist * easeInOut(t));
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var top = el.getBoundingClientRect().top + window.scrollY - 10;
      smoothScrollTo(top, 1100);
      // close mobile nav
      if (navList) { navList.classList.remove("open"); if (toggle) { toggle.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); } }
    });
  });
  if (toTop) toTop.addEventListener("click", function () { smoothScrollTo(0, 1000); });

  /* ---- mobile nav ---- */
  var toggle = document.getElementById("nav-toggle");
  var navList = document.getElementById("nav-list");
  if (toggle && navList) {
    toggle.addEventListener("click", function () {
      var open = navList.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  /* ---- staggered reveals ---- */
  var reveals = document.querySelectorAll(".reveal");
  reveals.forEach(function (el) {
    var d = el.getAttribute("data-delay");
    if (d) el.style.setProperty("--d", d);
  });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---- scroll-spy nav ---- */
  var spyLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-list a[href^="#"]'));
  var spyTargets = spyLinks.map(function (a) { return document.querySelector(a.getAttribute("href")); }).filter(Boolean);
  if ("IntersectionObserver" in window && spyTargets.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          spyLinks.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id); });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    spyTargets.forEach(function (t) { spy.observe(t); });
  }

  /* ---- button ripple + CTA shimmer ---- */
  document.querySelectorAll(".btn").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      if (!reduce) {
        var rect = btn.getBoundingClientRect();
        var size = Math.max(rect.width, rect.height);
        var ink = document.createElement("span");
        ink.className = "ripple";
        ink.style.width = ink.style.height = size + "px";
        ink.style.left = (e.clientX - rect.left - size / 2) + "px";
        ink.style.top = (e.clientY - rect.top - size / 2) + "px";
        btn.appendChild(ink);
        ink.addEventListener("animationend", function () { ink.remove(); });
      }
      if (btn.classList.contains("shimmer")) {
        btn.classList.remove("flash");
        void btn.offsetWidth;        // reflow to restart animation
        btn.classList.add("flash");
      }
    });
  });

  /* ---- 3D tilt on menu cards ---- */
  if (!reduce && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".tilt").forEach(function (card) {
      var raf = null;
      function move(e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          card.style.transform = "perspective(800px) rotateX(" + (-py * 7) + "deg) rotateY(" + (px * 9) + "deg) translateY(-4px)";
        });
      }
      function leave() { if (raf) cancelAnimationFrame(raf); card.style.transform = ""; }
      card.addEventListener("mousemove", move);
      card.addEventListener("mouseleave", leave);
    });
  }

  /* ---- region cards drive the wine color in the canvas ---- */
  document.querySelectorAll(".region-card").forEach(function (card) {
    var rgb = (card.getAttribute("data-wine") || "122,15,36").split(",").map(Number);
    card.addEventListener("mouseenter", function () { if (window.__setWine) window.__setWine(rgb); });
    card.addEventListener("mouseleave", function () { if (window.__resetWine) window.__resetWine(); });
  });

  /* ---- custom cursor ---- */
  var cursor = document.getElementById("cursor");
  var dot = document.getElementById("cursor-dot");
  if (cursor && dot && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.body.classList.add("using-cursor");
    var cx = window.innerWidth / 2, cy = window.innerHeight / 2, tx = cx, ty = cy;
    document.addEventListener("mousemove", function (e) {
      tx = e.clientX; ty = e.clientY;
      dot.style.transform = "translate(" + tx + "px," + ty + "px) translate(-50%,-50%)";
    });
    (function ring() {
      cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
      cursor.style.transform = "translate(" + cx + "px," + cy + "px) translate(-50%,-50%)";
      requestAnimationFrame(ring);
    })();
    document.querySelectorAll("a, button, [data-cursor], .tilt, .region-card").forEach(function (el) {
      el.addEventListener("mouseenter", function () { cursor.classList.add("hover"); });
      el.addEventListener("mouseleave", function () { cursor.classList.remove("hover"); });
    });
    document.addEventListener("mouseleave", function () { cursor.style.opacity = "0"; dot.style.opacity = "0"; });
    document.addEventListener("mouseenter", function () { cursor.style.opacity = "1"; dot.style.opacity = "1"; });
  }
})();
