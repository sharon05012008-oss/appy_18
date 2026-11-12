/**
 * CYBER + CAFÉ - MAIN JAVASCRIPT
 * Premium Interactions, Smooth Scroll, Lightbox & Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. MOBILE NAVIGATION TOGGLE ---
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu when a nav link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside header
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- 2. SMOOTH SCROLL WITH HEADER OFFSET ---
  const headerWrapper = document.querySelector('.header-wrapper');
  const getHeaderHeight = () => (headerWrapper ? headerWrapper.offsetHeight : 70);

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        const elementPosition = targetElem.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - getHeaderHeight() + 2;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- 3. ACTIVE NAV HIGHLIGHT (SCROLLSPY) ---
  const sections = document.querySelectorAll('section[id]');
  
  const handleScrollSpy = () => {
    const scrollY = window.pageYOffset;
    const headerHeight = getHeaderHeight();

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - headerHeight - 80;
      const sectionId = section.getAttribute('id');
      const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (correspondingLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          correspondingLink.classList.add('active');
        } else {
          correspondingLink.classList.remove('active');
        }
      }
    });
  };

  window.addEventListener('scroll', handleScrollSpy, { passive: true });
  handleScrollSpy();

  // --- 4. VISUAL GALLERY FILTERING ---
  const filterTabs = document.querySelectorAll('.filter-tab');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.opacity = '1';
          }, 50);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // --- 5. LIGHTBOX MODAL FOR COFFEE PHOTOGRAPHY ---
  const imageModal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalClose = document.getElementById('modalClose');

  if (imageModal && modalImage) {
    const openModal = (imgSrc, title, desc) => {
      modalImage.src = imgSrc;
      modalImage.alt = title;
      if (modalTitle) modalTitle.textContent = title;
      if (modalDesc) modalDesc.textContent = desc || '';
      imageModal.classList.add('active');
      document.body.style.overflow = 'hidden'; // prevent scrolling behind
    };

    const closeModal = () => {
      imageModal.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => {
        modalImage.src = '';
      }, 300);
    };

    // Attach click to gallery items
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const title = item.querySelector('.gallery-title')?.textContent || 'CYBER + CAFÉ Visual';
        const desc = item.querySelector('.gallery-caption')?.textContent || '';
        if (img) {
          openModal(img.src, title, desc);
        }
      });
    });

    // Also attach to hero showcase cards
    document.querySelectorAll('.showcase-card').forEach(card => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        const img = card.querySelector('img');
        const title = card.getAttribute('data-caption') || 'CYBER + CAFÉ Space';
        if (img) {
          openModal(img.src, title, 'Where coffee craftsmanship meets modern computing aesthetics.');
        }
      });
    });

    if (modalClose) {
      modalClose.addEventListener('click', closeModal);
    }

    imageModal.addEventListener('click', (e) => {
      if (e.target === imageModal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && imageModal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // --- 6. SCROLL TO TOP BUTTON ---
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 450) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- 7. CONTACT INQUIRY FORM SUBMISSION (PREVIEW HANDLER) ---
  const inquiryForm = document.getElementById('inquiryForm');
  const formSuccessNotice = document.getElementById('formSuccessNotice');

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = inquiryForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending...';

      setTimeout(() => {
        inquiryForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        if (formSuccessNotice) {
          formSuccessNotice.style.display = 'block';
          setTimeout(() => {
            formSuccessNotice.style.display = 'none';
          }, 5000);
        }
      }, 800);
    });
  }
});
