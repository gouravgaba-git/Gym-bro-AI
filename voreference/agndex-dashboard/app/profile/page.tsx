import { Activity, Dumbbell, Flame, Trophy } from "lucide-react"
import { PageHeader } from "@/components/dashboard/page-header"
import { currentUser } from "@/lib/nav-data"

const stats = [
  { label: "Workouts logged", value: "184", icon: Dumbbell },
  { label: "Current streak", value: "12 days", icon: Flame },
  { label: "Personal records", value: "27", icon: Trophy },
  { label: "Weekly volume", value: "48.2k lb", icon: Activity },
]

const details = [
  { label: "Full name", value: "Alex Carter" },
  { label: "Email", value: "alex@gymbro.app" },
  { label: "Primary goal", value: "Muscle Gain" },
  { label: "Experience", value: "Intermediate" },
  { label: "Preferred split", value: "Upper / Lower" },
  { label: "Training days", value: "4 per week" },
]

export default function ProfilePage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
      <PageHeader title="My Profile" description="Your athlete details and training history." />

      <section className="rounded-xl border border-border bg-card p-5 md:p-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-secondary text-xl font-semibold tracking-tight text-foreground">
            {currentUser.initials}
          </span>
          <div className="text-center sm:text-left">
            <h2 className="text-lg font-semibold tracking-tight">{currentUser.name}</h2>
            <p className="text-sm text-muted-foreground">{currentUser.email}</p>
            <span className="mt-2 inline-block rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {currentUser.plan}
            </span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="rounded-xl border border-border bg-card p-4">
              <Icon className="size-4 text-muted-foreground" />
              <p className="mt-3 text-2xl font-semibold tracking-tight">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          )
        })}
      </div>

      <section className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4 md:px-6">
          <h2 className="font-medium tracking-tight">Training Details</h2>
        </div>
        <dl className="divide-y divide-border">
          {details.map((d) => (
            <div
              key={d.label}
              className="flex items-center justify-between gap-4 px-5 py-3.5 md:px-6"
            >
              <dt className="text-sm text-muted-foreground">{d.label}</dt>
              <dd className="text-sm font-medium tracking-tight">{d.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}
