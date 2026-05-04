import { Link } from "react-router-dom";

export default function SiteFooter() {
  return (
    <footer style={{
      background: "#060e09", borderTop: "1px solid rgba(255,255,255,0.06)",
      padding: "40px 24px 28px", fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>
            Sensalie<span style={{ color: "#10B981" }}>.</span>
          </div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[
              { label: "Für Unternehmer", to: "/for-business" },
              { label: "Für Kunden", to: "/customer" },
              { label: "Impressum", to: "/impressum" },
              { label: "Datenschutz", to: "/datenschutz" },
            ].map(link => (
              <Link key={link.to} to={link.to} style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none", fontWeight: 500, transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "#10B981"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>© 2026 Sensalie · Einfach. Digital. Loyal.</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>Made in Germany 🇩🇪</div>
        </div>
      </div>
    </footer>
  );
}