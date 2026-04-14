import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const MOCK_BUSINESS = {
  id: "demo-kings-barbershop-001",
  name: "Kings Barbershop",
  stamps_required: 8,
  min_purchase_amount: 20,
  reward_description: "10€ Gutschein",
  emoji: "✂️",
  category: "barbershop", // barbershop | cafe | restaurant | fitness | beauty
};

// Unsplash background images per business category
const CATEGORY_IMAGES = {
  barbershop: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80",
  cafe: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80",
  restaurant: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
  fitness: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
  beauty: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
};

export default function ScanLanding() {
  const { businessId } = useParams();
  const [step, setStep] = useState("stamp-anim");
  const [stampsCount] = useState(1);
  const [animDone, setAnimDone] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [particles, setParticles] = useState([]);

  const business = MOCK_BUSINESS;

  // Generate confetti particles
  useEffect(() => {
    const colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"];
    const newParticles = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 2 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 8,
      shape: Math.random() > 0.5 ? "circle" : "square",
      rotation: Math.random() * 360,
    }));
    setParticles(newParticles);
  }, []);

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
      background: "linear-gradient(145deg, #1a0533 0%, #0d1f3c 40%, #0a2e1a 100%)",
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Bricolage+Grotesque:wght@700;800&display=swap');
        * { box-sizing: border-box; }

        @keyframes stampDrop {
          0%   { transform: scale(4) rotate(-30deg); opacity: 0; filter: blur(8px); }
          50%  { filter: blur(0px); }
          65%  { transform: scale(0.85) rotate(5deg); opacity: 1; }
          80%  { transform: scale(1.1) rotate(-3deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes ringPulse {
          0%   { transform: scale(0.6); opacity: 1; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        @keyframes confettiFall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 30px rgba(99,255,180,0.4), 0 0 60px rgba(99,255,180,0.15); }
          50%       { box-shadow: 0 0 60px rgba(99,255,180,0.7), 0 0 100px rgba(99,255,180,0.3); }
        }
        @keyframes greenPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.5), 0 4px 20px rgba(16,185,129,0.3); }
          50%       { box-shadow: 0 0 0 10px rgba(16,185,129,0), 0 4px 30px rgba(16,185,129,0.5); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50%       { transform: translateY(-10px) rotate(3deg); }
        }
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes starPop {
          0%   { transform: scale(0) rotate(-45deg); opacity: 0; }
          70%  { transform: scale(1.3) rotate(10deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes orb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(30px, -20px) scale(1.1); }
          66%       { transform: translate(-20px, 15px) scale(0.9); }
        }

        .stamp-icon { animation: stampDrop 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .ring1 { position: absolute; border-radius: 50%; border: 3px solid rgba(99,255,180,0.7); animation: ringPulse 1s ease-out 0.3s forwards; pointer-events: none; }
        .ring2 { position: absolute; border-radius: 50%; border: 2px solid rgba(99,255,180,0.4); animation: ringPulse 1.3s ease-out 0.6s forwards; pointer-events: none; }
        .ring3 { position: absolute; border-radius: 50%; border: 1.5px solid rgba(255,215,0,0.3); animation: ringPulse 1.6s ease-out 0.9s forwards; pointer-events: none; }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
        .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .float { animation: float 3s ease-in-out infinite; }
        .green-pulse-btn {
          background: #10B981;
          animation: greenPulse 2s ease-in-out infinite;
          color: #fff;
        }
        .green-pulse-btn:hover { background: #059669; }
        .settings-input {
          width: 100%;
          border: 1.5px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 15px;
          outline: none;
          font-family: inherit;
          color: #fff;
          background: rgba(255,255,255,0.06);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .settings-input:focus { border-color: #63FFB4; box-shadow: 0 0 0 3px rgba(99,255,180,0.1); }
        .settings-input::placeholder { color: rgba(255,255,255,0.3); }
        .card-bg {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(20px);
        }
      `}</style>

      {/* Animated background orbs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "10%", left: "15%", width: 300, height: 300, background: "radial-gradient(circle, rgba(99,255,180,0.15) 0%, transparent 70%)", animation: "orb 8s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "15%", right: "10%", width: 250, height: 250, background: "radial-gradient(circle, rgba(255,107,157,0.12) 0%, transparent 70%)", animation: "orb 11s ease-in-out infinite reverse" }} />
        <div style={{ position: "absolute", top: "50%", left: "60%", width: 200, height: 200, background: "radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 70%)", animation: "orb 9s ease-in-out 2s infinite" }} />
      </div>

      {/* Confetti */}
      {step === "stamp-anim" && particles.map(p => (
        <div key={p.id} style={{
          position: "fixed",
          left: `${p.x}%`,
          top: "-20px",
          width: p.size,
          height: p.size,
          background: p.color,
          borderRadius: p.shape === "circle" ? "50%" : "2px",
          transform: `rotate(${p.rotation}deg)`,
          animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
          pointerEvents: "none",
          zIndex: 100,
        }} />
      ))}

      {/* ── STEP 1: Stamp Animation ── */}
      {step === "stamp-anim" && (
        <div style={{ textAlign: "center", maxWidth: 360, width: "100%", position: "relative", zIndex: 1 }}>

          {/* Category background image strip */}
          <div style={{
            position: "relative",
            width: "100%",
            height: 120,
            borderRadius: 20,
            overflow: "hidden",
            marginBottom: 24,
          }}>
            <img
              src={CATEGORY_IMAGES[business.category] || CATEGORY_IMAGES.barbershop}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }}
            />
            {/* Dark overlay + business badge on top */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,22,18,0.6), rgba(10,22,18,0.2))" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 38, height: 38, background: "rgba(16,185,129,0.9)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{business.emoji}</div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{business.name}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Stempelkarte</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stamp animation circle */}
          <div style={{ position: "relative", width: 160, height: 160, margin: "0 auto 32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="ring1" style={{ width: 120, height: 120 }} />
            <div className="ring2" style={{ width: 120, height: 120 }} />
            <div className="ring3" style={{ width: 120, height: 120 }} />
            <div className="stamp-icon pulse-glow" style={{
              width: 110, height: 110,
              background: "linear-gradient(135deg, #63FFB4 0%, #10B981 100%)",
              borderRadius: 28,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 52, color: "#fff",
              fontWeight: 900,
            }}>
              ✓
            </div>
          </div>

          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 32, fontWeight: 800, color: "#fff", margin: "0 0 8px", lineHeight: 1.1 }}>
            Glückwunsch! 🎉
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", margin: "0 0 28px", lineHeight: 1.5 }}>
            Du hast einen Stempel bei <strong style={{ color: "#63FFB4" }}>{business.name}</strong> erhalten!
          </p>

          {/* Stamp card preview */}
          <div className="float" style={{
            background: "linear-gradient(135deg, rgba(99,255,180,0.12), rgba(16,185,129,0.06))",
            border: "1.5px solid rgba(99,255,180,0.3)",
            borderRadius: 20, padding: 20, marginBottom: 28,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>Deine Stempelkarte</div>
              <div style={{ fontSize: 11, color: "#63FFB4", fontWeight: 700 }}>{stampsCount}/{business.stamps_required}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(business.stamps_required, 4)}, 1fr)`, gap: 7, marginBottom: 14 }}>
              {Array.from({ length: business.stamps_required }).map((_, i) => (
                <div key={i} style={{
                  aspectRatio: "1/1",
                  background: i < stampsCount
                    ? "linear-gradient(135deg, #63FFB4, #10B981)"
                    : "rgba(255,255,255,0.06)",
                  borderRadius: 10,
                  border: i < stampsCount ? "none" : "1px solid rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, color: "#fff",
                  boxShadow: i === stampsCount - 1 ? "0 0 20px rgba(99,255,180,0.6)" : "none",
                }}>
                  {i < stampsCount ? "✓" : ""}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <span style={{ fontSize: 16 }}>🎁</span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Prämie: <strong style={{ color: "#FFD700" }}>{business.reward_description}</strong></span>
            </div>
          </div>

          {animDone && (
            <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                className="green-pulse-btn"
                onClick={() => setStep("register-prompt")}
                style={{ width: "100%", padding: "15px", fontWeight: 800, fontSize: 15, borderRadius: 14, border: "none", cursor: "pointer", fontFamily: "inherit", letterSpacing: 0.3 }}
              >
                ✅ Stempel sichern
              </button>
              <button
                onClick={() => setStep("register-prompt")}
                style={{ width: "100%", padding: "11px", background: "transparent", color: "rgba(255,255,255,0.35)", fontWeight: 500, fontSize: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", fontFamily: "inherit" }}
              >
                ⚠️ Ohne Registrierung (Stempel geht verloren)
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── STEP 2: Register Prompt ── */}
      {step === "register-prompt" && (
        <div className="fade-up card-bg" style={{ maxWidth: 360, width: "100%", borderRadius: 24, padding: 28, position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 40, marginBottom: 12, animation: "bounce 1.5s ease-in-out infinite" }}>📲</div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 24, fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>Stempel sichern</h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.6 }}>
              Registriere dich kurz und dein Stempel bei <strong style={{ color: "#63FFB4" }}>{business.name}</strong> ist für immer gespeichert.
            </p>
          </div>

          <div style={{ background: "rgba(99,255,180,0.06)", border: "1px solid rgba(99,255,180,0.15)", borderRadius: 14, padding: 16, marginBottom: 22 }}>
            {[
              { icon: "🎯", text: "Stempel gehen nie verloren" },
              { icon: "🎁", text: `Prämie nach ${business.stamps_required} Stempeln: ${business.reward_description}` },
              { icon: "📣", text: "Freunde einladen & Geld verdienen" },
            ].map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < 2 ? 10 : 0 }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{b.icon}</span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.4 }}>{b.text}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input type="text" className="settings-input" placeholder="Dein Name" value={name} onChange={e => setName(e.target.value)} required autoFocus />
            <input type="email" className="settings-input" placeholder="E-Mail Adresse" value={email} onChange={e => setEmail(e.target.value)} required />
            <button
              type="submit"
              disabled={submitted}
              className="green-pulse-btn"
              style={{ padding: "15px", fontWeight: 800, fontSize: 15, borderRadius: 14, border: "none", cursor: submitted ? "not-allowed" : "pointer", fontFamily: "inherit", marginTop: 4, opacity: submitted ? 0.7 : 1 }}
            >
              {submitted ? "Wird gespeichert…" : "Stempel jetzt sichern →"}
            </button>
            <button type="button" onClick={() => window.close()} style={{ padding: "10px", background: "transparent", color: "rgba(255,255,255,0.25)", fontWeight: 500, fontSize: 12, borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit" }}>
              Nein danke, Stempel geht verloren
            </button>
          </form>
        </div>
      )}

      {/* ── STEP 3: Registered ── */}
      {step === "registered" && (
        <div className="fade-up" style={{ maxWidth: 360, width: "100%", textAlign: "center", position: "relative", zIndex: 1 }}>
          {/* Confetti again */}
          {particles.slice(0, 25).map(p => (
            <div key={p.id} style={{
              position: "fixed",
              left: `${p.x}%`,
              top: "-20px",
              width: p.size,
              height: p.size,
              background: p.color,
              borderRadius: p.shape === "circle" ? "50%" : "2px",
              animation: `confettiFall ${p.duration}s ease-in ${p.delay * 0.3}s forwards`,
              pointerEvents: "none",
              zIndex: 100,
            }} />
          ))}

          <div style={{ width: 90, height: 90, background: "linear-gradient(135deg, #FFD700, #FF6B6B)", borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 44, animation: "bounce 1.2s ease-in-out infinite", boxShadow: "0 0 40px rgba(255,215,0,0.4)" }}>
            🎉
          </div>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 28, fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>
            Willkommen, {name}!
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", marginBottom: 28, lineHeight: 1.6 }}>
            Dein Stempel ist gesichert 🔒<br/>
            Bestätigung geht an <strong style={{ color: "#63FFB4" }}>{email}</strong>
          </p>

          {/* Stamp card */}
          <div className="float" style={{ background: "linear-gradient(135deg, rgba(99,255,180,0.12), rgba(16,185,129,0.05))", border: "1.5px solid rgba(99,255,180,0.3)", borderRadius: 20, padding: 20, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>Stempelkarte · {business.name}</div>
              <div style={{ fontSize: 11, color: "#63FFB4", fontWeight: 700 }}>{stampsCount}/{business.stamps_required}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(business.stamps_required, 4)}, 1fr)`, gap: 7, marginBottom: 14 }}>
              {Array.from({ length: business.stamps_required }).map((_, i) => (
                <div key={i} style={{
                  aspectRatio: "1/1",
                  background: i < stampsCount ? "linear-gradient(135deg, #63FFB4, #10B981)" : "rgba(255,255,255,0.06)",
                  borderRadius: 10,
                  border: i < stampsCount ? "none" : "1px solid rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, color: "#fff",
                  boxShadow: i < stampsCount ? "0 0 12px rgba(99,255,180,0.5)" : "none",
                }}>
                  {i < stampsCount ? "✓" : ""}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center" }}>
              Noch <strong style={{ color: "#FFD700" }}>{business.stamps_required - stampsCount} Stempel</strong> bis zur Prämie: {business.reward_description}
            </div>
          </div>

          {/* Referral */}
          <div style={{ background: "rgba(255,215,0,0.07)", border: "1px solid rgba(255,215,0,0.2)", borderRadius: 14, padding: 16, marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>💰 Dein Empfehlungslink</div>
            <div style={{ fontSize: 12, color: "#FFD700", fontWeight: 700, fontFamily: "monospace", marginBottom: 6 }}>
              sensalie.app/ref/{name.toLowerCase().replace(/\s+/g, "")}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Teile ihn & kassiere Provision für jede Empfehlung</div>
          </div>

          <button onClick={() => window.location.href = "/"} style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", fontWeight: 600, fontSize: 13, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", fontFamily: "inherit" }}>
            Zur Startseite
          </button>
        </div>
      )}
    </div>
  );
}