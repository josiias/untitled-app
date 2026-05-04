import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("sensalie_cookie_consent");
    if (!consent) setTimeout(() => setVisible(true), 1200);
  }, []);

  const accept = () => {
    localStorage.setItem("sensalie_cookie_consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("sensalie_cookie_consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)",
      zIndex: 9999, width: "calc(100% - 32px)", maxWidth: 600,
      background: "rgba(10,22,16,0.97)", backdropFilter: "blur(20px)",
      border: "1px solid rgba(16,185,129,0.3)", borderRadius: 18,
      padding: "18px 22px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(16,185,129,0.1)",
      display: "flex", flexDirection: "column", gap: 14,
      animation: "cookieSlideUp 0.4s cubic-bezier(0.34,1.56,0.64,1)",
    }}>
      <style>{`
        @keyframes cookieSlideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <span style={{ fontSize: 22, flexShrink: 0 }}>🍪</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Wir verwenden Cookies</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
            Wir nutzen technisch notwendige Cookies sowie — mit deiner Einwilligung — Cookies zur Analyse.{" "}
            <Link to="/datenschutz" style={{ color: "#10B981", textDecoration: "none", fontWeight: 600 }}>Datenschutzerklärung</Link>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={accept} style={{
          flex: 1, padding: "10px", background: "#10B981", border: "none",
          borderRadius: 12, color: "#fff", fontWeight: 800, fontSize: 13,
          cursor: "pointer", fontFamily: "inherit",
        }}>
          Alle akzeptieren
        </button>
        <button onClick={decline} style={{
          flex: 1, padding: "10px",
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 12, color: "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: 13,
          cursor: "pointer", fontFamily: "inherit",
        }}>
          Nur notwendige
        </button>
      </div>
    </div>
  );
}