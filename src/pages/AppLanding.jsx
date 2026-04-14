import { useState, useEffect, useRef } from "react";

// Partnerbetriebe: Gym raus, ausgewogen M/F
const BUSINESSES = [
  { name: "Kings Barbershop", emoji: "✂️", reward: "10€ Gutschein", img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80" },
  { name: "Café Milano", emoji: "☕", reward: "1 Kaffee gratis", img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80" },
  { name: "Massage Studio", emoji: "💆", reward: "1 Massage gratis", img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80" },
  { name: "Bella Nails", emoji: "💅", reward: "Maniküre gratis", img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80" },
];

const STEPS = [
  {
    num: "01", icon: "📱",
    title: "QR-Code scannen",
    sub: "Im Ladenlokal – schnell & einfach",
    img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
  },
  {
    num: "02", icon: "✅",
    title: "Stempel sammeln",
    sub: "In all deinen Lieblingsunternehmen",
    img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
  },
  {
    num: "03", icon: "🎁",
    title: "Prämie kassieren",
    sub: "Empfehle weiter & verdiene bis zu 100 €",
    img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80",
    highlight: true,
  },
];

// Hero: erst Kunde, dann Zielgruppe (kein Gym), ausgewogen M/F
const HERO_SLIDES = [
  { img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80", label: "Für dich", sub: "Sammle Stempel bei deinen Lieblingsläden" },
  { img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=80", label: "Cafés", sub: "Kaffee, Kuchen & treue Kunden" },
  { img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&q=80", label: "Barbershops", sub: "Stil sammeln, Prämien kassieren" },
  { img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&q=80", label: "Massage Studios", sub: "Entspannung mit echten Vorteilen" },
  { img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1200&q=80", label: "Nägel & Beauty", sub: "Schönheit, die sich lohnt" },
  { img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80", label: "Beauty Studios", sub: "Gepflegt & belohnt" },
];

// Was uns definiert statt fake Zahlen
const PILLARS = [
  { icon: "🎯", val: "100% Digital", label: "Keine Plastikkarte nötig" },
  { icon: "💸", val: "Echte Prämien", label: "Für Treue & Empfehlungen" },
  { icon: "⚡", val: "10 Sekunden", label: "Zur Registrierung" },
  { icon: "🔒", val: "Kostenlos", label: "Für Kunden, immer" },
];

export default function AppLanding() {
  const [submitted, setSubmitted] = useState(false);
  const [activeCard, setActiveCard] = useState(0);
  const [heroSlide, setHeroSlide] = useState(0);
  const [visibleSections, setVisibleSections] = useState({});
  const sectionRefs = useRef({});

  useEffect(() => {
    const t = setInterval(() => setActiveCard(i => (i + 1) % BUSINESSES.length), 2800);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setHeroSlide(i => (i + 1) % HERO_SLIDES.length), 3400);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) setVisibleSections(v => ({ ...v, [e.target.dataset.section]: true }));
      }),
      { threshold: 0.1 }
    );
    Object.values(sectionRefs.current).forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const ref = (key) => el => { sectionRefs.current[key] = el; };
  const visible = (key) => visibleSections[key];

  return (
    <div style={{ minHeight: "100vh", background: "#111e28", fontFamily: "'Inter', sans-serif", color: "#fff", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Bricolage+Grotesque:wght@700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes orb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(20px, -15px) scale(1.08); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.8); }
        }
        @keyframes glowPulse {
          0%, 100% { text-shadow: 0 0 20px rgba(255,255,255,0.2), 0 0 40px rgba(99,255,180,0.12); }
          50%       { text-shadow: 0 0 40px rgba(255,255,255,0.4), 0 0 80px rgba(99,255,180,0.28); }
        }
        @keyframes highlightGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
          50%       { box-shadow: 0 0 24px 4px rgba(16,185,129,0.35); }
        }

        .glow-headline {
          color: #ffffff;
          animation: glowPulse 3s ease-in-out infinite;
        }
        .cta-btn {
          background: linear-gradient(135deg, #10B981, #059669);
          color: #fff;
          border: none;
          border-radius: 14px;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 6px 24px rgba(16,185,129,0.4);
        }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(16,185,129,0.55); }
        .cta-btn:active { transform: translateY(0); }

        .step-card {
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          cursor: default;
          opacity: 0;
        }
        .step-card.visible {
          animation: slideIn 0.55s ease forwards;
        }
        .step-card.highlight-card {
          animation: slideIn 0.55s ease forwards, highlightGlow 2.5s ease-in-out 0.8s infinite;
        }

        .biz-card {
          border-radius: 18px;
          overflow: hidden;
          position: relative;
          aspect-ratio: 3/4;
          cursor: pointer;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
          opacity: 0;
        }
        .biz-card.visible { animation: fadeUp 0.5s ease forwards; }
        .biz-card.active {
          transform: scale(1.04);
          box-shadow: 0 16px 48px rgba(16,185,129,0.35);
        }
      `}</style>

      {/* BG Orbs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "5%", left: "5%", width: 400, height: 400, background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)", animation: "orb 10s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 300, height: 300, background: "radial-gradient(circle, rgba(99,180,255,0.1) 0%, transparent 70%)", animation: "orb 13s ease-in-out 2s infinite reverse" }} />
      </div>

      {/* ── NAVBAR ── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(17,30,40,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 20px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 900, color: "#fff" }}>Sensalie</span>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 6px rgba(16,185,129,0.9)", animation: "pulse-dot 2s infinite" }} />
          </div>
          <a href="#register" style={{ textDecoration: "none" }}>
            <button className="cta-btn" style={{ fontSize: 12, padding: "8px 18px", borderRadius: 9 }}>Anmelden →</button>
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto", padding: "40px 20px 32px" }}>

        {/* Headline */}
        <h1 className="glow-headline" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(26px, 7vw, 40px)", fontWeight: 900, lineHeight: 1.15, marginBottom: 20, textAlign: "center" }}>
          Stempel sammeln.<br />Prämien kassieren.<br />Geld verdienen.
        </h1>

        {/* Hero image slideshow — between headline and CTA */}
        <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", height: 210, marginBottom: 18 }}>
          {HERO_SLIDES.map((slide, i) => (
            <img
              key={slide.img}
              src={slide.img}
              alt={slide.label}
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%", objectFit: "cover",
                opacity: i === heroSlide ? 1 : 0,
                transition: "opacity 1.3s ease",
              }}
            />
          ))}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(17,30,40,0.05) 0%, rgba(17,30,40,0.72) 100%)" }} />

          {/* Slide label */}
          <div style={{ position: "absolute", bottom: 14, left: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ background: "rgba(16,185,129,0.2)", backdropFilter: "blur(8px)", border: "1px solid rgba(16,185,129,0.45)", borderRadius: 100, padding: "5px 14px" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#63FFB4" }}>{HERO_SLIDES[heroSlide].label}</span>
            </div>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.65)" }}>{HERO_SLIDES[heroSlide].sub}</span>
          </div>

          {/* Dots */}
          <div style={{ position: "absolute", bottom: 16, right: 16, display: "flex", gap: 5 }}>
            {HERO_SLIDES.map((_, i) => (
              <div key={i} onClick={() => setHeroSlide(i)} style={{ width: 6, height: 6, borderRadius: "50%", background: i === heroSlide ? "#10B981" : "rgba(255,255,255,0.3)", transition: "background 0.5s", cursor: "pointer" }} />
            ))}
          </div>

          {/* Floating badge */}
          <div style={{ position: "absolute", top: 14, right: 16, background: "rgba(17,30,40,0.7)", backdropFilter: "blur(8px)", border: "1px solid rgba(99,255,180,0.3)", borderRadius: 12, padding: "7px 12px", animation: "float 3s ease-in-out infinite" }}>
            <div style={{ fontSize: 11, color: "#63FFB4", fontWeight: 700 }}>🎉 +1 Stempel!</div>
          </div>
        </div>

        {/* CTA Button */}
        <a href="#register" style={{ textDecoration: "none", display: "block", marginBottom: 10 }}>
          <button className="cta-btn" style={{ width: "100%", fontSize: 16, padding: "16px" }}>
            🚀 Jetzt kostenlos starten
          </button>
        </a>

        {/* Subtext under button */}
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.6, textAlign: "center" }}>
          Digitale Treuekarte für deine Lieblingsgeschäfte — kostenlos &amp; sofort.
        </p>
      </section>

      {/* ── 3 SCHRITTE ── */}
      <section
        ref={ref("steps")}
        data-section="steps"
        style={{ position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto", padding: "48px 20px" }}
      >
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#63FFB4", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>So einfach</div>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(22px, 6vw, 32px)", fontWeight: 900 }}>In 3 Schritten zur Prämie</h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              className={`step-card${visible("steps") ? (step.highlight ? " highlight-card" : " visible") : ""}`}
              style={{
                animationDelay: `${i * 0.15}s`,
                height: step.highlight ? 160 : 130,
                border: step.highlight ? "1.5px solid rgba(16,185,129,0.45)" : "none",
              }}
            >
              <img src={step.img} alt={step.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: step.highlight ? "linear-gradient(to right, rgba(17,30,40,0.92) 0%, rgba(17,30,40,0.4) 100%)" : "linear-gradient(to right, rgba(17,30,40,0.88) 0%, rgba(17,30,40,0.3) 100%)" }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 22px", gap: 16 }}>
                <div style={{ flexShrink: 0 }}>
                  <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 11, fontWeight: 700, color: "rgba(99,255,180,0.7)", letterSpacing: 2, marginBottom: 4 }}>{step.num}</div>
                  <div style={{ fontSize: 30 }}>{step.icon}</div>
                </div>
                <div>
                  <div style={{ fontSize: "clamp(15px, 4.5vw, 20px)", fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: 4 }}>{step.title}</div>
                  <div style={{ fontSize: 12, color: step.highlight ? "#63FFB4" : "rgba(255,255,255,0.5)", lineHeight: 1.4 }}>{step.sub}</div>
                </div>
              </div>
              {step.highlight && (
                <div style={{ position: "absolute", top: 12, right: 14, background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.4)", borderRadius: 8, padding: "4px 10px", fontSize: 11, color: "#63FFB4", fontWeight: 700 }}>
                  💰 Bonus
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── PARTNERBETRIEBE ── */}
      <section
        ref={ref("businesses")}
        data-section="businesses"
        style={{ position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto", padding: "0 20px 48px" }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#63FFB4", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Partnerbetriebe</div>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(22px, 6vw, 32px)", fontWeight: 900 }}>Deine Lieblingsgeschäfte</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {BUSINESSES.map((biz, i) => (
            <div
              key={biz.name}
              className={`biz-card${visible("businesses") ? " visible" : ""}${i === activeCard ? " active" : ""}`}
              style={{
                animationDelay: `${i * 0.1}s`,
                border: i === activeCard ? "2px solid #10B981" : "2px solid transparent",
              }}
              onClick={() => setActiveCard(i)}
            >
              <img src={biz.img} alt={biz.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s", transform: i === activeCard ? "scale(1.06)" : "scale(1)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 35%, rgba(17,30,40,0.95) 100%)" }} />
              <div style={{ position: "absolute", bottom: 12, left: 12, right: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                  <span style={{ fontSize: 15 }}>{biz.emoji}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{biz.name}</span>
                </div>
                <div style={{ fontSize: 10, color: "#63FFB4", fontWeight: 700 }}>🎁 {biz.reward}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WAS UNS DEFINIERT (statt fake Zahlen) ── */}
      <section style={{ background: "rgba(16,185,129,0.06)", borderTop: "1px solid rgba(16,185,129,0.15)", borderBottom: "1px solid rgba(16,185,129,0.15)", padding: "32px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 22 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#63FFB4", letterSpacing: 2, textTransform: "uppercase" }}>Warum Sensalie?</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {PILLARS.map(p => (
              <div key={p.label} style={{ textAlign: "center", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "18px 12px" }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{p.icon}</div>
                <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(15px, 4vw, 20px)", fontWeight: 900, color: "#63FFB4", marginBottom: 4 }}>{p.val}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}>{p.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA / REGISTER ── */}
      <section
        id="register"
        ref={ref("cta")}
        data-section="cta"
        style={{ position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto", padding: "48px 20px 80px" }}
      >
        {/* Banner image — no phone input, just nice copy */}
        <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", marginBottom: 28, height: 200 }}>
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80"
            alt="Community"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "rgba(17,30,40,0.6)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8, padding: "0 24px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(16px, 5vw, 22px)", fontWeight: 900, color: "#fff", lineHeight: 1.3 }}>
              Deine Treue hat einen Wert.
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
              Starte jetzt mit Sensalie — kostenlos, überall dabei.
            </div>
          </div>
        </div>

        {!submitted ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <button onClick={() => setSubmitted(true)} className="cta-btn" style={{ width: "100%", fontSize: 16, padding: "16px" }}>
              🚀 Jetzt kostenlos sichern
            </button>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "center" }}>
              Kein Download · Keine Kreditkarte · 10 Sekunden
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "28px 20px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 20 }}>
            <div style={{ fontSize: 44, marginBottom: 10 }}>🎉</div>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Willkommen bei Sensalie!</div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>Scanne deinen ersten QR-Code und fang an, Stempel zu sammeln.</div>
          </div>
        )}
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "20px 20px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 13, fontWeight: 900, color: "rgba(255,255,255,0.7)" }}>Sensalie</span>
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 5px rgba(16,185,129,0.9)" }} />
        </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.18)" }}>© 2026 Sensalie · Datenschutz · Impressum</div>
      </footer>
    </div>
  );
}