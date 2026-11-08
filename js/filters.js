/* =========================================================
   NexaWeb: shared helpers + search / category / technology filtering.
   Categories, technologies and counts are all derived from projects.js.
   ========================================================= */
(function () {
  'use strict';
  const BF = (window.BF = window.BF || {});
  const cfg = siteConfig;
  const ALL = 'All Projects';

  /* ---------- Helpers shared by every script ---------- */
  const util = {
    ALL,
    esc: s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])),
    isValidUrl(u) { try { const x = new URL(u); return x.protocol === 'https:' || x.protocol === 'http:'; } catch (e) { return false; } },
    isGithubUrl(u) {
      if (!util.isValidUrl(u)) return false;
      const x = new URL(u);
      return /^(www\.)?github\.com$/i.test(x.hostname) && x.pathname.replace(/\//g, '').length > 0;
    },
    /* A URL that is clearly a stand-in (your-..., username, example) */
    isPlaceholderUrl: u => /your-|yourname|your_|username|example\.|\.example|placeholder/i.test(u || ''),
    hasLive: p => util.isValidUrl(p.liveUrl),
    hasGithub: p => util.isGithubUrl(p.githubUrl),
    shortUrl(u) { try { const x = new URL(u); return x.host + (x.pathname === '/' ? '' : x.pathname); } catch (e) { return u; } },
    normTech: t => (cfg.techAliases && cfg.techAliases[t]) || t,
    prefersReducedMotion: () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches,
    thumbAlt: p => (p.sample ? `Sample thumbnail for ${p.name}` : `Screenshot of ${p.name}`)
  };
  BF.util = util;

  /* ---------- Derived data ---------- */
  function categories() {
    const used = new Set(projects.map(p => p.category));
    const ordered = (cfg.categories || []).filter(c => used.has(c));
    used.forEach(c => { if (!ordered.includes(c)) ordered.push(c); });      // new categories appear automatically
    return ordered.map(name => ({ name, count: projects.filter(p => p.category === name).length }));
  }
  function technologies() {
    const map = new Map();
    projects.forEach(p => new Set((p.technologies || []).map(util.normTech)).forEach(t => map.set(t, (map.get(t) || 0) + 1)));
    return Array.from(map, ([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }

  /* ---------- Filter state ---------- */
  const state = { q: '', category: ALL, tech: '' };
  let els = null, onChange = () => {};

  const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
  const hay = new WeakMap();
  const haystack = p => {
    if (!hay.has(p)) hay.set(p, norm([p.name, p.category, p.description, (p.technologies || []).join(' ')].join(' ')));
    return hay.get(p);
  };

  function matches(p) {
    if (state.category !== ALL && p.category !== state.category) return false;
    if (state.tech && !(p.technologies || []).some(t => util.normTech(t) === state.tech)) return false;
    const tokens = norm(state.q).split(/\s+/).filter(Boolean);
    if (tokens.length) { const h = haystack(p); if (!tokens.every(t => h.includes(t))) return false; }
    return true;
  }
  const apply = () => projects.filter(matches);
  const isPristine = () => !state.q && state.category === ALL && !state.tech;

  /* ---------- Controls ---------- */
  function renderChips() {
    els.chips.innerHTML = [{ name: ALL, count: projects.length }].concat(categories()).map(c =>
      `<button type="button" class="chip" data-category="${util.esc(c.name)}" aria-pressed="${c.name === state.category}">${util.esc(c.name)} <span>${c.count}</span></button>`).join('');
  }
  function renderTech() {
    els.tech.innerHTML = '<option value="">All technologies</option>' +
      technologies().map(t => `<option value="${util.esc(t.name)}">${util.esc(t.name)} (${t.count})</option>`).join('');
    els.tech.value = state.tech;
  }
  function syncControls() {
    $$chips().forEach(b => b.setAttribute('aria-pressed', b.dataset.category === state.category));
    if (els.search.value !== state.q && document.activeElement !== els.search) els.search.value = state.q;
    els.tech.value = state.tech;
    els.clear.disabled = isPristine();
  }
  const $$chips = () => Array.from(els.chips.querySelectorAll('.chip'));

  function writeUrl() {
    const p = new URLSearchParams();
    if (state.q) p.set('q', state.q);
    if (state.category !== ALL) p.set('category', state.category);
    if (state.tech) p.set('tech', state.tech);
    const qs = p.toString();
    try { history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash); } catch (e) { /* ignore */ }
  }

  function update({ animate = true } = {}) {
    syncControls();
    writeUrl();
    onChange(apply(), { ...state }, { animate });
  }

  function set(patch, opts) { Object.assign(state, patch); update(opts); }
  function reset() { set({ q: '', category: ALL, tech: '' }); }

  function readUrl() {
    const p = new URLSearchParams(location.search);
    state.q = (p.get('q') || '').trim();
    const c = p.get('category');
    state.category = c && categories().some(x => x.name === c) ? c : ALL;
    const t = p.get('tech');
    state.tech = t && technologies().some(x => x.name === t) ? t : '';
  }

  function init(opts) {
    els = opts.els; onChange = opts.onChange;
    renderChips(); renderTech(); readUrl();
    els.chips.addEventListener('click', e => { const b = e.target.closest('.chip'); if (b) set({ category: b.dataset.category }); });
    els.tech.addEventListener('change', () => set({ tech: els.tech.value }));
    let t; els.search.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => set({ q: els.search.value.trim() }), 140); });
    els.search.addEventListener('keydown', e => { if (e.key === 'Escape' && els.search.value) { els.search.value = ''; set({ q: '' }); } });
    els.clear.addEventListener('click', reset);
    if (opts.emptyClear) opts.emptyClear.addEventListener('click', reset);
    els.search.value = state.q;
    update({ animate: false });
  }

  BF.filters = { state, init, apply, set, reset, categories, technologies };
})();
