import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from "recharts";

// ── Demo-Daten ────────────────────────────────────────────────────────────────
const MAIN_CHART_DATA = [
  { tag: "Mo 7. Apr", stempel: 4, kunden: 2, umsatz: 80 },
  { tag: "Di 8. Apr", stempel: 7, kunden: 5, umsatz: 140 },
  { tag: "Mi 9. Apr", stempel: 5, kunden: 3, umsatz: 100 },
  { tag: "Do 10. Apr", stempel: 12, kunden: 9, umsatz: 240 },
  { tag: "Fr 11. Apr", stempel: 18, kunden: 14, umsatz: 360 },
  { tag: "Sa 12. Apr", stempel: 23, kunden: 19, umsatz: 460 },
  { tag: "So 13. Apr", stempel: 9, kunden: 7, umsatz: 180 },
  { tag: "Mo 14. Apr", stempel: 11, kunden: 8, umsatz: 220 },
  { tag: "Di 15. Apr", stempel: 15, kunden: 11, umsatz: 300 },
];

const STAMP_PROGRESS_DATA = [
  { name: "Gerade gestartet\n(1–2 Stempel)", value: 18, color: "#3B82F6" },
  { name: "Auf halbem Weg\n(3–5 Stempel)", value: 31, color: "#F59E0B" },
  { name: "Fast geschafft\n(6–7 Stempel)", value: 12, color: "#EC4899" },
  { name: "Prämie bereit\n(alle 8)", value: 6, color: "#10B981" },
];

const TOP_KUNDEN = [
  { name: "Mehmet B.", stempel: 34, besuche: 12 },
  { name: "Jonas W.", stempel: 27, besuche: 9 },
  { name: "Sara K.", stempel: 21, besuche: 7 },
  { name: "Fatima A.", stempel: 16, besuche: 5 },
  { name: "Lukas M.", stempel: 11, besuche: 4 },
];

const RANG_FARBEN = ["#F59E0B", "#94A3B8", "#CD7F32", "#10B981", "#3B82F6"];

// ── Tooltip ────────────────────────────────────────────────────────────────────
function InfoTooltip({ text }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center", marginLeft: 6 }}>
      <span
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onTouchStart={() => setShow(v => !v)}
        style={{
          width: 16, height: 16, borderRadius: "50%",
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.5)",
          cursor: "pointer", userSelect: "none", flexShrink: 0,
        }}
      >i</span>
      {show && (
        <span style={{
          position: "absolute", bottom: "calc(100% + 8px)", left: "50%",
          transform: "translateX(-50%)", background: "#1a2d3a",
          border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)",
          fontSize: 12, lineHeight: 1.55, padding: "10px 14px", borderRadius: 10,
          whiteSpace: "normal", width: 220, zIndex: 50,
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)", pointerEvents: "none",
        }}>{text}</span>
      )}
    </span>
  );
}

// ── Custom Chart Tooltip ───────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1a2d3a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 16px", fontSize: 12 }}>
      <div style={{ color: "rgba(255,255,255,0.5)", marginBottom: 6, fontWeight: 600 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontWeight: 700, marginBottom: 2 }}>
          {p.name}: <span style={{ color: "#fff" }}>{p.value}{p.name === "Umsatz" ? "€" : ""}</span>
        </div>
      ))}
    </div>
  );
};

// ── Haupt-Komponente ───────────────────────────────────────────────────────────
export default function BusinessAnalytics() {
  const [activeMetric, setActiveMetric] = useState("stempel");

  const metricConfig = {
    stempel: { label: "Stempel", color: "#10B981", name: "Stempel" },
    kunden:  { label: "Kunden",  color: "#F59E0B", name: "Kunden" },
    umsatz:  { label: "Umsatz",  color: "#3B82F6", name: "Umsatz" },
  };
  const m = metricConfig[activeMetric];

  const totalStempel = MAIN_CHART_DATA.reduce((s, d) => s + d.stempel, 0);
  const totalKunden  = MAIN_CHART_DATA.reduce((s, d) => s + d.kunden, 0);
  const totalUmsatz  = MAIN_CHART_DATA.reduce((s, d) => s + d.umsatz, 0);

  return (
    <div style={{ minHeight: "100vh", background: "#0A1612", fontFamily: "'Inter', sans-serif", color: "#fff", paddingBottom: 60 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Bricolage+Grotesque:wght@700;800;900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 0; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ background: "rgba(10,22,18,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 24px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a href="/Business" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 12px", color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>← Zurück</a>
            <div style={{ width: 1, height: 22, background: "rgba(255,255,255,0.1)" }} />
            <div>
              <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 900, color: "#fff" }}>Meine Auswertung</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginLeft: 10 }}>Kings Barbershop · letzte 9 Tage</span>
            </div>
          </div>
          <div style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 8, padding: "4px 10px", fontSize: 10, fontWeight: 700, color: "#F59E0B" }}>Demo</div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 24px" }}>

        {/* ── GROSSER HAUPT-CHART ── */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "24px 28px", marginBottom: 20 }}>

          {/* Chart-Kopf: Zusammenfassung + Umschalter */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 4 }}>
                Was ist letzte Woche passiert?
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Klicke auf eine Kategorie um den Chart zu wechseln</div>
            </div>
            {/* Metric-Switcher */}
            <div style={{ display: "flex", gap: 8 }}>
              {Object.entries(metricConfig).map(([key, cfg]) => (
                <button key={key} onClick={() => setActiveMetric(key)} style={{
                  padding: "8px 16px", borderRadius: 10, border: "none", cursor: "pointer",
                  fontFamily: "inherit", fontSize: 12, fontWeight: 700,
                  background: activeMetric === key ? cfg.color : "rgba(255,255,255,0.06)",
                  color: activeMetric === key ? "#fff" : "rgba(255,255,255,0.4)",
                  transition: "all 0.2s",
                }}>{cfg.label}</button>
              ))}
            </div>
          </div>

          {/* Schnellzahlen */}
          <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
            {[
              { label: "Stempel vergeben", value: totalStempel, color: "#10B981", active: activeMetric === "stempel", key: "stempel" },
              { label: "Neue Scan-Kunden", value: totalKunden, color: "#F59E0B", active: activeMetric === "kunden", key: "kunden" },
              { label: "Mindestumsatz", value: `${totalUmsatz}€`, color: "#3B82F6", active: activeMetric === "umsatz", key: "umsatz" },
            ].map(s => (
              <div key={s.key} onClick={() => setActiveMetric(s.key)} style={{ cursor: "pointer", borderLeft: `3px solid ${s.active ? s.color : "rgba(255,255,255,0.08)"}`, paddingLeft: 12, transition: "all 0.2s" }}>
                <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 24, fontWeight: 900, color: s.active ? s.color : "rgba(255,255,255,0.4)" }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Der Chart */}
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={MAIN_CHART_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="mainGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={m.color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={m.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="tag" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area dataKey={activeMetric} name={m.name} stroke={m.color} strokeWidth={2.5} fill="url(#mainGrad)" dot={{ fill: m.color, r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ── UNTERE KLEINE KARTEN ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>

          {/* Treue-Verteilung (Donut) */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "20px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Wie treu sind meine Kunden?</span>
              <InfoTooltip text="Zeigt, wie weit deine Kunden auf ihrer Stempelkarte sind. Je mehr im grünen Bereich, desto loyaler deine Kundschaft." />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <ResponsiveContainer width={100} height={100}>
                <PieChart>
                  <Pie data={STAMP_PROGRESS_DATA} cx="50%" cy="50%" innerRadius={28} outerRadius={46} paddingAngle={3} dataKey="value">
                    {STAMP_PROGRESS_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                {STAMP_PROGRESS_DATA.map((d, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", flex: 1 }}>{d.name.split("\n")[0]}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: d.color }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Empfehlungen */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "20px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Empfehlungs-Einnahmen</span>
              <InfoTooltip text="Wenn ein Kunde einen Freund empfiehlt und dieser mindestens 3x kommt, verdient der Empfehler eine Provision. Hier siehst du, was du dafür ausgibst." />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.18)", borderRadius: 12, padding: "12px 14px" }}>
                <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 900, color: "#10B981" }}>31</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>Empfehlungen gesamt</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.18)", borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#F59E0B" }}>87€</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>offen</div>
                </div>
                <div style={{ flex: 1, background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.18)", borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#3B82F6" }}>42€</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>ausgezahlt</div>
                </div>
              </div>
            </div>
          </div>

          {/* Prämien */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "20px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Eingelöste Prämien</span>
              <InfoTooltip text="Wie viele Kunden haben ihre volle Stempelkarte eingelöst und die Prämie (z.B. 10€ Gutschein) erhalten." />
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 32, fontWeight: 900, color: "#EC4899" }}>6</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Prämien diese Woche</div>
            </div>
            <ResponsiveContainer width="100%" height={70}>
              <BarChart data={[{d:"Mo",v:1},{d:"Di",v:0},{d:"Mi",v:2},{d:"Do",v:0},{d:"Fr",v:1},{d:"Sa",v:2},{d:"So",v:0}]} barSize={10}>
                <Bar dataKey="v" fill="#EC4899" radius={[4,4,0,0]} />
                <XAxis dataKey="d" tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 9 }} axisLine={false} tickLine={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── TOP KUNDEN ── */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "22px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>🏆 Treueste Kunden</span>
            <InfoTooltip text="Deine loyalsten Stammkunden, sortiert nach der Anzahl ihrer gesammelten Stempel. Je mehr Stempel, desto öfter waren sie bei dir." />
          </div>
          {TOP_KUNDEN.map((c, i) => {
            const pct = Math.round((c.stempel / TOP_KUNDEN[0].stempel) * 100);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", borderBottom: i < TOP_KUNDEN.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <div style={{ width: 28, height: 28, background: `${RANG_FARBEN[i]}18`, border: `1px solid ${RANG_FARBEN[i]}44`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: RANG_FARBEN[i], flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{c.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 800, color: RANG_FARBEN[i] }}>{c.stempel} Stempel</span>
                  </div>
                  <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 100, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${RANG_FARBEN[i]}66, ${RANG_FARBEN[i]})`, borderRadius: 100 }} />
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>{c.besuche} Besuche insgesamt</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}