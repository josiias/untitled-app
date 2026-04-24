import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const HERO_SLIDES = [
  { img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1400&q=80", label: "Für Barbershops" },
  { img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1400&q=80", label: "Für Cafés" },
  { img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1400&q=80", label: "Für Nagelstudios" },
  { img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1400&q=80", label: "Für Massagestudios" },
];

const CATEGORIES = [
  { label: "Cafés", emoji: "☕", img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&q=80" },
  { label: "Nagelstudios", emoji: "💅", img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80" },
  { label: "Barbershops", emoji: "✂️", img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80" },
  { label: "Massage", emoji: "💆", img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80" },
  { label: "Friseursalons", emoji: "💇", img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80" },
  { label: "Restaurants", emoji: "🍽️", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80" },
  { label: "Lokale Läden", emoji: "🏪", img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80" },
];

const STAMP_CARDS = [
  { name: "Kings Barbershop", emoji: "✂️", stamps: 5, total: 8, color: "#10B981" },
  { name: "Café Milano", emoji: "☕", stamps: 3, total: 6, color: "#F59E0B" },
  { name: "Bella Nails", emoji: "💅", stamps: 7, total: 8, color: "#EC4899" },
];

function PhoneMockup() {
  return (
    <div style={{
      background: "#111827",
      borderRadius: 36,
      padding: "18px 14px 22px",
      width: 220,
      border: "2px solid rgba(255,255,255,0.12)",
      boxShadow: "0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)",
      margin: "0 auto",
    }}>
      {/* Status bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, padding: "0 4px" }}>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>9:41</span>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span style={{ fontSize: 8, color: "rgba(255,255,255,0.35)" }}>●●●</span>
        </div>
      </div>

      {/* Header */}
      <div style={{ fontWeight: 800, fontSize: 13, color: "#fff", marginBottom: 12 }}>Meine Karten</div>

      {/* Stamp cards */}
      {STAMP_CARDS.map(c => (
        <div key={c.name} style={{
          background: "rgba(255,255,255,0.06)",
          borderRadius: 14,
          padding: "10px 11px",
          marginBottom: 8,
          border: "1px solid rgba(255,255,255,0.07)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{c.emoji} {c.name}</span>
            <span style={{ fontSize: 10, fontWeight: 800, color: c.color }}>{c.stamps}/{c.total}</span>
          </div>
          {/* Stamp dots */}
          <div style={{ display: "flex", gap: 4 }}>
            {Array.from({ length: c.total }).map((_, i) => (
              <div key={i} style={{
                width: 15, height: 15, borderRadius: "50%",
                background: i < c.stamps ? c.color : "rgba(255,255,255,0.09)",
                border: i < c.stamps ? "none" : "1px solid rgba(255,255,255,0.18)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 7, color: "#fff", fontWeight: 700,
                boxShadow: i === c.stamps - 1 ? `0 0 8px ${c.color}99` : "none",
                flexShrink: 0,
              }}>
                {i < c.stamps ? "✓" : ""}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Earnings */}
      <div style={{
        background: "rgba(16,185,129,0.12)",
        border: "1px solid rgba(16,185,129,0.3)",
        borderRadius: 12,
        padding: "10px 12px",
        marginTop: 2,
      }}>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 2 }}>💸 Verdient</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#10B981" }}>42,50 €</div>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>3 Empfehlungen</div>
      </div>
    </div>
  );
}

export default function CustomerLanding() {
  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setHeroSlide(i => (i + 1) % HERO_SLIDES.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#080f0b", fontFamily: "'Inter', sans-serif", color: "#fff", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 0; height: 0; }

        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
        }
        .phone-col {
          display: flex;
          justify-content: center;
        }
        @media (max-width: 700px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 36px;
            text-align: center;
          }
          .phone-col {
            order: -1;
          }
          .hero-btn-row {
            justify-content: center !important;
          }
          .feature-row {
            align-items: center !important;
            text-align: left;
          }
        }
        @media (min-width: 701px) {
          .phone-col { order: 1; }
        }

        .stat-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 24px 20px;
          text-align: center;
          transition: transform 0.25s, border-color 0.25s;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(16,185,129,0.3);
        }
        .cat-pill {
          position: relative;
          border-radius: 18px;
          overflow: hidden;
          flex-shrink: 0;
          cursor: pointer;
          transition: transform 0.25s;
        }
        .cat-pill:hover { transform: scale(1.04); }
      `}</style>

      {/* Navbar */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(8,15,11,0.92)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "0 20px", height: 58,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: "-0.5px" }}>
          Sensalie<span style={{ color: "#10B981" }}>.</span>
        </div>
        <Link to="/dashboard" style={{
          background: "#10B981", borderRadius: 100, padding: "8px 20px",
          fontSize: 13, fontWeight: 700, color: "#fff", textDecoration: "none",
          boxShadow: "0 4px 14px rgba(16,185,129,0.35)",
        }}>
          Anmelden
        </Link>
      </nav>

      {/* ── HERO ── */}
      <div style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        {/* BG slideshow */}
        {HERO_SLIDES.map((s, i) => (
          <img key={s.img} src={s.img} alt="" style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", opacity: i === heroSlide ? 0.4 : 0,
            transition: "opacity 1.5s ease",
          }} />
        ))}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(5,10,8,0.94) 0%, rgba(5,10,8,0.6) 100%)" }} />
        {/* Green glow */}
        <div style={{ position: "absolute", top: "20%", right: "10%", width: 400, height: 400, background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 1100, margin: "0 auto", padding: "60px 20px 80px" }}>
          <div className="hero-grid">
            {/* Text side */}
            <div>
              <h1 style={{ fontSize: "clamp(34px, 7vw, 64px)", fontWeight: 900, lineHeight: 1.05, margin: "0 0 8px" }}>
                Sammel digitale
              </h1>
              <h1 style={{ fontSize: "clamp(34px, 7vw, 64px)", fontWeight: 900, lineHeight: 1.05, margin: "0 0 28px", color: "#10B981" }}>
                Stempelkarten
              </h1>

              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 36 }}>
                <div className="feature-row" style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🎁</div>
                  <div>
                    <div style={{ fontSize: "clamp(15px, 2vw, 18px)", fontWeight: 800 }}>Hol dir großartige Prämien</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 3 }}>Rabatte, Gratisleistungen & mehr</div>
                  </div>
                </div>
                <div className="feature-row" style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>💸</div>
                  <div>
                    <div style={{ fontSize: "clamp(15px, 2vw, 18px)", fontWeight: 800 }}>
                      Verdiene <span style={{ color: "#10B981" }}>100 €</span> und mehr
                    </div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 3 }}>Passiv & automatisch durch Empfehlungen</div>
                  </div>
                </div>
              </div>

              <div className="hero-btn-row" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link to="/dashboard" style={{
                  display: "inline-block", background: "#10B981", color: "#fff",
                  fontWeight: 800, fontSize: 15, padding: "14px 30px", borderRadius: 100,
                  textDecoration: "none", boxShadow: "0 8px 30px rgba(16,185,129,0.45)",
                }}>
                  Kostenlos registrieren →
                </Link>
              </div>
            </div>

            {/* Phone mockup side */}
            <div className="phone-col">
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 280, height: 280, background: "radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 65%)", pointerEvents: "none" }} />
                <PhoneMockup />
              </div>
            </div>
          </div>

          {/* Slide dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 40 }}>
            {HERO_SLIDES.map((_, i) => (
              <div key={i} onClick={() => setHeroSlide(i)} style={{
                width: i === heroSlide ? 20 : 6, height: 6, borderRadius: 100,
                background: i === heroSlide ? "#10B981" : "rgba(255,255,255,0.25)",
                transition: "all 0.35s", cursor: "pointer",
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div style={{ padding: "70px 20px", background: "#060d09" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>WARUM SENSALIE?</div>
            <h2 style={{ fontSize: "clamp(24px,5vw,40px)", fontWeight: 900, margin: 0 }}>Mehr Wert aus jedem Besuch</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
            {[
              { emoji: "🎁", value: "100 €+", label: "Provision verdienen", color: "#10B981" },
              { emoji: "⚡", value: "0€", label: "Vorab-Kosten für dich", color: "#F59E0B" },
              { emoji: "📱", value: "100%", label: "Digital & Papierlos", color: "#EC4899" },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div style={{ fontSize: 32, marginBottom: 10 }}>{s.emoji}</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: s.color, marginBottom: 6 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div style={{ padding: "70px 20px", background: "#080f0b" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>SO EINFACH GEHT'S</div>
            <h2 style={{ fontSize: "clamp(24px,5vw,40px)", fontWeight: 900, margin: 0 }}>In 3 Schritten durchstarten</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 16 }}>
            {[
              { num: "01", emoji: "📱", title: "QR-Code scannen", desc: "Beim nächsten Besuch einfach den QR-Code an der Kasse scannen — kein Download nötig." },
              { num: "02", emoji: "⭐", title: "Stempel sammeln", desc: "Mit jedem Einkauf einen Stempel — bis du deine Prämie einlösen kannst." },
              { num: "03", emoji: "💸", title: "Geld verdienen", desc: "Empfehle Freunde und kassiere automatisch deine Provision." },
            ].map((s, i) => (
              <div key={s.num} style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 22, padding: "28px 22px",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: 16, right: 16, fontSize: 28, fontWeight: 900, color: "rgba(16,185,129,0.15)", fontFamily: "monospace" }}>{s.num}</div>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 14 }}>{s.emoji}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <div style={{ padding: "70px 0", background: "#060d09" }}>
        <div style={{ textAlign: "center", marginBottom: 28, padding: "0 20px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>PARTNER-KATEGORIEN</div>
          <h2 style={{ fontSize: "clamp(22px,4vw,36px)", fontWeight: 900, margin: 0 }}>Überall in deiner Stadt</h2>
        </div>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", padding: "8px 20px 12px", scrollbarWidth: "none" }}>
          {CATEGORIES.map(cat => (
            <div key={cat.label} className="cat-pill" style={{ width: 140, height: 170 }}>
              <img src={cat.img} alt={cat.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 55%)" }} />
              <div style={{ position: "absolute", bottom: 12, left: 12 }}>
                <div style={{ fontSize: 20, marginBottom: 3 }}>{cat.emoji}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{cat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&q=80" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(5,10,8,0.82)" }} />
        <div style={{ position: "relative", zIndex: 1, padding: "80px 20px", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(28px,6vw,52px)", fontWeight: 900, lineHeight: 1.15, margin: "0 0 14px" }}>
            Bereit für mehr<br /><span style={{ color: "#10B981" }}>aus jedem Besuch?</span>
          </h2>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, marginBottom: 32, maxWidth: 380, margin: "0 auto 32px" }}>
            Kostenlos starten. Kein Abo. Keine versteckten Kosten.
          </div>
          <Link to="/dashboard" style={{
            display: "inline-block", background: "#10B981", color: "#fff",
            fontWeight: 800, fontSize: 16, padding: "16px 40px", borderRadius: 100,
            textDecoration: "none", boxShadow: "0 8px 30px rgba(16,185,129,0.45)",
          }}>
            Jetzt kostenlos registrieren →
          </Link>
        </div>
      </div>
    </div>
  );
}