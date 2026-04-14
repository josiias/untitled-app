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
  massage: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
  nails: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80",
  fitness: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
  beauty: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
};

// All category images for the slideshow teaser
const ALL_CATEGORY_IMAGES = Object.values(CATEGORY_IMAGES);

export default function ScanLanding() {
  const { businessId } = useParams();
  const [step, setStep] = useState("stamp-anim");
  const [stampsCount] = useState(1);
  const [animDone, setAnimDone] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [particles, setParticles] = useState([]);
  const [imgIndex, setImgIndex] = useState(0);

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

  // Slideshow: cycle through ALL category images every 3s
  useEffect(() => {
    const t = setInterval(() => setImgIndex(i => (i + 1) % ALL_CATEGORY_IMAGES.length), 3000);
    return () => clearInterval(t);
  }, []);

  const handleRegister = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setStep("registered"), 600);
  };

  const refCode = phone.replace(/\s+/g, "").slice(-6) || "user";

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
          0%   { transform: scale(1.6) rotate(-8deg); opacity: 0; filter: blur(4px); }
          60%  { filter: blur(0px); transform: scale(0.95) rotate(2deg); opacity: 1; }
          80%  { transform: scale(1.03) rotate(-1deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes ringPulse {
          0%   { transform: scale(0.7); opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
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
        @keyframes giftFloat {
          0%, 100% { transform: translateY(0px) rotate(-4deg) scale(1); }
          50%       { transform: translateY(-6px) rotate(4deg) scale(1.08); }
        }
        .gift-float { animation: giftFloat 2.2s ease-in-out infinite; display: inline-block; }
        @keyframes imgFadeIn {
          from { opacity: 0; }
          to   { opacity: 0.5; }
        }
        .slide-img { animation: imgFadeIn 0.8s ease forwards; }
        @keyframes orb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(30px, -20px) scale(1.1); }
          66%       { transform: translate(-20px, 15px) scale(0.9); }
        }

        .stamp-icon { animation: stampDrop 1.1s cubic-bezier(0.25,0.8,0.25,1) forwards; }
        .ring1 { position: absolute; border-radius: 50%; border: 2px solid rgba(99,255,180,0.5); animation: ringPulse 1.4s ease-out 0.5s forwards; pointer-events: none; }
        .ring2 { position: absolute; border-radius: 50%; border: 1.5px solid rgba(99,255,180,0.3); animation: ringPulse 1.8s ease-out 0.9s forwards; pointer-events: none; }
        .ring3 { position: absolute; border-radius: 50%; border: 1px solid rgba(255,215,0,0.2); animation: ringPulse 2.2s ease-out 1.2s forwards; pointer-events: none; }
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
        <div style={{ textAlign: "center", maxWidth: 420, width: "100%", position: "relative", zIndex: 1, marginTop: -20 }}>

          {/* Slideshow banner — full width, no emojis */}
          <div style={{ position: "relative", width: "100%", height: 120, borderRadius: 20, overflow: "hidden", marginBottom: 12 }}>
            {ALL_CATEGORY_IMAGES.map((src, i) => (
              <img
                key={src}
                src={src}
                alt=""
                style={{
                  position: "absolute", inset: 0, width: "100%", height: "100%",
                  objectFit: "cover", opacity: i === imgIndex ? 0.55 : 0,
                  transition: "opacity 1.4s ease",
                }}
              />
            ))}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,22,18,0.3) 0%, rgba(10,22,18,0.65) 100%)" }} />
            {/* Business name overlay — bottom left with emoji */}
            <div style={{ position: "absolute", bottom: 12, left: 16, display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 28, height: 28, background: "rgba(16,185,129,0.85)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, backdropFilter: "blur(4px)" }}>{business.emoji}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{business.name}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>Stempelkarte aktiv</div>
              </div>
            </div>
            {/* Dot indicators bottom right */}
            <div style={{ position: "absolute", bottom: 14, right: 14, display: "flex", gap: 4 }}>
              {ALL_CATEGORY_IMAGES.map((_, i) => (
                <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: i === imgIndex ? "#10B981" : "rgba(255,255,255,0.3)", transition: "background 0.6s" }} />
              ))}
            </div>
          </div>

          {/* Small pulsing rings — no big stamp block */}
          <div style={{ position: "relative", width: 60, height: 60, margin: "0 auto 6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="ring1" style={{ width: 44, height: 44 }} />
            <div className="ring2" style={{ width: 44, height: 44 }} />
            <div className="stamp-icon pulse-glow" style={{
              width: 40, height: 40,
              background: "linear-gradient(135deg, #63FFB4 0%, #10B981 100%)",
              borderRadius: 12,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, color: "#fff", fontWeight: 900,
            }}>
              ✓
            </div>
          </div>

          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 800, color: "#fff", margin: "0 0 3px", lineHeight: 1.1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            Glückwunsch! 🎉
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: "0 0 10px", lineHeight: 1.5 }}>
            Du hast einen Stempel bei <strong style={{ color: "#63FFB4" }}>{business.name}</strong> erhalten!
          </p>

          {/* Stamp card preview */}
          <div style={{
            background: "linear-gradient(135deg, rgba(99,255,180,0.12), rgba(16,185,129,0.06))",
            border: "1.5px solid rgba(99,255,180,0.3)",
            borderRadius: 16, padding: "10px 12px", marginBottom: 14,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>Deine Stempelkarte</div>
              <div style={{ fontSize: 10, color: "#63FFB4", fontWeight: 700 }}>{stampsCount}/{business.stamps_required}</div>
            </div>
            {/* Grid with max-width to make cells ~5% smaller */}
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(business.stamps_required, 4)}, 1fr)`, gap: 4, marginBottom: 10, maxWidth: "95%", margin: "0 auto 10px" }}>
              {Array.from({ length: business.stamps_required }).map((_, i) => (
                <div key={i} style={{
                  aspectRatio: "1/1",
                  background: i < stampsCount ? "linear-gradient(135deg, #63FFB4, #10B981)" : "rgba(255,255,255,0.06)",
                  borderRadius: 7,
                  border: i < stampsCount ? "none" : "1px solid rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, color: "#fff",
                  boxShadow: i === stampsCount - 1 ? "0 0 14px rgba(99,255,180,0.6)" : "none",
                }}>
                  {i < stampsCount ? "✓" : ""}
                </div>
              ))}
            </div>
            {/* Reward — bigger, prominent with floating gift emoji */}
            <div style={{ textAlign: "center", paddingTop: 6, borderTop: "1px solid rgba(99,255,180,0.15)" }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 2 }}>Prämie nach {business.stamps_required} Stempeln</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#FFD700", letterSpacing: 0.3 }}>
                <span className="gift-float">🎁</span> {business.reward_description}
              </div>
            </div>
          </div>

          {animDone && (
            <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button
                className="green-pulse-btn"
                onClick={() => setStep("register-prompt")}
                style={{ width: "100%", padding: "14px", fontWeight: 800, fontSize: 15, borderRadius: 14, border: "none", cursor: "pointer", fontFamily: "inherit", letterSpacing: 0.3 }}
              >
                ✅ Stempel sichern
              </button>
              <button
                onClick={() => setStep("register-prompt")}
                style={{ width: "100%", padding: "10px", background: "transparent", color: "rgba(255,255,255,0.35)", fontWeight: 500, fontSize: 11, borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", fontFamily: "inherit" }}
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
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 40, marginBottom: 10, animation: "bounce 1.5s ease-in-out infinite" }}>📲</div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 24, fontWeight: 800, color: "#fff", margin: "0 0 6px" }}>Stempel sichern</h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.6 }}>
              Nur deine Handynummer – fertig.<br/>
              Dein Stempel bei <strong style={{ color: "#63FFB4" }}>{business.name}</strong> ist für immer gespeichert.
            </p>
          </div>

          <div style={{ background: "rgba(99,255,180,0.06)", border: "1px solid rgba(99,255,180,0.15)", borderRadius: 14, padding: 14, marginBottom: 20 }}>
            {[
              { icon: "🎯", text: "Stempel gehen nie verloren" },
              { icon: "🎁", text: `Prämie nach ${business.stamps_required} Stempeln: ${business.reward_description}` },
              { icon: "💸", text: "Empfehle weiter & verdiene bis zu 100€" },
            ].map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < 2 ? 10 : 0 }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{b.icon}</span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.4 }}>{b.text}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="tel"
              inputMode="numeric"
              className="settings-input"
              placeholder="📱 Deine Handynummer"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
              autoFocus
            />
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
          {/* Confetti */}
          {particles.slice(0, 25).map(p => (
            <div key={p.id} style={{
              position: "fixed", left: `${p.x}%`, top: "-20px",
              width: p.size, height: p.size, background: p.color,
              borderRadius: p.shape === "circle" ? "50%" : "2px",
              animation: `confettiFall ${p.duration}s ease-in ${p.delay * 0.3}s forwards`,
              pointerEvents: "none", zIndex: 100,
            }} />
          ))}

          {/* Happy people banner — compact */}
          <div style={{ position: "relative", width: "100%", height: 90, borderRadius: 16, overflow: "hidden", marginBottom: 20 }}>
            <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,22,18,0.2) 0%, rgba(10,22,18,0.65) 100%)" }} />
            <div style={{ position: "absolute", bottom: 10, left: 0, right: 0, fontSize: 11, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>
              ✨ Tausende glückliche Kunden nutzen Sensalie
            </div>
          </div>

          {/* Header row — icon + title inline */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 4 }}>
            <div style={{ fontSize: 28, animation: "bounce 1.2s ease-in-out infinite" }}>🎉</div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 800, color: "#fff", margin: 0 }}>
              Willkommen bei Sensalie!
            </h2>
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 20, lineHeight: 1.5 }}>
            Stempel bei <strong style={{ color: "#63FFB4" }}>{business.name}</strong> gesichert 🔒
          </p>

          {/* Optional name input */}
          {!name && (
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "16px 18px", marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Wie heißt du? <span style={{ color: "rgba(255,255,255,0.25)" }}>(optional)</span></div>
              <div style={{ display: "flex", gap: 7 }}>
                <input type="text" className="settings-input" placeholder="Dein Name" value={name} onChange={e => setName(e.target.value)} style={{ flex: 1, padding: "9px 12px", fontSize: 13 }} />
                <button onClick={() => {}} style={{ padding: "9px 14px", background: "#10B981", color: "#fff", fontWeight: 700, fontSize: 12, borderRadius: 9, border: "none", cursor: "pointer", fontFamily: "inherit" }}>✓</button>
              </div>
              <button onClick={() => setName("Gast")} style={{ marginTop: 6, padding: "4px", background: "transparent", color: "rgba(255,255,255,0.2)", fontSize: 10, border: "none", cursor: "pointer", fontFamily: "inherit" }}>Später</button>
            </div>
          )}



          {/* Referral — slim info banner only */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(37,211,102,0.08)", border: "1px solid rgba(37,211,102,0.2)", borderRadius: 12, padding: "14px 16px", marginBottom: 20, textAlign: "left" }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>💸</span>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.4 }}>
              Bei Sensalie kannst du dein Lieblingsunternehmen empfehlen und bis zu <strong style={{ color: "#25D366" }}>100€</strong> pro Empfehlung verdienen.
            </div>
          </div>

          <button onClick={() => window.location.href = "/"} style={{ width: "100%", padding: "11px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.45)", fontWeight: 600, fontSize: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", fontFamily: "inherit" }}>
            Zur Startseite
          </button>

          {/* Sensalie Branding Footer */}
          <div style={{ marginTop: 64, textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
              <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 800, color: "#fff", letterSpacing: 0.3 }}>Sensalie</span>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 8px rgba(16,185,129,0.8)" }} />
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", lineHeight: 1.5 }}>
              Deine digitale Kundenkarte — sicher, einfach &amp; überall dabei.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}