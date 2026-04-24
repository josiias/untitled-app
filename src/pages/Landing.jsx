import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at top, #0d2b1a 0%, #080f0b 60%, #050906 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', sans-serif",
      padding: "24px",
      position: "relative",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');`}</style>

      {/* Logo */}
      <div style={{ marginBottom: 48, textAlign: "center" }}>
        <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", letterSpacing: "-1px" }}>
          Sensalie<span style={{ color: "#10B981" }}>.</span>
        </div>
        <div style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", marginTop: 10, lineHeight: 1.6 }}>
          Wir verbinden Kunden & Unternehmer —<br />
          <span style={{ color: "#10B981", fontWeight: 600 }}>für echte Loyalität, die sich lohnt.</span>
        </div>
      </div>

      {/* Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%", maxWidth: 440 }}>
        {/* Kunde */}
        <Link to="/customer" style={{ textDecoration: "none" }}>
          <div style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 18,
            padding: "22px 22px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
          >
            <div style={{ width: 52, height: 52, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
              🛍️
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Ich bin Kunde</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 10 }}>
                Stempel sammeln, Prämien einlösen & verdienen.
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["🎁 Prämien", "💸 Provision", "⭐ Treue"].map(tag => (
                  <span key={tag} style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 100, padding: "3px 10px", fontSize: 11, fontWeight: 600, color: "#10B981" }}>{tag}</span>
                ))}
              </div>
            </div>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 20 }}>→</div>
          </div>
        </Link>

        {/* Unternehmer */}
        <Link to="/for-business" style={{ textDecoration: "none" }}>
          <div style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 18,
            padding: "22px 22px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
          >
            <div style={{ width: 52, height: 52, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
              🏢
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Ich bin Unternehmer</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 10 }}>
                Kundenbindung stärken & Neukunden gewinnen.
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["📈 Umsatz", "👥 Neukunden", "❤️ Bindung"].map(tag => (
                  <span key={tag} style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 100, padding: "3px 10px", fontSize: 11, fontWeight: 600, color: "#10B981" }}>{tag}</span>
                ))}
              </div>
            </div>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 20 }}>→</div>
          </div>
        </Link>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 48, fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
        © 2026 Sensalie · Einfach. Digital. Loyal.
      </div>
    </div>
  );
}