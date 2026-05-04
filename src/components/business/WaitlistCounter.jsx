import { useState, useEffect, useRef } from "react";

function useCounter(target, duration = 1600, started = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);
  return val;
}

export default function WaitlistCounter({ lang = "de" }) {
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  const BASE = 1247;

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const count = useCounter(BASE, 1600, started);

  // Simulated live increment
  const [live, setLive] = useState(0);
  useEffect(() => {
    if (!started) return;
    const t = setInterval(() => setLive(v => v + 1), 8000);
    return () => clearInterval(t);
  }, [started]);

  const total = count + live;

  return (
    <div ref={ref} style={{
      display: "inline-flex", alignItems: "center", gap: 10,
      background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)",
      borderRadius: 100, padding: "10px 20px",
    }}>
      {/* Live pulse */}
      <div style={{ position: "relative", width: 10, height: 10 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#10B981", animation: "livePulse 1.8s ease-in-out infinite" }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#10B981" }} />
      </div>
      <span style={{ fontSize: 15, fontWeight: 900, color: "#10B981", fontVariantNumeric: "tabular-nums" }}>
        {total.toLocaleString("de-DE")}
      </span>
      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
        {lang === "en" ? "entrepreneurs on the waitlist" : "Unternehmer auf der Warteliste"}
      </span>
      <style>{`
        @keyframes livePulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}