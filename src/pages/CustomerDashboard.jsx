import React, { useState } from "react";

// Mock data – später aus Entities geladen
const MOCK_CUSTOMER = {
  phone: "0151 234 567 89",
  name: null, // noch kein Name eingetragen
  referral_code: "KINGSREF42",
  total_stamps: 3,
  total_visits: 3,
  provision_earned: 0,
};

const MOCK_BUSINESSES = [
  {
    id: "demo-kings-barbershop-001",
    name: "Kings Barbershop",
    emoji: "✂️",
    stamps_required: 8,
    reward_description: "10€ Gutschein",
    stamps_collected: 3,
    bg_image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80",
  },
];

const MOCK_ACTIVITY = [
  { icon: "✂️", text: "Stempel erhalten – Kings Barbershop", time: "Heute, 14:32" },
  { icon: "✂️", text: "Stempel erhalten – Kings Barbershop", time: "12.04.2026" },
  { icon: "✂️", text: "Stempel erhalten – Kings Barbershop", time: "08.04.2026" },
];

export default function CustomerDashboard() {
  const [customer, setCustomer] = useState(MOCK_CUSTOMER);
  const [editingName, setEditingName] = useState(!MOCK_CUSTOMER.name);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("karten"); // karten | aktivität | empfehlungen

  const biz = MOCK_BUSINESSES[0];
  const progress = (biz.stamps_collected / biz.stamps_required) * 100;

  const saveProfile = (e) => {
    e.preventDefault();
    setCustomer({ ...customer, name: nameInput });
    setEditingName(false);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const copyReferral = () => {
    navigator.clipboard.writeText(`https://sensalie.app/ref/${customer.referral_code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#050f09",
      fontFamily: "'Inter', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Bricolage+Grotesque:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(99,255,180,0.3); }
          50%       { box-shadow: 0 0 50px rgba(99,255,180,0.6); }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translate(0,0); }
          50%       { transform: translate(15px,-10px); }
        }
        @keyframes shimmerGreen {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes progressFill {
          from { width: 0%; }
          to   { width: ${progress}%; }
        }
        .green-btn {
          background: linear-gradient(90deg, #1aff8c 0%, #00e676 40%, #63FFB4 80%, #1aff8c 100%);
          background-size: 200% auto;
          animation: shimmerGreen 2.5s linear infinite;
          color: #050f09;
          font-weight: 800;
        }
        .tab-btn {
          flex: 1;
          padding: 10px;
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.4);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          font-family: inherit;
          transition: all 0.2s;
        }
        .tab-btn.active {
          color: #63FFB4;
          border-bottom-color: #63FFB4;
        }
        .settings-input {
          width: 100%;
          border: 1.5px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 15px;
          outline: none;
          font-family: inherit;
          color: #fff;
          background: rgba(255,255,255,0.05);
          transition: border-color 0.2s;
        }
        .settings-input:focus { border-color: #63FFB4; }
        .settings-input::placeholder { color: rgba(255,255,255,0.25); }
        .card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 20px; }
        .fade-in { animation: fadeIn 0.4s ease forwards; }
      `}</style>

      {/* Background orbs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: 500, height: 300, background: "radial-gradient(ellipse, rgba(99,255,180,0.1) 0%, transparent 70%)", animation: "orbFloat 10s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "-5%", width: 300, height: 300, background: "radial-gradient(circle, rgba(99,255,180,0.06) 0%, transparent 70%)", animation: "orbFloat 14s ease-in-out reverse infinite" }} />
      </div>

      {/* Business background image (very subtle) */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: `url(${biz.bg_image})`,
        backgroundSize: "cover", backgroundPosition: "center",
        opacity: 0.04,
      }} />

      {/* ── Header ── */}
      <div style={{ position: "relative", zIndex: 10, background: "rgba(5,15,9,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(99,255,180,0.1)", padding: "0 20px" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #1aff8c, #10B981)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, animation: "pulseGlow 2.5s ease-in-out infinite" }}>
              🃏
            </div>
            <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 17, fontWeight: 800, color: "#fff" }}>
              Stempelkarten
            </span>
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>
            {customer.name || customer.phone}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 20px 60px", position: "relative", zIndex: 10 }}>

        {/* ── Name prompt (if no name yet) ── */}
        {editingName && (
          <div className="fade-in card" style={{ marginBottom: 20, borderColor: "rgba(99,255,180,0.2)" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>👋 Wie heißt du?</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>Optional – macht's persönlicher</div>
            <form onSubmit={saveProfile} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input className="settings-input" placeholder="Dein Name (optional)" value={nameInput} onChange={e => setNameInput(e.target.value)} />
              <input className="settings-input" type="email" placeholder="E-Mail (optional)" value={emailInput} onChange={e => setEmailInput(e.target.value)} />
              <div style={{ display: "flex", gap: 8 }}>
                <button type="submit" className="green-btn" style={{ flex: 1, padding: "11px", fontSize: 13, borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                  {profileSaved ? "✓ Gespeichert!" : "Speichern"}
                </button>
                <button type="button" onClick={() => setEditingName(false)} style={{ padding: "11px 16px", background: "transparent", color: "rgba(255,255,255,0.35)", fontSize: 13, borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", fontFamily: "inherit" }}>
                  Überspringen
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Tabs ── */}
        <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 20 }}>
          {["karten", "aktivität", "empfehlungen"].map(tab => (
            <button key={tab} className={`tab-btn${activeTab === tab ? " active" : ""}`} onClick={() => setActiveTab(tab)}>
              {tab === "karten" ? "🃏 Karten" : tab === "aktivität" ? "⏱ Aktivität" : "💰 Empfehlen"}
            </button>
          ))}
        </div>

        {/* ── TAB: Karten ── */}
        {activeTab === "karten" && (
          <div className="fade-in">
            {MOCK_BUSINESSES.map(b => (
              <div key={b.id} style={{ marginBottom: 16, position: "relative", overflow: "hidden", background: "rgba(99,255,180,0.05)", border: "1.5px solid rgba(99,255,180,0.2)", borderRadius: 20, padding: 22 }}>
                {/* Subtle biz bg */}
                <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${b.bg_image})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.06, borderRadius: 20 }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                    <div style={{ width: 38, height: 38, background: "linear-gradient(135deg, #1aff8c, #10B981)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{b.emoji}</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{b.name}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{b.stamps_collected} von {b.stamps_required} Stempeln</div>
                    </div>
                    <div style={{ marginLeft: "auto", fontSize: 20, fontWeight: 800, color: "#63FFB4" }}>{b.stamps_collected}</div>
                  </div>

                  {/* Stamp grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 7, marginBottom: 14 }}>
                    {Array.from({ length: b.stamps_required }).map((_, i) => (
                      <div key={i} style={{
                        aspectRatio: "1/1",
                        background: i < b.stamps_collected ? "linear-gradient(135deg, #1aff8c, #10B981)" : "rgba(255,255,255,0.05)",
                        borderRadius: 9,
                        border: i < b.stamps_collected ? "none" : "1px solid rgba(255,255,255,0.08)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14, color: "#050f09",
                        boxShadow: i < b.stamps_collected ? "0 0 10px rgba(99,255,180,0.4)" : "none",
                      }}>
                        {i < b.stamps_collected ? "✓" : ""}
                      </div>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div style={{ height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden", marginBottom: 10 }}>
                    <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #1aff8c, #63FFB4)", borderRadius: 99 }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                      Noch <strong style={{ color: "#FFD700" }}>{b.stamps_required - b.stamps_collected}</strong> bis zur Prämie
                    </span>
                    <span style={{ fontSize: 11, color: "#63FFB4", fontWeight: 600 }}>🎁 {b.reward_description}</span>
                  </div>
                </div>
              </div>
            ))}

            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>Weitere Stempelkarten folgen,<br />wenn du weitere Geschäfte besuchst.</div>
            </div>
          </div>
        )}

        {/* ── TAB: Aktivität ── */}
        {activeTab === "aktivität" && (
          <div className="fade-in">
            {MOCK_ACTIVITY.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ width: 38, height: 38, background: "rgba(99,255,180,0.1)", border: "1px solid rgba(99,255,180,0.2)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>{item.text}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{item.time}</div>
                </div>
                <div style={{ width: 28, height: 28, background: "linear-gradient(135deg, #1aff8c, #10B981)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#050f09", fontWeight: 800 }}>✓</div>
              </div>
            ))}
          </div>
        )}

        {/* ── TAB: Empfehlungen ── */}
        {activeTab === "empfehlungen" && (
          <div className="fade-in">
            <div className="card" style={{ marginBottom: 16, borderColor: "rgba(255,215,0,0.15)", background: "rgba(255,215,0,0.04)" }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>💰</div>
              <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 6 }}>Freunde einladen & verdienen</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 20, lineHeight: 1.6 }}>
                Empfehle Kings Barbershop an Freunde. Wenn sie 3× dort waren, bekommst du automatisch eine Provision.
              </div>

              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 14, marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>Dein Empfehlungslink</div>
                <div style={{ fontSize: 13, color: "#63FFB4", fontWeight: 700, fontFamily: "monospace", marginBottom: 10 }}>
                  sensalie.app/ref/{customer.referral_code}
                </div>
                <button onClick={copyReferral} className="green-btn" style={{ width: "100%", padding: "11px", fontSize: 13, borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                  {copied ? "✓ Link kopiert!" : "🔗 Link kopieren"}
                </button>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 14, textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#63FFB4" }}>0</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>Empfehlungen</div>
                </div>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 14, textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#FFD700" }}>0€</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>Verdient</div>
                </div>
              </div>
            </div>

            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", textAlign: "center", lineHeight: 1.7, padding: "0 10px" }}>
              Provisionen werden automatisch verarbeitet<br />sobald dein Freund 3× einen Stempel gesammelt hat.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}