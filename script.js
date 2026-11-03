'use strict';

// Endereço, 15 anos e registros confirmados no briefing de acabamento.
// Telefones e responsável técnico continuam pendentes.
const clinic = Object.freeze({
  whatsapp: '5553981298471',
  whatsappLabel: '(53) 98129-8471',
  phone: '+555333051999',
  phoneLabel: '(53) 3305-1999',
  address: 'Rua Quinze de Novembro, 707, Pelotas, Rio Grande do Sul',
  confirmed: Object.freeze({ address: true, historyYears: true, registrations: true, phones: false, technicalDirector: false })
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

// Restrito à História: o hero não participa da reprodução.
const carousel = document.querySelector('#clinica .history > .carousel');
const slides = [...carousel.querySelectorAll('.slide')];
const videos = slides.map(slide => slide.querySelector('video'));
const slideStatus = carousel.querySelector('[data-slide-status]');
const autoplayButton = carousel.querySelector('[data-autoplay]');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let currentSlide = 0;
let userPaused = false;
let focused = carousel.contains(document.activeElement);
let inViewport = false;
let pointerStart = null;
let fallbackTimer = null;
let playbackBlocked = false;
let swiped = false;
const playRequests = new WeakSet();

// Sem src até a História entrar na tela; autoplay nunca vale para os inativos.
videos.forEach(video => { video.autoplay = false; video.muted = true; });

function canPlay() {
  return !userPaused && !focused && !pointerStart && inViewport
    && !document.hidden && !motionPreference.matches && !playbackBlocked;
}

function loadVideo(index) {
  const video = videos[index];
  if (video.hasAttribute('src') || video.error) return;
  video.preload = 'auto';
  video.src = video.dataset.src;
  video.load();
}

function prepareVideos() {
  if (!inViewport || document.hidden || motionPreference.matches) return;
  loadVideo(currentSlide);
  // Só antecipar o próximo depois de o atual ter um quadro decodificado.
  if (videos[currentSlide].readyState >= 2 || videos[currentSlide].error) {
    loadVideo((currentSlide + 1) % videos.length);
  }
}

function updateAutoplayButton() {
  autoplayButton.setAttribute('aria-label', motionPreference.matches
    ? 'Próximo ambiente da clínica'
    : playbackBlocked ? 'Reproduzir vídeo'
      : userPaused ? 'Retomar vídeos da clínica' : 'Pausar vídeos da clínica');
  if (motionPreference.matches) autoplayButton.removeAttribute('aria-pressed');
  else autoplayButton.setAttribute('aria-pressed', String(userPaused));
}

function syncPlayback() {
  window.clearTimeout(fallbackTimer);
  fallbackTimer = null;
  videos.forEach((video, index) => {
    if (index !== currentSlide || !canPlay()) video.pause();
  });
  prepareVideos();
  if (!canPlay()) return;
  const video = videos[currentSlide];
  if (video.error) {
    // Apenas falhas usam um prazo fixo. Vídeos válidos avançam por ended.
    fallbackTimer = window.setTimeout(() => showSlide(currentSlide + 1, false), 4000);
    return;
  }
  if (video.ended) { showSlide(currentSlide + 1, false); return; }
  if (!video.hasAttribute('src') || playRequests.has(video) || !video.paused) return;
  playRequests.add(video);
  video.play().then(() => {
    if (video !== videos[currentSlide] || !canPlay()) video.pause();
  }).catch(error => {
    if (error.name === 'NotAllowedError' && video === videos[currentSlide]) {
      playbackBlocked = true;
      updateAutoplayButton();
    }
    // AbortError é esperado se o visitante navegar antes de play() resolver.
  }).finally(() => {
    playRequests.delete(video);
    if (video === videos[currentSlide] && canPlay() && video.paused && !video.error) syncPlayback();
  });
}

function showSlide(index, announce = true) {
  videos[currentSlide].pause();
  currentSlide = (index + slides.length) % slides.length;
  const video = videos[currentSlide];
  playbackBlocked = false;
  if (video.readyState >= 1) video.currentTime = 0;
  else video.dataset.restart = 'true';
  slides.forEach((slide, position) => {
    const active = position === currentSlide;
    slide.classList.toggle('is-active', active);
    slide.setAttribute('aria-hidden', String(!active));
    slide.inert = !active;
  });
  if (announce) slideStatus.textContent = `Ambiente ${currentSlide + 1} de ${slides.length}: ${slides[currentSlide].querySelector('img').alt}`;
  updateAutoplayButton();
  syncPlayback();
}

videos.forEach((video, index) => {
  video.addEventListener('loadedmetadata', () => {
    if (video.dataset.restart) { video.currentTime = 0; delete video.dataset.restart; }
  });
  video.addEventListener('loadeddata', () => {
    slides[index].classList.add('video-ready');
    if (index === currentSlide) syncPlayback();
  });
  video.addEventListener('ended', () => {
    if (index === currentSlide && canPlay()) showSlide(currentSlide + 1, false);
  });
  video.addEventListener('error', () => {
    slides[index].classList.remove('video-ready');
    if (index === currentSlide) {
      slideStatus.textContent = 'Vídeo indisponível. A imagem deste ambiente permanece disponível.';
      syncPlayback();
    }
  });
  // Rede lenta mantém o poster até um quadro estar disponível.
  video.addEventListener('waiting', () => {
    if (video.readyState < 2) slides[index].classList.remove('video-ready');
  });
  video.addEventListener('playing', () => slides[index].classList.add('video-ready'));
});

autoplayButton.addEventListener('click', event => {
  // Ignorar só o clique de ponteiro gerado pelo gesto, nunca Espaço/Enter.
  if (swiped && event.detail > 0) { swiped = false; return; }
  swiped = false;
  if (motionPreference.matches) { showSlide(currentSlide + 1); return; }
  userPaused = playbackBlocked ? false : !userPaused;
  playbackBlocked = false;
  if (!userPaused) {
    // Retomar é uma ação explícita, mesmo com o botão ainda focado.
    focused = false;
  }
  updateAutoplayButton();
  syncPlayback();
});
carousel.addEventListener('keydown', event => {
  const actions = { ArrowLeft: currentSlide - 1, ArrowRight: currentSlide + 1, Home: 0, End: slides.length - 1 };
  if (Object.hasOwn(actions, event.key)) { event.preventDefault(); showSlide(actions[event.key]); }
});
carousel.addEventListener('focusin', () => { focused = true; syncPlayback(); });
carousel.addEventListener('focusout', event => {
  focused = carousel.contains(event.relatedTarget);
  syncPlayback();
});
document.addEventListener('visibilitychange', syncPlayback);
motionPreference.addEventListener('change', () => { updateAutoplayButton(); syncPlayback(); });
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    inViewport = entries[0].isIntersecting;
    syncPlayback();
  }, { threshold: 0.15 });
  observer.observe(carousel);
} // Sem suporte, posters e navegação manual continuam disponíveis.
const slideArea = carousel.querySelector('.slides');
slideArea.addEventListener('pointerdown', event => {
  if (!event.isPrimary || event.button !== 0) return;
  swiped = false;
  pointerStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
  event.target.setPointerCapture(event.pointerId);
  syncPlayback();
});
slideArea.addEventListener('pointerup', event => {
  if (!pointerStart || pointerStart.id !== event.pointerId) return;
  const deltaX = event.clientX - pointerStart.x;
  const deltaY = event.clientY - pointerStart.y;
  pointerStart = null;
  if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
    swiped = true;
    showSlide(currentSlide + (deltaX < 0 ? 1 : -1));
  }
  else syncPlayback();
});
function cancelSwipe() { pointerStart = null; syncPlayback(); }
slideArea.addEventListener('pointercancel', cancelSwipe);
slideArea.addEventListener('lostpointercapture', cancelSwipe);
slideArea.addEventListener('dragstart', event => event.preventDefault());
carousel.classList.add('enhanced');
autoplayButton.hidden = false;
showSlide(0, false);
