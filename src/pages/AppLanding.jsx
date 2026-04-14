import React, { useState, useEffect, useRef } from "react";

const BUSINESSES = [
  { name: "Kings Barbershop", emoji: "✂️", stamps: 8, reward: "10€ Gutschein", img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80" },
  { name: "Café Milano", emoji: "☕", stamps: 10, reward: "1 Kaffee gratis", img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80" },
  { name: "FitZone Gym", emoji: "💪", stamps: 12, reward: "1 Monat gratis", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80" },
  { name: "Bella Nails", emoji: "💅", stamps: 6, reward: "Maniküre gratis", img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80" },
];

const STEPS = [
  { num: "01", icon: "📱", title: "QR-Code scannen", img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80" },
  { num: "02", icon: "✅", title: "Stempel sammeln", img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80" },
  { num: "03", icon: "🎁", title: "Prämie kassieren", img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80" },
];

export default function AppLanding() {
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [activeCard, setActiveCard] = useState(0);
  const [visibleSections, setVisibleSections] = useState({});
  const sectionRefs = useRef({});

  useEffect(() => {
    const t = setInterval(() => setActiveCard(i => (i + 1) % BUSINESSES.length), 2800);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#111e28", fontFamily: "'Inter', sans-serif", color: "#fff", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Bricolage+Grotesque:wght@700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes orb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(20px, -15px) scale(1.08); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.8); }
        }

        .shimmer-text {
          color: #ffffff;
          opacity: 0.95;
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

        .phone-input {
          background: rgba(255,255,255,0.07);
          border: 1.5px solid rgba(255,255,255,0.15);
          border-radius: 12px;
          padding: 14px 18px;
          font-size: 16px;
          color: #fff;
          font-family: inherit;
          outline: none;
          width: 100%;
          transition: border-color 0.2s;
        }
        .phone-input:focus { border-color: #63FFB4; }
        .phone-input::placeholder { color: rgba(255,255,255,0.3); }

        .step-card {
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          aspect-ratio: 4/3;
          cursor: default;
        }

        .biz-card {
          border-radius: 18px;
          overflow: hidden;
          position: relative;
          aspect-ratio: 3/4;
          cursor: pointer;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }
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
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(7,17,27,0.88)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 20px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 900, color: "#fff" }}>Sensalie</span>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 6px rgba(16,185,129,0.9)", animation: "pulse-dot 2s infinite" }} />
          </div>
          <a href="#register" style={{ textDecoration: "none" }}>
            <button className="cta-btn" style={{ fontSize: 12, padding: "8px 16px", borderRadius: 9 }}>Kostenlos starten →</button>
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto", padding: "48px 20px 32px" }}>
        {/* Hero image */}
        <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", marginBottom: 28, height: 190 }}>
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80"
            alt="Happy customers"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(7,17,27,0.1) 0%, rgba(7,17,27,0.75) 100%)" }} />
          {/* Floating badge */}
          <div style={{ position: "absolute", bottom: 16, left: 16, display: "flex", alignItems: "center", gap: 8, background: "rgba(16,185,129,0.15)", backdropFilter: "blur(10px)", border: "1px solid rgba(16,185,129,0.4)", borderRadius: 100, padding: "6px 14px" }}>
            <div style={{ display: "flex", gap: 2 }}>
              {[...Array(5)].map((_, i) => <span key={i} style={{ color: "#FFD700", fontSize: 11 }}>★</span>)}
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>Zufriedene Kunden</span>
          </div>
          {/* Stamp badge */}
          <div style={{ position: "absolute", top: 16, right: 16, background: "rgba(7,17,27,0.7)", backdropFilter: "blur(8px)", border: "1px solid rgba(99,255,180,0.3)", borderRadius: 12, padding: "8px 12px", animation: "float 3s ease-in-out infinite" }}>
            <div style={{ fontSize: 11, color: "#63FFB4", fontWeight: 700 }}>🎉 +1 Stempel!</div>
          </div>
        </div>

        {/* Headline */}
        <h1 className="shimmer-text" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(24px, 6vw, 36px)", fontWeight: 900, lineHeight: 1.15, marginBottom: 12, textAlign: "center" }}>
          Stempel sammeln.<br />Prämien kassieren.<br />Geld verdienen.
        </h1>

        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, textAlign: "center", marginBottom: 28, maxWidth: 420, margin: "0 auto 28px" }}>
          Digitale Treuekarten für deine Lieblingsgeschäfte — und echte Prämien für Empfehlungen.
        </p>

        {/* CTA */}
        <a href="#register" style={{ textDecoration: "none", display: "block" }}>
          <button className="cta-btn" style={{ width: "100%", fontSize: 16, padding: "16px" }}>
            🚀 Jetzt kostenlos starten
          </button>
        </a>
        <div style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 8 }}>Kein Download · Keine Kreditkarte · 10 Sekunden</div>
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
              className="step-card"
              style={{
                opacity: visible("steps") ? 1 : 0,
                animation: visible("steps") ? `fadeUp 0.5s ease ${i * 0.12}s forwards` : "none",
              }}
            >
              <img src={step.img} alt={step.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(7,17,27,0.85) 0%, rgba(7,17,27,0.3) 100%)" }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 24px", gap: 16 }}>
                <div style={{ flexShrink: 0 }}>
                  <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 11, fontWeight: 700, color: "rgba(99,255,180,0.7)", letterSpacing: 2, marginBottom: 4 }}>{step.num}</div>
                  <div style={{ fontSize: 32 }}>{step.icon}</div>
                </div>
                <div style={{ fontSize: "clamp(16px, 5vw, 22px)", fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>{step.title}</div>
              </div>
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
              className={`biz-card ${i === activeCard ? "active" : ""}`}
              style={{
                opacity: visible("businesses") ? 1 : 0,
                animation: visible("businesses") ? `fadeUp 0.5s ease ${i * 0.1}s forwards` : "none",
                border: i === activeCard ? "2px solid #10B981" : "2px solid transparent",
              }}
              onClick={() => setActiveCard(i)}
            >
              <img src={biz.img} alt={biz.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s", transform: i === activeCard ? "scale(1.06)" : "scale(1)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 35%, rgba(7,17,27,0.95) 100%)" }} />
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

      {/* ── STATS ── */}
      <section style={{ background: "rgba(16,185,129,0.06)", borderTop: "1px solid rgba(16,185,129,0.15)", borderBottom: "1px solid rgba(16,185,129,0.15)", padding: "28px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 600, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {[
            { val: "500+", label: "Partnerbetriebe" },
            { val: "4,9 ★", label: "Bewertung" },
            { val: "100€", label: "Max. Provision" },
            { val: "10 Sek.", label: "Registrierung" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 900, color: "#63FFB4" }}>{s.val}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA / REGISTER ── */}
      <section
        id="register"
        ref={ref("cta")}
        data-section="cta"
        style={{ position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto", padding: "48px 20px 80px" }}
      >
        {/* Image behind CTA */}
        <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", marginBottom: 28, height: 180 }}>
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80"
            alt="Community"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "rgba(7,17,27,0.55)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 36, animation: "float 3s ease-in-out infinite" }}>🎁</div>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 900, color: "#fff" }}>Starte jetzt kostenlos</div>
          </div>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="tel"
              inputMode="numeric"
              className="phone-input"
              placeholder="📱 Deine Handynummer"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
            />
            <button type="submit" className="cta-btn" style={{ width: "100%", fontSize: 16, padding: "16px" }}>
              🚀 Jetzt kostenlos sichern
            </button>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "center" }}>
              Kein Download · Keine Kreditkarte · 10 Sekunden
            </div>
          </form>
        ) : (
          <div style={{ textAlign: "center", padding: "28px 20px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 20 }}>
            <div style={{ fontSize: 44, marginBottom: 10 }}>🎉</div>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Willkommen bei Sensalie!</div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>Scanne deinen ersten QR-Code und fang an, Stempel zu sammeln.</div>
          </div>
        )}
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "24px 20px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <div style={{ width: 22, height: 22, background: "linear-gradient(135deg, #10B981, #059669)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900 }}>S</div>
          <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 15, fontWeight: 900 }}>Sensalie</span>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 6px rgba(16,185,129,0.9)" }} />
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 2 }}>© 2026 Sensalie · Datenschutz · Impressum</div>
      </footer>
    </div>
  );
}