import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { DemoBanner, PageHeader, Stat } from "@/components/DemoBanner";
import { PIN_METRICS, PAYOUT_TREND, SCAM_CATEGORIES, inr } from "@/lib/demo-data";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title: "Government Audit Desk — PIN-Code Employment & Scam Risk | GovTrust AI" },
      {
        name: "description",
        content:
          "Live-style dashboard of PIN-code employment metrics, monthly subsidy payouts and scam-risk analytics for policy and audit teams — simulated demo data.",
      },
      { property: "og:title", content: "Government Audit Desk — Employment & Scam Risk" },
      {
        property: "og:description",
        content: "PIN-code employment metrics, subsidy payouts and scam-risk charts for auditors.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuditDesk;
});

const COLORS = ["#ef4444", "#f59e0b", "#6366f1", "#10b981"];

function AuditDesk() {
  const [rows, setRows] = useState(PIN_METRICS);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setRows((prev) =>
        prev.map((r) => ({
          ...r,
          active: Math.max(300, r.active + Math.round((Math.random() - 0.45) * 14)),
          scamRisk: Math.min(95, Math.max(5, r.scamRisk + Math.round((Math.random() - 0.5) * 3))),
        })),
      );
      setTick((v) => v + 1);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const totalActive = rows.reduce((s, r) => s + r.active, 0);
  const totalPayout = rows.reduce((s, r) => s + r.payout, 0);
  const highRisk = rows.filter((r) => r.scamRisk >= 30).length;

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <PageHeader
          eyebrow="Government Audit Desk"
          title="PIN-code employment, payouts and scam risk"
          subtitle="Refreshing every 3 seconds to mimic a live feed. Nothing here is connected to an official system."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Active workers" value={totalActive.toLocaleString("en-IN")} hint={`Feed updates: ${tick}`} />
          <Stat label="Subsidy released" value={inr(totalPayout)} hint="FY to date (demo)" />
          <Stat label="High-risk PIN codes" value={String(highRisk)} hint="Risk index ≥ 30" />
          <Stat label="Cases flagged" value="1,284" hint="Referred for review" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">Subsidy payouts vs flagged cases</h2>
            <p className="text-xs text-muted-foreground">₹ lakh per month / flagged case count</p>
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={PAYOUT_TREND}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="var(--color-muted-foreground)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="var(--color-muted-foreground)" width={34} />
                  <Tooltip />
                  <Legend />
                  <Line dataKey="payout" name="Payout (₹L)" stroke="#10b981" strokeWidth={2} />
                  <Line dataKey="flagged" name="Flagged cases" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">Scam reports by category</h2>
            <p className="text-xs text-muted-foreground">Share of flagged offers (demo)</p>
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={SCAM_CATEGORIES}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {SCAM_CATEGORIES.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => `${v}%`} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Scam-risk index by PIN code</h2>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rows}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="pin" tick={{ fontSize: 12 }} stroke="var(--color-muted-foreground)" />
                <YAxis tick={{ fontSize: 12 }} stroke="var(--color-muted-foreground)" width={32} />
                <Tooltip />
                <Bar dataKey="scamRisk" name="Risk index" radius={[6, 6, 0, 0]}>
                  {rows.map((r) => (
                    <Cell key={r.pin} fill={r.scamRisk >= 30 ? "#ef4444" : r.scamRisk >= 20 ? "#f59e0b" : "#10b981"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">PIN-code register</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="pb-2 pr-3">PIN</th>
                  <th className="pb-2 pr-3">City</th>
                  <th className="pb-2 pr-3">Active workers</th>
                  <th className="pb-2 pr-3">Subsidy paid</th>
                  <th className="pb-2">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((r) => (
                  <tr key={r.pin}>
                    <td className="py-3 pr-3 font-medium text-foreground">{r.pin}</td>
                    <td className="py-3 pr-3 text-muted-foreground">{r.city}</td>
                    <td className="py-3 pr-3 text-foreground">{r.active.toLocaleString("en-IN")}</td>
                    <td className="py-3 pr-3 text-foreground">{inr(r.payout)}</td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          r.scamRisk >= 30
                            ? "bg-rose-500/10 text-rose-600"
                            : r.scamRisk >= 20
                              ? "bg-amber-500/10 text-amber-600"
                              : "bg-emerald-500/10 text-emerald-700"
                        }`}
                      >
                        {r.scamRisk}/100
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="mt-8">
          <DemoBanner>
            Employment counts, subsidy payouts and scam statistics are randomly generated demo
            values. They do not represent any official government dataset.
          </DemoBanner>
        </div>
      </div>
    </main>
  );
}
