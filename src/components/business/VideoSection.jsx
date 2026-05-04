import { useState, useRef } from "react";

export default function VideoSection({ lang = "de" }) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlay = () => {
    setPlaying(true);
    // In a real app this would be an actual video URL
  };

  return (
    <div style={{ padding: "80px 24px", background: "#0a1410" }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
            {lang === "en" ? "SEE IT IN ACTION" : "IN 90 SEKUNDEN ERKLÄRT"}
          </div>
          <h2 style={{ fontSize: "clamp(26px,4.5vw,42px)", fontWeight: 900, margin: "0 0 10px", color: "#fff" }}>
            {lang === "en" ? "See how Sensalie works." : "Sieh wie Sensalie funktioniert."}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, margin: 0 }}>
            {lang === "en"
              ? "From setup to your first referral — in under 2 minutes."
              : "Vom Setup bis zur ersten Empfehlung — in unter 2 Minuten."}
          </p>
        </div>

        {/* Video Player */}
        <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(16,185,129,0.25)", boxShadow: "0 30px 80px rgba(0,0,0,0.6)", aspectRatio: "16/9", background: "#0d1f14", cursor: "pointer" }} onClick={handlePlay}>

          {/* Thumbnail / background */}
          <img
            src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&q=80"
            alt="Video thumbnail"
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: playing ? 0 : 0.5, transition: "opacity 0.5s", position: "absolute", inset: 0 }}
          />
          <div style={{ position: "absolute", inset: 0, background: "rgba(8,20,12,0.55)", opacity: playing ? 0 : 1, transition: "opacity 0.5s" }} />

          {/* If not playing: show play button + overlay content */}
          {!playing && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
              {/* Animated play button */}
              <div style={{
                width: 76, height: 76, borderRadius: "50%",
                background: "rgba(16,185,129,0.9)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 0 0 rgba(16,185,129,0.4)",
                animation: "playPulse 2s ease-in-out infinite",
                transition: "transform 0.2s",
              }}>
                <div style={{ width: 0, height: 0, borderTop: "14px solid transparent", borderBottom: "14px solid transparent", borderLeft: "22px solid #fff", marginLeft: 5 }} />
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>
                  {lang === "en" ? "Watch the Demo" : "Demo ansehen"}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 3 }}>1:32 min</div>
              </div>

              {/* Feature chips below play button */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", maxWidth: 400, marginTop: 8 }}>
                {(lang === "en"
                  ? ["Setup in 2 min", "QR Code scanning", "Referral system", "Auto payouts"]
                  : ["Setup in 2 Min.", "QR-Code scannen", "Empfehlungssystem", "Auto-Auszahlung"]
                ).map(chip => (
                  <div key={chip} style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 100, padding: "4px 12px", fontSize: 11, fontWeight: 600, color: "#10B981" }}>
                    ✓ {chip}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* If playing: show embedded YouTube/placeholder */}
          {playing && (
            <iframe
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              allow="autoplay; fullscreen"
              allowFullScreen
              title="Sensalie Demo"
            />
          )}
        </div>

        {/* Stats bar below video */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginTop: 20 }}>
          {(lang === "en"
            ? [{ n: "2 min", l: "Setup time" }, { n: "0€", l: "Upfront cost" }, { n: "100%", l: "Automatic" }]
            : [{ n: "2 Min.", l: "Setup-Zeit" }, { n: "0€", l: "Vorab-Kosten" }, { n: "100%", l: "Automatisch" }]
          ).map(s => (
            <div key={s.l} style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.18)", borderRadius: 14, padding: "14px", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#10B981" }}>{s.n}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes playPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.5); }
          50% { box-shadow: 0 0 0 16px rgba(16,185,129,0); }
        }
      `}</style>
    </div>
  );
}