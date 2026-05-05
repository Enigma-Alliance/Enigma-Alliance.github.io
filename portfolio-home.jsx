// portfolio-home.jsx — HomePage component

const homeCSS = `
/* ── HERO ── */
.hero {
  position: relative; min-height: 100vh;
  display: flex; align-items: flex-end;
  padding: 0 40px 72px; overflow: hidden;
}
.hero-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(#2a1a2022 1px, transparent 1px),
    linear-gradient(90deg, #2a1a2022 1px, transparent 1px);
  background-size: 52px 52px;
  pointer-events: none;
}
.hero-bg-img {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  opacity: .18;
  pointer-events: none;
}
.hero-scanlines {
  position: absolute; inset: 0;
  background: repeating-linear-gradient(
    0deg, transparent, transparent 3px,
    rgba(255,255,255,.009) 3px, rgba(255,255,255,.009) 4px
  );
  pointer-events: none;
}
.hero-vignette {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at 50% 0%, transparent 40%, rgba(10,10,10,.8) 100%);
  pointer-events: none;
}
.hero-fade {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,.15) 50%, transparent 100%);
  pointer-events: none;
}
.hero-stencil {
  position: absolute; top: 50px; left: 40px; right: 40px;
  font-family: var(--mono); font-size: clamp(80px, 11vw, 160px);
  font-weight: 700; line-height: .85; letter-spacing: -.04em;
  color: rgba(230,127,142,.07); user-select: none; pointer-events: none;
  z-index: 1;
}
.hero-content {
  position: relative; z-index: 2;
  max-width: 1400px; width: 100%; margin: 0 auto;
  display: grid; grid-template-columns: 1fr 380px;
  gap: 48px; align-items: flex-end;
}
.hero-eyebrow {
  font-family: var(--mono); font-size: 11px; letter-spacing: .22em;
  color: #e67f8e; margin-bottom: 18px; opacity: 0;
  animation: fadeUp .7s .2s forwards;
}
.hero-name {
  font-family: var(--mono); font-size: clamp(40px, 6vw, 72px);
  font-weight: 700; line-height: .92; letter-spacing: -.03em;
  margin-bottom: 18px; opacity: 0;
  animation: fadeUp .7s .35s forwards;
}
.hero-tagline {
  font-size: 15px; color: rgba(240,234,235,.65); line-height: 1.7;
  max-width: 480px; margin-bottom: 32px; opacity: 0;
  animation: fadeUp .7s .5s forwards;
}
.hero-actions {
  display: flex; gap: 12px; opacity: 0;
  animation: fadeUp .7s .65s forwards;
}
.btn-primary {
  display: inline-block; background: #e67f8e; color: #0a0a0a;
  font-family: var(--mono); font-size: 11px; font-weight: 700;
  letter-spacing: .12em; padding: 11px 28px;
  border: none; cursor: none; text-decoration: none;
  transition: background .2s, transform .2s, box-shadow .2s;
  position: relative; overflow: hidden;
}
.btn-primary::after {
  content: ''; position: absolute; inset: 0;
  background: rgba(255,255,255,.15); transform: scaleX(0);
  transform-origin: left; transition: transform .28s ease;
}
.btn-primary:hover::after { transform: scaleX(1); }
.btn-primary:hover { box-shadow: 0 8px 24px rgba(230,127,142,.35); }

.btn-secondary {
  display: inline-block; border: 1px solid #2a1a20;
  color: #f2ffb4; background: none;
  font-family: var(--mono); font-size: 11px;
  letter-spacing: .12em; padding: 11px 28px;
  cursor: none; text-decoration: none;
  transition: color .2s, border-color .2s, background .2s;
}
.btn-secondary:hover { border-color: #f2ffb4; background: rgba(242,255,180,.06); }

/* featured card */
.hero-featured {
  opacity: 0; animation: fadeIn .8s .8s forwards;
}
.hero-featured-img {
  width: 100%; height: 200px;
  object-fit: cover; display: block;
  border: 1px solid #2a1a20;
  transition: filter .3s;
}
.hero-featured-img:hover { filter: brightness(1.1); }
.hero-featured-meta {
  display: flex; justify-content: space-between;
  align-items: baseline; margin-top: 10px;
  font-family: var(--mono); font-size: 10px;
}
.hero-featured-num { color: #e67f8e; letter-spacing: .15em; }
.hero-featured-title { color: rgba(240,234,235,.8); }
.hero-featured-arrow { color: #e67f8e; font-size: 16px; cursor: none; }

@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

/* ── PROJECTS SECTION ── */
.section-label {
  font-family: var(--mono); font-size: 10px;
  letter-spacing: .22em; color: #e67f8e; margin-bottom: 8px;
}
.section-title {
  font-family: var(--mono); font-size: 26px;
  font-weight: 700; letter-spacing: -.01em;
  margin-bottom: 40px;
  position: relative; display: inline-block;
}
.section-title::after {
  content: ''; position: absolute; bottom: -6px; left: 0;
  width: 0; height: 2px;
  background: linear-gradient(90deg, #e67f8e, #f2ffb4);
  transition: width .6s cubic-bezier(.4,0,.2,1) .1s;
}
.section-title.visible::after { width: 100%; }

/* project grid */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px; margin-bottom: 48px;
}
@media (max-width: 1100px) { .projects-grid { grid-template-columns: repeat(2,1fr); } }
@media (max-width: 680px)  { .projects-grid { grid-template-columns: 1fr; } }

/* ── PROJECT CARD ── */
.project-card {
  background: #111111; border: 1px solid #2a1a20;
  border-top: 2px solid #e67f8e;
  overflow: hidden; cursor: none;
  transition: transform .4s cubic-bezier(.34,1.56,.64,1), border-color .3s, box-shadow .4s;
  position: relative;
}
.project-card::before {
  content: ''; position: absolute; top: 0; left: -120%;
  width: 60%; height: 100%;
  background: linear-gradient(105deg, transparent 40%, rgba(230,127,142,.06) 50%, transparent 60%);
  transition: left .55s ease; pointer-events: none; z-index: 1;
}
.project-card:hover::before { left: 170%; }
.project-card:hover {
  transform: translateY(-10px) scale(1.012);
  border-color: #e67f8e;
  box-shadow: 0 20px 50px rgba(0,0,0,.6), 0 0 0 1px rgba(230,127,142,.1), 0 0 32px rgba(230,127,142,.08);
}

.card-img-wrap {
  position: relative; height: 170px; overflow: hidden;
  border-bottom: 1px solid #2a1a20;
}
.card-img {
  width: 100%; height: 100%;
  object-fit: cover; display: block;
  transition: transform .5s ease, filter .3s;
  filter: brightness(.85) saturate(.9);
}
.project-card:hover .card-img { transform: scale(1.05); filter: brightness(1) saturate(1); }

.card-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(17,17,17,.7) 0%, transparent 60%);
  transition: opacity .3s;
}
.project-card:hover .card-overlay { opacity: .4; }

.card-body { padding: 18px 20px; }
.card-num { font-family: var(--mono); font-size: 9px; color: #e67f8e; letter-spacing: .18em; margin-bottom: 6px; }
.card-title {
  font-family: var(--mono); font-size: 17px; font-weight: 700;
  letter-spacing: .01em; margin-bottom: 6px;
  transition: color .2s;
}
.project-card:hover .card-title { color: #e67f8e; }
.card-role { font-family: var(--mono); font-size: 10px; color: #6a5058; letter-spacing: .08em; margin-bottom: 10px; }
.card-desc { font-size: 12px; color: rgba(240,234,235,.55); line-height: 1.65; margin-bottom: 16px; }
.card-footer { display: flex; justify-content: flex-end; align-items: center; }
.card-arrow {
  font-size: 18px; color: #2a1a20;
  transition: color .2s, transform .3s cubic-bezier(.34,1.56,.64,1);
}
.project-card:hover .card-arrow { color: #e67f8e; transform: translateX(6px); }

/* ── PROFESSIONAL ── */
.pro-strip {
  border: 1px solid #2a1a20; border-left: 3px solid rgba(242,255,180,.3);
  padding: 28px 32px; margin-bottom: 80px;
}
.pro-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 32px;
  margin-top: 16px;
}
.pro-item { display: flex; gap: 16px; align-items: flex-start; }
.pro-bar { width: 2px; height: 44px; background: #f2ffb4; margin-top: 4px; flex-shrink: 0; }
.pro-org { font-family: var(--mono); font-size: 13px; font-weight: 700; color: #f0eaeb; }
.pro-role { font-family: var(--mono); font-size: 10px; color: #6a5058; margin-top: 4px; }
.pro-note { font-size: 11px; color: rgba(240,234,235,.3); margin-top: 4px; font-style: italic; }

/* ── ABOUT ── */
#about {
  padding: 80px 0; border-top: 1px solid #2a1a20;
}
.about-grid {
  display: grid; grid-template-columns: 1fr 1.6fr; gap: 80px; align-items: start;
}
.about-label-col .section-label { margin-bottom: 12px; }
.about-big-name {
  font-family: var(--mono); font-size: clamp(36px, 4vw, 56px);
  font-weight: 700; line-height: .88; letter-spacing: -.03em;
  color: rgba(240,234,235,.12);
}
.about-text { font-size: 15px; line-height: 1.85; color: rgba(240,234,235,.7); margin-bottom: 28px; }
.about-contact { display: flex; flex-direction: column; gap: 10px; }
.about-contact a {
  font-family: var(--mono); font-size: 12px;
  color: #6a5058; text-decoration: none;
  transition: color .2s;
}
.about-contact a:hover { color: #e67f8e; }

@media (max-width: 900px) {
  .hero-content { grid-template-columns: 1fr; }
  .hero-featured { display: none; }
  .about-grid { grid-template-columns: 1fr; gap: 32px; }
  .pro-grid { grid-template-columns: 1fr; }
  .hero { padding: 0 20px 60px; min-height: 90vh; }
}
`;

function HomePage({ onNav }) {
  const { projects, professional, owner } = window.PORTFOLIO_DATA;
  window.useScrollReveal();

  React.useEffect(() => {
    // Animate section-title underlines via IntersectionObserver
    const titles = document.querySelectorAll('.section-title');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: .3 });
    titles.forEach(t => io.observe(t));
    return () => io.disconnect();
  }, []);

  React.useEffect(() => {
    // Scroll reveal re-run on mount
    const els = document.querySelectorAll('.reveal, .reveal-left, .stagger > *');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: .1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const featured = projects[0];
  const goProject = (id) => { window.location.hash = `#/project/${id}`; if (onNav) onNav(); };

  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-bg-img" style={{ backgroundImage: `url('BlueskyBanner.png')` }} />
        <div className="hero-scanlines" />
        <div className="hero-vignette" />
        <div className="hero-fade" />
        <div className="hero-stencil">ENIGMA<br />ALLIANCE</div>

        <div className="hero-content">
          <div>
            <div className="hero-eyebrow">MANIFEST // AIDAN DOUGAN // SCAD 2025</div>
            <h1 className="hero-name">Game Designer<br />&amp; Creative<br />Developer</h1>
            <p className="hero-tagline">{owner.tagline}</p>
            <div className="hero-actions">
              <a href="#projects" className="btn-primary" onClick={e => { e.preventDefault(); const el = document.getElementById('projects'); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' }); }}>
                View Projects ↓
              </a>
              <a href={owner.resume} className="btn-secondary" download>Resume ↓</a>
            </div>
          </div>

          <div className="hero-featured" onClick={() => goProject(featured.id)} data-hover>
            <img src={featured.header} alt={featured.title} className="hero-featured-img" />
            <div className="hero-featured-meta">
              <span className="hero-featured-num">{featured.num} — {featured.title}</span>
              <span className="hero-featured-arrow">→</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" style={{ padding: '80px 40px 0', maxWidth: 1400, margin: '0 auto' }}>
        <div className="reveal">
          <div className="section-label">CARGO MANIFEST</div>
          <h2 className="section-title">Projects</h2>
        </div>

        <div className="projects-grid stagger">
          {projects.map(p => (
            <div key={p.id} className="project-card reveal" onClick={() => goProject(p.id)} data-hover>
              <div className="card-img-wrap">
                <img src={p.header} alt={p.title} className="card-img" loading="lazy" />
                <div className="card-overlay" />
              </div>
              <div className="card-body">
                <div className="card-num">{p.num}</div>
                <div className="card-title">{p.title}</div>
                <div className="card-role">{p.role}</div>
                <p className="card-desc">{p.tagline}</p>
                <div className="card-footer">
                  <span className="card-arrow">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PROFESSIONAL */}
        <div className="pro-strip reveal">
          <div className="section-label">NDA / PROFESSIONAL</div>
          <div className="pro-grid">
            {professional.map(p => (
              <div key={p.org} className="pro-item">
                <div className="pro-bar" />
                <div>
                  <div className="pro-org">{p.org}</div>
                  <div className="pro-role">{p.role} — {p.sub}</div>
                  <div className="pro-note">{p.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: '80px 40px', maxWidth: 1400, margin: '0 auto' }}>
        <div className="about-grid">
          <div className="about-label-col reveal-left">
            <div className="section-label">ABOUT</div>
            <div className="about-big-name">AIDAN<br />DOUGAN</div>
          </div>
          <div className="reveal">
            <p className="about-text">{owner.about}</p>
            <div className="about-contact">
              <a href={`mailto:${owner.email}`}>{owner.email}</a>
              <a href={`tel:${owner.phone.replace(/\D/g,'')}`}>{owner.phone}</a>
              <a href={owner.resume} download style={{ color: '#e67f8e' }}>Resume.pdf ↓</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Inject home CSS
if (!document.getElementById('home-styles')) {
  const s = document.createElement('style');
  s.id = 'home-styles';
  s.textContent = homeCSS.replace(/var\(--mono\)/g, "'IBM Plex Mono', monospace")
                          .replace(/var\(--sans\)/g, "'IBM Plex Sans', sans-serif");
  document.head.appendChild(s);
}

window.HomePage = HomePage;
