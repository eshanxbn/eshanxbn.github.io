/**
 * MD. ESHAN - PORTFOLIO INTERACTIVE CONTROLLER
 * Vanilla JavaScript (ES6+) - Zero dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. PRELOADER & INITIALIZATION
  initPreloader();

  // 2. THEME CONTROLLER
  initThemeToggle();

  // 3. CUSTOM CURSOR & SPOTLIGHT
  initCustomCursor();

  // 4. COMMAND PALETTE (Ctrl + K)
  initCommandPalette();

  // 5. TYPING ANIMATION (Hero)
  initTypingEffect();

  // 6. CODE SHOWCASE TABS
  initCodeTabs();

  // 7. INTERSECTION OBSERVER (Reveals, Counters, ScrollSpy)
  initScrollObservers();

  // 8. 3D TILT EFFECT ON CARDS
  init3DTilt();

  // 9. PROJECT FILTER SYSTEM
  initProjectFilter();

  // 10. SKILLS & TECH STACK SEARCH FILTER
  initSkillSearch();

  // 11. SCROLL PROGRESS & BACK-TO-TOP BUTTON
  initScrollIndicators();

  // 12. CONTACT FORM VALIDATION & INTERACTION
  initContactForm();

  // 13. RESUME MODAL & ACTION
  initResumeModal();
});

/* ----------------------------------------------------
 * 1. PRELOADER
 * ---------------------------------------------------- */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const countEl = document.getElementById('preloader-count');
  
  if (!preloader) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => preloader.remove(), 600);
      }, 300);
    }
    if (countEl) countEl.textContent = `${progress}%`;
  }, 40);
}

/* ----------------------------------------------------
 * 2. THEME SWITCHER (Dark / Light persistence)
 * ---------------------------------------------------- */
function initThemeToggle() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const savedTheme = localStorage.getItem('theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
    document.documentElement.classList.add('light');
    updateThemeIcon(true);
  } else {
    document.documentElement.classList.remove('light');
    updateThemeIcon(false);
  }

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isLight = document.documentElement.classList.toggle('light');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      updateThemeIcon(isLight);
    });
  });

  function updateThemeIcon(isLight) {
    document.querySelectorAll('.sun-icon').forEach(el => el.classList.toggle('hidden', !isLight));
    document.querySelectorAll('.moon-icon').forEach(el => el.classList.toggle('hidden', isLight));
  }
}

/* ----------------------------------------------------
 * 3. CUSTOM CURSOR & SPOTLIGHT
 * ---------------------------------------------------- */
function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  const spotlight = document.getElementById('cursor-spotlight');

  // Check if touch device
  if (window.matchMedia('(pointer: coarse)').matches || !cursor) return;
  
  document.body.classList.add('has-custom-cursor');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (spotlight) {
      spotlight.style.left = `${mouseX}px`;
      spotlight.style.top = `${mouseY}px`;
    }
  });

  function renderCursor() {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;

    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Interactive targets
  const interactiveEls = document.querySelectorAll('a, button, input, textarea, [role="button"], .tilt-card');
  interactiveEls.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });
}

/* ----------------------------------------------------
 * 4. COMMAND PALETTE (Ctrl + K)
 * ---------------------------------------------------- */
function initCommandPalette() {
  const paletteModal = document.getElementById('command-palette-modal');
  const paletteInput = document.getElementById('command-palette-input');
  const paletteResults = document.getElementById('command-palette-results');
  const openBtns = document.querySelectorAll('.open-cmd-palette');
  const closeBtns = document.querySelectorAll('.close-cmd-palette');

  if (!paletteModal) return;

  const commands = [
    { title: 'Go to Hero Section', action: () => scrollToSection('#hero'), icon: 'hero' },
    { title: 'Go to About Section', action: () => scrollToSection('#about'), icon: 'user' },
    { title: 'View Experience Timeline', action: () => scrollToSection('#experience'), icon: 'briefcase' },
    { title: 'Explore Featured Projects', action: () => scrollToSection('#projects'), icon: 'folder' },
    { title: 'Check Technical Skills', action: () => scrollToSection('#skills'), icon: 'code' },
    { title: 'View Achievements & Metrics', action: () => scrollToSection('#achievements'), icon: 'award' },
    { title: 'Send a Message / Contact', action: () => scrollToSection('#contact'), icon: 'mail' },
    { title: 'Download Resume (PDF)', action: () => openResumeModal(), icon: 'file' },
    { title: 'Toggle Dark / Light Theme', action: () => document.querySelector('.theme-toggle-btn')?.click(), icon: 'sun' },
    { title: 'Visit GitHub Profile', action: () => window.open('https://github.com', '_blank'), icon: 'github' },
    { title: 'Visit LinkedIn Profile', action: () => window.open('https://linkedin.com', '_blank'), icon: 'linkedin' }
  ];

  function openPalette() {
    paletteModal.classList.remove('hidden');
    paletteModal.classList.add('flex');
    setTimeout(() => paletteInput?.focus(), 50);
    renderCommands(commands);
  }

  function closePalette() {
    paletteModal.classList.add('hidden');
    paletteModal.classList.remove('flex');
    if (paletteInput) paletteInput.value = '';
  }

  openBtns.forEach(btn => btn.addEventListener('click', openPalette));
  closeBtns.forEach(btn => btn.addEventListener('click', closePalette));

  // Keyboard shortcut listener (Ctrl+K or Cmd+K)
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      paletteModal.classList.contains('hidden') ? openPalette() : closePalette();
    }
    if (e.key === 'Escape' && !paletteModal.classList.contains('hidden')) {
      closePalette();
    }
  });

  // Filter commands
  paletteInput?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const filtered = commands.filter(c => c.title.toLowerCase().includes(query));
    renderCommands(filtered);
  });

  function renderCommands(items) {
    if (!paletteResults) return;
    if (items.length === 0) {
      paletteResults.innerHTML = `<div class="p-4 text-center text-gray-400">No results found</div>`;
      return;
    }

    paletteResults.innerHTML = items.map((cmd, idx) => `
      <button class="cmd-item w-full flex items-center justify-between p-3 rounded-lg hover:bg-indigo-600/20 hover:text-cyan-400 text-left transition-colors ${idx === 0 ? 'bg-indigo-600/10 text-cyan-400' : 'text-gray-300'}" data-index="${idx}">
        <span class="font-medium flex items-center gap-3">
          <svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          ${cmd.title}
        </span>
        <span class="text-xs text-gray-500 font-mono">Press ↵</span>
      </button>
    `).join('');

    const cmdButtons = paletteResults.querySelectorAll('.cmd-item');
    cmdButtons.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        items[idx].action();
        closePalette();
      });
    });
  }

  function scrollToSection(id) {
    const section = document.querySelector(id);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  }
}

/* ----------------------------------------------------
 * 5. TYPING ANIMATION (Hero Section)
 * ---------------------------------------------------- */
function initTypingEffect() {
  const typingEl = document.getElementById('hero-typing-text');
  if (!typingEl) return;

  const roles = [
    'Senior Software Engineer',
    'Scalable SaaS Architect',
    'High-Performance API Engineer',
    'Cloud-Native & DevOps Lead'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const typeSpeed = 80;
  const deleteSpeed = 40;
  const pauseDelay = 2000;

  function type() {
    const currentRole = roles[roleIdx];
    
    if (isDeleting) {
      typingEl.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
    } else {
      typingEl.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
    }

    let delta = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIdx === currentRole.length) {
      delta = pauseDelay;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      delta = 500;
    }

    setTimeout(type, delta);
  }

  type();
}

/* ----------------------------------------------------
 * 6. CODE SHOWCASE WIDGET TABS
 * ---------------------------------------------------- */
function initCodeTabs() {
  const codeButtons = document.querySelectorAll('.code-tab-btn');
  const codeDisplays = document.querySelectorAll('.code-tab-content');

  codeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      codeButtons.forEach(b => {
        b.classList.remove('bg-indigo-600/30', 'border-indigo-500', 'text-cyan-400');
        b.classList.add('text-gray-400', 'border-transparent');
      });

      btn.classList.add('bg-indigo-600/30', 'border-indigo-500', 'text-cyan-400');
      btn.classList.remove('text-gray-400', 'border-transparent');

      codeDisplays.forEach(display => {
        display.classList.toggle('hidden', display.id !== `code-${target}`);
      });
    });
  });
}

/* ----------------------------------------------------
 * 7. INTERSECTION OBSERVER (Scroll Reveal, Counter & Nav)
 * ---------------------------------------------------- */
function initScrollObservers() {
  // Reveal elements on scroll
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));

  // CountUp Observer
  const counterElements = document.querySelectorAll('.counter-val');
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(el => counterObserver.observe(el));

  function startCounter(el) {
    const target = parseInt(el.dataset.target, 10) || 0;
    const suffix = el.dataset.suffix || '';
    let current = 0;
    const duration = 2000;
    const stepTime = Math.abs(Math.floor(duration / target)) || 30;

    const timer = setInterval(() => {
      current += 1;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = `${current}${suffix}`;
    }, stepTime);
  }

  // Active Navbar ScrollSpy
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentSection = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
        currentSection = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-cyan-400', 'font-semibold');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('text-cyan-400', 'font-semibold');
      }
    });
  });
}

/* ----------------------------------------------------
 * 8. 3D TILT EFFECT ON CARDS
 * ---------------------------------------------------- */
function init3DTilt() {
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* ----------------------------------------------------
 * 9. PROJECT FILTER SYSTEM
 * ---------------------------------------------------- */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.filter;

      filterBtns.forEach(b => {
        b.classList.remove('bg-indigo-600', 'text-white', 'shadow-lg');
        b.classList.add('bg-gray-800/60', 'text-gray-400');
      });

      btn.classList.add('bg-indigo-600', 'text-white', 'shadow-lg');
      btn.classList.remove('bg-gray-800/60', 'text-gray-400');

      projectCards.forEach(card => {
        const cardCats = card.dataset.category ? card.dataset.category.split(' ') : [];
        if (category === 'all' || cardCats.includes(category)) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ----------------------------------------------------
 * 10. SKILL & TECH STACK SEARCH
 * ---------------------------------------------------- */
function initSkillSearch() {
  const skillInput = document.getElementById('skill-search-input');
  const skillCards = document.querySelectorAll('.skill-card, .tech-pill');

  if (!skillInput) return;

  skillInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    skillCards.forEach(card => {
      const text = card.textContent.toLowerCase();
      if (text.includes(query)) {
        card.style.display = 'flex';
        card.style.opacity = '1';
      } else {
        card.style.opacity = '0';
        card.style.display = 'none';
      }
    });
  });
}

/* ----------------------------------------------------
 * 11. SCROLL PROGRESS & BACK TO TOP
 * ---------------------------------------------------- */
function initScrollIndicators() {
  const progressBar = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (scrollTop / docHeight) * 100;

    if (progressBar) progressBar.style.width = `${scrolled}%`;

    if (backToTopBtn) {
      if (scrollTop > 400) {
        backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.add('opacity-100');
      } else {
        backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.remove('opacity-100');
      }
    }
  });

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ----------------------------------------------------
 * 12. CONTACT FORM INTERACTION
 * ---------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');
  const statusEl = document.getElementById('contact-status');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Sending Message...</span>
      `;
    }

    setTimeout(() => {
      form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          <span>Message Sent Successfully!</span>
        `;
        setTimeout(() => {
          submitBtn.innerHTML = `
            <span>Send Message</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          `;
        }, 3000);
      }
      if (statusEl) {
        statusEl.classList.remove('hidden');
        statusEl.textContent = "Thank you for reaching out! MD. Eshan will get back to you shortly.";
      }
    }, 1500);
  });
}

/* ----------------------------------------------------
 * 13. RESUME MODAL & DOWNLOAD
 * ---------------------------------------------------- */
function openResumeModal() {
  const modal = document.getElementById('resume-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.classList.add('overflow-hidden');
  }
}

function closeResumeModal() {
  const modal = document.getElementById('resume-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.classList.remove('overflow-hidden');
  }
}

function initResumeModal() {
  const downloadBtns = document.querySelectorAll('.download-resume-btn');
  downloadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openResumeModal();
    });
  });

  const closeBtns = document.querySelectorAll('.close-resume-modal');
  closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeResumeModal();
    });
  });

  // Handle background click on close
  const modal = document.getElementById('resume-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('close-resume-modal')) {
        closeResumeModal();
      }
    });
  }

  // Handle escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeResumeModal();
    }
  });

  // Print button listener
  const printBtn = document.getElementById('print-resume-btn');
  if (printBtn) {
    printBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.open('./cv-html/index.html?print=true', '_blank');
    });
  }
}
