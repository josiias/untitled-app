// Team Booking — Sensalie Pro Feature Preview
// Supabase-ready data structure:
// Tables: employees (id, business_id, name, role, photo_url, color, active)
//         bookings (id, business_id, employee_id, customer_phone, date, time, status, comment, confirmation_nr)
//         time_slots (id, employee_id, date, time, is_blocked)

const MOCK_EMPLOYEES = [
  { id: "e1", name: "Yara K.", role: "Senior Stylistin", color: "#EC4899", initials: "YK", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80", bookings_today: 4, utilization: 87 },
  { id: "e2", name: "Mehmet B.", role: "Barbier", color: "#10B981", initials: "MB", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80", bookings_today: 3, utilization: 62 },
  { id: "e3", name: "Aisha L.", role: "Nail Artist", color: "#8B5CF6", initials: "AL", img: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&q=80", bookings_today: 5, utilization: 94 },
];

const MOCK_BOOKINGS = [
  { id: "b1", employee_id: "e1", time: "09:00", customer: "Sara K.", comment: "Komme 5 Min später", status: "confirmed", confirmation_nr: "SEN-4821" },
  { id: "b2", employee_id: "e1", time: "10:30", customer: "Fatima A.", comment: "", status: "confirmed", confirmation_nr: "SEN-4822" },
  { id: "b3", employee_id: "e2", time: "09:30", customer: "Jonas W.", comment: "Möchte Skin Fade", status: "confirmed", confirmation_nr: "SEN-4823" },
  { id: "b4", employee_id: "e3", time: "11:00", customer: "Leila M.", comment: "Gel Nägel, Farbe: Rosa", status: "confirmed", confirmation_nr: "SEN-4824" },
  { id: "b5", employee_id: "e3", time: "13:00", customer: "Hana B.", comment: "", status: "pending", confirmation_nr: "SEN-4825" },
];

export default function TeamBookingPreview() {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, marginBottom: 16, position: "relative", overflow: "hidden" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 24px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, background: "rgba(245,158,11,0.15)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(245,158,11,0.3)", fontSize: 16 }}>📅</div>
          <div>
            <div style={{ fontWeight: 700, color: "#fff", fontSize: 16 }}>Team-Terminbuchung</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>Mitarbeiter-Kalender & Auslastung</div>
          </div>
        </div>
        <div style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 100, padding: "4px 12px", fontSize: 10, fontWeight: 800, color: "#F59E0B" }}>
          SENSALIE PRO
        </div>
      </div>

      {/* Preview Content — blurred */}
      <div style={{ opacity: 0.28, pointerEvents: "none", padding: "0 24px 20px" }}>

        {/* Employee cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 14 }}>
          {MOCK_EMPLOYEES.map(emp => (
            <div key={emp.id} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${emp.color}30`, borderRadius: 14, padding: "12px 12px", textAlign: "center" }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", overflow: "hidden", margin: "0 auto 8px", border: `2px solid ${emp.color}55` }}>
                <img src={emp.img} alt={emp.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{emp.name}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>{emp.role}</div>
              {/* Utilization bar */}
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 100, height: 4, overflow: "hidden", marginBottom: 4 }}>
                <div style={{ height: "100%", width: `${emp.utilization}%`, background: `linear-gradient(90deg, ${emp.color}88, ${emp.color})`, borderRadius: 100 }} />
              </div>
              <div style={{ fontSize: 9, color: emp.color, fontWeight: 700 }}>{emp.utilization}% ausgelastet</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{emp.bookings_today} Termine heute</div>
            </div>
          ))}
        </div>

        {/* Today's bookings list */}
        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Heute · {new Date().toLocaleDateString("de-DE", { weekday: "long", day: "2-digit", month: "long" })}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {MOCK_BOOKINGS.map(b => {
            const emp = MOCK_EMPLOYEES.find(e => e.id === b.employee_id);
            return (
              <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "9px 12px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", minWidth: 38 }}>{b.time}</div>
                <div style={{ width: 28, height: 28, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: `1.5px solid ${emp?.color}55` }}>
                  <img src={emp?.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{b.customer}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>{emp?.name}{b.comment ? ` · "${b.comment}"` : ""}</div>
                </div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>{b.confirmation_nr}</div>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: b.status === "confirmed" ? "#10B981" : "#F59E0B", flexShrink: 0 }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Lock Overlay */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: 20,
        background: "rgba(10,16,14,0.65)",
        backdropFilter: "blur(4px)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: 28,
      }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(245,158,11,0.15)", border: "2px solid rgba(245,158,11,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>
          📅
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", textAlign: "center" }}>Team-Terminbuchung</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textAlign: "center", lineHeight: 1.7, maxWidth: 300 }}>
          Jeder Mitarbeiter bekommt seinen eigenen Kalender. Kunden wählen direkt ihren Lieblings-Mitarbeiter. Du siehst die Auslastung auf einen Blick.
        </div>

        {/* Feature bullets */}
        <div style={{ display: "flex", flexDirection: "column", gap: 7, width: "100%", maxWidth: 300 }}>
          {[
            { icon: "📸", text: "Mitarbeiter-Profile mit Foto" },
            { icon: "📆", text: "Eigener Kalender je Mitarbeiter" },
            { icon: "💬", text: "Kunden-Kommentare & Wünsche" },
            { icon: "✅", text: "Bestätigungsnummer per App" },
            { icon: "❌", text: "Termin stornieren & umbuchen" },
            { icon: "📊", text: "Auslastungsübersicht für Chef" },
          ].map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.12)", borderRadius: 8, padding: "6px 10px" }}>
              <span style={{ fontSize: 13 }}>{f.icon}</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>{f.text}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 4, background: "rgba(245,158,11,0.15)", border: "1.5px solid rgba(245,158,11,0.4)", borderRadius: 12, padding: "10px 24px", fontSize: 13, fontWeight: 800, color: "#F59E0B", textAlign: "center" }}>
          🚀 Demnächst verfügbar · Sensalie Pro
        </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", textAlign: "center" }}>
          Supabase-powered · Echtzeit-Sync · Benachrichtigungen
        </div>
      </div>
    </div>
  );
}