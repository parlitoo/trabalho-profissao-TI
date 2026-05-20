// ═══ SLIDE MANAGEMENT ═══
const slides = document.querySelectorAll('.slide');
const navDotsContainer = document.getElementById('navDots');
const totalSlides = slides.length;

document.getElementById('totalSlides').textContent = totalSlides;

// Create nav dots
slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'nav-dot' + (i === 0 ? ' active' : '');
  dot.onclick = () => scrollToSlide(i);
  navDotsContainer.appendChild(dot);
});

function scrollToSlide(index) {
  slides[index].scrollIntoView({ behavior: 'smooth' });
}

function navigate(dir) {
  const current = getCurrentSlide();
  const next = Math.max(0, Math.min(totalSlides - 1, current + dir));
  scrollToSlide(next);
}

function getCurrentSlide() {
  let closest = 0;
  let minDist = Infinity;
  slides.forEach((s, i) => {
    const dist = Math.abs(s.getBoundingClientRect().top);
    if (dist < minDist) { minDist = dist; closest = i; }
  });
  return closest;
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
    e.preventDefault(); navigate(1);
  }
  if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    e.preventDefault(); navigate(-1);
  }
});

// ═══ INTERSECTION OBSERVER ═══
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const content = entry.target.querySelector('.slide-content');
    if (entry.isIntersecting) {
      content?.classList.add('visible');
      // Update nav
      const idx = Array.from(slides).indexOf(entry.target);
      document.querySelectorAll('.nav-dot').forEach((d, i) => {
        d.classList.toggle('active', i === idx);
      });
      document.getElementById('currentSlide').textContent = idx + 1;
      document.getElementById('navProgress').textContent =
        String(idx + 1).padStart(2, '0') + ' / ' + String(totalSlides).padStart(2, '0');

      // Animate flow steps
      entry.target.querySelectorAll('.flow-step').forEach((step, i) => {
        setTimeout(() => step.classList.add('visible'), i * 150);
      });
    }
  });
}, { threshold: 0.3 });

slides.forEach(s => observer.observe(s));