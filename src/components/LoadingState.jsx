export default function LoadingState({ lines = 3, height = 80 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 18,
          height,
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.08), transparent)",
            animation: "skelShimmer 1.4s ease-in-out infinite",
          }} />
        </div>
      ))}
      <style>{`@keyframes skelShimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }`}</style>
    </div>
  );
}