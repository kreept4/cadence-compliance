import { useState, useRef, useEffect } from "react";

const C = {
  bg: "#f7f5f0",
  surface: "#ffffff",
  border: "#e8e2d9",
  accent: "#1a3a2a",
  accentMid: "#2d5a40",
  gold: "#c9a84c",
  goldLight: "#e8c97a",
  text: "#1a1a1a",
  muted: "#7a7060",
  light: "#b8b0a0",
};

const FORMSPREE = "https://formspree.io/f/xykvgopv";

const MODES = {
  compliance: {
    label: "Compliance Monitor",
    placeholder: "Describe your operations or paste a policy document...",
    system: `You are a senior AI compliance advisor at Cadence Compliance, specializing in regulatory compliance for businesses operating in regulated industries globally.

Your role: audit operations and policies, identify compliance gaps, flag regulatory risks, and recommend structured fixes.

When a user describes their operations or pastes a policy:
1. Identify the top 3-5 compliance gaps or risks
2. Reference relevant regulations applicable to their context
3. Suggest concrete remediation steps
4. Provide a brief risk severity rating (High/Medium/Low) for each gap

Be authoritative, precise, and structured. Use clear headings and bullet points. End every response with: "For a comprehensive assessment and full remediation support, reach Bolu at bolu.compliance@gmail.com"`,
  },
  legal: {
    label: "Legal Research Assistant",
    placeholder: "Ask a legal question or describe a case scenario...",
    system: `You are a senior legal research assistant at Cadence Compliance, with expertise in commercial law, regulatory compliance, ADR, and cross-border legal matters.

Your role: provide structured legal research responses for lawyers, paralegals, and compliance officers.

When a user asks a legal question or describes a scenario:
1. Identify the applicable legal framework and statutes
2. Summarize the relevant legal principles
3. Reference key cases or regulatory guidance where applicable
4. Outline 2-3 recommended next steps or strategic considerations

Be precise, structured, and professional. End every response with: "This is preliminary research only. For a full consultation, reach Bolu at bolu.compliance@gmail.com"`,
  },
};

function renderMarkdown(text) {
  return text
    .replace(/^### (.+)$/gm, '<h3 style="font-size:15px;font-weight:700;margin:14px 0 6px;color:#1a3a2a">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="font-size:16px;font-weight:700;margin:16px 0 8px;color:#1a3a2a">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="font-size:18px;font-weight:700;margin:16px 0 8px;color:#1a3a2a">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li style="margin:4px 0;padding-left:4px">$1</li>')
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, (m) => `<ul style="margin:8px 0;padding-left:20px">${m}</ul>`)
    .replace(/\n\n/g, '</p><p style="margin:8px 0">')
    .replace(/^(?!<[hul])(.+)$/gm, (m) => m.trim() ? m : '');
}

function EmailGate({ onSubmit }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async () => {
    if (!name.trim() || !email.trim()) { setError("Please fill in both fields."); return; }
    if (!email.includes("@")) { setError("Please enter a valid email address."); return; }
    setLoading(true);
    setError(null);
    try {
      fetch(FORMSPREE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, source: "Cadence Compliance Agent" }),
      }).catch(() => {});
      onSubmit({ name, email });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(26,58,42,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, backdropFilter: "blur(4px)", padding: 24,
    }}>
      <div style={{
        background: C.surface, borderRadius: 16, padding: "40px 36px",
        maxWidth: 420, width: "100%", boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
        border: `1px solid ${C.border}`,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: C.accent, display: "flex", alignItems: "center",
          justifyContent: "center", marginBottom: 20,
        }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.gold, fontFamily: "'Cormorant Garamond', serif" }}>C</div>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: C.accent, marginBottom: 8, fontFamily: "'Cormorant Garamond', serif" }}>
          Try the Agent Free
        </h2>
        <p style={{ fontSize: 14, color: C.muted, marginBottom: 28, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
          Enter your details to access the Cadence Compliance AI agent. No payment required.
        </p>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: "block", marginBottom: 6, fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.5px", textTransform: "uppercase" }}>Full Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your full name"
            style={{
              width: "100%", padding: "12px 14px", border: `1px solid ${C.border}`,
              borderRadius: 10, fontSize: 14, color: C.text, outline: "none",
              fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
            }}
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: "block", marginBottom: 6, fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.5px", textTransform: "uppercase" }}>Email Address</label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            type="email"
            onKeyDown={e => e.key === "Enter" && submit()}
            style={{
              width: "100%", padding: "12px 14px", border: `1px solid ${C.border}`,
              borderRadius: 10, fontSize: 14, color: C.text, outline: "none",
              fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
            }}
          />
        </div>
        {error && <p style={{ fontSize: 13, color: "#c00", marginBottom: 14, fontFamily: "'DM Sans', sans-serif" }}>{error}</p>}
        <button
          onClick={submit}
          disabled={loading}
          style={{
            width: "100%", padding: "14px", background: C.accent,
            border: "none", borderRadius: 10, color: "#fff",
            fontSize: 15, fontWeight: 600, cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Please wait..." : "Access the Agent"}
        </button>
        <p style={{ fontSize: 11, color: C.light, marginTop: 14, textAlign: "center", fontFamily: "'DM Sans', sans-serif" }}>
          Your details are kept confidential and never shared.
        </p>
      </div>
    </div>
  );
}

function Msg({ msg, index, conversationLength }) {
  const isUser = msg.role === "user";
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(msg.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const showNudge = !isUser && index === conversationLength - 1 && conversationLength >= 6;

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
        {!isUser && (
          <div style={{
            width: 32, height: 32, borderRadius: "50%", background: C.accent,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, color: "#fff", fontWeight: 700,
            marginRight: 10, flexShrink: 0, marginTop: 2,
            fontFamily: "'DM Sans', sans-serif",
          }}>CC</div>
        )}
        <div style={{
          maxWidth: "78%",
          padding: "13px 16px",
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          background: isUser ? C.accent : C.surface,
          color: isUser ? "#fff" : C.text,
          fontSize: 14, lineHeight: 1.75,
          border: isUser ? "none" : `1px solid ${C.border}`,
          boxShadow: isUser ? "0 2px 12px rgba(26,58,42,0.15)" : "0 2px 8px rgba(0,0,0,0.04)",
          position: "relative",
        }}>
          {isUser ? (
            <span style={{ fontFamily: "'DM Sans', sans-serif", whiteSpace: "pre-wrap" }}>{msg.content}</span>
          ) : (
            <div
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              dangerouslySetInnerHTML={{ __html: `<p style="margin:0">${renderMarkdown(msg.content)}</p>` }}
            />
          )}
          {msg.attachment && (
            <div style={{
              marginTop: 10, padding: "8px 12px",
              background: isUser ? "rgba(255,255,255,0.1)" : C.bg,
              borderRadius: 8, fontSize: 12,
              color: isUser ? "rgba(255,255,255,0.8)" : C.muted,
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {msg.attachment.type === "image" && msg.attachment.preview ? (
                <div>
                  <img src={msg.attachment.preview} alt="attachment" style={{ maxWidth: "100%", maxHeight: 160, borderRadius: 6, display: "block", marginBottom: 4 }} />
                  <span>📎 {msg.attachment.name}</span>
                </div>
              ) : (
                <span>📄 {msg.attachment.name} {msg.attachment.size ? `(${Math.round(msg.attachment.size / 1024)}KB)` : ""}</span>
              )}
            </div>
          )}
        </div>
      </div>
      {!isUser && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6, marginLeft: 42 }}>
          <button onClick={copy} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 11, color: copied ? C.gold : C.light,
            fontFamily: "'DM Sans', sans-serif", padding: "2px 0",
            display: "flex", alignItems: "center", gap: 4,
          }}>
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      )}
      {showNudge && (
        <div style={{
          margin: "16px 0 0 42px", padding: "12px 16px",
          background: "#fffbf0", border: `1px solid ${C.gold}66`,
          borderRadius: 10, fontSize: 13, color: C.muted,
          fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6,
        }}>
          Ready for a comprehensive assessment? Book a consultation with Bolu at{" "}
          <a href="mailto:bolu.compliance@gmail.com" style={{ color: C.accent, fontWeight: 600 }}>bolu.compliance@gmail.com</a>
        </div>
      )}
    </div>
  );
}

function TypingDots() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%", background: C.accent,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, color: "#fff", fontWeight: 700, flexShrink: 0,
        fontFamily: "'DM Sans', sans-serif",
      }}>CC</div>
      <div style={{
        padding: "13px 18px", background: C.surface,
        border: `1px solid ${C.border}`, borderRadius: "18px 18px 18px 4px",
        display: "flex", gap: 5, alignItems: "center",
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: "50%", background: C.light,
            animation: `bounce 1s ease ${i * 0.15}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

export default function CadenceAgent() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("compliance");
  const [messages, setMessages] = useState({ compliance: [], legal: [] });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const fileRef = useRef();
  const bottomRef = useRef();
  const textRef = useRef();
  const cfg = MODES[mode];
  const msgs = messages[mode];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const isPdf = file.type === "application/pdf";
    if (!isPdf) { alert("Only PDF files are supported."); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAttachment({ name: file.name, size: file.size, type: "pdf", data: ev.target.result.split(",")[1] });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const send = async () => {
    const text = input.trim();
    if ((!text && !attachment) || loading) return;
    setInput("");
    const att = attachment;
    setAttachment(null);

    const userMsg = { role: "user", content: text || "(See attached document)", attachment: att };
    const updated = [...msgs, userMsg];
    setMessages(p => ({ ...p, [mode]: updated }));
    setLoading(true);

    try {
      const apiMsgs = updated.map(m => {
        if (m.attachment && m.attachment.type === "pdf" && m.attachment.data) {
          return {
            role: m.role,
            content: [
              { type: "document", source: { type: "base64", media_type: "application/pdf", data: m.attachment.data } },
              { type: "text", text: m.content },
            ],
          };
        }
        return { role: m.role, content: m.content };
      });

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: cfg.system,
          messages: apiMsgs,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const reply = data.content?.map(b => b.text || "").join("") || "";
      setMessages(p => ({ ...p, [mode]: [...updated, { role: "assistant", content: reply }] }));
    } catch (e) {
      setMessages(p => ({ ...p, [mode]: [...updated, { role: "assistant", content: "Something went wrong. Please try again." }] }));
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const charCount = input.length;
  const isEmpty = msgs.length === 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; background: ${C.bg}; }
        @keyframes bounce { 0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }
        textarea { font-family: 'DM Sans', sans-serif !important; resize: none; }
        input { font-family: 'DM Sans', sans-serif !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 4px; }
        #replit-badge,[data-testid="replit-badge"],a[href*="replit.com/badge"],iframe[src*="replit"] {
          display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;
        }
      `}</style>

      {!user && <EmailGate onSubmit={setUser} />}

      <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: C.bg }}>
        {/* Header */}
        <div style={{
          background: C.accent, padding: "16px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: `3px solid ${C.gold}`, flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 8, background: C.gold,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 700, color: C.accent,
              fontFamily: "'Cormorant Garamond', serif",
            }}>C</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.3px" }}>
                Cadence Compliance
              </div>
              <div style={{ fontSize: 11, color: C.goldLight, letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>
                AI Advisory Agent
              </div>
            </div>
          </div>
          {user && (
            <div style={{ fontSize: 12, color: C.goldLight, fontFamily: "'DM Sans', sans-serif" }}>
              {user.name}
            </div>
          )}
        </div>

        {/* Mode toggle */}
        <div style={{
          background: C.surface, borderBottom: `1px solid ${C.border}`,
          padding: "10px 20px", display: "flex", gap: 8, alignItems: "center", flexShrink: 0,
        }}>
          <span style={{ fontSize: 12, color: C.muted, fontFamily: "'DM Sans', sans-serif", marginRight: 4 }}>Mode:</span>
          {Object.entries(MODES).map(([key, m]) => (
            <button key={key} onClick={() => setMode(key)} style={{
              padding: "6px 16px", borderRadius: 20,
              border: `1px solid ${mode === key ? C.accent : C.border}`,
              background: mode === key ? C.accent : "transparent",
              color: mode === key ? "#fff" : C.muted,
              fontSize: 12, fontWeight: 600, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
            }}>{m.label}</button>
          ))}
          {msgs.length > 0 && (
            <button onClick={() => setMessages(p => ({ ...p, [mode]: [] }))} style={{
              marginLeft: "auto", background: "none", border: "none",
              fontSize: 12, color: C.light, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}>Clear</button>
          )}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            {isEmpty && (
              <div style={{ textAlign: "center", padding: "48px 16px", animation: "fadeUp 0.4s ease" }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: C.accent, marginBottom: 8, fontFamily: "'Cormorant Garamond', serif" }}>
                  {cfg.label}
                </h2>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, maxWidth: 400, margin: "0 auto 28px", fontFamily: "'DM Sans', sans-serif" }}>
                  {mode === "compliance"
                    ? "Describe your business operations or paste a policy document. The agent will identify compliance gaps and recommend fixes."
                    : "Ask a legal question or describe a scenario. The agent will provide structured research and strategic guidance."}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 420, margin: "0 auto 32px" }}>
                  {(mode === "compliance" ? [
                    "We collect customer data for our business. What compliance gaps should we be aware of?",
                    "Review our employee data handling policy for compliance risks.",
                    "What regulations apply to a financial services startup?",
                  ] : [
                    "What are the legal requirements for a valid arbitration clause?",
                    "What liability does a company face in a data breach?",
                    "What does AML compliance require from financial institutions?",
                  ]).map((q, i) => (
                    <button key={i} onClick={() => { setInput(q); textRef.current?.focus(); }} style={{
                      padding: "11px 16px", background: C.surface,
                      border: `1px solid ${C.border}`, borderRadius: 10,
                      color: C.text, fontSize: 13, cursor: "pointer", textAlign: "left",
                      fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5,
                    }}>{q}</button>
                  ))}
                </div>
                <p style={{ fontSize: 12, color: C.light, fontFamily: "'DM Sans', sans-serif" }}>
                  Powered by Cadence Compliance
                </p>
              </div>
            )}
            {msgs.map((m, i) => (
              <Msg key={i} msg={m} index={i} conversationLength={msgs.length} />
            ))}
            {loading && <TypingDots />}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input */}
        <div style={{
          background: C.surface, borderTop: `1px solid ${C.border}`,
          padding: "14px 20px", flexShrink: 0,
        }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            {attachment && (
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 12px", background: C.bg,
                border: `1px solid ${C.border}`, borderRadius: 8,
                marginBottom: 10,
              }}>
                <span style={{ fontSize: 13, color: C.muted, fontFamily: "'DM Sans', sans-serif", flex: 1 }}>
                  📄 {attachment.name} ({Math.round(attachment.size / 1024)}KB)
                </span>
                <button onClick={() => setAttachment(null)} style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 16, color: C.light, lineHeight: 1,
                }}>×</button>
              </div>
            )}
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              <button onClick={() => fileRef.current?.click()} style={{
                width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                border: `1px solid ${C.border}`, background: C.bg,
                cursor: "pointer", fontSize: 18, display: "flex",
                alignItems: "center", justifyContent: "center", color: C.muted,
              }}>📎</button>
              <input ref={fileRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={handleFile} />
              <div style={{ flex: 1, position: "relative" }}>
                <textarea
                  ref={textRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={onKey}
                  placeholder={cfg.placeholder}
                  rows={2}
                  style={{
                    width: "100%", padding: "11px 14px",
                    border: `1px solid ${C.border}`, borderRadius: 10,
                    fontSize: 14, color: C.text, background: C.bg,
                    outline: "none", lineHeight: 1.6,
                  }}
                />
                {charCount > 0 && (
                  <span style={{
                    position: "absolute", bottom: 8, right: 10,
                    fontSize: 10, color: C.light, fontFamily: "'DM Sans', sans-serif",
                  }}>{charCount}</span>
                )}
              </div>
              <button onClick={send} disabled={(!input.trim() && !attachment) || loading} style={{
                width: 42, height: 42, background: C.accent, border: "none",
                borderRadius: 10, color: "#fff", fontSize: 18,
                cursor: "pointer", flexShrink: 0,
                opacity: ((!input.trim() && !attachment) || loading) ? 0.4 : 1,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>↑</button>
            </div>
            <p style={{ fontSize: 11, color: C.light, marginTop: 8, textAlign: "center", fontFamily: "'DM Sans', sans-serif" }}>
              Free preview only. For a full assessment, reach Bolu at bolu.compliance@gmail.com
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
