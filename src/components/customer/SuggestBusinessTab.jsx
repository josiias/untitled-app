import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const CATEGORIES = [
  { name: "Barbershop", emoji: "✂️" },
  { name: "Café", emoji: "☕" },
  { name: "Restaurant", emoji: "🍽️" },
  { name: "Beauty", emoji: "💄" },
  { name: "Nagelstudio", emoji: "💅" },
  { name: "Friseur", emoji: "💇" },
  { name: "Massage", emoji: "💆" },
  { name: "Wellness", emoji: "🧖" },
  { name: "Fitness", emoji: "🏋️" },
  { name: "Bäckerei", emoji: "🥐" },
  { name: "Apotheke", emoji: "💊" },
  { name: "Supermarkt", emoji: "🛒" },
  { name: "Andere", emoji: "🏪" },
];

const FREQUENCY_OPTIONS = [
  { value: "täglich", label: "Täglich", emoji: "🔥" },
  { value: "wöchentlich", label: "Wöchentlich", emoji: "📅" },
  { value: "monatlich", label: "Monatlich", emoji: "🗓️" },
  { value: "selten", label: "Selten", emoji: "💭" },
];

const STATUS_CONFIG = {
  offen: { label: "Vorgeschlagen", color: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)" },
  in_bearbeitung: { label: "Wird kontaktiert ⚡", color: "#10B981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)" },
  gewonnen: { label: "Jetzt dabei! 🎉", color: "#63FFB4", bg: "rgba(99,255,180,0.12)", border: "rgba(99,255,180,0.3)" },
};

const USER_PHONE = "0151 234 567 89";

export default function SuggestBusinessTab({ categoryFilter, onCategoryChange }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ business_name: "", category: "", city: "", visit_frequency: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [votedIds, setVotedIds] = useState(new Set());
  const [userCity, setUserCity] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [cityFilter, setCityFilter] = useState(null); // null = alle Städte

  // Try to detect user city on mount
  useEffect(() => {
    detectCity();
    loadSuggestions();
  }, []);

  const detectCity = () => {
    if (!navigator.geolocation) return;
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=de`
          );
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.village || null;
          if (city) {
            setUserCity(city);
            setCityFilter(city); // auto-filter by user's city
          }
        } catch (e) {}
        setLocationLoading(false);
      },
      () => setLocationLoading(false)
    );
  };

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.BusinessSuggestion.list("-votes", 100);
      setSuggestions(data);
      const alreadyVoted = new Set(
        data.filter(s => (s.voted_by || []).includes(USER_PHONE)).map(s => s.id)
      );
      setVotedIds(alreadyVoted);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const existing = await base44.entities.BusinessSuggestion.filter(
        { business_name: form.business_name, city: form.city }, "-votes", 1
      );
      if (existing.length > 0) {
        const s = existing[0];
        if (!(s.voted_by || []).includes(USER_PHONE)) {
          await base44.entities.BusinessSuggestion.update(s.id, {
            votes: (s.votes || 1) + 1,
            voted_by: [...(s.voted_by || []), USER_PHONE]
          });
        }
      } else {
        await base44.entities.BusinessSuggestion.create({
          ...form,
          votes: 1,
          voted_by: [USER_PHONE],
          status: "offen",
          suggested_by_phone: USER_PHONE,
        });
      }
      setSubmitted(true);
      setShowForm(false);
      setForm({ business_name: "", category: "", city: userCity || "", visit_frequency: "" });
      await loadSuggestions();
    } catch (e) {
      console.error(e);
    }
    setSubmitting(false);
  };

  const handleVote = async (suggestion) => {
    if (votedIds.has(suggestion.id)) return;
    try {
      await base44.entities.BusinessSuggestion.update(suggestion.id, {
        votes: (suggestion.votes || 1) + 1,
        voted_by: [...(suggestion.voted_by || []), USER_PHONE]
      });
      setVotedIds(prev => new Set([...prev, suggestion.id]));
      setSuggestions(prev =>
        prev.map(s => s.id === suggestion.id
          ? { ...s, votes: (s.votes || 1) + 1, voted_by: [...(s.voted_by || []), USER_PHONE] }
          : s
        ).sort((a, b) => (b.votes || 1) - (a.votes || 1))
      );
    } catch (e) {
      console.error(e);
    }
  };

  // Get unique cities from suggestions
  const allCities = [...new Set(suggestions.map(s => s.city).filter(Boolean))].sort();

  // Filter logic: category + city
  const filtered = suggestions.filter(s => {
    const catOk = !categoryFilter || categoryFilter === "Alle" || s.category === categoryFilter;
    const cityOk = !cityFilter || s.city?.toLowerCase() === cityFilter?.toLowerCase();
    return catOk && cityOk;
  });

  const activeCatObj = CATEGORIES.find(c => c.name === categoryFilter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 18, fontWeight: 900, color: "#fff" }}>
            {activeCatObj ? `${activeCatObj.emoji} ${activeCatObj.name}` : "Wunsch-Unternehmen"}
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
            {cityFilter ? `📍 ${cityFilter}` : "Stimme ab oder schlage ein neues vor"}
          </div>
        </div>
        <button
          onClick={() => { setShowForm(v => !v); setSubmitted(false); }}
          style={{
            background: showForm ? "rgba(255,255,255,0.08)" : "linear-gradient(135deg, #10B981, #059669)",
            color: "#fff", border: "none", borderRadius: 12, padding: "10px 16px",
            fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
          }}
        >
          {showForm ? "✕" : "+ Vorschlagen"}
        </button>
      </div>

      {/* Location banner */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "10px 14px" }}>
        <span style={{ fontSize: 18 }}>📍</span>
        <div style={{ flex: 1 }}>
          {locationLoading ? (
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Standort wird erkannt…</div>
          ) : userCity ? (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>Dein Standort: {userCity}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>
                {cityFilter ? "Zeige Vorschläge in deiner Stadt" : "Stadtfilter deaktiviert"}
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Standort nicht erkannt</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>Manuell auswählen ↓</div>
            </div>
          )}
        </div>
        {/* Toggle city filter */}
        {userCity && (
          <button
            onClick={() => setCityFilter(cityFilter ? null : userCity)}
            style={{
              padding: "6px 12px", borderRadius: 10, fontSize: 11, fontWeight: 700,
              border: "none", cursor: "pointer", fontFamily: "inherit",
              background: cityFilter ? "#10B981" : "rgba(255,255,255,0.08)",
              color: "#fff",
            }}
          >
            {cityFilter ? "✓ Lokal" : "Alle"}
          </button>
        )}
        {/* Manual city select */}
        {!userCity && allCities.length > 0 && (
          <select
            value={cityFilter || ""}
            onChange={e => setCityFilter(e.target.value || null)}
            style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 8, padding: "6px 10px", color: "#fff", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}
          >
            <option value="">Alle Städte</option>
            {allCities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
      </div>

      {/* Category grid tiles */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Kategorie wählen</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {/* "Alle" tile */}
          <button
            onClick={() => onCategoryChange(null)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 4, padding: "12px 6px", borderRadius: 14, border: "none", cursor: "pointer",
              fontFamily: "inherit",
              background: !categoryFilter ? "#10B981" : "rgba(255,255,255,0.05)",
              border: !categoryFilter ? "none" : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span style={{ fontSize: 20 }}>⬛</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: !categoryFilter ? "#fff" : "rgba(255,255,255,0.45)" }}>Alle</span>
            <span style={{ fontSize: 9, color: !categoryFilter ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)" }}>
              {cityFilter
                ? suggestions.filter(s => s.city?.toLowerCase() === cityFilter.toLowerCase()).length
                : suggestions.length}
            </span>
          </button>

          {CATEGORIES.map(cat => {
            const isActive = categoryFilter === cat.name;
            const count = suggestions.filter(s =>
              s.category === cat.name &&
              (!cityFilter || s.city?.toLowerCase() === cityFilter?.toLowerCase())
            ).length;
            return (
              <button
                key={cat.name}
                onClick={() => onCategoryChange(cat.name)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  gap: 4, padding: "12px 6px", borderRadius: 14, border: "none", cursor: "pointer",
                  fontFamily: "inherit", position: "relative",
                  background: isActive ? "#10B981" : "rgba(255,255,255,0.05)",
                  border: isActive ? "none" : "1px solid rgba(255,255,255,0.08)",
                  boxShadow: isActive ? "0 4px 16px rgba(16,185,129,0.3)" : "none",
                }}
              >
                <span style={{ fontSize: 20 }}>{cat.emoji}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: isActive ? "#fff" : "rgba(255,255,255,0.5)" }}>
                  {cat.name}
                </span>
                {/* Count badge */}
                {count > 0 && (
                  <span style={{
                    fontSize: 9, color: isActive ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.25)",
                    fontWeight: 700,
                  }}>
                    {count} {count === 1 ? "Wunsch" : "Wünsche"}
                  </span>
                )}
                {count === 0 && (
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.15)" }}>—</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Success toast */}
      {submitted && (
        <div style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.35)", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>✅</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#10B981" }}>Danke für deinen Vorschlag!</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>Wir kontaktieren das Unternehmen so schnell wie möglich.</div>
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "20px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 2 }}>Unternehmen vorschlagen</div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Name *</label>
            <input
              required type="text" placeholder="z.B. Barber Palace"
              value={form.business_name}
              onChange={e => setForm({ ...form, business_name: e.target.value })}
              style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 14, color: "#fff", fontFamily: "inherit", outline: "none" }}
            />
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Kategorie *</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
              {CATEGORIES.map(cat => (
                <button key={cat.name} type="button" onClick={() => setForm({ ...form, category: cat.name })}
                  style={{
                    padding: "8px 4px", borderRadius: 10, fontSize: 10, fontWeight: 700, cursor: "pointer",
                    fontFamily: "inherit", border: "none", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                    background: form.category === cat.name ? "#10B981" : "rgba(255,255,255,0.06)",
                    color: form.category === cat.name ? "#fff" : "rgba(255,255,255,0.5)",
                  }}
                >
                  <span style={{ fontSize: 16 }}>{cat.emoji}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Stadt *</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                required type="text" placeholder="z.B. Berlin"
                value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
                style={{ flex: 1, padding: "12px 14px", background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 14, color: "#fff", fontFamily: "inherit", outline: "none" }}
              />
              {userCity && (
                <button type="button" onClick={() => setForm({ ...form, city: userCity })}
                  style={{ padding: "10px 12px", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 12, color: "#10B981", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                  📍 {userCity}
                </button>
              )}
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Wie oft gehst du hin? *</label>
            <div style={{ display: "flex", gap: 8 }}>
              {FREQUENCY_OPTIONS.map(opt => (
                <button key={opt.value} type="button" onClick={() => setForm({ ...form, visit_frequency: opt.value })}
                  style={{
                    flex: 1, padding: "10px 4px", borderRadius: 12, fontSize: 11, fontWeight: 700, cursor: "pointer",
                    fontFamily: "inherit", border: "none", textAlign: "center",
                    background: form.visit_frequency === opt.value ? "#10B981" : "rgba(255,255,255,0.06)",
                    color: form.visit_frequency === opt.value ? "#fff" : "rgba(255,255,255,0.4)",
                  }}
                >
                  <div style={{ fontSize: 16, marginBottom: 2 }}>{opt.emoji}</div>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button type="submit"
            disabled={submitting || !form.business_name || !form.category || !form.city || !form.visit_frequency}
            style={{
              padding: "13px", background: submitting ? "rgba(16,185,129,0.5)" : "#10B981",
              color: "#fff", border: "none", borderRadius: 14, fontSize: 14, fontWeight: 800,
              cursor: submitting ? "not-allowed" : "pointer", fontFamily: "inherit",
            }}
          >
            {submitting ? "Wird gespeichert…" : "Vorschlag absenden →"}
          </button>
        </form>
      )}

      {/* Results header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1 }}>
          {filtered.length} {filtered.length === 1 ? "Wunsch" : "Wünsche"}
          {categoryFilter ? ` · ${categoryFilter}` : ""}
          {cityFilter ? ` · ${cityFilter}` : " · Alle Städte"}
        </div>
        {cityFilter && (
          <button onClick={() => setCityFilter(null)}
            style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
            ✕ Stadtfilter
          </button>
        )}
      </div>

      {/* Suggestions list */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "30px", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>Lädt…</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "30px", background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.08)", borderRadius: 20 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>
            {activeCatObj ? activeCatObj.emoji : "💡"}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>
            {cityFilter ? `Noch keine Wünsche in ${cityFilter}` : "Noch keine Vorschläge"}
            {categoryFilter ? ` für ${categoryFilter}` : ""}
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 4 }}>Sei der Erste! ↑ Vorschlagen</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((s, i) => {
            const hasVoted = votedIds.has(s.id);
            const statusCfg = STATUS_CONFIG[s.status] || STATUS_CONFIG.offen;
            const catObj = CATEGORIES.find(c => c.name === s.category);
            return (
              <div key={s.id} style={{
                background: "#1a2530",
                border: s.status === "gewonnen" ? "1.5px solid rgba(99,255,180,0.3)" : "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12
              }}>
                {/* Rank */}
                <div style={{ fontSize: 14, minWidth: 24, textAlign: "center" }}>
                  {i < 3 ? ["🥇","🥈","🥉"][i] : <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.2)" }}>{i + 1}</span>}
                </div>

                {/* Category emoji */}
                <div style={{ width: 36, height: 36, background: "rgba(255,255,255,0.06)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                  {catObj?.emoji || "🏪"}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.business_name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{s.category}</span>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>·</span>
                    <span style={{ fontSize: 10, color: "#63FFB4", fontWeight: 600 }}>📍 {s.city}</span>
                    {s.visit_frequency && (
                      <>
                        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>·</span>
                        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
                          {FREQUENCY_OPTIONS.find(f => f.value === s.visit_frequency)?.emoji} {s.visit_frequency}
                        </span>
                      </>
                    )}
                  </div>
                  <div style={{ marginTop: 6, display: "inline-flex", alignItems: "center", background: statusCfg.bg, border: `1px solid ${statusCfg.border}`, borderRadius: 8, padding: "3px 9px" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: statusCfg.color }}>{statusCfg.label}</span>
                  </div>
                </div>

                {/* Vote button */}
                <button
                  onClick={() => handleVote(s)}
                  disabled={hasVoted}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                    background: hasVoted ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.06)",
                    border: hasVoted ? "1.5px solid rgba(16,185,129,0.4)" : "1.5px solid rgba(255,255,255,0.1)",
                    borderRadius: 12, padding: "8px 12px", cursor: hasVoted ? "default" : "pointer",
                    fontFamily: "inherit", minWidth: 52,
                  }}
                >
                  <span style={{ fontSize: 14 }}>{hasVoted ? "✅" : "👍"}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: hasVoted ? "#10B981" : "#fff" }}>{s.votes || 1}</span>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>Stimmen</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}