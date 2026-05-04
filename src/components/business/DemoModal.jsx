import { useState } from "react";

const DEMO_STEPS = [
  {
    id: "setup",
    icon: "⚙️",
    title: "Stempelkarte einrichten",
    desc: "Lege deine Prämie fest — z.B. 'Gratis Haarschnitt nach 8 Stempeln'",
    action: "Karte erstellen",
    nextLabel: "QR-Code ansehen →",
    mockup: (
      <div style={{ background: "rgba(16,185,129,0.08)", border: "1.5px solid rgba(16,185,129,0.3)", borderRadius: 16, padding: "18px 20px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Neue Stempelkarte</div>
        {[
          { label: "Prämie", value: "Gratis Haarschnitt 💈" },
          { label: "Stempel bis Prämie", value: "8 Stempel" },
          { label: "Mind. Einkauf", value: "20 €" },
        ].map(f => (
          <div key={f.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{f.label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{f.value}</span>
          </div>
        ))}
        <div style={{ marginTop: 14, background: "#10B981", borderRadius: 10, padding: "10px", textAlign: "center", fontSize: 13, fontWeight: 800, color: "#fff" }}>✓ Karte gespeichert!</div>
      </div>
    ),
  },
  {
    id: "qr",
    icon: "📱",
    title: "Kunde scannt QR-Code",
    desc: "Der Kunde scannt einfach an der Kasse — kein Download, sofort aktiv.",
    action: "QR-Code generiert",
    nextLabel: "Empfehlung sehen →",
    mockup: (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ background: "#0A1612", border: "2px solid rgba(16,185,129,0.4)", borderRadius: 14, padding: 12, boxShadow: "0 0 30px rgba(16,185,129,0.15)" }}>
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&bgcolor=0A1612&color=10B981&qzone=2&data=https://sensalie.com/demo`} alt="QR" width={140} height={140} style={{ borderRadius: 6, display: "block" }} />
        </div>
        <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 100, padding: "6px 16px", fontSize: 11, fontWeight: 700, color: "#10B981" }}>
          ● Gerade gescannt: Sara K.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, width: "100%" }}>
          {[{ l: "Scans heute", v: "23" }, { l: "Neue Kunden", v: "4" }].map(s => (
            <div key={s.l} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#10B981" }}>{s.v}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "referral",
    icon: "💸",
    title: "Empfehlung per WhatsApp",
    desc: "Kunden empfehlen dich automatisch — du gewinnst Neukunden ohne Aufwand.",
    action: "Empfehlung gesendet",
    nextLabel: "Provision sehen →",
    mockup: (
      <div style={{ background: "#075E54", borderRadius: 16, padding: "16px 14px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 10 }}>WhatsApp</div>
        <div style={{ background: "#128C7E", borderRadius: "12px 12px 12px 3px", padding: "10px 14px", marginBottom: 8, maxWidth: "85%" }}>
          <div style={{ fontSize: 12, color: "#fff", lineHeight: 1.5 }}>Hey! 👋 Ich sammel bei <strong>Kings Barbershop</strong> Stempel — komm auch, wir bekommen beide einen Vorteil! 🎁</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginTop: 4, textAlign: "right" }}>14:32 ✓✓</div>
        </div>
        <div style={{ background: "#DCF8C6", borderRadius: "12px 12px 3px 12px", padding: "10px 14px", marginLeft: "auto", maxWidth: "85%" }}>
          <div style={{ fontSize: 12, color: "#000", lineHeight: 1.5 }}>Krass, mach ich! 🔥 Schick mir den Link!</div>
          <div style={{ fontSize: 10, color: "rgba(0,0,0,0.4)", marginTop: 4, textAlign: "right" }}>14:33 ✓✓</div>
        </div>
      </div>
    ),
  },
  {
    id: "provision",
    icon: "💰",
    title: "Provision wird ausgelöst",
    desc: "Sobald der Neukunde genug Besuche hatte, fließt die Provision automatisch.",
    action: "Provision erhalten!",
    nextLabel: "Demo abschließen ✓",
    mockup: (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ background: "rgba(16,185,129,0.1)", border: "1.5px solid rgba(16,185,129,0.4)", borderRadius: 16, padding: "16px 18px", textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 4 }}>Neue Provision erhalten</div>
          <div style={{ fontSize: 38, fontWeight: 900, color: "#10B981" }}>+12,00 €</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>von Empfehlung: Sara K. → Jonas W.</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { emoji: "✅", text: "Jonas W. hat 3 Besuche absolviert", color: "#10B981" },
            { emoji: "💸", text: "12,00 € Provision freigeschaltet", color: "#10B981" },
            { emoji: "📬", text: "Auszahlung nächste Woche", color: "#F59E0B" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "8px 12px" }}>
              <span style={{ fontSize: 14 }}>{item.emoji}</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export default function DemoModal({ onClose, lang = "de" }) {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const current = DEMO_STEPS[step];

  const handleNext = () => {
    if (step < DEMO_STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      setCompleted(true);
    }
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#0d1f14", border: "1.5px solid rgba(16,185,129,0.35)", borderRadius: 24, width: "100%", maxWidth: 440, boxShadow: "0 40px 80px rgba(0,0,0,0.7)", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ background: "rgba(16,185,129,0.08)", borderBottom: "1px solid rgba(16,185,129,0.15)", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>
              {lang === "en" ? "🚀 Interactive Demo" : "🚀 Interaktive Demo"}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
              {lang === "en" ? `Step ${step + 1} of ${DEMO_STEPS.length}` : `Schritt ${step + 1} von ${DEMO_STEPS.length}`}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 8, padding: "6px 10px", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 15 }}>✕</button>
        </div>

        {/* Progress bar */}
        <div style={{ height: 3, background: "rgba(255,255,255,0.08)" }}>
          <div style={{ height: "100%", width: `${((step + 1) / DEMO_STEPS.length) * 100}%`, background: "#10B981", borderRadius: 100, transition: "width 0.4s ease" }} />
        </div>

        {!completed ? (
          <div style={{ padding: "20px 20px 24px" }}>
            {/* Step info */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 42, height: 42, borderRadius: 14, background: "rgba(16,185,129,0.15)", border: "1.5px solid rgba(16,185,129,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{current.icon}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>{current.title}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2, lineHeight: 1.5 }}>{current.desc}</div>
              </div>
            </div>

            {/* Mockup */}
            <div style={{ marginBottom: 20 }}>{current.mockup}</div>

            {/* Step dots */}
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 16 }}>
              {DEMO_STEPS.map((_, i) => (
                <div key={i} style={{ width: i === step ? 20 : 6, height: 6, borderRadius: 100, background: i <= step ? "#10B981" : "rgba(255,255,255,0.15)", transition: "all 0.3s" }} />
              ))}
            </div>

            <button onClick={handleNext} style={{ width: "100%", padding: "13px", background: "#10B981", border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
              {current.nextLabel}
            </button>
          </div>
        ) : (
          <div style={{ padding: "32px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 8 }}>
              {lang === "en" ? "That's how easy it is!" : "So einfach ist das!"}
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: 24 }}>
              {lang === "en"
                ? "In just 2 minutes you'll have your stamp card live. Your customers will love it."
                : "In 2 Minuten hast du deine Stempelkarte live. Deine Kunden werden es lieben."}
            </div>
            <button onClick={onClose} style={{ width: "100%", padding: "13px", background: "#10B981", border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", marginBottom: 10 }}>
              {lang === "en" ? "Start for free →" : "Kostenlos starten →"}
            </button>
            <button onClick={() => { setStep(0); setCompleted(false); }} style={{ width: "100%", padding: "10px", background: "transparent", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, color: "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              {lang === "en" ? "Restart demo" : "Demo neu starten"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}