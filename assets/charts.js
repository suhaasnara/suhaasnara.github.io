/* Small helpers shared by the project pages' charts (plain SVG, no libraries). */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  function el(tag, attrs, parent) {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs || {}) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function text(parent, x, y, str, cls, anchor) {
    const t = el('text', { x, y, class: cls || 'ax', 'text-anchor': anchor || 'start' }, parent);
    t.textContent = str;
    return t;
  }
  /* Tooltip inside a .plot wrapper. x, y are in SVG viewBox units. */
  function tip(plot) {
    const box = plot.querySelector('.tip');
    const svg = plot.querySelector('svg');
    return {
      show(html, x, y) {
        box.innerHTML = html;
        const vb = svg.viewBox.baseVal, r = svg.getBoundingClientRect();
        const sx = r.width / vb.width, sy = r.height / vb.height;
        let px = x * sx + 12, py = y * sy - 12;
        box.style.opacity = 1;
        const w = box.offsetWidth, h = box.offsetHeight;
        if (px + w > r.width) px = x * sx - w - 12;
        if (px < 0) px = 4;
        py = Math.max(0, Math.min(py - h / 2, r.height - h));
        box.style.left = px + 'px';
        box.style.top = py + 'px';
      },
      hide() { box.style.opacity = 0; }
    };
  }
  /* Convert a pointer event to SVG viewBox coordinates. */
  function point(svg, ev) {
    const r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal;
    const src = ev.touches ? ev.touches[0] : ev;
    return [(src.clientX - r.left) * vb.width / r.width, (src.clientY - r.top) * vb.height / r.height];
  }
  function clear(svg) { while (svg.firstChild) svg.removeChild(svg.firstChild); }
  function niceTicks(max, n) {
    const raw = max / (n || 5), mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => s >= raw);
    const out = []; for (let v = 0; v <= max + 1e-9; v += step) out.push(+v.toFixed(6));
    if (out[out.length - 1] < max) out.push(+(out[out.length - 1] + step).toFixed(6));
    return out;
  }
  const fmt = (v, d) => v.toLocaleString('en-US', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 });
  /* Draw at the plot's real width (1 SVG unit = 1 CSS px), so text stays readable on phones.
     Redraws when the width changes. */
  function responsive(plot, draw) {
    let last = 0, t = null;
    const run = () => {
      const w = Math.round(Math.min(880, Math.max(300, plot.clientWidth)));
      if (w === last) return; last = w; draw(w);
    };
    run();
    window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(run, 150); });
  }
  window.SC = { el, text, tip, point, clear, niceTicks, fmt, responsive };
})();
