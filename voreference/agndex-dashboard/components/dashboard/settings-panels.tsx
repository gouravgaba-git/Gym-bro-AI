"use client"

import { useState } from "react"
import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
        checked ? "bg-foreground" : "bg-secondary",
      )}
    >
      <span
        className={cn(
          "inline-block size-5 rounded-full bg-background shadow-sm transition-transform",
          checked ? "translate-x-5.5" : "translate-x-0.5",
        )}
      />
    </button>
  )
}

const themeOptions: { value: "system" | "light" | "dark"; label: string; icon: LucideIcon }[] = [
  { value: "system", label: "System", icon: Monitor },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
]

const units = ["Imperial (lb)", "Metric (kg)"] as const

export function AppearancePanel() {
  const { theme, setTheme } = useTheme()
  const [unit, setUnit] = useState<(typeof units)[number]>("Imperial (lb)")

  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-5 py-4 md:px-6">
        <h2 className="font-medium tracking-tight">Appearance</h2>
        <p className="text-sm text-muted-foreground">Customize how Gym Bro looks and measures.</p>
      </div>

      <div className="flex flex-col gap-6 px-5 py-5 md:px-6">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium tracking-tight">Theme</p>
          <div className="grid grid-cols-3 gap-2">
            {themeOptions.map(({ value, label, icon: Icon }) => {
              const active = theme === value
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTheme(value)}
                  aria-pressed={active}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors",
                    active
                      ? "border-foreground bg-secondary/60"
                      : "border-border hover:border-foreground/30 hover:bg-secondary/30",
                  )}
                >
                  <Icon className="size-5" />
                  <span className="text-sm font-medium tracking-tight">{label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium tracking-tight">Units</p>
          <div className="grid grid-cols-1 gap-1 rounded-lg border border-border bg-secondary/40 p-1 sm:grid-cols-2">
            {units.map((u) => {
              const active = unit === u
              return (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnit(u)}
                  aria-pressed={active}
                  className={cn(
                    "rounded-md px-4 py-2.5 text-sm font-medium tracking-tight transition-colors",
                    active
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {u}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

const notificationDefaults = [
  { key: "workout", label: "Workout reminders", description: "Get a nudge on your scheduled training days.", on: true },
  { key: "streak", label: "Streak alerts", description: "Warn me before I lose my active streak.", on: true },
  { key: "progress", label: "Weekly progress report", description: "A summary of volume and PRs every Sunday.", on: false },
  { key: "product", label: "Product updates", description: "New features and coaching tips from Gym Bro.", on: false },
]

export function NotificationsPanel() {
  const [prefs, setPrefs] = useState(
    Object.fromEntries(notificationDefaults.map((n) => [n.key, n.on])),
  )

  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-5 py-4 md:px-6">
        <h2 className="font-medium tracking-tight">Notifications</h2>
        <p className="text-sm text-muted-foreground">Choose what Gym Bro sends you.</p>
      </div>
      <ul className="divide-y divide-border">
        {notificationDefaults.map((n) => (
          <li key={n.key} className="flex items-center justify-between gap-4 px-5 py-4 md:px-6">
            <div>
              <p className="text-sm font-medium tracking-tight">{n.label}</p>
              <p className="text-sm text-muted-foreground text-pretty">{n.description}</p>
            </div>
            <Toggle
              label={n.label}
              checked={prefs[n.key]}
              onChange={(v) => setPrefs((p) => ({ ...p, [n.key]: v }))}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
