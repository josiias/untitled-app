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

      // Heutige Termine
      const appts = await base44.entities.Appointment.filter({
        employee_id: emp.id,
        date: todayISO()
      }, "time");
      setAppointments(appts);

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
function AppointmentsTab({ appointments, onUpdate }) {
  if (appointments.length === 0) {
    return <EmptyState icon="📅" title="Keine Termine heute" description="Für heute sind keine Termine bei dir gebucht." />;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>
        {appointments.length} Termin(e) heute · {new Date().toLocaleDateString("de-DE", { weekday: "long", day: "2-digit", month: "long" })}
      </div>
      {appointments.map(appt => (
        <div key={appt.id} style={{ background: "#1a2530", border: `1px solid ${appt.status === "cancelled" ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.07)"}`, borderRadius: 16, padding: "14px 16px", opacity: appt.status === "cancelled" ? 0.5 : 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ background: "rgba(16,185,129,0.12)", borderRadius: 12, padding: "10px 12px", textAlign: "center", minWidth: 56 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#10B981" }}>{appt.time}</div>
              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Uhr</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{appt.customer_name || "Kunde"}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{appt.customer_phone}</div>
              {appt.comment && (
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 6, background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "6px 8px" }}>💬 {appt.comment}</div>
              )}
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", fontFamily: "monospace", marginBottom: 6 }}>{appt.confirmation_nr}</div>
              <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 6,
                background: appt.status === "confirmed" ? "rgba(16,185,129,0.15)" : appt.status === "pending" ? "rgba(245,158,11,0.15)" : appt.status === "completed" ? "rgba(99,102,241,0.15)" : "rgba(239,68,68,0.15)",
                color: appt.status === "confirmed" ? "#10B981" : appt.status === "pending" ? "#F59E0B" : appt.status === "completed" ? "#6366F1" : "#EF4444" }}>
                {appt.status === "confirmed" ? "Bestätigt" : appt.status === "pending" ? "Offen" : appt.status === "completed" ? "Fertig" : "Storniert"}
              </span>
            </div>
          </div>
          {/* Action buttons */}
          {appt.status !== "cancelled" && appt.status !== "completed" && (
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              {appt.status === "pending" && (
                <button onClick={async () => { await base44.entities.Appointment.update(appt.id, { status: "confirmed" }); onUpdate(); }} style={{ flex: 1, padding: "9px", background: "#10B981", color: "#fff", border: "none", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Bestätigen</button>
              )}
              <button onClick={async () => { await base44.entities.Appointment.update(appt.id, { status: "completed" }); onUpdate(); }} style={{ flex: 1, padding: "9px", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#6366F1", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Abschließen</button>
              <button onClick={async () => { await base44.entities.Appointment.update(appt.id, { status: "cancelled" }); onUpdate(); }} style={{ padding: "9px 14px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#EF4444", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Stornieren</button>
            </div>
          )}
        </div>
      ))}
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