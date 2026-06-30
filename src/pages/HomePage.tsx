import { Link } from "react-router"
import { Radar, SlidersHorizontal, Activity, BrainCircuit, ArrowRight, ShieldCheck, Sparkles } from "lucide-react"
import { Card, buttonVariants } from "@heroui/react"
import { cn } from "@/lib/utils"
import { Eyebrow } from "@/components/common/Eyebrow"
import { StatCard } from "@/components/common/StatCard"
import { useRiskStore } from "@/store/useRiskStore"

const pillars = [
  {
    index: "01",
    name: "Regime Detection",
    icon: Radar,
    description:
      "ML-based regime classification from macro and market data, with per-regime model selection — so the system recognises a rate cycle or volatility shock before it shows up in performance.",
  },
  {
    index: "02",
    name: "Dynamic Allocation",
    icon: SlidersHorizontal,
    description:
      "Portfolio optimisation with regime-conditioned expected returns and risk covariances, so allocation shifts with the market regime instead of relying on a single static model.",
  },
  {
    index: "03",
    name: "Stress + Scenario Engine",
    icon: Activity,
    description:
      "Monte Carlo, historical-stress, and tail-event simulation for every fund, run weekly — moving stress testing from a monthly chore to a continuous discipline.",
  },
  {
    index: "04",
    name: "Risk Memory",
    icon: BrainCircuit,
    description:
      "Every stress event, every drawdown, every recovery is captured and learned from — a Compounding Memory layer that makes the risk function structurally more sophisticated with each market cycle.",
  },
]

const stats = [
  { value: "15–20%", label: "Better downside protection, target within 18 months" },
  { value: "10 wks", label: "POC duration, Discovery → Demo → Pilot" },
  { value: "14 wks", label: "Production rollout, post-POC acceptance" },
]

const ctaButtonClass = cn(
  buttonVariants({ variant: "primary", size: "lg" }),
  "rounded-full"
)

const landingLabels: Record<string, string> = {
  "/dashboard": "Go to Dashboard",
  "/workbench": "Go to Workbench",
  "/auditor": "Go to Auditor Console",
  "/admin": "Go to Admin Console",
}

export function HomePage() {
  const currentUser = useRiskStore((s) => s.currentUser)
  const hasDashboardAccess = currentUser?.permissions?.includes("/dashboard") ?? false
  const ctaHref = currentUser ? (hasDashboardAccess ? "/dashboard" : currentUser.landingPath) : "/login"
  const ctaLabel = currentUser
    ? hasDashboardAccess
      ? "Go to Dashboard"
      : landingLabels[currentUser.landingPath] ?? "Go to Dashboard"
    : "Enter the POC"

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-[#ececf1] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-12">
          <div className="flex items-center gap-2.5 text-lg font-semibold tracking-tight">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              A
            </div>
            <span className="text-zinc-900">Ascend Risk AI</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="#pillars"
              className={cn(buttonVariants({ variant: "secondary" }), "rounded-full")}
            >
              Features
            </a>
            <Link to={ctaHref} className={cn(buttonVariants({ variant: "primary" }), "rounded-full")}>
              {currentUser ? "Go to Dashboard" : "Sign In"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-24">
        <div className="max-w-3xl">
          <Eyebrow icon={Sparkles}>Hypothesis HYP-AM-002 · BFSI / Asset Management</Eyebrow>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight leading-tight text-zinc-900 sm:text-5xl">
            Intelligent Portfolio Construction <br className="hidden sm:block" />
            and Risk Management
          </h1>
          <p className="mt-5 text-base leading-relaxed text-zinc-600 sm:text-lg">
            Ascend Capital AMC's fund-construction process relies on static allocation models —
            regime changes like rate cycles and volatility shocks cause 12–18 month underperformance
            episodes. Ascend Risk AI replaces that static model with four AI-native pillars that
            detect regime shifts, reallocate dynamically, stress-test continuously, and compound
            what they learn into a durable institutional memory.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={ctaHref} className={ctaButtonClass}>
              {ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <StatCard key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </section>

      <section id="pillars" className="mx-auto max-w-7xl px-6 pb-20 md:px-12">
        <div className="mb-8 flex flex-col gap-2">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">The Four Solution Pillars</h2>
          <p className="text-sm text-zinc-500">
            Each pillar is an independent workstream, unified by a shared Compounding Memory layer.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {pillars.map((pillar) => (
            <Card
              key={pillar.name}
              variant="transparent"
              className="surface-card flex flex-col gap-4 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-indigo-100 bg-indigo-50">
                  <pillar.icon className="h-5 w-5 text-indigo-600" />
                </div>
                <span className="nums text-xs font-semibold text-zinc-300">{pillar.index}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-zinc-900">{pillar.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{pillar.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 md:px-12">
        <Card variant="transparent" className="surface-card flex flex-col gap-4 p-6 sm:flex-row sm:items-center md:p-8">
          <div className="shrink-0 rounded-lg border border-emerald-100 bg-emerald-50 p-3">
            <ShieldCheck className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold tracking-tight text-zinc-900">Human-in-the-loop, by design</h3>
            <p className="mt-1 text-sm text-zinc-500">
              High-value, high-risk, and low-confidence cases always route to human review. AI
              proposes — a person decides, with full rationale, model version, and audit trail
              attached to every decision.
            </p>
          </div>
        </Card>
      </section>

      <footer className="border-t border-[#ececf1] py-6">
        <div className="mx-auto max-w-7xl px-6 text-xs text-zinc-400 md:px-12">
          &copy; Ascend Capital AMC &middot; For POC demonstration purposes only &middot; Confidential.
          All data, users, and decisions shown in this console are simulated for demonstration — no
          live portfolio or market data is connected.
        </div>
      </footer>
    </div>
  )
}
