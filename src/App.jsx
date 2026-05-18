import { useState, useRef, useEffect } from "react";

const C = {
  bg: "#f9fafb",
  surface: "#ffffff",
  border: "#e5e9f0",
  borderLight: "#f0f3f8",
  accent: "#0071e3",
  accentLight: "#e8f1fd",
  text: "#1d1d1f",
  textSecondary: "#6e6e73",
  textLight: "#a1a1a6",
};

const FORMSPREE = "https://formspree.io/f/xykvgopv";

const SYSTEM_PROMPT = `You are a senior compliance and legal advisor at Cadence Compliance. You speak like a thoughtful, experienced human consultant — never like an AI assistant generating documentation.

Your expertise spans regulatory compliance, data protection law, commercial law, ADR, and operational governance across regulated industries globally.

When someone describes their operations or asks a legal question:
- Respond conversationally, as if you are sitting across from them explaining things
- Identify the real risks and explain why they matter in plain language
- Reference relevant regulations or legal principles where appropriate, but weave them naturally into your response rather than listing them
- Be specific and direct — give them something they can act on
- Never use markdown headers, bullet point symbols, or formatting symbols like ** or ##
- Write in flowing paragraphs, the way a smart advisor actually speaks
- Keep responses focused and practical
- End naturally by noting that for a full assessment or implementation support, they should reach out to Bolu at bolu.compliance@gmail.com

You are not a chatbot. You are a compliance expert having a real conversation.`;

function humanizeText(text) {
  return text
    .replace(/#{1,3}\s+/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/^[-•]\s+/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function EmailGate({ onSubmit }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = () => {
    if (!name.trim() || !email.trim()) { setError("Please fill in both fields."); return; }
    if (!email.includes("@") || !email.includes(".")) { setError("Please enter a valid email address."); return; }
    setError("");
    setLoading(true);
    fetch(FORMSPREE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), email: email.trim(), source: "Cadence Compliance Agent" }),
    }).catch(() => {});
    setTimeout(() => {
      setLoading(false);
      onSubmit({ name: name.trim(), email: email.trim() });
    }, 400);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(29,29,31,0.4)",
      backdropFilter: "blur(16px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      <div style={{
        background: C.surface, borderRadius: 20,
        padding: "44px 40px", maxWidth: 420, width: "100%",
        boxShadow: "0 32px 80px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)",
        animation: "slideUp 0.35s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: C.accent, marginBottom: 24,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L13 7H17L14 11L15.5 16L10 13L4.5 16L6 11L3 7H7L10 2Z" fill="white" fillOpacity="0.9"/>
          </svg>
        </div>

        <h2 style={{
          fontSize: 22, fontWeight: 600, color: C.text,
          marginBottom: 8, letterSpacing: "-0.3px",
          fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif",
        }}>Try the free advisor</h2>

        <p style={{
          fontSize: 14, color: C.textSecondary, marginBottom: 28, lineHeight: 1.6,
          fontFamily: "-apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif",
        }}>
          Enter your details to access the Cadence Compliance agent. No payment or account required.
        </p>

        {[
          { key: "name", label: "Full Name", type: "text", val: name, set: setName, ph: "Your full name" },
          { key: "email", label: "Email Address", type: "email", val: email, set: setEmail, ph: "you@company.com" },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: 14 }}>
            <label style={{
              display: "block", fontSize: 12, fontWeight: 500,
              color: focused === f.key ? C.accent : C.textSecondary,
              marginBottom: 6,
              fontFamily: "-apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif",
              transition: "color 0.2s",
            }}>{f.label}</label>
            <input
              type={f.type}
              value={f.val}
              onChange={e => f.set(e.target.value)}
              onFocus={() => setFocused(f.key)}
              onBlur={() => setFocused(null)}
              onKeyDown={e => e.key === "Enter" && submit()}
              placeholder={f.ph}
              style={{
                width: "100%", padding: "12px 14px",
                border: `1.5px solid ${focused === f.key ? C.accent : C.border}`,
                borderRadius: 10, fontSize: 15, color: C.text,
                background: "#fff", outline: "none", boxSizing: "border-box",
                fontFamily: "-apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif",
                transition: "border-color 0.2s",
                WebkitAppearance: "none",
              }}
            />
          </div>
        ))}

        {error && (
          <p style={{
            fontSize: 13, color: "#ff3b30", marginBottom: 14,
            fontFamily: "-apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif",
          }}>{error}</p>
        )}

        <button
          onClick={submit}
          disabled={loading}
          style={{
            width: "100%", padding: "13px",
            background: loading ? "#a0c4f0" : C.accent,
            border: "none", borderRadius: 10,
            color: "#fff", fontSize: 15, fontWeight: 500,
            cursor: loading ? "default" : "pointer",
            fontFamily: "-apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif",
            letterSpacing: "-0.1px", transition: "background 0.2s",
          }}
        >
          {loading ? "One moment…" : "Access the agent"}
        </button>

        <p style={{
          fontSize: 12, color: C.textLight, marginTop: 16, textAlign: "center",
          fontFamily: "-apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif",
          lineHeight: 1.5,
        }}>
          Your details are confidential and never shared.
        </p>
      </div>
    </div>
  );
}

function Msg({ msg, assistantIndex }) {
  const isUser = msg.role === "user";
  const [copied, setCopied] = useState(false);
  const isLocked = !isUser && assistantIndex >= 3;

  const copy = () => {
    if (isLocked) return;
    navigator.clipboard.writeText(msg.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{
      marginBottom: 12,
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      animation: "fadeIn 0.25s ease",
    }}>
      {!isUser && (
        <div style={{
          width: 30, height: 30, borderRadius: "50%",
          background: C.accent, flexShrink: 0, marginRight: 10, marginTop: 2,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L13 7H17L14 11L15.5 16L10 13L4.5 16L6 11L3 7H7L10 2Z" fill="white" fillOpacity="0.9"/>
          </svg>
        </div>
      )}

      <div style={{ maxWidth: "76%", position: "relative" }}>
        <div style={{
          padding: isUser ? "11px 16px" : "14px 16px",
          borderRadius: isUser ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
          background: isUser ? C.accent : C.surface,
          color: isUser ? "#fff" : C.text,
          fontSize: 14.5, lineHeight: 1.7,
          border: isUser ? "none" : `1px solid ${C.border}`,
          fontFamily: "-apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif",
          boxShadow: isUser ? "0 2px 8px rgba(0,113,227,0.2)" : "0 1px 4px rgba(0,0,0,0.04)",
          filter: isLocked ? "blur(5px)" : "none",
          userSelect: isLocked ? "none" : "text",
          whiteSpace: "pre-wrap",
          overflow: "hidden",
        }}>
          {msg.content}
          {msg.attachment && (
            <div style={{
              marginTop: 10, padding: "8px 10px",
              background: isUser ? "rgba(255,255,255,0.15)" : C.bg,
              borderRadius: 8, fontSize: 12,
              color: isUser ? "rgba(255,255,255,0.8)" : C.textSecondary,
            }}>
              📄 {msg.attachment.name} ({Math.round(msg.attachment.size / 1024)}KB)
            </div>
          )}
        </div>

        {isLocked && (
          <div style={{
            position: "absolute", inset: 0,
            borderRadius: "4px 18px 18px 18px",
            background: "rgba(249,250,251,0.88)",
            backdropFilter: "blur(3px)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "20px 24px", textAlign: "center",
            border: `1px solid ${C.border}`,
          }}>
            <p style={{
              fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 4,
              fontFamily: "-apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif",
            }}>Preview limit reached</p>
            <p style={{
              fontSize: 12, color: C.textSecondary, marginBottom: 12, lineHeight: 1.5,
              fontFamily: "-apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif",
            }}>Contact Bolu to continue your assessment.</p>
            <a href="mailto:bolu.compliance@gmail.com" style={{
              fontSize: 12, fontWeight: 500, color: "#fff",
              background: C.accent, padding: "7px 16px",
              borderRadius: 8, textDecoration: "none",
              fontFamily: "-apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif",
            }}>Get in touch</a>
          </div>
        )}

        {!isUser && !isLocked && (
          <button onClick={copy} style={{
            marginTop: 5, background: "none", border: "none",
            cursor: "pointer", fontSize: 11,
            color: copied ? C.accent : C.textLight,
            fontFamily: "-apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif",
            padding: "2px 4px",
          }}>
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
    </div>
  );
}

function Dots() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, animation: "fadeIn 0.2s ease" }}>
      <div style={{
        width: 30, height: 30, borderRadius: "50%",
        background: C.accent, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
          <path d="M10 2L13 7H17L14 11L15.5 16L10 13L4.5 16L6 11L3 7H7L10 2Z" fill="white" fillOpacity="0.9"/>
        </svg>
      </div>
      <div style={{
        padding: "11px 16px", background: C.surface,
        border: `1px solid ${C.border}`, borderRadius: "4px 18px 18px 18px",
        display: "flex", gap: 5, alignItems: "center",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: "50%",
            background: C.textLight,
            animation: `dot 1.2s ease ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

const PROMPTS = [
  "We collect customer data across multiple channels. What compliance gaps should I be aware of?",
  "Walk me through what an AML compliance framework should look like for a fintech startup.",
  "We're a homecare provider. What regulations apply to how we handle patient information?",
  "What does a valid arbitration clause need to include to be enforceable?",
];

export default function CadenceAgent() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [focused, setFocused] = useState(false);
  const fileRef = useRef();
  const bottomRef = useRef();
  const textRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") { alert("Please upload a PDF file."); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      setAttachment({ name: file.name, size: file.size, data: ev.target.result.split(",")[1] });
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

    const userMsg = { role: "user", content: text || "Please review the attached document.", attachment: att };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setLoading(true);

    try {
      const apiMsgs = updated.map(m => {
        if (m.attachment?.data) {
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
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: apiMsgs,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const raw = data.content?.map(b => b.text || "").join("") || "";
      const reply = humanizeText(raw);
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong. Please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const assistantCount = messages.filter(m => m.role === "assistant").length;
  const isLocked = assistantCount >= 3;
  const isEmpty = messages.length === 0;

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.bg}; -webkit-font-smoothing: antialiased; }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)} }
        @keyframes dot { 0%,100%{transform:translateY(0);opacity:0.4}50%{transform:translateY(-4px);opacity:1} }
        textarea { font-family: -apple-system,'Helvetica Neue',sans-serif!important; resize:none; }
        input { font-family: -apple-system,'Helvetica Neue',sans-serif!important; }
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:${C.border};border-radius:4px}
        #replit-badge,[data-testid="replit-badge"],a[href*="replit.com/badge"],iframe[src*="replit"]{
          display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;
        }
      `}</style>

      {!user && <EmailGate onSubmit={setUser} />}

      <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: C.bg }}>
        {/* Header */}
        <div style={{
          background: "rgba(255,255,255,0.88)", backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${C.borderLight}`,
          padding: "14px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: C.accent,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L13 7H17L14 11L15.5 16L10 13L4.5 16L6 11L3 7H7L10 2Z" fill="white" fillOpacity="0.9"/>
              </svg>
            </div>
            <div>
              <div style={{
                fontSize: 15, fontWeight: 600, color: C.text, letterSpacing: "-0.2px",
                fontFamily: "-apple-system, 'Helvetica Neue', sans-serif",
              }}>Cadence Compliance</div>
              <div style={{
                fontSize: 11, color: C.textLight,
                fontFamily: "-apple-system, 'Helvetica Neue', sans-serif",
              }}>Compliance Advisor</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {user && (
              <span style={{
                fontSize: 12, color: C.textSecondary,
                fontFamily: "-apple-system, 'Helvetica Neue', sans-serif",
              }}>{user.name}</span>
            )}
            {messages.length > 0 && (
              <button onClick={() => setMessages([])} style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 12, color: C.textLight,
                fontFamily: "-apple-system, 'Helvetica Neue', sans-serif",
              }}>Clear</button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            {isEmpty && (
              <div style={{ textAlign: "center", padding: "60px 20px 40px", animation: "fadeIn 0.4s ease" }}>
                <div style={{
                  width: 54, height: 54, borderRadius: 16, background: C.accentLight,
                  margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2L13 7H17L14 11L15.5 16L10 13L4.5 16L6 11L3 7H7L10 2Z" fill={C.accent}/>
                  </svg>
                </div>
                <h2 style={{
                  fontSize: 22, fontWeight: 600, color: C.text, marginBottom: 8, letterSpacing: "-0.3px",
                  fontFamily: "-apple-system, 'Helvetica Neue', sans-serif",
                }}>How can I help you today?</h2>
                <p style={{
                  fontSize: 14, color: C.textSecondary, lineHeight: 1.65, maxWidth: 380, margin: "0 auto 32px",
                  fontFamily: "-apple-system, 'Helvetica Neue', sans-serif",
                }}>
                  Describe your operations, ask a compliance question, or upload a policy document for review.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 440, margin: "0 auto" }}>
                  {PROMPTS.map((q, i) => (
                    <button key={i} onClick={() => { setInput(q); textRef.current?.focus(); }} style={{
                      padding: "12px 16px", background: C.surface,
                      border: `1px solid ${C.border}`, borderRadius: 12,
                      color: C.text, fontSize: 13.5, cursor: "pointer", textAlign: "left",
                      fontFamily: "-apple-system, 'Helvetica Neue', sans-serif",
                      lineHeight: 1.5, transition: "border-color 0.15s, box-shadow 0.15s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,113,227,0.1)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; }}
                    >{q}</button>
                  ))}
                </div>
                <p style={{
                  fontSize: 12, color: C.textLight, marginTop: 32,
                  fontFamily: "-apple-system, 'Helvetica Neue', sans-serif",
                }}>Powered by Cadence Compliance</p>
              </div>
            )}

            {messages.map((m, i) => {
              const aIdx = m.role === "assistant"
                ? messages.slice(0, i + 1).filter(x => x.role === "assistant").length - 1
                : -1;
              return <Msg key={i} msg={m} assistantIndex={aIdx} />;
            })}
            {loading && <Dots />}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input */}
        <div style={{
          background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)",
          borderTop: `1px solid ${C.borderLight}`,
          padding: "14px 20px 20px", flexShrink: 0,
        }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            {attachment && (
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "8px 12px", background: C.accentLight,
                border: `1px solid ${C.accent}22`, borderRadius: 8, marginBottom: 10,
              }}>
                <span style={{
                  fontSize: 12.5, color: C.accent, flex: 1,
                  fontFamily: "-apple-system, 'Helvetica Neue', sans-serif",
                }}>📄 {attachment.name} ({Math.round(attachment.size / 1024)}KB)</span>
                <button onClick={() => setAttachment(null)} style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 16, color: C.accent, lineHeight: 1,
                }}>×</button>
              </div>
            )}

            {isLocked && (
              <div style={{
                padding: "10px 14px", background: C.accentLight,
                border: `1px solid ${C.accent}22`, borderRadius: 10, marginBottom: 10,
                textAlign: "center",
                fontFamily: "-apple-system, 'Helvetica Neue', sans-serif",
                fontSize: 13, color: C.accent, fontWeight: 500,
              }}>
                Free preview complete.{" "}
                <a href="mailto:bolu.compliance@gmail.com" style={{ color: C.accent, fontWeight: 600 }}>
                  Email Bolu
                </a>{" "}to continue.
              </div>
            )}

            <div style={{
              display: "flex", gap: 8, alignItems: "flex-end",
              background: C.surface,
              border: `1.5px solid ${focused ? C.accent : C.border}`,
              borderRadius: 14, padding: "10px 10px 10px 14px",
              boxShadow: focused ? "0 0 0 3px rgba(0,113,227,0.08)" : "0 1px 4px rgba(0,0,0,0.06)",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}>
              <textarea
                ref={textRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKey}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                disabled={isLocked}
                placeholder={isLocked ? "Preview limit reached." : "Ask about compliance, regulations, or upload a policy…"}
                rows={2}
                style={{
                  flex: 1, fontSize: 14.5, color: isLocked ? C.textLight : C.text,
                  background: "transparent", border: "none", outline: "none",
                  lineHeight: 1.6, padding: 0, cursor: isLocked ? "not-allowed" : "text",
                }}
              />
              <div style={{ display: "flex", gap: 6, alignItems: "flex-end", flexShrink: 0 }}>
                {!isLocked && (
                  <>
                    <button onClick={() => fileRef.current?.click()} title="Attach PDF" style={{
                      width: 34, height: 34, borderRadius: 8, border: "none",
                      background: C.bg, cursor: "pointer", fontSize: 16,
                      display: "flex", alignItems: "center", justifyContent: "center", color: C.textSecondary,
                    }}>📎</button>
                    <input ref={fileRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={handleFile} />
                  </>
                )}
                <button
                  onClick={send}
                  disabled={(!input.trim() && !attachment) || loading || isLocked}
                  style={{
                    width: 34, height: 34, borderRadius: 8, border: "none",
                    background: ((!input.trim() && !attachment) || loading || isLocked) ? C.border : C.accent,
                    cursor: ((!input.trim() && !attachment) || loading || isLocked) ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "background 0.15s", flexShrink: 0,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 19V5m-7 7l7-7 7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
            <p style={{
              fontSize: 11, color: C.textLight, marginTop: 8, textAlign: "center",
              fontFamily: "-apple-system, 'Helvetica Neue', sans-serif",
            }}>
              Free preview only. For a full assessment, contact{" "}
              <a href="mailto:bolu.compliance@gmail.com" style={{ color: C.accent, textDecoration: "none" }}>bolu.compliance@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
