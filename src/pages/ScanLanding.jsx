import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// ─── Mock Business Data (until real entities are connected) ───────────────────
const MOCK_BUSINESS = {
  id: "demo-kings-barbershop-001",
  name: "Kings Barbershop",
  stamps_required: 8,
  min_purchase_amount: 20,
  reward_description: "10€ Gutschein",
  emoji: "✂️",
};

// ─── Steps ────────────────────────────────────────────────────────────────────
// stamp-anim → register-prompt → registered → already-member

export default function ScanLanding() {
  const { businessId } = useParams();
  const [step, setStep] = useState("stamp-anim");
  const [stampsCount] = useState(1); // the newly earned stamp (demo: 1 stamp so far)
  const [animDone, setAnimDone] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const business = MOCK_BUSINESS; // replace with entity fetch later

  // After 2.5s stamp animation, show register prompt
  useEffect(() => {
    if (step === "stamp-anim") {
      const t = setTimeout(() => setAnimDone(true), 1800);
      return () => clearTimeout(t);
    }
  }, [step]);

  const handleRegister = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setStep("registered"), 600);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0A1612 0%, #0d2018 60%, #0A1612 100%)",
      fontFamily: "'Inter', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Bricolage+Grotesque:wght@700;800&display=swap');
        * { box-sizing: border-box; }

        @keyframes stampDrop {
          0%   { transform: scale(3) rotate(-20deg); opacity: 0; }
          60%  { transform: scale(0.9) rotate(4deg); opacity: 1; }
          80%  { transform: scale(1.08) rotate(-2deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes ringPulse {
          0%   { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-6px); }
        }
        .stamp-icon { animation: stampDrop 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .ring { position: absolute; border-radius: 50%; border: 3px solid #10B981; animation: ringPulse 1s ease-out forwards; pointer-events: none; }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
        .shimmer-btn {
          background: linear-gradient(90deg, #10B981 0%, #34d399 50%, #10B981 100%);
          background-size: 200% auto;
          animation: shimmer 2.5s linear infinite;
        }
        .stamp-cell-filled { background: #10B981 !important; }
        .settings-input {
          width: 100%;
          border: 1.5px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 15px;
          outline: none;
          font-family: inherit;
          color: #fff;
          background: rgba(255,255,255,0.06);
          transition: border-color 0.2s;
        }
        .settings-input:focus { border-color: #10B981; }
        .settings-input::placeholder { color: rgba(255,255,255,0.3); }
      `}</style>

      {/* Background glow */}
      <div style={{ position: "fixed", top: -100, left: "50%", transform: "translateX(-50%)", width: 500, height: 500, background: "radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* ── STEP 1: Stamp Animation ── */}
      {step === "stamp-anim" && (
        <div style={{ textAlign: "center", maxWidth: 340, width: "100%" }}>
          {/* Business badge */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 32 }}>
            <div style={{ width: 38, height: 38, background: "#10B981", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{business.emoji}</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{business.name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Stempelkarte</div>
            </div>
          </div>

          {/* Stamp animation circle */}
          <div style={{ position: "relative", width: 140, height: 140, margin: "0 auto 28px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Pulse rings */}
            <div className="ring" style={{ width: 100, height: 100, animationDelay: "0.3s" }} />
            <div className="ring" style={{ width: 100, height: 100, animationDelay: "0.7s" }} />
            {/* Stamp */}
            <div className="stamp-icon" style={{ width: 100, height: 100, background: "#10B981", borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, boxShadow: "0 0 40px rgba(16,185,129,0.5)" }}>
              ✓
            </div>
          </div>

          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 28, fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>
            Glückwunsch! 🎉
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", margin: "0 0 32px", lineHeight: 1.5 }}>
            Du hast einen Stempel erhalten!
          </p>

          {/* Stamp card preview */}
          <div style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.04))", border: "1.5px solid rgba(16,185,129,0.3)", borderRadius: 16, padding: 20, marginBottom: 28 }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Deine Stempelkarte</div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(business.stamps_required, 4)}, 1fr)`, gap: 6, marginBottom: 12 }}>
              {Array.from({ length: business.stamps_required }).map((_, i) => (
                <div key={i} style={{
                  aspectRatio: "1/1",
                  background: i < stampsCount ? "#10B981" : "rgba(16,185,129,0.12)",
                  borderRadius: 8,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, color: "#fff",
                  boxShadow: i === stampsCount - 1 ? "0 0 12px rgba(16,185,129,0.7)" : "none",
                  transition: "all 0.3s",
                }}>
                  {i < stampsCount ? "✓" : ""}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
              {stampsCount} von {business.stamps_required} Stempeln •{" "}
              <span style={{ color: "#10B981", fontWeight: 600 }}>Prämie: {business.reward_description}</span>
            </div>
          </div>

          {/* CTA: only show after anim */}
          {animDone && (
            <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                className="shimmer-btn"
                onClick={() => setStep("register-prompt")}
                style={{ width: "100%", padding: "14px", color: "#fff", fontWeight: 700, fontSize: 15, borderRadius: 12, border: "none", cursor: "pointer", fontFamily: "inherit" }}
              >
                ✨ Stempel sichern & Konto erstellen
              </button>
              <button
                onClick={() => setStep("register-prompt")}
                style={{ width: "100%", padding: "12px", background: "transparent", color: "rgba(255,255,255,0.4)", fontWeight: 500, fontSize: 13, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", fontFamily: "inherit" }}
              >
                ⚠️ Ohne Registrierung fortfahren (Stempel geht verloren)
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── STEP 2: Register Prompt ── */}
      {step === "register-prompt" && (
        <div className="fade-up" style={{ maxWidth: 340, width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📲</div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>Konto erstellen</h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.5 }}>
              Dein Stempel bei <strong style={{ color: "#fff" }}>{business.name}</strong> wird gespeichert und du wirst benachrichtigt wenn deine Prämie bereit ist.
            </p>
          </div>

          {/* Benefits */}
          <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12, padding: 16, marginBottom: 24 }}>
            {[
              { icon: "🎯", text: "Deine Stempel gehen nie verloren" },
              { icon: "🎁", text: `Prämie nach ${business.stamps_required} Stempeln: ${business.reward_description}` },
              { icon: "📣", text: "Freunde einladen & Provision kassieren" },
            ].map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < 2 ? 10 : 0 }}>
                <span style={{ fontSize: 18 }}>{b.icon}</span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.4 }}>{b.text}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="text"
              className="settings-input"
              placeholder="Dein Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoFocus
            />
            <input
              type="email"
              className="settings-input"
              placeholder="E-Mail Adresse"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={submitted}
              className="shimmer-btn"
              style={{ padding: "14px", color: "#fff", fontWeight: 700, fontSize: 15, borderRadius: 12, border: "none", cursor: submitted ? "not-allowed" : "pointer", fontFamily: "inherit", marginTop: 4, opacity: submitted ? 0.7 : 1 }}
            >
              {submitted ? "Wird gespeichert…" : "Stempel jetzt sichern →"}
            </button>
            <button
              type="button"
              onClick={() => window.close()}
              style={{ padding: "10px", background: "transparent", color: "rgba(255,255,255,0.3)", fontWeight: 500, fontSize: 12, borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit" }}
            >
              Nein danke, Stempel geht verloren
            </button>
          </form>
        </div>
      )}

      {/* ── STEP 3: Registered / Success ── */}
      {step === "registered" && (
        <div className="fade-up" style={{ maxWidth: 340, width: "100%", textAlign: "center" }}>
          <div style={{ width: 80, height: 80, background: "rgba(16,185,129,0.15)", border: "2px solid #10B981", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 38, animation: "bounce 1s ease infinite" }}>
            🎉
          </div>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 24, fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>Willkommen, {name}!</h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", marginBottom: 28, lineHeight: 1.5 }}>
            Dein Stempel ist gesichert. Wir schicken dir eine Bestätigung an <strong style={{ color: "#10B981" }}>{email}</strong>.
          </p>

          {/* Stamp card */}
          <div style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.04))", border: "1.5px solid rgba(16,185,129,0.3)", borderRadius: 16, padding: 20, marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Deine Stempelkarte · {business.name}</div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(business.stamps_required, 4)}, 1fr)`, gap: 6, marginBottom: 12 }}>
              {Array.from({ length: business.stamps_required }).map((_, i) => (
                <div key={i} style={{
                  aspectRatio: "1/1",
                  background: i < stampsCount ? "#10B981" : "rgba(16,185,129,0.12)",
                  borderRadius: 8,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, color: "#fff",
                }}>
                  {i < stampsCount ? "✓" : ""}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
              {stampsCount} von {business.stamps_required} Stempeln bis zur Prämie
            </div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>🔗 Dein Empfehlungslink</div>
            <div style={{ fontSize: 12, color: "#10B981", fontWeight: 600, fontFamily: "monospace" }}>
              sensalie.app/ref/{name.toLowerCase().replace(/\s+/g, "")}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 6 }}>
              Teile ihn & kassiere Provision für jede Empfehlung
            </div>
          </div>

          <button
            onClick={() => window.location.href = "/"}
            style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: 13, borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", fontFamily: "inherit" }}
          >
            Zur Startseite
          </button>
        </div>
      )}
    </div>
  );
}