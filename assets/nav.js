/* Projects dropdown in the top nav: opens on hover (desktop) or with the arrow button (touch, keyboard). */
(function () {
  const wrap = document.querySelector('.navdrop'); if (!wrap) return;
  const btn = wrap.querySelector('.navdrop-btn');
  const set = open => { wrap.classList.toggle('open', open); btn.setAttribute('aria-expanded', open); };
  btn.addEventListener('click', e => { e.stopPropagation(); set(!wrap.classList.contains('open')); });
  document.addEventListener('click', e => { if (!wrap.contains(e.target)) set(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { set(false); } });
})();
