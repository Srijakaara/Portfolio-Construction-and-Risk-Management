import { useNavigate } from "react-router"
import { ArrowRight, SlidersHorizontal, Database, BrainCircuit, Settings, Users, Cpu, Plug } from "lucide-react"
import { Card } from "@heroui/react"
import { Header } from "@/components/common/Header"
import { StatCard } from "@/components/common/StatCard"
import { personas } from "@/pages/LoginPage"
import { MODELS } from "@/pages/admin/ModelsPage"
import { INTEGRATIONS } from "@/pages/admin/IntegrationsPage"
import { INITIAL_RULES } from "@/pages/admin/AutonomyPage"

const STATS = [
  { label: "Active Users", value: personas.length, icon: Users, tint: "indigo" as const },
  { label: "AI Models", value: MODELS.length, icon: Cpu, tint: "indigo" as const },
  { label: "Integrations", value: INTEGRATIONS.length, icon: Plug, tint: "amber" as const },
  { label: "Autonomy Rules", value: INITIAL_RULES.length, icon: SlidersHorizontal, tint: "indigo" as const },
]

const SECTIONS = [
  {
    path: "/admin/autonomy",
    title: "Autonomy Envelope",
    description: "Configure per-pillar confidence thresholds that govern when AI proposals resolve without review.",
    icon: SlidersHorizontal,
  },
  {
    path: "/admin/integrations",
    title: "Integrations",
    description: "Live health for every market data, risk, identity, and storage system the platform depends on.",
    icon: Database,
  },
  {
    path: "/admin/models",
    title: "AI Model Registry",
    description: "Governance record for every model — accuracy, training provenance, and bias reporting.",
    icon: BrainCircuit,
  },
]

export function AdminPage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-7 px-8 py-6">
      <Header
        title="Admin Console"
        subtitle="Manage AI autonomy, system integrations, and model governance."
        actions={
          <span className="flex items-center gap-1.5 rounded-md border hairline bg-white px-2.5 py-1.5 text-[12px] font-medium text-slate-500">
            <Settings className="h-3.5 w-3.5" />
            Admin only
          </span>
        }
      />

      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        {STATS.map((stat) => (
          <StatCard
            key={stat.label}
            value={<span className="nums">{stat.value}</span>}
            label={stat.label}
            icon={stat.icon}
            tint={stat.tint}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {SECTIONS.map((section) => (
          <Card
            key={section.path}
            variant="transparent"
            className="surface-card flex cursor-pointer flex-col gap-4 p-6 hover:bg-slate-50/60"
            onClick={() => navigate(section.path)}
          >
            <div className="flex items-center justify-between">
              <div className="grid h-9 w-9 place-items-center rounded bg-indigo-50">
                <section.icon className="h-4 w-4 text-indigo-600" />
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-slate-900">{section.title}</h3>
              <p className="mt-1 text-[12.5px] leading-relaxed text-slate-500">{section.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
