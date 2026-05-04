import { useState } from "react";

const BIZ_FAQS = [
  { q: "Was kostet Sensalie wirklich?", a: "Der Free-Plan ist dauerhaft kostenlos — keine versteckten Gebühren. Plus startet bei 9,90€/Monat (Early-Bird), Pro bei 14,99€/Monat. Du zahlst keine Provision an uns — nur deine eigenen Kunden-Provisionen, die du selbst festlegst." },
  { q: "Wie lange dauert die Einrichtung?", a: "Ungefähr 2–5 Minuten. Du legst eine Stempelkarte an, definierst Prämie und Provision, und druckst deinen QR-Code aus. Fertig. Kein Techniker, keine Hardware, keine App-Installation für dich." },
  { q: "Brauche ich spezielle Hardware oder eine Kasse-Integration?", a: "Nein. Alles läuft über den Browser — du brauchst nur dein Smartphone oder einen Bildschirm an der Kasse. Der Kunde scannt einfach deinen QR-Code." },
  { q: "Was passiert, wenn ein Kunde seinen Stempel nicht einlöst?", a: "Nichts — die Karte bleibt aktiv und der Kunde kann jederzeit weiterstempeln. Du verlierst dadurch nichts." },
  { q: "Wann muss ich Provision zahlen?", a: "Nur wenn ein empfohlener Neukunde wirklich X-mal bei dir war (du definierst die Schwelle selbst). Keine Zahlung bei bloßem Klick oder Registrierung." },
  { q: "Kann ich Sensalie jederzeit kündigen?", a: "Ja, jederzeit — kein Vertrag, keine Mindestlaufzeit. Du kannst monatlich kündigen oder zum Free-Plan wechseln." },
  { q: "Ist mein Konto und meine Kundendaten sicher?", a: "Ja. Alle Daten werden verschlüsselt gespeichert und sind DSGVO-konform verarbeitet. Deine Kundendaten gehören dir." },
];

export default function FaqSection({ faqs = BIZ_FAQS, title = "Häufige Fragen", subtitle = "Alles, was du wissen musst." }) {
  const [open, setOpen] = useState(null);

  return (
    <div style={{ padding: "80px 24px", background: "#0d1a10" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>FAQ</div>
          <h2 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 900, color: "#fff", margin: "0 0 10px" }}>{title}</h2>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>{subtitle}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                style={{
                  background: isOpen ? "rgba(16,185,129,0.07)" : "rgba(255,255,255,0.03)",
                  border: isOpen ? "1.5px solid rgba(16,185,129,0.35)" : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16, overflow: "hidden",
                  transition: "border-color 0.3s, background 0.3s",
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{
                    width: "100%", padding: "18px 22px", background: "none", border: "none",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                    cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 700, color: isOpen ? "#fff" : "rgba(255,255,255,0.8)", flex: 1 }}>
                    {faq.q}
                  </span>
                  <span style={{
                    fontSize: 20, color: "#10B981", flexShrink: 0,
                    transform: isOpen ? "rotate(45deg)" : "rotate(0)",
                    transition: "transform 0.3s",
                    display: "inline-block",
                  }}>+</span>
                </button>
                {isOpen && (
                  <div style={{ padding: "0 22px 20px", fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.75 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: 36, fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
          Noch eine Frage? →{" "}
          <a href="mailto:info@sensalie.de" style={{ color: "#10B981", textDecoration: "none", fontWeight: 600 }}>
            info@sensalie.de
          </a>
        </div>
      </div>
    </div>
  );
}