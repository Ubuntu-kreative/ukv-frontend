// /src/app/effects.js

/**
 * Global Visual Effects
 * Handles custom cursor states, hover detection, and element tilts.
 */

const initEffects = () => {
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');

  // ─── Hover Detection ───
  // Added '.glass' to ensure the cart pill triggers the cursor grow effect[cite: 6, 7]
  const interactiveElements = document.querySelectorAll(
    'a, button, .btn-neon, .btn-gold, .glass, .interactive'
  );

  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorDot?.classList.add('hovering');
      cursorRing?.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      cursorDot?.classList.remove('hovering');
      cursorRing?.classList.remove('hovering');
    });
  });

  // ─── Card Tilt Effect (Optional Integration) ───
  document.querySelectorAll('.glass').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const xc = rect.width / 2;
      const yc = rect.height / 2;
      
      const dx = x - xc;
      const dy = y - yc;
      
      card.style.setProperty('--rx', `${dy / -10}deg`);
      card.style.setProperty('--ry', `${dx / 10}deg`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
};

// Initialize on load
if (typeof window !== 'undefined') {
  initEffects();
}

export default initEffects;