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
  error: "#c00",
};
 
const FORMSPREE = "https://formspree.io/f/xykvgopv";
const API_URL = "/api/chat";
const MAX_CHARS = 4000;
const NUDGE_AFTER = 3;
 
const MODES = {
  compliance: {
    label: "Compliance Monitor",
    placeholder: "Describe your operations or ask about your document...",
    prompts: [
      "We collect customer data for our business. What compliance obligations do we have?",
      "Review this employee data handling policy for compliance gaps.",
      "What data protection regulations apply to a financial services startup?",
    ],
    system: `You are a senior AI compliance advisor at Cadence Compliance, specializing in regulatory compliance across legal, healthcare, and financial services industries globally.
 
Your role: audit operations and policies, identify compliance gaps, flag regulatory risks, and recommend structured fixes.
 
When a user describes their operations or shares a document/image:
1. Identify the top 3-5 compliance gaps or risks
2. Reference relevant regulations applicable to their jurisdiction and industry
3. Suggest concrete remediation steps
4. Provide a brief risk severity rating (High/Medium/Low) for each gap
 
Format responses with clear markdown headings, bullet points, and bold text. This is a lite demo — recommend a full paid audit for comprehensive coverage.`,
  },
  legal: {
    label: "Legal Research",
    placeholder: "Ask a legal question or describe a case scenario...",
    prompts: [
      "What are the legal requirements for a valid arbitration clause in a commercial contract?",
      "What obligations does a company have when a data breach occurs?",
      "What are the key legal considerations when drafting an employment agreement?",
    ],
    system: `You are a senior legal research assistant at Cadence Compliance, with expertise in commercial law, ADR, data protection, employment law, and regulatory compliance across multiple jurisdictions.
 
When a user asks a legal question or shares a document:
1. Identify the applicable legal framework and statutes
2. Summarize the relevant legal principles
3. Reference key cases or regulatory guidance where applicable
4. Outline 2-3 recommended next steps
 
Format responses with clear markdown headings, bullet points, and bold text. Note that this is preliminary research and not legal advice.`,
  },
};
 
function renderMarkdown(text) {
  const lines = text.split("\n");
  const elements = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("### ")) {
      elements.push(<h3 key={i} style={{ fontSize: 13.5, fontWeight: 700, color: C.accent, margin: "14px 0 5px", fontFamily: "'DM Sans',sans-serif" }}>{parseInline(line.slice(4))}</h3>);
    } else if (line.startsWith("## ")) {
      elements.push(<h2 key={i} style={{ fontSize: 14.5, fontWeight: 700, color: C.accent, margin: "16px 0 6px", fontFamily: "'DM Sans',sans-serif" }}>{parseInline(line.slice(3))}</h2>);
    } else if (line.startsWith("# ")) {
      elements.push(<h1 key={i} style={{ fontSize: 15.5, fontWeight: 700, color: C.accent, margin: "16px 0 8px", fontFamily: "'DM Sans',sans-serif" }}>{parseInline(line.slice(2))}</h1>);
    } else if (line.match(/^[-*•]\s/)) {
      const items = [];
      while (i < lines.length && lines[i].match(/^[-*•]\s/)) {
        items.push(<li key={i} style={{ marginBottom: 4, lineHeight: 1.65, fontFamily: "'DM Sans',sans-serif", fontSize: 13.5 }}>{parseInline(lines[i].slice(2))}</li>);
        i++;
      }
      elements.push(<ul key={`ul${i}`} style={{ paddingLeft: 18, margin: "6px 0" }}>{items}</ul>);
      continue;
    } else if (line.match(/^\d+\.\s/)) {
      const items = [];
      while (i < lines.length && lines[i].match(/^\d+\.\s/)) {
        const content = lines[i].replace(/^\d+\.\s/, "");
        items.push(<li key={i} style={{ marginBottom: 4, lineHeight: 1.65, fontFamily: "'DM Sans',sans-serif", fontSize: 13.5 }}>{parseInline(content)}</li>);
        i++;
      }
      elements.push(<ol key={`ol${i}`} style={{ paddingLeft: 18, margin: "6px 0" }}>{items}</ol>);
      continue;
    } else if (line.trim() === "") {
      elements.push(<div key={i} style={{ height: 5 }} />);
    } else {
      elements.push(<p key={i} style={{ margin: "3px 0", lineHeight: 1.7, fontFamily: "'DM Sans',sans-serif", fontSize: 13.5 }}>{parseInline(line)}</p>);
    }
    i++;
  }
  return elements;
}
 
function parseInline(text) {
  const parts = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let last = 0, match, key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(<span key={key++}>{text.slice(last, match.index)}</span>);
    if (match[2]) parts.push(<strong key={key++} style={{ fontWeight: 700, color: C.accent }}>{match[2]}</strong>);
    else if (match[3]) parts.push(<em key={key++}>{match[3]}</em>);
    else if (match[4]) parts.push(<code key={key++} style={{ background: "#f0ece4", padding: "1px 5px", borderRadius: 4, fontSize: 12, fontFamily: "monospace" }}>{match[4]}</code>);
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(<span key={key++}>{text.slice(last)}</span>);
  return parts.length ? parts : text;
}
 
const Icons = {
  copy: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>,
  check: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
  pdf: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>,
  image: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  send: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>,
  attach: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>,
};
 
function AttachmentPreview({ file, onRemove }) {
  const isImage = file.type.startsWith("image/");
  const [preview, setPreview] = useState(null);
 
  useEffect(() => {
    if (isImage) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file, isImage]);
 
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "8px 12px",
      background: `${C.gold}14`,
      border: `1px solid ${C.gold}44`,
      borderRadius: 12, marginBottom: 8,
      fontFamily: "'DM Sans',sans-serif",
      animation: "fadeUp 0.2s ease",
    }}>
      {isImage && preview ? (
        <img src={preview} alt="preview" style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover", border: `1px solid ${C.border}` }} />
      ) : (
        <div style={{ width: 40, height: 40, borderRadius: 8, background: `${C.accent}18`, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, border: `1px solid ${C.border}` }}>
          {Icons.pdf}
        </div>
      )}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{isImage ? "Image" : "PDF"} · {(file.size / 1024).toFixed(0)} KB</div>
      </div>
      <button onClick={onRemove} style={{ background: "none", border: "none", color: C.light, cursor: "pointer", fontSize: 18, lineHeight: 1, padding: "0 4px" }}>×</button>
    </div>
  );
}
 
function MsgAttachment({ attachment }) {
  if (!attachment) return null;
  const isImage = attachment.type === "image";
  return (
    <div style={{ marginBottom: 6 }}>
      {isImage ? (
        <img src={attachment.preview} alt="attachment" style={{ maxWidth: 200, maxHeight: 160, borderRadius: 10, objectFit: "cover", border: `1px solid ${C.border}`, display: "block" }} />
      ) : (
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 10px", background: `${C.accent}18`, borderRadius: 8, border: `1px solid ${C.border}` }}>
          <span style={{ color: C.accent }}>{Icons.pdf}</span>
          <span style={{ fontSize: 12, color: C.muted, fontFamily: "'DM Sans',sans-serif" }}>{attachment.name}</span>
        </div>
      )}
    </div>
  );
}
 
function Msg({ msg, isLast, msgCount }) {
  const isUser = msg.role === "user";
  const [copied, setCopied] = useState(false);
  const showNudge = !isUser && isLast && msgCount >= NUDGE_AFTER;
 
  const copy = () => {
    navigator.clipboard.writeText(msg.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
 
  return (
    <div style={{ marginBottom: 20, animation: "fadeUp 0.25s ease" }}>
      <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
        {!isUser && (
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", fontWeight: 700, marginRight: 8, flexShrink: 0, marginTop: 2, fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.5px" }}>CC</div>
        )}
        <div style={{ maxWidth: "78%", display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start", gap: 5 }}>
          {isUser && msg.attachment && <MsgAttachment attachment={msg.attachment} />}
          {msg.content && (
            <div style={{
              padding: "11px 15px",
              borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: isUser ? C.accent : C.surface,
              color: isUser ? "#fff" : C.text,
              fontSize: 14, lineHeight: 1.7,
              border: isUser ? "none" : `1px solid ${C.border}`,
              boxShadow: isUser ? "0 2px 8px rgba(26,58,42,0.15)" : "0 1px 4px rgba(0,0,0,0.05)",
              userSelect: "text", WebkitUserSelect: "text",
            }}>
              {isUser
                ? <p style={{ margin: 0, fontFamily: "'DM Sans',sans-serif", fontSize: 14, lineHeight: 1.65 }}>{msg.content}</p>
                : renderMarkdown(msg.content)
              }
            </div>
          )}
          {!isUser && (
            <button onClick={copy} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: `1px solid ${C.border}`, borderRadius: 6, padding: "3px 10px", color: copied ? C.accentMid : C.muted, fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 500, transition: "all 0.15s" }}>
              {copied ? Icons.check : Icons.copy}
              {copied ? "Copied" : "Copy"}
            </button>
          )}
        </div>
      </div>
 
      {!isUser && isLast && (
        <div style={{ marginTop: 10, marginLeft: 36, padding: "9px 14px", background: `${C.gold}16`, border: `1px solid ${C.gold}44`, borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
          {showNudge
            ? <>Ready for a comprehensive assessment? <a href="mailto:bolu.compliance@gmail.com" style={{ color: C.accentMid, fontWeight: 600, textDecoration: "none" }}>Book a consultation with Bolu ?</a></>
            : <>Want a full audit report? <a href="mailto:bolu.compliance@gmail.com" style={{ color: C.accentMid, fontWeight: 600, textDecoration: "none" }}>Reach Bolu at bolu.compliance@gmail.com ?</a></>
          }
        </div>
      )}
    </div>
  );
}
 
function TypingDot() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", fontWeight: 700, flexShrink: 0, fontFamily: "'DM Sans',sans-serif" }}>CC</div>
      <div style={{ padding: "12px 16px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: "18px 18px 18px 4px", display: "flex", gap: 5, alignItems: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: C.light, animation: `bounce 1s ease ${i * 0.15}s infinite` }} />)}
      </div>
    </div>
  );
}
 
function EmailGate({ onSubmit }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 
  const submit = async () => {
    if (!name.trim() || !email.trim()) { setError("Please fill in both fields."); return; }
    if (!email.includes("@")) { setError("Please enter a valid email."); return; }
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
 
  const onKey = (e) => { if (e.key === "Enter") submit(); };
 
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10,20,15,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24, backdropFilter: "blur(6px)" }}>
      <div style={{ background: C.surface, borderRadius: 20, padding: "36px 28px", maxWidth: 380, width: "100%", boxShadow: "0 24px 64px rgba(0,0,0,0.2)", border: `1px solid ${C.border}`, animation: "fadeUp 0.3s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", marginBottom: 10 }}>Cadence Compliance</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 8, letterSpacing: "-0.3px" }}>Try the AI Agent</h2>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, fontFamily: "'DM Sans',sans-serif" }}>Enter your details to access the free compliance and legal research agent.</p>
        </div>
 
        {error && <div style={{ padding: "10px 14px", background: "#fff5f5", border: "1px solid #fcc", borderRadius: 8, color: C.error, fontSize: 12, marginBottom: 14, fontFamily: "'DM Sans',sans-serif" }}>{error}</div>}
 
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[{ label: "Full Name", value: name, set: setName, placeholder: "Your full name", type: "text" }, { label: "Email Address", value: email, set: setEmail, placeholder: "your@email.com", type: "email" }].map(f => (
            <div key={f.label}>
              <label style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: "0.8px", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", display: "block", marginBottom: 6 }}>{f.label}</label>
              <input value={f.value} onChange={e => f.set(e.target.value)} onKeyDown={onKey} placeholder={f.placeholder} type={f.type} style={{ width: "100%", padding: "11px 14px", border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 14, color: C.text, background: C.bg, outline: "none", fontFamily: "'DM Sans',sans-serif" }} />
            </div>
          ))}
          <button onClick={submit} disabled={loading} style={{ marginTop: 4, padding: "13px", background: C.accent, border: "none", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif", opacity: loading ? 0.6 : 1, boxShadow: "0 4px 16px rgba(26,58,42,0.25)" }}>
            {loading ? "Please wait..." : "Access the Agent ?"}
          </button>
        </div>
        <p style={{ fontSize: 11, color: C.light, textAlign: "center", marginTop: 16, fontFamily: "'DM Sans',sans-serif", lineHeight: 1.6 }}>No spam. Your details help Bolu follow up with relevant insights.</p>
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
  const [error, setError] = useState(null);
  const [attachment, setAttachment] = useState(null);
  const bottomRef = useRef();
  const textRef = useRef();
  const fileRef = useRef();
  const cfg = MODES[mode];
  const msgs = messages[mode];
  const assistantMsgCount = msgs.filter(m => m.role === "assistant").length;
 
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
 
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `#replit-badge,[data-testid="replit-badge"],div[style*="position: fixed"][style*="bottom: 0"],iframe[src*="replit.com/badge"]{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;}`;
    document.head.appendChild(style);
  }, []);
 
  const toBase64 = (file) => new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result.split(",")[1]);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
 
  const getPreviewUrl = (file) => URL.createObjectURL(file);
 
  const handleFile = (file) => {
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";
    if (!isImage && !isPdf) { return; }
    const preview = isImage ? getPreviewUrl(file) : null;
    setAttachment({ file, type: isImage ? "image" : "pdf", preview, name: file.name });
  };
 
  const send = async () => {
    const text = input.trim();
    if ((!text && !attachment) || loading) return;
    setInput("");
    setError(null);
 
    const currentAttachment = attachment;
    setAttachment(null);
 
    const displayMsg = {
      role: "user",
      content: text,
      attachment: currentAttachment ? { type: currentAttachment.type, preview: currentAttachment.preview, name: currentAttachment.name } : null,
    };
 
    let apiContent;
 
    if (currentAttachment?.type === "image") {
      const base64 = await toBase64(currentAttachment.file);
      const mediaType = currentAttachment.file.type;
      apiContent = [
        { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
        ...(text ? [{ type: "text", text }] : [{ type: "text", text: "Please analyze this image as a compliance or legal document." }]),
      ];
    } else if (currentAttachment?.type === "pdf") {
      const base64 = await toBase64(currentAttachment.file);
      apiContent = [
        { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } },
        ...(text ? [{ type: "text", text }] : [{ type: "text", text: "Please analyze this document for compliance gaps or legal research." }]),
      ];
    } else {
      apiContent = text;
    }
 
    const apiMsg = { role: "user", content: apiContent };
    const prevMsgs = msgs.map(m => ({ role: m.role, content: m.content }));
    const updated = [...msgs, displayMsg];
    setMessages(p => ({ ...p, [mode]: updated }));
    setLoading(true);
 
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: cfg.system,
          messages: [...prevMsgs, apiMsg],
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const reply = data.content?.map(b => b.text || "").join("") || "";
      setMessages(p => ({ ...p, [mode]: [...updated, { role: "assistant", content: reply }] }));
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
 
  const onKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };
  const charCount = input.length;
  const charColor = charCount > MAX_CHARS * 0.9 ? C.error : charCount > MAX_CHARS * 0.7 ? "#e07b00" : C.light;
  const isEmpty = msgs.length === 0;
 
  return (
    <>
      {!user && <EmailGate onSubmit={setUser} />}
      <div style={{ height: "100dvh", background: C.bg, fontFamily: "'Cormorant Garamond',Georgia,serif", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
          *{box-sizing:border-box;margin:0;padding:0;}
          @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
          @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
          textarea{font-family:'DM Sans',sans-serif!important;}
          input{font-family:'DM Sans',sans-serif!important;}
          ::-webkit-scrollbar{width:3px;}
          ::-webkit-scrollbar-thumb{background:${C.border};border-radius:4px;}
        `}</style>
 
        {/* Header */}
        <div style={{ background: C.accent, padding: "13px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `3px solid ${C.gold}`, flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", letterSpacing: "0.3px" }}>Cadence Compliance</div>
            <div style={{ fontSize: 9, color: C.goldLight, letterSpacing: "2.5px", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", marginTop: 1 }}>AI Advisory Agent</div>
          </div>
          {user && <div style={{ fontSize: 11, color: C.goldLight, fontFamily: "'DM Sans',sans-serif" }}>Hi, {user.name.split(" ")[0]}</div>}
        </div>
 
        {/* Mode Switcher */}
        <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "9px 14px", display: "flex", gap: 7, alignItems: "center", fontFamily: "'DM Sans',sans-serif", flexShrink: 0 }}>
          <span style={{ fontSize: 10, color: C.muted, marginRight: 2, letterSpacing: "0.5px", textTransform: "uppercase" }}>Mode:</span>
          {Object.entries(MODES).map(([key, m]) => (
            <button key={key} onClick={() => setMode(key)} style={{ padding: "5px 13px", borderRadius: 20, border: `1px solid ${mode === key ? C.accent : C.border}`, background: mode === key ? C.accent : "transparent", color: mode === key ? "#fff" : C.muted, fontSize: 11, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}>{m.label}</button>
          ))}
          {msgs.length > 0 && <button onClick={() => setMessages(p => ({ ...p, [mode]: [] }))} style={{ marginLeft: "auto", background: "none", border: "none", fontSize: 11, color: C.light, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Clear</button>}
        </div>
 
        {/* Chat */}
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 14px 8px", maxWidth: 780, width: "100%", margin: "0 auto", alignSelf: "stretch" }}>
          {isEmpty && (
            <div style={{ textAlign: "center", padding: "32px 16px", animation: "fadeUp 0.4s ease" }}>
              <h2 style={{ fontSize: 19, fontWeight: 700, color: C.accent, marginBottom: 6 }}>{cfg.label}</h2>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, maxWidth: 360, margin: "0 auto 20px", fontFamily: "'DM Sans',sans-serif" }}>
                {mode === "compliance"
                  ? "Describe your operations, upload a policy PDF, or attach an image. The agent will identify compliance gaps and recommend fixes."
                  : "Ask a legal question, describe a scenario, or upload a document. The agent will provide structured research and guidance."}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 420, margin: "0 auto 24px" }}>
                {cfg.prompts.map((q, i) => (
                  <button key={i} onClick={() => { setInput(q); textRef.current?.focus(); }} style={{ padding: "10px 14px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, color: C.text, fontSize: 13, cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.5, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>{q}</button>
                ))}
              </div>
              <div style={{ fontSize: 11, color: C.light, fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.5px" }}>Powered by Cadence Compliance</div>
            </div>
          )}
 
          {msgs.map((m, i) => <Msg key={i} msg={m} isLast={i === msgs.length - 1} msgCount={assistantMsgCount} />)}
          {loading && <TypingDot />}
          {error && <div style={{ padding: "10px 14px", background: "#fff5f5", border: "1px solid #fcc", borderRadius: 10, color: C.error, fontSize: 13, fontFamily: "'DM Sans',sans-serif", marginBottom: 12 }}>Something went wrong. Please try again.</div>}
          <div ref={bottomRef} />
        </div>
 
        {/* Input */}
        <div style={{ background: C.surface, borderTop: `1px solid ${C.border}`, padding: "10px 14px 14px", flexShrink: 0 }}>
          <div style={{ maxWidth: 780, margin: "0 auto" }}>
            {attachment && <AttachmentPreview file={attachment.file} onRemove={() => setAttachment(null)} />}
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <button onClick={() => fileRef.current.click()} style={{ width: 36, height: 36, flexShrink: 0, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>
                {Icons.attach}
              </button>
              <input ref={fileRef} type="file" accept=".pdf,image/*" style={{ display: "none" }} onChange={e => { handleFile(e.target.files[0]); e.target.value = ""; }} />
 
              <div style={{ flex: 1, position: "relative" }}>
                <textarea
                  ref={textRef}
                  value={input}
                  onChange={e => setInput(e.target.value.slice(0, MAX_CHARS))}
                  onKeyDown={onKey}
                  placeholder={attachment ? "Ask a question about the attachment..." : cfg.placeholder}
                  rows={2}
                  style={{ width: "100%", padding: "10px 14px", border: `1px solid ${C.border}`, borderRadius: 12, fontSize: 14, color: C.text, background: C.bg, resize: "none", outline: "none", lineHeight: 1.6, fontFamily: "'DM Sans',sans-serif" }}
                />
                {charCount > MAX_CHARS * 0.6 && (
                  <span style={{ position: "absolute", bottom: 6, right: 10, fontSize: 10, color: charColor, fontFamily: "'DM Sans',sans-serif" }}>{charCount}/{MAX_CHARS}</span>
                )}
              </div>
 
              <button onClick={send} disabled={(!input.trim() && !attachment) || loading} style={{ width: 36, height: 36, flexShrink: 0, background: C.accent, border: "none", borderRadius: 10, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: ((!input.trim() && !attachment) || loading) ? 0.4 : 1, transition: "opacity 0.15s" }}>
                {Icons.send}
              </button>
            </div>
            <p style={{ fontSize: 10, color: C.light, marginTop: 7, textAlign: "center", fontFamily: "'DM Sans',sans-serif" }}>
              Free preview. For a full assessment, reach Bolu at bolu.compliance@gmail.com
            </p>
          </div>
        </div>
      </div>
    </>
  );
}