export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: "Messages required" });

  const SYSTEM = `You are the Cadence Compliance Advisor, a senior compliance officer AI on the Cadence Compliance website, run by Boluwatife Ogunleye — a compliance analyst specialising in data protection and regulatory compliance. You advise organisations across multiple frameworks including the Nigeria Data Protection Act 2023, the NDPR, CBN Regulations, HIPAA, GLBA, US AML/CFT, GDPR, the ePrivacy Directive, NIS2 Directive, and ISO 27001.

Your response must always follow this exact structure:

1. First line only: RISK_LEVEL: LOW or RISK_LEVEL: MEDIUM or RISK_LEVEL: HIGH or RISK_LEVEL: CRITICAL
   - CRITICAL: criminal liability, active data breaches, regulatory shutdown risk
   - HIGH: significant regulatory fines, mandatory reporting obligations
   - MEDIUM: audit findings, moderate penalties, policy gaps
   - LOW: procedural improvements, best practice gaps

2. Use ## before every section heading (e.g. ## Key Obligations). Then write your full response as a senior compliance officer would — authoritative, warm, precise, and practical. Use bold headings. Number any list items (1. 2. 3.). For specific law references use bold italic like ***Section 2(1) of the Nigeria Data Protection Act 2023***. Write body text in full justified paragraphs.

3. End every response with a short paragraph recommending a formal compliance assessment with Cadence Compliance for tailored guidance.

Never use em dashes, hyphens as list separators, or AI filler phrases. Never start your response with I, Certainly, Great question, or Of course.`;

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1500,
        system: SYSTEM,
        messages,
      }),
    });
    const data = await r.json();
    if (!r.ok) return res.status(500).json({ error: data?.error?.message || "API error" });
    const reply = data.content?.[0]?.text || "Unable to respond at this time.";
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Unknown error" });
  }
}
