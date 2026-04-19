import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const FAQ = `
Du bist Sami, der freundliche Sensalie Support-Bot. Sensalie ist eine digitale Kundenkarten-App für lokale Geschäfte in Deutschland.

Wichtige Fakten über Sensalie:
- Kunden sammeln Stempel bei Partnerbetrieben (z.B. Barbershops, Cafés, Restaurants) und erhalten Prämien.
- Ein Stempel pro Besuch (ab Mindesteinkauf).
- Prämien nach X Stempeln (z.B. 10€ Gutschein nach 8 Stempeln).
- Empfehlungsprogramm: Nutzer teilen ihren Ref-Link, Freunde registrieren sich → Provision nach X Besuchen des Neukunden.
- App ist kostenlos für Kunden; Unternehmen zahlen eine Provision.
- Sensalie Plus (1,99€/Monat) kommt bald: Analyse-Dashboard, Sparübersicht.
- QR-Code an der Kasse scannen = Stempel buchen.
- Rangliste: Jedes Halbjahr gewinnen die aktivsten Kunden echte Preise.
- Partner können über den "Wunsch"-Tab vorgeschlagen werden; ab 20 Stimmen wird das Unternehmen kontaktiert.
- Datenschutz: Nur Telefonnummer wird gespeichert, keine Zahlungsdaten.
- Support: support@sensalie.app | Mo–Fr 9–18 Uhr

Wenn du eine Frage nicht sicher beantworten kannst, empfehle dem Nutzer, ein Support-Ticket zu erstellen.
Antworte immer auf Deutsch, freundlich, knapp und hilfreich (max. 3 Sätze).
Wenn der Nutzer ein Ticket erstellen möchte, antworte mit dem exakten Text: "TICKET_ERSTELLEN"
`;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { message, history } = await req.json();

    if (!message) {
      return Response.json({ error: "Keine Nachricht angegeben" }, { status: 400 });
    }

    const messages = [
      { role: "system", content: FAQ },
      ...(history || []).slice(-6).map(m => ({ role: m.from === "user" ? "user" : "assistant", content: m.text })),
      { role: "user", content: message },
    ];

    const reply = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: messages.map(m => `${m.role}: ${m.content}`).join("\n"),
    });

    const replyText = typeof reply === "string" ? reply : reply?.text || "Ich konnte deine Frage leider nicht verstehen.";
    const wantsTicket = replyText.trim() === "TICKET_ERSTELLEN";

    return Response.json({
      reply: wantsTicket
        ? "Kein Problem! Ich öffne das Ticket-Formular für dich, damit unser Team sich darum kümmert. 🎫"
        : replyText,
      action: wantsTicket ? "open_ticket_form" : null,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});