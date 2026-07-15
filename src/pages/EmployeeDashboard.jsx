import { useState, useEffect } from "react";
import { ArrowLeft, Phone, Check, Clock, Calendar, Gift, Loader2, LogOut } from "lucide-react";
import { base44 } from "@/api/base44Client";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";

const TABS = [
  { id: "appointments", icon: "📅", label: "Termine" },
  { id: "stamp", icon: "✅", label: "Stempeln" },
  { id: "rewards", icon: "🎁", label: "Prämien" },
  { id: "notifications", icon: "🔔", label: "Info" },
];

const NOTIFICATION_LABELS = [
  { key: "notify_new_appointment", icon: "📅", label: "Neuer Termin gebucht", desc: "Wenn ein Kunde einen Termin bei dir bucht" },
  { key: "notify_cancellation", icon: "❌", label: "Termin storniert", desc: "Wenn ein Kunde einen Termin absagt" },
  { key: "notify_stamp_confirmation", icon: "✅", label: "Stempel bestätigt", desc: "Bei jedem von dir bestätigten Stempel" },
  { key: "notify_reward_ready", icon: "🎁", label: "Prämie bereit", desc: "Wenn eine Belohnung abholbereit ist" },
  { key: "notify_daily_summary", icon: "📊", label: "Tägliche Zusammenfassung", desc: "Morgens ein Überblick deiner heutigen Termine" },
];

function genConfirmationNr() {
  return "SEN-" + Math.floor(1000 + Math.random() * 9000);
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export default function EmployeeDashboard() {
  const [employee, setEmployee] = useState(null);
  const [business, setBusiness] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [tab, setTab] = useState("appointments");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const user = await base44.auth.me();

      // Mitarbeiter-Profil des eingeloggten Users finden (Match per E-Mail)
      const emps = await base44.entities.Employee.filter({ email: user.email }, "-created_date", 1);
      if (emps.length === 0) {
        setError("Kein Mitarbeiter-Profil mit deinem Konto verknüpft. Bitte den Geschäftsinhaber bitten, dich anzulegen.");
        setLoading(false);
        return;
      }
      const emp = emps[0];
      setEmployee(emp);

      // Geschäft laden
      const biz = await base44.entities.Business.filter({ id: emp.business_id }, "-created_date", 1);
      if (biz.length > 0) setBusiness(biz[0]);

      // Alle Termine des Mitarbeiters (für Kalender-Navigation)
      const allAppts = await base44.entities.Appointment.filter({
        employee_id: emp.id
      }, "date");
      setAppointments(allAppts);

      // Offene Prämien des Geschäfts
      const rw = await base44.entities.Reward.filter({
        business_id: emp.business_id,
        status: "bereit"
      }, "-created_date");
      setRewards(rw);
    } catch (err) {
      setError("Fehler beim Laden der Daten");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleLogout = () => base44.auth.logout("/");

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#111e28", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 size={32} color="#10B981" style={{ animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  if (error && !employee) {
    return (
      <div style={{ minHeight: "100vh", background: "#111e28", fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, color: "#fff" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Kein Zugriff</h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", textAlign: "center", maxWidth: 320, marginBottom: 24 }}>{error}</p>
        <button onClick={handleLogout} style={{ background: "#10B981", color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Zurück zum Login</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#111e28", fontFamily: "'Inter', sans-serif", color: "#fff", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 0; height: 0; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(17,30,40,0.9)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 20px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", overflow: "hidden", background: `${employee?.color || "#10B981"}22`, border: `2px solid ${employee?.color || "#10B981"}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: employee?.color || "#10B981" }}>
              {employee?.photo_url ? <img src={employee.photo_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : employee?.name?.split(" ").map(n => n[0]).join("").slice(0,2)}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>{employee?.name}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{employee?.role || "Mitarbeiter"} · {business?.name || "Geschäft"}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "8px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.6)", fontFamily: "inherit", fontSize: 12 }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "16px 20px 0", display: "flex", gap: 8 }}>
        {TABS.map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: "12px 8px", borderRadius: 12, border: "none", cursor: "pointer", fontFamily: "inherit",
              background: active ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.04)",
              border: active ? "1px solid rgba(16,185,129,0.4)" : "1px solid rgba(255,255,255,0.06)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4, transition: "all 0.2s",
            }}>
              <span style={{ fontSize: 18 }}>{t.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: active ? "#10B981" : "rgba(255,255,255,0.4)" }}>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px 20px 40px" }}>
        {tab === "appointments" && <AppointmentsTab appointments={appointments} employee={employee} onUpdate={loadData} />}
        {tab === "stamp" && <StampTab business={business} />}
        {tab === "rewards" && <RewardsTab rewards={rewards} onUpdate={loadData} />}
        {tab === "notifications" && <NotificationsTab employee={employee} onUpdate={loadData} />}
      </div>
    </div>
  );
}

// ── Termine Tab ─────────────────────────────────────────────────────────────
const STATUS_META = {
  confirmed: { label: "Bestätigt", color: "#10B981", bg: "rgba(16,185,129,0.15)" },
  pending:   { label: "Offen",     color: "#F59E0B", bg: "rgba(245,158,11,0.15)" },
  completed: { label: "Fertig",    color: "#6366F1", bg: "rgba(99,102,241,0.15)" },
  cancelled: { label: "Storniert", color: "#EF4444", bg: "rgba(239,68,68,0.15)" },
};

const MOCK_SLOTS = ["09:00","09:30","10:00","10:30","11:00","11:30","12:00","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00"];

function buildDateStrip(numDays = 14) {
  const days = [];
  const base = new Date();
  for (let i = 0; i < numDays; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

function formatNiceDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "short" });
}

function AppointmentsTab({ appointments, onUpdate }) {
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [rescheduleAppt, setRescheduleAppt] = useState(null);
  const dateStrip = buildDateStrip(14);

  const dayAppointments = appointments
    .filter(a => a.date === selectedDate)
    .sort((a, b) => (a.time || "").localeCompare(b.time || ""));

  const statusCounts = (["confirmed","pending","completed","cancelled"]).map(st => ({
    ...STATUS_META[st], key: st, count: dayAppointments.filter(a => a.status === st).length
  })).filter(s => s.count > 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Date strip */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, WebkitOverflowScrolling: "touch" }}>
        {dateStrip.map(iso => {
          const count = appointments.filter(a => a.date === iso && a.status !== "cancelled").length;
          const isToday = iso === todayISO();
          const isSelected = iso === selectedDate;
          const d = new Date(iso + "T00:00:00");
          return (
            <button key={iso} onClick={() => setSelectedDate(iso)} style={{
              flexShrink: 0, minWidth: 52, padding: "10px 6px", borderRadius: 12, border: "none", cursor: "pointer", fontFamily: "inherit",
              background: isSelected ? "#10B981" : "rgba(255,255,255,0.04)",
              border: isSelected ? "none" : "1px solid rgba(255,255,255,0.07)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2, transition: "all 0.2s",
            }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: isSelected ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>
                {isToday ? "Heute" : d.toLocaleDateString("de-DE", { weekday: "short" })}
              </span>
              <span style={{ fontSize: 16, fontWeight: 800, color: isSelected ? "#fff" : "rgba(255,255,255,0.6)" }}>{d.getDate()}</span>
              {count > 0 && (
                <span style={{ fontSize: 8, fontWeight: 700, color: isSelected ? "#fff" : "#10B981", marginTop: 1 }}>{count} Termin{count > 1 ? "e" : ""}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Header + status summary */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>{new Date(selectedDate + "T00:00:00").toLocaleDateString("de-DE", { weekday: "long", day: "2-digit", month: "long" })}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{dayAppointments.length} Termin(e) an diesem Tag</div>
        </div>
        {statusCounts.length > 0 && (
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {statusCounts.map(s => (
              <span key={s.key} style={{ fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: s.bg, color: s.color }}>{s.count} {s.label}</span>
            ))}
          </div>
        )}
      </div>

      {/* Appointment cards */}
      {dayAppointments.length === 0 ? (
        <EmptyState icon="📅" title="Keine Termine" description="An diesem Tag sind keine Termine bei dir gebucht." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {dayAppointments.map(appt => {
            const meta = STATUS_META[appt.status] || STATUS_META.pending;
            const isCancelled = appt.status === "cancelled";
            const isCompleted = appt.status === "completed";
            return (
              <div key={appt.id} style={{
                background: "#1a2530",
                border: `1px solid ${isCancelled ? "rgba(239,68,68,0.2)" : meta.key === "pending" ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.07)"}`,
                borderRadius: 16, padding: "16px", opacity: isCancelled ? 0.55 : 1,
                boxShadow: meta.key === "pending" ? "0 2px 12px rgba(245,158,11,0.08)" : "none",
              }}>
                {/* Top row: time + customer + status */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ background: `${meta.color}1A`, border: `1px solid ${meta.color}44`, borderRadius: 12, padding: "10px 12px", textAlign: "center", minWidth: 58, flexShrink: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: meta.color }}>{appt.time}</div>
                    <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginTop: 1 }}>Uhr</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 6 }}>
                      {appt.customer_name || "Kunde"}
                      {isCancelled && <span style={{ fontSize: 11 }}>🚫</span>}
                      {isCompleted && <span style={{ fontSize: 11 }}>✅</span>}
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 3, display: "flex", alignItems: "center", gap: 6 }}>
                      <Phone size={11} /> {appt.customer_phone || "—"}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, padding: "4px 10px", borderRadius: 6, background: meta.bg, color: meta.color, display: "inline-block" }}>
                      {meta.label}
                    </span>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", fontFamily: "monospace", marginTop: 6 }}>{appt.confirmation_nr}</div>
                  </div>
                </div>

                {/* Customer wish / comment */}
                {appt.comment && (
                  <div style={{ marginTop: 12, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 10, padding: "10px 12px" }}>
                    <div style={{ fontSize: 9, fontWeight: 800, color: "#F59E0B", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>💬 Kundenwunsch</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>{appt.comment}</div>
                  </div>
                )}

                {/* Action buttons */}
                {!isCancelled && !isCompleted && (
                  <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                    {appt.status === "pending" && (
                      <button onClick={async () => { await base44.entities.Appointment.update(appt.id, { status: "confirmed" }); try { await base44.entities.CustomerNotification.create({ customer_phone: appt.customer_phone, title: "Termin bestätigt ✅", body: `Dein Termin am ${new Date(appt.date+"T00:00:00").toLocaleDateString("de-DE",{weekday:"short",day:"2-digit",month:"short"})} um ${appt.time} Uhr wurde bestätigt.`, type: "appointment_confirmed", icon: "✅", read: false }); } catch(e){} onUpdate(); }} style={{ flex: 1, padding: "10px", background: "#10B981", color: "#fff", border: "none", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>✓ Bestätigen</button>
                    )}
                    <button onClick={() => setRescheduleAppt(appt)} style={{ flex: 1, padding: "10px", background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)", color: "#818CF8", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>📅 Verschieben</button>
                    <button onClick={async () => { await base44.entities.Appointment.update(appt.id, { status: "completed" }); try { await base44.entities.CustomerNotification.create({ customer_phone: appt.customer_phone, title: "Termin abgeschlossen ✓", body: `Dein Termin am ${new Date(appt.date+"T00:00:00").toLocaleDateString("de-DE",{weekday:"short",day:"2-digit",month:"short"})} wurde als abgeschlossen markiert. Danke für deinen Besuch!`, type: "appointment_completed", icon: "✓", read: false }); } catch(e){} onUpdate(); }} style={{ flex: 1, padding: "10px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", color: "#10B981", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>✓ Fertig</button>
                    <button onClick={async () => { await base44.entities.Appointment.update(appt.id, { status: "cancelled" }); try { await base44.entities.CustomerNotification.create({ customer_phone: appt.customer_phone, title: "Termin storniert 🚫", body: `Dein Termin am ${new Date(appt.date+"T00:00:00").toLocaleDateString("de-DE",{weekday:"short",day:"2-digit",month:"short"})} um ${appt.time} Uhr wurde storniert. Bei Fragen melde dich gerne.`, type: "appointment_cancelled", icon: "🚫", read: false }); } catch(e){} onUpdate(); }} style={{ padding: "10px 14px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#EF4444", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Stornieren</button>
                  </div>
                )}

                {/* Rescheduled note */}
                {isCancelled && (
                  <div style={{ marginTop: 10, fontSize: 11, color: "rgba(239,68,68,0.6)", display: "flex", alignItems: "center", gap: 6 }}>
                    🚫 Dieser Termin wurde storniert
                  </div>
                )}
                {isCompleted && (
                  <div style={{ marginTop: 10, fontSize: 11, color: "rgba(99,102,241,0.6)", display: "flex", alignItems: "center", gap: 6 }}>
                    ✅ Dieser Termin wurde abgeschlossen
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleAppt && (
        <RescheduleModal
          appt={rescheduleAppt}
          onClose={() => setRescheduleAppt(null)}
          onReschedule={async (newDate, newTime) => {
            await base44.entities.Appointment.update(rescheduleAppt.id, { date: newDate, time: newTime, status: "confirmed" });
            try { await base44.entities.CustomerNotification.create({ customer_phone: rescheduleAppt.customer_phone, title: "Termin verschoben 📅", body: `Dein Termin wurde auf ${new Date(newDate+"T00:00:00").toLocaleDateString("de-DE",{weekday:"long",day:"2-digit",month:"long"})} um ${newTime} Uhr verschoben.`, type: "appointment_rescheduled", icon: "📅", read: false }); } catch(e){}
            setRescheduleAppt(null);
            onUpdate();
          }}
        />
      )}
    </div>
  );
}

// ── Verschieben Modal ───────────────────────────────────────────────────────
function RescheduleModal({ appt, onClose, onReschedule }) {
  const [newDate, setNewDate] = useState(appt.date);
  const [newTime, setNewTime] = useState(null);
  const dateStrip = buildDateStrip(14);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 480, background: "#111e28", borderRadius: "24px 24px 0 0", border: "1px solid rgba(255,255,255,0.1)", borderBottom: "none", padding: "24px 24px 40px" }}>
        <div style={{ width: 36, height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 100, margin: "0 auto 18px" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{ width: 40, height: 40, background: "rgba(99,102,241,0.15)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📅</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>Termin verschieben</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{appt.customer_name} · aktuell {formatNiceDate(appt.date)} {appt.time}</div>
          </div>
        </div>

        {/* Date picker */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Neues Datum</div>
          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
            {dateStrip.map(iso => {
              const isSelected = iso === newDate;
              const d = new Date(iso + "T00:00:00");
              return (
                <button key={iso} onClick={() => { setNewDate(iso); setNewTime(null); }} style={{
                  flexShrink: 0, minWidth: 56, padding: "10px 6px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit",
                  background: isSelected ? "#818CF8" : "rgba(255,255,255,0.05)",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: isSelected ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.35)" }}>{d.toLocaleDateString("de-DE", { weekday: "short" })}</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: isSelected ? "#fff" : "rgba(255,255,255,0.6)" }}>{d.getDate()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time slots */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Uhrzeit wählen</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
            {MOCK_SLOTS.map(slot => (
              <button key={slot} onClick={() => setNewTime(slot)} style={{
                padding: "10px 6px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700,
                background: newTime === slot ? "#818CF8" : "rgba(255,255,255,0.05)",
                color: newTime === slot ? "#fff" : "rgba(255,255,255,0.6)",
              }}>{slot}</button>
            ))}
          </div>
        </div>

        <button onClick={() => newTime && onReschedule(newDate, newTime)} disabled={!newTime} style={{
          width: "100%", padding: "14px", background: !newTime ? "rgba(255,255,255,0.08)" : "#818CF8", color: "#fff", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 800, cursor: newTime ? "pointer" : "not-allowed", fontFamily: "inherit",
        }}>
          {newTime ? `Verschieben auf ${formatNiceDate(newDate)} ${newTime}` : "Uhrzeit auswählen"}
        </button>
      </div>
    </div>
  );
}

// ── Stempel Tab ─────────────────────────────────────────────────────────────
function StampTab({ business }) {
  const [phone, setPhone] = useState("");
  const [customer, setCustomer] = useState(null);
  const [stamping, setStamping] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const findCustomer = async (e) => {
    e.preventDefault();
    if (!phone) return;
    try {
      setError(null);
      setResult(null);
      setCustomer(null);
      const customers = await base44.entities.Customer.filter({ phone, business_id: business.id }, "-created_date", 1);
      if (customers.length === 0) {
        setError("Kein Kunde mit dieser Nummer bei " + business.name);
        return;
      }
      setCustomer(customers[0]);
    } catch (err) {
      setError("Fehler bei der Kundensuche");
    }
  };

  const confirmStamp = async () => {
    if (!customer) return;
    try {
      setStamping(true);
      setError(null);

      // Prüfen ob heute schon gestempelt
      const today = todayISO();
      const txns = await base44.entities.StampTransaction.filter({ customer_id: customer.id, business_id: business.id }, "-created_date", 1);
      if (txns.length > 0 && txns[0].created_date.split("T")[0] === today) {
        setError("Dieser Kunde hat heute schon einen Stempel erhalten");
        setStamping(false);
        return;
      }

      // Stempel erstellen
      await base44.entities.StampTransaction.create({
        customer_id: customer.id,
        business_id: business.id,
        employee_confirmed: true,
        amount: business.min_purchase_amount
      });

      const newVisits = (customer.total_visits || 0) + 1;
      let newStamps = (customer.total_stamps || 0) + 1;
      let rewardCreated = false;

      if (newStamps >= business.stamps_required) {
        await base44.entities.Reward.create({
          customer_id: customer.id,
          business_id: business.id,
          customer_phone: customer.phone,
          reward_description: business.reward_description,
          status: "bereit"
        });
        try { await base44.entities.CustomerNotification.create({ customer_phone: customer.phone, customer_id: customer.id, title: "Prämie bereit 🎁", body: `Herzlichen Glückwunsch! Deine Prämie "${business.reward_description}" kann bei ${business.name} abgeholt werden.`, type: "reward_ready", icon: "🎁", read: false }); } catch(e){}
        rewardCreated = true;
        newStamps = 0;
      }

      const updated = await base44.entities.Customer.update(customer.id, {
        total_visits: newVisits,
        total_stamps: newStamps
      });

      // Provision prüfen
      if (updated.referred_by_customer_id) {
        const payoutsExist = await base44.entities.ReferralPayout.filter({ new_customer_id: updated.id, business_id: business.id }, "-created_date", 1);
        if (payoutsExist.length === 0 && newVisits >= business.payout_threshold_visits) {
          const minRevenue = business.min_purchase_amount * business.payout_threshold_visits;
          let amount = business.provision_type === "percentage" ? (minRevenue * business.provision_value / 100) : business.provision_value;
          await base44.entities.ReferralPayout.create({
            referrer_customer_id: updated.referred_by_customer_id,
            new_customer_id: updated.id,
            business_id: business.id,
            amount,
            status: "offen"
          });
        }
      }

      setResult({ stamps: newStamps, rewardCreated, customer: updated });
      setCustomer(null);
      setPhone("");
    } catch (err) {
      setError("Fehler beim Stempeln");
    } finally {
      setStamping(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Kunde stempeln</div>
        <form onSubmit={findCustomer} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ position: "relative" }}>
            <Phone size={16} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.25)" }} />
            <input type="tel" inputMode="numeric" placeholder="Kunden-Telefonnummer" value={phone} onChange={e => setPhone(e.target.value)} autoFocus style={{ width: "100%", padding: "14px 14px 14px 40px", background: "#1a2530", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 16, color: "#fff", fontFamily: "inherit", outline: "none" }} />
          </div>
          <button type="submit" disabled={!phone} style={{ width: "100%", padding: "13px", background: phone ? "#10B981" : "rgba(255,255,255,0.08)", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: phone ? "pointer" : "not-allowed", fontFamily: "inherit" }}>Kunde suchen</button>
        </form>
      </div>

      {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 12, padding: "12px 14px", fontSize: 13, color: "#EF4444", fontWeight: 600 }}>{error}</div>}

      {customer && (
        <div style={{ background: "#1a2530", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 16, padding: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{customer.name?.[0] || "K"}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{customer.name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{customer.phone}</div>
            </div>
          </div>

          {/* Stamp progress */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Aktuelle Stempelkarte</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#10B981" }}>{customer.total_stamps}/{business.stamps_required}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(business.stamps_required, 8)}, 1fr)`, gap: 5 }}>
              {Array.from({ length: business.stamps_required }).map((_, i) => (
                <div key={i} style={{ aspectRatio: "1/1", borderRadius: 6, background: i < customer.total_stamps ? "#10B981" : "rgba(255,255,255,0.07)", border: i < customer.total_stamps ? "none" : "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", fontWeight: 700 }}>
                  {i < customer.total_stamps ? "✓" : ""}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: "rgba(245,158,11,0.7)", marginTop: 8 }}>🎁 {business.reward_description}</div>
          </div>

          <button onClick={confirmStamp} disabled={stamping} style={{ width: "100%", padding: "14px", background: stamping ? "rgba(16,185,129,0.5)" : "#10B981", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: stamping ? "not-allowed" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {stamping ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Check size={16} />} Stempel bestätigen
          </button>
        </div>
      )}

      {result && (
        <div style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))", border: "1.5px solid rgba(16,185,129,0.4)", borderRadius: 16, padding: "20px", textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Stempel bestätigt!</div>
          {result.rewardCreated ? (
            <div style={{ fontSize: 13, color: "#F59E0B", fontWeight: 700, marginTop: 8 }}>🎁 Prämie freigeschaltet: {business.reward_description}</div>
          ) : (
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>Neuer Fortschritt: {result.stamps}/{business.stamps_required}</div>
          )}
          <button onClick={() => setResult(null)} style={{ marginTop: 14, padding: "10px 20px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Weiteren Kunden stempeln</button>
        </div>
      )}
    </div>
  );
}

// ── Prämien Tab ─────────────────────────────────────────────────────────────
function RewardsTab({ rewards, onUpdate }) {
  if (rewards.length === 0) {
    return <EmptyState icon="🎁" title="Keine offenen Prämien" description="Es gibt aktuell keine Prämien, die abgeholt werden können." />;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{rewards.length} offene Prämie(n)</div>
      {rewards.map(rw => (
        <div key={rw.id} style={{ background: "#1a2530", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 16, padding: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, background: "rgba(16,185,129,0.15)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🎁</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{rw.reward_description}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{rw.customer_phone}</div>
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, padding: "4px 10px", borderRadius: 6, background: "rgba(16,185,129,0.15)", color: "#10B981" }}>Bereit</span>
          </div>
          <button onClick={async () => { await base44.entities.Reward.update(rw.id, { status: "eingelöst" }); onUpdate(); }} style={{ width: "100%", padding: "10px", background: "#10B981", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Als eingelöst markieren</button>
        </div>
      ))}
    </div>
  );
}

// ── Benachrichtigungen Tab ───────────────────────────────────────────────────
function NotificationsTab({ employee, onUpdate }) {
  const [toggling, setToggling] = useState(null);

  const toggle = async (key, currentVal) => {
    try {
      setToggling(key);
      await base44.entities.Employee.update(employee.id, { [key]: !currentVal });
      onUpdate();
    } catch (err) {
      // silent
    } finally {
      setToggling(null);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Deine Benachrichtigungen</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>Hier siehst du, über welche Ereignisse du informiert wirst. Dein Geschäftsinhaber kann diese ebenfalls anpassen.</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {NOTIFICATION_LABELS.map(n => {
          const enabled = employee[n.key];
          return (
            <div key={n.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#1a2530", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: enabled ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{n.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{n.label}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{n.desc}</div>
                </div>
              </div>
              <button onClick={() => toggle(n.key, enabled)} disabled={toggling === n.key} style={{ width: 44, height: 24, borderRadius: 100, border: "none", cursor: "pointer", background: enabled ? "#10B981" : "rgba(255,255,255,0.15)", position: "relative", transition: "background 0.2s", flexShrink: 0, opacity: toggling === n.key ? 0.5 : 1 }}>
                <div style={{ position: "absolute", top: 2, left: enabled ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 14, padding: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 16 }}>📬</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#6366F1" }}>Wie erhältst du Benachrichtigungen?</span>
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>Benachrichtigungen erscheinen direkt in der App und als E-Mail an <span style={{ color: "#fff", fontWeight: 600 }}>{employee?.email || "deine Adresse"}</span>.</div>
      </div>
    </div>
  );
}