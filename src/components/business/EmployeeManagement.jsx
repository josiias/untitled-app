import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";

const EMPLOYEE_COLORS = ["#10B981", "#EC4899", "#8B5CF6", "#F59E0B", "#06B6D4", "#F472B6", "#34D399", "#FB923C"];

const NOTIFICATION_CONFIG = [
  { key: "notify_new_appointment", icon: "📅", label: "Neuer Termin gebucht", desc: "Wenn ein Kunde einen Termin bucht" },
  { key: "notify_cancellation", icon: "❌", label: "Termin storniert", desc: "Wenn ein Kunde absagt" },
  { key: "notify_stamp_confirmation", icon: "✅", label: "Stempel bestätigt", desc: "Bei jedem bestätigten Stempel" },
  { key: "notify_reward_ready", icon: "🎁", label: "Prämie bereit", desc: "Wenn eine Belohnung abholbereit ist" },
  { key: "notify_daily_summary", icon: "📊", label: "Tägliche Zusammenfassung", desc: "Morgens Überblick der heutigen Termine" },
];

export default function EmployeeManagement({ businessId, businessName }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expandedEmp, setExpandedEmp] = useState(null);
  const [form, setForm] = useState({ name: "", role: "", email: "", photo_url: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const emps = await base44.entities.Employee.filter({ business_id: businessId }, "-created_date");
      setEmployees(emps);
    } catch (err) {
      setError("Fehler beim Laden der Mitarbeiter");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEmployees(); }, [businessId]);

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    try {
      setSubmitting(true);
      setError(null);

      // Prüfen ob schon ein Mitarbeiter mit dieser E-Mail existiert
      const existing = await base44.entities.Employee.filter({ business_id: businessId, email: form.email }, "-created_date", 1);
      if (existing.length > 0) {
        setError("Ein Mitarbeiter mit dieser E-Mail existiert bereits.");
        setSubmitting(false);
        return;
      }

      // User einladen (Rolle "user")
      try {
        await base44.users.inviteUser(form.email, "user");
      } catch (inviteErr) {
        // Wenn der User schon existiert, ist das kein Fehler — er kann trotzdem verknüpft werden
        console.log("Invite status:", inviteErr);
      }

      // Employee-Datensatz erstellen
      await base44.entities.Employee.create({
        name: form.name,
        role: form.role || "Mitarbeiter",
        business_id: businessId,
        email: form.email,
        photo_url: form.photo_url || "",
        color: EMPLOYEE_COLORS[employees.length % EMPLOYEE_COLORS.length],
        active: true,
        notify_new_appointment: true,
        notify_cancellation: true,
        notify_stamp_confirmation: false,
        notify_reward_ready: true,
        notify_daily_summary: true,
      });

      setSuccess(`${form.name} wurde eingeladen und als Mitarbeiter hinzugefügt.`);
      setForm({ name: "", role: "", email: "", photo_url: "" });
      setShowForm(false);
      setTimeout(() => setSuccess(null), 4000);
      loadEmployees();
    } catch (err) {
      setError(err.message || "Fehler beim Anlegen des Mitarbeiters");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleNotification = async (empId, key, currentVal) => {
    try {
      await base44.entities.Employee.update(empId, { [key]: !currentVal });
      setEmployees(prev => prev.map(e => e.id === empId ? { ...e, [key]: !currentVal } : e));
    } catch (err) {
      setError("Fehler beim Aktualisieren");
    }
  };

  const toggleActive = async (emp) => {
    try {
      await base44.entities.Employee.update(emp.id, { active: !emp.active });
      setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, active: !emp.active } : e));
    } catch (err) {
      setError("Fehler beim Aktualisieren");
    }
  };

  if (loading) return <LoadingState lines={3} height={70} />;

  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 28, marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <div>
          <div style={{ fontWeight: 700, color: "#fff", fontSize: 16 }}>👥 Team-Verwaltung</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>Mitarbeiter anlegen, einladen & Benachrichtigungen verwalten</div>
        </div>
        <button onClick={() => setShowForm(v => !v)} style={{ background: showForm ? "rgba(255,255,255,0.06)" : "#10B981", color: showForm ? "rgba(255,255,255,0.6)" : "#fff", border: "none", borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          {showForm ? "Abbrechen" : "+ Mitarbeiter"}
        </button>
      </div>

      {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#EF4444", fontWeight: 600, marginTop: 12 }}>{error}</div>}
      {success && <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#10B981", fontWeight: 600, marginTop: 12 }}>{success}</div>}

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleAddEmployee} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 18, marginTop: 16, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="two-col">
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>Name *</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="z.B. Yara K." required style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.12)", borderRadius: 8, fontSize: 14, color: "#fff", fontFamily: "inherit", outline: "none" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>Rolle / Position</label>
              <input type="text" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="z.B. Senior Stylistin" style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.12)", borderRadius: 8, fontSize: 14, color: "#fff", fontFamily: "inherit", outline: "none" }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>E-Mail (für Login) *</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="yara@kings-barbershop.de" required style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.12)", borderRadius: 8, fontSize: 14, color: "#fff", fontFamily: "inherit", outline: "none" }} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>Foto URL (optional)</label>
            <input type="text" value={form.photo_url} onChange={e => setForm({ ...form, photo_url: e.target.value })} placeholder="https://..." style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.12)", borderRadius: 8, fontSize: 14, color: "#fff", fontFamily: "inherit", outline: "none" }} />
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>ℹ️ Der Mitarbeiter erhält eine Einladung per E-Mail und kann sich danach unter <span style={{ color: "#10B981", fontWeight: 600 }}>/employee</span> einloggen.</div>
          <button type="submit" disabled={submitting} style={{ padding: "12px", background: submitting ? "rgba(16,185,129,0.5)" : "#10B981", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
            {submitting ? "Wird eingeladen..." : "Mitarbeiter einladen & hinzufügen"}
          </button>
        </form>
      )}

      {/* Employee List */}
      {employees.length === 0 && !showForm ? (
        <div style={{ marginTop: 16 }}>
          <EmptyState icon="👥" title="Noch kein Team" description="Lade deine Mitarbeiter ein. Sie bekommen eigenen Zugriff auf Termine und Stempel-Funktionen." />
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
          {employees.map(emp => {
            const isExpanded = expandedEmp === emp.id;
            return (
              <div key={emp.id} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${isExpanded ? emp.color || "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: 14, overflow: "hidden" }}>
                {/* Employee row */}
                <div onClick={() => setExpandedEmp(isExpanded ? null : emp.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", overflow: "hidden", background: `${emp.color || "#10B981"}22`, border: `2px solid ${emp.color || "#10B981"}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: emp.color || "#10B981", flexShrink: 0 }}>
                    {emp.photo_url ? <img src={emp.photo_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : emp.name?.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{emp.name}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{emp.role} · {emp.email}</div>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: emp.active ? "rgba(16,185,129,0.15)" : "rgba(100,116,139,0.15)", color: emp.active ? "#10B981" : "rgba(255,255,255,0.4)" }}>
                    {emp.active ? "Aktiv" : "Inaktiv"}
                  </span>
                  <div style={{ fontSize: 16, color: "rgba(255,255,255,0.3)", marginLeft: 4 }}>{isExpanded ? "▲" : "🔔"}</div>
                </div>

                {/* Notification settings */}
                {isExpanded && (
                  <div style={{ padding: "0 16px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase", margin: "14px 0 10px" }}>Benachrichtigungen</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {NOTIFICATION_CONFIG.map(n => {
                        const enabled = emp[n.key];
                        return (
                          <div key={n.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "10px 12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                              <span style={{ fontSize: 16, flexShrink: 0 }}>{n.icon}</span>
                              <div>
                                <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{n.label}</div>
                                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{n.desc}</div>
                              </div>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); toggleNotification(emp.id, n.key, enabled); }} style={{ width: 40, height: 22, borderRadius: 100, border: "none", cursor: "pointer", background: enabled ? "#10B981" : "rgba(255,255,255,0.15)", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
                              <div style={{ position: "absolute", top: 2, left: enabled ? 20 : 2, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Status toggle + dashboard link */}
                    <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                      <button onClick={() => toggleActive(emp)} style={{ flex: 1, padding: "10px", background: emp.active ? "rgba(239,68,68,0.08)" : "rgba(16,185,129,0.08)", border: `1px solid ${emp.active ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.2)"}`, borderRadius: 10, fontSize: 12, fontWeight: 700, color: emp.active ? "rgba(239,68,68,0.7)" : "#10B981", cursor: "pointer", fontFamily: "inherit" }}>
                        {emp.active ? "Deaktivieren" : "Aktivieren"}
                      </button>
                      <a href="/employee" target="_blank" style={{ flex: 1, textAlign: "center", padding: "10px", background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 10, fontSize: 12, fontWeight: 700, color: "#6366F1", textDecoration: "none", fontFamily: "inherit" }}>
                        Dashboard ansehen →
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}