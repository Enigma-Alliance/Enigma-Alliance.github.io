// portfolio-shared.jsx — Nav, Footer, cursor, scroll reveal hooks

/* ── Design tokens ── */
const T = {
  pink:   "#e67f8e",
  hotPink:"#ff69b4",
  lime:   "#f2ffb4",
  dark:   "#0a0a0a",
  dark2:  "#111111",
  dark3:  "#181418",
  line:   "#2a1a20",
  dim:    "#6a5058",
  steel:  "#f0eaeb",
  mono:   "'IBM Plex Mono', monospace",
  sans:   "'IBM Plex Sans', sans-serif",
};
window.T = T;

/* ── useScrollReveal ── */
function useScrollReveal() {
  React.useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger > *');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}
window.useScrollReveal = useScrollReveal;

/* ── Custom cursor ── */
function CustomCursor() {
  React.useEffect(() => {
    // Mount cursor elements directly on body — bypasses all React stacking contexts
    const dot  = document.createElement('div');
    const ring = document.createElement('div');
    dot.className  = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    const DOT_R  = 4;   // half of 8px
    const RING_R = 18;  // half of 36px
    let mx = -200, my = -200;
    let rx = -200, ry = -200;
    let raf;

    const onMove = e => {
      mx = e.clientX;
      my = e.clientY;
      const el = document.elementFromPoint(mx, my);
      if (el && el.closest('a, button, [data-hover], .project-card')) {
        document.body.classList.add('cursor-hover');
      } else {
        document.body.classList.remove('cursor-hover');
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const loop = () => {
      // Dot snaps instantly to cursor tip
      dot.style.left = (mx - DOT_R) + 'px';
      dot.style.top  = (my - DOT_R) + 'px';
      // Ring lerps behind
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      ring.style.left = (rx - RING_R) + 'px';
      ring.style.top  = (ry - RING_R) + 'px';
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      dot.remove();
      ring.remove();
    };
  }, []);

  return null; // elements live on document.body, not in React tree
}
window.CustomCursor = CustomCursor;

/* ── Nav ── */
function Nav({ crumbs, onNav }) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const go = (hash) => { window.location.hash = hash; if (onNav) onNav(); };

  const scrollToAbout = () => {
    // Navigate home first if needed, then scroll
    const doScroll = () => {
      const el = document.getElementById('about');
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    };
    if (window.location.hash !== '#/' && window.location.hash !== '#' && window.location.hash !== '') {
      window.location.hash = '#/';
      if (onNav) onNav();
      setTimeout(doScroll, 120);
    } else {
      doScroll();
    }
  };

  return (
    <nav className={`site-nav${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-inner">
        <button className="nav-logo" onClick={() => go('#/')} data-hover>
          <img src="logo.png" alt="Enigma Alliance" />
          <span className="nav-brand">ENIGMA ALLIANCE</span>
        </button>
        {crumbs && <div className="nav-crumbs">{crumbs}</div>}
        <div className="nav-links">
          <button className="nav-btn" onClick={() => go('#/')}>Projects</button>
          <button className="nav-btn" onClick={scrollToAbout}>About</button>
          <a className="nav-btn primary" href="Resume.pdf" download="Aidan_Dougan_Resume.pdf">Resume ↓</a>
        </div>
      </div>
    </nav>
  );
}
window.Nav = Nav;

/* ── Footer ── */
function Footer({ onNav }) {
  const go = (hash) => { window.location.hash = hash; if (onNav) onNav(); };
  const { owner } = window.PORTFOLIO_DATA;
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-left">
          <button className="nav-logo" onClick={() => go('#/')} data-hover>
            <img src="logo.png" alt="Enigma Alliance" />
            <span className="nav-brand">ENIGMA ALLIANCE</span>
          </button>
          <p className="footer-copy">© 2025 Aidan Dougan. All rights reserved.</p>
        </div>
        <div className="footer-contact">
          <a href={`mailto:${owner.email}`}>{owner.email}</a>
          <a href={`tel:${owner.phone.replace(/\D/g,'')}`}>{owner.phone}</a>
          <a href={owner.resume} download className="footer-resume">Resume ↓</a>
        </div>
      </div>
    </footer>
  );
}
window.Footer = Footer;

/* ── Shared CSS (injected once) ── */
const sharedCSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  font-family: '${T.sans}', sans-serif;
  background: ${T.dark};
  color: ${T.steel};
  overflow-x: hidden;
  cursor: none;
}

/* ── GRAIN ── */
body::before {
  content: '';
  position: fixed; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  opacity: 0.022; pointer-events: none; z-index: 9990;
}

/* ── CURSOR ── */
body { cursor: none; }
a, button, [data-hover], .project-card { cursor: none; }
.cursor-dot {
  position: fixed; width: 8px; height: 8px;
  background: ${T.pink}; border-radius: 50%;
  pointer-events: none; z-index: 99999;
  transition: width .15s, height .15s, background .15s;
  top: 0; left: 0;
}
.cursor-ring {
  position: fixed; width: 36px; height: 36px;
  border: 1.5px solid ${T.pink}88; border-radius: 50%;
  pointer-events: none; z-index: 99998;
  transition: width .25s, height .25s, border-color .25s;
  top: 0; left: 0;
}
body.cursor-hover .cursor-dot { width: 14px; height: 14px; background: ${T.lime}; }
body.cursor-hover .cursor-ring { width: 52px; height: 52px; border-color: ${T.lime}88; }
@media (max-width: 768px) {
  body, a, button, [data-hover], .project-card { cursor: auto; }
  .cursor-dot, .cursor-ring { display: none; }
}

/* ── SCROLL REVEAL ── */
.reveal {
  opacity: 0; transform: translateY(28px);
  transition: opacity .65s cubic-bezier(.4,0,.2,1), transform .65s cubic-bezier(.4,0,.2,1);
}
.reveal-left {
  opacity: 0; transform: translateX(-32px);
  transition: opacity .65s cubic-bezier(.4,0,.2,1), transform .65s cubic-bezier(.4,0,.2,1);
}
.reveal-right {
  opacity: 0; transform: translateX(32px);
  transition: opacity .65s cubic-bezier(.4,0,.2,1), transform .65s cubic-bezier(.4,0,.2,1);
}
.reveal.visible, .reveal-left.visible, .reveal-right.visible { opacity: 1; transform: none; }

.stagger > *:nth-child(1) { transition-delay: .05s; }
.stagger > *:nth-child(2) { transition-delay: .12s; }
.stagger > *:nth-child(3) { transition-delay: .19s; }
.stagger > *:nth-child(4) { transition-delay: .26s; }
.stagger > *:nth-child(5) { transition-delay: .33s; }
.stagger > *:nth-child(6) { transition-delay: .40s; }
.stagger > *:nth-child(7) { transition-delay: .47s; }
.stagger > *:nth-child(8) { transition-delay: .54s; }
.stagger > *:nth-child(9) { transition-delay: .61s; }

/* ── NAV ── */
.site-nav {
  position: fixed; top: 0; left: 0; right: 0; height: 56px;
  z-index: 1000;
  border-bottom: 1px solid transparent;
  transition: background .3s, border-color .3s, backdrop-filter .3s;
}
.site-nav.scrolled {
  background: rgba(10,10,10,.85);
  backdrop-filter: blur(16px);
  border-color: ${T.line};
}
.nav-inner {
  max-width: 1400px; margin: 0 auto;
  height: 100%; padding: 0 40px;
  display: flex; align-items: center; gap: 20px;
}
.nav-logo {
  display: flex; align-items: center; gap: 10px;
  background: none; border: none; cursor: none;
  color: ${T.pink}; text-decoration: none;
  transition: opacity .2s;
}
.nav-logo:hover { opacity: .8; }
.nav-logo img { width: 30px; height: 30px; border-radius: 50%; object-fit: contain; }
.nav-brand {
  font-family: ${T.mono}; font-size: 12px;
  font-weight: 700; letter-spacing: .14em; color: ${T.pink};
}
.nav-crumbs {
  font-family: ${T.mono}; font-size: 9px;
  color: ${T.dim}; letter-spacing: .1em; flex: 1;
}
.nav-links {
  margin-left: auto; display: flex; gap: 0; align-items: center;
}
.nav-btn {
  background: none; border: none; cursor: none;
  font-family: ${T.mono}; font-size: 11px;
  letter-spacing: .1em; color: ${T.dim};
  padding: 8px 18px;
  border-left: 1px solid ${T.line};
  transition: color .2s;
  position: relative; overflow: hidden;
}
.nav-btn::before {
  content: ''; position: absolute; inset: 0;
  background: ${T.pink}12; transform: scaleX(0);
  transform-origin: left; transition: transform .28s ease;
}
.nav-btn:hover::before { transform: scaleX(1); }
.nav-btn:hover { color: ${T.steel}; }
.nav-btn.primary {
  color: ${T.lime}; border-color: ${T.line};
  text-decoration: none;
}
.nav-btn.primary:hover { color: ${T.dark}; background: ${T.lime}; }

/* ── FOOTER ── */
.site-footer {
  border-top: 1px solid ${T.line};
  margin-top: 80px; padding: 40px 0;
}
.footer-inner {
  max-width: 1400px; margin: 0 auto; padding: 0 40px;
  display: flex; justify-content: space-between; align-items: center;
  gap: 32px; flex-wrap: wrap;
}
.footer-copy { font-family: ${T.mono}; font-size: 10px; color: ${T.dim}; margin-top: 8px; letter-spacing: .1em; }
.footer-contact { display: flex; flex-direction: column; gap: 8px; text-align: right; }
.footer-contact a { font-family: ${T.mono}; font-size: 11px; color: ${T.dim}; text-decoration: none; transition: color .2s; }
.footer-contact a:hover { color: ${T.pink}; }
.footer-resume { color: ${T.pink} !important; }

/* ── BADGE ── */
.badge {
  display: inline-block; padding: 3px 10px;
  border: 1px solid ${T.pink}44; border-radius: 999px;
  font-family: ${T.mono}; font-size: 10px; letter-spacing: .08em;
  color: ${T.pink}; background: ${T.pink}0d;
}

/* ── SCROLLBAR ── */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: ${T.line}; border-radius: 4px; }

@media (max-width: 768px) {
  .nav-inner { padding: 0 20px; }
  .nav-crumbs { display: none; }
  .nav-btn { padding: 8px 12px; font-size: 10px; }
  .nav-brand { display: none; }
}
`;

// Inject shared CSS once
if (!document.getElementById('shared-styles')) {
  const style = document.createElement('style');
  style.id = 'shared-styles';
  style.textContent = sharedCSS;
  document.head.appendChild(style);
}
