/* ============================================================
   ENIGMA ALLIANCE — Aidan Dougan Portfolio
   Vanilla JS — no React, no Babel
   ============================================================ */

const DATA = window.PORTFOLIO_DATA;

/* ---------- Custom cursor ---------- */
(function initCursor() {
  if (window.matchMedia('(max-width: 768px)').matches) return;
  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);
  let mx = -200, my = -200, rx = -200, ry = -200;
  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    const el = document.elementFromPoint(mx, my);
    document.body.classList.toggle('cursor-hover',
      !!(el && el.closest('a, button, [data-hover], .project-card')));
  }, { passive: true });
  (function loop() {
    dot.style.left = (mx - 4) + 'px';
    dot.style.top  = (my - 4) + 'px';
    rx += (mx - rx) * 0.14; ry += (my - ry) * 0.14;
    ring.style.left = (rx - 18) + 'px';
    ring.style.top  = (ry - 18) + 'px';
    requestAnimationFrame(loop);
  })();
})();

/* ---------- Helpers ---------- */
const h = (tag, attrs = {}, ...kids) => {
  const el = document.createElement(tag);
  for (const k in attrs) {
    const v = attrs[k];
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'on') for (const ev in v) el.addEventListener(ev, v[ev]);
    else if (k in el && typeof el[k] !== 'object') {
      try { el[k] = v; } catch(_) { el.setAttribute(k, v); }
    }
    else el.setAttribute(k, v);
  }
  for (const k of kids.flat()) {
    if (k == null || k === false) continue;
    el.appendChild(typeof k === 'string' ? document.createTextNode(k) : k);
  }
  return el;
};

function observeReveal(root) {
  const els = root.querySelectorAll('.reveal, .reveal-left, .stagger > *, .section-title');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: .1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
}

function navHash(hash) { window.location.hash = hash; }

/* ---------- Lightbox ---------- */
function openLightbox(src) {
  const close = () => { box.remove(); document.removeEventListener('keydown', esc); };
  const esc = e => { if (e.key === 'Escape') close(); };
  const box = h('div', { class: 'lightbox', on: { click: close } },
    h('button', { class: 'lightbox-close', 'data-hover': '', on: { click: close } }, '×'),
    h('img', { src, alt: 'Expanded', on: { click: e => e.stopPropagation() } }),
  );
  document.body.appendChild(box);
  document.addEventListener('keydown', esc);
}

/* ---------- Nav ---------- */
function buildNav(crumbs) {
  const scrollToAbout = () => {
    const doScroll = () => {
      const el = document.getElementById('about');
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
    };
    if (window.location.hash && window.location.hash !== '#/' && window.location.hash !== '#') {
      navHash('#/'); setTimeout(doScroll, 140);
    } else { doScroll(); }
  };
  return h('nav', { class: 'site-nav', id: 'site-nav' },
    h('div', { class: 'nav-inner' },
      h('button', { class: 'nav-logo', 'data-hover': '', on: { click: () => navHash('#/') } },
        h('img', { src: 'logo.png', alt: 'Enigma Alliance' }),
        h('span', { class: 'nav-brand' }, 'ENIGMA ALLIANCE'),
      ),
      crumbs ? h('div', { class: 'nav-crumbs' }, crumbs) : null,
      h('div', { class: 'nav-links' },
        h('button', { class: 'nav-btn', on: { click: () => navHash('#/') } }, 'Projects'),
        h('button', { class: 'nav-btn', on: { click: scrollToAbout } }, 'About'),
        h('a', { class: 'nav-btn primary', href: DATA.owner.resume, download: '' }, 'Resume ↓'),
      ),
    ),
  );
}

/* ---------- Footer ---------- */
function buildFooter() {
  const o = DATA.owner;
  return h('footer', { class: 'site-footer' },
    h('div', { class: 'footer-inner' },
      h('div', null,
        h('button', { class: 'nav-logo', 'data-hover': '', on: { click: () => navHash('#/') } },
          h('img', { src: 'logo.png', alt: 'EA' }),
          h('span', { class: 'nav-brand' }, 'ENIGMA ALLIANCE'),
        ),
        h('p', { class: 'footer-copy' }, '© 2025 ' + o.name + '. All rights reserved.'),
      ),
      h('div', { class: 'footer-contact' },
        h('a', { href: 'mailto:' + o.email }, o.email),
        h('a', { href: 'tel:' + o.phone.replace(/\D/g,'') }, o.phone),
        h('a', { href: o.resume, download: '', class: 'footer-resume' }, 'Resume ↓'),
      ),
    ),
  );
}

/* ---------- Home ---------- */
function buildHome() {
  const o = DATA.owner;
  const featured = DATA.projects[0];
  const view = h('div', { class: 'page-enter' });

  const hero = h('section', { class: 'hero' },
    h('div', { class: 'hero-grid' }),
    h('div', { class: 'hero-bg-img', style: "background-image: url('BlueskyBanner.png')" }),
    h('div', { class: 'hero-scanlines' }),
    h('div', { class: 'hero-vignette' }),
    h('div', { class: 'hero-fade' }),
    h('div', { class: 'hero-stencil', html: 'ENIGMA<br>ALLIANCE' }),
    h('div', { class: 'hero-content' },
      h('div', null,
        h('div', { class: 'hero-eyebrow' }, 'MANIFEST // AIDAN DOUGAN // SCAD 2025'),
        h('h1', { class: 'hero-name', html: 'Game Designer<br>&amp; Creative<br>Developer' }),
        h('p', { class: 'hero-tagline' }, o.tagline),
        h('div', { class: 'hero-actions' },
          h('a', { href: '#projects', class: 'btn-primary', on: { click: e => {
            e.preventDefault();
            const el = document.getElementById('projects');
            if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
          } } }, 'View Projects ↓'),
          h('a', { href: o.resume, class: 'btn-secondary', download: '' }, 'Resume ↓'),
        ),
      ),
      h('div', { class: 'hero-featured', 'data-hover': '', on: { click: () => navHash('#/project/' + featured.id) } },
        h('img', { src: featured.header, alt: featured.title, class: 'hero-featured-img' }),
        h('div', { class: 'hero-featured-meta' },
          h('span', { class: 'hero-featured-num' }, featured.num + ' — ' + featured.title),
          h('span', { class: 'hero-featured-arrow' }, '→'),
        ),
      ),
    ),
  );

  const projectsSec = h('section', { id: 'projects', style: 'padding: 80px 40px 0; max-width: 1400px; margin: 0 auto;' },
    h('div', { class: 'reveal' },
      h('div', { class: 'section-label' }, 'CARGO MANIFEST'),
      h('h2', { class: 'section-title' }, 'Projects'),
    ),
    h('div', { class: 'projects-grid stagger' },
      ...DATA.projects.map(p =>
        h('div', { class: 'project-card reveal', 'data-hover': '', on: { click: () => navHash('#/project/' + p.id) } },
          h('div', { class: 'card-img-wrap' },
            h('img', { src: p.header, alt: p.title, class: 'card-img', loading: 'lazy' }),
            h('div', { class: 'card-overlay' }),
          ),
          h('div', { class: 'card-body' },
            h('div', { class: 'card-num' }, p.num),
            h('div', { class: 'card-title' }, p.title),
            h('div', { class: 'card-role' }, p.role),
            h('p', { class: 'card-desc' }, p.tagline),
            h('div', { class: 'card-footer' }, h('span', { class: 'card-arrow' }, '→')),
          ),
        ),
      ),
    ),
    h('div', { class: 'pro-strip reveal' },
      h('div', { class: 'section-label' }, 'NDA / PROFESSIONAL'),
      h('div', { class: 'pro-grid' },
        ...DATA.professional.map(pr =>
          h('div', { class: 'pro-item' },
            h('div', { class: 'pro-bar' }),
            h('div', null,
              h('div', { class: 'pro-org' }, pr.org),
              h('div', { class: 'pro-role' }, pr.role + ' — ' + pr.sub),
              h('div', { class: 'pro-note' }, pr.note),
            ),
          ),
        ),
      ),
    ),
  );

  const about = h('section', { id: 'about', style: 'padding: 80px 40px; max-width: 1400px; margin: 0 auto;' },
    h('div', { class: 'about-grid' },
      h('div', { class: 'reveal-left' },
        h('div', { class: 'section-label' }, 'ABOUT'),
        h('div', { class: 'about-big-name', html: 'AIDAN<br>DOUGAN' }),
      ),
      h('div', { class: 'reveal' },
        h('p', { class: 'about-text' }, o.about),
        h('div', { class: 'about-contact' },
          h('a', { href: 'mailto:' + o.email }, o.email),
          h('a', { href: 'tel:' + o.phone.replace(/\D/g,'') }, o.phone),
          h('a', { href: o.resume, download: '', style: 'color: var(--pink)' }, 'Resume.pdf ↓'),
        ),
      ),
    ),
  );

  view.appendChild(hero);
  view.appendChild(projectsSec);
  view.appendChild(about);
  return view;
}

/* ---------- Project ---------- */
function buildProject(id) {
  const idx = DATA.projects.findIndex(p => p.id === id);
  const p = DATA.projects[idx];
  const view = h('div', { class: 'page-enter' });
  if (!p) {
    view.appendChild(h('div', { style: 'padding: 120px 40px; text-align: center; font-family: var(--mono); color: var(--dim);' }, 'Project not found.'));
    return view;
  }
  const prev = idx > 0 ? DATA.projects[idx - 1] : null;
  const next = idx < DATA.projects.length - 1 ? DATA.projects[idx + 1] : null;

  const hero = h('div', { class: 'proj-hero', id: 'proj-hero' },
    h('img', { src: p.header, alt: p.title, class: 'proj-hero-img' }),
    h('div', { class: 'proj-hero-fade' }),
    h('div', { class: 'proj-hero-content' },
      h('div', null,
        h('div', { class: 'proj-eyebrow' }, 'CASE FILE ' + p.num + ' — ' + p.role.toUpperCase()),
        h('h1', { class: 'proj-title' }, p.title),
      ),
      p.links.length ? h('div', { class: 'proj-hero-links' },
        ...p.links.map((l, i) => h('a', {
          href: l.url, target: '_blank', rel: 'noopener noreferrer',
          download: l.download ? '' : null,
          class: 'proj-link ' + (i === 0 ? 'filled' : 'outline'),
          'data-hover': '',
        }, l.icon + ' ' + l.label))
      ) : null,
    ),
  );
  setTimeout(() => hero.classList.add('entered'), 100);

  const backBar = h('div', { class: 'back-bar' },
    h('button', { class: 'back-btn', 'data-hover': '', on: { click: () => navHash('#/') } }, '← All Projects'),
    h('div', null,
      prev ? h('button', { class: 'back-btn dim', 'data-hover': '', on: { click: () => navHash('#/project/' + prev.id) } }, '← ' + prev.title) : null,
      prev && next ? h('span', { style: 'color: var(--line); margin: 0 8px; font-family: var(--mono); font-size: 10px;' }, '·') : null,
      next ? h('button', { class: 'back-btn dim', 'data-hover': '', on: { click: () => navHash('#/project/' + next.id) } }, next.title + ' →') : null,
    ),
  );

  const meta = h('div', { class: 'meta-row' },
    ...[['ROLE', p.role], ['ENGINE / TOOLS', p.tools[0]], ['STATUS', p.status], ['YEAR', p.year], ['TEAM', p.team]].map(([k, v]) =>
      h('div', { class: 'meta-cell' },
        h('div', { class: 'meta-key' }, k),
        h('div', { class: 'meta-val' }, v),
      ),
    ),
  );

  const body = h('div', { class: 'proj-body' },
    h('div', { class: 'reveal-left' },
      h('div', { class: 'prose-label' }, 'OVERVIEW'),
      h('p', { class: 'prose-text' }, p.description),
      h('div', { class: 'prose-label' }, 'MY CONTRIBUTION'),
      h('p', { class: 'prose-text' }, p.contribution),
      h('div', { class: 'prose-label', style: 'margin-top: 32px;' }, 'TOOLS & TECHNOLOGY'),
      h('div', { class: 'tools-row' }, ...p.tools.map(t => h('span', { class: 'tool-chip' }, t))),
    ),
    h('div', { class: 'proj-img-col reveal' },
      p.images[0] ? h('img', { src: p.images[0], alt: p.title, class: 'proj-img-main', 'data-hover': '', on: { click: () => openLightbox(p.images[0]) } }) : null,
      p.images.length > 1 ? h('div', { class: 'proj-img-grid' },
        ...p.images.slice(1, 3).map((img, i) =>
          h('img', { src: img, alt: p.title, class: 'proj-img-thumb', 'data-hover': '', on: { click: () => openLightbox(img) } })
        )
      ) : null,
    ),
  );

  view.appendChild(hero);
  view.appendChild(backBar);
  view.appendChild(meta);
  view.appendChild(body);

  // Awards strip (if present)
  if (p.awards && p.awards.length) {
    view.appendChild(h('div', { class: 'awards-strip reveal' },
      h('div', { class: 'awards-inner' },
        h('div', { class: 'section-label' }, 'AWARDS & RECOGNITION'),
        h('div', { class: 'awards-list' },
          ...p.awards.map(a => h('div', { class: 'award-row' },
            h('span', { class: 'award-level' }, a.level.toUpperCase()),
            h('span', { class: 'award-body' }, a.body),
            h('span', { class: 'award-cat' }, a.category),
          )),
        ),
      ),
    ));
  }

  // Extra gallery
  const extras = [...p.images.slice(3), ...((p.galleryExtra) || [])];
  if (extras.length) {
    view.appendChild(h('div', { class: 'proj-gallery reveal' },
      ...extras.map(img => h('img', { src: img, alt: p.title, class: 'proj-gallery-img', 'data-hover': '', on: { click: () => openLightbox(img) } }))
    ));
  }

  // Case study CTA
  if (p.hasCaseStudy) {
    view.appendChild(h('div', { class: 'cs-cta reveal' },
      h('div', { class: 'cs-cta-inner' },
        h('div', null,
          h('div', { class: 'cs-cta-label' }, 'WANT THE FULL BREAKDOWN?'),
          h('div', { class: 'cs-cta-sub' }, 'Design process, system diagrams, iteration history, and technical notes.'),
        ),
        h('button', { class: 'btn-primary', 'data-hover': '', on: { click: () => navHash('#/project/' + p.id + '/case-study') } }, 'View Case Study →'),
      ),
    ));
  }

  return view;
}

/* ---------- Case Study ---------- */
function buildCaseStudy(id) {
  const p = DATA.projects.find(x => x.id === id);
  const cs = p && p.caseStudy;
  const view = h('div', { class: 'page-enter', style: 'padding-top: 56px;' });
  if (!p || !cs) {
    view.appendChild(h('div', { style: 'padding: 120px 40px; text-align: center; font-family: var(--mono); color: var(--dim);' }, 'No case study available.'));
    return view;
  }
  const toc = ['01 BRIEF', '02 PROCESS', '03 KEY SYSTEMS', '04 ITERATIONS', '05 TECHNICAL', '06 REFLECTIONS'];

  view.appendChild(h('div', { class: 'back-bar' },
    h('button', { class: 'back-btn', 'data-hover': '', on: { click: () => navHash('#/project/' + id) } }, '← Back to Project'),
    h('button', { class: 'back-btn dim', 'data-hover': '', on: { click: () => navHash('#/') } }, 'Home'),
  ));

  view.appendChild(h('div', { class: 'cs-header' },
    h('div', null,
      h('div', { class: 'cs-eyebrow' }, 'CASE STUDY — FILE ' + p.num),
      h('h1', { class: 'cs-title' }, p.title),
      h('div', { class: 'cs-subtitle' }, 'Design Process & Technical Notes'),
    ),
    h('div', { style: 'display: flex; gap: 10px;' },
      cs.caseStudyPdf ? h('a', { href: cs.caseStudyPdf, download: '', class: 'proj-link filled', 'data-hover': '' }, '↓ Download PDF') : null,
      h('button', { class: 'proj-link outline', 'data-hover': '', on: { click: () => navHash('#/project/' + id) } }, '← Project'),
    ),
  ));

  view.appendChild(h('div', { class: 'toc-bar' },
    h('span', { class: 'toc-label' }, 'INDEX'),
    ...toc.map((t, i) => h('a', { href: '#cs-0' + (i + 1), class: 'toc-item' }, t)),
  ));

  const main = h('div', { class: 'cs-main' });
  // 01
  main.appendChild(h('div', { class: 'cs-section reveal', id: 'cs-01' },
    h('div', { class: 'cs-sec-header' },
      h('span', { class: 'cs-sec-num' }, '01'),
      h('span', { class: 'cs-sec-label' }, 'DESIGN BRIEF'),
    ),
    h('p', { style: 'font-size: 14px; color: rgba(240,234,235,.7); line-height: 1.85; margin-bottom: 16px;' }, cs.brief),
    h('div', { class: 'stats-grid' },
      ...cs.stats.map(s => h('div', { class: 'stat-cell' },
        h('div', { class: 'stat-key' }, s.k.toUpperCase()),
        h('div', { class: 'stat-val' }, s.v),
      )),
    ),
  ));
  // 02
  main.appendChild(h('div', { class: 'cs-section reveal', id: 'cs-02' },
    h('div', { class: 'cs-sec-header' },
      h('span', { class: 'cs-sec-num' }, '02'),
      h('span', { class: 'cs-sec-label' }, 'PROCESS TIMELINE'),
    ),
    h('div', { class: 'timeline' },
      ...cs.timeline.map((tl, i) => h('div', { class: 'tl-item' },
        h('div', { class: 'tl-spine' },
          h('div', { class: 'tl-dot' }),
          i < cs.timeline.length - 1 ? h('div', { class: 'tl-line' }) : null,
        ),
        h('div', { class: 'tl-content' },
          h('span', { class: 'tl-phase' }, tl.phase),
          h('span', { class: 'tl-date' }, tl.date),
          h('p', { class: 'tl-detail' }, tl.detail),
        ),
      )),
    ),
  ));
  // 03
  main.appendChild(h('div', { class: 'cs-section reveal', id: 'cs-03' },
    h('div', { class: 'cs-sec-header' },
      h('span', { class: 'cs-sec-num' }, '03'),
      h('span', { class: 'cs-sec-label' }, 'KEY SYSTEMS'),
    ),
    h('div', { class: 'systems-grid' },
      ...cs.systems.map(s => h('div', { class: 'sys-card' },
        h('div', { class: 'sys-title' }, s.t),
        h('p', { class: 'sys-desc' }, s.d),
      )),
    ),
  ));
  // 04
  main.appendChild(h('div', { class: 'cs-section reveal', id: 'cs-04' },
    h('div', { class: 'cs-sec-header' },
      h('span', { class: 'cs-sec-num' }, '04'),
      h('span', { class: 'cs-sec-label' }, 'ITERATIONS'),
    ),
    h('div', { class: 'iter-list' },
      ...cs.iterations.map(it => h('div', { class: 'iter-item' },
        h('span', { class: 'iter-v' }, it.v),
        h('p', { class: 'iter-note' }, it.note),
      )),
    ),
  ));
  // 05
  main.appendChild(h('div', { class: 'cs-section reveal', id: 'cs-05' },
    h('div', { class: 'cs-sec-header' },
      h('span', { class: 'cs-sec-num' }, '05'),
      h('span', { class: 'cs-sec-label' }, 'TECHNICAL NOTES'),
    ),
    h('div', { class: 'tech-grid' },
      ...cs.technicalNotes.map(t => h('div', { class: 'tech-card' },
        h('div', { class: 'tech-title' }, t.t),
        h('p', { class: 'tech-desc' }, t.d),
      )),
    ),
  ));
  // 06
  main.appendChild(h('div', { class: 'cs-section reveal', id: 'cs-06' },
    h('div', { class: 'cs-sec-header' },
      h('span', { class: 'cs-sec-num' }, '06'),
      h('span', { class: 'cs-sec-label' }, 'REFLECTIONS'),
    ),
    h('p', { style: 'font-size: 14px; color: rgba(240,234,235,.7); line-height: 1.85;' },
      "Dough or Die taught me what it really means to ship. The biggest lesson wasn't a design decision — it was learning how to cut scope with conviction. Every feature that didn't make it in was a deliberate choice, and that clarity made the product sharper."),
  ));

  const sidebar = h('div', { class: 'cs-sidebar' },
    h('div', { class: 'sidebar-box reveal' },
      h('div', { class: 'sidebar-box-label' }, 'PROJECT STATS'),
      ...cs.stats.map(s => h('div', { class: 'sidebar-stat-row' },
        h('span', { class: 'sidebar-stat-key' }, s.k),
        h('span', { class: 'sidebar-stat-val' }, s.v),
      )),
    ),
    p.images.length ? h('div', { class: 'sidebar-box reveal' },
      h('div', { class: 'sidebar-box-label' }, 'GALLERY'),
      h('div', { class: 'sidebar-thumb-grid' },
        ...p.images.slice(0, 4).map(img => h('img', { src: img, alt: p.title, class: 'sidebar-thumb', 'data-hover': '', on: { click: () => openLightbox(img) } })),
      ),
    ) : null,
    h('div', { class: 'sidebar-box reveal' },
      h('div', { class: 'sidebar-box-label' }, 'LINKS'),
      cs.caseStudyPdf ? h('a', { href: cs.caseStudyPdf, download: '', class: 'sidebar-link primary-link', 'data-hover': '' }, h('span', null, '↓'), ' Download Case Study PDF') : null,
      ...p.links.map(l => h('a', { href: l.url, target: '_blank', rel: 'noopener noreferrer', download: l.download ? '' : null, class: 'sidebar-link', 'data-hover': '' }, h('span', null, l.icon), ' ' + l.label)),
    ),
  );

  view.appendChild(h('div', { class: 'cs-layout' }, main, sidebar));
  return view;
}

/* ---------- Router ---------- */
function parseHash(hash) {
  const h = hash.replace(/^#\/?/, '');
  if (!h || h === '/') return { view: 'home' };
  const parts = h.split('/');
  if (parts[0] === 'project' && parts[1]) {
    if (parts[2] === 'case-study') return { view: 'case-study', id: parts[1] };
    return { view: 'project', id: parts[1] };
  }
  return { view: 'home' };
}

function crumbsFor(route) {
  if (route.view === 'home') return null;
  const p = DATA.projects.find(x => x.id === route.id);
  if (!p) return null;
  if (route.view === 'case-study') return 'HOME / PROJECTS / ' + p.title.toUpperCase() + ' / CASE STUDY';
  return 'HOME / PROJECTS / ' + p.title.toUpperCase();
}

function render() {
  const route = parseHash(window.location.hash);
  const root = document.getElementById('root');
  root.innerHTML = '';
  root.appendChild(buildNav(crumbsFor(route)));
  if (route.view === 'home')        root.appendChild(buildHome());
  if (route.view === 'project')     root.appendChild(buildProject(route.id));
  if (route.view === 'case-study')  root.appendChild(buildCaseStudy(route.id));
  root.appendChild(buildFooter());
  window.scrollTo(0, 0);
  observeReveal(root);

  // Nav scroll state
  const nav = document.getElementById('site-nav');
  const onScroll = () => nav && nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', render);
