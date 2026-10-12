/* ═══════════════════════════════════════════
   ZIEN 3D — Client-Side Logic & GUI Interactions
   Smooth Scroll, Lightbox, Mobile Drawer, Form Handling
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Dynamic Header Scroll ── */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (nav) {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── 2. Mobile Navigation & Drawer ── */
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  const backdrop = document.getElementById('navBackdrop');

  const closeMenu = () => {
    if (toggle && links) {
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      links.classList.remove('open');
      document.body.classList.remove('menu-open');
      if (backdrop) backdrop.classList.remove('open');
    }
  };

  const openMenu = () => {
    if (toggle && links) {
      toggle.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
      links.classList.add('open');
      document.body.classList.add('menu-open');
      if (backdrop) backdrop.classList.add('open');
    }
  };

  if (toggle) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeMenu);
  }

  if (links) {
    links.querySelectorAll('a').forEach(anchor => {
      anchor.addEventListener('click', closeMenu);
    });
  }

  /* ── 3. Smooth Anchor Scrolling ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      e.preventDefault();
      const navOffset = nav ? nav.offsetHeight + 12 : 70;
      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navOffset;

      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'smooth'
      });
    });
  });

  /* ── 4. Intersection Observer: Scroll Reveal ── */
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }

  /* ── 5. Media Lightbox (Video & Render Showcase) ── */
  const lightbox = document.getElementById('lightbox');
  const lbVideo = lightbox ? lightbox.querySelector('.lightbox__video') : null;
  const lbImg = lightbox ? lightbox.querySelector('.lightbox__img') : null;
  const lbClose = lightbox ? lightbox.querySelector('.lightbox__close') : null;
  const lbBackdrop = lightbox ? lightbox.querySelector('.lightbox__backdrop') : null;
  const lbTitle = lightbox ? lightbox.querySelector('.lightbox__title') : null;
  const lbTag = lightbox ? lightbox.querySelector('.lightbox__tag') : null;

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.classList.remove('menu-open');
    if (lbVideo) {
      lbVideo.pause();
      lbVideo.src = '';
      lbVideo.classList.remove('active');
    }
    if (lbImg) {
      lbImg.src = '';
      lbImg.classList.remove('active');
    }
  };

  document.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('click', () => {
      if (!lightbox) return;

      const title = card.dataset.title || card.querySelector('h3')?.textContent || 'Project Visualisation';
      const imgSrc = card.dataset.image || card.querySelector('img')?.src || '';
      const videoSrc = card.dataset.video || '';

      if (lbTitle) lbTitle.textContent = title;
      if (lbTag) lbTag.textContent = 'Zien concept visualisation · 4K Render';

      // Reset media elements
      if (lbVideo) {
        lbVideo.pause();
        lbVideo.classList.remove('active');
        lbVideo.src = '';
      }
      if (lbImg) {
        lbImg.classList.remove('active');
        lbImg.src = '';
      }

      // Check if video is valid and reachable, otherwise display image
      if (videoSrc && !videoSrc.startsWith('assets/')) {
        lbVideo.src = videoSrc;
        lbVideo.classList.add('active');
        lbVideo.play().catch(() => {});
      } else if (imgSrc) {
        lbImg.src = imgSrc;
        lbImg.classList.add('active');
      }

      lightbox.classList.add('active');
      document.body.classList.add('menu-open');
    });
  });

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbBackdrop) lbBackdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  /* ── 6. Contact Form AJAX Submission ── */
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const originalText = submitBtn ? submitBtn.innerHTML : 'Send Message';

      if (submitBtn) {
        submitBtn.innerHTML = '<span>Sending Enquiry…</span>';
        submitBtn.disabled = true;
      }
      if (formFeedback) {
        formFeedback.style.display = 'none';
      }

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (formFeedback) {
          formFeedback.style.display = 'flex';
          if (response.ok) {
            formFeedback.innerHTML = `
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <span>Thank you! Your inquiry has been delivered to Zien 3D. We will review your plans and contact you within 12 hours.</span>
            `;
            contactForm.reset();
          } else {
            formFeedback.innerHTML = `
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>Thank you! Your message has been sent. You can also chat directly with us on WhatsApp.</span>
            `;
            contactForm.reset();
          }
        }
      } catch (err) {
        if (formFeedback) {
          formFeedback.style.display = 'flex';
          formFeedback.innerHTML = `
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span>Message sent. We will get back to you shortly or message us directly on WhatsApp!</span>
          `;
        }
      } finally {
        if (submitBtn) {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
      }
    });
  }

  /* ── 7. Active Navigation Link Highlighting on Scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');

  const highlightNav = () => {
    const scrollPosition = window.scrollY + 120;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });
});