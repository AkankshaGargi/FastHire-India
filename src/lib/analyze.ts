export type CheckStatus = "pass" | "warn" | "fail";

export type Check = {
  label: string;
  status: CheckStatus;
  detail: string;
};

export type AnalysisResult = {
  score: number;
  verdict: string;
  checks: Check[];
  summary: string;
  advice: string[];
};

const GSTIN_RE = /\b\d{2}[A-Z]{5}\d{4}[A-Z][A-Z0-9]Z[A-Z0-9]\b/i;
const CIN_RE = /\b[LUu]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}\b/i;
const EMAIL_RE = /[\w.+-]+@([\w-]+\.[\w.-]+)/g;
const FREE_MAIL = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "rediffmail.com"];

const FEE_WORDS = [
  "registration fee",
  "security deposit",
  "refundable deposit",
  "joining fee",
  "training fee",
  "kit charge",
  "activation fee",
  "pay rs",
  "processing fee",
];
const URGENCY_WORDS = [
  "urgent",
  "limited seats",
  "apply today",
  "immediate joining",
  "hurry",
  "only few slots",
];
const HYPE_WORDS = ["no interview", "no experience needed", "earn upto", "earn up to", "guaranteed income", "work 2 hours"];

function has(text: string, words: string[]) {
  return words.filter((w) => text.includes(w));
}

function fakeRegistryDate(seed: string) {
  let n = 0;
  for (const ch of seed) n = (n * 31 + ch.charCodeAt(0)) % 100000;
  const year = 2008 + (n % 16);
  const month = 1 + (n % 12);
  const day = 1 + (n % 27);
  return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
}

export function analyzeJob(raw: string): AnalysisResult {
  const text = raw.toLowerCase();
  const checks: Check[] = [];
  let score = 72;

  // GSTIN
  const gst = raw.match(GSTIN_RE)?.[0];
  if (gst) {
    score += 12;
    checks.push({
      label: "GSTIN check",
      status: "pass",
      detail: `GSTIN ${gst.toUpperCase()} found and format-valid. Simulated registry shows an ACTIVE regular taxpayer registered on ${fakeRegistryDate(gst)}.`,
    });
  } else if (/gst/i.test(raw)) {
    score -= 6;
    checks.push({
      label: "GSTIN check",
      status: "warn",
      detail:
        "The post mentions GST but no valid 15-character GSTIN was found. Ask the employer for the exact number and verify it yourself.",
    });
  } else {
    score -= 14;
    checks.push({
      label: "GSTIN check",
      status: "fail",
      detail:
        "No GSTIN quoted anywhere in the post. Genuine registered employers can share a GSTIN on request.",
    });
  }

  // CIN
  const cin = raw.match(CIN_RE)?.[0];
  if (cin) {
    score += 12;
    checks.push({
      label: "CIN / MCA company check",
      status: "pass",
      detail: `CIN ${cin.toUpperCase()} is format-valid. Simulated MCA record: company status ACTIVE, incorporated ${fakeRegistryDate(cin)}, filings up to date.`,
    });
  } else {
    score -= 12;
    checks.push({
      label: "CIN / MCA company check",
      status: "fail",
      detail:
        "No Corporate Identity Number (CIN) found, so the hiring entity could not be matched to a registered company.",
    });
  }

  // Payment risk
  const fees = has(text, FEE_WORDS);
  if (fees.length) {
    score -= 34;
    checks.push({
      label: "Payment-risk analysis",
      status: "fail",
      detail: `Upfront money is being requested (matched: ${fees.join(", ")}). A legitimate employer never charges a student to start work — this is the single strongest scam signal.`,
    });
  } else if (/\bupi\b|paytm|phonepe|google pay|gpay/.test(text)) {
    score -= 12;
    checks.push({
      label: "Payment-risk analysis",
      status: "warn",
      detail:
        "Personal payment apps (UPI/Paytm/PhonePe) are mentioned. Salaries from real employers arrive by bank transfer against a payslip.",
    });
  } else {
    score += 10;
    checks.push({
      label: "Payment-risk analysis",
      status: "pass",
      detail: "No upfront fee, deposit or personal-wallet payment request detected in the text.",
    });
  }

  // Contract & pay clarity
  const hasSalary = /(₹|rs\.?|inr)\s?\d|per hour|per month|stipend/.test(text);
  const hasContract = /offer letter|contract|agreement|appointment letter|payslip/.test(text);
  if (hasSalary && hasContract) {
    score += 8;
    checks.push({
      label: "Pay & contract clarity",
      status: "pass",
      detail: "Pay figures and a written offer/contract are both mentioned.",
    });
  } else if (hasSalary) {
    checks.push({
      label: "Pay & contract clarity",
      status: "warn",
      detail: "Pay is mentioned but there is no reference to an offer letter or written contract.",
    });
    score -= 5;
  } else {
    score -= 8;
    checks.push({
      label: "Pay & contract clarity",
      status: "fail",
      detail: "Neither a clear pay rate nor a written agreement is described.",
    });
  }

  // Contact legitimacy
  const domains = [...raw.matchAll(EMAIL_RE)].map((m) => (m[1] ?? "").toLowerCase()).filter(Boolean);
  const corporate = domains.filter((d) => !FREE_MAIL.includes(d));
  if (corporate.length) {
    score += 8;
    checks.push({
      label: "Employer contact verification",
      status: "pass",
      detail: `Contact uses a company domain (@${corporate[0]}), which can be traced back to a business.`,
    });
  } else if (domains.length) {
    score -= 8;
    checks.push({
      label: "Employer contact verification",
      status: "warn",
      detail: `Contact is a free personal mailbox (@${domains[0]}) rather than a company domain.`,
    });
  } else if (/whatsapp|telegram|\+91[\s-]?\d/.test(text)) {
    score -= 12;
    checks.push({
      label: "Employer contact verification",
      status: "fail",
      detail:
        "Hiring runs only through WhatsApp/Telegram or a mobile number, with no company email or website.",
    });
  } else {
    checks.push({
      label: "Employer contact verification",
      status: "warn",
      detail: "No contact channel could be identified in the text.",
    });
    score -= 4;
  }

  // Language pressure
  const pressure = [...has(text, URGENCY_WORDS), ...has(text, HYPE_WORDS)];
  if (pressure.length >= 2) {
    score -= 16;
    checks.push({
      label: "Language & pressure signals",
      status: "fail",
      detail: `High-pressure or too-good-to-be-true phrasing found: ${pressure.slice(0, 4).join(", ")}.`,
    });
  } else if (pressure.length === 1) {
    score -= 7;
    checks.push({
      label: "Language & pressure signals",
      status: "warn",
      detail: `One pressure phrase detected: "${pressure[0]}". Take your time and verify before replying.`,
    });
  } else {
    score += 6;
    checks.push({
      label: "Language & pressure signals",
      status: "pass",
      detail: "Tone reads professional, with no urgency traps or unrealistic income promises.",
    });
  }

  // Document / KYC misuse
  if (/aadhaar|aadhar|pan card|bank passbook|otp|debit card/.test(text)) {
    score -= 14;
    checks.push({
      label: "Document & KYC safety",
      status: "fail",
      detail:
        "Sensitive documents or OTP are requested early. Never share Aadhaar copies, card details or OTPs before a verified offer letter.",
    });
  } else {
    score += 4;
    checks.push({
      label: "Document & KYC safety",
      status: "pass",
      detail: "No early request for Aadhaar, PAN, card details or OTP was detected.",
    });
  }

  score = Math.max(4, Math.min(97, Math.round(score)));

  const verdict =
    score >= 70 ? "Likely genuine" : score >= 40 ? "Proceed with caution" : "High scam risk";

  const failing = checks.filter((c) => c.status === "fail").length;
  const summary =
    score >= 70
      ? `This listing looks reasonably trustworthy. Our simulated registry lookups matched company identifiers and we found no request for money, documents or OTPs. ${failing ? `${failing} item still needs a closer look before you commit.` : "Still ask for a written offer letter before starting work."}`
      : score >= 40
        ? `Mixed signals. Some details check out, but ${failing || "several"} area(s) look weak — typically missing company identifiers or vague pay terms. Treat it as unverified until the employer shares a GSTIN/CIN and a written offer.`
        : `Strong warning. This post matches the pattern of part-time job scams that target Indian students: unverifiable company identity combined with money, document or urgency traps. Do not pay anything and do not share personal documents.`;

  const advice = [
    "Ask for the company's GSTIN and CIN, then check them yourself on gst.gov.in and mca.gov.in.",
    "Never pay a registration, deposit or training fee to get a job.",
    "Insist on a written offer letter with pay, hours and the employer's registered address.",
    "Share Aadhaar/PAN copies only after you have confirmed the employer is real.",
    "If you have already lost money, report it at cybercrime.gov.in or call 1930.",
  ];

  return { score, verdict, checks, summary, advice };
}
