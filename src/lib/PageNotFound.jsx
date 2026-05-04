import { Link, useLocation } from 'react-router-dom';

export default function PageNotFound() {
  const location = useLocation();

  return (
    <div style={{
      minHeight: "100vh", background: "#0a1410",
      fontFamily: "'Inter', sans-serif", color: "#fff",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "24px", textAlign: "center",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&display=swap');`}</style>

      {/* Glow */}
      <div style={{ position: "fixed", top: "30%", left: "50%", transform: "translateX(-50%)", width: 400, height: 400, background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", maxWidth: 440 }}>
        <div style={{ fontSize: "clamp(80px,20vw,140px)", fontWeight: 900, color: "rgba(16,185,129,0.15)", lineHeight: 1, marginBottom: 0, userSelect: "none" }}>404</div>
        <div style={{ fontSize: "clamp(22px,5vw,36px)", fontWeight: 900, color: "#fff", marginBottom: 12, marginTop: -16 }}>Seite nicht gefunden</div>
        <div style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", marginBottom: 36, lineHeight: 1.6 }}>
          Die Seite <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>"{location.pathname}"</span> existiert nicht.
        </div>
        <Link to="/" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "#10B981", color: "#fff", fontWeight: 800, fontSize: 15,
          padding: "14px 28px", borderRadius: 100, textDecoration: "none",
          boxShadow: "0 8px 28px rgba(16,185,129,0.35)",
        }}>
          ← Zurück zur Startseite
        </Link>
        <div style={{ marginTop: 24, display: "flex", gap: 20, justifyContent: "center" }}>
          <Link to="/for-business" style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>Für Unternehmer</Link>
          <Link to="/customer" style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>Für Kunden</Link>
        </div>
      </div>
    </div>
  );
}