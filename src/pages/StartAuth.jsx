import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";

const SLIDES = [
  { img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1000&q=80", label: "Barbershops" },
  { img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1000&q=80", label: "Cafés" },
  { img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1000&q=80", label: "Nagelstudios" },
];

const FEATURES = [
  { icon: "⚡", title: "In 2 Min. startklar", desc: "Stempelkarte anlegen, QR drucken, loslegen." },
  { icon: "💸", title: "Nur bei Erfolg zahlen", desc: "Provision löst erst aus, wenn der Kunde kam." },
  { icon: "🤝", title: "Echte Empfehlungen", desc: "Deine Stammkunden bringen dir neue Kunden." },
];

export default function StartAuth() {
  const [slide, setSlide] = useState(0);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // Wenn bereits eingeloggt → direkt aufs Dashboard
    base44.auth.isAuthenticated().then(authed => {
      if (authed) window.location.href = "/Business";
    });
    const t = setInterval(() => setSlide(i => (i + 1) % SLIDES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const goLogin = () => {
    setRedirecting(true);
    base44.auth.redirectToLogin("/Business");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A1612", fontFamily: "'Inter', sans-serif", color: "#fff", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Bricolage+Grotesque:wght@700;800;900&display=swap');
        * { box-sizing: border-box; }
        @keyframes slowZoom { 0%{transform:scale(1)} 100%{transform:scale(1.08)} }
      `}</style>

      {/* Glow */}
      <div style={{ position: "absolute", top: -120, left: -80, width: 460, height: 460, background: "radial-gradient(circle, rgba(16,185,129,0.22) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -100, right: -60, width: 380, height: 380, background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Card */}
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 880, display: "grid", gridTemplateColumns: window.innerWidth > 760 ? "1.1fr 1fr" : "1fr", gap: 0, borderRadius: 28, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.55)", border: "1px solid rgba(16,185,129,0.18)", background: "rgba(13,31,20,0.6)", backdropFilter: "blur(16px)" }}>

        {/* Left: visual */}
        <div style={{ position: "relative", minHeight: window.innerWidth > 760 ? 480 : 200, overflow: "hidden" }}>
          {SLIDES.map((s, i) => (
            <img key={s.img} src={s.img} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: i === slide ? 1 : 0, transition: "opacity 1.4s ease", animation: "slowZoom 7s ease-in-out forwards" }} />
          ))}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,22,18,0.92) 0%, rgba(10,22,18,0.25) 55%)" }} />
          <div style={{ position: "absolute", bottom: 24, left: 24, right: 24 }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
              {SLIDES.map((_, i) => (
                <div key={i} style={{ width: 18, height: 3, borderRadius: 2, background: i === slide ? "#10B981" : "rgba(255,255,255,0.22)" }} />
              ))}
            </div>
            <div style={{ fontSize: 11, color: "#10B981", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Sensalie Business</div>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>Wachstum durch Kunden, die hinter dir stehen.</div>
          </div>
        </div>

        {/* Right: auth */}
        <div style={{ padding: 40, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
            <div style={{ width: 38, height: 38, background: "linear-gradient(135deg, #10B981, #059669)", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: "0 4px 16px rgba(16,185,129,0.4)" }}>✂️</div>
            <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 900, color: "#fff" }}>Sensalie<span style={{ color: "#10B981" }}>.</span></span>
          </div>

          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 28, fontWeight: 900, color: "#fff", margin: "0 0 8px", lineHeight: 1.15 }}>Willkommen zurück 👋</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: "0 0 28", lineHeight: 1.6 }}>Melde dich an oder registriere dich kostenlos – in unter 2 Minuten startklar.</p>

          {/* Buttons */}
          <button onClick={goLogin} disabled={redirecting} style={{ width: "100%", padding: "15px", background: "linear-gradient(135deg, #10B981, #059669)", color: "#fff", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", marginBottom: 12, boxShadow: "0 6px 24px rgba(16,185,129,0.35)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: redirecting ? 0.7 : 1 }}>
            {redirecting ? "Weiterleitung…" : "Anmelden"}
          </button>
          <button onClick={goLogin} disabled={redirecting} style={{ width: "100%", padding: "15px", background: "transparent", color: "#10B981", border: "1.5px solid rgba(16,185,129,0.45)", borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginBottom: 24 }}>
            Kostenlos registrieren
          </button>

          {/* Features */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{f.title}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 28, textAlign: "center" }}>
            <Link to="/for-business" style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>← Zurück zur Übersicht</Link>
          </div>
        </div>
      </div>
    </div>
  );
}