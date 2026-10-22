'use strict';

// Dados fornecidos no briefing, ainda sujeitos à validação pela clínica.
const clinic = Object.freeze({
  whatsapp: '5553981298471',
  whatsappLabel: '(53) 98129-8471',
  phone: '+555333051999',
  phoneLabel: '(53) 3305-1999',
  address: 'Rua Quinze de Novembro, 707, Pelotas/RS',
  confirmed: false
});

document.querySelectorAll('[data-whatsapp]').forEach(link => {
  const treatment = link.dataset.whatsapp;
  const message = treatment
    ? `Olá! Gostaria de saber mais sobre o tratamento de ${treatment}.`
    : 'Olá! Gostaria de conversar sobre o agendamento de uma consulta.';
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
const mapAddress = document.querySelector('.map-placeholder > p');
if (mapAddress) mapAddress.textContent = clinic.address;

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

// Mostrar a imagem exportada somente após carregamento válido; manter a reserva em caso de erro.
document.querySelectorAll('.treatment-media').forEach(media => {
  const image = media.querySelector('img');
  const placeholder = media.querySelector('.image-placeholder');
  image.addEventListener('load', () => { image.hidden = false; placeholder.hidden = true; });
  image.addEventListener('error', () => { image.hidden = true; placeholder.hidden = false; });
  if (image.complete && image.naturalWidth > 0) { image.hidden = false; placeholder.hidden = true; }
});

const carousel = document.querySelector('.carousel');
const slides = [...carousel.querySelectorAll('.slide')];
const dots = [...carousel.querySelectorAll('.dots button')];
const slideStatus = carousel.querySelector('[data-slide-status]');
const autoplayButton = carousel.querySelector('[data-autoplay]');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let currentSlide = 0;
let userPaused = false;
let hovered = carousel.matches(':hover');
let focused = carousel.contains(document.activeElement);
let inViewport = false;
let timer = null;
let pointerStart = null;

function scheduleAutoplay() {
  window.clearTimeout(timer);
  timer = null;
  if (userPaused || hovered || focused || pointerStart || !inViewport || document.hidden || motionPreference.matches) return;
  timer = window.setTimeout(() => {
    showSlide(currentSlide + 1, false);
    scheduleAutoplay();
  }, 5000);
}
function showSlide(index, announce = true) {
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, position) => {
    const active = position === currentSlide;
    slide.classList.toggle('is-active', active);
    slide.setAttribute('aria-hidden', String(!active));
    slide.inert = !active;
  });
  dots.forEach((dot, position) => {
    if (position === currentSlide) dot.setAttribute('aria-current', 'true');
    else dot.removeAttribute('aria-current');
  });
  // Avanços automáticos não geram anúncios repetitivos para leitores de tela.
  if (announce) slideStatus.textContent = `Fotografia ${currentSlide + 1} de ${slides.length}: ${slides[currentSlide].querySelector('figcaption').textContent}`;
}
function manualSlide(index) {
  showSlide(index);
  scheduleAutoplay();
}
function updateAutoplayButton() {
  autoplayButton.disabled = motionPreference.matches;
  autoplayButton.textContent = motionPreference.matches
    ? 'Reprodução automática desativada: movimento reduzido'
    : userPaused ? 'Retomar reprodução automática' : 'Pausar reprodução automática';
}
autoplayButton.addEventListener('click', () => {
  userPaused = !userPaused;
  updateAutoplayButton();
  scheduleAutoplay();
});
carousel.querySelector('[data-previous]').addEventListener('click', () => manualSlide(currentSlide - 1));
carousel.querySelector('[data-next]').addEventListener('click', () => manualSlide(currentSlide + 1));
dots.forEach((dot, index) => dot.addEventListener('click', () => manualSlide(index)));
carousel.addEventListener('keydown', event => {
  const actions = { ArrowLeft: currentSlide - 1, ArrowRight: currentSlide + 1, Home: 0, End: slides.length - 1 };
  if (Object.hasOwn(actions, event.key)) { event.preventDefault(); manualSlide(actions[event.key]); }
});
carousel.addEventListener('mouseenter', () => { hovered = true; scheduleAutoplay(); });
carousel.addEventListener('mouseleave', () => { hovered = false; scheduleAutoplay(); });
carousel.addEventListener('focusin', () => { focused = true; scheduleAutoplay(); });
carousel.addEventListener('focusout', event => {
  focused = carousel.contains(event.relatedTarget);
  scheduleAutoplay();
});
document.addEventListener('visibilitychange', scheduleAutoplay);
motionPreference.addEventListener('change', () => { updateAutoplayButton(); scheduleAutoplay(); });
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    inViewport = entries[0].isIntersecting;
    scheduleAutoplay();
  });
  observer.observe(carousel);
} // Sem suporte, mantém navegação manual e evita autoplay fora da tela.
const slideArea = carousel.querySelector('.slides');
slideArea.addEventListener('pointerdown', event => {
  if (!event.isPrimary || event.button !== 0) return;
  pointerStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
  slideArea.setPointerCapture(event.pointerId);
  scheduleAutoplay();
});
slideArea.addEventListener('pointerup', event => {
  if (!pointerStart || pointerStart.id !== event.pointerId) return;
  const deltaX = event.clientX - pointerStart.x;
  const deltaY = event.clientY - pointerStart.y;
  pointerStart = null;
  if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) manualSlide(currentSlide + (deltaX < 0 ? 1 : -1));
  else scheduleAutoplay();
});
function cancelSwipe() { pointerStart = null; scheduleAutoplay(); }
slideArea.addEventListener('pointercancel', cancelSwipe);
slideArea.addEventListener('lostpointercapture', cancelSwipe);
slideArea.addEventListener('dragstart', event => event.preventDefault());
carousel.classList.add('enhanced');
carousel.querySelector('.carousel-controls').hidden = false;
autoplayButton.hidden = false;
updateAutoplayButton();
showSlide(0, false);
scheduleAutoplay();