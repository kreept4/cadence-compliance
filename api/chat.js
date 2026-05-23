const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];
let c = fs.readFileSync(filePath, 'utf8');

// Insert helpers + new chat view before the old chat view
const insertBefore = `  if (view === "chat") {`;

const helpers = `
  // ── RISK CONFIG ──────────────────────────────────────────
  const RISK_CONFIG = {
    LOW:      { color: "#16a34a", bg: "#dcfce7", border: "#bbf7d0", label: "Low Risk", icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6L12 2z"/><polyline points="9 12 11 14 15 10"/></svg>) },
    MEDIUM:   { color: "#d97706", bg: "#fef3c7", border: "#fde68a", label: "Medium Risk", icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6L12 2z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>) },
    HIGH:     { color: "#ea580c", bg: "#ffedd5", border: "#fed7aa", label: "High Risk", icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>) },
    CRITICAL: { color: "#dc2626", bg: "#fee2e2", border: "#fecaca", label: "Critical Risk", icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>) },
  };

  const SUGGESTED = [
    "What is the NDPR and who does it apply to?",
    "Do I need a Data Protection Officer?",
    "What are my obligations after a data breach?",
    "How does GDPR affect Nigerian businesses?",
    "What is required for AML compliance in Nigeria?",
    "Does HIPAA apply to my healthtech company?",
  ];

  function parseRiskLevel(text) {
    if (!text || typeof text !== "string") return null;
    const match = text.match(/RISK_LEVEL:\\s*(LOW|MEDIUM|HIGH|CRITICAL)/i);
    return match ? match[1].toUpperCase() : null;
  }

  function stripRiskLine(text) {
    if (!text || typeof text !== "string") return text;
    return text.replace(/RISK_LEVEL:\\s*(LOW|MEDIUM|HIGH|CRITICAL)\\n?/i, "").trim();
  }

  function formatMarkdown(text) {
    if (!text) return "";
    text = text.replace(/\\*\\*\\*(.*?)\\*\\*\\*/g, "<strong><em>$1</em></strong>");
    text = text.replace(/\\*\\*(.*?)\\*\\*/g, "<strong>$1</strong>");
    text = text.replace(/^#{1,2}\\s(.+)$/gm, '<div style="font-size:15px;font-weight:700;color:#0f1117;margin:16px 0 8px;text-align:center">$1</div>');
    text = text.replace(/^(\\d+\\.\\s)/gm, '<span style="font-weight:600;color:#0a84ff">$1</span>');
    text = text.replace(/\\n\\n/g, '</p><p style="margin:0 0 12px;text-align:justify">');
    text = text.replace(/\\n/g, "<br/>");
    return '<p style="margin:0 0 12px;text-align:justify">' + text + "</p>";
  }

  const fileRef = useRef(null);

  const handleFileUpload = async (file) => {
    if (!file || limitReached) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target.result.split(",")[1];
      const userMsg = { role: "user", content: [
        { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } },
        { type: "text", text: "Please review this document and provide a compliance assessment. Identify any gaps, risks, and obligations relevant to the applicable frameworks." }
      ]};
      const displayMsg = { role: "user", content: "[PDF uploaded: " + file.name + "] Please review and provide a compliance assessment." };
      const newCount = userMessageCount + 1;
      setUserMessageCount(newCount);
      const updated = [...messages, displayMsg];
      setMessages(updated);
      setChatLoading(true);
      try {
        const apiMessages = [...messages.map(m => ({ role: m.role, content: m.content })), userMsg];
        const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: apiMessages }) });
        const data = await res.json();
        const reply = data.reply || "I was unable to process the document. Please try again.";
        const finalMessages = [...updated, { role: "assistant", content: reply }];
        if (newCount >= FREE_LIMIT) {
          setLimitReached(true);
          setMessages([...finalMessages, { role: "assistant", content: "You have reached the limit for free questions. To continue and receive personalised compliance guidance, please book an assessment or contact Boluwatife directly at bolu.compliance@gmail.com.", isLimit: true }]);
        } else { setMessages(finalMessages); }
      } catch { setMessages([...updated, { role: "assistant", content: "I encountered an error processing the document. Please try again." }]); }
      finally { setChatLoading(false); }
    };
    reader.readAsDataURL(file);
  };

`;

const newChat = `  if (view === "chat") {
    return (
      <div style={{ ...styles.root, display: "flex", flexDirection: "column", height: "100vh", background: "#f0f2f5" }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />
        <style>{\`
          @keyframes pulse{0%,100%{opacity:0.3}50%{opacity:1}}
          @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
          .chat-msg{animation:fadeIn 0.2s ease}
          .chip:hover{background:#e0eeff!important;border-color:#0a84ff!important;color:#0a84ff!important}
          .send-btn:hover{background:#0070e0!important}
          .upload-btn:hover{background:#f3f4f6!important}
        \`}</style>
        <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 24px", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src={cadenceLogo} alt="Cadence Compliance" style={{ height: 28, width: 90, objectFit: "contain" }} />
            <div style={{ width: 1, height: 20, background: "#e5e7eb" }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>Compliance Advisor</span>
            <span style={{ fontSize: 11, background: "rgba(10,132,255,0.1)", color: "#0a84ff", borderRadius: 100, padding: "2px 8px", fontWeight: 700 }}>AI</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: "#9ca3af" }}>{FREE_LIMIT - userMessageCount > 0 ? (FREE_LIMIT - userMessageCount) + " free " + (FREE_LIMIT - userMessageCount === 1 ? "question" : "questions") + " remaining" : "Limit reached"}</span>
            <button onClick={() => setView("landing")} style={{ fontSize: 13, color: "#6b7280", background: "none", border: "1px solid #e5e7eb", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontFamily: "inherit" }}>Return to site</button>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 16px", maxWidth: 800, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
          {messages.filter(m => m.role === "user").length === 0 && (
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 13, color: "#9ca3af", textAlign: "center", marginBottom: 14 }}>Suggested questions</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                {SUGGESTED.map((s, i) => (
                  <button key={i} className="chip" onClick={() => setInputVal(s)} style={{ fontSize: 13, color: "#374151", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 100, padding: "7px 14px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>{s}</button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, i) => {
            const isUser = msg.role === "user";
            const riskLevel = !isUser && typeof msg.content === "string" ? parseRiskLevel(msg.content) : null;
            const riskCfg = riskLevel ? RISK_CONFIG[riskLevel] : null;
            const displayContent = !isUser && typeof msg.content === "string" ? stripRiskLine(msg.content) : msg.content;
            return (
              <div key={i} className="chat-msg" style={{ marginBottom: 20, display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", alignItems: "flex-start", gap: 10 }}>
                {!isUser && (<div style={{ width: 30, height: 30, borderRadius: "50%", background: "#0a84ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}><ShieldIcon size={14} color="#fff" /></div>)}
                <div style={{ maxWidth: "82%", minWidth: 60 }}>
                  {riskCfg && (
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: riskCfg.bg, border: "1px solid " + riskCfg.border, borderRadius: 100, padding: "5px 14px" }}>
                        {riskCfg.icon}
                        <span style={{ fontSize: 12, fontWeight: 700, color: riskCfg.color, letterSpacing: "0.3px" }}>{riskCfg.label}</span>
                      </div>
                    </div>
                  )}
                  <div style={{ background: isUser ? "#0a84ff" : "#fff", color: isUser ? "#fff" : "#0f1117", border: !isUser ? "1px solid #e5e7eb" : "none", borderRadius: isUser ? "16px 16px 4px 16px" : "4px 16px 16px 16px", padding: "14px 18px", fontSize: 14, lineHeight: 1.75, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                    {isUser ? (
                      <span style={{ whiteSpace: "pre-wrap" }}>{displayContent}</span>
                    ) : msg.isLimit ? (
                      <div>
                        <p style={{ margin: "0 0 12px", textAlign: "justify" }}>{displayContent}</p>
                        <button onClick={() => setAssessmentOpen(true)} style={{ ...styles.heroPrimaryBtn, fontSize: 13, padding: "9px 18px", marginTop: 4 }}>Book an Assessment <ArrowRightIcon size={13} /></button>
                      </div>
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: formatMarkdown(displayContent) }} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {chatLoading && (
            <div className="chat-msg" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#0a84ff", display: "flex", alignItems: "center", justifyContent: "center" }}><ShieldIcon size={14} color="#fff" /></div>
              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "4px 16px 16px 16px", padding: "14px 18px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", gap: 5 }}>
                  {[0, 0.2, 0.4].map((d, i) => (<div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#9ca3af", animation: "pulse 1.2s infinite", animationDelay: d + "s" }} />))}
                </div>
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>
        <div style={{ background: "#fff", borderTop: "1px solid #e5e7eb", padding: "14px 16px 16px", flexShrink: 0 }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input ref={fileRef} type="file" accept="application/pdf" style={{ display: "none" }} onChange={(e) => { if (e.target.files[0]) handleFileUpload(e.target.files[0]); e.target.value = ""; }} />
              <button className="upload-btn" onClick={() => fileRef.current && fileRef.current.click()} disabled={limitReached} title="Upload PDF for compliance review" style={{ width: 40, height: 40, borderRadius: 10, border: "1px solid #e5e7eb", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "background 0.15s", opacity: limitReached ? 0.4 : 1 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
              </button>
              <input style={{ ...styles.input, flex: 1, height: 40 }} placeholder={limitReached ? "Message limit reached — book an assessment to continue" : "Ask a compliance question..."} value={inputVal} disabled={limitReached} onChange={(e) => setInputVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && !limitReached && handleSendMessage()} />
              <button className="send-btn" onClick={handleSendMessage} disabled={!inputVal.trim() || chatLoading || limitReached} style={{ width: 40, height: 40, borderRadius: 10, background: "#0a84ff", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, opacity: !inputVal.trim() || chatLoading || limitReached ? 0.4 : 1, transition: "background 0.15s" }}>
                <SendIcon size={15} color="#fff" />
              </button>
            </div>
            <p style={{ fontSize: 11, color: "#9ca3af", textAlign: "center", marginTop: 10, marginBottom: 0 }}>General compliance information only. For organisation-specific advice, book a consultation with Cadence Compliance.</p>
          </div>
        </div>
      </div>
    );
  }`;

// Find and replace old chat view
const oldChatStart = '  if (view === "chat") {\n    return (\n      <div style={{ ...styles.root, display: "flex", flexDirection: "column", height: "100vh", background: "#f8f9fb" }}>';

if (!c.includes(oldChatStart)) {
  console.error('Could not find old chat view. Aborting.');
  process.exit(1);
}

// Find the full old chat block by counting braces
const startIdx = c.indexOf(oldChatStart);
let depth = 0;
let endIdx = startIdx;
let inString = false;
let stringChar = '';
for (let i = startIdx; i < c.length; i++) {
  const ch = c[i];
  if (!inString && (ch === '"' || ch === "'" || ch === '`')) { inString = true; stringChar = ch; }
  else if (inString && ch === stringChar && c[i-1] !== '\\') { inString = false; }
  else if (!inString) {
    if (ch === '{') depth++;
    else if (ch === '}') { depth--; if (depth === 0 && i > startIdx + 100) { endIdx = i + 1; break; } }
  }
}

// Check if ends with ); 
while (endIdx < c.length && (c[endIdx] === '\n' || c[endIdx] === ' ')) endIdx++;
if (c[endIdx] === ')') endIdx++;
if (c[endIdx] === ';') endIdx++;

const oldBlock = c.substring(startIdx, endIdx);
console.log('Old block length:', oldBlock.length);
console.log('Old block ends with:', JSON.stringify(oldBlock.slice(-20)));

c = c.replace(insertBefore, helpers + newChat.split('  if (view === "chat") {')[0] + '  if (view === "chat") {');

// Actually just do a direct replacement
c = c.replace(oldBlock, newChat);

fs.writeFileSync(filePath, c);
console.log('Done! File written.');
console.log('Has RISK_CONFIG:', c.includes('RISK_CONFIG'));
console.log('Has SUGGESTED:', c.includes('SUGGESTED'));
console.log('Has handleFileUpload:', c.includes('handleFileUpload'));
console.log('Has formatMarkdown:', c.includes('formatMarkdown'));
