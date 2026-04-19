import { useState } from "react";

const USER = { name: "Max Mustermann", phone: "0151 234 567 89", avatar: "MM", since: "März 2026", email: "max@beispiel.de", city: "München" };

const STATS = [
  { label: "Stempel gesamt", value: 16, emoji: "⬛", color: "#10B981" },
  { label: "Prämien eingelöst", value: 2, emoji: "🎁", color: "#F59E0B" },
  { label: "Provision verdient", value: "42,50€", emoji: "💸", color: "#EC4899" },
  { label: "Empfehlungen", value: 3, emoji: "👥", color: "#8B5CF6" },
];

const HISTORY = [
  { emoji: "✂️", business: "Kings Barbershop", type: "stempel", detail: "+1 Stempel", date: "Heute, 14:32", color: "#10B981" },
  { emoji: "💅", business: "Bella Nails", type: "stempel", detail: "+1 Stempel", date: "Gestern, 11:05", color: "#EC4899" },
  { emoji: "💸", business: "Empfehlung · Jonas W.", type: "provision", detail: "+12,50€", date: "02.04.2026", color: "#F59E0B" },
  { emoji: "✂️", business: "Kings Barbershop", type: "praemie", detail: "10€ Gutschein eingelöst 🎉", date: "28.03.2026", color: "#10B981" },
  { emoji: "💸", business: "Empfehlung · Amir S.", type: "provision", detail: "+15,00€", date: "20.03.2026", color: "#F59E0B" },
  { emoji: "☕", business: "Café Milano", type: "stempel", detail: "+1 Stempel", date: "15.03.2026", color: "#F59E0B" },
];

const PREFERENCES = [
  { id: "notifications_stamps", label: "Stempel-Erinnerungen", desc: "Benachrichtigung wenn du fast fertig bist", default: true },
  { id: "notifications_rewards", label: "Prämien-Ablauf", desc: "Erinnere mich vor dem Ablaufdatum", default: true },
  { id: "notifications_offers", label: "Aktionen & Angebote", desc: "Neue Aktionen von Partnerbetrieben", default: false },
  { id: "share_progress", label: "Fortschritt teilen", desc: "Zeige Freunden deine Prämienfortschritte", default: false },
];

export default function ProfilePage({ onClose }) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: USER.name, phone: USER.phone, email: USER.email, city: USER.city });
  const [prefs, setPrefs] = useState(() => {
    const map = {};
    PREFERENCES.forEach(p => { map[p.id] = p.default; });
    return map;
  });
  const [saved, setSaved] = useState(false);
  const [historyFilter, setHistoryFilter] = useState("alle");

  const handleSave = () => {
    setSaved(true);
    setEditMode(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const filtered = historyFilter === "alle" ? HISTORY : HISTORY.filter(h => h.type === historyFilter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 14px", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", cursor: "pointer", fontFamily: "inherit" }}>
          ← Zurück
        </button>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>Mein Profil</div>
        <button onClick={() => editMode ? handleSave() : setEditMode(true)}
          style={{ background: editMode ? "#10B981" : "rgba(255,255,255,0.06)", border: editMode ? "none" : "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 14px", fontSize: 13, fontWeight: 700, color: editMode ? "#fff" : "rgba(255,255,255,0.6)", cursor: "pointer", fontFamily: "inherit" }}>
          {saved ? "✓ Gespeichert" : editMode ? "Speichern" : "Bearbeiten"}
        </button>
      </div>

      {/* Avatar card */}
      <div style={{
        background: "linear-gradient(135deg, #0f2027, #203a43)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20, padding: "24px 20px",
        display: "flex", alignItems: "center", gap: 16,
      }}>
        <div style={{
          width: 64, height: 64,
          background: "linear-gradient(135deg, #10B981, #059669)",
          borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, fontWeight: 900, color: "#fff",
          boxShadow: "0 4px 16px rgba(16,185,129,0.3)",
        }}>
          {USER.avatar}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 900, color: "#fff" }}>{form.name}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 3 }}>Mitglied seit {USER.since}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 6px #10B981" }} />
            <span style={{ fontSize: 11, color: "#10B981", fontWeight: 600 }}>Aktives Konto</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {STATS.map((s, i) => (
          <div key={i} style={{ background: "#1a2530", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "14px 16px" }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{s.emoji}</div>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Personal data */}
      <div style={{ background: "#1a2530", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, overflow: "hidden" }}>
        <div style={{ padding: "16px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 1 }}>Persönliche Daten</div>
        </div>
        {[
          { label: "Name", field: "name", icon: "👤" },
          { label: "Telefon", field: "phone", icon: "📱" },
          { label: "E-Mail", field: "email", icon: "✉️" },
          { label: "Stadt", field: "city", icon: "📍" },
        ].map((item, i, arr) => (
          <div key={item.field} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
            <span style={{ fontSize: 16, width: 22, textAlign: "center", flexShrink: 0 }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>{item.label}</div>
              {editMode ? (
                <input
                  value={form[item.field]}
                  onChange={e => setForm(f => ({ ...f, [item.field]: e.target.value }))}
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(16,185,129,0.4)", borderRadius: 8, padding: "6px 10px", fontSize: 13, color: "#fff", fontFamily: "inherit", outline: "none", width: "100%" }}
                />
              ) : (
                <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{form[item.field]}</div>
              )}
            </div>
            {editMode && <span style={{ fontSize: 12, color: "#10B981" }}>✎</span>}
          </div>
        ))}
      </div>

      {/* Preferences */}
      <div style={{ background: "#1a2530", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, overflow: "hidden" }}>
        <div style={{ padding: "16px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 1 }}>Präferenzen</div>
        </div>
        {PREFERENCES.map((pref, i) => (
          <div key={pref.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderBottom: i < PREFERENCES.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{pref.label}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{pref.desc}</div>
            </div>
            {/* Toggle */}
            <div onClick={() => setPrefs(p => ({ ...p, [pref.id]: !p[pref.id] }))}
              style={{
                width: 44, height: 24, borderRadius: 12, cursor: "pointer",
                background: prefs[pref.id] ? "#10B981" : "rgba(255,255,255,0.1)",
                position: "relative", transition: "background 0.3s", flexShrink: 0,
              }}>
              <div style={{
                position: "absolute", top: 3, left: prefs[pref.id] ? 22 : 3,
                width: 18, height: 18, borderRadius: "50%", background: "#fff",
                transition: "left 0.3s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Activity history */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Verlauf</div>

        {/* Filter pills */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12, overflowX: "auto" }}>
          {[
            { id: "alle", label: "Alle" },
            { id: "stempel", label: "⬛ Stempel" },
            { id: "provision", label: "💸 Provision" },
            { id: "praemie", label: "🎁 Prämien" },
          ].map(f => (
            <button key={f.id} onClick={() => setHistoryFilter(f.id)}
              style={{ whiteSpace: "nowrap", padding: "7px 14px", borderRadius: 100, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "inherit",
                background: historyFilter === f.id ? "#10B981" : "rgba(255,255,255,0.07)",
                color: historyFilter === f.id ? "#fff" : "rgba(255,255,255,0.45)" }}>
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ background: "#1a2530", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, overflow: "hidden" }}>
          {filtered.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <div style={{ width: 38, height: 38, background: item.color + "18", border: `1px solid ${item.color}33`, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                {item.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{item.business}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{item.date}</div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: item.color, whiteSpace: "nowrap" }}>{item.detail}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 16, padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>Konto löschen</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>Alle Daten werden unwiderruflich gelöscht</div>
        </div>
        <button style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "8px 14px", fontSize: 12, fontWeight: 700, color: "#EF4444", cursor: "pointer", fontFamily: "inherit" }}>
          Löschen
        </button>
      </div>

    </div>
  );
}