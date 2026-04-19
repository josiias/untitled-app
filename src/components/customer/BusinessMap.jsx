import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom green marker
function createCustomIcon(emoji, color) {
  return L.divIcon({
    html: `<div style="
      width:36px;height:36px;border-radius:50% 50% 50% 0;
      background:${color || "#10B981"};
      border:2px solid rgba(255,255,255,0.9);
      display:flex;align-items:center;justify-content:center;
      font-size:16px;
      transform:rotate(-45deg);
      box-shadow:0 4px 12px rgba(0,0,0,0.4);
    "><span style="transform:rotate(45deg)">${emoji || "🏪"}</span></div>`,
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -38],
  });
}

function userIcon() {
  return L.divIcon({
    html: `<div style="
      width:18px;height:18px;border-radius:50%;
      background:#3B82F6;border:3px solid #fff;
      box-shadow:0 0 0 4px rgba(59,130,246,0.35);
    "></div>`,
    className: "",
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

// Auto-fly to center when it changes
function FlyTo({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 13, { duration: 1.2 });
  }, [center, map]);
  return null;
}

// Geocode a city name → [lat, lon] via Nominatim
const geocodeCache = {};
async function geocodeCity(city) {
  if (geocodeCache[city]) return geocodeCache[city];
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1&accept-language=de`
    );
    const data = await res.json();
    if (data.length > 0) {
      const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      geocodeCache[city] = coords;
      return coords;
    }
  } catch (e) {}
  return null;
}

const CATEGORIES = [
  { name: "Barbershop", emoji: "✂️", color: "#10B981" },
  { name: "Café", emoji: "☕", color: "#F59E0B" },
  { name: "Restaurant", emoji: "🍽️", color: "#F97316" },
  { name: "Beauty", emoji: "💄", color: "#EC4899" },
  { name: "Nagelstudio", emoji: "💅", color: "#EC4899" },
  { name: "Friseur", emoji: "💇", color: "#38BDF8" },
  { name: "Massage", emoji: "💆", color: "#8B5CF6" },
  { name: "Wellness", emoji: "🧖", color: "#A78BFA" },
  { name: "Fitness", emoji: "🏋️", color: "#3B82F6" },
  { name: "Bäckerei", emoji: "🥐", color: "#D97706" },
  { name: "Andere", emoji: "🏪", color: "#6B7280" },
];

export default function BusinessMap({ businesses, userCoords, userCity }) {
  const [markers, setMarkers] = useState([]); // {biz, coords}
  const [selectedBiz, setSelectedBiz] = useState(null);
  const [geocoding, setGeocoding] = useState(true);
  const [mapCenter, setMapCenter] = useState(userCoords || [51.1657, 10.4515]); // Germany center fallback

  // When userCoords arrive, center on them
  useEffect(() => {
    if (userCoords) setMapCenter(userCoords);
  }, [userCoords]);

  // Geocode each unique city to get coordinates for businesses
  useEffect(() => {
    if (!businesses.length) { setGeocoding(false); return; }
    setGeocoding(true);

    const geocodeAll = async () => {
      const result = [];
      const uniqueCities = [...new Set(businesses.map(b => b.city).filter(Boolean))];
      const cityCoords = {};

      await Promise.all(
        uniqueCities.map(async city => {
          const coords = await geocodeCity(city);
          if (coords) cityCoords[city] = coords;
        })
      );

      for (const biz of businesses) {
        if (!biz.city) continue;
        const base = cityCoords[biz.city];
        if (!base) continue;
        // Add small random offset so overlapping markers spread slightly
        const offset = () => (Math.random() - 0.5) * 0.008;
        result.push({ biz, coords: [base[0] + offset(), base[1] + offset()] });
      }

      setMarkers(result);
      setGeocoding(false);
    };

    geocodeAll();
  }, [businesses]);

  return (
    <div style={{ borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", position: "relative" }}>
      {/* Map header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "rgba(17,30,40,0.95)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>🗺️</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
              {userCity ? `Partner in ${userCity}` : "Karte aller Partner"}
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>
              {geocoding ? "Standorte werden geladen…" : `${markers.length} Partner auf der Karte`}
            </div>
          </div>
        </div>
        {userCoords && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 8, padding: "4px 10px" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3B82F6" }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: "#3B82F6" }}>Du bist hier</span>
          </div>
        )}
      </div>

      {/* Loading overlay */}
      {geocoding && (
        <div style={{ position: "absolute", inset: 0, zIndex: 1000, background: "rgba(17,30,40,0.85)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 28 }}>🗺️</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Karte wird geladen…</div>
        </div>
      )}

      <MapContainer
        center={mapCenter}
        zoom={userCoords ? 13 : 6}
        style={{ height: 340, width: "100%" }}
        zoomControl={true}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap &copy; CARTO"
        />

        <FlyTo center={mapCenter} />

        {/* User location marker */}
        {userCoords && (
          <Marker position={userCoords} icon={userIcon()}>
            <Popup>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 700 }}>📍 Dein Standort</div>
            </Popup>
          </Marker>
        )}

        {/* Business markers */}
        {markers.map(({ biz, coords }) => {
          const catObj = CATEGORIES.find(c => c.name === biz.category);
          const icon = createCustomIcon(biz.emoji || catObj?.emoji || "🏪", biz.color || catObj?.color || "#10B981");
          return (
            <Marker
              key={biz.id}
              position={coords}
              icon={icon}
              eventHandlers={{ click: () => setSelectedBiz(biz) }}
            >
              <Popup>
                <div style={{ fontFamily: "Inter, sans-serif", minWidth: 160 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 20 }}>{biz.emoji || catObj?.emoji || "🏪"}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>{biz.name}</div>
                      <div style={{ fontSize: 11, color: "#666" }}>{biz.category}</div>
                    </div>
                  </div>
                  {biz.reward_description && (
                    <div style={{ fontSize: 11, color: biz.color || "#10B981", fontWeight: 600, borderTop: "1px solid #eee", paddingTop: 6 }}>
                      🎁 {biz.reward_description}
                    </div>
                  )}
                  {biz.city && <div style={{ fontSize: 10, color: "#999", marginTop: 4 }}>📍 {biz.city}</div>}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Selected biz card */}
      {selectedBiz && (
        <div style={{ background: "rgba(17,30,40,0.98)", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, background: (selectedBiz.color || "#10B981") + "22", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
            {selectedBiz.emoji || "🏪"}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{selectedBiz.name}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{selectedBiz.category} · 📍 {selectedBiz.city}</div>
            {selectedBiz.reward_description && (
              <div style={{ fontSize: 11, color: selectedBiz.color || "#10B981", fontWeight: 600, marginTop: 2 }}>🎁 {selectedBiz.reward_description}</div>
            )}
          </div>
          <button onClick={() => setSelectedBiz(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 18, cursor: "pointer", padding: 4 }}>✕</button>
        </div>
      )}
    </div>
  );
}