import { useState, useRef, useEffect } from "react";
import "./App.css";

const MAILTO_LINK =
  "mailto:bolu.compliance@gmail.com?subject=Cadence%20Compliance%20Inquiry&body=Hi%20Bolu%2C%0A%0AI%20just%20used%20the%20Cadence%20Compliance%20agent%20and%20I%27d%20like%20to%20discuss%20a%20full%20assessment%20for%20my%20organisation.%0A%0A%5BBrief%20description%20of%20your%20business%20and%20what%20you%20need%20help%20with%5D%0A%0ALooking%20forward%20to%20hearing%20from%20you.";

const SYSTEM_PROMPT = `You are a specialist compliance advisor operating under Cadence Compliance, run by Bolu Ogunleye — a qualified lawyer and Chartered Arbitrator. You provide expert, structured compliance guidance.

RESPONSE RULES — follow these exactly:
1. Never use hyphens (-) as bullet points or list markers. Use numbers (1. 2. 3.) for all lists.
2. Never use markdown symbols: no **, no ##, no *, no ---, no >.
3. Where a risk level applies to the overall situation, start your response with a single line: RISK LEVEL: [High/Medium/Low] followed by a blank line. Use High for serious regulatory exposure, Medium for moderate gaps, Low for minor or procedural issues. Only include this where genuinely relevant.
4. Use numbered lists where there are multiple points. Do not mush everything into a paragraph when there are distinct items.
5. Write in a clear, professional, consultant tone — not robotic, not overly casual.
6. Keep responses focused and scannable. Use short paragraphs between numbered lists where needed.
7. Do not pepper the user with multiple questions. Ask at most one clarifying question per response, and only when genuinely needed.
8. Do not recommend the user "consult a lawyer" — you are the specialist. Give direct, informed guidance.
9. Never start a sentence with a hyphen. Never use " - " as punctuation mid-sentence.
10. Sign off responses where appropriate by noting that a full written assessment is available through Cadence Compliance.`;

const SUGGESTED_PROMPTS = [
  "Review my privacy policy for NDPR compliance",
  "What compliance gaps do homecare agencies typically have?",
  "Is my employee data handling legally sound?",
  "What regulations apply to my fintech startup in Nigeria?",
];

function stripHyphens(text) {
  // Remove lines that start with "- " (hyphen bullet)
  let cleaned = text.replace(/^(\s*)-\s+/gm, (match, indent) => {
    return indent;
  });
  // Remove inline " - " used as punctuation → replace with em dash or comma
  cleaned = cleaned.replace(/\s-\s/g, " — ");
  // Remove leading hyphens at start of sentence
  cleaned = cleaned.replace(/^-\s/gm, "");
  return cleaned;
}

function formatResponse(text) {
  // Strip hyphens first
  let t = stripHyphens(text);

  // Handle RISK LEVEL line — render as styled badge
  t = t.replace(
    /^RISK LEVEL:\s*(High|Medium|Low)/im,
    (_, level) => `__RISK__${level}__RISK__`
  );

  return t;
}

function RiskBadge({ level }) {
  const colors = {
    High: { bg: "#fff0f0", border: "#ff4d4d", text: "#cc0000", emoji: "🔴" },
    Medium: { bg: "#fffbf0", border: "#f5a623", text: "#b07800", emoji: "🟡" },
    Low: { bg: "#f0fff4", border: "#34c759", text: "#1a7a35", emoji: "🟢" },
  };
  const c = colors[level] || colors.Medium;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: "6px",
        padding: "4px 10px",
        marginBottom: "12px",
        fontSize: "13px",
        fontWeight: "600",
        color: c.text,
        letterSpacing: "0.02em",
      }}
    >
      {c.emoji} Risk Level: {level}
    </div>
  );
}

function MessageContent({ text }) {
  const riskMatch = text.match(/__RISK__(High|Medium|Low)__RISK__/i);
  const level = riskMatch ? riskMatch[1] : null;
  const cleanText = text.replace(/__RISK__(High|Medium|Low)__RISK__\n?/i, "").trim();

  const lines = cleanText.split("\n");

  return (
    <div>
      {level && <RiskBadge level={level} />}
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} style={{ height: "8px" }} />;
        // Numbered list item
        const numMatch = line.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "6px",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  minWidth: "22px",
                  height: "22px",
                  background: "#0a84ff",
                  color: "#fff",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: "700",
                  flexShrink: 0,
                  marginTop: "1px",
                }}
              >
                {numMatch[1]}
              </span>
              <span style={{ lineHeight: "1.6", flex: 1 }}>{numMatch[2]}</span>
            </div>
          );
        }
        return (
          <p key={i} style={{ margin: "0 0 6px 0", lineHeight: "1.65" }}>
            {line}
          </p>
        );
      })}
    </div>
  );
}

function BlurredMessage() {
  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          filter: "blur(5px)",
          userSelect: "none",
          pointerEvents: "none",
          lineHeight: "1.65",
          color: "#333",
        }}
      >
        <p>
          Based on the details provided, this assessment identifies several key
          compliance considerations that require your attention. The regulatory
          framework applicable to your organisation creates specific obligations
          around data handling, internal controls, and reporting.
        </p>
        <p>
          1. Your current data processing practices present exposure under
          applicable data protection law.
        </p>
        <p>
          2. Internal policy documentation does not meet regulatory standards in
          its current form.
        </p>
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          background: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(2px)",
          borderRadius: "12px",
        }}
      >
        <p
          style={{
            fontWeight: "600",
            fontSize: "14px",
            color: "#111",
            textAlign: "center",
            margin: 0,
          }}
        >
          You've reached the free preview limit.
        </p>
        <a
          href={MAILTO_LINK}
          style={{
            background: "#0a84ff",
            color: "#fff",
            padding: "9px 18px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "600",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Contact Bolu to continue →
        </a>
      </div>
    </div>
  );
}

function Msg({ role, text, isLocked }) {
  const isUser = role === "user";

  if (isLocked) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginBottom: "18px",
        }}
      >
        <div style={{ display: "flex", gap: "10px", maxWidth: "80%", alignItems: "flex-start" }}>
          <Avatar />
          <div
            style={{
              background: "#fff",
              border: "1px solid #e8e8e8",
              borderRadius: "14px",
              padding: "14px 16px",
              fontSize: "14px",
              color: "#1a1a1a",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              flex: 1,
            }}
          >
            <BlurredMessage />
          </div>
        </div>
      </div>
    );
  }

  const formatted = formatResponse(text);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "18px",
      }}
    >
      {!isUser && (
        <div style={{ display: "flex", gap: "10px", maxWidth: "80%", alignItems: "flex-start" }}>
          <Avatar />
          <div
            style={{
              background: "#fff",
              border: "1px solid #e8e8e8",
              borderRadius: "14px",
              padding: "14px 16px",
              fontSize: "14px",
              color: "#1a1a1a",
              lineHeight: "1.65",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            <MessageContent text={formatted} />
          </div>
        </div>
      )}
      {isUser && (
        <div
          style={{
            background: "#0a84ff",
            color: "#fff",
            borderRadius: "14px",
            padding: "12px 16px",
            fontSize: "14px",
            lineHeight: "1.6",
            maxWidth: "75%",
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
}

function Avatar() {
  return (
    <div
      style={{
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        background: "#0a84ff",
        flexShrink: 0,
        marginTop: "2px",
      }}
    />
  );
}

function EmailGate({ onEnter }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim()) {
      setError("Please enter your name and email.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    try {
      await fetch("https://formspree.io/f/xpwrjkwa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, organisation: org }),
      });
    } catch (_) {}
    setSubmitting(false);
    onEnter({ name, email, org });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily:
          "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "40px 36px",
          maxWidth: "420px",
          width: "100%",
          boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            background: "#0a84ff",
            borderRadius: "14px",
            marginBottom: "20px",
          }}
        />
        <h1
          style={{
            fontSize: "22px",
            fontWeight: "700",
            color: "#111",
            margin: "0 0 8px 0",
          }}
        >
          Cadence Compliance
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "#666",
            margin: "0 0 28px 0",
            lineHeight: "1.6",
          }}
        >
          AI-powered compliance guidance from a qualified lawyer and Chartered
          Arbitrator. Enter your details to begin.
        </p>

        {[
          { label: "Full Name", val: name, set: setName, type: "text", ph: "Your name" },
          { label: "Email Address", val: email, set: setEmail, type: "email", ph: "you@company.com" },
          { label: "Organisation (optional)", val: org, set: setOrg, type: "text", ph: "Company or firm name" },
        ].map(({ label, val, set, type, ph }) => (
          <div key={label} style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "#333",
                marginBottom: "6px",
              }}
            >
              {label}
            </label>
            <input
              type={type}
              value={val}
              onChange={(e) => set(e.target.value)}
              placeholder={ph}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "10px",
                border: "1px solid #e0e0e0",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "inherit",
                color: "#111",
              }}
            />
          </div>
        ))}

        {error && (
          <p style={{ color: "#cc0000", fontSize: "13px", marginBottom: "12px" }}>
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            width: "100%",
            padding: "12px",
            background: submitting ? "#7db8f5" : "#0a84ff",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: "600",
            cursor: submitting ? "not-allowed" : "pointer",
            fontFamily: "inherit",
          }}
        >
          {submitting ? "Starting..." : "Start Consultation"}
        </button>

        <p
          style={{
            fontSize: "11px",
            color: "#aaa",
            textAlign: "center",
            marginTop: "16px",
            lineHeight: "1.5",
          }}
        >
          By continuing you agree that responses are for informational purposes.
          A full written assessment is available upon request.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const assistantCount = messages.filter((m) => m.role === "assistant").length;
  const isLocked = assistantCount >= 3;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text) => {
    if (!text.trim() || loading || isLocked) return;
    const userMsg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next.map((m) => ({ role: m.role, text: m.content || m.text })));
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({
            role: m.role,
            content: m.content || m.text,
          })),
          system: SYSTEM_PROMPT,
        }),
      });
      const data = await res.json();
      const reply =
        data?.content?.[0]?.text || "Something went wrong. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Something went wrong. Please try again." },
      ]);
    }
    setLoading(false);
  };

  if (!user) return <EmailGate onEnter={setUser} />;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
        fontFamily:
          "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #ebebeb",
          padding: "0 20px",
          height: "58px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "30px",
              height: "30px",
              background: "#0a84ff",
              borderRadius: "8px",
            }}
          />
          <span style={{ fontWeight: "700", fontSize: "16px", color: "#111" }}>
            Cadence Compliance
          </span>
        </div>
        <a
          href={MAILTO_LINK}
          style={{
            fontSize: "13px",
            color: "#0a84ff",
            textDecoration: "none",
            fontWeight: "500",
          }}
        >
          Contact Bolu
        </a>
      </div>

      {/* Chat area */}
      <div
        style={{
          flex: 1,
          maxWidth: "720px",
          width: "100%",
          margin: "0 auto",
          padding: "24px 20px 140px",
          boxSizing: "border-box",
        }}
      >
        {messages.length === 0 && (
          <div style={{ paddingTop: "40px" }}>
            <h2
              style={{
                fontSize: "26px",
                fontWeight: "700",
                color: "#111",
                marginBottom: "6px",
              }}
            >
              Hello, {user.name.split(" ")[0]}.
            </h2>
            <p style={{ color: "#666", fontSize: "15px", marginBottom: "32px" }}>
              Ask about compliance requirements, policy gaps, or regulatory risk.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "12px",
              }}
            >
              {SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  style={{
                    background: "#fff",
                    border: "1px solid #e0e0e0",
                    borderRadius: "12px",
                    padding: "14px 16px",
                    fontSize: "13px",
                    color: "#333",
                    cursor: "pointer",
                    textAlign: "left",
                    lineHeight: "1.5",
                    fontFamily: "inherit",
                    transition: "box-shadow 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 2px 12px rgba(0,0,0,0.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow = "none")
                  }
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => {
          const assistantIndex = messages
            .slice(0, i + 1)
            .filter((x) => x.role === "assistant").length;
          const locked = m.role === "assistant" && assistantIndex > 3;
          return <Msg key={i} role={m.role} text={m.text} isLocked={locked} />;
        })}

        {loading && (
          <div style={{ display: "flex", gap: "10px", marginBottom: "18px", alignItems: "flex-start" }}>
            <Avatar />
            <div
              style={{
                background: "#fff",
                border: "1px solid #e8e8e8",
                borderRadius: "14px",
                padding: "14px 16px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      background: "#0a84ff",
                      animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(245,247,250,0.92)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid #e8e8e8",
          padding: "12px 20px 20px",
        }}
      >
        {isLocked ? (
          <div
            style={{
              maxWidth: "720px",
              margin: "0 auto",
              background: "#fff",
              borderRadius: "14px",
              padding: "16px 18px",
              border: "1px solid #e0e0e0",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#333", fontSize: "14px", margin: "0 0 10px 0", fontWeight: "500" }}>
              You've reached the free preview limit.
            </p>
            <a
              href={MAILTO_LINK}
              style={{
                background: "#0a84ff",
                color: "#fff",
                padding: "9px 20px",
                borderRadius: "9px",
                fontSize: "13px",
                fontWeight: "600",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Contact Bolu to continue →
            </a>
          </div>
        ) : (
          <div
            style={{
              maxWidth: "720px",
              margin: "0 auto",
              display: "flex",
              gap: "10px",
              alignItems: "flex-end",
            }}
          >
            <textarea
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask a compliance question..."
              style={{
                flex: 1,
                padding: "12px 14px",
                borderRadius: "12px",
                border: "1px solid #ddd",
                fontSize: "14px",
                fontFamily: "inherit",
                resize: "none",
                outline: "none",
                background: "#fff",
                lineHeight: "1.5",
                boxSizing: "border-box",
                overflowY: "hidden",
                color: "#111",
              }}
            />
            <button
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: loading || !input.trim() ? "#c5dff8" : "#0a84ff",
                border: "none",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        * { -webkit-tap-highlight-color: transparent; }
        body { margin: 0; }
      `}</style>
    </div>
  );
}
