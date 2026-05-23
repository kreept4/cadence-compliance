import { useState, useEffect, useRef } from "react";
import cadenceLogo from "./cadence-logo.webp";

// Drop your logo file into src/ and update this import path
// e.g. import cadenceLogo from "./cadence-logo.webp";
// Then replace LOGO_SVG and LOGO_WHITE_SVG usages with:
// <img src={cadenceLogo} alt="Cadence Compliance" style={{ height: 32, width: "auto" }} />
// For now the SVG placeholder is used below — swap it out once you add your file.



const ShieldIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6L12 2z" />
  </svg>
);

const CheckIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ArrowRightIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const ChevronDownIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ExternalIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const CloseIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const MenuIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const SendIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const SERVICES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    ),
    title: "Data Protection Advisory",
    desc: "Practical guidance on Nigeria Data Protection Act compliance, NDPR obligations, and cross-border data transfers. We help you understand what the law requires and translate that into operational reality.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: "Compliance Audits",
    desc: "Structured assessments of your organisation's compliance posture against applicable frameworks. We identify gaps, prioritise risks, and provide a clear remediation roadmap your team can act on.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "Policy Development",
    desc: "Drafting and reviewing data protection policies, privacy notices, and internal governance documentation that meet regulatory expectations and reflect how your organisation actually operates.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    title: "Staff Training",
    desc: "Tailored compliance awareness sessions designed for your team's specific context. From frontline staff to leadership, we deliver training that builds genuine understanding rather than checkbox completion.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
    title: "Incident Response Support",
    desc: "Guidance and coordination when a data breach or compliance incident occurs. We help you respond quickly, notify the right authorities, and document the event in a way that reduces regulatory exposure.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "Ongoing Compliance Support",
    desc: "Retained advisory services for organisations that need consistent compliance oversight without building an in-house function. Think of it as your external compliance desk, available when you need it.",
  },
];

const ARTICLES = [
  {
    tag: "NDPR",
    title: "Understanding Nigeria's Data Protection Framework",
    preview: "The Nigeria Data Protection Act 2023 significantly expanded the country's data protection landscape. For businesses handling personal data, the shift from the NDPR to a full statutory framework changes both obligations and enforcement realities.",
    body: `The Nigeria Data Protection Act 2023 marked a defining moment for data governance in Africa's largest economy. For years, the Nigeria Data Protection Regulation served as the primary framework, but it operated as subsidiary legislation under the NITDA Act. The 2023 Act elevated data protection to primary legislation, established the Nigeria Data Protection Commission as an independent regulator, and introduced obligations that now extend to organisations of all sizes processing Nigerian personal data.

What does this mean for your organisation? First, the lawfulness principle applies regardless of company size. You must identify a valid legal basis for every category of personal data you process. Consent remains the most commonly cited basis, but it is also the most frequently misapplied. Consent must be freely given, specific, informed, and unambiguous. Pre-ticked boxes, bundled permissions, and vague authorisation language will not satisfy the standard.

Second, data subject rights are now enforceable. Individuals have the right to access, rectify, and in certain circumstances erase their personal data. Organisations without documented response procedures are one subject access request away from an uncomfortable scramble.

Third, the registration requirement has real teeth. Data controllers and processors of major importance must register with the Nigeria Data Protection Commission. Operating without registration, or failing to file a data protection audit, creates direct regulatory exposure.

The practical starting point is a data mapping exercise. Know what personal data you hold, where it lives, who has access, and how long you keep it. Everything else in your compliance programme builds on that foundation.`,
    readTime: "4 min read",
  },
  {
    tag: "Data Breach",
    title: "Data Breach Obligations: What You Must Do and When",
    preview: "A data breach does not give organisations the luxury of time. The Nigeria Data Protection Act establishes notification requirements, and the clock starts from the moment a breach is discovered, not confirmed. Understanding the timeline and obligations before an incident occurs is not optional preparation.",
    body: `A data breach does not give organisations the luxury of time. The Nigeria Data Protection Act establishes notification requirements, and the clock starts from the moment a breach is discovered, not confirmed.

The regulatory standard requires notification to the Nigeria Data Protection Commission within 72 hours of becoming aware of a personal data breach that is likely to result in a risk to the rights and freedoms of natural persons. That window is shorter than most organisations assume and far shorter than the time it typically takes to investigate what actually happened.

What constitutes a notifiable breach? Unauthorised access, accidental disclosure, loss of a device containing personal data, a ransomware attack that encrypts personal data, and bulk email errors that expose recipient addresses all qualify. The determining factor is not the scale of the breach but the risk it poses to affected individuals.

Notification to the Commission requires a description of the nature of the breach, the categories and approximate number of individuals affected, the likely consequences, and the measures taken or proposed to address the breach. Organisations that cannot produce this information quickly are not just struggling with an operational problem. They are demonstrating to the regulator that they lacked adequate controls before the breach occurred.

Equally important is the obligation to notify affected data subjects without undue delay when the breach is likely to result in a high risk to their rights and freedoms. The content of that notification must be plain, direct, and actionable. Individuals need to understand what happened and what they can do to protect themselves.

Building a breach response procedure before an incident happens is not bureaucracy. It is the difference between a manageable situation and a regulatory investigation.`,
    readTime: "5 min read",
  },
  {
    tag: "Global",
    title: "HIPAA for Non-US Organisations: When It Applies and What It Demands",
    preview: "Many Nigerian healthtech companies and healthcare providers assume HIPAA is an exclusively American concern. That assumption carries real legal risk. If your organisation processes, stores, or transmits health information on behalf of US-based covered entities, HIPAA obligations follow the data, not the geography.",
    body: `Many Nigerian healthtech companies and healthcare providers assume HIPAA is an exclusively American concern. That assumption carries real legal risk. If your organisation processes, stores, or transmits health information on behalf of US-based covered entities, HIPAA obligations follow the data, not the geography.

The Health Insurance Portability and Accountability Act applies to covered entities, which include healthcare providers, health plans, and healthcare clearinghouses that conduct certain electronic transactions in the United States. Business Associates are entities that perform functions or activities involving protected health information on behalf of covered entities. Business Associates can be located anywhere in the world.

If your organisation provides medical transcription, health data analytics, clinical software hosting, billing services, or any function that involves access to protected health information for a US-based client, you are likely a Business Associate. That status requires a signed Business Associate Agreement and direct compliance with specific HIPAA Security Rule and Privacy Rule provisions.

The Security Rule requires administrative, physical, and technical safeguards for electronic protected health information. In practice, this means access controls, audit logs, encryption, workforce training, and a formal risk analysis. The analysis is not optional and must be updated regularly or when operational circumstances change.

The Privacy Rule governs how protected health information may be used and disclosed. Business Associates may only use or disclose protected health information as permitted by the Business Associate Agreement. Disclosures to sub-contractors require their own agreements.

Non-compliance carries financial penalties calibrated to culpability, and the US Department of Health and Human Services does investigate international Business Associates. If your organisation handles any data that could qualify as protected health information for US clients, a HIPAA gap assessment is a prudent early step.`,
    readTime: "5 min read",
  },
  {
    tag: "AML",
    title: "AML Compliance Fundamentals for Financial Services Organisations",
    preview: "Anti-money laundering compliance is one of the most operationally demanding areas of financial regulation. The framework is not simply about detecting suspicious transactions. It requires building and maintaining systems, policies, and a culture that make your organisation genuinely resistant to financial crime.",
    body: `Anti-money laundering compliance is one of the most operationally demanding areas of financial regulation. The framework is not simply about detecting suspicious transactions. It requires building and maintaining systems, policies, and a culture that make your organisation genuinely resistant to financial crime.

In Nigeria, the primary AML framework is established by the Money Laundering (Prevention and Prohibition) Act 2022, the Terrorism (Prevention and Prohibition) Act 2022, and the regulations of the Central Bank of Nigeria, the Special Control Unit against Money Laundering, and the Securities and Exchange Commission. Financial institutions, designated non-financial businesses and professions, and virtual asset service providers all fall within scope.

The Know Your Customer requirement is the most visible element of AML compliance, but it is only the beginning. Customer Due Diligence must be proportionate to risk. Standard due diligence applies to most customers. Enhanced due diligence is required for politically exposed persons, high-risk jurisdictions, and higher-risk business relationships. Simplified due diligence may apply to certain lower-risk categories, but the determination must be documented and defensible.

Transaction monitoring is a legal requirement, not an optional enhancement. Institutions must establish and maintain systems to identify unusual transactions, investigate them, and file Suspicious Transaction Reports with the Nigerian Financial Intelligence Unit where appropriate. Failure to file is itself a criminal offence.

The AML programme must be supported by an independent compliance function, senior management accountability, and regular staff training. Regulators assess whether compliance programmes are genuinely implemented or merely documented on paper. The distinction matters in an investigation.

Organisations entering regulated financial services or expanding into new products should treat AML compliance programme development as a foundational step, not a post-launch consideration.`,
    readTime: "6 min read",
  },
];

const GOOGLE_SHEET_ID = "1mqZHJXZZDUbBOlMyvHCgc9__7YOjbCuB48wSZL2dJTM";

export default function App() {
  const [view, setView] = useState("landing");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [aboutDropdown, setAboutDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [expandedArticle, setExpandedArticle] = useState(null);
  const [assessmentOpen, setAssessmentOpen] = useState(false);
  const [assessmentData, setAssessmentData] = useState({ name: "", email: "", organisation: "", concern: "" });
  const [assessmentSubmitting, setAssessmentSubmitting] = useState(false);
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);
  const [gateData, setGateData] = useState({ name: "", email: "" });
  const [gateSubmitting, setGateSubmitting] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [limitReached, setLimitReached] = useState(false);
  const chatBottomRef = useRef(null);
  const fileRef = useRef(null);
  const FREE_LIMIT = 5;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (chatBottomRef.current) chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    setServicesDropdown(false);
    setAboutDropdown(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleGateSubmit = async () => {
    if (!gateData.name.trim() || !gateData.email.trim()) return;
    setGateSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setGateSubmitting(false);
    setView("chat");
    setMessages([
      {
        role: "assistant",
        content: `Hello ${gateData.name}, welcome to the Cadence Compliance Advisor. I can help you understand your obligations under data protection frameworks including the Nigeria Data Protection Act, NDPR, HIPAA, AML requirements, and more.\n\nWhat compliance question can I help you with today?`,
      },
    ]);
  };

  const handleSendMessage = async () => {
    const text = inputVal.trim();
    if (!text || chatLoading || limitReached) return;
    const newCount = userMessageCount + 1;
    const updated = [...messages, { role: "user", content: text }];
    setMessages(updated);
    setInputVal("");
    setUserMessageCount(newCount);
    setChatLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated.filter(m => m.role === "user" || m.role === "assistant").map(m => ({ role: m.role, content: typeof m.content === "string" ? m.content : "[document]" })) }),
      });
      const data = await res.json();
      const reply = data.reply || "I am unable to respond at this time. Please try again shortly.";
      const finalMessages = [...updated, { role: "assistant", content: reply }];
      if (newCount >= FREE_LIMIT) {
        setLimitReached(true);
        setMessages([...finalMessages, {
          role: "assistant",
          content: "You have reached the limit for free questions. To continue the conversation and get personalised compliance guidance, please book an assessment or reach out directly to Boluwatife at bolu.compliance@gmail.com.",
          isLimit: true,
        }]);
      } else {
        setMessages(finalMessages);
      }
    } catch (err) {
      setMessages([...updated, { role: "assistant", content: "I encountered an error: " + (err.message || "Unknown") + ". Please try again." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleAssessmentSubmit = async () => {
    if (!assessmentData.name.trim() || !assessmentData.email.trim()) return;
    setAssessmentSubmitting(true);
    try {
      await fetch("https://formspree.io/f/xpwzvkgd", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(assessmentData),
      });
    } catch {}
    setAssessmentSubmitting(false);
    setAssessmentSubmitted(true);
  };

  const styles = {
    root: {
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      background: "#f8f9fb",
      minHeight: "100vh",
      color: "#0f1117",
    },
    nav: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      transition: "background 0.2s, box-shadow 0.2s",
      background: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
      boxShadow: scrolled ? "0 1px 0 rgba(0,0,0,0.08)" : "none",
      backdropFilter: scrolled ? "blur(12px)" : "none",
    },
    navInner: {
      maxWidth: 1120,
      margin: "0 auto",
      padding: "0 24px",
      height: 64,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    navLogo: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      textDecoration: "none",
      cursor: "pointer",
    },
    navLogoText: {
      fontSize: 16,
      fontWeight: 700,
      color: scrolled ? "#0f1117" : "#ffffff",
      letterSpacing: "-0.3px",
      transition: "color 0.2s",
    },
    navLinks: {
      display: "flex",
      alignItems: "center",
      gap: 4,
    },
    navLink: {
      fontSize: 14,
      color: scrolled ? "#374151" : "rgba(255,255,255,0.85)",
      padding: "6px 12px",
      borderRadius: 8,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 4,
      position: "relative",
      userSelect: "none",
      transition: "background 0.15s, color 0.2s",
      background: "none",
      border: "none",
      fontFamily: "inherit",
      fontWeight: 500,
    },
    dropdown: {
      position: "absolute",
      top: "calc(100% + 8px)",
      left: 0,
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
      minWidth: 220,
      padding: "8px",
      zIndex: 200,
    },
    dropdownItem: {
      display: "block",
      padding: "9px 12px",
      fontSize: 14,
      color: "#374151",
      borderRadius: 8,
      cursor: "pointer",
      textDecoration: "none",
      transition: "background 0.1s",
      fontWeight: 400,
    },
    ctaBtn: {
      background: "#0a84ff",
      color: "#fff",
      border: "none",
      borderRadius: 8,
      padding: "8px 18px",
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
      transition: "background 0.15s",
      fontFamily: "inherit",
    },
    hero: {
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0a1628 0%, #0d2145 50%, #0a1e3d 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "120px 24px 80px",
      position: "relative",
      overflow: "hidden",
    },
    heroBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      background: "rgba(10,132,255,0.15)",
      border: "1px solid rgba(10,132,255,0.3)",
      borderRadius: 100,
      padding: "5px 14px",
      fontSize: 12,
      fontWeight: 600,
      color: "#60a5fa",
      letterSpacing: "0.5px",
      marginBottom: 28,
      textTransform: "uppercase",
    },
    heroTitle: {
      fontSize: "clamp(36px, 5vw, 64px)",
      fontWeight: 800,
      color: "#fff",
      lineHeight: 1.1,
      letterSpacing: "-1.5px",
      marginBottom: 24,
      maxWidth: 760,
      fontFamily: "'DM Serif Display', Georgia, serif",
    },
    heroAccent: {
      color: "#0a84ff",
    },
    heroDesc: {
      fontSize: 18,
      color: "rgba(255,255,255,0.7)",
      lineHeight: 1.7,
      maxWidth: 560,
      marginBottom: 40,
    },
    heroButtons: {
      display: "flex",
      gap: 12,
      flexWrap: "wrap",
      justifyContent: "center",
    },
    heroPrimaryBtn: {
      background: "#0a84ff",
      color: "#fff",
      border: "none",
      borderRadius: 10,
      padding: "13px 28px",
      fontSize: 15,
      fontWeight: 600,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontFamily: "inherit",
      transition: "background 0.15s, transform 0.1s",
    },
    heroSecondaryBtn: {
      background: "rgba(255,255,255,0.08)",
      color: "#fff",
      border: "1px solid rgba(255,255,255,0.2)",
      borderRadius: 10,
      padding: "13px 28px",
      fontSize: 15,
      fontWeight: 500,
      cursor: "pointer",
      fontFamily: "inherit",
      transition: "background 0.15s",
    },
    sectionWrapper: {
      maxWidth: 1120,
      margin: "0 auto",
      padding: "0 24px",
    },
    section: {
      padding: "96px 0",
    },
    sectionLabel: {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "1.5px",
      textTransform: "uppercase",
      color: "#0a84ff",
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: "clamp(26px, 3.5vw, 40px)",
      fontWeight: 800,
      letterSpacing: "-0.8px",
      color: "#0f1117",
      lineHeight: 1.2, textAlign: "center",
      marginBottom: 16,
      fontFamily: "'DM Serif Display', Georgia, serif",
      textAlign: "center" },
    sectionDesc: { textAlign: "center",
      fontSize: 17,
      color: "#6b7280",
      lineHeight: 1.75,
      textAlign: "center",
    },
    servicesGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
      gap: 20,
      marginTop: 56,
    },
    serviceCard: {
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 16,
      padding: "28px 28px 24px",
      transition: "box-shadow 0.2s, transform 0.15s, border-color 0.2s",
      cursor: "default",
    },
    serviceIcon: {
      width: 44,
      height: 44,
      background: "rgba(10,132,255,0.08)",
      borderRadius: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#0a84ff",
      marginBottom: 16,
    },
    serviceTitle: {
      fontSize: 16,
      fontWeight: 700,
      color: "#0f1117",
      marginBottom: 10,
      letterSpacing: "-0.2px",
    },
    serviceDesc: {
      fontSize: 14,
      color: "#6b7280",
      lineHeight: 1.7,
    },
    aboutSection: {
      background: "#0d1f3c",
      padding: "96px 0",
    },
    aboutGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 80,
      alignItems: "center",
    },
    aboutTitle: {
      fontSize: "clamp(28px, 3.5vw, 40px)",
      fontWeight: 800,
      color: "#fff",
      letterSpacing: "-0.8px",
      lineHeight: 1.2,
      marginBottom: 20,
      fontFamily: "'DM Serif Display', Georgia, serif",
    },
    aboutText: {
      fontSize: 16,
      color: "rgba(255,255,255,0.68)",
      lineHeight: 1.8,
      marginBottom: 20,
      textAlign: "justify",
    },
    aboutTag: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontSize: 12,
      fontWeight: 600,
      background: "rgba(255,255,255,0.07)",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: 100,
      padding: "5px 12px",
      color: "rgba(255,255,255,0.7)",
      margin: "4px 4px 4px 0",
    },
    aboutRight: {
      display: "flex",
      flexDirection: "column",
      gap: 16,
    },
    infoCard: {
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 12,
      padding: "20px 24px",
    },
    infoCardTitle: {
      fontSize: 13,
      fontWeight: 600,
      color: "rgba(255,255,255,0.5)",
      letterSpacing: "0.5px",
      textTransform: "uppercase",
      marginBottom: 10,
    },
    infoItem: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      fontSize: 14,
      color: "rgba(255,255,255,0.8)",
      marginBottom: 8,
    },
    articlesGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: 20,
      marginTop: 56,
    },
    articleCard: {
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 16,
      padding: "24px",
      cursor: "pointer",
      transition: "box-shadow 0.2s, border-color 0.2s",
      display: "flex",
      flexDirection: "column",
    },
    articleTag: {
      display: "inline-block",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.8px",
      textTransform: "uppercase",
      color: "#0a84ff",
      marginBottom: 12,
    },
    articleTitle: {
      fontSize: 16,
      fontWeight: 700,
      color: "#0f1117",
      lineHeight: 1.4,
      marginBottom: 12,
      letterSpacing: "-0.2px",
    },
    articlePreview: {
      fontSize: 14,
      color: "#6b7280",
      lineHeight: 1.7,
      flex: 1,
      textAlign: "justify",
    },
    articleReadMore: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      marginTop: 18,
      fontSize: 13,
      fontWeight: 600,
      color: "#0a84ff",
    },
    articleModal: {
      position: "fixed",
      inset: 0,
      background: "rgba(15,17,23,0.6)",
      backdropFilter: "blur(6px)",
      zIndex: 300,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    },
    articleModalInner: {
      background: "#fff",
      borderRadius: 20,
      maxWidth: 680,
      width: "100%",
      maxHeight: "85vh",
      overflowY: "auto",
      padding: "40px 44px",
      position: "relative",
    },
    ctaSection: {
      background: "linear-gradient(135deg, #0a84ff 0%, #1a5fd4 100%)",
      padding: "80px 0",
    },
    ctaSectionInner: {
      maxWidth: 1120,
      margin: "0 auto",
      padding: "0 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 40,
      flexWrap: "wrap",
    },
    footer: {
      background: "#0a1628",
      padding: "64px 0 32px",
    },
    footerInner: {
      maxWidth: 1120,
      margin: "0 auto",
      padding: "0 24px",
    },
    footerGrid: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr 1fr",
      gap: 60,
      marginBottom: 48,
    },
    footerBrand: {
      fontSize: 14,
      color: "rgba(255,255,255,0.5)",
      lineHeight: 1.75,
      marginTop: 14,
    },
    footerHeading: {
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: "1px",
      textTransform: "uppercase",
      color: "rgba(255,255,255,0.35)",
      marginBottom: 16,
    },
    footerLink: {
      display: "block",
      fontSize: 14,
      color: "rgba(255,255,255,0.6)",
      marginBottom: 10,
      cursor: "pointer",
      textDecoration: "none",
      transition: "color 0.1s",
    },
    footerDivider: {
      height: 1,
      background: "rgba(255,255,255,0.08)",
      marginBottom: 24,
    },
    footerBottom: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontSize: 13,
      color: "rgba(255,255,255,0.35)",
    },
    assessmentOverlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(15,17,23,0.6)",
      backdropFilter: "blur(6px)",
      zIndex: 300,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    },
    assessmentModal: {
      background: "#fff",
      borderRadius: 20,
      maxWidth: 520,
      width: "100%",
      padding: "40px",
      position: "relative",
    },
    input: {
      width: "100%",
      border: "1px solid #e5e7eb",
      borderRadius: 10,
      padding: "11px 14px",
      fontSize: 14,
      color: "#0f1117",
      background: "#f9fafb",
      outline: "none",
      fontFamily: "inherit",
      boxSizing: "border-box",
      transition: "border-color 0.15s",
    },
    label: {
      fontSize: 13,
      fontWeight: 600,
      color: "#374151",
      display: "block",
      marginBottom: 6,
    },
  };

  if (view === "gate") {
    return (
      <div style={{ ...styles.root, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg, #0a1628 0%, #0d2145 100%)", padding: 24 }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />
        <div style={{ background: "#fff", borderRadius: 20, maxWidth: 460, width: "100%", padding: "44px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
            <img src={cadenceLogo} alt="Cadence Compliance" style={{ height: 34, width: 34, borderRadius: 6, objectFit: "cover" }} />
            <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.3px" }}>Cadence Compliance</span>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 8, fontFamily: "'DM Serif Display', Georgia, serif" }}>Access the Compliance Advisor</h2>
          <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6, marginBottom: 28 }}>Share your name and email to begin. This helps us provide context-aware guidance and follow up where relevant.</p>
          <div style={{ marginBottom: 16 }}>
            <label style={styles.label}>Full name</label>
            <input style={styles.input} placeholder="Your name" value={gateData.name} onChange={(e) => setGateData({ ...gateData, name: e.target.value })} />
          </div>
          <div style={{ marginBottom: 28 }}>
            <label style={styles.label}>Email address</label>
            <input style={styles.input} type="email" placeholder="you@organisation.com" value={gateData.email} onChange={(e) => setGateData({ ...gateData, email: e.target.value })} />
          </div>
          <button
            style={{ ...styles.heroPrimaryBtn, width: "100%", justifyContent: "center", opacity: !gateData.name.trim() || !gateData.email.trim() ? 0.5 : 1 }}
            onClick={handleGateSubmit}
            disabled={gateSubmitting || !gateData.name.trim() || !gateData.email.trim()}
          >
            {gateSubmitting ? "One moment..." : "Continue to Advisor"}
            {!gateSubmitting && <ArrowRightIcon />}
          </button>
          <button onClick={() => setView("landing")} style={{ display: "block", width: "100%", textAlign: "center", marginTop: 16, fontSize: 13, color: "#9ca3af", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
            Return to site
          </button>
        </div>
      </div>
    );
  }

  // ── helpers ──────────────────────────────────────────────
  const RISK_CONFIG = {
    LOW:      { color: "#16a34a", bg: "#dcfce7", border: "#bbf7d0", label: "Low Risk",      icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6L12 2z"/><polyline points="9 12 11 14 15 10"/></svg>
    )},
    MEDIUM:   { color: "#d97706", bg: "#fef3c7", border: "#fde68a", label: "Medium Risk",   icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6L12 2z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    )},
    HIGH:     { color: "#ea580c", bg: "#ffedd5", border: "#fed7aa", label: "High Risk",     icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
    )},
    CRITICAL: { color: "#dc2626", bg: "#fee2e2", border: "#fecaca", label: "Critical Risk", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    )},
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
    const match = text.match(/RISK_LEVEL:\s*(LOW|MEDIUM|HIGH|CRITICAL)/i);
    if (match) return match[1].toUpperCase();
    return null;
  }

  function stripRiskLine(text) {
    return text.replace(/RISK_LEVEL:\s*(LOW|MEDIUM|HIGH|CRITICAL)\n?/i, "").trim();
  }

  function formatMarkdown(text) {
    // Bold+italic for citations: ***text***
    text = text.replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>");
    // Bold headings: **text**
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Italic: *text*
    text = text.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, "<em>$1</em>");
    // Numbered list lines: "1. text"
    text = text.replace(/^(\d+\.\s)/gm, "<span style=\"font-weight:600;color:#0a84ff\">$1</span>");
    // Headings: lines starting with ## or #
    text = text.replace(/^#{1,2}\s(.+)$/gm, "<div style=\"font-size:15px;font-weight:700;color:#0f1117;margin:16px 0 6px;text-align:center\">$1</div>");
    // Paragraphs: double newline
    text = text.replace(/\n\n/g, "</p><p style=\"margin:0 0 12px;text-align:justify\">");
    text = text.replace(/\n/g, "<br/>");
    return `<p style="margin:0 0 12px;text-align:justify">${text}</p>`;
  }


  const handleFileUpload = async (file) => {
    if (!file || limitReached) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target.result.split(",")[1];
      const userMsg = { role: "user", content: [
        { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } },
        { type: "text", text: "Please review this document and provide a compliance assessment. Identify any gaps, risks, and obligations relevant to the frameworks that apply." }
      ]};
      const displayMsg = { role: "user", content: `[PDF uploaded: ${file.name}] Please review and provide a compliance assessment.` };
      const newCount = userMessageCount + 1;
      setUserMessageCount(newCount);
      const updated = [...messages, displayMsg];
      setMessages(updated);
      setChatLoading(true);
      try {
        const apiMessages = [...messages.map(m => ({ role: m.role, content: m.content })), userMsg];
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages }),
        });
        const data = await res.json();
        const reply = data.reply || "I was unable to process the document. Please try again.";
        const finalMessages = [...updated, { role: "assistant", content: reply }];
        if (newCount >= FREE_LIMIT) {
          setLimitReached(true);
          setMessages([...finalMessages, { role: "assistant", content: "You have reached the limit for free questions. To continue and receive personalised compliance guidance, please book an assessment or contact Boluwatife directly at bolu.compliance@gmail.com.", isLimit: true }]);
        } else {
          setMessages(finalMessages);
        }
      } catch {
        setMessages([...updated, { role: "assistant", content: "I encountered an error processing the document. Please try again." }]);
      } finally {
        setChatLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  if (view === "chat") {
    return (
      <div style={{ ...styles.root, display: "flex", flexDirection: "column", height: "100vh", background: "#f0f2f5" }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />
        <style>{`
          @keyframes pulse{0%,100%{opacity:0.3}50%{opacity:1}}
          @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
          .chat-msg{animation:fadeIn 0.2s ease}
          .chip:hover{background:#e0eeff!important;border-color:#0a84ff!important;color:#0a84ff!important}
          .send-btn:hover{background:#0070e0!important}
          .upload-btn:hover{background:#f3f4f6!important}
        `}</style>

        {/* Header */}
        <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 24px", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src={cadenceLogo} alt="Cadence Compliance" style={{ height: 28, width: 90, objectFit: "contain" }} />
            <div style={{ width: 1, height: 20, background: "#e5e7eb" }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>Compliance Advisor</span>
            <span style={{ fontSize: 11, background: "rgba(10,132,255,0.1)", color: "#0a84ff", borderRadius: 100, padding: "2px 8px", fontWeight: 700, letterSpacing: "0.3px" }}>AI</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: "#9ca3af" }}>{FREE_LIMIT - userMessageCount > 0 ? `${FREE_LIMIT - userMessageCount} free ${FREE_LIMIT - userMessageCount === 1 ? "question" : "questions"} remaining` : "Limit reached"}</span>
            <button onClick={() => setView("landing")} style={{ fontSize: 13, color: "#6b7280", background: "none", border: "1px solid #e5e7eb", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontFamily: "inherit" }}>
              Return to site
            </button>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 16px", maxWidth: 800, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>

          {/* Suggested chips — only before first user message */}
          {messages.filter(m => m.role === "user").length === 0 && (
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 13, color: "#9ca3af", textAlign: "center", marginBottom: 14 }}>Suggested questions</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                {SUGGESTED.map((s, i) => (
                  <button key={i} className="chip" onClick={() => { setInputVal(s); }} style={{ fontSize: 13, color: "#374151", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 100, padding: "7px 14px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => {
            const isUser = msg.role === "user";
            const riskLevel = !isUser ? parseRiskLevel(msg.content) : null;
            const riskCfg = riskLevel ? RISK_CONFIG[riskLevel] : null;
            const displayContent = !isUser ? stripRiskLine(msg.content) : msg.content;

            return (
              <div key={i} className="chat-msg" style={{ marginBottom: 20, display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", alignItems: "flex-start", gap: 10 }}>
                {!isUser && (
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#0a84ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                    <ShieldIcon size={14} color="#fff" />
                  </div>
                )}
                <div style={{ maxWidth: "82%", minWidth: 60 }}>
                  {/* Risk badge */}
                  {riskCfg && (
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: riskCfg.bg, border: `1px solid ${riskCfg.border}`, borderRadius: 100, padding: "5px 14px" }}>
                        {riskCfg.icon}
                        <span style={{ fontSize: 12, fontWeight: 700, color: riskCfg.color, letterSpacing: "0.3px" }}>{riskCfg.label}</span>
                      </div>
                    </div>
                  )}
                  {/* Bubble */}
                  <div style={{
                    background: isUser ? "#0a84ff" : "#fff",
                    color: isUser ? "#fff" : "#0f1117",
                    border: !isUser ? "1px solid #e5e7eb" : "none",
                    borderRadius: isUser ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
                    padding: "14px 18px",
                    fontSize: 14,
                    lineHeight: 1.75,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  }}>
                    {isUser ? (
                      <span style={{ whiteSpace: "pre-wrap" }}>{displayContent}</span>
                    ) : msg.isLimit ? (
                      <div>
                        <p style={{ margin: "0 0 12px", textAlign: "justify" }}>{displayContent}</p>
                        <button onClick={() => setAssessmentOpen(true)} style={{ ...styles.heroPrimaryBtn, fontSize: 13, padding: "9px 18px", marginTop: 4 }}>
                          Book an Assessment <ArrowRightIcon size={13} />
                        </button>
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
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#0a84ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ShieldIcon size={14} color="#fff" />
              </div>
              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "4px 16px 16px 16px", padding: "14px 18px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", gap: 5 }}>
                  {[0, 0.2, 0.4].map((d, i) => (
                    <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#9ca3af", animation: "pulse 1.2s infinite", animationDelay: `${d}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Input bar */}
        <div style={{ background: "#fff", borderTop: "1px solid #e5e7eb", padding: "14px 16px 16px", flexShrink: 0 }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {/* PDF upload */}
              <input ref={fileRef} type="file" accept="application/pdf" style={{ display: "none" }} onChange={(e) => { if (e.target.files[0]) handleFileUpload(e.target.files[0]); e.target.value = ""; }} />
              <button className="upload-btn" onClick={() => fileRef.current?.click()} disabled={limitReached} title="Upload PDF" style={{ width: 40, height: 40, borderRadius: 10, border: "1px solid #e5e7eb", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "background 0.15s", opacity: limitReached ? 0.4 : 1 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
              </button>
              <input
                style={{ ...styles.input, flex: 1, height: 40 }}
                placeholder={limitReached ? "Message limit reached — book an assessment to continue" : "Ask a compliance question..."}
                value={inputVal}
                disabled={limitReached}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && !limitReached && handleSendMessage()}
              />
              <button className="send-btn" onClick={handleSendMessage} disabled={!inputVal.trim() || chatLoading || limitReached} style={{ width: 40, height: 40, borderRadius: 10, background: "#0a84ff", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, opacity: !inputVal.trim() || chatLoading || limitReached ? 0.4 : 1, transition: "background 0.15s" }}>
                <SendIcon size={15} color="#fff" />
              </button>
            </div>
            <p style={{ fontSize: 11, color: "#9ca3af", textAlign: "center", marginTop: 10, marginBottom: 0 }}>General compliance information only. For organisation-specific advice, book a consultation with Cadence Compliance.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.root}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />
      <style>{`
        body{margin:0}
        *{box-sizing:border-box}
        .nav-link:hover{background:rgba(0,0,0,0.05)!important}
        .dropdown-item:hover{background:#f3f4f6!important}
        .service-card:hover{box-shadow:0 8px 24px rgba(0,0,0,0.08)!important;transform:translateY(-2px);border-color:#d1d5db!important}
        .article-card:hover{box-shadow:0 8px 24px rgba(0,0,0,0.08)!important;border-color:#d1d5db!important}
        .footer-link:hover{color:rgba(255,255,255,0.9)!important}
        input:focus{border-color:#0a84ff!important;outline:none;box-shadow:0 0 0 3px rgba(10,132,255,0.12)}
        textarea:focus{border-color:#0a84ff!important;outline:none;box-shadow:0 0 0 3px rgba(10,132,255,0.12)}
        select:focus{border-color:#0a84ff!important;outline:none}
        @keyframes pulse{0%,100%{opacity:0.3}50%{opacity:1}}
        @media(max-width:768px){
          .desktop-nav{display:none!important}
          .mobile-menu-btn{display:flex!important}
          .about-grid{grid-template-columns:1fr!important;gap:40px!important}
          .footer-grid{grid-template-columns:1fr!important;gap:32px!important}
          .cta-inner{flex-direction:column!important;text-align:center!important}
          .article-modal-inner{padding:28px 24px!important}
          .assessment-modal{padding:28px 24px!important}
        }
        @media(min-width:769px){
          .mobile-menu-btn{display:none!important}
        }
        .hero-bg-circle{position:absolute;border-radius:50%;background:rgba(10,132,255,0.06);pointer-events:none}
      `}</style>

      {/* NAV */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <div style={styles.navLogo} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <img src={cadenceLogo} alt="Cadence Compliance" style={{ height: 34, width: 34, borderRadius: 6, objectFit: "cover" }} />
            <span style={styles.navLogoText}>Cadence Compliance</span>
          </div>
          <div className="desktop-nav" style={styles.navLinks}>
            <div style={{ position: "relative" }} onMouseLeave={() => setServicesDropdown(false)}>
              <button className="nav-link" style={styles.navLink} onMouseEnter={() => { setServicesDropdown(true); setAboutDropdown(false); }}>
                Services <ChevronDownIcon />
              </button>
              {servicesDropdown && (
                <div style={styles.dropdown}>
                  {SERVICES.map((s) => (
                    <div key={s.title} className="dropdown-item" style={styles.dropdownItem} onClick={() => scrollToSection("services")}>
                      {s.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button className="nav-link" style={styles.navLink} onClick={() => scrollToSection("about")}>About</button>
            <button className="nav-link" style={styles.navLink} onClick={() => scrollToSection("insights")}>Insights</button>
            <a className="nav-link" style={styles.navLink} href="https://www.linkedin.com/in/ogunleye-boluwatife-aicmc-acarb-8437051a9" target="_blank" rel="noopener noreferrer">
              LinkedIn <ExternalIcon />
            </a>
            <a className="nav-link" style={styles.navLink} href="mailto:bolu.compliance@gmail.com">Contact</a>
            <button style={{ ...styles.ctaBtn, marginLeft: 8 }} onClick={() => setAssessmentOpen(true)}>Book Assessment</button>
          </div>
          <button className="mobile-menu-btn" style={{ background: "none", border: "none", cursor: "pointer", color: "#0f1117", padding: 4 }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div style={{ background: "#fff", borderTop: "1px solid #e5e7eb", padding: "12px 24px 20px" }}>
            {["services", "about", "insights"].map((id) => (
              <button key={id} style={{ ...styles.navLink, display: "block", width: "100%", textAlign: "left", padding: "10px 0", textTransform: "capitalize" }} onClick={() => scrollToSection(id)}>
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            ))}
            <a href="https://www.linkedin.com/in/ogunleye-boluwatife-aicmc-acarb-8437051a9" target="_blank" rel="noopener noreferrer" style={{ ...styles.navLink, display: "flex", padding: "10px 0" }}>LinkedIn <ExternalIcon /></a>
            <a href="mailto:bolu.compliance@gmail.com" style={{ ...styles.navLink, display: "block", padding: "10px 0", textDecoration: "none", color: "#374151" }}>Contact</a>
            <button style={{ ...styles.ctaBtn, width: "100%", marginTop: 12, padding: "12px" }} onClick={() => { setMobileMenuOpen(false); setAssessmentOpen(true); }}>Book Assessment</button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section style={styles.hero}>
        <div className="hero-bg-circle" style={{ width: 600, height: 600, top: -200, right: -200 }} />
        <div className="hero-bg-circle" style={{ width: 400, height: 400, bottom: -100, left: -100 }} />
        <h1 style={styles.heroTitle}>
          Compliance that works<br />
          <span style={styles.heroAccent}>in practice.</span>
        </h1>
        <p style={styles.heroDesc}>
          Cadence Compliance helps organisations build practical, audit-ready compliance structures that meet regulatory expectations without disrupting day-to-day operations.
        </p>
        <div style={styles.heroButtons}>
          <button style={styles.heroPrimaryBtn} onClick={() => setAssessmentOpen(true)}>
            Book a Compliance Assessment <ArrowRightIcon />
          </button>
          <button style={styles.heroSecondaryBtn} onClick={() => setView("gate")}>
            Try the Compliance Advisor
          </button>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ background: "#f8f9fb", ...styles.section }}>
        <div style={styles.sectionWrapper}>
          <p style={styles.sectionLabel}>What We Do</p>
          <h2 style={styles.sectionTitle}>Compliance advisory<br />built for how you operate</h2>
          <p style={styles.sectionDesc}>
            Regulations do not exist in a vacuum. Effective compliance requires understanding both the legal framework and the operational reality of your organisation.
          </p>
          <div style={styles.servicesGrid}>
            {SERVICES.map((s) => (
              <div key={s.title} className="service-card" style={styles.serviceCard}>
                <div style={styles.serviceIcon}>{s.icon}</div>
                <div style={styles.serviceTitle}>{s.title}</div>
                <div style={styles.serviceDesc}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={styles.aboutSection}>
        <div style={styles.sectionWrapper}>
          <div className="about-grid" style={styles.aboutGrid}>
            <div>
              <p style={{ ...styles.sectionLabel, color: "#60a5fa" }}>About Cadence Compliance</p>
              <h2 style={styles.aboutTitle}>Practical expertise.<br />Clear guidance.</h2>
              <p style={styles.aboutText}>
                Cadence Compliance was founded on a simple observation: most organisations facing compliance challenges do not lack good intentions. They lack structured, practical support that translates regulatory requirements into operational action.
              </p>
              <p style={styles.aboutText}>
                Our advisory approach focuses on what is actually required, what the risks are, and what steps will genuinely address them. We work alongside your team rather than producing documentation that sits unread on a shelf.
              </p>
              <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["NDPA 2023", "NDPR", "CBN Regulations", "HIPAA", "GLBA", "US AML/CFT", "GDPR", "ePrivacy Directive", "NIS2 Directive", "ISO 27001"].map((tag) => (
                  <span key={tag} style={styles.aboutTag}>{tag}</span>
                ))}
              </div>
            </div>
            <div style={styles.aboutRight}>
              <div style={styles.infoCard}>
                <div style={styles.infoCardTitle}>Sectors Served</div>
                {["Fintech and Financial Services", "Healthcare and Healthtech", "HR and Professional Services", "Technology Companies", "NGOs and Nonprofits", "Legal and Advisory Firms"].map((s) => (
                  <div key={s} style={styles.infoItem}>
                    <CheckIcon size={15} color="#0a84ff" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
              <div style={styles.infoCard}>
                <div style={styles.infoCardTitle}>What to Expect</div>
                {["A structured assessment of your current compliance position", "Clear, written guidance without regulatory jargon", "Policies and documentation tailored to your organisation", "Ongoing access for questions and regulatory updates"].map((s) => (
                  <div key={s} style={styles.infoItem}>
                    <CheckIcon size={15} color="#0a84ff" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INSIGHTS */}
      <section id="insights" style={{ background: "#fff", ...styles.section }}>
        <div style={styles.sectionWrapper}>
          <p style={styles.sectionLabel}>Compliance Insights</p>
          <h2 style={styles.sectionTitle}>What you should know<br />about the regulatory landscape</h2>
          <p style={styles.sectionDesc}>Practical perspectives on the frameworks that affect Nigerian and international organisations.</p>
          <div style={styles.articlesGrid}>
            {ARTICLES.map((a, i) => (
              <div key={i} className="article-card" style={styles.articleCard} onClick={() => setExpandedArticle(a)}>
                <span style={styles.articleTag}>{a.tag}</span>
                <div style={styles.articleTitle}>{a.title}</div>
                <div style={styles.articlePreview}>{a.preview.slice(0, 160)}...</div>
                <div style={styles.articleReadMore}>
                  Read article <ArrowRightIcon size={13} />
                  <span style={{ marginLeft: "auto", fontSize: 12, color: "#9ca3af" }}>{a.readTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section style={styles.ctaSection}>
        <div className="cta-inner" style={styles.ctaSectionInner}>
          <div>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", marginBottom: 8, fontFamily: "'DM Serif Display', Georgia, serif" }}>
              Not sure where to start?
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", lineHeight: 1.6, maxWidth: 460 }}>
              A compliance assessment gives you a clear picture of where your organisation stands and what needs attention. No jargon, no unnecessary complexity.
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button style={{ background: "#fff", color: "#0a84ff", border: "none", borderRadius: 10, padding: "13px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }} onClick={() => setAssessmentOpen(true)}>
              Book an Assessment
            </button>
            <button style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 10, padding: "13px 28px", fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }} onClick={() => setView("gate")}>
              Try Compliance Advisor
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div className="footer-grid" style={styles.footerGrid}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <img src={cadenceLogo} alt="Cadence Compliance" style={{ height: 40, width: 40, borderRadius: 8, objectFit: "cover" }} />
                <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Cadence Compliance</span>
              </div>
              <p style={styles.footerBrand}>
                A data protection and compliance advisory helping organisations build practical, audit-ready compliance structures.
              </p>
            </div>
            <div>
              <div style={styles.footerHeading}>Services</div>
              {SERVICES.map((s) => (
                <span key={s.title} className="footer-link" style={styles.footerLink} onClick={() => scrollToSection("services")}>{s.title}</span>
              ))}
            </div>
            <div>
              <div style={styles.footerHeading}>Connect</div>
              <a href="https://www.linkedin.com/in/ogunleye-boluwatife-aicmc-acarb-8437051a9" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ ...styles.footerLink, display: "inline-flex", alignItems: "center", gap: 4 }}>
                LinkedIn <ExternalIcon size={12} />
              </a>
              <a href="mailto:bolu.compliance@gmail.com" className="footer-link" style={styles.footerLink}>bolu.compliance@gmail.com</a>
              <span className="footer-link" style={{ ...styles.footerLink, cursor: "pointer" }} onClick={() => setAssessmentOpen(true)}>Book Assessment</span>
              <span className="footer-link" style={{ ...styles.footerLink, cursor: "pointer" }} onClick={() => setView("gate")}>Compliance Advisor</span>
            </div>
          </div>
          <div style={styles.footerDivider} />
          <div style={styles.footerBottom}>
            <span>Cadence Compliance &copy; {new Date().getFullYear()}. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* ARTICLE MODAL */}
      {expandedArticle && (
        <div style={styles.articleModal} onClick={() => setExpandedArticle(null)}>
          <div className="article-modal-inner" style={styles.articleModalInner} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setExpandedArticle(null)} style={{ position: "absolute", top: 20, right: 20, background: "#f3f4f6", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <CloseIcon size={16} />
            </button>
            <span style={{ ...styles.articleTag, fontSize: 11 }}>{expandedArticle.tag}</span>
            <h3 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.3, margin: "10px 0 20px", fontFamily: "'DM Serif Display', Georgia, serif" }}>{expandedArticle.title}</h3>
            <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 24, display: "flex", gap: 12 }}>
              <span>Cadence Compliance</span>
              <span>{expandedArticle.readTime}</span>
            </div>
            {expandedArticle.body.split("\n\n").map((para, i) => (
              <p key={i} style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, marginBottom: 18 }}>{para}</p>
            ))}
            <button style={{ ...styles.heroPrimaryBtn, marginTop: 12 }} onClick={() => { setExpandedArticle(null); setAssessmentOpen(true); }}>
              Book a Compliance Assessment <ArrowRightIcon />
            </button>
          </div>
        </div>
      )}

      {/* ASSESSMENT MODAL */}
      {assessmentOpen && (
        <div style={styles.assessmentOverlay} onClick={() => setAssessmentOpen(false)}>
          <div className="assessment-modal" style={styles.assessmentModal} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setAssessmentOpen(false)} style={{ position: "absolute", top: 16, right: 16, background: "#f3f4f6", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <CloseIcon size={15} />
            </button>
            {assessmentSubmitted ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ width: 56, height: 56, background: "rgba(10,132,255,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <CheckIcon size={24} color="#0a84ff" />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10, fontFamily: "'DM Serif Display', Georgia, serif" }}>Thank you</h3>
                <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7 }}>Your assessment request has been received. Boluwatife will be in touch within 48 hours.</p>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                  <img src={cadenceLogo} alt="Cadence Compliance" style={{ height: 34, width: 34, borderRadius: 6, objectFit: "cover" }} />
                  <span style={{ fontSize: 15, fontWeight: 700 }}>Book a Compliance Assessment</span>
                </div>
                <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6, marginBottom: 24 }}>
                  A preliminary assessment helps identify your organisation's key compliance gaps and priorities. Share your details and Boluwatife will be in touch.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label style={styles.label}>Full name</label>
                    <input style={styles.input} placeholder="Your name" value={assessmentData.name} onChange={(e) => setAssessmentData({ ...assessmentData, name: e.target.value })} />
                  </div>
                  <div>
                    <label style={styles.label}>Email address</label>
                    <input style={styles.input} type="email" placeholder="you@organisation.com" value={assessmentData.email} onChange={(e) => setAssessmentData({ ...assessmentData, email: e.target.value })} />
                  </div>
                  <div>
                    <label style={styles.label}>Organisation</label>
                    <input style={styles.input} placeholder="Company or organisation name" value={assessmentData.organisation} onChange={(e) => setAssessmentData({ ...assessmentData, organisation: e.target.value })} />
                  </div>
                  <div>
                    <label style={styles.label}>Primary compliance concern</label>
                    <select
                      style={{ ...styles.input, appearance: "none" }}
                      value={assessmentData.concern}
                      onChange={(e) => setAssessmentData({ ...assessmentData, concern: e.target.value })}
                    >
                      <option value="">Select one</option>
                      <option>Data protection and NDPA compliance</option>
                      <option>AML and financial crime compliance</option>
                      <option>Policy development and documentation</option>
                      <option>Staff training and awareness</option>
                      <option>Data breach response</option>
                      <option>General compliance review</option>
                    </select>
                  </div>
                  <button
                    style={{ ...styles.heroPrimaryBtn, justifyContent: "center", marginTop: 6, opacity: !assessmentData.name.trim() || !assessmentData.email.trim() ? 0.5 : 1 }}
                    disabled={assessmentSubmitting || !assessmentData.name.trim() || !assessmentData.email.trim()}
                    onClick={handleAssessmentSubmit}
                  >
                    {assessmentSubmitting ? "Submitting..." : "Submit Assessment Request"}
                    {!assessmentSubmitting && <ArrowRightIcon />}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}



