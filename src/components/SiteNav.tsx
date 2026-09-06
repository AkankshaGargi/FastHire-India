import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, ShieldCheck } from "lucide-react";

const LINKS = [
  { to: "/", label: "Dashboard" },
  { to: "/student", label: "Student Hub" },
  { to: "/vendor", label: "Vendor Registry" },
  { to: "/enterprise", label: "Enterprise" },
  { to: "/audit", label: "Audit Desk" },
  { to: "/verify", label: "Verify a Job" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link to="/" className="flex items-center gap-2 font-bold text-foreground">
          <ShieldCheck className="size-5 text-emerald-600" />
          Fast<span className="text-emerald-600">Hire</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "bg-emerald-500/10 text-emerald-700" }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg border border-input p-2 text-foreground md:hidden"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border px-5 py-2 md:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "text-emerald-700" }}
              className="block rounded-lg px-2 py-2.5 text-sm font-medium text-muted-foreground"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
