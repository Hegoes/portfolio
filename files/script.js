/**
 * SUMONGAL BIJOY NEOG — PORTFOLIO
 * script.js
 *
 * Modules:
 *  1. Custom Cursor
 *  2. Navigation (scroll state, active section, mobile menu)
 *  3. Progress Bar
 *  4. Back-to-Top Button
 *  5. Scroll-based Intersection Observer (animate-on-scroll)
 *  6. Skill Trait Bar Animations
 *  7. Terminal Typewriter (hero)
 *  8. Role Typewriter (hero subtitle)
 *  9. Contact Form (tag selector + simulated submit)
 * 10. Smooth Anchor Scrolling
 */

'use strict';

/* ─────────────────────────────────────────────────────────────
   UTILITY: wait for DOM to be ready
   ───────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  initCursor();
  initNav();
  initProgressBar();
  initBackToTop();
  initScrollAnimations();
  initTraitBars();
  initTerminal();
  initRoleTypewriter();
  initContactForm();
  initSmoothScroll();

});


/* ─────────────────────────────────────────────────────────────
   1. CUSTOM CURSOR
   ───────────────────────────────────────────────────────────── */
function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  if (!cursor || !follower) return;

  // Track mouse position with separate velocities for cursor vs follower
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Snap cursor dot immediately
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Follower uses a lerp animation loop for smooth trailing effect
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover state: enlarge follower on interactive elements
  const interactives = 'a, button, .project-card, .skill-card, .pos-card, input, textarea, .form-tag';
  document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor--hover');
      follower.classList.add('cursor--hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor--hover');
      follower.classList.remove('cursor--hover');
    });
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity   = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity   = '1';
    follower.style.opacity = '1';
  });
}


/* ─────────────────────────────────────────────────────────────
   2. NAVIGATION
   ───────────────────────────────────────────────────────────── */
function initNav() {
  const nav        = document.getElementById('nav');
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks   = document.querySelectorAll('.nav__link');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link');

  if (!nav) return;

  /* ── Scroll state (adds background + blur) ── */
  const handleNavScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // run once on load

  /* ── Active section highlight ── */
  // Collect all sections referenced from nav
  const sections = Array.from(document.querySelectorAll('section[id]'));

  const observerOptions = {
    rootMargin: '-40% 0px -50% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, observerOptions);

  sections.forEach(s => sectionObserver.observe(s));

  /* ── Mobile menu toggle ── */
  const toggleMenu = () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    // Prevent body scroll when menu open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggleMenu);

  // Close menu on mobile link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on backdrop click (click outside nav area in mobile menu)
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) toggleMenu();
  });
}


/* ─────────────────────────────────────────────────────────────
   3. PROGRESS BAR
   ───────────────────────────────────────────────────────────── */
function initProgressBar() {
  const bar = document.getElementById('progressBar');
  if (!bar) return;

  const updateProgress = () => {
    const scrollTop    = document.documentElement.scrollTop;
    const totalHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const progress     = totalHeight > 0 ? (scrollTop / totalHeight) * 100 : 0;
    bar.style.width    = progress + '%';
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
}


/* ─────────────────────────────────────────────────────────────
   4. BACK-TO-TOP BUTTON
   ───────────────────────────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ─────────────────────────────────────────────────────────────
   5. SCROLL-BASED INTERSECTION OBSERVER (animate-on-scroll)
   ───────────────────────────────────────────────────────────── */
function initScrollAnimations() {
  const animatedEls = document.querySelectorAll('[data-animate]');
  if (!animatedEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Unobserve after triggering so it doesn't re-run
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  animatedEls.forEach(el => observer.observe(el));

  // Hero section elements start as visible (above the fold)
  const heroEls = document.querySelectorAll('.hero [data-animate]');
  // Short stagger delay, then add in-view directly
  heroEls.forEach((el, i) => {
    const delay = parseInt(el.dataset.delay || 0, 10);
    setTimeout(() => {
      el.classList.add('in-view');
    }, 150 + delay * 120);
  });
}


/* ─────────────────────────────────────────────────────────────
   6. SKILL TRAIT BAR ANIMATIONS
   ───────────────────────────────────────────────────────────── */
function initTraitBars() {
  const bars = document.querySelectorAll('[data-animate="bar"]');
  if (!bars.length) return;

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const width = el.dataset.width || '0';
        const fill  = el.querySelector('.trait__fill');
        if (fill) {
          // Small delay so the section-in-view animation plays first
          setTimeout(() => {
            fill.style.width = width + '%';
          }, 200);
        }
        barObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => barObserver.observe(bar));
}


/* ─────────────────────────────────────────────────────────────
   7. TERMINAL TYPEWRITER (hero right card)
   ───────────────────────────────────────────────────────────── */
function initTerminal() {
  const body = document.getElementById('terminalBody');
  if (!body) return;

  /* Define the terminal lines to type out */
  const lines = [
    { type: 'prompt', text: '$ whoami' },
    { type: 'output', html: '<span class="t-val">sumongal_bijoy_neog</span>' },
    { type: 'blank' },
    { type: 'prompt', text: '$ HeGoes profile.txt' },
    { type: 'output', html: '<span class="t-key">university:</span> <span class="t-str">SRMIST (2023–27)</span>' },
    { type: 'output', html: '<span class="t-key">focus:</span>     <span class="t-str">AI · Backend · Web Dev</span>' },
    { type: 'blank' },
    { type: 'prompt', text: '$ git log --oneline' },
    { type: 'output', html: '<span class="t-comment">a4f9c12</span> <span class="t-str">feat: semantic doc search (NTPC)</span>' },
    { type: 'output', html: '<span class="t-comment">d2e7b08</span> <span class="t-str">feat: smart resume matcher</span>' },
    { type: 'output', html: '<span class="t-comment">1f3ca44</span> <span class="t-str">feat: space facts blog</span>' },
    { type: 'blank' },
    { type: 'prompt', text: '$ echo $STATUS' },
    { type: 'output', html: '<span class="t-bool">open_to_work=true</span>' },
  ];

  let lineIndex = 0;

  /**
   * Append a single line (prompt or output) to the terminal body.
   * Prompt lines get a character-by-character typing effect.
   * Output lines appear instantly.
   */
  function appendLine(lineObj, callback) {
    const span = document.createElement('span');
    span.classList.add('t-line');

    if (lineObj.type === 'blank') {
      span.innerHTML = '&nbsp;';
      body.appendChild(span);
      scrollTerminal();
      if (callback) setTimeout(callback, 80);
      return;
    }

    if (lineObj.type === 'output') {
      span.innerHTML = lineObj.html;
      body.appendChild(span);
      scrollTerminal();
      if (callback) setTimeout(callback, 60);
      return;
    }

    // Prompt line: type character by character
    if (lineObj.type === 'prompt') {
      span.innerHTML = '<span class="t-prompt">$ </span>';
      body.appendChild(span);

      const textNode = document.createElement('span');
      textNode.classList.add('t-cmd');
      span.appendChild(textNode);

      // Remove the "$ " prefix from the text
      const rawText = lineObj.text.replace(/^\$ /, '');
      let charIdx   = 0;

      const typeChar = () => {
        if (charIdx < rawText.length) {
          textNode.textContent += rawText[charIdx++];
          scrollTerminal();
          setTimeout(typeChar, 40 + Math.random() * 25);
        } else {
          // Done typing this line
          scrollTerminal();
          if (callback) setTimeout(callback, 180);
        }
      };

      setTimeout(typeChar, 100);
    }
  }

  /** Auto-scroll terminal to bottom */
  function scrollTerminal() {
    body.scrollTop = body.scrollHeight;
  }

  /** Process lines one-by-one with staggered timing */
  function processNextLine() {
    if (lineIndex >= lines.length) return; // all done
    const current = lines[lineIndex++];
    appendLine(current, processNextLine);
  }

  // Start after a short delay to let the hero entrance animation play
  setTimeout(processNextLine, 800);
}


/* ─────────────────────────────────────────────────────────────
   8. ROLE TYPEWRITER (hero subtitle rotating roles)
   ───────────────────────────────────────────────────────────── */
function initRoleTypewriter() {
  const el = document.getElementById('roleText');
  if (!el) return;

 const roles = [
  'Building Intelligent Systems',
  'Backend + AI Developer',
  'Turning Ideas into Scalable Products'
];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  /**
   * Core typewriter tick:
   * — typing:   add one character
   * — deleting: remove one character
   * — at end:   pause, then switch to delete mode
   * — at start: switch role, then type
   */
  function tick() {
    const current = roles[roleIndex];

    if (isDeleting) {
      el.textContent = current.substring(0, --charIndex);
    } else {
      el.textContent = current.substring(0, ++charIndex);
    }

    let delay = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === current.length) {
      // Pause at full word
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Switch to next role
      isDeleting  = false;
      roleIndex   = (roleIndex + 1) % roles.length;
      delay       = 400;
    }

    setTimeout(tick, delay);
  }

  // Start after a brief warm-up delay
  setTimeout(tick, 1200);
}


/* ─────────────────────────────────────────────────────────────
   9. CONTACT FORM
   ───────────────────────────────────────────────────────────── */
function initContactForm() {
  /* ── Tag selector ── */
  const tags = document.querySelectorAll('.form-tag');
  tags.forEach(tag => {
    tag.addEventListener('click', () => {
      // Toggle selected state on click
      tag.classList.toggle('selected');
    });
  });

  /* ── Form submission (simulated — no backend) ── */
  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const successEl = document.getElementById('formSuccess');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic client-side validation
    const name    = form.querySelector('#name').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      // Highlight empty required fields
      [{ id: 'name', val: name }, { id: 'email', val: email }, { id: 'message', val: message }]
        .forEach(({ id, val }) => {
          const input = form.querySelector(`#${id}`);
          if (!val) {
            input.style.borderColor = '#ff6b6b';
            input.addEventListener('input', () => {
              input.style.borderColor = '';
            }, { once: true });
          }
        });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const emailInput = form.querySelector('#email');
      emailInput.style.borderColor = '#ff6b6b';
      emailInput.addEventListener('input', () => {
        emailInput.style.borderColor = '';
      }, { once: true });
      return;
    }

    // Show loading state
    const submitText    = submitBtn.querySelector('.submit-text');
    const submitLoading = submitBtn.querySelector('.submit-loading');
    const submitArrow   = submitBtn.querySelector('.submit-arrow');

    submitText.style.display    = 'none';
    submitLoading.style.display = 'flex';
    submitArrow.style.display   = 'none';
    submitBtn.disabled          = true;

    // Simulate async send (2 seconds)
    setTimeout(() => {
      // Reset button
      submitText.style.display    = '';
      submitLoading.style.display = 'none';
      submitArrow.style.display   = '';
      submitBtn.disabled          = false;

      // Show success message
      successEl.style.display = 'flex';

      // Reset form fields
      form.reset();
      tags.forEach(t => t.classList.remove('selected'));

      // Auto-hide success after 5 seconds
      setTimeout(() => {
        successEl.style.display = 'none';
      }, 5000);

    }, 2000);
  });
}


/* ─────────────────────────────────────────────────────────────
   10. SMOOTH ANCHOR SCROLLING
   (Handles nav links and any [href^="#"] anchor)
   ───────────────────────────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '72',
        10
      );

      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}
