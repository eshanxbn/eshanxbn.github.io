/* ============================================================
   MD. ESHAN — PORTFOLIO · INTERACTIONS
   Header · scroll-spy · reveals · counters · menu · palette
   ============================================================ */

(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarsePointer = window.matchMedia('(pointer: coarse)').matches;

  /* ---------- Header state + scroll progress ---------- */

  var header = document.getElementById('siteHeader');
  var progress = document.getElementById('scrollProgress');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle('scrolled', y > 24);

    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Scroll-spy ---------- */

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var spySections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && spySections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === id);
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    spySections.forEach(function (section) { spy.observe(section); });
  }

  /* ---------- Reveal on scroll ---------- */

  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reducedMotion) {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { revealer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Animated counters ---------- */

  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (isNaN(target)) return;
    if (reducedMotion) { el.textContent = target + suffix; return; }

    var duration = 1400;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var t = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { countObserver.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- Mobile menu ---------- */

  var menuToggle = document.getElementById('menuToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  var menuOpen = false;

  function setMenu(open) {
    menuOpen = open;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) {
      mobileMenu.hidden = false;
      requestAnimationFrame(function () { mobileMenu.classList.add('open'); });
      document.body.style.overflow = 'hidden';
    } else {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(function () { if (!menuOpen) mobileMenu.hidden = true; }, 380);
    }
  }

  menuToggle.addEventListener('click', function () { setMenu(!menuOpen); });
  mobileMenu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });

  /* ---------- Toast ---------- */

  var toast = document.getElementById('toast');
  var toastText = document.getElementById('toastText');
  var toastTimer = null;
  toast.removeAttribute('hidden');

  function showToast(message) {
    toastText.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2400);
  }

  /* ---------- Copy to clipboard ---------- */

  function copyText(text, done) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, done);
    } else {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (err) { /* no-op */ }
      document.body.removeChild(ta);
      done();
    }
  }

  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      copyText(btn.getAttribute('data-copy'), function () {
        showToast('Email address copied to clipboard');
      });
    });
  });

  /* ---------- Back to top ---------- */

  document.querySelectorAll('[data-to-top]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Hero glow follows pointer ---------- */

  var glow = document.getElementById('heroGlow');
  var hero = document.getElementById('overview');
  if (glow && hero && !reducedMotion && !coarsePointer) {
    var rafId = null;
    hero.addEventListener('pointermove', function (e) {
      if (rafId) return;
      rafId = requestAnimationFrame(function () {
        var rect = hero.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        glow.style.transform = 'translate3d(' + (x * 60) + 'px,' + (y * 40) + 'px,0)';
        rafId = null;
      });
    });
  }

  /* ---------- Command palette ---------- */

  var palette = document.getElementById('palette');
  var paletteInput = document.getElementById('paletteInput');
  var paletteList = document.getElementById('paletteList');
  var paletteOpen = false;
  var activeIndex = 0;
  var visibleItems = [];
  var lastTrigger = null;

  var ICONS = {
    section: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v12m0 0 4.5-4.5M12 16l-4.5-4.5M4.5 20h15"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a1.5 1.5 0 0 1 1.5-1.5H15"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg>'
  };

  function goTo(selector) {
    return function () {
      var el = document.querySelector(selector);
      if (el) el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    };
  }

  var COMMANDS = [
    { group: 'SECTIONS', title: 'Overview', hint: 'TOP', keywords: 'home hero intro', icon: ICONS.section, run: goTo('#overview') },
    { group: 'SECTIONS', title: 'Profile', hint: '01', keywords: 'about summary who', icon: ICONS.section, run: goTo('#profile') },
    { group: 'SECTIONS', title: 'Experience', hint: '02', keywords: 'career jobs roles riseup gain webtech', icon: ICONS.section, run: goTo('#experience') },
    { group: 'SECTIONS', title: 'Expertise', hint: '03', keywords: 'skills stack technologies', icon: ICONS.section, run: goTo('#expertise') },
    { group: 'SECTIONS', title: 'Selected Work', hint: '04', keywords: 'projects case studies wefi hibox qa sources', icon: ICONS.section, run: goTo('#work') },
    { group: 'SECTIONS', title: 'Impact', hint: '05', keywords: 'metrics numbers results', icon: ICONS.section, run: goTo('#impact') },
    { group: 'SECTIONS', title: 'Contact', hint: '06', keywords: 'email touch hire reach', icon: ICONS.section, run: goTo('#contact') },
    { group: 'ACTIONS', title: 'Download résumé', hint: 'PDF', keywords: 'cv resume download', icon: ICONS.doc, run: function () {
        var a = document.createElement('a');
        a.href = 'assets/resume/md-eshan-resume.pdf';
        a.download = 'md-eshan-resume.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
      } },
    { group: 'ACTIONS', title: 'Send an email', hint: 'MAIL', keywords: 'email contact message', icon: ICONS.mail, run: function () {
        window.location.href = 'mailto:mdeshan307@gmail.com';
      } },
    { group: 'ACTIONS', title: 'Copy email address', hint: 'COPY', keywords: 'email clipboard copy', icon: ICONS.copy, run: function () {
        copyText('mdeshan307@gmail.com', function () { showToast('Email address copied to clipboard'); });
      } },
    { group: 'ACTIONS', title: 'Call +880 18 2555 2234', hint: 'TEL', keywords: 'phone call mobile', icon: ICONS.phone, run: function () {
        window.location.href = 'tel:+8801825552234';
      } },
    { group: 'ACTIONS', title: 'Open GitHub profile', hint: '↗', keywords: 'github code repos', icon: ICONS.link, run: function () {
        window.open('https://github.com/eshanxbn', '_blank', 'noopener');
      } },
    { group: 'ACTIONS', title: 'Open LinkedIn profile', hint: '↗', keywords: 'linkedin network', icon: ICONS.link, run: function () {
        window.open('https://www.linkedin.com/in/eshanxbn', '_blank', 'noopener');
      } }
  ];

  function renderPalette(query) {
    var q = (query || '').trim().toLowerCase();
    visibleItems = COMMANDS.filter(function (cmd) {
      if (!q) return true;
      return (cmd.title + ' ' + cmd.keywords + ' ' + cmd.group).toLowerCase().indexOf(q) !== -1;
    });

    paletteList.innerHTML = '';
    activeIndex = 0;

    if (!visibleItems.length) {
      var empty = document.createElement('li');
      empty.className = 'palette-empty';
      empty.textContent = 'No matches — try “work”, “résumé”, or “email”.';
      paletteList.appendChild(empty);
      paletteInput.setAttribute('aria-activedescendant', '');
      return;
    }

    var lastGroup = null;
    visibleItems.forEach(function (cmd, i) {
      if (cmd.group !== lastGroup) {
        lastGroup = cmd.group;
        var group = document.createElement('li');
        group.className = 'palette-group';
        group.textContent = cmd.group;
        group.setAttribute('aria-hidden', 'true');
        paletteList.appendChild(group);
      }
      var item = document.createElement('li');
      item.className = 'palette-item' + (i === 0 ? ' active' : '');
      item.id = 'pal-opt-' + i;
      item.setAttribute('role', 'option');
      item.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      item.innerHTML = cmd.icon + '<span></span><span class="pal-hint"></span>';
      item.querySelector('span').textContent = cmd.title;
      item.querySelector('.pal-hint').textContent = cmd.hint;
      item.addEventListener('click', function () { runCommand(i); });
      item.addEventListener('mousemove', function () { setActive(i, false); });
      paletteList.appendChild(item);
    });
    paletteInput.setAttribute('aria-activedescendant', 'pal-opt-0');
  }

  function setActive(i, scroll) {
    if (!visibleItems.length) return;
    activeIndex = (i + visibleItems.length) % visibleItems.length;
    var items = paletteList.querySelectorAll('.palette-item');
    items.forEach(function (item, idx) {
      var isActive = idx === activeIndex;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-selected', String(isActive));
    });
    paletteInput.setAttribute('aria-activedescendant', 'pal-opt-' + activeIndex);
    if (scroll !== false) {
      var active = items[activeIndex];
      if (active && active.scrollIntoView) active.scrollIntoView({ block: 'nearest' });
    }
  }

  function runCommand(i) {
    var cmd = visibleItems[i];
    closePalette();
    if (cmd) cmd.run();
  }

  function openPalette(trigger) {
    if (paletteOpen) return;
    paletteOpen = true;
    lastTrigger = trigger || null;
    palette.hidden = false;
    document.body.style.overflow = 'hidden';
    paletteInput.value = '';
    renderPalette('');
    setTimeout(function () { paletteInput.focus(); }, 30);
  }

  function closePalette() {
    if (!paletteOpen) return;
    paletteOpen = false;
    palette.hidden = true;
    document.body.style.overflow = '';
    if (lastTrigger && lastTrigger.focus) lastTrigger.focus();
  }

  document.querySelectorAll('[data-open-palette]').forEach(function (btn) {
    btn.addEventListener('click', function () { openPalette(btn); });
  });
  palette.querySelector('[data-close-palette]').addEventListener('click', closePalette);

  paletteInput.addEventListener('input', function () { renderPalette(paletteInput.value); });
  paletteInput.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(activeIndex + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(activeIndex - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); runCommand(activeIndex); }
    else if (e.key === 'Tab') { e.preventDefault(); }
  });

  /* ---------- Global keyboard ---------- */

  document.addEventListener('keydown', function (e) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement && document.activeElement.tagName || '');

    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      paletteOpen ? closePalette() : openPalette(null);
      return;
    }
    if (e.key === '/' && !typing && !paletteOpen) {
      e.preventDefault();
      openPalette(null);
      return;
    }
    if (e.key === 'Escape') {
      if (paletteOpen) closePalette();
      else if (menuOpen) setMenu(false);
    }
  });

})();
