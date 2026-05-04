import { Link } from "react-router-dom";

export default function Datenschutz() {
  return (
    <div style={{ minHeight: "100vh", background: "#0a1410", fontFamily: "'Inter', sans-serif", color: "#fff", padding: "0 0 80px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'); * { box-sizing: border-box; }`}</style>

      {/* Navbar */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(10,20,16,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/" style={{ fontSize: 22, fontWeight: 900, color: "#fff", textDecoration: "none" }}>Sensalie<span style={{ color: "#10B981" }}>.</span></Link>
        <Link to="/" style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>← Zurück</Link>
      </nav>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 24px" }}>
        <h1 style={{ fontSize: "clamp(28px,5vw,44px)", fontWeight: 900, marginBottom: 8 }}>Datenschutzerklärung</h1>
        <div style={{ color: "rgba(255,255,255,0.4)", marginBottom: 48, fontSize: 14 }}>Stand: Mai 2026</div>

        {[
          {
            title: "1. Datenschutz auf einen Blick",
            content: "Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.",
          },
          {
            title: "2. Verantwortliche Stelle",
            content: "Verantwortlich für die Datenverarbeitung auf dieser Website ist Sensalie (in Gründung), erreichbar unter info@sensalie.de.",
          },
          {
            title: "3. Welche Daten wir erheben",
            content: "Wenn Sie unsere Website besuchen, erheben wir automatisch technische Daten (IP-Adresse, Browsertyp, Betriebssystem, Referrer-URL, Datum und Uhrzeit des Zugriffs). Bei der Registrierung erheben wir Ihren Namen, Ihre E-Mail-Adresse und Ihre Telefonnummer.",
          },
          {
            title: "4. Zweck der Datenverarbeitung",
            content: "Wir verarbeiten Ihre Daten zur Bereitstellung unserer Dienstleistung (digitale Stempelkarten, Empfehlungsprogramm), zur Kommunikation mit Ihnen sowie zur Verbesserung unseres Angebots.",
          },
          {
            title: "5. Rechtsgrundlage",
            content: "Die Verarbeitung erfolgt auf Basis von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) sowie Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse). Für Marketingkommunikation holen wir Ihre ausdrückliche Einwilligung ein (Art. 6 Abs. 1 lit. a DSGVO).",
          },
          {
            title: "6. Speicherdauer",
            content: "Wir speichern Ihre personenbezogenen Daten nur so lange, wie es für die jeweiligen Verarbeitungszwecke erforderlich ist oder gesetzliche Aufbewahrungsfristen bestehen.",
          },
          {
            title: "7. Ihre Rechte",
            content: "Sie haben jederzeit das Recht auf Auskunft über Ihre gespeicherten Daten, das Recht auf Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit sowie das Widerspruchsrecht. Wenden Sie sich dazu an: info@sensalie.de",
          },
          {
            title: "8. Cookies",
            content: "Diese Website verwendet technisch notwendige Cookies, die für den Betrieb erforderlich sind, sowie – mit Ihrer Einwilligung – optionale Cookies zur Analyse und Verbesserung unseres Angebots. Sie können Ihre Einwilligung jederzeit widerrufen.",
          },
          {
            title: "9. Beschwerderecht",
            content: "Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Die zuständige Aufsichtsbehörde richtet sich nach Ihrem Wohnort.",
          },
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#10B981", marginBottom: 12 }}>{section.title}</h2>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, lineHeight: 1.8, margin: 0 }}>{section.content}</p>
          </div>
        ))}

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 32, display: "flex", gap: 20 }}>
          <Link to="/impressum" style={{ color: "#10B981", fontSize: 14, textDecoration: "none", fontWeight: 600 }}>Impressum →</Link>
          <Link to="/" style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, textDecoration: "none" }}>Zurück zur Startseite</Link>
        </div>
      </div>
    </div>
  );
}