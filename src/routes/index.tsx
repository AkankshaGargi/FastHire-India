import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { analyzeJob, type AnalysisResult } from "@/lib/analyze";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GovTrust AI — Verify Part-Time Job Offers in India" },
      {
        name: "description",
        content:
          "Paste any part-time job description and get an instant AI safety score, simulated GSTIN/CIN registry checks and payment-risk analysis built for Indian students.",
      },
      { property: "og:title", content: "GovTrust AI — Verify Part-Time Job Offers in India" },
      {
        property: "og:description",
        content:
          "Instant AI safety score, simulated GSTIN/CIN registry checks and payment-risk analysis for Indian students.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const STAGES = [
  "Parsing job description…",
  "Querying GSTIN registry (simulated)…",
  "Cross-checking CIN with MCA records (simulated)…",
  "Scanning payment terms for advance-fee risk…",
  "Compiling student safety report…",
];

const SAMPLE = `Urgent hiring! Work from home data entry job for college students.
Earn Rs 25,000 per month, only 2 hours daily. No interview, no experience needed.
Registration fee of Rs 1,499 required to activate your ID and receive the work kit.
Contact us on WhatsApp at +91 90000 00000. Limited seats, apply today!`;

function Index() {
  const [text, setText] = useState("");
  const [stage, setStage] = useState(-1);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const loading = stage >= 0;

  async function run() {
    if (!text.trim() || loading) return;
    setResult(null);
    for (let i = 0; i < STAGES.length; i++) {
      setStage(i);
      await new Promise((r) => setTimeout(r, 420 + Math.random() * 480));
    }
    setStage(-1);
    setResult(analyzeJob(text));
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-5 py-10 md:py-16">
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="size-2 rounded-full bg-emerald-500" />
            Demo registry mode
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            GovTrust <span className="text-emerald-600">AI</span>
          </h1>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            Paste a part-time job description and we&apos;ll score how safe it looks for students —
            company registry checks, payment-risk analysis and a plain-language report.
          </p>
        </header>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
          <label htmlFor="jd" className="text-sm font-semibold text-foreground">
            Job description / offer message
          </label>
          <textarea
            id="jd"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={9}
            placeholder="Paste the full WhatsApp message, email or job post here…"
            className="mt-3 w-full resize-y rounded-xl border border-input bg-background p-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
          />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={run}
              disabled={!text.trim() || loading}
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? "Analyzing…" : "Analyze & Verify via Government Registry"}
            </button>
            <button
              onClick={() => {
                setText(SAMPLE);
                setResult(null);
              }}
              className="rounded-xl border border-input px-4 py-3 text-sm font-medium text-foreground transition hover:bg-accent"
            >
              Try a sample scam post
            </button>
          </div>

          {loading && (
            <ul className="mt-6 space-y-2">
              {STAGES.map((s, i) => (
                <li
                  key={s}
                  className={`flex items-center gap-3 text-sm ${
                    i <= stage ? "text-foreground" : "text-muted-foreground/50"
                  }`}
                >
                  <span
                    className={`size-2 rounded-full ${
                      i < stage
                        ? "bg-emerald-500"
                        : i === stage
                          ? "animate-pulse bg-amber-500"
                          : "bg-border"
                    }`}
                  />
                  {s}
                </li>
              ))}
            </ul>
          )}
        </section>

        {result && <Report result={result} />}

        <p className="mt-10 rounded-xl border border-dashed border-border p-4 text-xs leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Disclaimer:</strong> GSTIN, CIN and employer registry
          results shown here are simulated demo data generated from the text you paste. They are not
          live lookups of GST, MCA or any official government database. Always verify independently
          on gst.gov.in and mca.gov.in before sharing documents or money. This tool never asks you to
          pay anyone.
        </p>
      </div>
    </main>
  );
}

function Report({ result }: { result: AnalysisResult }) {
  const good = result.score >= 70;
  const mid = result.score >= 40 && result.score < 70;
  const tone = good ? "emerald" : mid ? "amber" : "rose";
  const barColor = good ? "bg-emerald-500" : mid ? "bg-amber-500" : "bg-rose-500";
  const textColor =
    good ? "text-emerald-600" : mid ? "text-amber-600" : "text-rose-600";

  return (
    <section className="mt-8 space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Safety Score</p>
            <p className={`text-5xl font-bold ${textColor}`}>{result.score}/100</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold ${textColor} bg-${tone}-500/10`}
          >
            {result.verdict}
          </span>
        </div>
        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
            style={{ width: `${result.score}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>High risk</span>
          <span>Caution</span>
          <span>Looks safe</span>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Verification checklist</h2>
        <ul className="mt-4 divide-y divide-border">
          {result.checks.map((c) => (
            <li key={c.label} className="flex gap-3 py-3">
              <span
                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                  c.status === "pass"
                    ? "bg-emerald-500"
                    : c.status === "warn"
                      ? "bg-amber-500"
                      : "bg-rose-500"
                }`}
              >
                {c.status === "pass" ? "✓" : c.status === "warn" ? "!" : "✕"}
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{c.label}</p>
                <p className="text-sm text-muted-foreground">{c.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Student-friendly summary</h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground">{result.summary}</p>
        <h3 className="mt-5 text-sm font-semibold text-foreground">What you should do next</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {result.advice.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
