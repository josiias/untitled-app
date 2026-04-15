import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from "recharts";

const DEMO_BUSINESS_ID = "demo-kings-barbershop-001";

export default function BusinessAnalytics() {
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [c, t, p] = await Promise.all([
          base44.entities.Customer.filter({ business_id: DEMO_BUSINESS_ID }),
          base44.entities.StampTransaction.filter({ business_id: DEMO_BUSINESS_ID }),
          base44.entities.ReferralPayout.filter({ business_id: DEMO_BUSINESS_ID }),
        ]);
        setCustomers(c);
        setTransactions(t);
        setPayouts(p);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Berechnungen ──────────────────────────────────────────────────────
  const totalRevenue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const activeCustomers = customers.filter(c => c.total_visits > 0).length;
  const openPayouts = payouts.filter(p => p.status === "offen").reduce((s, p) => s + p.amount, 0);
  const paidPayouts = payouts.filter(p => p.status === "ausgezahlt").reduce((s, p) => s + p.amount, 0);

  // Stempel pro Tag (letzte 7 Tage)
  const stampsByDay = (() => {
    const days = {};
    const labels = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("de-DE", { weekday: "short" });
      days[key] = 0;
      labels.push({ key, label });
    }
    transactions.forEach(t => {
      const day = (t.created_date || "").split("T")[0];
      if (days[day] !== undefined) days[day]++;
    });
    return labels.map(({ key, label }) => ({ day: label, stempel: days[key] }));
  })();

  // Kunden-Wachstum pro Tag (letzte 7 Tage)
  const customersByDay = (() => {
    const days = {};
    const labels = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("de-DE", { weekday: "short" });
      days[key] = 0;
      labels.push({ key, label });
    }
    customers.forEach(c => {
      const day = (c.created_date || "").split("T")[0];
      if (days[day] !== undefined) days[day]++;
    });
    return labels.map(({ key, label }) => ({ day: label, neu: days[key] }));
  })();

  // Top-Kunden nach Stempeln
  const topCustomers = [...customers]
    .sort((a, b) => (b.total_stamps || 0) - (a.total_stamps || 0))
    .slice(0, 5);

  const STATS = [
    { label: "Aktive Kunden", value: activeCustomers, icon: "👥", color: "#10B981" },
    { label: "Stempel gesamt", value: transactions.length, icon: "🎫", color: "#F59E0B" },
    { label: "Umsatz (gesamt)", value: `${totalRevenue.toFixed(0)}€`, icon: "💰", color: "#3B82F6" },
    { label: "Prov. offen", value: `${openPayouts.toFixed(0)}€`, icon: "💸", color: "#EC4899" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A1612",
      fontFamily: "'Inter', sans-serif",
      color: "#fff",
      padding: "0 0 60px"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Bricolage+Grotesque:wght@700;800&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      {/* Header */}
      <div style={{ background: "rgba(10,22,18,0.9)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 24px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <a href="/Business" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 12px", color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, textDecoration: "none", cursor: "pointer" }}>← Zurück</a>
            <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.1)" }} />
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 800, color: "#fff" }}>📈 Analyse</div>
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Kings Barbershop</div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px" }}>

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.3)", fontSize: 14 }}>Daten werden geladen…</div>
        ) : (
          <>
            {/* KPI Karten */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 28 }}>
              {STATS.map((s) => (
                <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px 22px" }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 28, fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>

              {/* Stempel pro Tag */}
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px 22px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 16 }}>🎫 Stempel pro Tag (7 Tage)</div>
                {transactions.length === 0 ? (
                  <EmptyState text="Noch keine Stempel vergeben" />
                ) : (
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={stampsByDay} barSize={20}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip contentStyle={{ background: "#1a2530", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 12 }} />
                      <Bar dataKey="stempel" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Neue Kunden */}
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px 22px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 16 }}>👥 Neue Kunden pro Tag (7 Tage)</div>
                {customers.length === 0 ? (
                  <EmptyState text="Noch keine Kunden" />
                ) : (
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={customersByDay}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip contentStyle={{ background: "#1a2530", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 12 }} />
                      <Line dataKey="neu" stroke="#F59E0B" strokeWidth={2} dot={{ fill: "#F59E0B", r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Provisions-Übersicht */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px 22px", marginBottom: 28 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 16 }}>💸 Provisions-Übersicht</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#10B981" }}>{payouts.length}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Empfehlungen gesamt</div>
                </div>
                <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#F59E0B" }}>{openPayouts.toFixed(2)}€</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Ausstehend</div>
                </div>
                <div style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#3B82F6" }}>{paidPayouts.toFixed(2)}€</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Ausgezahlt</div>
                </div>
              </div>

              {/* Payout Liste */}
              {payouts.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  {payouts.map((p, i) => (
                    <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < payouts.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Empfehlung #{i + 1}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{p.amount?.toFixed(2)}€</div>
                        <div style={{ padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: p.status === "ausgezahlt" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)", color: p.status === "ausgezahlt" ? "#10B981" : "#F59E0B" }}>
                          {p.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Kunden */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px 22px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 16 }}>🏆 Top Kunden</div>
              {topCustomers.length === 0 ? (
                <EmptyState text="Noch keine Kunden vorhanden" />
              ) : (
                topCustomers.map((c, i) => (
                  <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < topCustomers.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                    <div style={{ width: 28, height: 28, background: i === 0 ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.05)", border: i === 0 ? "1px solid #F59E0B" : "1px solid rgba(255,255,255,0.1)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: i === 0 ? "#F59E0B" : "rgba(255,255,255,0.4)", flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{c.name || c.phone}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{c.total_visits} Besuche</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#10B981" }}>{c.total_stamps} 🎫</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.2)", fontSize: 13 }}>
      {text}
    </div>
  );
}