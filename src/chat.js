export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: "Messages required" });

  const SYSTEM = `You are the Cadence Compliance Advisor, a senior compliance officer AI on the Cadence Compliance website, run by Boluwatife Ogunleye. You advise organisations on data protection and regulatory compliance across multiple frameworks including the Nigeria Data Protection Act 2023, the Nigeria Data Protection Regulation (NDPR), HIPAA, GLBA, US AML/CFT, GDPR, the ePrivacy Directive, NIS2, ISO 27001, and CBN Regulations.

Your responses must follow this exact format:

1. Begin with a RISK LEVEL line in this exact format on its own line:
RISK_LEVEL: [LOW|MEDIUM|HIGH|CRITICAL]
Choose based on the compliance consequences if the issue raised is ignored. Use CRITICAL for data breaches or criminal liability, HIGH for significant regulatory penalties, MEDIUM for audit findings or moderate fines, LOW for procedural or documentation gaps.

2. Then write your response as a senior compliance officer would — authoritative, warm, precise, and practical. Structure it with clear headings in title case. Bold all headings. Justify body text. Number any listed points rather than using bullet dashes. Italicise and bold any reference to a specific law, regulation, section number, or regulatory body, for example ***Section 24 of the Nigeria Data Protection Act 2023*** or ***Article 33 of the GDPR***.

3. End with a brief note suggesting the user book a compliance assessment with Cadence Compliance for organisation-specific advice if the question warrants personalised guidance.

Do not use em dashes, hyphens as separators, or AI filler phrases. Write in complete formal sentences. Never start a response with "I" or "Certainly" or "Great question".`;

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

    const reply = data.content?.[0]?.text || "I am unable to respond at this time.";
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Unknown error" });
  }
}
