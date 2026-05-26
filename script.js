// ============================================
//  Saffron & Sage — interactions
// ============================================
(function () {
  "use strict";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Footer year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Sticky header state ---- */
  var header = document.getElementById("header");
  var onScroll = function () {
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Mobile nav toggle ---- */
  var toggle = document.getElementById("nav-toggle");
  var navList = document.getElementById("nav-list");
  if (toggle && navList) {
    toggle.addEventListener("click", function () {
      var open = navList.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    // Close when a link is tapped
    navList.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        navList.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- Menu tabs ---- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".menu-tab"));
  var panels = Array.prototype.slice.call(document.querySelectorAll(".menu-panel"));
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var target = tab.getAttribute("data-tab");
      tabs.forEach(function (t) {
        var active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", String(active));
      });
      panels.forEach(function (p) {
        var match = p.getAttribute("data-panel") === target;
        p.classList.toggle("is-active", match);
        p.hidden = !match;
      });
    });
  });

  /* ---- Reveal on scroll ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---- Button ripple ---- */
  document.querySelectorAll(".btn").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      if (reduceMotion) return;
      var rect = btn.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height);
      var ink = document.createElement("span");
      ink.className = "ripple";
      ink.style.width = ink.style.height = size + "px";
      ink.style.left = (e.clientX - rect.left - size / 2) + "px";
      ink.style.top = (e.clientY - rect.top - size / 2) + "px";
      btn.appendChild(ink);
      ink.addEventListener("animationend", function () { ink.remove(); });
    });
  });

  /* ---- Scroll-spy: highlight nav link for the section in view ---- */
  var spyLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav-list a[href^="#"]')
  );
  var spyTargets = spyLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && spyTargets.length) {
    var setActive = function (id) {
      spyLinks.forEach(function (a) {
        a.classList.toggle("active", a.getAttribute("href") === "#" + id);
      });
    };
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    spyTargets.forEach(function (t) { spy.observe(t); });
  }

  /* ---- Back to top ---- */
  var toTop = document.getElementById("to-top");
  if (toTop) {
    var toggleTop = function () {
      toTop.classList.toggle("show", window.scrollY > 600);
    };
    toggleTop();
    window.addEventListener("scroll", toggleTop, { passive: true });
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---- Count-up stat (runs once when visible) ---- */
  var counter = document.querySelector("[data-count]");
  if (counter && "IntersectionObserver" in window) {
    var runCount = function () {
      var target = parseInt(counter.getAttribute("data-count"), 10) || 0;
      var suffix = counter.getAttribute("data-suffix") || "";
      if (reduceMotion) { counter.textContent = target + suffix; return; }
      var start = null, dur = 1400;
      var step = function (ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        counter.textContent = Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    var countObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { runCount(); countObs.disconnect(); }
      });
    }, { threshold: 0.6 });
    countObs.observe(counter);
  }

  /* ---- Hero parallax (subtle, rAF-throttled) ---- */
  var heroContent = document.querySelector(".hero-content");
  var heroBg = document.querySelector(".hero-bg");
  if (heroContent && !reduceMotion) {
    var ticking = false;
    var parallax = function () {
      var y = window.scrollY;
      if (y < window.innerHeight) {
        heroContent.style.transform = "translateY(" + y * 0.18 + "px)";
        heroContent.style.opacity = String(Math.max(1 - y / 650, 0));
        if (heroBg) heroBg.style.transform = "scale(1.05) translateY(" + y * 0.06 + "px)";
      }
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { requestAnimationFrame(parallax); ticking = true; }
    }, { passive: true });
  }

  /* ---- Reservation form validation ---- */
  var form = document.getElementById("reserve-form");
  if (!form) return;

  var success = document.getElementById("form-success");

  var validators = {
    name: function (v) { return v.trim().length >= 2 || "Please enter your name."; },
    date: function (v) {
      if (!v) return "Please pick a date.";
      var picked = new Date(v + "T00:00");
      var today = new Date(); today.setHours(0, 0, 0, 0);
      return picked >= today || "Please choose today or a future date.";
    },
    time: function (v) { return !!v || "Please pick a time."; },
    guests: function (v) { return !!v || "Select party size."; },
    phone: function (v) {
      var digits = v.replace(/\D/g, "");
      return digits.length >= 7 || "Enter a valid phone number.";
    }
  };

  var setFieldState = function (input, message) {
    var field = input.closest(".field");
    var error = form.querySelector('.field-error[data-for="' + input.id + '"]');
    var ok = message === true;
    if (field) field.classList.toggle("invalid", !ok);
    input.setAttribute("aria-invalid", String(!ok));
    if (error) error.textContent = ok ? "" : message;
    return ok;
  };

  var validateField = function (input) {
    var fn = validators[input.name];
    if (!fn) return true;
    return setFieldState(input, fn(input.value));
  };

  // Live-clear errors as the user fixes them
  form.addEventListener("input", function (e) {
    var input = e.target;
    if (input.name in validators && input.closest(".field").classList.contains("invalid")) {
      validateField(input);
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var firstInvalid = null;
    var allValid = true;

    Object.keys(validators).forEach(function (name) {
      var input = form.elements[name];
      if (!input) return;
      var valid = validateField(input);
      if (!valid && !firstInvalid) firstInvalid = input;
      allValid = allValid && valid;
    });

    if (!allValid) {
      if (success) success.hidden = true;
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Success — in a real site you'd POST this to a server.
    form.reset();
    if (success) {
      success.hidden = false;
      success.focus && success.focus();
    }
  });
})();
