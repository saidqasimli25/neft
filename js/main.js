
// Loader
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = '0';
      loader.style.pointerEvents = 'none';

      setTimeout(() => {
        loader.style.display = 'none';
      }, 600);
    }, 800);
  }
});

// Mobile menu
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    mobileMenu.classList.add('active');
  });
}

if (mobileClose && mobileMenu) {
  mobileClose.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
  });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute('href'));

    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }

    if (mobileMenu) {
      mobileMenu.classList.remove('active');
    }
  });
});

// Back to top button
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (!backToTop) return;

  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Navbar active link
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;

    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');

    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

// Reveal animations
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealOnScroll = () => {
  const triggerBottom = window.innerHeight * 0.88;

  revealElements.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < triggerBottom) {
      el.classList.add('visible');
    }
  });

  document.querySelectorAll('.tl-item').forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < triggerBottom) {
      el.classList.add('tl-visible');
    }
  });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();
