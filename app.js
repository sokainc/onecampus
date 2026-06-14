// ── NAVBAR SCROLL EFFECT ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ── MODAL LOGIC ──
const overlay   = document.getElementById('modalOverlay');
const closeBtn  = document.getElementById('closeModal');

function openModal() {
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// some of these buttons may not exist on every page — guard each one
['openLoginBtn', 'heroSignIn', 'whySignIn', 'ctaSignIn'].forEach(id => {
  document.getElementById(id)?.addEventListener('click', openModal);
});
closeBtn.addEventListener('click', closeModal);

overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ── OAUTH HANDLERS ──
function handleOAuth(provider) {
  closeModal();
  showToast(`Redirecting to ${provider} sign-in…`);
}

function handleEmail(e) {
  e.preventDefault();
  const email = e.target.querySelector('input').value;
  closeModal();
  showToast(`Magic link sent to ${email}`);
}

// ── TOAST ──
const toastEl = document.getElementById('toast');
let toastTimer;

function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3200);
}

// ── INTERSECTION OBSERVER — fade-in on scroll ──
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.about-card, .team-card, .stat-card, .solution-card, .card-float').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .55s ease, transform .55s ease';
  io.observe(el);
});
