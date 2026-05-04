import { useState, useEffect, useRef } from "react";

const REVIEWS = [
  { name: "Mehmet A.", role: "Kings Barbershop, Berlin", text: "Seit Sensalie kommen meine Kunden viel regelmäßiger. Die Empfehlung läuft von alleine — ich muss gar nichts tun.", stars: 5, avatar: "✂️" },
  { name: "Sara K.", role: "Bella Nails, München", text: "In 3 Wochen hatte ich 18 neue Kundinnen durch Empfehlungen. Das hätte ich nie erwartet.", stars: 5, avatar: "💅" },
  { name: "Jonas W.", role: "Café Milano, Hamburg", text: "Endlich eine Stempelkarte, die wirklich funktioniert. Kein Papier, kein Stress, einfach nur mehr Stammgäste.", stars: 5, avatar: "☕" },
  { name: "Fatima B.", role: "Lotus Massage, Frankfurt", text: "Der QR-Code war in 5 Minuten aufgestellt. Meine Kunden lieben es — und ich auch.", stars: 5, avatar: "💆" },
  { name: "Amir S.", role: "Pizza Roma, Köln", text: "Was mir am besten gefällt: Ich zahle nur, wenn wirklich ein neuer Stammkunde kommt. Kein Risiko.", stars: 5, avatar: "🍕" },
];

export default function SocialProof() {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let x = 0;
    const speed = 0.22;
    let raf;
    const animate = () => {
      x -= speed;
      const total = track.scrollWidth / 2;
      if (Math.abs(x) >= total) x = 0;
      track.style.transform = `translateX(${x}px)`;
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const doubled = [...REVIEWS, ...REVIEWS];

  return (
    <div style={{ padding: "80px 0", background: "#0a1410", overflow: "hidden" }}>
      <div style={{ textAlign: "center", marginBottom: 48, padding: "0 24px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
          STIMMEN AUS DER PRAXIS
        </div>
        <h2 style={{ fontSize: "clamp(24px,4vw,38px)", fontWeight: 900, color: "#fff", margin: "0 0 10px" }}>
          Was Unternehmer sagen.
        </h2>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
          Echte Ergebnisse. Echte Menschen.
        </div>
        {/* Stars summary */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 16, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 100, padding: "6px 16px" }}>
          <span style={{ color: "#F59E0B", fontSize: 14 }}>★★★★★</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>5.0</span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>aus {REVIEWS.length} Bewertungen</span>
        </div>
      </div>

      {/* Carousel */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to right, #0a1410, transparent)", zIndex: 2, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to left, #0a1410, transparent)", zIndex: 2, pointerEvents: "none" }} />
        <div ref={trackRef} style={{ display: "flex", gap: 16, width: "max-content", padding: "8px 24px" }}>
          {doubled.map((r, i) => (
            <div key={i} style={{
              width: 280, flexShrink: 0,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20, padding: "22px 22px",
            }}>
              <div style={{ color: "#F59E0B", fontSize: 14, marginBottom: 12 }}>{"★".repeat(r.stars)}</div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 18px", fontStyle: "italic" }}>
                „{r.text}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 36, height: 36, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)",
                  borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0,
                }}>{r.avatar}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}