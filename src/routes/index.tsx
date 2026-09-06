import { createFileRoute, Link } from "@tanstack/react-router";
import {
  GraduationCap,
  Store,
  Building2,
  Landmark,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { DemoBanner, Stat } from "@/components/DemoBanner";
import { PIN_METRICS, inr } from "@/lib/demo-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FastHire — Verified Micro-Work Dashboard for India" },
      {
        name: "description",
        content:
          "One dashboard for students, local vendors, enterprises and government auditors: verified micro-jobs, subsidy splits, bulk field tasks and PIN-code employment metrics.",
      },
      { property: "og:title", content: "FastHire — Verified Micro-Work Dashboard for India" },
      {
        property: "og:description",
        content:
          "Student Hub, Local Vendor Registry, Enterprise Portal and Government Audit Desk — with an AI job-scam checker built in.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const PORTALS = [
  {
    to: "/student",
    label: "Student Hub",
    icon: GraduationCap,
    desc: "Find flexible micro-jobs near your PIN code, apply in one tap and track every rupee you've earned.",
    points: ["Local job feed", "Apply & shift tracker", "Earnings wallet"],
    accent: "text-emerald-600 bg-emerald-500/10",
  },
  {
    to: "/vendor",
    label: "Local Vendor Registry",
    icon: Store,
    desc: "Shops post short gig memos and instantly see how the Gov-Subsidy Compensation Split reduces their wage cost.",
    points: ["Post a gig memo", "Subsidy split calculator", "Applicant pipeline"],
    accent: "text-sky-600 bg-sky-500/10",
  },
  {
    to: "/enterprise",
    label: "Enterprise Portal",
    icon: Building2,
    desc: "Upload bulk field task batches, allocate verified workers city by city and watch SLA and budget burn.",
    points: ["Bulk batch upload", "Worker allocation", "Budget & SLA view"],
    accent: "text-indigo-600 bg-indigo-500/10",
  },
  {
    to: "/audit",
    label: "Government Audit Desk",
    icon: Landmark,
    desc: "Live-style PIN-code employment metrics, subsidy payout trends and scam-risk charts for policy teams.",
    points: ["PIN-code metrics", "Subsidy payouts", "Scam-risk analytics"],
    accent: "text-amber-600 bg-amber-500/10",
  },
] as const;

function Home() {
  const totalActive = PIN_METRICS.reduce((s, p) => s + p.active, 0);
  const totalPayout = PIN_METRICS.reduce((s, p) => s + p.payout, 0);
  const avgRisk = Math.round(
    PIN_METRICS.reduce((s, p) => s + p.scamRisk, 0) / PIN_METRICS.length,
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
        <section className="rounded-3xl border border-border bg-gradient-to-br from-emerald-500/10 via-card to-card p-6 shadow-sm md:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
            Simulated registry mode
          </div>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Verified micro-work for India, in one{" "}
            <span className="text-emerald-600">trust dashboard</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">
            FastHire connects students, neighbourhood shops, enterprises and government
            auditors on a single record — with an AI scam checker on every job offer.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/student"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Enter Student Hub <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/verify"
              className="inline-flex items-center gap-2 rounded-xl border border-input px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-accent"
            >
              <ShieldCheck className="size-4 text-emerald-600" /> Check a job offer
            </Link>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Active workers" value={totalActive.toLocaleString("en-IN")} hint="Across 6 demo PIN codes" />
          <Stat label="Subsidy disbursed" value={inr(totalPayout)} hint="Financial year to date (demo)" />
          <Stat label="Offers screened" value="18,402" hint="By the AI scam checker" />
          <Stat label="Avg scam-risk index" value={`${avgRisk}/100`} hint="Lower is safer" />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-foreground">Choose your portal</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Four working views, each with realistic demo data.
          </p>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {PORTALS.map((p) => (
              <Link
                key={p.to}
                to={p.to}
                className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-md"
              >
                <div className={`inline-flex size-11 items-center justify-center rounded-xl ${p.accent}`}>
                  <p.icon className="size-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{p.label}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {p.points.map((pt) => (
                    <li
                      key={pt}
                      className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {pt}
                    </li>
                  ))}
                </ul>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-emerald-600">
                  Open dashboard
                  <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-10">
          <DemoBanner />
        </div>
      </div>
    </main>
  );
}
