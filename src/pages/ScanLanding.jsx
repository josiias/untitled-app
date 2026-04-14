import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const MOCK_BUSINESS = {
  id: "demo-kings-barbershop-001",
  name: "Kings Barbershop",
  stamps_required: 8,
  min_purchase_amount: 20,
  reward_description: "10€ Gutschein",
  emoji: "✂️",
  category: "barbershop",
  bg_images: [
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80",
    "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&q=80",
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
  ],
};

export default function ScanLanding() {
  const { businessId } = useParams();
  const [step, setStep] = useState("phone"); // phone → stamp-anim → saved
  const [phone, setPhone] = useState("");
  const [animDone, setAnimDone] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [particles, setParticles] = useState([]);

  const business = MOCK_BUSINESS;
  const stampsCount = 1; // newly earned stamp (demo)

  // Cycle background images
  useEffect(() => {
    if (!business.bg_images?.length) return;
    const interval = setInterval(() => {
      setBgIndex(i => (i + 1) % business.bg_images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Confetti particles
  useEffect(() => {
    const colors = ["#63FFB4", "#FFD700", "#4ECDC4", "#96CEB4", "#63FFB4", "#A8EDEA"];
    setParticles(Array.from({ length: 35 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 1.2,
      duration: 2 + Math.random() * 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 5 + Math.random() * 7,
      shape: Math.random() > 0.5 ? "circle" : "square",
    })));
  }, []);

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (phone.length < 6) return;
    setStep("stamp-anim");
    setTimeout(() => setAnimDone(true), 1800);
  };

  return (
    <div style={{
      minHeight: "100vh",
      fontFamily: "'Inter', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      position: "relative",
      overflow: "hidden",
      background: "#050f09",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Bricolage+Grotesque:wght@700;800&display=swap');
        * { box-sizing: border-box; }

        @keyframes bgFade {
          0%, 100% { opacity: 0; }
          15%, 85% { opacity: 1; }
        }
        @keyframes stampDrop {
          0%   { transform: scale(4) rotate(-20deg); opacity: 0; filter: blur(10px); }
          60%  { transform: scale(0.88) rotate(4deg); opacity: 1; filter: blur(0); }
          80%  { transform: scale(1.07) rotate(-2deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes ringPulse {
          0%   { transform: scale(0.6); opacity: 0.9; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        @keyframes confettiFall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(540deg); opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 30px rgba(99,255,180,0.5), 0 0 70px rgba(99,255,180,0.15); }
          50%       { box-shadow: 0 0 60px rgba(99,255,180,0.9), 0 0 120px rgba(99,255,180,0.3); }
        }
        @keyframes neonPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(99,255,180,0.3); border-color: rgba(99,255,180,0.5); }
          50%       { box-shadow: 0 0 40px rgba(99,255,180,0.6); border-color: rgba(99,255,180,0.9); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes shimmerGreen {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translate(0,0) scale(1); }
          33%  { transform: translate(20px,-15px) scale(1.05); }
          66%  { transform: translate(-15px,10px) scale(0.97); }
        }
        @keyframes stampCellPop {
          0%   { transform: scale(0); opacity: 0; }
          70%  { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }

        .stamp-icon { animation: stampDrop 0.75s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .ring { position: absolute; border-radius: 50%; animation: ringPulse 1.2s ease-out forwards; pointer-events: none; }
        .fade-up { animation: fadeUp 0.45s ease forwards; }
        .pulse-glow { animation: pulseGlow 2.5s ease-in-out infinite; }
        .float-anim { animation: float 3.5s ease-in-out infinite; }
        .neon-border { animation: neonPulse 2s ease-in-out infinite; }
        .green-btn {
          background: linear-gradient(90deg, #1aff8c 0%, #00e676 40%, #63FFB4 80%, #1aff8c 100%);
          background-size: 200% auto;
          animation: shimmerGreen 2.5s linear infinite;
          color: #050f09;
          font-weight: 800;
        }
        .phone-input {
          width: 100%;
          background: rgba(99,255,180,0.04);
          border: 1.5px solid rgba(99,255,180,0.3);
          border-radius: 14px;
          padding: 16px 18px;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 2px;
          color: #fff;
          outline: none;
          font-family: inherit;
          text-align: center;
          transition: all 0.2s;
        }
        .phone-input:focus {
          border-color: #63FFB4;
          box-shadow: 0 0 0 3px rgba(99,255,180,0.12), 0 0 20px rgba(99,255,180,0.15);
          background: rgba(99,255,180,0.06);
        }
        .phone-input::placeholder { color: rgba(255,255,255,0.2); font-size: 18px; letter-spacing: 1px; font-weight: 400; }
      `}</style>

      {/* ── Background Images (slow crossfade) ── */}
      {business.bg_images?.map((src, i) => (
        <div key={i} style={{
          position: "fixed", inset: 0, zIndex: 0,
          backgroundImage: `url(${src})`,
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: i === bgIndex ? 1 : 0,
          transition: "opacity 1.5s ease-in-out",
        }} />
      ))}
      {/* Dark overlay */}
      <div style={{ position: "fixed", inset: 0, zIndex: 1, background: "linear-gradient(160deg, rgba(5,15,9,0.92) 0%, rgba(5,15,9,0.88) 50%, rgba(5,15,9,0.95) 100%)" }} />
      {/* Green glow top */}
      <div style={{ position: "fixed", top: -60, left: "50%", transform: "translateX(-50%)", width: 600, height: 300, background: "radial-gradient(ellipse, rgba(99,255,180,0.12) 0%, transparent 70%)", zIndex: 2, pointerEvents: "none", animation: "orbFloat 10s ease-in-out infinite" }} />

      {/* ── STEP 1: Phone Input ── */}
      {step === "phone" && (
        <div style={{ textAlign: "center", maxWidth: 340, width: "100%", position: "relative", zIndex: 10 }}>
          {/* Business badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(99,255,180,0.06)", border: "1px solid rgba(99,255,180,0.2)", borderRadius: 100, padding: "8px 18px 8px 10px", marginBottom: 40 }}>
            <div style={{ width: 34, height: 34, background: "linear-gradient(135deg, #63FFB4, #10B981)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>{business.emoji}</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{business.name}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Stempelkarte</div>
            </div>
          </div>

          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 30, fontWeight: 800, color: "#fff", margin: "0 0 8px", lineHeight: 1.1 }}>
            Stempel sammeln ✂️
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", margin: "0 0 36px", lineHeight: 1.6 }}>
            Gib einfach deine Handynummer ein –<br />ein Klick und du bist dabei!
          </p>

          <form onSubmit={handlePhoneSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input
              type="tel"
              inputMode="numeric"
              className="phone-input neon-border"
              placeholder="0151 234 567 89"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              disabled={phone.length < 6}
              className="green-btn"
              style={{
                width: "100%", padding: "15px",
                fontSize: 15, borderRadius: 14, border: "none",
                cursor: phone.length < 6 ? "not-allowed" : "pointer",
                fontFamily: "inherit", letterSpacing: 0.3,
                opacity: phone.length < 6 ? 0.5 : 1,
                transition: "opacity 0.2s",
              }}
            >
              Stempel holen →
            </button>
          </form>

          <p style={{ marginTop: 20, fontSize: 11, color: "rgba(255,255,255,0.25)", lineHeight: 1.6 }}>
            Kein Passwort, keine App nötig.<br />Deine Nummer bleibt privat.
          </p>

          {/* Stamp preview card */}
          <div className="float-anim" style={{ marginTop: 36, position: "relative", overflow: "hidden", background: "rgba(99,255,180,0.05)", border: "1px solid rgba(99,255,180,0.15)", borderRadius: 18, padding: 18 }}>
            {/* Barbershop bg inside card */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${business.bg_images[bgIndex]})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.08, transition: "opacity 1.5s ease-in-out", borderRadius: 18 }} />
            <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>So sieht deine Karte aus</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 12 }}>
              {Array.from({ length: business.stamps_required }).map((_, i) => (
                <div key={i} style={{
                  aspectRatio: "1/1",
                  background: i === 0 ? "linear-gradient(135deg, #63FFB4, #10B981)" : "rgba(255,255,255,0.05)",
                  borderRadius: 9,
                  border: i === 0 ? "none" : "1px solid rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, color: "#fff",
                  boxShadow: i === 0 ? "0 0 14px rgba(99,255,180,0.5)" : "none",
                }}>
                  {i === 0 ? "✓" : ""}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textAlign: "center" }}>
              🎁 Prämie: <span style={{ color: "#63FFB4", fontWeight: 600 }}>{business.reward_description}</span> nach {business.stamps_required} Stempeln
            </div>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 2: Stamp Animation ── */}
      {step === "stamp-anim" && (
        <div style={{ textAlign: "center", maxWidth: 340, width: "100%", position: "relative", zIndex: 10 }}>
          {/* Confetti */}
          {particles.map(p => (
            <div key={p.id} style={{
              position: "fixed",
              left: `${p.x}%`, top: "-20px",
              width: p.size, height: p.size,
              background: p.color,
              borderRadius: p.shape === "circle" ? "50%" : "2px",
              animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
              pointerEvents: "none", zIndex: 200,
            }} />
          ))}

          {/* Business badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(99,255,180,0.06)", border: "1px solid rgba(99,255,180,0.2)", borderRadius: 100, padding: "8px 18px 8px 10px", marginBottom: 36 }}>
            <div style={{ width: 34, height: 34, background: "linear-gradient(135deg, #63FFB4, #10B981)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>{business.emoji}</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{business.name}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Stempelkarte</div>
            </div>
          </div>

          {/* Big stamp */}
          <div style={{ position: "relative", width: 160, height: 160, margin: "0 auto 30px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="ring" style={{ width: 120, height: 120, border: "3px solid rgba(99,255,180,0.7)", animationDelay: "0.3s" }} />
            <div className="ring" style={{ width: 120, height: 120, border: "2px solid rgba(99,255,180,0.4)", animationDelay: "0.7s", animationDuration: "1.4s" }} />
            <div className="ring" style={{ width: 120, height: 120, border: "1.5px solid rgba(99,255,180,0.2)", animationDelay: "1.1s", animationDuration: "1.7s" }} />
            <div className="stamp-icon pulse-glow" style={{
              width: 110, height: 110,
              background: "linear-gradient(135deg, #1aff8c 0%, #10B981 100%)",
              borderRadius: 26,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 54, color: "#050f09", fontWeight: 900,
            }}>
              ✓
            </div>
          </div>

          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 32, fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>
            Glückwunsch! 🎉
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", margin: "0 0 30px", lineHeight: 1.5 }}>
            Stempel #1 ist gespeichert für <strong style={{ color: "#63FFB4" }}>{phone}</strong>
          </p>

          {/* Stamp card */}
          <div className="float-anim" style={{ background: "rgba(99,255,180,0.06)", border: "1.5px solid rgba(99,255,180,0.25)", borderRadius: 18, padding: 20, marginBottom: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1 }}>Deine Stempelkarte</span>
              <span style={{ fontSize: 11, color: "#63FFB4", fontWeight: 700 }}>{stampsCount}/{business.stamps_required}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 7, marginBottom: 12 }}>
              {Array.from({ length: business.stamps_required }).map((_, i) => (
                <div key={i} style={{
                  aspectRatio: "1/1",
                  background: i < stampsCount ? "linear-gradient(135deg, #1aff8c, #10B981)" : "rgba(255,255,255,0.05)",
                  borderRadius: 9,
                  border: i < stampsCount ? "none" : "1px solid rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 15, color: "#050f09",
                  boxShadow: i === stampsCount - 1 ? "0 0 18px rgba(99,255,180,0.6)" : "none",
                  animation: i < stampsCount ? `stampCellPop 0.4s ease ${i * 0.1}s both` : "none",
                }}>
                  {i < stampsCount ? "✓" : ""}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center" }}>
              🎁 <span style={{ color: "#FFD700", fontWeight: 600 }}>{business.stamps_required - stampsCount} Stempel</span> bis zur Prämie: {business.reward_description}
            </div>
          </div>

          {animDone && (
            <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                className="green-btn"
                onClick={() => setStep("saved")}
                style={{ width: "100%", padding: "15px", fontSize: 15, borderRadius: 14, border: "none", cursor: "pointer", fontFamily: "inherit" }}
              >
                Meine Karte anzeigen →
              </button>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", margin: 0 }}>
                Beim nächsten Besuch einfach wieder deine Nummer eingeben ✓
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── STEP 3: Saved / Mini Dashboard ── */}
      {step === "saved" && (
        <div className="fade-up" style={{ maxWidth: 340, width: "100%", textAlign: "center", position: "relative", zIndex: 10 }}>
          <div style={{ width: 80, height: 80, background: "linear-gradient(135deg, #1aff8c, #10B981)", borderRadius: 22, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", fontSize: 40, animation: "bounce 1.5s ease-in-out infinite", boxShadow: "0 0 40px rgba(99,255,180,0.4)" }}>
            ✂️
          </div>
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 26, fontWeight: 800, color: "#fff", margin: "0 0 6px" }}>
            {business.name}
          </h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 28 }}>
            Deine Stempelkarte • {phone}
          </p>

          <div className="float-anim" style={{ background: "rgba(99,255,180,0.06)", border: "1.5px solid rgba(99,255,180,0.25)", borderRadius: 20, padding: 22, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1 }}>Stempelkarte</span>
              <span style={{ fontSize: 11, color: "#63FFB4", fontWeight: 700 }}>{stampsCount}/{business.stamps_required}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 7, marginBottom: 14 }}>
              {Array.from({ length: business.stamps_required }).map((_, i) => (
                <div key={i} style={{
                  aspectRatio: "1/1",
                  background: i < stampsCount ? "linear-gradient(135deg, #1aff8c, #10B981)" : "rgba(255,255,255,0.05)",
                  borderRadius: 9,
                  border: i < stampsCount ? "none" : "1px solid rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 15, color: "#050f09",
                  boxShadow: i < stampsCount ? "0 0 12px rgba(99,255,180,0.5)" : "none",
                }}>
                  {i < stampsCount ? "✓" : ""}
                </div>
              ))}
            </div>
            {/* Progress bar */}
            <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden", marginBottom: 10 }}>
              <div style={{ height: "100%", width: `${(stampsCount / business.stamps_required) * 100}%`, background: "linear-gradient(90deg, #1aff8c, #63FFB4)", borderRadius: 99, transition: "width 1s ease" }} />
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center" }}>
              Noch <strong style={{ color: "#FFD700" }}>{business.stamps_required - stampsCount}</strong> bis zur Prämie: <span style={{ color: "#63FFB4" }}>{business.reward_description}</span>
            </div>
          </div>

          {/* Referral */}
          <div style={{ background: "rgba(255,215,0,0.06)", border: "1px solid rgba(255,215,0,0.15)", borderRadius: 14, padding: 14, marginBottom: 20, textAlign: "left" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#FFD700", marginBottom: 4 }}>💰 Freunde einladen</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
              Empfehle {business.name} und kassiere automatisch Provision für jeden Freund.
            </div>
          </div>

          <button onClick={() => setStep("phone")} style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", fontWeight: 600, fontSize: 13, borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", fontFamily: "inherit" }}>
            ← Zurück
          </button>
        </div>
      )}
    </div>
  );
}