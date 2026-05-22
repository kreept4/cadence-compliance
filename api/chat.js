export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: "Messages required" });

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
        max_tokens: 1000,
        system: "You are the Cadence Compliance Advisor, an AI tool on the Cadence Compliance website run by Boluwatife Ogunleye, a compliance analyst specialising in data protection and regulatory compliance. You help organisations understand their compliance obligations under frameworks including the Nigeria Data Protection Act 2023, the NDPR, HIPAA, AML/CFT regulations, GDPR, and other applicable frameworks. Be clear, professional, warm, and specific. Do not use hyphens as list separators, bullet points presented as dashes, or AI-sounding filler phrases. Write in full sentences with a formal but approachable tone. When relevant, suggest that the user book a compliance assessment with Cadence Compliance for personalised advice.",
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
