import { useState } from "react"
import { Navigate, useNavigate } from "react-router"
import { ShieldCheck, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRiskStore, type AuthUser } from "@/store/useRiskStore"

interface Persona extends AuthUser {
  password: string
}

export const personas: Persona[] = [
  {
    username: "sponsor",
    password: "sponsor",
    name: "CIO, Ascend Capital",
    role: "Executive Sponsor",
    initials: "ES",
    landingPath: "/dashboard",
    permissions: ["/dashboard"],
  },
  {
    username: "analyst",
    password: "analyst",
    name: "Risk Analyst",
    role: "Operational User",
    initials: "RA",
    landingPath: "/workbench",
    permissions: ["/workbench"],
  },
  {
    username: "auditor",
    password: "auditor",
    name: "Compliance Auditor",
    role: "Internal Auditor",
    initials: "CA",
    landingPath: "/auditor",
    permissions: ["/auditor"],
  },
  {
    username: "itadmin",
    password: "itadmin",
    name: "Platform Admin",
    role: "IT & Platform",
    initials: "PA",
    landingPath: "/admin",
    permissions: ["/dashboard", "/workbench", "/auditor", "/admin"],
  },
]

export function LoginPage() {
  const navigate = useNavigate()
  const currentUser = useRiskStore((s) => s.currentUser)
  const login = useRiskStore((s) => s.login)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (currentUser) {
    return <Navigate to={currentUser.landingPath} replace />
  }

  const fillDemo = (persona: Persona) => {
    setUsername(persona.username)
    setPassword(persona.password)
    setError("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const persona = personas.find(
      (p) => p.username === username.trim() && p.password === password
    )
    if (!persona) {
      setError("Invalid username or password.")
      return
    }

    setIsSubmitting(true)
    login({
      username: persona.username,
      name: persona.name,
      role: persona.role,
      initials: persona.initials,
      landingPath: persona.landingPath,
      permissions: persona.permissions,
    })
    navigate(persona.landingPath)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 sm:p-6">
      <div className="w-full max-w-md rounded-2xl bg-surface p-5 sm:p-8 shadow-lg">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#6366f1] text-white shadow-sm">
            <ShieldCheck size={20} />
          </div>
          <div className="leading-tight">
            <div className="text-base font-semibold tracking-tight text-slate-900">Ascend Risk AI</div>
            <div className="text-sm text-slate-400">Risk Intelligence Platform</div>
          </div>
        </div>

        <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">Sign in</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Enter your credentials or pick a demo role below.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5" noValidate>
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-slate-700">
              Username
            </label>
            <Input
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="sponsor, analyst, auditor..."
              className="h-12 rounded-xl border-slate-200 bg-slate-50 px-4"
              autoComplete="username"
              required
              aria-invalid={Boolean(error)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-12 rounded-xl border-slate-200 bg-slate-50 px-4 pr-11"
                autoComplete="current-password"
                required
                aria-invalid={Boolean(error)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="inline-flex items-center gap-1.5 rounded-md border border-rose-300 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-600 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-400">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 rounded-xl bg-[#6366f1] hover:bg-[#5558e0] text-base font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <div className="mt-8 border-t hairline pt-6">
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Demo Roles
          </span>

          <div className="mt-3 grid grid-cols-2 gap-2.5">
            {personas.map((persona) => (
              <button
                key={persona.username}
                type="button"
                onClick={() => fillDemo(persona)}
                className={cn(
                  "rounded-full bg-slate-100 px-4 py-2.5 text-center text-sm font-medium text-[#4f46e5]",
                  "hover:bg-slate-200"
                )}
              >
                {persona.role}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
