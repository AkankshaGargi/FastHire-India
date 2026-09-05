import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DemoBanner, PageHeader, Stat } from "@/components/DemoBanner";
import { VENDOR_MEMOS, inr, type Memo } from "@/lib/demo-data";

export const Route = createFileRoute("/vendor")({
  head: () => ({
    meta: [
      { title: "Local Vendor Registry — Gig Memos & Subsidy Split | GovTrust AI" },
      {
        name: "description",
        content:
          "Neighbourhood shops post short gig memos, fill shifts with verified students and see the Gov-Subsidy Compensation Split on every rupee of wage cost.",
      },
      { property: "og:title", content: "Local Vendor Registry — Gig Memos & Subsidy Split" },
      {
        property: "og:description",
        content: "Post gig memos and preview your government subsidy compensation split instantly.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VendorRegistry,
});

function VendorRegistry() {
  const [memos, setMemos] = useState<Memo[]>(VENDOR_MEMOS);
  const [role, setRole] = useState("");
  const [slots, setSlots] = useState(2);
  const [pay, setPay] = useState(900);
  const [subsidy, setSubsidy] = useState(15);

  const vendorShare = Math.round(pay * (1 - subsidy / 100));
  const govShare = pay - vendorShare;

  const openSlots = memos.reduce((s, m) => s + (m.slots - m.filled), 0);
  const committed = memos.reduce((s, m) => s + m.filled * m.payPerShift, 0);
  const subsidyValue = memos.reduce(
    (s, m) => s + Math.round(m.filled * m.payPerShift * (m.subsidyPct / 100)),
    0,
  );

  function post() {
    if (!role.trim()) return;
    setMemos((m) => [
      {
        id: "GM-" + Math.floor(340 + Math.random() * 60),
        role: role.trim(),
        slots,
        filled: 0,
        payPerShift: pay,
        subsidyPct: subsidy,
        status: "Open",
        posted: "Just now",
      },
      ...m,
    ]);
    setRole("");
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <PageHeader
          eyebrow="Local Vendor Registry"
          title="Post gig memos, share the wage bill with the scheme"
          subtitle="Sharma Hardware Stores · GSTIN 07AACFS9012K1Z3 (simulated registry record)"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Live memos" value={String(memos.filter((m) => m.status === "Open").length)} />
          <Stat label="Open slots" value={String(openSlots)} hint="Awaiting student applicants" />
          <Stat label="Wage commitment" value={inr(committed)} hint="Filled shifts this cycle" />
          <Stat label="Subsidy offset" value={inr(subsidyValue)} hint="Reimbursed by scheme (demo)" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">Post a gig memo</h2>
            <div className="mt-4 space-y-4">
              <Field label="Role / task">
                <input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Evening billing desk support"
                  className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Slots">
                  <input
                    type="number"
                    min={1}
                    value={slots}
                    onChange={(e) => setSlots(Math.max(1, Number(e.target.value)))}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  />
                </Field>
                <Field label="Pay per shift (₹)">
                  <input
                    type="number"
                    min={100}
                    step={50}
                    value={pay}
                    onChange={(e) => setPay(Math.max(100, Number(e.target.value)))}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  />
                </Field>
              </div>
              <Field label={`Subsidy band — ${subsidy}%`}>
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={5}
                  value={subsidy}
                  onChange={(e) => setSubsidy(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </Field>

              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-sm font-semibold text-foreground">
                  Gov-Subsidy Compensation Split
                </p>
                <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-border">
                  <div
                    className="bg-sky-500"
                    style={{ width: `${100 - subsidy}%` }}
                    aria-label="Vendor share"
                  />
                  <div className="bg-emerald-500" style={{ width: `${subsidy}%` }} aria-label="Subsidy share" />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">You pay</p>
                    <p className="font-semibold text-sky-600">{inr(vendorShare)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Scheme reimburses</p>
                    <p className="font-semibold text-emerald-600">{inr(govShare)}</p>
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Per shift, for {slots} slot{slots > 1 ? "s" : ""} = {inr(vendorShare * slots)} out
                  of pocket.
                </p>
              </div>

              <button
                onClick={post}
                disabled={!role.trim()}
                className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                Publish gig memo
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">Your gig memos</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="pb-2 pr-3">Memo</th>
                    <th className="pb-2 pr-3">Filled</th>
                    <th className="pb-2 pr-3">Pay</th>
                    <th className="pb-2 pr-3">Split</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {memos.map((m) => (
                    <tr key={m.id}>
                      <td className="py-3 pr-3">
                        <p className="font-medium text-foreground">{m.role}</p>
                        <p className="text-xs text-muted-foreground">
                          {m.id} · {m.posted}
                        </p>
                      </td>
                      <td className="py-3 pr-3 text-muted-foreground">
                        {m.filled}/{m.slots}
                      </td>
                      <td className="py-3 pr-3 text-foreground">{inr(m.payPerShift)}</td>
                      <td className="py-3 pr-3 text-xs">
                        <span className="text-sky-600">
                          {inr(Math.round(m.payPerShift * (1 - m.subsidyPct / 100)))}
                        </span>{" "}
                        /{" "}
                        <span className="text-emerald-600">
                          {inr(Math.round(m.payPerShift * (m.subsidyPct / 100)))}
                        </span>
                      </td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            m.status === "Open"
                              ? "bg-emerald-500/10 text-emerald-700"
                              : m.status === "Filled"
                                ? "bg-sky-500/10 text-sky-700"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="mt-8">
          <DemoBanner>
            Subsidy bands, reimbursements and vendor registry details are illustrative. No claim is
            filed with any government scheme from this prototype.
          </DemoBanner>
        </div>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
