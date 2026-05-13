"use client";
import { useEffect } from "react";

export default function useEffects() {
  useEffect(() => {
    // ── Custom Cursor ──
    const handleMouseMove = e => {
      const dot = document.querySelector('.cursor-dot');
      const ring = document.querySelector('.cursor-ring');
      if (!dot || !ring) return;

      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
      ring.style.left = `${e.clientX}px`;
      ring.style.top = `${e.clientY}px`;
    };
    document.addEventListener('mousemove', handleMouseMove);

    // Hover detection
    const hoverEls = document.querySelectorAll('a, button, .btn-neon, .btn-gold');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.querySelector('.cursor-dot')?.classList.add('hovering');
        document.querySelector('.cursor-ring')?.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        document.querySelector('.cursor-dot')?.classList.remove('hovering');
        document.querySelector('.cursor-ring')?.classList.remove('hovering');
      });
    });

    // Tilt cards
    const tiltEls = document.querySelectorAll('.tilt-card');
    tiltEls.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * 10;
        const rotateY = ((x - centerX) / centerX) * 10;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      });
    });

    // Zooming words
    const splitText = selector => {
      document.querySelectorAll(selector).forEach(el => {
        if (el.dataset.split === 'true') return;
        const text = el.textContent;
        el.textContent = '';
        text.split('').forEach(letter => {
          const span = document.createElement('span');
          span.className = 'char';
          span.textContent = letter;
          el.appendChild(span);
        });
        el.dataset.split = 'true';
      });
    };
    splitText('.zoom-text');

    // Scroll reveal
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.2 });
    revealEls.forEach(el => observer.observe(el));

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);
}
