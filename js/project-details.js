/* =========================================================
   NexaWeb: project details modal
   Opens from any element with [data-open="<project id>"], supports
   prev/next, a screenshot gallery, focus trapping, Esc, backdrop click
   and deep links such as index.html#project-3.
   ========================================================= */
(function () {
  'use strict';
  const BF = (window.BF = window.BF || {});
  const U = BF.util, esc = U.esc;

  const modal = document.getElementById('modal');
  const panel = document.getElementById('modalPanel');
  const body = document.getElementById('modalBody');
  const prevBtn = document.getElementById('modalPrev');
  const nextBtn = document.getElementById('modalNext');
  let currentId = null, opener = null, closeTimer = null;

  const byId = id => projects.find(p => String(p.id) === String(id));
  const order = () => (BF.visibleIds && BF.visibleIds.length ? BF.visibleIds : projects.map(p => p.id));

  function render(p) {
    const imgs = [p.thumbnail].concat(p.gallery || []).filter(Boolean);
    const live = U.hasLive(p), gh = U.hasGithub(p);
    const placeholder = (live && U.isPlaceholderUrl(p.liveUrl)) || (gh && U.isPlaceholderUrl(p.githubUrl));
    const meta = [];
    meta.push(`<div><dt>Category</dt><dd>${esc(p.category)}</dd></div>`);
    if (p.year) meta.push(`<div><dt>Year</dt><dd>${esc(p.year)}</dd></div>`);
    meta.push(`<div><dt>Live demo</dt><dd>${live ? `<a href="${esc(p.liveUrl)}" target="_blank" rel="noopener noreferrer">${esc(U.shortUrl(p.liveUrl))}<span class="sr"> (opens in a new tab)</span></a>` : '<span class="muted">Not live yet</span>'}</dd></div>`);
    if (gh) meta.push(`<div><dt>GitHub</dt><dd><a href="${esc(p.githubUrl)}" target="_blank" rel="noopener noreferrer">${esc(U.shortUrl(p.githubUrl))}<span class="sr"> (opens in a new tab)</span></a></dd></div>`);

    body.innerHTML = `
      <div class="detail">
        <div class="detail__media">
          <div class="detail__shot"><img id="detailImg" src="${esc(imgs[0])}" width="1440" height="900" alt="${esc(U.thumbAlt(p))}" decoding="async"></div>
          ${imgs.length > 1 ? `<ul class="detail__thumbs" aria-label="Project screenshots">${imgs.map((s, i) => `<li><button type="button" data-shot="${i}" aria-label="Show screenshot ${i + 1}" aria-pressed="${i === 0}"><img src="${esc(s)}" width="160" height="100" alt="" loading="lazy"></button></li>`).join('')}</ul>` : ''}
        </div>
        <div class="detail__info">
          <p class="eyebrow">${esc(p.category)}${p.year ? ' · ' + esc(p.year) : ''}${p.sample ? ' <span class="badge">Sample</span>' : ''}</p>
          <h2 id="modalTitle">${esc(p.name)}</h2>
          <p class="detail__desc">${esc(p.details || p.description)}</p>
          ${(p.features && p.features.length) ? `<h3>Features</h3><ul class="detail__features">${p.features.map(f => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}
          <h3>Technology</h3>
          <ul class="tags">${(p.technologies || []).map(t => `<li>${esc(t)}</li>`).join('')}</ul>
          <dl class="detail__meta">${meta.join('')}</dl>
          <div class="detail__actions">
            ${live
              ? `<a class="btn btn--accent" href="${esc(p.liveUrl)}" target="_blank" rel="noopener noreferrer">Live Demo <span class="arr" aria-hidden="true">↗</span><span class="sr"> (opens in a new tab)</span></a>`
              : '<span class="btn btn--disabled" aria-disabled="true">Live demo coming soon</span>'}
            ${gh ? `<a class="btn btn--outline" href="${esc(p.githubUrl)}" target="_blank" rel="noopener noreferrer">GitHub <span class="arr" aria-hidden="true">↗</span><span class="sr"> (opens in a new tab)</span></a>` : ''}
          </div>
          ${placeholder ? '<p class="detail__note">One or more links on this project are placeholders. Replace them in <code>js/projects.js</code>.</p>' : ''}
        </div>
      </div>`;
    body.querySelectorAll('[data-shot]').forEach(b => b.addEventListener('click', () => {
      $('#detailImg').src = imgs[+b.dataset.shot];
      body.querySelectorAll('[data-shot]').forEach(x => x.setAttribute('aria-pressed', x === b));
    }));
  }
  const $ = s => document.querySelector(s);

  function show(id) {
    const p = byId(id);
    if (!p) return;
    currentId = p.id;
    render(p);
    const list = order();
    const multi = list.length > 1;
    prevBtn.hidden = nextBtn.hidden = !multi;
    body.scrollTop = 0; panel.scrollTop = 0;
  }

  function open(id, from) {
    if (!byId(id)) return;
    clearTimeout(closeTimer);
    opener = from || document.activeElement;
    show(id);
    modal.hidden = false;
    document.body.classList.add('modal-open');
    requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('is-open')));
    panel.focus({ preventScroll: true });
    try { history.replaceState(null, '', location.pathname + location.search + '#project-' + id); } catch (e) { /* ignore */ }
  }

  function close() {
    if (modal.hidden) return;
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
    closeTimer = setTimeout(() => { modal.hidden = true; }, U.prefersReducedMotion() ? 0 : 280);
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* ignore */ }
    if (opener && opener.focus) opener.focus({ preventScroll: true });
    currentId = null;
  }

  function step(dir) {
    const list = order(), i = list.findIndex(x => String(x) === String(currentId));
    if (i < 0) return;
    const nextId = list[(i + dir + list.length) % list.length];
    show(nextId);
    try { history.replaceState(null, '', location.pathname + location.search + '#project-' + nextId); } catch (e) { /* ignore */ }
  }

  modal.addEventListener('click', e => { if (e.target.closest('[data-close]')) close(); });
  prevBtn.addEventListener('click', () => step(-1));
  nextBtn.addEventListener('click', () => step(1));
  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft' && !e.target.closest('input, textarea')) step(-1);
    else if (e.key === 'ArrowRight' && !e.target.closest('input, textarea')) step(1);
    else if (e.key === 'Tab') {                         // keep focus inside the dialog
      const f = Array.from(panel.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(x => x.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* Open from a #project-<id> link (on load, or when the hash changes) */
  function openFromHash() {
    const m = /^#project-(.+)$/.exec(location.hash);
    if (m && byId(m[1])) open(m[1]);
  }
  window.addEventListener('hashchange', () => { if (/^#project-/.test(location.hash)) openFromHash(); else if (!modal.hidden) close(); });

  BF.details = { open, close, openFromHash };
})();
