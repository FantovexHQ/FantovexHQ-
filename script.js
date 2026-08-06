// ---- Mobile nav toggle ----
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ---- Preloader ----
const preloader = document.getElementById('preloader');
const preloaderFill = document.getElementById('preloaderFill');

window.addEventListener('load', () => {
  requestAnimationFrame(() => {
    preloaderFill.style.width = '100%';
  });
  setTimeout(() => {
    preloader.classList.add('hide');
  }, 1700);
});

// safety fallback in case 'load' fires very late on slow connections
setTimeout(() => {
  if(preloader && !preloader.classList.contains('hide')){
    preloaderFill.style.width = '100%';
    setTimeout(() => preloader.classList.add('hide'), 200);
  }
}, 4000);

// ---- Button particle burst on click ----
document.querySelectorAll('.btn-glow').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const count = 10;
    for(let i = 0; i < count; i++){
      const p = document.createElement('span');
      p.className = 'burst-particle';
      const angle = (Math.PI * 2 * i) / count;
      const dist = 40 + Math.random() * 20;
      p.style.setProperty('--bx', `${Math.cos(angle) * dist}px`);
      p.style.setProperty('--by', `${Math.sin(angle) * dist}px`);
      p.style.left = `${cx}px`;
      p.style.top = `${cy}px`;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 650);
    }
  });
});

// ---- Lightweight particle background (kept minimal for low-end devices) ----
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
const PARTICLE_COUNT = 36; // low count on purpose — cheap to render

function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticles(){
  particles = [];
  for(let i = 0; i < PARTICLE_COUNT; i++){
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.6,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.5 + 0.2
    });
  }
}

function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#2ee6a6';
  for(const p of particles){
    p.x += p.vx;
    p.y += p.vy;
    if(p.x < 0) p.x = canvas.width;
    if(p.x > canvas.width) p.x = 0;
    if(p.y < 0) p.y = canvas.height;
    if(p.y > canvas.height) p.y = 0;

    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  requestAnimationFrame(draw);
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

resizeCanvas();
createParticles();
if(!prefersReducedMotion){
  draw();
}

window.addEventListener('resize', () => {
  resizeCanvas();
  createParticles();
});

// ---- Scroll reveal ----
const revealTargets = document.querySelectorAll(
  'section, .glass-card, .social-card, .roster-box, .soon-box, .stats'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealTargets.forEach(el => revealObserver.observe(el));

// ---- Cursor-following glow on glass/social cards ----
document.querySelectorAll('.glass-card, .social-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });
});

// ---- Active nav highlighting ----
const navAnchors = document.querySelectorAll('#navLinks a');
const trackedSections = Array.from(navAnchors)
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = '#' + entry.target.id;
    const link = document.querySelector(`#navLinks a[href="${id}"]`);
    if(!link) return;
    if(entry.isIntersecting){
      navAnchors.forEach(a => a.classList.remove('active'));
      link.classList.add('active');
    }
  });
}, { rootMargin: '-45% 0px -45% 0px' });

trackedSections.forEach(sec => navObserver.observe(sec));