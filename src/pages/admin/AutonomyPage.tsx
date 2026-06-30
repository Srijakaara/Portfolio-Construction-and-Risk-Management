import { useState } from "react"
import { useNavigate } from "react-router"
import { ArrowLeft, Info, Save, Check } from "lucide-react"
import { Card, Chip } from "@heroui/react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/common/Header"
import { Toggle } from "@/components/common/Toggle"
import { cn } from "@/lib/utils"
import type { DecisionEntity } from "@/store/useRiskStore"

interface AutonomyRule {
  id: string
  pillar: DecisionEntity["pillar"]
  caseType: string
  band: string
  description: string
  threshold: number
  autoApprove: boolean
}

export const INITIAL_RULES: AutonomyRule[] = [
  {
    id: "rule-regime",
    pillar: "Regime Detection",
    caseType: "Regime shift flags",
    band: "Standard",
    description: "Auto-approve regime classifier outputs above the confidence threshold below.",
    threshold: 92,
    autoApprove: true,
  },
  {
    id: "rule-allocation",
    pillar: "Dynamic Allocation",
    caseType: "Allocation rebalances",
    band: "High Value",
    description: "High-value rebalances always route to a human reviewer regardless of confidence.",
    threshold: 95,
    autoApprove: false,
  },
  {
    id: "rule-stress",
    pillar: "Stress Engine",
    caseType: "Stress test triggers",
    band: "Low Confidence",
    description: "Auto-approve only when the weekly stress simulation confidence clears this bar.",
    threshold: 85,
    autoApprove: true,
  },
  {
    id: "rule-memory",
    pillar: "Risk Memory",
    caseType: "Precedent matches",
    band: "Cross-Pillar",
    description: "Auto-approve historical precedent matches that exceed the threshold below.",
    threshold: 90,
    autoApprove: true,
  },
]

export function AutonomyPage() {
  const navigate = useNavigate()
  const [savedRules, setSavedRules] = useState(INITIAL_RULES)
  const [rules, setRules] = useState(INITIAL_RULES)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const dirty = JSON.stringify(rules) !== JSON.stringify(savedRules)

  const updateRule = (id: string, patch: Partial<AutonomyRule>) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
    setSaved(false)
  }

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSavedRules(rules)
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }, 600)
  }

  return (
    <div className="space-y-7 px-8 py-6">
      <Header
        title="Autonomy Envelope"
        subtitle="Configure when AI proposals can resolve without human sign-off."
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate("/admin")}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        }
      />

      <Card variant="transparent" className="flex items-start gap-3 rounded border border-indigo-100 bg-[#eef2ff] p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#6366f1]" />
        <div>
          <p className="text-[13px] font-medium text-slate-800">What is the Autonomy Envelope?</p>
          <p className="mt-0.5 text-[12.5px] text-slate-500">
            Each rule defines the confidence bar a pillar's AI proposals must clear to resolve automatically. Below
            the bar — or with auto-approve switched off — every proposal routes to a human reviewer in the Workbench.
          </p>
        </div>
      </Card>

      <Card variant="transparent" className="surface-card p-0">
        <div className="flex items-center justify-between px-6 py-5">
          <h3 className="text-[15px] font-semibold text-slate-900">Autonomy Rules</h3>
          {dirty ? (
            <Button size="sm" onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Save className="h-4 w-4" />
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          ) : saved ? (
            <Chip color="success" variant="soft" className="rounded-full px-2.5 text-[11px] font-medium">
              <Check className="h-3 w-3" /> Saved
            </Chip>
          ) : null}
        </div>

        <div className="border-t hairline">
          {rules.map((rule) => (
            <div key={rule.id} className="flex flex-col gap-4 border-b hairline px-6 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="mt-1.5 block h-2 w-2 shrink-0 rounded-full bg-slate-400" />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[13px] font-medium text-slate-800">{rule.caseType}</span>
                    <span className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                      {rule.band}
                    </span>
                  </div>
                  <p className="mt-0.5 max-w-md text-[12px] text-slate-400">{rule.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-5 sm:shrink-0">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-wide text-slate-400">
                    Confidence ≥ <span className="nums">{rule.threshold}%</span>
                  </span>
                  <input
                    type="range"
                    min={50}
                    max={100}
                    value={rule.threshold}
                    onChange={(e) => updateRule(rule.id, { threshold: Number(e.target.value) })}
                    disabled={!rule.autoApprove}
                    className="h-1.5 w-36 accent-indigo-600 disabled:opacity-40"
                  />
                </div>

                <div className="flex flex-col items-center gap-1">
                  <Toggle
                    checked={rule.autoApprove}
                    onToggle={() => updateRule(rule.id, { autoApprove: !rule.autoApprove })}
                    aria-label={`Toggle autonomy for ${rule.caseType}`}
                  />
                  <span className={cn("text-[10px] font-medium", rule.autoApprove ? "text-indigo-600" : "text-slate-400")}>
                    {rule.autoApprove ? "Auto" : "Manual"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <p className="text-[12px] text-slate-400">
        Changes take effect immediately for new decisions once saved, and every change to this envelope is recorded
        in the audit log with the editing admin's identity attached.
      </p>
    </div>
  )
}
