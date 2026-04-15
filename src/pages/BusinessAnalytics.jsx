import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend
} from "recharts";

const DEMO_BUSINESS_ID = "demo-kings-barbershop-001";

// ── Demo-Daten falls DB leer ──────────────────────────────────────────────────
const DEMO_STAMPS_BY_DAY = [
  { day: "Mo", stempel: 4 },
  { day: "Di", stempel: 7 },
  { day: "Mi", stempel: 5 },
  { day: "Do", stempel: 12 },
  { day: "Fr", stempel: 18 },
  { day: "Sa", stempel: 23 },
  { day: "So", stempel: 9 },
];

const DEMO_CUSTOMERS_BY_WEEK = [
  { woche: "KW 11", neu: 8 },
  { woche: "KW 12", neu: 14 },
  { woche: "KW 13", neu: 11 },
  { woche: "KW 14", neu: 19 },
  { woche: "KW 15", neu: 23 },
];

const DEMO_REVENUE_BY_WEEK = [
  { woche: "KW 11", umsatz: 320 },
  { woche: "KW 12", umsatz: 560 },
  { woche: "KW 13", umsatz: 440 },
  { woche: "KW 14", umsatz: 760 },
  { woche: "KW 15", umsatz: 920 },
];

const DEMO_STAMP_PROGRESS = [
  { name: "1–2 Stempel", value: 18, color: "#3B82F6" },
  { name: "3–5 Stempel", value: 31, color: "#F59E0B" },
  { name: "6–7 Stempel", value: 12, color: "#EC4899" },
  { name: "Voll (8)", value: 6, color: "#10B981" },
];

const DEMO_TOP_CUSTOMERS = [
  { name: "Mehmet B.", total_stamps: 34, total_visits: 12, phone: "" },
  { name: "Jonas W.", total_stamps: 27, total_visits: 9, phone: "" },
  { name: "Sara K.", total_stamps: 21, total_visits: 7, phone: "" },
  { name: "Fatima A.", total_stamps: 16, total_visits: 5, phone: "" },
  { name: "Lukas M.", total_stamps: 11, total_visits: 4, phone: "" },
];

// ── Custom Tooltip ─────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, unit = "" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1a2530", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#fff" }}>
      <div style={{ color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontWeight: 700 }}>{p.value}{unit}</div>
      ))}
    </div>
  );
};

// ── Chart Card Wrapper ─────────────────────────────────────────────────────────
function ChartCard({ title, subtitle, children }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "22px 24px" }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

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

  // Ob wir Demo-Daten zeigen (DB leer)
  const useDemoData = transactions.length === 0 && customers.length === 0;

  // ── Live-Berechnungen ─────────────────────────────────────────────────────
  const totalRevenue = transactions.reduce((s, t) => s + (t.amount || 0), 0);
  const activeCustomers = customers.filter(c => c.total_visits > 0).length;
  const openPayouts = payouts.filter(p => p.status === "offen").reduce((s, p) => s + p.amount, 0);
  const paidPayouts = payouts.filter(p => p.status === "ausgezahlt").reduce((s, p) => s + p.amount, 0);

  // Stempel pro Tag (letzte 7 Tage) aus echten Daten
  const liveStampsByDay = (() => {
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

  const stampsByDay = useDemoData ? DEMO_STAMPS_BY_DAY : liveStampsByDay;
  const topCustomers = useDemoData ? DEMO_TOP_CUSTOMERS : [...customers].sort((a, b) => (b.total_stamps || 0) - (a.total_stamps || 0)).slice(0, 5);

  const STATS = [
    { label: "Aktive Kunden", value: useDemoData ? "142" : activeCustomers, icon: "👥", color: "#10B981", sub: "letzte 30 Tage" },
    { label: "Stempel gesamt", value: useDemoData ? "1.847" : transactions.length, icon: "🎫", color: "#F59E0B", sub: "seit Start" },
    { label: "Ø Stempel / Kunde", value: useDemoData ? "13" : (customers.length ? (transactions.length / customers.length).toFixed(1) : 0), icon: "📊", color: "#3B82F6", sub: "Durchschnitt" },
    { label: "Prov. ausstehend", value: useDemoData ? "87,50€" : `${openPayouts.toFixed(0)}€`, icon: "💸", color: "#EC4899", sub: `${useDemoData ? "42,50€" : paidPayouts.toFixed(0) + "€"} ausgezahlt` },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0A1612", fontFamily: "'Inter', sans-serif", color: "#fff", paddingBottom: 60 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Bricolage+Grotesque:wght@700;800;900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 0; }
      `}</style>

      {/* Header */}
      <div style={{ background: "rgba(10,22,18,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 24px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a href="/Business" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 12px", color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>← Zurück</a>
            <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.1)" }} />
            <div>
              <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 17, fontWeight: 900, color: "#fff" }}>📈 Analyse</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>Kings Barbershop</div>
            </div>
          </div>
          {useDemoData && (
            <div style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 600, color: "#F59E0B" }}>
              Demo-Daten
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "28px 24px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.3)", fontSize: 14 }}>Wird geladen…</div>
        ) : (
          <>
            {/* ── KPI Karten ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
              {STATS.map((s) => (
                <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "20px 20px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: `${s.color}18`, pointerEvents: "none" }} />
                  <div style={{ fontSize: 20, marginBottom: 10 }}>{s.icon}</div>
                  <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 26, fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "#fff", fontWeight: 600, marginTop: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* ── Hauptcharts: Stempel + Umsatz ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>

              <ChartCard title="🎫 Stempel pro Tag" subtitle="Letzte 7 Tage — Scanaktivität">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={stampsByDay} barSize={24}>
                    <defs>
                      <linearGradient id="stampGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity={1} />
                        <stop offset="100%" stopColor="#10B981" stopOpacity={0.4} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip unit=" Stempel" />} />
                    <Bar dataKey="stempel" fill="url(#stampGrad)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="💰 Umsatz-Trend" subtitle="Letzte 5 Wochen (Mindestkäufe)">
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={useDemoData ? DEMO_REVENUE_BY_WEEK : []}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="woche" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip unit="€" />} />
                    <Area dataKey="umsatz" stroke="#3B82F6" strokeWidth={2.5} fill="url(#revenueGrad)" dot={{ fill: "#3B82F6", r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* ── Kundenwachstum + Stempel-Verteilung ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>

              <ChartCard title="👥 Neukunden-Wachstum" subtitle="Pro Woche — kumulierter Zuwachs">
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={useDemoData ? DEMO_CUSTOMERS_BY_WEEK : []}>
                    <defs>
                      <linearGradient id="custGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="woche" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip unit=" Kunden" />} />
                    <Area dataKey="neu" stroke="#F59E0B" strokeWidth={2.5} fill="url(#custGrad)" dot={{ fill: "#F59E0B", r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="🥧 Stempel-Fortschritt" subtitle="Verteilung deiner Kunden nach Stempelanzahl">
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <ResponsiveContainer width={160} height={160}>
                    <PieChart>
                      <Pie data={DEMO_STAMP_PROGRESS} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
                        {DEMO_STAMP_PROGRESS.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: "#1a2530", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                    {DEMO_STAMP_PROGRESS.map((d, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color, flexShrink: 0 }} />
                        <div style={{ flex: 1, fontSize: 11, color: "rgba(255,255,255,0.55)" }}>{d.name}</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: d.color }}>{d.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </ChartCard>
            </div>

            {/* ── Top Kunden ── */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "22px 24px" }}>
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>🏆 Top Kunden</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>Sortiert nach gesammelten Stempeln</div>
              </div>
              {topCustomers.map((c, i) => {
                const maxStamps = topCustomers[0]?.total_stamps || 1;
                const pct = Math.round(((c.total_stamps || 0) / maxStamps) * 100);
                const colors = ["#F59E0B", "#94A3B8", "#CD7F32", "#10B981", "#3B82F6"];
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", borderBottom: i < topCustomers.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                    <div style={{ width: 28, height: 28, background: `${colors[i]}22`, border: `1px solid ${colors[i]}55`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: colors[i], flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{c.name || c.phone}</span>
                        <span style={{ fontSize: 12, fontWeight: 800, color: colors[i] }}>{c.total_stamps} 🎫</span>
                      </div>
                      <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 100, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${colors[i]}88, ${colors[i]})`, borderRadius: 100, transition: "width 0.6s ease" }} />
                      </div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>{c.total_visits} Besuche</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}