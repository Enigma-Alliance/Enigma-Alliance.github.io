// portfolio-project.jsx — ProjectPage + CaseStudy components

const projectCSS = `
/* ── PROJECT PAGE ── */
.proj-hero {
  position: relative; height: 60vh; min-height: 420px;
  overflow: hidden; display: flex; align-items: flex-end;
  margin-top: 56px;
}
.proj-hero-img {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; object-position: center;
  transition: transform 8s ease;
  pointer-events: none;
}
.proj-hero.entered .proj-hero-img { transform: scale(1.04); }
.proj-hero-fade {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,.3) 55%, transparent 100%);
  pointer-events: none;
}
.proj-hero-content {
  position: relative; z-index: 2;
  max-width: 1400px; width: 100%; margin: 0 auto;
  padding: 0 40px 40px;
  display: flex; justify-content: space-between; align-items: flex-end; gap: 24px;
}
.proj-eyebrow { font-family: var(--mono); font-size: 10px; letter-spacing: .2em; color: #e67f8e; margin-bottom: 12px; }
.proj-title {
  font-family: var(--mono); font-size: clamp(36px, 5vw, 64px);
  font-weight: 700; letter-spacing: -.03em; line-height: .9;
}
.proj-hero-links { display: flex; gap: 10px; flex-shrink: 0; }
.proj-link {
  display: inline-block; font-family: var(--mono); font-size: 10px;
  letter-spacing: .1em; padding: 8px 18px;
  cursor: none; text-decoration: none;
  transition: all .2s;
}
.proj-link.filled { background: #e67f8e; color: #0a0a0a; font-weight: 700; }
.proj-link.filled:hover { background: #f2ffb4; }
.proj-link.outline { border: 1px solid #2a1a20; color: #6a5058; }
.proj-link.outline:hover { border-color: #e67f8e; color: #f0eaeb; }

/* meta row */
.meta-row {
  display: flex; border-bottom: 1px solid #2a1a20;
  border-top: 1px solid #2a1a20;
}
.meta-cell {
  flex: 1; padding: 16px 24px;
  border-right: 1px solid #2a1a20;
}
.meta-cell:last-child { border-right: none; }
.meta-key { font-family: var(--mono); font-size: 9px; letter-spacing: .18em; color: #e67f8e; margin-bottom: 5px; }
.meta-val { font-family: var(--mono); font-size: 12px; font-weight: 600; }

/* back bar */
.back-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 40px; height: 44px;
  border-bottom: 1px solid #2a1a20;
  background: rgba(0,0,0,.3);
  max-width: 100%;
}
.back-btn {
  font-family: var(--mono); font-size: 10px; color: #e67f8e;
  background: none; border: none; cursor: none; letter-spacing: .1em;
  transition: opacity .2s;
}
.back-btn:hover { opacity: .7; }
.back-nav { font-family: var(--mono); font-size: 10px; color: #6a5058; letter-spacing: .1em; }

/* body layout */
.proj-body {
  max-width: 1400px; margin: 0 auto;
  padding: 56px 40px 0;
  display: grid; grid-template-columns: 1fr 1fr; gap: 56px;
}
.prose-label { font-family: var(--mono); font-size: 10px; letter-spacing: .2em; color: #e67f8e; margin-bottom: 12px; }
.prose-text { font-size: 15px; line-height: 1.85; color: rgba(240,234,235,.72); }
.prose-text + .prose-label { margin-top: 32px; }

.tools-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.tool-chip {
  font-family: var(--mono); font-size: 10px;
  padding: 4px 12px; border: 1px solid #2a1a20;
  color: #6a5058; letter-spacing: .08em;
  transition: border-color .2s, color .2s;
}
.tool-chip:hover { border-color: #e67f8e; color: #f0eaeb; }

/* image col */
.proj-img-col { display: flex; flex-direction: column; gap: 14px; }
.proj-img-main {
  width: 100%; aspect-ratio: 16/9;
  object-fit: cover; display: block;
  border: 1px solid #2a1a20;
  transition: filter .3s, transform .4s;
  cursor: zoom-in;
}
.proj-img-main:hover { filter: brightness(1.06); }
.proj-img-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.proj-img-thumb {
  width: 100%; aspect-ratio: 16/9;
  object-fit: cover; display: block;
  border: 1px solid #2a1a20; cursor: zoom-in;
  transition: filter .3s, transform .3s;
}
.proj-img-thumb:hover { filter: brightness(1.1); transform: scale(1.02); }

/* secondary gallery */
.proj-gallery {
  max-width: 1400px; margin: 40px auto 0; padding: 0 40px;
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;
}
.proj-gallery-img {
  width: 100%; aspect-ratio: 16/9;
  object-fit: cover; border: 1px solid #2a1a20;
  cursor: zoom-in; transition: filter .3s, transform .3s;
}
.proj-gallery-img:hover { filter: brightness(1.1); transform: scale(1.015); }

/* case study CTA */
.cs-cta {
  max-width: 1400px; margin: 48px auto 0; padding: 0 40px;
}
.cs-cta-inner {
  display: flex; align-items: center; justify-content: space-between; gap: 32px;
  padding: 28px 32px;
  border: 1px solid rgba(230,127,142,.25);
  border-left: 3px solid #e67f8e;
}
.cs-cta-label { font-family: var(--mono); font-size: 10px; letter-spacing: .18em; color: #e67f8e; margin-bottom: 6px; }
.cs-cta-sub { font-size: 13px; color: #6a5058; }

/* image lightbox */
.lightbox {
  position: fixed; inset: 0; background: rgba(0,0,0,.92);
  display: flex; align-items: center; justify-content: center;
  z-index: 5000; cursor: zoom-out;
  animation: fadeIn .2s ease;
}
.lightbox img {
  max-width: 92vw; max-height: 90vh;
  object-fit: contain; border: 1px solid #2a1a20;
  box-shadow: 0 30px 80px rgba(0,0,0,.8);
}
.lightbox-close {
  position: absolute; top: 24px; right: 24px;
  font-size: 2rem; color: rgba(255,255,255,.5);
  background: none; border: none; cursor: none;
  transition: color .2s, transform .2s;
}
.lightbox-close:hover { color: #e67f8e; transform: rotate(90deg); }

/* ── CASE STUDY ── */
.cs-header {
  padding: 36px 40px 32px; border-bottom: 1px solid #2a1a20;
  display: flex; justify-content: space-between; align-items: flex-end;
  max-width: 1400px; margin: 0 auto; margin-top: 56px;
}
.cs-eyebrow { font-family: var(--mono); font-size: 9px; letter-spacing: .22em; color: #e67f8e; margin-bottom: 12px; }
.cs-title { font-family: var(--mono); font-size: clamp(24px, 3.5vw, 44px); font-weight: 700; letter-spacing: -.02em; line-height: .95; }
.cs-subtitle { font-family: var(--mono); font-size: 14px; color: #6a5058; font-weight: 400; margin-top: 8px; }

.toc-bar {
  padding: 14px 40px; background: rgba(0,0,0,.25);
  border-bottom: 1px solid #2a1a20;
  display: flex; gap: 28px; align-items: center;
  overflow-x: auto; scrollbar-width: none;
}
.toc-bar::-webkit-scrollbar { display: none; }
.toc-label { font-family: var(--mono); font-size: 9px; letter-spacing: .2em; color: #e67f8e; flex-shrink: 0; }
.toc-item {
  font-family: var(--mono); font-size: 9px; letter-spacing: .1em;
  color: #6a5058; cursor: none; flex-shrink: 0;
  border-bottom: 1px solid transparent; padding-bottom: 1px;
  transition: color .2s, border-color .2s; white-space: nowrap;
}
.toc-item:hover { color: #e67f8e; border-color: #e67f8e; }

.cs-layout {
  max-width: 1400px; margin: 0 auto;
  padding: 56px 40px;
  display: grid; grid-template-columns: 1fr 320px; gap: 56px;
  align-items: start;
}
.cs-main {}
.cs-sidebar { position: sticky; top: 72px; display: flex; flex-direction: column; gap: 24px; }

.cs-section { margin-bottom: 56px; }
.cs-sec-header {
  display: flex; align-items: baseline; gap: 16px;
  padding-bottom: 14px; border-bottom: 1px solid #2a1a20;
  margin-bottom: 24px;
}
.cs-sec-num { font-family: var(--mono); font-size: 28px; font-weight: 700; color: rgba(230,127,142,.3); width: 40px; flex-shrink: 0; }
.cs-sec-label { font-family: var(--mono); font-size: 10px; letter-spacing: .2em; color: #e67f8e; }

.stats-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 0; border: 1px solid #2a1a20; margin-top: 16px;
}
.stat-cell {
  padding: 14px 18px; border-right: 1px solid #2a1a20;
  border-bottom: 1px solid #2a1a20;
}
.stat-cell:nth-child(3n) { border-right: none; }
.stat-key { font-family: var(--mono); font-size: 9px; letter-spacing: .15em; color: #e67f8e; margin-bottom: 5px; }
.stat-val { font-family: var(--mono); font-size: 13px; font-weight: 700; }

/* timeline */
.timeline { display: flex; flex-direction: column; gap: 0; }
.tl-item { display: flex; gap: 0; }
.tl-spine { display: flex; flex-direction: column; align-items: center; margin-right: 20px; }
.tl-dot { width: 10px; height: 10px; border: 2px solid #e67f8e; border-radius: 50%; margin-top: 3px; flex-shrink: 0; background: #0a0a0a; }
.tl-line { width: 1px; flex: 1; background: #2a1a20; min-height: 28px; }
.tl-content { padding-bottom: 28px; }
.tl-phase { font-family: var(--mono); font-size: 11px; font-weight: 700; letter-spacing: .1em; }
.tl-date { font-family: var(--mono); font-size: 9px; color: #e67f8e; letter-spacing: .12em; margin-left: 10px; }
.tl-detail { font-size: 12px; color: rgba(240,234,235,.6); line-height: 1.65; margin-top: 5px; }

/* systems */
.systems-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.sys-card {
  padding: 18px; border: 1px solid #2a1a20;
  border-left: 2px solid rgba(230,127,142,.4);
  transition: border-left-color .2s;
}
.sys-card:hover { border-left-color: #e67f8e; }
.sys-title { font-family: var(--mono); font-size: 12px; font-weight: 700; margin-bottom: 8px; }
.sys-desc { font-size: 11px; color: rgba(240,234,235,.55); line-height: 1.65; }

/* iterations */
.iter-list { display: flex; flex-direction: column; gap: 12px; }
.iter-item { display: flex; gap: 16px; align-items: flex-start; }
.iter-v { font-family: var(--mono); font-size: 10px; color: #e67f8e; letter-spacing: .12em; width: 40px; flex-shrink: 0; padding-top: 2px; }
.iter-note {
  font-size: 12px; color: rgba(240,234,235,.6); line-height: 1.65;
  border-left: 1px solid #2a1a20; padding-left: 16px; flex: 1;
}

/* tech notes */
.tech-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.tech-card {
  padding: 18px; background: rgba(0,0,0,.3);
  border: 1px solid rgba(42,26,32,.6);
}
.tech-title { font-family: var(--mono); font-size: 11px; font-weight: 700; margin-bottom: 8px; }
.tech-desc { font-size: 11px; color: rgba(240,234,235,.5); line-height: 1.65; }

/* sidebar boxes */
.sidebar-box { border: 1px solid #2a1a20; padding: 20px; }
.sidebar-box-label { font-family: var(--mono); font-size: 9px; letter-spacing: .2em; color: #e67f8e; margin-bottom: 14px; }
.sidebar-stat-row {
  display: flex; justify-content: space-between;
  padding: 8px 0; border-bottom: 1px solid rgba(42,26,32,.5);
  font-family: var(--mono); font-size: 10px;
}
.sidebar-stat-row:last-child { border-bottom: none; }
.sidebar-stat-key { color: #6a5058; }
.sidebar-stat-val { font-weight: 600; }
.sidebar-thumb-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.sidebar-thumb {
  width: 100%; aspect-ratio: 16/9; object-fit: cover;
  border: 1px solid #2a1a20; cursor: zoom-in;
  transition: filter .3s;
}
.sidebar-thumb:hover { filter: brightness(1.1); }
.sidebar-link {
  display: flex; gap: 10px; align-items: center;
  font-family: var(--mono); font-size: 11px;
  color: #6a5058; text-decoration: none;
  padding: 8px 0; border-bottom: 1px solid rgba(42,26,32,.4);
  transition: color .2s;
}
.sidebar-link:last-child { border-bottom: none; }
.sidebar-link:hover { color: #e67f8e; }
.sidebar-link.primary-link { color: #e67f8e; }

@media (max-width: 1000px) {
  .cs-layout { grid-template-columns: 1fr; }
  .cs-sidebar { position: static; }
  .proj-body { grid-template-columns: 1fr; }
  .proj-gallery { grid-template-columns: 1fr 1fr; }
  .systems-grid, .tech-grid { grid-template-columns: 1fr; }
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .back-bar, .proj-hero-content, .meta-row, .proj-body, .proj-gallery, .cs-cta, .cs-header, .cs-layout, .toc-bar { padding-left: 20px; padding-right: 20px; }
}
`;

/* ── Lightbox ── */
function Lightbox({ src, onClose }) {
  React.useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);
  return (
    <div className="lightbox" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose} data-hover>×</button>
      <img src={src} alt="Expanded" onClick={e => e.stopPropagation()} />
    </div>
  );
}

/* ── ProjectPage ── */
function ProjectPage({ projectId, onNav }) {
  const { projects } = window.PORTFOLIO_DATA;
  const [lightbox, setLightbox] = React.useState(null);
  const heroRef = React.useRef(null);

  const idx = projects.findIndex(p => p.id === projectId);
  const project = projects[idx];
  const prevProj = idx > 0 ? projects[idx - 1] : null;
  const nextProj = idx < projects.length - 1 ? projects[idx + 1] : null;

  React.useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => heroRef.current && heroRef.current.classList.add('entered'), 100);
  }, [projectId]);

  window.useScrollReveal();

  React.useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: .1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [projectId]);

  if (!project) return <div style={{ padding: '120px 40px', textAlign: 'center', fontFamily: T.mono, color: T.dim }}>Project not found.</div>;

  const goBack = () => { window.location.hash = '#/'; if (onNav) onNav(); };
  const goCaseStudy = () => { window.location.hash = `#/project/${project.id}/case-study`; if (onNav) onNav(); };

  return (
    <div>
      {/* HERO BANNER */}
      <div className="proj-hero" ref={heroRef}>
        <img src={project.header} alt={project.title} className="proj-hero-img" />
        <div className="proj-hero-fade" />
        <div className="proj-hero-content">
          <div>
            <div className="proj-eyebrow">CASE FILE {project.num} — {project.role.toUpperCase()}</div>
            <h1 className="proj-title">{project.title}</h1>
          </div>
          {project.links.length > 0 && (
            <div className="proj-hero-links">
              {project.links.map((l, i) => (
                <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" download={l.download || undefined}
                  className={`proj-link ${i === 0 ? 'filled' : 'outline'}`} data-hover>
                  {l.icon} {l.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* BACK BAR */}
      <div className="back-bar">
        <button className="back-btn" onClick={goBack} data-hover>← All Projects</button>
        <div className="back-nav">
          {prevProj && <button className="back-btn" style={{ color: T.dim }} onClick={() => { window.location.hash = `#/project/${prevProj.id}`; if (onNav) onNav(); }} data-hover>← {prevProj.title}</button>}
          {prevProj && nextProj && <span style={{ color: T.line, margin: '0 8px', fontFamily: T.mono, fontSize: 10 }}>·</span>}
          {nextProj && <button className="back-btn" style={{ color: T.dim }} onClick={() => { window.location.hash = `#/project/${nextProj.id}`; if (onNav) onNav(); }} data-hover>{nextProj.title} →</button>}
        </div>
      </div>

      {/* META ROW */}
      <div className="meta-row">
        {[['ROLE', project.role], ['ENGINE / TOOLS', project.tools[0]], ['STATUS', project.status], ['YEAR', project.year], ['TEAM', project.team]].map(([k, v]) => (
          <div key={k} className="meta-cell">
            <div className="meta-key">{k}</div>
            <div className="meta-val">{v}</div>
          </div>
        ))}
      </div>

      {/* BODY */}
      <div className="proj-body">
        <div className="reveal-left">
          <div className="prose-label">OVERVIEW</div>
          <p className="prose-text">{project.description}</p>
          <div className="prose-label">MY CONTRIBUTION</div>
          <p className="prose-text">{project.contribution}</p>
          <div className="prose-label" style={{ marginTop: 32 }}>TOOLS &amp; TECHNOLOGY</div>
          <div className="tools-row">
            {project.tools.map(t => <span key={t} className="tool-chip">{t}</span>)}
          </div>
        </div>

        <div className="proj-img-col reveal">
          {project.images[0] && (
            <img src={project.images[0]} alt={project.title} className="proj-img-main" onClick={() => setLightbox(project.images[0])} />
          )}
          {project.images.length > 1 && (
            <div className="proj-img-grid">
              {project.images.slice(1, 3).map((img, i) => (
                <img key={i} src={img} alt={`${project.title} ${i + 2}`} className="proj-img-thumb" onClick={() => setLightbox(img)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* EXTRA GALLERY */}
      {(project.images.length > 3 || project.galleryExtra) && (
        <div className="proj-gallery reveal">
          {[...project.images.slice(3), ...(project.galleryExtra || [])].map((img, i) => (
            <img key={i} src={img} alt={`${project.title} ${i + 4}`} className="proj-gallery-img" onClick={() => setLightbox(img)} />
          ))}
        </div>
      )}

      {/* CASE STUDY CTA */}
      {project.hasCaseStudy && (
        <div className="cs-cta reveal">
          <div className="cs-cta-inner">
            <div>
              <div className="cs-cta-label">WANT THE FULL BREAKDOWN?</div>
              <div className="cs-cta-sub">Design process, system diagrams, iteration history, and technical notes.</div>
            </div>
            <button className="btn-primary" onClick={goCaseStudy} data-hover>View Case Study →</button>
          </div>
        </div>
      )}

      {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
    </div>
  );
}

/* ── CaseStudy ── */
function CaseStudy({ projectId, onNav }) {
  const { projects } = window.PORTFOLIO_DATA;
  const [lightbox, setLightbox] = React.useState(null);
  const project = projects.find(p => p.id === projectId);
  const cs = project?.caseStudy;

  React.useEffect(() => { window.scrollTo(0, 0); }, [projectId]);

  React.useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: .1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [projectId]);

  if (!project || !cs) return <div style={{ padding: '120px 40px', textAlign: 'center', fontFamily: T.mono, color: T.dim }}>No case study available.</div>;

  const goBack  = () => { window.location.hash = `#/project/${projectId}`; if (onNav) onNav(); };
  const goHome  = () => { window.location.hash = '#/'; if (onNav) onNav(); };
  const toc = ['01 BRIEF', '02 PROCESS', '03 KEY SYSTEMS', '04 ITERATIONS', '05 TECHNICAL', '06 REFLECTIONS'];

  return (
    <div>
      {/* HEADER */}
      <div style={{ paddingTop: 56 }}>
        <div className="back-bar">
          <button className="back-btn" onClick={goBack} data-hover>← Back to Project</button>
          <button className="back-btn" style={{ color: T.dim }} onClick={goHome} data-hover>Home</button>
        </div>

        <div className="cs-header">
          <div>
            <div className="cs-eyebrow">CASE STUDY — FILE {project.num}</div>
            <h1 className="cs-title">{project.title}</h1>
            <div className="cs-subtitle">Design Process &amp; Technical Notes</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {cs.caseStudyPdf && (
              <a href={cs.caseStudyPdf} download className="proj-link filled" data-hover>↓ Download PDF</a>
            )}
            <button className="proj-link outline" onClick={goBack} data-hover>← Project</button>
          </div>
        </div>

        <div className="toc-bar">
          <span className="toc-label">INDEX</span>
          {toc.map(t => <span key={t} className="toc-item">{t}</span>)}
        </div>
      </div>

      {/* LAYOUT */}
      <div className="cs-layout">
        {/* MAIN */}
        <div className="cs-main">

          {/* 01 BRIEF */}
          <div className="cs-section reveal" id="cs-01">
            <div className="cs-sec-header">
              <span className="cs-sec-num">01</span>
              <span className="cs-sec-label">DESIGN BRIEF</span>
            </div>
            <p style={{ fontSize: 14, color: 'rgba(240,234,235,.7)', lineHeight: 1.85, marginBottom: 16 }}>{cs.brief}</p>
            <div className="stats-grid">
              {cs.stats.map(({ k, v }) => (
                <div key={k} className="stat-cell">
                  <div className="stat-key">{k.toUpperCase()}</div>
                  <div className="stat-val">{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 02 PROCESS */}
          <div className="cs-section reveal" id="cs-02">
            <div className="cs-sec-header">
              <span className="cs-sec-num">02</span>
              <span className="cs-sec-label">PROCESS TIMELINE</span>
            </div>
            <div className="timeline">
              {cs.timeline.map(({ phase, date, detail }, i) => (
                <div key={phase} className="tl-item">
                  <div className="tl-spine">
                    <div className="tl-dot" />
                    {i < cs.timeline.length - 1 && <div className="tl-line" />}
                  </div>
                  <div className="tl-content">
                    <span className="tl-phase">{phase}</span>
                    <span className="tl-date">{date}</span>
                    <p className="tl-detail">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 03 SYSTEMS */}
          <div className="cs-section reveal" id="cs-03">
            <div className="cs-sec-header">
              <span className="cs-sec-num">03</span>
              <span className="cs-sec-label">KEY SYSTEMS</span>
            </div>
            <div className="systems-grid">
              {cs.systems.map(({ t, d }) => (
                <div key={t} className="sys-card">
                  <div className="sys-title">{t}</div>
                  <p className="sys-desc">{d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 04 ITERATIONS */}
          <div className="cs-section reveal" id="cs-04">
            <div className="cs-sec-header">
              <span className="cs-sec-num">04</span>
              <span className="cs-sec-label">ITERATIONS</span>
            </div>
            <div className="iter-list">
              {cs.iterations.map(({ v, note }) => (
                <div key={v} className="iter-item">
                  <span className="iter-v">{v}</span>
                  <p className="iter-note">{note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 05 TECHNICAL */}
          <div className="cs-section reveal" id="cs-05">
            <div className="cs-sec-header">
              <span className="cs-sec-num">05</span>
              <span className="cs-sec-label">TECHNICAL NOTES</span>
            </div>
            <div className="tech-grid">
              {cs.technicalNotes.map(({ t, d }) => (
                <div key={t} className="tech-card">
                  <div className="tech-title">{t}</div>
                  <p className="tech-desc">{d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 06 REFLECTIONS */}
          <div className="cs-section reveal" id="cs-06">
            <div className="cs-sec-header">
              <span className="cs-sec-num">06</span>
              <span className="cs-sec-label">REFLECTIONS</span>
            </div>
            <p style={{ fontSize: 14, color: 'rgba(240,234,235,.7)', lineHeight: 1.85 }}>
              Dough or Die taught me what it really means to ship. The biggest lesson wasn't a design decision — it was learning how to cut scope with conviction. Every feature that didn't make it in was a deliberate choice, and that clarity made the product sharper. I'd do more structured mid-sprint retrospectives earlier; we got better at that as the year went on but would have benefited from it sooner.
            </p>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="cs-sidebar">
          <div className="sidebar-box reveal">
            <div className="sidebar-box-label">PROJECT STATS</div>
            {cs.stats.map(({ k, v }) => (
              <div key={k} className="sidebar-stat-row">
                <span className="sidebar-stat-key">{k}</span>
                <span className="sidebar-stat-val">{v}</span>
              </div>
            ))}
          </div>

          {project.images.length > 0 && (
            <div className="sidebar-box reveal">
              <div className="sidebar-box-label">GALLERY</div>
              <div className="sidebar-thumb-grid">
                {project.images.slice(0, 4).map((img, i) => (
                  <img key={i} src={img} alt={`${project.title} ${i + 1}`} className="sidebar-thumb" onClick={() => setLightbox(img)} />
                ))}
              </div>
            </div>
          )}

          <div className="sidebar-box reveal">
            <div className="sidebar-box-label">LINKS</div>
            {cs.caseStudyPdf && (
              <a href={cs.caseStudyPdf} download className="sidebar-link primary-link" data-hover>
                <span>↓</span> Download Case Study PDF
              </a>
            )}
            {project.links.map((l, i) => (
              <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" download={l.download || undefined} className="sidebar-link" data-hover>
                <span>{l.icon}</span> {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
    </div>
  );
}

// Inject project CSS
if (!document.getElementById('project-styles')) {
  const s = document.createElement('style');
  s.id = 'project-styles';
  s.textContent = projectCSS
    .replace(/var\(--mono\)/g, "'IBM Plex Mono', monospace")
    .replace(/var\(--sans\)/g, "'IBM Plex Sans', sans-serif");
  document.head.appendChild(s);
}

window.ProjectPage = ProjectPage;
window.CaseStudy   = CaseStudy;
