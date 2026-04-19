import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SYSTEM_BASE = `Du bist Julia, die freundliche Sensalie Support-Mitarbeiterin. Du bist warmherzig, hilfsbereit und nahbar — du klingst wie eine echte Ansprechpartnerin, nicht wie ein Bot. Sensalie ist eine digitale Kundenkarten-App für lokale Geschäfte in Deutschland.

Beantworte Fragen NUR auf Basis der dir bereitgestellten Wissensdatenbank. Wenn eine Frage nicht darin abgedeckt ist, sage ehrlich dass du es nicht weißt und empfehle ein Support-Ticket.
Antworte immer auf Deutsch, freundlich, knapp und hilfreich (max. 3 Sätze).
Wenn der Nutzer ein Ticket erstellen möchte, antworte mit dem exakten Text: "TICKET_ERSTELLEN"`;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { message, history } = await req.json();

    if (!message) {
      return Response.json({ error: "Keine Nachricht angegeben" }, { status: 400 });
    }

    // Load active knowledge base entries
    const knowledgeEntries = await base44.asServiceRole.entities.KnowledgeBase.filter({ active: true }, "-created_date", 100);
    const knowledgeText = knowledgeEntries.length > 0
      ? "\n\nDeine Wissensdatenbank (verwende NUR diese Infos):\n" +
        knowledgeEntries.map(e => `[${e.category?.toUpperCase() || "ALLGEMEIN"}] ${e.title}:\n${e.content}`).join("\n\n")
      : "\n\nHinweis: Die Wissensdatenbank ist noch leer. Bitte empfehle dem Nutzer ein Support-Ticket.";

    const systemPrompt = SYSTEM_BASE + knowledgeText;

    const messages = [
      { role: "system", content: systemPrompt },
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
        ? "Natürlich, kein Problem! 💚 Ich öffne das Ticket-Formular für dich — unser Team kümmert sich dann persönlich darum."
        : replyText,
      action: wantsTicket ? "open_ticket_form" : null,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});