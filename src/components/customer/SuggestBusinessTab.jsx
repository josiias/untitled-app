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

// ── Tab: Bestehende Unternehmen nach Kategorie ────────────────────────────────
function BusinessBrowseTab({ businesses, loadingBiz }) {
  const [selectedCat, setSelectedCat] = useState(null);
  const [cityFilter, setCityFilter] = useState(null);
  const [userCity, setUserCity] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
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
          if (city) { setUserCity(city); setCityFilter(city); }
        } catch (e) {}
        setLocationLoading(false);
      },
      () => setLocationLoading(false)
    );
  }, []);

  // All unique cities from businesses
  const allCities = [...new Set(businesses.map(b => b.city).filter(Boolean))].sort();

  // Filter businesses
  const filtered = businesses.filter(b => {
    const catOk = !selectedCat || b.category === selectedCat;
    const cityOk = !cityFilter || b.city?.toLowerCase() === cityFilter.toLowerCase();
    return catOk && cityOk;
  });

  const activeCatObj = CATEGORIES.find(c => c.name === selectedCat);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Location strip */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "10px 14px" }}>
        <span style={{ fontSize: 18 }}>📍</span>
        <div style={{ flex: 1 }}>
          {locationLoading
            ? <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Standort wird erkannt…</div>
            : userCity
              ? <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>Dein Standort: <span style={{ color: "#63FFB4" }}>{userCity}</span></div>
              : <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Standort nicht erkannt — Stadt manuell wählen</div>
          }
        </div>
        {userCity && (
          <button onClick={() => setCityFilter(cityFilter ? null : userCity)}
            style={{ padding: "5px 12px", borderRadius: 10, fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit", background: cityFilter ? "#10B981" : "rgba(255,255,255,0.08)", color: "#fff" }}>
            {cityFilter ? "✓ Lokal" : "Alle"}
          </button>
        )}
        {!userCity && allCities.length > 0 && (
          <select value={cityFilter || ""} onChange={e => setCityFilter(e.target.value || null)}
            style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 8, padding: "6px 10px", color: "#fff", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
            <option value="">Alle Städte</option>
            {allCities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
      </div>

      {/* Category grid */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Kategorie</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 7 }}>
          <button onClick={() => setSelectedCat(null)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "11px 4px",
              borderRadius: 14, border: !selectedCat ? "none" : "1px solid rgba(255,255,255,0.08)", cursor: "pointer", fontFamily: "inherit",
              background: !selectedCat ? "#10B981" : "rgba(255,255,255,0.05)",
              boxShadow: !selectedCat ? "0 4px 14px rgba(16,185,129,0.3)" : "none",
            }}>
            <span style={{ fontSize: 20 }}>⬛</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: !selectedCat ? "#fff" : "rgba(255,255,255,0.45)" }}>Alle</span>
            <span style={{ fontSize: 9, color: !selectedCat ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)", fontWeight: 600 }}>
              {businesses.filter(b => !cityFilter || b.city?.toLowerCase() === cityFilter?.toLowerCase()).length}
            </span>
          </button>
          {CATEGORIES.map(cat => {
            const isActive = selectedCat === cat.name;
            const count = businesses.filter(b =>
              b.category === cat.name &&
              (!cityFilter || b.city?.toLowerCase() === cityFilter?.toLowerCase())
            ).length;
            return (
              <button key={cat.name} onClick={() => setSelectedCat(isActive ? null : cat.name)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "11px 4px",
                  borderRadius: 14, border: isActive ? "none" : "1px solid rgba(255,255,255,0.08)", cursor: "pointer", fontFamily: "inherit",
                  background: isActive ? "#10B981" : "rgba(255,255,255,0.05)",
                  boxShadow: isActive ? "0 4px 14px rgba(16,185,129,0.3)" : "none",
                  opacity: count === 0 ? 0.4 : 1,
                }}>
                <span style={{ fontSize: 20 }}>{cat.emoji}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: isActive ? "#fff" : "rgba(255,255,255,0.5)" }}>{cat.name}</span>
                <span style={{ fontSize: 9, fontWeight: 600, color: isActive ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.2)" }}>{count > 0 ? count : "—"}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
          {filtered.length} Partner{activeCatObj ? ` · ${activeCatObj.emoji} ${activeCatObj.name}` : ""}
          {cityFilter ? ` · ${cityFilter}` : " · Ganz Deutschland"}
        </div>

        {loadingBiz ? (
          <div style={{ textAlign: "center", padding: "28px", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>Lädt…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "28px", background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.08)", borderRadius: 20 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{activeCatObj?.emoji || "🏪"}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>
              Noch keine Partner{selectedCat ? ` in ${selectedCat}` : ""}{cityFilter ? ` in ${cityFilter}` : ""}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 4 }}>Schlage ein Unternehmen vor → Wunsch-Tab</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map(biz => {
              const catObj = CATEGORIES.find(c => c.name === biz.category);
              return (
                <div key={biz.id} style={{ display: "flex", alignItems: "center", gap: 12, background: "#1a2530", border: `1px solid ${biz.color ? biz.color + "33" : "rgba(255,255,255,0.07)"}`, borderRadius: 16, overflow: "hidden" }}>
                  {/* Color bar */}
                  <div style={{ width: 4, alignSelf: "stretch", background: biz.color || "#10B981", flexShrink: 0 }} />
                  {/* Emoji icon */}
                  <div style={{ width: 40, height: 40, background: (biz.color || "#10B981") + "22", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                    {biz.emoji || catObj?.emoji || "🏪"}
                  </div>
                  <div style={{ flex: 1, padding: "12px 0" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{biz.name}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
                      {biz.category} {biz.city ? `· 📍 ${biz.city}` : ""}
                    </div>
                    {biz.reward_description && (
                      <div style={{ fontSize: 11, color: biz.color || "#10B981", fontWeight: 600, marginTop: 4 }}>
                        🎁 {biz.reward_description}
                      </div>
                    )}
                  </div>
                  <div style={{ paddingRight: 14 }}>
                    <div style={{ background: (biz.color || "#10B981") + "22", border: `1px solid ${biz.color || "#10B981"}44`, borderRadius: 8, padding: "5px 10px", fontSize: 10, fontWeight: 700, color: biz.color || "#10B981", whiteSpace: "nowrap" }}>
                      Partner ✓
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tab: Wunsch-Vorschläge ────────────────────────────────────────────────────
function WishlistTab() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ business_name: "", category: "", city: "", visit_frequency: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [votedIds, setVotedIds] = useState(new Set());
  const [catFilter, setCatFilter] = useState(null);
  const [userCity, setUserCity] = useState(null);

  useEffect(() => {
    loadSuggestions();
    // detect city for form prefill
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&accept-language=de`);
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.village || null;
          if (city) setUserCity(city);
        } catch (e) {}
      }, () => {});
    }
  }, []);

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.BusinessSuggestion.list("-votes", 100);
      setSuggestions(data);
      const alreadyVoted = new Set(data.filter(s => (s.voted_by || []).includes(USER_PHONE)).map(s => s.id));
      setVotedIds(alreadyVoted);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const existing = await base44.entities.BusinessSuggestion.filter({ business_name: form.business_name, city: form.city }, "-votes", 1);
      if (existing.length > 0) {
        const s = existing[0];
        if (!(s.voted_by || []).includes(USER_PHONE)) {
          await base44.entities.BusinessSuggestion.update(s.id, { votes: (s.votes || 1) + 1, voted_by: [...(s.voted_by || []), USER_PHONE] });
        }
      } else {
        await base44.entities.BusinessSuggestion.create({ ...form, votes: 1, voted_by: [USER_PHONE], status: "offen", suggested_by_phone: USER_PHONE });
      }
      setSubmitted(true);
      setShowForm(false);
      setForm({ business_name: "", category: "", city: userCity || "", visit_frequency: "" });
      await loadSuggestions();
    } catch (e) { console.error(e); }
    setSubmitting(false);
  };

  const handleVote = async (suggestion) => {
    if (votedIds.has(suggestion.id)) return;
    try {
      await base44.entities.BusinessSuggestion.update(suggestion.id, { votes: (suggestion.votes || 1) + 1, voted_by: [...(suggestion.voted_by || []), USER_PHONE] });
      setVotedIds(prev => new Set([...prev, suggestion.id]));
      setSuggestions(prev => prev.map(s => s.id === suggestion.id ? { ...s, votes: (s.votes || 1) + 1 } : s).sort((a, b) => (b.votes || 1) - (a.votes || 1)));
    } catch (e) { console.error(e); }
  };

  const handleShare = (s) => {
    const msg = `Hey! Ich wünsche mir "${s.business_name}" auf Sensalie 💡 Stimm mit ab! sensalie.app`;
    if (navigator.share) {
      navigator.share({ title: `Wunsch: ${s.business_name}`, text: msg });
    } else {
      navigator.clipboard.writeText(msg);
    }
  };

  const filtered = catFilter ? suggestions.filter(s => s.category === catFilter) : suggestions;
  const totalVotes = suggestions.reduce((acc, s) => acc + (s.votes || 1), 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Stats bar */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {[
          { label: "Wünsche", value: suggestions.length, color: "#F59E0B", emoji: "💡" },
          { label: "Stimmen gesamt", value: totalVotes, color: "#10B981", emoji: "👍" },
          { label: "In Bearbeitung", value: suggestions.filter(s => s.status === "in_bearbeitung" || s.status === "gewonnen").length, color: "#63FFB4", emoji: "⚡" },
        ].map((s, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "10px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 16, marginBottom: 3 }}>{s.emoji}</div>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button onClick={() => { setShowForm(v => !v); setSubmitted(false); }}
        style={{ width: "100%", padding: "13px", background: showForm ? "rgba(255,255,255,0.08)" : "linear-gradient(135deg, #10B981, #059669)", color: "#fff", border: "none", borderRadius: 14, fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
        {showForm ? "✕ Abbrechen" : "💡 Unternehmen vorschlagen"}
      </button>

      {submitted && (
        <div style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.35)", borderRadius: 14, padding: "13px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>✅</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#10B981" }}>Danke für deinen Vorschlag!</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>Wir kontaktieren das Unternehmen bald.</div>
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "18px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Neuen Wunsch eintragen</div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Name *</label>
            <input required type="text" placeholder="z.B. Barber Palace"
              value={form.business_name} onChange={e => setForm({ ...form, business_name: e.target.value })}
              style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 14, color: "#fff", fontFamily: "inherit", outline: "none" }} />
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Kategorie *</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
              {CATEGORIES.map(cat => (
                <button key={cat.name} type="button" onClick={() => setForm({ ...form, category: cat.name })}
                  style={{ padding: "8px 4px", borderRadius: 10, fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", border: "none", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: form.category === cat.name ? "#10B981" : "rgba(255,255,255,0.06)", color: form.category === cat.name ? "#fff" : "rgba(255,255,255,0.5)" }}>
                  <span style={{ fontSize: 16 }}>{cat.emoji}</span>{cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Stadt *</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input required type="text" placeholder="z.B. Berlin"
                value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                style={{ flex: 1, padding: "12px 14px", background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 14, color: "#fff", fontFamily: "inherit", outline: "none" }} />
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
                  style={{ flex: 1, padding: "10px 4px", borderRadius: 12, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", border: "none", textAlign: "center", background: form.visit_frequency === opt.value ? "#10B981" : "rgba(255,255,255,0.06)", color: form.visit_frequency === opt.value ? "#fff" : "rgba(255,255,255,0.4)" }}>
                  <div style={{ fontSize: 16, marginBottom: 2 }}>{opt.emoji}</div>{opt.label}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={submitting || !form.business_name || !form.category || !form.city || !form.visit_frequency}
            style={{ padding: "13px", background: submitting ? "rgba(16,185,129,0.5)" : "#10B981", color: "#fff", border: "none", borderRadius: 14, fontSize: 14, fontWeight: 800, cursor: submitting ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
            {submitting ? "Wird gespeichert…" : "Vorschlag absenden →"}
          </button>
        </form>
      )}

      {/* Category filter pills */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
        {[null, ...CATEGORIES.map(c => c.name)].map((cat, i) => {
          const catObj = CATEGORIES.find(c => c.name === cat);
          const isActive = catFilter === cat;
          return (
            <button key={i} onClick={() => setCatFilter(cat)}
              style={{ whiteSpace: "nowrap", padding: "7px 14px", borderRadius: 100, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "inherit", background: isActive ? "#10B981" : "rgba(255,255,255,0.07)", color: isActive ? "#fff" : "rgba(255,255,255,0.45)" }}>
              {cat ? `${catObj?.emoji || ""} ${cat}` : "Alle"}
            </button>
          );
        })}
      </div>

      {/* Suggestions list */}
      <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: 1 }}>
        {filtered.length} Wünsche{catFilter ? ` · ${catFilter}` : ""}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "28px", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>Lädt…</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "28px", background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.08)", borderRadius: 20 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>💡</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>Noch keine Wünsche{catFilter ? ` für ${catFilter}` : ""}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 4 }}>Sei der Erste!</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((s, i) => {
            const hasVoted = votedIds.has(s.id);
            const statusCfg = STATUS_CONFIG[s.status] || STATUS_CONFIG.offen;
            const catObj = CATEGORIES.find(c => c.name === s.category);
            const THRESHOLD = 20; // stimmen bis kontaktaufnahme
            const pct = Math.min(100, Math.round(((s.votes || 1) / THRESHOLD) * 100));

            return (
              <div key={s.id} style={{ background: "#1a2530", border: s.status === "gewonnen" ? "1.5px solid rgba(99,255,180,0.3)" : "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {/* Rank */}
                  <div style={{ fontSize: 14, minWidth: 22, textAlign: "center", flexShrink: 0 }}>
                    {i < 3 ? ["🥇","🥈","🥉"][i] : <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.2)" }}>{i + 1}</span>}
                  </div>
                  {/* Category emoji */}
                  <div style={{ width: 36, height: 36, background: "rgba(255,255,255,0.06)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                    {catObj?.emoji || "🏪"}
                  </div>
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.business_name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{s.category}</span>
                      {s.city && <><span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>·</span><span style={{ fontSize: 10, color: "#63FFB4", fontWeight: 600 }}>📍 {s.city}</span></>}
                    </div>
                  </div>
                  {/* Vote + Share */}
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button onClick={() => handleShare(s)}
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.25)", borderRadius: 10, cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>
                      📤
                    </button>
                    <button onClick={() => handleVote(s)} disabled={hasVoted}
                      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, background: hasVoted ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.06)", border: hasVoted ? "1.5px solid rgba(16,185,129,0.4)" : "1.5px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "6px 10px", cursor: hasVoted ? "default" : "pointer", fontFamily: "inherit", minWidth: 46 }}>
                      <span style={{ fontSize: 13 }}>{hasVoted ? "✅" : "👍"}</span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: hasVoted ? "#10B981" : "#fff" }}>{s.votes || 1}</span>
                    </button>
                  </div>
                </div>

                {/* Progress bar toward threshold */}
                <div style={{ marginTop: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <div style={{ display: "inline-flex", alignItems: "center", background: statusCfg.bg, border: `1px solid ${statusCfg.border}`, borderRadius: 6, padding: "2px 8px" }}>
                      <span style={{ fontSize: 9, fontWeight: 700, color: statusCfg.color }}>{statusCfg.label}</span>
                    </div>
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>
                      {s.status === "offen" ? `${THRESHOLD - (s.votes || 1) > 0 ? THRESHOLD - (s.votes || 1) : 0} Stimmen bis Kontaktaufnahme` : ""}
                    </span>
                  </div>
                  {s.status === "offen" && (
                    <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 100, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #F59E0B88, #F59E0B)", borderRadius: 100, transition: "width 0.5s ease" }} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function SuggestBusinessTab() {
  const [activeTab, setActiveTab] = useState("browse");
  const [businesses, setBusinesses] = useState([]);
  const [loadingBiz, setLoadingBiz] = useState(true);

  useEffect(() => {
    base44.entities.Business.list("-created_date", 100)
      .then(data => setBusinesses(data))
      .catch(e => console.error(e))
      .finally(() => setLoadingBiz(false));
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Tab switcher */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 6 }}>
        {[
          { id: "browse", label: "🏪 Partner entdecken" },
          { id: "wish",   label: "💡 Wunsch einreichen" },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ padding: "10px", borderRadius: 12, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700, transition: "all 0.2s",
              background: activeTab === t.id ? "#10B981" : "transparent",
              color: activeTab === t.id ? "#fff" : "rgba(255,255,255,0.4)",
              boxShadow: activeTab === t.id ? "0 2px 12px rgba(16,185,129,0.3)" : "none",
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "browse" && <BusinessBrowseTab businesses={businesses} loadingBiz={loadingBiz} />}
      {activeTab === "wish" && <WishlistTab />}
    </div>
  );
}