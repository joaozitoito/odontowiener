'use strict';

const clinic = Object.freeze({
  whatsapp: '5553981298471',
  whatsappLabel: '(53) 98129-8471',
  phone: '+555333051999',
  phoneLabel: '(53) 3305-1999',
  address: 'Rua Quinze de Novembro, 707, Pelotas, Rio Grande do Sul'
});

const treatmentMessages = Object.freeze({
  'aparelhos-e-alinhadores-ortodonticos': 'Olá! Gostaria de saber mais sobre aparelhos e alinhadores ortodônticos.',
  'clareamento-dental': 'Olá! Gostaria de saber mais sobre clareamento dental.',
  'facetas-em-resina-ou-porcelana': 'Olá! Gostaria de saber mais sobre facetas em resina ou porcelana.',
  'implantes-dentarios': 'Olá! Gostaria de saber mais sobre implantes dentários.',
  'proteses-removiveis': 'Olá! Gostaria de saber mais sobre próteses removíveis.',
  'tratamento-de-canal': 'Olá! Gostaria de saber mais sobre o tratamento de canal.'
});

document.querySelectorAll('[data-whatsapp]').forEach(link => {
  const message = treatmentMessages[link.dataset.whatsapp]
    ?? 'Olá! Gostaria de conversar sobre o agendamento de uma consulta.';
  link.href = `https://wa.me/${clinic.whatsapp}?text=${encodeURIComponent(message)}`;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  if (link.hasAttribute('data-whatsapp-number')) link.textContent = clinic.whatsappLabel;
});
document.querySelectorAll('[data-phone]').forEach(link => {
  link.href = `tel:${clinic.phone}`;
  link.textContent = clinic.phoneLabel;
});
document.querySelectorAll('[data-address]').forEach(element => { element.textContent = clinic.address; });
document.querySelectorAll('[data-map]').forEach(link => {
  link.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.address)}`;
});

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navegacao');
function closeMenu(restoreFocus = false) {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
  if (restoreFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') closeMenu(true);
});
document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
window.matchMedia('(max-width: 800px)').addEventListener('change', () => closeMenu());
document.documentElement.classList.add('js');

const revealItems = [...document.querySelectorAll(
  '.section-heading, .treatments article, .history > .carousel, .history-copy, .team article, .map-card, .contact > div'
)];
revealItems.forEach((element, index) => {
  element.classList.add('reveal-item');
  element.style.setProperty('--reveal-delay', `${Math.min(index * 70, 220)}ms`);
});

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

  revealItems.forEach((element) => revealObserver.observe(element));
} else {
  revealItems.forEach((element) => element.classList.add('is-visible'));
}

const carousel = document.querySelector('#clinica .history > .carousel');
const slideArea = carousel.querySelector('.slides');
const slides = [...slideArea.querySelectorAll('.slide')];
const slideStatus = carousel.querySelector('[data-slide-status]');
const instructions = carousel.querySelector('#carousel-instructions');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const rotationDelay = 4000;
const treatmentViewport = document.querySelector('[data-treatment-viewport]');
const treatmentCards = [...treatmentViewport.querySelectorAll('.treatments article')];
const treatmentPrevious = document.querySelector('[data-treatment-prev]');
const treatmentNext = document.querySelector('[data-treatment-next]');

function updateTreatmentControls() {
  if (window.matchMedia('(max-width: 800px)').matches) {
    treatmentPrevious.disabled = true;
    treatmentNext.disabled = true;
    return;
  }
  const pageStart = treatmentCards[3].getBoundingClientRect().left
    - treatmentCards[0].getBoundingClientRect().left;
  const onSecondPage = treatmentViewport.scrollLeft >= pageStart - 1;
  treatmentPrevious.disabled = !onSecondPage;
  treatmentNext.disabled = onSecondPage;
}

function showTreatmentPage(page) {
  if (window.matchMedia('(max-width: 800px)').matches) return;
  const card = treatmentCards[page * 3];
  const left = card.getBoundingClientRect().left
    - treatmentViewport.getBoundingClientRect().left + treatmentViewport.scrollLeft;
  treatmentViewport.scrollTo({ left, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
}

treatmentPrevious.addEventListener('click', () => showTreatmentPage(0));
treatmentNext.addEventListener('click', () => showTreatmentPage(1));
treatmentViewport.addEventListener('scroll', updateTreatmentControls, { passive: true });
window.matchMedia('(max-width: 800px)').addEventListener('change', () => {
  treatmentViewport.scrollTo({ left: 0, behavior: 'auto' });
  updateTreatmentControls();
});
updateTreatmentControls();

let currentSlide = 0;
let pointerStart = null;
let rotationTimer;

function showSlide(index, announce = true) {
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, position) => {
    const active = position === currentSlide;
    slide.classList.toggle('is-active', active);
    slide.setAttribute('aria-hidden', String(!active));
    slide.inert = !active;
  });
  if (announce) {
    const description = slides[currentSlide].querySelector('img').alt;
    slideStatus.textContent = `Fotografia ${currentSlide + 1} de ${slides.length}: ${description}`;
  }
}

function canRotate() {
  if (document.hidden || reducedMotion.matches) return false;
  const { top, right, bottom, left, width, height } = carousel.getBoundingClientRect();
  return width > 0 && height > 0 && top < window.innerHeight && bottom > 0
    && left < window.innerWidth && right > 0;
}

function syncRotation() {
  if (!canRotate()) {
    window.clearTimeout(rotationTimer);
    rotationTimer = undefined;
    carousel.classList.remove('is-rotating');
    return;
  }
  if (rotationTimer !== undefined) return;
  carousel.classList.add('is-rotating');
  rotationTimer = window.setTimeout(() => {
    rotationTimer = undefined;
    if (!canRotate()) {
      carousel.classList.remove('is-rotating');
      return;
    }
    showSlide(currentSlide + 1, false);
    syncRotation();
  }, rotationDelay);
}

carousel.addEventListener('keydown', event => {
  const actions = { ArrowLeft: currentSlide - 1, ArrowRight: currentSlide + 1, Home: 0, End: slides.length - 1 };
  if (!Object.hasOwn(actions, event.key)) return;
  event.preventDefault();
  showSlide(actions[event.key]);
});

slideArea.addEventListener('pointerdown', event => {
  if (!event.isPrimary || event.button !== 0 || pointerStart) return;
  pointerStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
  slideArea.setPointerCapture(event.pointerId);
});
slideArea.addEventListener('pointerup', event => {
  if (pointerStart?.id !== event.pointerId) return;
  const deltaX = event.clientX - pointerStart.x;
  const deltaY = event.clientY - pointerStart.y;
  pointerStart = null;
  if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
    showSlide(currentSlide + (deltaX < 0 ? 1 : -1));
  }
});
function cancelSwipe(event) {
  if (pointerStart?.id === event.pointerId) pointerStart = null;
}
slideArea.addEventListener('pointercancel', cancelSwipe);
slideArea.addEventListener('lostpointercapture', cancelSwipe);
slideArea.addEventListener('dragstart', event => event.preventDefault());

showSlide(0, false);
carousel.classList.add('enhanced');
carousel.tabIndex = 0;
carousel.setAttribute('aria-describedby', instructions.id);
instructions.hidden = false;

window.addEventListener('scroll', syncRotation, { passive: true });
window.addEventListener('resize', syncRotation);
window.addEventListener('pageshow', syncRotation);
reducedMotion.addEventListener('change', syncRotation);
document.addEventListener('visibilitychange', syncRotation);
if (typeof IntersectionObserver === 'function') {
  // Mudanças de layout podem mover o carrossel sem rolagem ou redimensionamento.
  const carouselObserver = new IntersectionObserver(syncRotation);
  carouselObserver.observe(carousel);
}
syncRotation();
