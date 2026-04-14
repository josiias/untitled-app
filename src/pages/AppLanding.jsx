import React, { useState, useEffect, useRef } from "react";

const FEATURES = [
  {
    icon: "🎯",
    title: "Stempel nie verlieren",
    desc: "Alle deine Treuekarten digital an einem Ort – immer dabei, nie vergessen.",
    color: "#63FFB4",
  },
  {
    icon: "💸",
    title: "Geld verdienen",
    desc: "Empfehle dein Lieblingsgeschäft weiter und kassiere bis zu 100€ pro Empfehlung.",
    color: "#FFD700",
  },
  {
    icon: "⚡",
    title: "Sofort loslegen",
    desc: "Kein Download nötig. Einfach QR-Code scannen – fertig in 10 Sekunden.",
    color: "#FF6B9D",
  },
  {
    icon: "🔒",
    title: "100% sicher",
    desc: "Deine Daten gehören dir. Nur deine Nummer, keine Werbung, kein Spam.",
    color: "#63B4FF",
  },
];

const BUSINESSES = [
  { name: "Kings Barbershop", emoji: "✂️", stamps: 8, reward: "10€ Gutschein", img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80" },
  { name: "Café Milano", emoji: "☕", stamps: 10, reward: "1 Kaffee gratis", img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80" },
  { name: "FitZone Gym", emoji: "💪", stamps: 12, reward: "1 Monat gratis", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80" },
  { name: "Bella Nails", emoji: "💅", stamps: 6, reward: "Maniküre gratis", img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80" },
];

const TESTIMONIALS = [
  { name: "Mehmet B.", text: "Mit Sensalie habe ich schon 3x mein Lieblingsgeschäft weiterempfohlen und 240€ verdient. Unglaublich!", avatar: "MB", stars: 5 },
  { name: "Sarah K.", text: "Endlich keine Papierkarten mehr verlieren! Alle Stempel digital – so einfach.", avatar: "SK", stars: 5 },
  { name: "Jonas W.", text: "In 10 Sekunden angemeldet. Mein Stempel war sofort gespeichert. Hammer!", avatar: "JW", stars: 5 },
];

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80",
];

export default function AppLanding() {
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [activeCard, setActiveCard] = useState(0);
  const [visibleSections, setVisibleSections] = useState({});
  const sectionRefs = useRef({});

  useEffect(() => {
    const t = setInterval(() => setImgIndex(i => (i + 1) % HERO_IMAGES.length), 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveCard(i => (i + 1) % BUSINESSES.length), 2800);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) setVisibleSections(v => ({ ...v, [e.target.dataset.section]: true }));
      }),
      { threshold: 0.15 }
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
    <div style={{ minHeight: "100vh", background: "#07111B", fontFamily: "'Inter', sans-serif", color: "#fff", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Bricolage+Grotesque:wght@700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeSlideRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes orb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(40px, -30px) scale(1.12); }
          66%       { transform: translate(-30px, 20px) scale(0.88); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-6px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes stampPop {
          0%   { transform: scale(0.5) rotate(-15deg); opacity: 0; }
          70%  { transform: scale(1.15) rotate(3deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        .anim-up    { animation: fadeSlideUp    0.7s ease forwards; }
        .anim-left  { animation: fadeSlideLeft  0.7s ease forwards; }
        .anim-right { animation: fadeSlideRight 0.7s ease forwards; }
        .anim-delay-1 { animation-delay: 0.1s; opacity: 0; }
        .anim-delay-2 { animation-delay: 0.22s; opacity: 0; }
        .anim-delay-3 { animation-delay: 0.34s; opacity: 0; }
        .anim-delay-4 { animation-delay: 0.46s; opacity: 0; }

        .shimmer-text {
          background: linear-gradient(90deg, #63FFB4 0%, #fff 40%, #FFD700 60%, #63FFB4 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }

        .cta-btn {
          background: linear-gradient(135deg, #10B981, #059669);
          color: #fff;
          border: none;
          border-radius: 16px;
          font-weight: 800;
          font-size: 17px;
          padding: 17px 32px;
          cursor: pointer;
          font-family: inherit;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 8px 32px rgba(16,185,129,0.45);
        }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(16,185,129,0.6); }
        .cta-btn:active { transform: translateY(0); }

        .phone-input {
          background: rgba(255,255,255,0.07);
          border: 1.5px solid rgba(255,255,255,0.15);
          border-radius: 14px;
          padding: 16px 20px;
          font-size: 16px;
          color: #fff;
          font-family: inherit;
          outline: none;
          width: 100%;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .phone-input:focus { border-color: #63FFB4; box-shadow: 0 0 0 3px rgba(99,255,180,0.12); }
        .phone-input::placeholder { color: rgba(255,255,255,0.3); }

        .feature-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 24px;
          transition: transform 0.3s, border-color 0.3s, background 0.3s;
          cursor: default;
        }
        .feature-card:hover {
          transform: translateY(-6px);
          border-color: rgba(99,255,180,0.3);
          background: rgba(99,255,180,0.04);
        }

        .biz-card {
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }
        .biz-card.active { transform: scale(1.03); box-shadow: 0 20px 60px rgba(16,185,129,0.3); }

        .testimonial-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 24px;
          transition: transform 0.3s;
        }
        .testimonial-card:hover { transform: translateY(-4px); }

        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .features-grid { grid-template-columns: 1fr 1fr !important; }
          .biz-grid { grid-template-columns: 1fr 1fr !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .section-pad { padding: 60px 20px !important; }
          .hero-title { font-size: clamp(32px, 8vw, 52px) !important; }
          .hero-right { display: none !important; }
        }
      `}</style>

      {/* ── BACKGROUND ORBS ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "5%", left: "5%", width: 500, height: 500, background: "radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)", animation: "orb 10s ease-in-out infinite" }} />
        <div style={{ position: "absolute", top: "40%", right: "5%", width: 400, height: 400, background: "radial-gradient(circle, rgba(99,180,255,0.12) 0%, transparent 70%)", animation: "orb 13s ease-in-out 2s infinite reverse" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "30%", width: 350, height: 350, background: "radial-gradient(circle, rgba(255,215,0,0.08) 0%, transparent 70%)", animation: "orb 9s ease-in-out 4s infinite" }} />
      </div>

      {/* ── NAVBAR ── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(7,17,27,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #10B981, #059669)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800 }}>S</div>
            <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 900, color: "#fff" }}>Sensalie</span>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 8px rgba(16,185,129,0.9)", marginLeft: 2 }} />
          </div>
          <a href="#register" style={{ textDecoration: "none" }}>
            <button className="cta-btn" style={{ fontSize: 13, padding: "9px 20px", borderRadius: 10 }}>Jetzt kostenlos starten →</button>
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="section-pad" style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px 60px", position: "relative", zIndex: 1 }}>
        <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>

          {/* Left */}
          <div>
            <div className="anim-up anim-delay-1" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 100, padding: "6px 14px", marginBottom: 24, fontSize: 12, fontWeight: 700, color: "#63FFB4" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", animation: "bounce 1.5s infinite" }} />
              Über 10.000 glückliche Kunden
            </div>

            <h1 className="anim-up anim-delay-2 hero-title shimmer-text" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(36px, 5vw, 62px)", fontWeight: 900, lineHeight: 1.08, marginBottom: 20 }}>
              Deine Stempelkarte.<br />Deine Prämien.<br />Dein Verdienst.
            </h1>

            <p className="anim-up anim-delay-3" style={{ fontSize: 17, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
              Mit <strong style={{ color: "#fff" }}>Sensalie</strong> sammelst du digitale Treuestempel bei deinen Lieblingsgeschäften — und verdienst echtes Geld, wenn du Freunde empfiehlst.
            </p>

            <div className="anim-up anim-delay-4" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Social proof avatars */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <div style={{ display: "flex" }}>
                  {["#FF6B9D","#63FFB4","#FFD700","#63B4FF"].map((c, i) => (
                    <div key={i} style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${c}, ${c}88)`, border: "2px solid #07111B", marginLeft: i > 0 ? -10 : 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#07111B" }}>
                      {["MB","SK","JW","FA"][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ display: "flex", gap: 2, marginBottom: 2 }}>
                    {[...Array(5)].map((_, i) => <span key={i} style={{ color: "#FFD700", fontSize: 12 }}>★</span>)}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>10.000+ zufriedene Kunden</div>
                </div>
              </div>

              <a href="#register" style={{ textDecoration: "none" }}>
                <button className="cta-btn" style={{ width: "100%", maxWidth: 380 }}>
                  🚀 Jetzt kostenlos registrieren
                </button>
              </a>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", textAlign: "center", maxWidth: 380 }}>
                Kostenlos · Kein Download · In 10 Sekunden
              </div>
            </div>
          </div>

          {/* Right — Animated phone mockup */}
          <div className="hero-right anim-right anim-delay-2" style={{ position: "relative", display: "flex", justifyContent: "center" }}>
            {/* Glow ring */}
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 320, height: 320, borderRadius: "50%", border: "1px solid rgba(16,185,129,0.2)", animation: "pulse-ring 3s ease-out infinite" }} />
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 280, height: 280, borderRadius: "50%", border: "1px solid rgba(16,185,129,0.15)", animation: "pulse-ring 3s ease-out 1s infinite" }} />

            {/* Phone frame */}
            <div style={{ width: 260, position: "relative", animation: "float 4s ease-in-out infinite", zIndex: 2 }}>
              <div style={{ background: "#111827", border: "3px solid rgba(255,255,255,0.12)", borderRadius: 36, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)" }}>
                {/* Notch */}
                <div style={{ background: "#111827", padding: "10px 0 5px", textAlign: "center" }}>
                  <div style={{ width: 44, height: 5, background: "rgba(255,255,255,0.12)", borderRadius: 3, margin: "0 auto" }} />
                </div>
                {/* Screen content */}
                <div style={{ background: "linear-gradient(145deg, #0a1a2e 0%, #0a2218 100%)", padding: "16px 14px 20px", minHeight: 360 }}>
                  {/* App header */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", fontFamily: "'Bricolage Grotesque', sans-serif" }}>Sensalie</div>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 6px #10B981" }} />
                  </div>
                  {/* Active business card */}
                  {BUSINESSES.map((biz, i) => (
                    <div key={biz.name} className={`biz-card ${i === activeCard ? "active" : ""}`} style={{ display: i === activeCard ? "block" : "none", marginBottom: 12 }}>
                      <div style={{ position: "relative", height: 100, borderRadius: 14, overflow: "hidden" }}>
                        <img src={biz.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(7,17,27,0.9) 100%)" }} />
                        <div style={{ position: "absolute", bottom: 8, left: 10, display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 16 }}>{biz.emoji}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{biz.name}</span>
                        </div>
                      </div>
                      {/* Stamps mini */}
                      <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12, padding: "10px 12px", marginTop: 8 }}>
                        <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(biz.stamps, 5)}, 1fr)`, gap: 4, marginBottom: 8 }}>
                          {Array.from({ length: Math.min(biz.stamps, 5) }).map((_, j) => (
                            <div key={j} style={{ aspectRatio: "1/1", background: j < 2 ? "#10B981" : "rgba(16,185,129,0.15)", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#fff" }}>
                              {j < 2 ? "✓" : ""}
                            </div>
                          ))}
                        </div>
                        <div style={{ fontSize: 10, color: "#63FFB4", fontWeight: 700 }}>🎁 {biz.reward}</div>
                      </div>
                    </div>
                  ))}
                  {/* Dot nav */}
                  <div style={{ display: "flex", justifyContent: "center", gap: 5, marginTop: 8 }}>
                    {BUSINESSES.map((_, i) => (
                      <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: i === activeCard ? "#10B981" : "rgba(255,255,255,0.2)", transition: "background 0.4s" }} />
                    ))}
                  </div>
                  {/* Earn badge */}
                  <div style={{ marginTop: 14, background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.2)", borderRadius: 10, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>💰</span>
                    <div>
                      <div style={{ fontSize: 10, color: "#FFD700", fontWeight: 700 }}>Provision verdient</div>
                      <div style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>€ 87,50</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div style={{ position: "absolute", top: "10%", right: -10, background: "rgba(99,255,180,0.12)", border: "1px solid rgba(99,255,180,0.3)", borderRadius: 12, padding: "8px 12px", fontSize: 12, color: "#63FFB4", fontWeight: 700, backdropFilter: "blur(8px)", animation: "float 3.5s ease-in-out 0.5s infinite" }}>
              🎉 +1 Stempel!
            </div>
            <div style={{ position: "absolute", bottom: "15%", left: -20, background: "rgba(255,215,0,0.12)", border: "1px solid rgba(255,215,0,0.3)", borderRadius: 12, padding: "8px 12px", fontSize: 12, color: "#FFD700", fontWeight: 700, backdropFilter: "blur(8px)", animation: "float 4s ease-in-out 1.5s infinite" }}>
              💸 +50€ Provision
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <div style={{ background: "rgba(16,185,129,0.06)", borderTop: "1px solid rgba(16,185,129,0.15)", borderBottom: "1px solid rgba(16,185,129,0.15)", padding: "28px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 24 }}>
          {[
            { val: "10.000+", label: "Aktive Nutzer" },
            { val: "500+", label: "Partnerbetriebe" },
            { val: "€ 240.000", label: "Provisionen ausgezahlt" },
            { val: "4,9 ★", label: "Kundenbewertung" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 900, color: "#63FFB4" }}>{s.val}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section
        ref={ref("steps")}
        data-section="steps"
        className="section-pad"
        style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px", position: "relative", zIndex: 1 }}
      >
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#63FFB4", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>So einfach geht's</div>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 900 }}>In 3 Schritten zu deiner Prämie</h2>
        </div>

        <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {[
            { num: "01", icon: "📱", title: "QR-Code scannen", desc: "Scanne den QR-Code deines Lieblingsgeschäfts – keine App nötig. Direkt im Browser.", color: "#63FFB4" },
            { num: "02", icon: "✅", title: "Stempel sammeln", desc: "Dein digitaler Stempel ist sofort gespeichert. Sicher, für immer, überall abrufbar.", color: "#FFD700" },
            { num: "03", icon: "💸", title: "Prämien kassieren", desc: "Hast du genug Stempel? Prämie einlösen! Und verdiene extra durch Empfehlungen.", color: "#FF6B9D" },
          ].map((step, i) => (
            <div
              key={step.num}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 24,
                padding: 32,
                opacity: visible("steps") ? 1 : 0,
                animation: visible("steps") ? `fadeSlideUp 0.6s ease ${i * 0.15}s forwards` : "none",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", top: 20, right: 20, fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 56, fontWeight: 900, color: "rgba(255,255,255,0.03)", lineHeight: 1 }}>{step.num}</div>
              <div style={{ width: 56, height: 56, background: `rgba(255,255,255,0.06)`, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, marginBottom: 20, border: `1px solid ${step.color}33` }}>
                {step.icon}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 10 }}>{step.title}</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>{step.desc}</p>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(to right, ${step.color}, transparent)`, borderRadius: "0 0 24px 24px" }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section
        ref={ref("features")}
        data-section="features"
        style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "80px 24px", position: "relative", zIndex: 1 }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#63FFB4", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Warum Sensalie?</div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 900 }}>Alles was du brauchst</h2>
          </div>
          <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="feature-card"
                style={{
                  opacity: visible("features") ? 1 : 0,
                  animation: visible("features") ? `fadeSlideUp 0.6s ease ${i * 0.12}s forwards` : "none",
                }}
              >
                <div style={{ width: 52, height: 52, background: `${f.color}18`, border: `1px solid ${f.color}40`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 18 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BUSINESSES SHOWCASE ── */}
      <section
        ref={ref("businesses")}
        data-section="businesses"
        className="section-pad"
        style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px", position: "relative", zIndex: 1 }}
      >
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#63FFB4", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Partnerbetriebe</div>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 900 }}>Deine Lieblingsgeschäfte warten</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", marginTop: 14, maxWidth: 500, margin: "14px auto 0" }}>Von Barbershops über Cafés bis Fitnessstudios – überall Stempel sammeln und Prämien kassieren.</p>
        </div>
        <div className="biz-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {BUSINESSES.map((biz, i) => (
            <div
              key={biz.name}
              style={{
                borderRadius: 20,
                overflow: "hidden",
                position: "relative",
                aspectRatio: "3/4",
                opacity: visible("businesses") ? 1 : 0,
                animation: visible("businesses") ? `fadeSlideUp 0.6s ease ${i * 0.1}s forwards` : "none",
                cursor: "pointer",
                border: i === activeCard ? "2px solid #10B981" : "2px solid transparent",
                transition: "border-color 0.4s",
              }}
            >
              <img src={biz.img} alt={biz.name} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.75, transition: "transform 0.4s", transform: i === activeCard ? "scale(1.05)" : "scale(1)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(7,17,27,0.95) 100%)" }} />
              <div style={{ position: "absolute", bottom: 16, left: 14, right: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: 18 }}>{biz.emoji}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{biz.name}</span>
                </div>
                <div style={{ fontSize: 11, color: "#63FFB4", fontWeight: 700 }}>🎁 {biz.reward}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 3 }}>{biz.stamps} Stempel bis zur Prämie</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section
        ref={ref("testimonials")}
        data-section="testimonials"
        style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "80px 24px", position: "relative", zIndex: 1 }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#63FFB4", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Das sagen unsere Nutzer</div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 900 }}>Tausende sind begeistert</h2>
          </div>
          <div className="testimonials-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className="testimonial-card"
                style={{
                  opacity: visible("testimonials") ? 1 : 0,
                  animation: visible("testimonials") ? `fadeSlideUp 0.6s ease ${i * 0.15}s forwards` : "none",
                }}
              >
                <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
                  {[...Array(t.stars)].map((_, j) => <span key={j} style={{ color: "#FFD700", fontSize: 16 }}>★</span>)}
                </div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #10B981, #059669)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>
                    {t.avatar}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{t.name}</div>
                </div>
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
        style={{ padding: "80px 24px 100px", position: "relative", zIndex: 1 }}
      >
        <div style={{
          maxWidth: 580,
          margin: "0 auto",
          textAlign: "center",
          background: "rgba(16,185,129,0.06)",
          border: "1px solid rgba(16,185,129,0.2)",
          borderRadius: 32,
          padding: "52px 40px",
          opacity: visible("cta") ? 1 : 0,
          animation: visible("cta") ? "fadeSlideUp 0.7s ease forwards" : "none",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Glow top */}
          <div style={{ position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)", width: 300, height: 200, background: "radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)", pointerEvents: "none" }} />

          <div style={{ fontSize: 52, marginBottom: 16, animation: "float 3s ease-in-out infinite" }}>🎁</div>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 900, marginBottom: 12, lineHeight: 1.2 }}>
            Starte jetzt kostenlos
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 36, maxWidth: 420, margin: "0 auto 36px" }}>
            Registriere dich in 10 Sekunden. Keine App, kein Passwort, keine Kreditkarte. Nur deine Handynummer.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 380, margin: "0 auto" }}>
              <input
                type="tel"
                inputMode="numeric"
                className="phone-input"
                placeholder="📱 Deine Handynummer"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
              />
              <button type="submit" className="cta-btn" style={{ width: "100%" }}>
                🚀 Jetzt kostenlos sichern
              </button>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
                Mit der Registrierung stimmst du unseren Nutzungsbedingungen zu.
              </div>
            </form>
          ) : (
            <div style={{ padding: "24px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 20, maxWidth: 380, margin: "0 auto" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
              <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Willkommen bei Sensalie!</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>Dein Konto ist jetzt aktiv. Scanne deinen ersten QR-Code und fang an, Stempel zu sammeln.</div>
            </div>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px 24px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ width: 28, height: 28, background: "linear-gradient(135deg, #10B981, #059669)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800 }}>S</div>
          <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 18, fontWeight: 900, color: "#fff" }}>Sensalie</span>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 8px rgba(16,185,129,0.9)" }} />
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>
          Deine digitale Kundenkarte — sicher, einfach &amp; überall dabei.
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.15)", marginTop: 20 }}>
          © 2026 Sensalie · Datenschutz · Impressum
        </div>
      </footer>
    </div>
  );
}