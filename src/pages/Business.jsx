import React, { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// ── Hero Slideshow Bilder (Branchenimpressionen) ──────────────────────────────
const HERO_SLIDES = [
  { img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&q=80", label: "Barbershop · Beliebtester Service", sub: "Haarschnitt klassisch" },
  { img: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1200&q=80", label: "Barbershop · Top Bewertung", sub: "Bart-Styling Deluxe" },
  { img: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=1200&q=80", label: "Barbershop · Meistgebucht", sub: "Rasur & Pflege" },
];

// ── Rangliste Demo-Daten ───────────────────────────────────────────────────────
const RANKING_DATA = [
  { rank: 1, medal: "🥇", name: "Barber Palace Berlin",   city: "Berlin",   pts: 9840, color: "#F59E0B" },
  { rank: 2, medal: "🥈", name: "Style Kings Frankfurt",  city: "Frankfurt", pts: 8720, color: "#94A3B8" },
  { rank: 3, medal: "🥉", name: "Kings Barbershop",       city: "München",  pts: 7610, color: "#CD7F32", isYou: true },
  { rank: 4, medal: "4",  name: "Barber Club Hamburg",    city: "Hamburg",  pts: 6340, color: "#3B82F6" },
  { rank: 5, medal: "5",  name: "Premier Cuts Köln",      city: "Köln",     pts: 5120, color: "#8B5CF6" },
];

const MINI_CHART_DATA = [
  { tag: "Mo", stempel: 4 },
  { tag: "Di", stempel: 7 },
  { tag: "Mi", stempel: 5 },
  { tag: "Do", stempel: 12 },
  { tag: "Fr", stempel: 18 },
  { tag: "Sa", stempel: 23 },
  { tag: "So", stempel: 9 },
  { tag: "Mo", stempel: 11 },
  { tag: "Di", stempel: 15 },
];

// ─── Icons (inline SVG to avoid import issues) ────────────────────────────────
const Icon = ({ d, size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const DEMO_BUSINESS_ID = "demo-kings-barbershop-001";
const BUSINESS_NAME = "Kings Barbershop";

const DUMMY_STATS = [
  { label: "Aktive Kunden", value: "142", tooltip: "Kunden, die in den letzten 30 Tagen einen Stempel erhalten haben." },
  { label: "Stempel heute", value: "23", tooltip: "Anzahl der Stempel heute via QR-Code." },
  { label: "Offene Provisionen", value: "€ 87,50", tooltip: "Noch nicht ausgezahlte Provisionen." },
  { label: "Empfehlungen", value: "31", tooltip: "Empfehlungen diesen Monat." },
];

const QR_STATS = [
  { label: "Scans heute", value: "23", change: "+8 vs. gestern" },
  { label: "Scans diese Woche", value: "141", change: "+12% vs. letzte Woche" },
  { label: "Scans gesamt", value: "1.847", change: "Seit Start" },
  { label: "Über Link geöffnet", value: "312", change: "davon 89 neu" },
];

const DUMMY_ACTIVITY = [
  { name: "Mehmet B.", action: "Stempel erhalten", time: "vor 5 Min.", avatar: "MB" },
  { name: "Sara K.", action: "Prämie eingelöst 🎉", time: "vor 22 Min.", avatar: "SK" },
  { name: "Jonas W.", action: "Empfehlung gesendet", time: "vor 1 Std.", avatar: "JW" },
  { name: "Fatima A.", action: "Stempel erhalten", time: "vor 2 Std.", avatar: "FA" },
  { name: "Lukas M.", action: "Neu registriert", time: "vor 3 Std.", avatar: "LM" },
  { name: "Amir S.", action: "Empfehlung gesendet", time: "vor 4 Std.", avatar: "AS" },
];

function InfoTooltip({ text }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center", marginLeft: 6 }}>
      <span onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
        style={{ cursor: "pointer", color: "rgba(255,255,255,0.35)", fontSize: 12 }}>ⓘ</span>
      {show && (
        <span style={{
          position: "absolute", bottom: "calc(100% + 8px)", left: "50%",
          transform: "translateX(-50%)", background: "#0A1612", color: "#F9FAFB",
          fontSize: 12, lineHeight: 1.5, padding: "8px 12px", borderRadius: 8,
          whiteSpace: "normal", maxWidth: 220, zIndex: 50,
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)", border: "1px solid rgba(16,185,129,0.2)",
          pointerEvents: "none",
        }}>{text}</span>
      )}
    </span>
  );
}

function QRCodeSection({ businessId, businessName }) {
  const scanUrl = `${window.location.origin}/scan/${businessId}`;
  const qrImg = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&bgcolor=0A1612&color=10B981&qzone=2&data=${encodeURIComponent(scanUrl)}`;
  const qrDL = `https://api.qrserver.com/v1/create-qr-code/?size=1200x1200&bgcolor=0A1612&color=10B981&qzone=3&data=${encodeURIComponent(scanUrl)}`;

  const [copied, setCopied] = useState(false);
  const [showSim, setShowSim] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(scanUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const download = () => {
    const a = document.createElement("a");
    a.href = qrDL;
    a.download = `sensalie-qr-${businessName.toLowerCase().replace(/\s+/g, "-")}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `Stempelkarte – ${businessName}`, text: `Sammle Stempel bei ${businessName}!`, url: scanUrl });
      } catch (e) {}
    } else {
      copy();
    }
  };

  return (
    <>
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 28, marginBottom: 16 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, background: "rgba(16,185,129,0.15)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(16,185,129,0.3)", fontSize: 16 }}>⬛</div>
            <div>
              <div style={{ fontWeight: 700, color: "#fff", fontSize: 16 }}>Deine Stempelkarte</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>QR-Code zum Scannen & Teilen</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 100, padding: "5px 12px" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 6px #10B981" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#10B981" }}>Live</span>
          </div>
        </div>

        {/* Grid: QR left, info right */}
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "start" }}>
          {/* QR Code */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ background: "#0A1612", border: "2px solid rgba(16,185,129,0.35)", borderRadius: 16, padding: 14, boxShadow: "0 0 40px rgba(16,185,129,0.12)" }}>
              <img src={qrImg} alt="QR Code" width={160} height={160} style={{ display: "block", borderRadius: 8 }} />
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", textAlign: "center", maxWidth: 160 }}>
              Drucke ihn aus &amp; stelle ihn an der Kasse auf
            </div>
          </div>

          {/* Right */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
            {/* URL bar */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.45)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Dein Kunden-Link</div>
              <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ flex: 1, padding: "10px 14px", fontSize: 12, color: "rgba(255,255,255,0.6)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "monospace" }}>
                  {scanUrl}
                </div>
                <button onClick={copy} style={{ background: "rgba(16,185,129,0.12)", border: "none", borderLeft: "1px solid rgba(255,255,255,0.08)", padding: "10px 16px", cursor: "pointer", color: copied ? "#10B981" : "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, fontFamily: "inherit", whiteSpace: "nowrap" }}>
                  {copied ? "✓ Kopiert!" : "📋 Kopieren"}
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button onClick={download} style={{ display: "flex", alignItems: "center", gap: 8, background: "#10B981", color: "#fff", fontWeight: 700, fontSize: 13, padding: "10px 18px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                ⬇ QR-Code herunterladen
              </button>
              <button onClick={share} style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", color: "#fff", fontWeight: 600, fontSize: 13, padding: "10px 18px", borderRadius: 10, border: "1.5px solid rgba(255,255,255,0.25)", cursor: "pointer", fontFamily: "inherit" }}>
                ↗ Link teilen
              </button>
              <button onClick={() => setShowSim(true)} style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", color: "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: 13, padding: "10px 18px", borderRadius: 10, border: "1.5px solid rgba(255,255,255,0.12)", cursor: "pointer", fontFamily: "inherit" }}>
                📱 Kunden-Flow testen
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {QR_STATS.map(s => (
                <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 14px" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", fontFamily: "'Bricolage Grotesque', sans-serif" }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{s.label}</div>
                  <div style={{ fontSize: 10, color: "#10B981", marginTop: 4, fontWeight: 600 }}>{s.change}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Modal */}
      {showSim && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={() => setShowSim(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#0A1612", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 24, padding: 32, maxWidth: 380, width: "100%", boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 18, fontWeight: 800, color: "#fff" }}>Kunden-Flow testen</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>Simuliere den Scan-Prozess</div>
              </div>
              <button onClick={() => setShowSim(false)} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 8, padding: "6px 10px", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>

            {/* Phone mockup */}
            <div style={{ background: "#111", border: "3px solid rgba(255,255,255,0.15)", borderRadius: 32, overflow: "hidden", margin: "0 auto", width: 260, boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
              <div style={{ background: "#111", padding: "12px 0 6px", textAlign: "center" }}>
                <div style={{ width: 50, height: 5, background: "rgba(255,255,255,0.15)", borderRadius: 3, margin: "0 auto" }} />
              </div>
              <iframe src={scanUrl} style={{ width: "100%", height: 480, border: "none", display: "block", background: "#fff" }} title="Kunden-Scan" />
            </div>

            <div style={{ marginTop: 16, textAlign: "center" }}>
              <a href={scanUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "#10B981", textDecoration: "none", fontWeight: 600 }}>
                🔗 Im neuen Tab öffnen (vollständig testen)
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Hero Slideshow Component ──────────────────────────────────────────────────
function HeroSlideshow() {
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSlide(i => (i + 1) % HERO_SLIDES.length), 3500);
    return () => clearInterval(t);
  }, []);
  const s = HERO_SLIDES[slide];
  return (
    <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", height: 130, marginBottom: 24 }}>
      {HERO_SLIDES.map((sl, i) => (
        <img key={sl.img} src={sl.img} alt={sl.label} style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center 30%",
          opacity: i === slide ? 1 : 0, transition: "opacity 1.2s ease",
        }} />
      ))}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,22,18,0.85) 0%, rgba(10,22,18,0.3) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 20px", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 10, color: "#10B981", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{s.label}</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{s.sub}</div>
          <div style={{ display: "flex", gap: 5, marginTop: 8 }}>
            {HERO_SLIDES.map((_, i) => (
              <div key={i} onClick={() => setSlide(i)} style={{ width: 20, height: 3, borderRadius: 2, background: i === slide ? "#10B981" : "rgba(255,255,255,0.25)", cursor: "pointer", transition: "background 0.4s" }} />
            ))}
          </div>
        </div>
        <div style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)", borderRadius: 12, padding: "8px 14px", textAlign: "center", flexShrink: 0 }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#10B981", fontFamily: "'Bricolage Grotesque', sans-serif" }}>⭐ 4.9</div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>Kundenbewertung</div>
        </div>
      </div>
    </div>
  );
}

// ── Rangliste Component (gesperrt) ────────────────────────────────────────────
function RankingSection() {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 28, marginBottom: 16, position: "relative", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>🏆</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Deutschlandweite Rangliste</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>Bestes Unternehmen deiner Branche</div>
          </div>
        </div>
        <div style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 100, padding: "4px 12px", fontSize: 10, fontWeight: 800, color: "#F59E0B" }}>
          BALD VERFÜGBAR
        </div>
      </div>

      {/* Preview Rows — verschwommen */}
      <div style={{ opacity: 0.3, pointerEvents: "none" }}>
        {/* Top 3 Podium */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 10, height: 100, marginBottom: 16 }}>
          {[RANKING_DATA[1], RANKING_DATA[0], RANKING_DATA[2]].map((e, i) => {
            const heights = [72, 100, 56];
            return (
              <div key={e.rank} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ fontSize: i === 1 ? 20 : 14 }}>{e.medal}</div>
                <div style={{ width: "100%", height: heights[i], borderRadius: "10px 10px 0 0", background: `linear-gradient(to top, ${e.color}66, ${e.color}22)`, border: `1px solid ${e.color}44`, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: e.color }}>{e.pts.toLocaleString()}</span>
                </div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", textAlign: "center", maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.name}</div>
              </div>
            );
          })}
        </div>
        {/* Remaining rows */}
        {RANKING_DATA.slice(3).map((e, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ width: 20, fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", textAlign: "center" }}>{e.rank}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: e.isYou ? 800 : 600, color: e.isYou ? "#10B981" : "#fff" }}>{e.name}</div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 100, marginTop: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.round(e.pts / RANKING_DATA[0].pts * 100)}%`, background: e.color, borderRadius: 100 }} />
              </div>
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{e.pts.toLocaleString()} Pkt.</div>
          </div>
        ))}
      </div>

      {/* Lock Overlay */}
      <div style={{ position: "absolute", inset: 0, borderRadius: 20, background: "rgba(10,22,18,0.6)", backdropFilter: "blur(3px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: 24 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(245,158,11,0.15)", border: "2px solid rgba(245,158,11,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>
          🏆
        </div>
        <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 18, fontWeight: 900, color: "#fff", textAlign: "center" }}>
          Sensalie Branchen-Pokal
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textAlign: "center", lineHeight: 1.6, maxWidth: 260 }}>
          Die besten Unternehmen ihrer Branche in ganz Deutschland treten an — und der Sieger gewinnt den <strong style={{ color: "#F59E0B" }}>Sensalie Goldpokal</strong> 🥇
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <div style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 10, padding: "8px 16px", fontSize: 12, fontWeight: 700, color: "#F59E0B" }}>
            🏆 Goldpokal
          </div>
          <div style={{ background: "rgba(148,163,184,0.1)", border: "1px solid rgba(148,163,184,0.3)", borderRadius: 10, padding: "8px 16px", fontSize: 12, fontWeight: 700, color: "#94A3B8" }}>
            🥈 Silberpokal
          </div>
          <div style={{ background: "rgba(205,127,50,0.1)", border: "1px solid rgba(205,127,50,0.3)", borderRadius: 10, padding: "8px 16px", fontSize: 12, fontWeight: 700, color: "#CD7F32" }}>
            🥉 Bronzepokal
          </div>
        </div>
        <div style={{ marginTop: 4, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Startet halbjährlich · Anmeldung demnächst möglich</div>
      </div>
    </div>
  );
}

export default function Business() {
  const [settings, setSettings] = useState({
    minAmountForStamp: "20",
    provisionAfterVisits: "3",
    stampsForReward: "8",
    rewardDescription: "10€ Gutschein",
    provisionType: "percentage",
    provisionValue: "10",
  });
  const [rewardFavorites, setRewardFavorites] = useState(["10€ Gutschein", "5€ Rabatt", "Gratis Haarschnitt"]);
  const [settingsLocked, setSettingsLocked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [commissionSaved, setCommissionSaved] = useState(false);

  const minAmount = parseFloat(settings.minAmountForStamp) || 0;
  const visits = parseInt(settings.provisionAfterVisits) || 1;
  const minRevenue = (minAmount * visits).toFixed(2);
  const provisionValue = parseFloat(settings.provisionValue) || 0;
  const calculatedCommission = settings.provisionType === "percentage"
    ? (minRevenue * provisionValue / 100).toFixed(2)
    : provisionValue.toFixed(2);

  return (
    <div style={{ minHeight: "100vh", background: "#0A1612", fontFamily: "'Inter', sans-serif", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Bricolage+Grotesque:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        .ghost-btn { background: transparent; border: 1.5px solid rgba(255,255,255,0.4); color: #fff; font-weight: 600; font-size: 13px; padding: 10px 18px; border-radius: 10px; cursor: pointer; font-family: inherit; transition: all 0.2s; white-space: nowrap; }
        .ghost-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.7); }
        .ghost-btn.active { background: rgba(16,185,129,0.15); border-color: #10B981; color: #10B981; }
        .settings-input { width: 100%; border: 1.5px solid rgba(255,255,255,0.12); border-radius: 10px; padding: 10px 14px; font-size: 14px; outline: none; font-family: inherit; color: #fff; background: rgba(255,255,255,0.05); transition: border-color 0.2s; }
        .settings-input:focus { border-color: #10B981; }
        .activity-item { display: flex; align-items: center; gap: 12px; padding: 13px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .activity-item:last-child { border-bottom: none; }
        .avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #10B981, #059669); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #fff; flex-shrink: 0; }
        @media(max-width: 680px) {
          .stats-row { flex-direction: column !important; }
          .stat-divider { display: none !important; }
          .action-btns { flex-wrap: wrap !important; }
          .qr-grid { grid-template-columns: 1fr !important; }
          .two-col { grid-template-columns: 1fr !important; }
          .main-pad { padding: 16px !important; }
        }
      `}</style>

      {/* Glow */}
      <div style={{ position: "fixed", top: -120, left: -80, width: 480, height: 480, background: "radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Header */}
      <div style={{ background: "rgba(10,22,18,0.9)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 24px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: "#10B981", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✂️</div>
            <div>
              <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 700, color: "#fff" }}>{BUSINESS_NAME}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Business Dashboard</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <a href="/BusinessAnalytics" style={{ fontSize: 13, color: "#10B981", textDecoration: "none", fontWeight: 600, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 8, padding: "5px 12px" }}>📈 Analyse</a>
            <a href="/dashboard" style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none", fontWeight: 500 }}>👤 Kunden-Dashboard</a>
            <a href="/" style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none", fontWeight: 500 }}>← Zurück</a>
          </div>
        </div>
      </div>

      <div className="main-pad" style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px 60px", position: "relative", zIndex: 1 }}>

        {/* Hero card */}
        <div style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.10) 0%, transparent 60%)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 36, marginBottom: 16 }}>
          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 800, color: "#fff", margin: "0 0 4px" }}>Guten Tag 👋</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: "0 0 20px" }}>Hier ist dein Überblick für heute.</p>
          <HeroSlideshow />

          {/* Stats */}
          <div className="stats-row" style={{ display: "flex", alignItems: "stretch", gap: 0, marginBottom: 28 }}>
            {DUMMY_STATS.map((s, i) => (
              <React.Fragment key={s.label}>
                <div style={{ flex: 1, paddingLeft: i === 0 ? 0 : 24, paddingRight: 24 }}>
                  <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 26, fontWeight: 800, color: "#fff" }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 4, display: "flex", alignItems: "center" }}>
                    {s.label}<InfoTooltip text={s.tooltip} />
                  </div>
                </div>
                {i < DUMMY_STATS.length - 1 && <div className="stat-divider" style={{ width: 1, background: "rgba(255,255,255,0.12)", alignSelf: "stretch" }} />}
              </React.Fragment>
            ))}
          </div>

          {/* Action buttons */}
          <div className="action-btns" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className={`ghost-btn${activeSection === 'qr' ? ' active' : ''}`} onClick={() => setActiveSection(activeSection === 'qr' ? null : 'qr')}>
              ⬛ QR-Code
            </button>
            <button className={`ghost-btn${activeSection === 'stamp' ? ' active' : ''}`} onClick={() => setActiveSection(activeSection === 'stamp' ? null : 'stamp')}>
              ⚙️ Stempelkarte
            </button>
            <button className={`ghost-btn${activeSection === 'commission' ? ' active' : ''}`} onClick={() => setActiveSection(activeSection === 'commission' ? null : 'commission')}>
              💶 Provisionsmodell
            </button>
          </div>
        </div>

        {/* QR Section */}
        {activeSection === 'qr' && <QRCodeSection businessId={DEMO_BUSINESS_ID} businessName={BUSINESS_NAME} />}

        {/* Stamp Settings */}
        {activeSection === 'stamp' && (
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 28, marginBottom: 16 }}>
            <div style={{ fontWeight: 700, color: "#fff", fontSize: 16, marginBottom: 4 }}>Stempelkarte konfigurieren</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>Passe dein Belohnungssystem an</div>

            <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 20 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {settingsLocked && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: 10, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>⚠️ Einstellungen gesperrt – erster Kunde ist aktiv.</div>}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 7 }}>Ab welchem Betrag gibt es einen Stempel? (€)</label>
                  <input type="number" min="5" className="settings-input" value={settings.minAmountForStamp} onChange={e => setSettings({ ...settings, minAmountForStamp: e.target.value })} disabled={settingsLocked} placeholder="z.B. 15" />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 7 }}>Stempel bis zur Prämie</label>
                  <select className="settings-input" value={settings.stampsForReward} onChange={e => setSettings({ ...settings, stampsForReward: e.target.value })} disabled={settingsLocked} style={{ cursor: "pointer" }}>
                    {[5, 6, 7, 8, 9, 10].map(v => <option key={v} value={v}>{v} Stempel</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 7 }}>Was ist die Belohnung?</label>
                  <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                    <input type="text" className="settings-input" value={settings.rewardDescription} onChange={e => setSettings({ ...settings, rewardDescription: e.target.value })} disabled={settingsLocked} placeholder="z.B. 10€ Gutschein" style={{ flex: 1 }} />
                    <button onClick={() => { if (settings.rewardDescription && !rewardFavorites.includes(settings.rewardDescription)) setRewardFavorites([...rewardFavorites, settings.rewardDescription]); }} disabled={settingsLocked} style={{ padding: "10px 12px", background: "none", border: "none", color: rewardFavorites.includes(settings.rewardDescription) ? "#FFD700" : "rgba(255,255,255,0.4)", fontSize: 18, cursor: "pointer" }}>★</button>
                  </div>
                  {rewardFavorites.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {rewardFavorites.map(fav => (
                        <div key={fav} onClick={() => !settingsLocked && setSettings({ ...settings, rewardDescription: fav })} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)", borderRadius: 8, padding: "5px 10px", fontSize: 12, color: "#10B981", cursor: "pointer" }}>
                          {fav}
                          <button onClick={e => { e.stopPropagation(); setRewardFavorites(rewardFavorites.filter(f => f !== fav)); }} style={{ background: "none", border: "none", color: "rgba(16,185,129,0.6)", cursor: "pointer", fontSize: 13, padding: 0 }}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Preview */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 12 }}>Vorschau</div>
                <div style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.04))", border: "2px solid rgba(16,185,129,0.3)", borderRadius: 16, padding: 18, width: "100%", maxWidth: 230 }}>
                  <div style={{ textAlign: "center", marginBottom: 14 }}>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: 1 }}>STEMPELKARTE</div>
                    <div style={{ fontSize: 13, color: "#fff", fontWeight: 700, marginTop: 3 }}>{BUSINESS_NAME}</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 5, marginBottom: 14 }}>
                    {Array.from({ length: parseInt(settings.stampsForReward) }).map((_, i) => (
                      <div key={i} style={{ aspectRatio: "1/1", background: i < 2 ? "#10B981" : "rgba(16,185,129,0.15)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: i < 2 ? "#fff" : "transparent" }}>
                        {i < 2 ? "✓" : ""}
                      </div>
                    ))}
                  </div>
                  <div style={{ borderTop: "1px solid rgba(16,185,129,0.2)", paddingTop: 10, textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>2 von {settings.stampsForReward} Stempeln</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#10B981", padding: "5px 8px", background: "rgba(16,185,129,0.15)", borderRadius: 6, display: "inline-block" }}>🎁 {settings.rewardDescription}</div>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={() => { setSaved(true); setSettingsLocked(true); setTimeout(() => setSaved(false), 2000); }} disabled={settingsLocked} style={{ background: saved ? "#059669" : "#10B981", color: "#fff", fontWeight: 700, fontSize: 14, padding: "11px 24px", borderRadius: 10, border: "none", cursor: settingsLocked ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: settingsLocked ? 0.5 : 1 }}>
              {saved ? "✓ Gespeichert!" : settingsLocked ? "Einstellungen gesperrt" : "Einstellungen speichern"}
            </button>
          </div>
        )}

        {/* Commission Settings */}
        {activeSection === 'commission' && (
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 28, marginBottom: 16 }}>
            <div style={{ fontWeight: 700, color: "#fff", fontSize: 16, marginBottom: 4 }}>Provisionsmodell</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>Mindestumsatz &amp; Provision für Empfehlungen</div>

            <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 20 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 7 }}>Provision ab X Besuchen</label>
                  <select className="settings-input" value={settings.provisionAfterVisits} onChange={e => setSettings({ ...settings, provisionAfterVisits: e.target.value })} style={{ cursor: "pointer" }}>
                    {[2, 3, 4, 5].map(v => <option key={v} value={v}>{v} Besuche</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 7 }}>Provision für Empfehlung</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div style={{ position: "relative" }}>
                      <input type="number" min="0" className="settings-input" value={settings.provisionValue} onChange={e => setSettings({ ...settings, provisionValue: e.target.value })} placeholder={settings.provisionType === "percentage" ? "10" : "5"} style={{ paddingRight: 36 }} />
                      <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "rgba(255,255,255,0.4)", pointerEvents: "none", fontWeight: 600 }}>{settings.provisionType === "percentage" ? "%" : "€"}</span>
                    </div>
                    <select className="settings-input" value={settings.provisionType} onChange={e => setSettings({ ...settings, provisionType: e.target.value })} style={{ cursor: "pointer" }}>
                      <option value="percentage">% vom Umsatz</option>
                      <option value="fixed">Fester Betrag (€)</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12, padding: 14 }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 4 }}>Gesamtumsatz Neukunde</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#10B981" }}>{minRevenue}€</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 3 }}>{minAmount}€ × {visits} Besuche</div>
                  </div>
                  <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12, padding: 14 }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 4 }}>Provision</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#10B981" }}>{calculatedCommission}€</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 3 }}>pro Empfehlung</div>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 12 }}>So funktioniert es</div>
                  {[
                    `Kunde A empfiehlt dich an Kunde B`,
                    `Kunde B kommt ${visits}× und gibt je mind. ${minAmount}€ aus`,
                    `Kunde A erhält ${calculatedCommission}€ Provision automatisch`,
                  ].map((step, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                      <span style={{ fontSize: 14, flexShrink: 0 }}>{["1️⃣","2️⃣","3️⃣"][i]}</span>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={() => { setCommissionSaved(true); setTimeout(() => setCommissionSaved(false), 2000); }} style={{ background: commissionSaved ? "#059669" : "#10B981", color: "#fff", fontWeight: 700, fontSize: 14, padding: "11px 24px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit" }}>
              {commissionSaved ? "✓ Gespeichert!" : "Einstellungen speichern"}
            </button>
          </div>
        )}

        {/* ── Mini-Chart + Online-Termine ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }} className="two-col">

          {/* Mini Aktivitäts-Chart */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "22px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>📈 Stempel diese Woche</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>Letzte 9 Tage</div>
              </div>
              <a href="/BusinessAnalytics" style={{ fontSize: 11, color: "#10B981", fontWeight: 700, textDecoration: "none", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 7, padding: "4px 10px" }}>
                Vollständig →
              </a>
            </div>
            <div style={{ display: "flex", gap: 20, marginBottom: 14 }}>
              <div style={{ borderLeft: "3px solid #10B981", paddingLeft: 10 }}>
                <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 900, color: "#10B981" }}>104</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Stempel gesamt</div>
              </div>
              <div style={{ borderLeft: "3px solid #F59E0B", paddingLeft: 10 }}>
                <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 900, color: "#F59E0B" }}>+23%</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>vs. letzte Woche</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={MINI_CHART_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="bizGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="tag" tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: "#1a2d3a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 11 }} formatter={(v) => [`${v} Stempel`]} />
                <Area dataKey="stempel" stroke="#10B981" strokeWidth={2} fill="url(#bizGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Online-Terminbuchung — gesperrt */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "22px 24px", position: "relative", overflow: "hidden" }}>
            {/* Hintergrund-Preview (verschwommen) */}
            <div style={{ opacity: 0.25, pointerEvents: "none" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 12 }}>📅 Online-Terminbuchung</div>
              {["Mo 14. Apr — 09:00", "Di 15. Apr — 11:30", "Mi 16. Apr — 14:00"].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ width: 32, height: 32, background: "rgba(16,185,129,0.2)", borderRadius: 8 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 10, background: "rgba(255,255,255,0.2)", borderRadius: 4, marginBottom: 4, width: "70%" }} />
                    <div style={{ height: 8, background: "rgba(255,255,255,0.1)", borderRadius: 4, width: "45%" }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Lock Overlay */}
            <div style={{ position: "absolute", inset: 0, borderRadius: 20, background: "rgba(10,22,18,0.7)", backdropFilter: "blur(4px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: 24 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(168,85,247,0.2)", border: "1.5px solid rgba(168,85,247,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="22" viewBox="0 0 22 24" fill="none">
                  <rect x="2" y="10" width="18" height="13" rx="4" fill="rgba(168,85,247,0.35)" stroke="#C084FC" strokeWidth="1.5"/>
                  <path d="M6 10V7a5 5 0 0 1 10 0v3" stroke="#C084FC" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="11" cy="16.5" r="2" fill="#C084FC"/>
                </svg>
              </div>
              <div style={{ background: "rgba(168,85,247,0.18)", border: "1px solid rgba(168,85,247,0.45)", borderRadius: 100, padding: "3px 12px", fontSize: 10, fontWeight: 800, color: "#C084FC" }}>SENSALIE PRO</div>
              <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 900, color: "#fff", textAlign: "center" }}>Online-Terminbuchung</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", textAlign: "center", lineHeight: 1.6, maxWidth: 200 }}>Kunden buchen direkt über deine Seite einen Termin — ohne Anruf.</div>
              <div style={{ marginTop: 4, background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 10, padding: "8px 18px", fontSize: 12, fontWeight: 700, color: "#C084FC", cursor: "pointer" }}>
                Bald verfügbar · ab 4,99€/Monat
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 28, marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Letzte Aktivitäten</div>
          {DUMMY_ACTIVITY.map((item, i) => (
            <div key={i} className="activity-item">
              <div className="avatar">{item.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{item.name}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{item.action}</div>
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>{item.time}</div>
            </div>
          ))}
        </div>

        {/* Rangliste */}
        <RankingSection />

      </div>
    </div>
  );
}