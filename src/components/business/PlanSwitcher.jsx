import { useState } from "react";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "0€",
    color: "rgba(255,255,255,0.4)",
    bg: "rgba(255,255,255,0.05)",
    border: "rgba(255,255,255,0.15)",
    features: [
      { key: "stamps_1", label: "1 Stempelkarte" },
      { key: "qr", label: "QR-Code Generator" },
      { key: "stats_basic", label: "Basis-Statistiken" },
    ],
    locked: ["referral", "multi_commission", "realtime", "team_booking", "analytics_full"],
  },
  {
    id: "plus",
    name: "Plus",
    price: "9,90€",
    period: "/Mo.",
    color: "#10B981",
    bg: "rgba(16,185,129,0.07)",
    border: "rgba(16,185,129,0.4)",
    badge: "Beliebt",
    features: [
      { key: "stamps_2", label: "2 Stempelkarten" },
      { key: "qr", label: "QR-Code Generator" },
      { key: "referral", label: "Empfehlungs-Tracking" },
      { key: "multi_commission", label: "1 aktive Provision" },
      { key: "realtime", label: "Echtzeit-Dashboard" },
      { key: "stats_basic", label: "Basis-Statistiken" },
    ],
    locked: ["team_booking", "analytics_full", "multi_provision"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "14,99€",
    period: "/Mo.",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.07)",
    border: "rgba(245,158,11,0.4)",
    badge: "Alle Features",
    features: [
      { key: "stamps_unlimited", label: "Unbegrenzte Stempelkarten" },
      { key: "qr", label: "QR-Code Generator" },
      { key: "referral", label: "Empfehlungs-Tracking" },
      { key: "multi_provision", label: "Mehrere Provisionen" },
      { key: "realtime", label: "Echtzeit-Dashboard" },
      { key: "team_booking", label: "📅 Team-Terminbuchung" },
      { key: "analytics_full", label: "📊 Vollständige Analyse" },
    ],
    locked: [],
  },
];

export default function PlanSwitcher({ currentPlan, onChangePlan }) {
  const [showModal, setShowModal] = useState(false);
  const [pendingPlan, setPendingPlan] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const plan = PLANS.find(p => p.id === currentPlan) || PLANS[0];

  const handleSelect = (p) => {
    if (p.id === currentPlan) return;
    setPendingPlan(p);
    setShowModal(true);
    setConfirmed(false);
  };

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => {
      onChangePlan(pendingPlan.id);
      setShowModal(false);
      setConfirmed(false);
      setPendingPlan(null);
    }, 900);
  };

  return (
    <>
      {/* Current plan badge */}
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "22px 24px", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 3 }}>Dein aktuelles Abo</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>Klicke auf ein Abo zum Testen — jederzeit kündbar</div>
          </div>
          <div style={{
            background: plan.bg, border: `1.5px solid ${plan.border}`,
            borderRadius: 100, padding: "5px 16px",
            fontSize: 13, fontWeight: 800, color: plan.color,
          }}>
            {plan.name} {plan.price && plan.price !== "0€" ? `· ${plan.price}${plan.period || ""}` : "· Kostenlos"}
          </div>
        </div>

        {/* Plan cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {PLANS.map(p => {
            const isActive = p.id === currentPlan;
            return (
              <div
                key={p.id}
                onClick={() => handleSelect(p)}
                style={{
                  borderRadius: 16, padding: "16px 14px",
                  background: isActive ? p.bg : "rgba(255,255,255,0.03)",
                  border: isActive ? `2px solid ${p.border}` : "1.5px solid rgba(255,255,255,0.08)",
                  cursor: isActive ? "default" : "pointer",
                  transition: "all 0.25s ease",
                  position: "relative",
                  boxShadow: isActive ? `0 0 20px ${p.color}22` : "none",
                }}
              >
                {isActive && (
                  <div style={{ position: "absolute", top: -9, left: "50%", transform: "translateX(-50%)", background: p.color, borderRadius: 100, padding: "2px 10px", fontSize: 9, fontWeight: 800, color: p.id === "plus" ? "#fff" : "#000", whiteSpace: "nowrap" }}>
                    ✓ Aktiv
                  </div>
                )}
                {p.badge && !isActive && (
                  <div style={{ position: "absolute", top: -9, left: "50%", transform: "translateX(-50%)", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 100, padding: "2px 10px", fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap" }}>
                    {p.badge}
                  </div>
                )}
                <div style={{ fontSize: 14, fontWeight: 800, color: isActive ? p.color : "rgba(255,255,255,0.6)", marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: isActive ? "#fff" : "rgba(255,255,255,0.4)" }}>
                  {p.price}
                  {p.period && <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.3)" }}>{p.period}</span>}
                </div>

                {/* Feature list (compact) */}
                <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
                  {p.features.slice(0, 4).map(f => (
                    <div key={f.key} style={{ fontSize: 10, color: isActive ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ color: isActive ? p.color : "rgba(255,255,255,0.2)", fontWeight: 700, fontSize: 10 }}>✓</span>
                      {f.label}
                    </div>
                  ))}
                  {p.locked.length > 0 && (
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 2 }}>
                      + {p.locked.length} Feature{p.locked.length > 1 ? "s" : ""} gesperrt
                    </div>
                  )}
                </div>

                {/* Switch button */}
                {!isActive && (
                  <div style={{ marginTop: 12, width: "100%", padding: "7px 0", background: `${p.color}22`, border: `1px solid ${p.color}44`, borderRadius: 8, fontSize: 11, fontWeight: 700, color: p.color, textAlign: "center" }}>
                    {currentPlan === "free" ? "Upgraden" : p.id === "free" ? "Kündigen" : "Wechseln"}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && pendingPlan && (
        <div onClick={() => setShowModal(false)} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#111e28", border: `1.5px solid ${pendingPlan.color}44`, borderRadius: 24, padding: 28, maxWidth: 360, width: "100%", boxShadow: "0 30px 60px rgba(0,0,0,0.6)" }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>
                {pendingPlan.id === "free" ? "😢" : pendingPlan.id === "plus" ? "🚀" : "⭐"}
              </div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", marginBottom: 6 }}>
                {currentPlan !== "free" && pendingPlan.id === "free"
                  ? "Abo kündigen?"
                  : `Zu ${pendingPlan.name} wechseln?`}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
                {pendingPlan.id === "free"
                  ? "Du wechselst zurück zu Free. Alle Pro/Plus-Features werden deaktiviert."
                  : `Du schaltest alle ${pendingPlan.name}-Features frei.`}
              </div>
            </div>

            {/* Features preview */}
            <div style={{ background: `${pendingPlan.color}10`, border: `1px solid ${pendingPlan.color}25`, borderRadius: 12, padding: "12px 14px", marginBottom: 18 }}>
              {pendingPlan.features.map(f => (
                <div key={f.key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ color: pendingPlan.color, fontWeight: 700, fontSize: 11 }}>✓</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{f.label}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: "12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                Abbrechen
              </button>
              <button onClick={handleConfirm} style={{ flex: 2, padding: "12px", background: confirmed ? "#059669" : pendingPlan.color, border: "none", borderRadius: 12, color: pendingPlan.id === "pro" ? "#000" : "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", transition: "background 0.3s" }}>
                {confirmed ? "✓ Gewechselt!" : pendingPlan.id === "free" ? "Ja, kündigen" : `${pendingPlan.name} aktivieren`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}