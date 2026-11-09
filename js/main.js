/* =========================================================
   NexaWeb: page controller
   Builds every section from js/projects.js, then wires up the interactions.
   ========================================================= */
(function () {
  'use strict';
  const BF = window.BF, U = BF.util, esc = U.esc, cfg = siteConfig;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduced = U.prefersReducedMotion();

  /* ---------- Small templates ---------- */
  const tagsHtml = (p, max) => {
    const t = p.technologies || [];
    const shown = max ? t.slice(0, max) : t;
    return `<ul class="tags">${shown.map(x => `<li>${esc(x)}</li>`).join('')}${max && t.length > max ? `<li class="tags__more">+${t.length - max}</li>` : ''}</ul>`;
  };
  const ext = (href, cls, label, arrow = true) =>
    `<a class="btn ${cls}" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${label}${arrow ? ' <span class="arr" aria-hidden="true">↗</span>' : ''}<span class="sr"> (opens in a new tab)</span></a>`;
  const badge = p => (p.sample ? '<span class="badge badge--float">Sample</span>' : '');

  function mediaHtml(p, cls) {
    const img = `<img src="${esc(p.thumbnail)}" width="1440" height="900" alt="${esc(U.thumbAlt(p))}" loading="lazy" decoding="async">`;
    if (U.hasLive(p)) {
      return `<a class="${cls}" href="${esc(p.liveUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Open the live demo of ${esc(p.name)} (opens in a new tab)">${img}<span class="media__open">Open live <span aria-hidden="true">↗</span></span>${badge(p)}</a>`;
    }
    return `<div class="${cls} is-static">${img}<span class="media__open media__open--soon">Coming soon</span>${badge(p)}</div>`;
  }

  function cardHtml(p, i) {
    const live = U.hasLive(p), gh = U.hasGithub(p);
    const ph = live && U.isPlaceholderUrl(p.liveUrl);
    return `
    <article class="card" data-id="${p.id}" style="--d:${Math.min(i, 12) * 45}ms">
      ${mediaHtml(p, 'card__media media')}
      <div class="card__body">
        <p class="card__cat">${esc(p.category)}${p.year ? ' · ' + esc(p.year) : ''}</p>
        <h3 class="card__title"><button type="button" class="card__open" data-open="${p.id}">${esc(p.name)}</button></h3>
        <p class="card__desc">${esc(p.description)}</p>
        ${tagsHtml(p, 4)}
        <div class="card__actions">
          ${live ? ext(p.liveUrl, 'btn--accent btn--sm', 'Live Preview') : '<span class="btn btn--sm btn--disabled" aria-disabled="true">Coming soon</span>'}
          ${gh ? ext(p.githubUrl, 'btn--outline btn--sm', 'GitHub Source') : ''}
          <button type="button" class="btn btn--text btn--sm" data-open="${p.id}">Details</button>
        </div>
        ${ph ? '<p class="card__note">Placeholder link</p>' : '<p class="card__note" aria-hidden="true">&nbsp;</p>'}
      </div>
    </article>`;
  }

  function featureHtml(p, i) {
    const live = U.hasLive(p), gh = U.hasGithub(p);
    return `
    <article class="feature feature--${(i % 3) + 1}" data-id="${p.id}">
      <div class="feature__media rv">${mediaHtml(p, 'media media--big')}</div>
      <div class="feature__body rv">
        <p class="feature__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</p>
        <p class="card__cat">${esc(p.category)}${p.year ? ' · ' + esc(p.year) : ''}</p>
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.description)}</p>
        ${tagsHtml(p)}
        <div class="card__actions">
          ${live ? ext(p.liveUrl, 'btn--accent', 'Live Demo') : '<span class="btn btn--disabled" aria-disabled="true">Coming soon</span>'}
          ${gh ? ext(p.githubUrl, 'btn--outline', 'GitHub') : ''}
          <button type="button" class="btn btn--text" data-open="${p.id}">Details</button>
        </div>
      </div>
    </article>`;
  }

  /* =====================================================
     Static sections built from data
  ===================================================== */
  function buildHero() {
    const cats = BF.filters.categories(), techs = BF.filters.technologies();
    $('#heroStats').innerHTML = [
      [projects.length, 'Projects'], [techs.length, 'Technologies'], [cats.length, 'Categories']
    ].map(([n, l]) => `<div><dt>${l}</dt><dd><span data-count="${n}">0</span></dd></div>`).join('');

    const st = cfg.status || {};
    $('#statusText').textContent = st.available === false ? 'Currently booked' : (st.text || 'Open to new projects');
    $('.status').classList.toggle('is-busy', st.available === false);

    const picks = projects.filter(p => p.featured).concat(projects.filter(p => !p.featured)).slice(0, 3);
    $('#heroStack').innerHTML = picks.map((p, i) => `
      <button type="button" class="frame frame--${i + 1}" data-open="${p.id}" aria-label="View details for ${esc(p.name)}">
        <img src="${esc(p.thumbnail)}" width="1440" height="900" alt="${esc(U.thumbAlt(p))}" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
        <span class="frame__label">${esc(p.name)}</span>
      </button>`).join('');

    const names = techs.map(t => t.name);
    const row = names.map(n => `<li>${esc(n)}</li>`).join('');
    $('#marquee').innerHTML = row + row.replace(/<li>/g, '<li aria-hidden="true">');
  }

  function buildFeatured() {
    const list = projects.filter(p => p.featured).slice(0, 3);
    const section = $('#featured');
    section.hidden = list.length === 0;
    $('#featuredList').innerHTML = list.map(featureHtml).join('');
  }

  function buildCategories() {
    const cats = BF.filters.categories();
    $('#categoryGrid').innerHTML = cats.map((c, i) => {
      const names = projects.filter(p => p.category === c.name).slice(0, 3).map(p => esc(p.name));
      return `<li class="rv" style="--i:${i % 3}"><button type="button" class="cat" data-category="${esc(c.name)}">
        <span class="cat__n" aria-hidden="true">${String(c.count).padStart(2, '0')}</span>
        <span class="cat__name">${esc(c.name)}</span>
        <span class="cat__desc">${esc((cfg.categoryInfo && cfg.categoryInfo[c.name]) || '')}</span>
        <span class="cat__list">${names.join(' · ')}</span>
        <span class="cat__go">View ${c.count} project${c.count === 1 ? '' : 's'} <span aria-hidden="true">→</span></span>
      </button></li>`;
    }).join('');
  }

  function buildStack() {
    const used = new Map(BF.filters.technologies().map(t => [t.name, t.count]));
    $('#stackGrid').innerHTML = cfg.techStack.map(g => `
      <div class="stack__group rv">
        <h3>${esc(g.group)}</h3>
        <ul>${g.items.map(name => {
          const n = used.get(name) || 0;
          return `<li>${n ? `<button type="button" class="tech" data-tech="${esc(name)}" aria-label="${esc(name)}, used in ${n} project${n === 1 ? '' : 's'}. Filter projects">` : '<span class="tech tech--idle">'}
            <span class="tech__name">${esc(name)}</span><span class="tech__n">${n ? n + (n === 1 ? ' project' : ' projects') : '—'}</span>${n ? '</button>' : '</span>'}</li>`;
        }).join('')}</ul>
      </div>`).join('');
  }

  function buildAbout() {
    const a = cfg.about || {};
    $('#about-h').textContent = a.heading || '';
    $('#aboutBody').innerHTML = (a.paragraphs || []).map(t => `<p>${esc(t)}</p>`).join('');
    $('#aboutInterests').innerHTML = (a.interests || []).map(t => `<li>${esc(t)}</li>`).join('');
    const initials = (cfg.owner || cfg.brand).split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
    $('#aboutPhoto').innerHTML = cfg.profileImage
      ? `<img src="${esc(cfg.profileImage)}" width="640" height="800" alt="Portrait of ${esc(cfg.owner)}" loading="lazy" decoding="async">`
      : `<div class="about__mono" role="img" aria-label="Profile photo placeholder"><span>${esc(initials)}</span><small>${esc(cfg.owner)}<br>${esc(cfg.role || '')}</small></div>`;
  }

  function buildLinks() {
    const rows = [
      ['Email', `<a href="mailto:${esc(cfg.email)}">${esc(cfg.email)}</a>`, U.isPlaceholderUrl(cfg.email)],
      ['LinkedIn', `<a href="${esc(cfg.linkedin)}" target="_blank" rel="noopener noreferrer">${esc(U.shortUrl(cfg.linkedin))}<span class="sr"> (opens in a new tab)</span></a>`, U.isPlaceholderUrl(cfg.linkedin)],
      ['Portfolio', '<a href="#contact">Use the contact form →</a>', false]
    ];
    $('#contactList').innerHTML = rows.map(([k, v, ph]) => `<li><span>${k}</span><span>${v}${ph ? ' <small>(placeholder)</small>' : ''}</span></li>`).join('');
    $('#footLinks').innerHTML =
      `<li><a href="${esc(cfg.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn<span class="sr"> (opens in a new tab)</span></a></li>` +
      `<li><a href="mailto:${esc(cfg.email)}">Email</a></li>`;
    $('#footOwner').textContent = cfg.owner || cfg.brand;
    $('#year').textContent = new Date().getFullYear();
  }

  /* =====================================================
     Project grid: re-rendered whenever the filters change
  ===================================================== */
  const grid = $('#projectGrid'), empty = $('#emptyState'), count = $('#projectCount');
  let switchTimer = null;

  function renderGrid(list, state, { animate }) {
    BF.visibleIds = list.map(p => p.id);
    const total = projects.length;
    const filtered = list.length !== total;
    count.innerHTML = list.length === 0
      ? '<strong>0</strong> projects found'
      : `Showing <strong>${list.length}</strong> of <strong>${total}</strong> projects${state.category !== U.ALL ? ` in <em>${esc(state.category)}</em>` : ''}${state.tech ? ` using <em>${esc(state.tech)}</em>` : ''}`;
    const paint = () => {
      grid.innerHTML = list.map(cardHtml).join('');
      grid.hidden = list.length === 0;
      empty.hidden = list.length !== 0;
      grid.classList.remove('is-switching');
    };
    clearTimeout(switchTimer);
    if (animate && !reduced && filtered !== undefined) {
      grid.classList.add('is-switching');            // quick fade-out, then new cards rise in
      switchTimer = setTimeout(paint, 150);
    } else paint();
  }

  /* =====================================================
     Interactions
  ===================================================== */
  document.addEventListener('click', e => {
    const open = e.target.closest('[data-open]');
    if (open) { BF.details.open(open.dataset.open, open); return; }
    const cat = e.target.closest('.cat[data-category]');
    if (cat) { BF.filters.set({ category: cat.dataset.category }); scrollTo('#projects'); return; }
    const tech = e.target.closest('.tech[data-tech]');
    if (tech) { BF.filters.set({ tech: tech.dataset.tech, category: U.ALL }); scrollTo('#projects'); }
  });
  function scrollTo(sel) {
    const t = $(sel);
    if (t) t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }

  /* Contact form: demo / Netlify Forms / generic endpoint */
  (function contact() {
    const f = $('#contactForm'), status = $('#formStatus'), note = $('#formNote');
    const mode = (cfg.contactForm && cfg.contactForm.mode) || 'demo';
    note.textContent = mode === 'demo'
      ? 'Demo form: this is a static site, so messages are not sent anywhere yet. To receive messages, connect a form service (Netlify Forms, Formspree) in siteConfig.contactForm.'
      : '';
    if (mode === 'netlify') f.setAttribute('data-netlify', 'true'), f.setAttribute('netlify-honeypot', 'bot-field');
    const rules = {
      name: v => (v.trim().length > 1 ? '' : 'Please enter your name.'),
      email: v => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Please enter a valid email address.'),
      message: v => (v.trim().length > 9 ? '' : 'Please write at least a short message.')
    };
    const ids = { name: 'eName', email: 'eEmail', message: 'eMsg' };
    const check = k => { const m = rules[k](f.elements[k].value); $('#' + ids[k]).textContent = m; f.elements[k].setAttribute('aria-invalid', !!m); return !m; };
    Object.keys(rules).forEach(k => f.elements[k].addEventListener('input', () => $('#' + ids[k]).textContent && check(k)));
    f.addEventListener('submit', async e => {
      e.preventDefault();
      if (!Object.keys(rules).map(check).every(Boolean)) { status.textContent = ''; f.querySelector('[aria-invalid="true"]').focus(); return; }
      const data = Object.fromEntries(new FormData(f).entries());
      try {
        if (mode === 'netlify') {
          const r = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(data).toString() });
          if (!r.ok) throw new Error('Request failed');
        } else if (mode === 'endpoint' && cfg.contactForm.endpoint) {
          const r = await fetch(cfg.contactForm.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
          if (!r.ok) throw new Error('Request failed');
        }
        status.textContent = mode === 'demo' ? 'Thanks! This is a demo, so your message was not sent.' : 'Thanks! Your message has been sent.';
        f.reset();
      } catch (err) {
        status.textContent = 'Sorry, the message could not be sent. Please email me directly instead.';
      }
    });
  })();

  /* Navigation, back-to-top, reveal, counters, scrollspy */
  const nav = $('#nav'), burger = $('#burger'), links = $('#navLinks'), toTop = $('#toTop');
  const setMenu = open => {
    links.classList.toggle('is-open', open); nav.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('navlock', open);
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  $$('a', links).forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const y = window.pageYOffset;
    nav.classList.toggle('is-solid', y > 40);
    toTop.classList.toggle('is-show', y > 900);
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));

  function countUp(el) {
    const end = +el.dataset.count;
    if (reduced) { el.textContent = end; return; }
    const t0 = performance.now(), dur = 1300;
    const step = t => { const p = Math.min((t - t0) / dur, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }

  function observe() {
    const hasIO = 'IntersectionObserver' in window;
    const pending = new Set($$('.rv'));
    const reveal = n => { n.classList.add('is-in'); pending.delete(n); $$('[data-count]', n).forEach(countUp); };
    if (hasIO) {
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); } }), { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
      pending.forEach(n => io.observe(n));
    } else pending.forEach(reveal);
    const scan = () => pending.forEach(n => { const r = n.getBoundingClientRect(); if (r.top < innerHeight * 0.96 && r.bottom > 0) reveal(n); });   // fallback
    window.addEventListener('scroll', scan, { passive: true });
    window.addEventListener('resize', scan);
    window.addEventListener('load', scan);
    setTimeout(scan, 500);

    if (hasIO) {
      const map = new Map($$('a[href^="#"]', links).map(a => [a.getAttribute('href').slice(1), a]));
      const spy = new IntersectionObserver(es => es.forEach(e => {
        if (!e.isIntersecting) return;
        map.forEach(a => a.classList.remove('is-current'));
        const key = e.target.id === 'featured' || e.target.id === 'projects' ? 'projects' : e.target.id === 'stack' ? 'categories' : e.target.id;
        const a = map.get(key); if (a) a.classList.add('is-current');
      }), { rootMargin: '-45% 0px -50% 0px' });
      $$('main section[id]').forEach(s => spy.observe(s));
    }
  }

  /* =====================================================
     Boot
  ===================================================== */
  buildHero(); buildFeatured(); buildCategories(); buildStack(); buildAbout(); buildLinks();
  BF.filters.init({
    els: { search: $('#searchInput'), chips: $('#categoryChips'), tech: $('#techSelect'), clear: $('#clearFilters') },
    emptyClear: $('#emptyClear'),
    onChange: renderGrid
  });
  observe();
  onScroll();
  BF.details.openFromHash();
  if (location.search && /[?&](q|category|tech)=/.test(location.search)) setTimeout(() => scrollTo('#projects'), 120);
})();
