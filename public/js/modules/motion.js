'use strict';

// Microinterações de interface: ripple nos botões e feedback visual acessível.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.addEventListener('pointerdown', event => {
  if (reduceMotion.matches) return;
  const button = event.target.closest('.button');
  if (!button || button.disabled) return;
  const rect = button.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.className = 'button-ripple';
  ripple.style.left = (event.clientX - rect.left) + 'px';
  ripple.style.top = (event.clientY - rect.top) + 'px';
  button.append(ripple);
  ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
});

document.addEventListener('click', event => {
  const disclosure = event.target.closest('.disclosure');
  if (disclosure) {
    const icon = disclosure.querySelector('.disclosure-icon');
    if (icon) icon.style.transform = disclosure.getAttribute('aria-expanded') === 'true' ? 'rotate(45deg)' : 'rotate(0deg)';
  }
});
