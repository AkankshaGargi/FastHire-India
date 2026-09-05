import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MapPin, Clock, ShieldCheck, Search } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { DemoBanner, PageHeader, Stat } from "@/components/DemoBanner";
import { MICRO_JOBS, MY_SHIFTS, EARNINGS_TREND, inr, type MicroJob } from "@/lib/demo-data";

export const Route = createFileRoute("/student")({
  head: () => ({
    meta: [
      { title: "Student Hub — Local Micro-Jobs & Earnings | GovTrust AI" },
      {
        name: "description",
        content:
          "Browse flexible verified micro-jobs by PIN code, apply instantly and track shifts, subsidy top-ups and total earnings in one student dashboard.",
      },
      { property: "og:title", content: "Student Hub — Local Micro-Jobs & Earnings" },
      {
        property: "og:description",
        content: "Flexible verified micro-jobs, one-tap apply and a live earnings tracker for Indian students.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudentHub,
});

function StudentHub() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<MicroJob | null>(null);
  const [applied, setApplied] = useState<string[]>([]);

  const jobs = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return MICRO_JOBS;
    return MICRO_JOBS.filter((j) =>
      [j.title, j.employer, j.area, j.pin, ...j.tags].join(" ").toLowerCase().includes(t),
    );
  }, [q]);

  const paid = MY_SHIFTS.filter((s) => s.status === "Paid");
  const totalEarned = paid.reduce((s, x) => s + x.gross + x.subsidy, 0);
  const pending = MY_SHIFTS.filter((s) => s.status !== "Paid").reduce(
    (s, x) => s + x.gross + x.subsidy,
    0,
  );
  const hours = MY_SHIFTS.reduce((s, x) => s + x.hours, 0);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <PageHeader
          eyebrow="Student Hub"
          title="Your local work, earnings and safety checks"
          subtitle="Flexible micro-jobs near you, applications you've sent, and every rupee tracked including government subsidy top-ups."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Earned (paid out)" value={inr(totalEarned)} hint={`${paid.length} settled shifts`} />
          <Stat label="In the pipeline" value={inr(pending)} hint="Processing + pending shifts" />
          <Stat label="Hours worked" value={`${hours} hrs`} hint="This month" />
          <Stat label="Applications sent" value={String(applied.length)} hint="This session" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-foreground">Micro-jobs near you</h2>
              <Link
                to="/verify"
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-600/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-700"
              >
                <ShieldCheck className="size-4" /> Analyze &amp; Verify a job offer
              </Link>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-xl border border-input px-3">
              <Search className="size-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by role, shop, area or PIN code…"
                className="w-full bg-transparent py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>

            <ul className="mt-4 space-y-3">
              {jobs.map((j) => (
                <li
                  key={j.id}
                  className="rounded-xl border border-border p-4 transition hover:border-emerald-500/40"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{j.title}</p>
                      <p className="text-sm text-muted-foreground">{j.employer}</p>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      Trust {j.trust}/100
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3.5" /> {j.area} · {j.pin}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3.5" /> {j.hours}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">
                      {inr(j.pay)} <span className="font-normal text-muted-foreground">{j.unit}</span>
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelected(j)}
                        className="rounded-lg border border-input px-3 py-2 text-xs font-medium text-foreground transition hover:bg-accent"
                      >
                        View details
                      </button>
                      <button
                        onClick={() => setApplied((a) => (a.includes(j.id) ? a : [...a, j.id]))}
                        disabled={applied.includes(j.id)}
                        className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                      >
                        {applied.includes(j.id) ? "Applied ✓" : "Apply"}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
              {jobs.length === 0 && (
                <li className="py-8 text-center text-sm text-muted-foreground">
                  No demo jobs match “{q}”.
                </li>
              )}
            </ul>
          </section>

          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground">Earnings trend</h2>
              <p className="text-xs text-muted-foreground">Last 6 weeks (demo)</p>
              <div className="mt-4 h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={EARNINGS_TREND}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="var(--color-muted-foreground)" />
                    <YAxis tick={{ fontSize: 12 }} stroke="var(--color-muted-foreground)" width={44} />
                    <Tooltip formatter={(v: number) => inr(v)} />
                    <Area dataKey="earnings" stroke="#059669" fill="#05966933" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground">Shift & payment tracker</h2>
              <ul className="mt-3 divide-y divide-border">
                {MY_SHIFTS.map((s) => (
                  <li key={s.id} className="flex items-start justify-between gap-3 py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{s.job}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.date} · {s.hours} hrs · subsidy {inr(s.subsidy)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">{inr(s.gross + s.subsidy)}</p>
                      <span
                        className={`text-xs font-medium ${
                          s.status === "Paid"
                            ? "text-emerald-600"
                            : s.status === "Processing"
                              ? "text-amber-600"
                              : "text-muted-foreground"
                        }`}
                      >
                        {s.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        <div className="mt-8">
          <DemoBanner>
            Jobs, employers, trust scores and earnings on this page are illustrative examples. GSTIN
            values are not verified against the live GST portal.
          </DemoBanner>
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 md:items-center"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs font-medium text-muted-foreground">{selected.id}</p>
            <h3 className="mt-1 text-xl font-semibold text-foreground">{selected.title}</h3>
            <p className="text-sm text-muted-foreground">{selected.employer}</p>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <Row label="Pay" value={`${inr(selected.pay)} ${selected.unit}`} />
              <Row label="Timing" value={selected.hours} />
              <Row label="Location" value={`${selected.area} (${selected.pin})`} />
              <Row label="GSTIN (simulated)" value={selected.gstin} />
              <Row label="Trust score" value={`${selected.trust}/100`} />
              <Row label="Advance fee" value="None requested" />
            </dl>

            <p className="mt-4 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
              This employer record is demo data. Run the offer through Analyze &amp; Verify before
              sharing documents.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setApplied((a) => (a.includes(selected.id) ? a : [...a, selected.id]));
                  setSelected(null);
                }}
                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Apply now
              </button>
              <Link
                to="/verify"
                className="rounded-xl border border-input px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
              >
                Verify this offer
              </Link>
              <button
                onClick={() => setSelected(null)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}
