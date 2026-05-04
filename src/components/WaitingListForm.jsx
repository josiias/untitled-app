import { useState } from "react";

export default function WaitingListForm({ variant = "business" }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    // Store in localStorage as simple mock (no backend entity needed)
    const key = "sensalie_waitlist";
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    if (!existing.includes(email)) existing.push(email);
    localStorage.setItem(key, JSON.stringify(existing));
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{
        background: "rgba(16,185,129,0.1)", border: "1.5px solid rgba(16,185,129,0.4)",
        borderRadius: 18, padding: "24px 28px", textAlign: "center",
        animation: "waitlistPop 0.4s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        <style>{`@keyframes waitlistPop { from { opacity:0; transform:scale(0.9); } to { opacity:1; transform:scale(1); } }`}</style>
        <div style={{ fontSize: 32, marginBottom: 10 }}>🎉</div>
        <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", marginBottom: 6 }}>Du bist dabei!</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
          Wir melden uns, sobald Sensalie in deiner Stadt startet.<br />Halte dein Postfach im Blick — du kriegst auch den Early-Bird-Preis. 🐦
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.25)",
      borderRadius: 18, padding: "28px",
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>
        🐦 EARLY BIRD
      </div>
      <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 6 }}>
        {variant === "business" ? "Sichere deinen Early-Bird-Preis" : "Werde als Erster informiert"}
      </div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 20, lineHeight: 1.6 }}>
        {variant === "business"
          ? "Trag dich jetzt ein — Early Birds erhalten bis zu 50% dauerhaften Rabatt auf alle Pläne."
          : "Wir benachrichtigen dich, sobald Sensalie in deiner Stadt verfügbar ist."}
      </div>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          type="email"
          required
          placeholder="deine@email.de"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{
            flex: 1, minWidth: 200, padding: "13px 16px",
            background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.12)",
            borderRadius: 12, fontSize: 14, color: "#fff", fontFamily: "inherit", outline: "none",
          }}
        />
        <button type="submit" disabled={loading} style={{
          padding: "13px 24px", background: loading ? "rgba(16,185,129,0.5)" : "#10B981",
          border: "none", borderRadius: 12, color: "#fff",
          fontWeight: 800, fontSize: 14, cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "inherit", whiteSpace: "nowrap",
        }}>
          {loading ? "..." : "Jetzt eintragen →"}
        </button>
      </form>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 10 }}>
        ✓ Kein Spam &nbsp;·&nbsp; ✓ Jederzeit abmeldbar &nbsp;·&nbsp; ✓ DSGVO-konform
      </div>
    </div>
  );
}