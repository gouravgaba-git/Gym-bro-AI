"use client"

import { useMemo, useState } from "react"
import {
  ArrowRight,
  Dumbbell,
  Flame,
  Info,
  RotateCcw,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

type Goal = "muscle" | "fatloss" | "strength"
type Level = "beginner" | "intermediate" | "advanced"

const goals: {
  id: Goal
  label: string
  icon: LucideIcon
  description: string
}[] = [
  {
    id: "muscle",
    label: "Muscle Gain",
    icon: Dumbbell,
    description: "Optimize for hypertrophy, volume, and clean muscle mass retention.",
  },
  {
    id: "fatloss",
    label: "Fat Loss",
    icon: Flame,
    description: "High energy output, circuit sets, and metabolic conditioning.",
  },
  {
    id: "strength",
    label: "Strength",
    icon: Zap,
    description: "Focus on low reps, heavy compound movements, and neural drive.",
  },
]

const levels: { id: Level; label: string }[] = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
]

const tips: Record<Level, string> = {
  beginner:
    "Full Body Locked: Beginners excel on 3–4 day full-body splits for maximum recovery, neural adaptation, and consistent progress.",
  intermediate:
    "Upper/Lower Recommended: You are ready for a 4-day upper/lower split to push frequency while keeping recovery in check.",
  advanced:
    "Push/Pull/Legs Unlocked: Advanced lifters thrive on a 5–6 day PPL split with targeted volume per muscle group.",
}

type PlanDay = { day: string; focus: string; detail: string }

function buildPlan(goal: Goal, level: Level): PlanDay[] {
  const intensity =
    goal === "strength" ? "3–5 reps @ heavy" : goal === "muscle" ? "8–12 reps @ moderate" : "12–20 reps @ light"

  if (level === "beginner") {
    return [
      { day: "Day 1", focus: "Full Body A", detail: `Squat, Bench, Row · ${intensity}` },
      { day: "Day 2", focus: "Rest / Mobility", detail: "Light cardio, stretching" },
      { day: "Day 3", focus: "Full Body B", detail: `Deadlift, Overhead Press, Pull-up · ${intensity}` },
      { day: "Day 4", focus: "Rest", detail: "Active recovery walk" },
      { day: "Day 5", focus: "Full Body C", detail: `Lunge, Incline Press, Lat Pulldown · ${intensity}` },
    ]
  }
  if (level === "intermediate") {
    return [
      { day: "Day 1", focus: "Upper Power", detail: `Bench, Row, Press · ${intensity}` },
      { day: "Day 2", focus: "Lower Power", detail: `Squat, RDL, Calves · ${intensity}` },
      { day: "Day 3", focus: "Rest", detail: "Mobility & core" },
      { day: "Day 4", focus: "Upper Hypertrophy", detail: `Incline DB, Cable Fly, Curls · ${intensity}` },
      { day: "Day 5", focus: "Lower Hypertrophy", detail: `Leg Press, Hamstring Curl, Abs · ${intensity}` },
    ]
  }
  return [
    { day: "Day 1", focus: "Push", detail: `Bench, OHP, Triceps · ${intensity}` },
    { day: "Day 2", focus: "Pull", detail: `Deadlift, Row, Biceps · ${intensity}` },
    { day: "Day 3", focus: "Legs", detail: `Squat, Leg Press, Calves · ${intensity}` },
    { day: "Day 4", focus: "Push", detail: `Incline, Lateral Raise · ${intensity}` },
    { day: "Day 5", focus: "Pull", detail: `Pull-up, Face Pull · ${intensity}` },
    { day: "Day 6", focus: "Legs", detail: `Front Squat, RDL · ${intensity}` },
  ]
}

function StepBadge({ n }: { n: number }) {
  return (
    <span className="flex size-5 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">
      {n}
    </span>
  )
}

export function WorkoutGenerator() {
  const [goal, setGoal] = useState<Goal>("muscle")
  const [level, setLevel] = useState<Level>("beginner")
  const [plan, setPlan] = useState<PlanDay[] | null>(null)

  const activeGoal = useMemo(() => goals.find((g) => g.id === goal)!, [goal])

  function handleGenerate() {
    setPlan(buildPlan(goal, level))
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-xl border border-border bg-card p-5 md:p-6">
        <div className="mb-4 flex items-center gap-2.5">
          <StepBadge n={1} />
          <h2 className="text-base font-medium tracking-tight">Choose Fitness Goal</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {goals.map((g) => {
            const Icon = g.icon
            const selected = goal === g.id
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setGoal(g.id)}
                aria-pressed={selected}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border p-5 text-center transition-colors",
                  selected
                    ? "border-foreground bg-secondary/60"
                    : "border-border bg-background hover:border-foreground/30 hover:bg-secondary/30",
                )}
              >
                <span
                  className={cn(
                    "flex size-10 items-center justify-center rounded-lg",
                    selected ? "bg-foreground text-background" : "bg-secondary text-foreground",
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <span className="font-medium tracking-tight">{g.label}</span>
                <span className="text-xs leading-relaxed text-muted-foreground text-pretty">
                  {g.description}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 md:p-6">
        <div className="mb-4 flex items-center gap-2.5">
          <StepBadge n={2} />
          <h2 className="text-base font-medium tracking-tight">Choose Experience Level</h2>
        </div>
        <div className="grid grid-cols-1 gap-1 rounded-lg border border-border bg-secondary/40 p-1 sm:grid-cols-3">
          {levels.map((l) => {
            const selected = level === l.id
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => setLevel(l.id)}
                aria-pressed={selected}
                className={cn(
                  "rounded-md px-4 py-2.5 text-sm font-medium tracking-tight transition-colors",
                  selected
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {l.label}
              </button>
            )
          })}
        </div>

        <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-border bg-secondary/30 px-4 py-3">
          <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{tips[level]}</p>
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleGenerate}
          className="group flex flex-1 items-center justify-center gap-2 rounded-lg bg-foreground px-5 py-3 text-sm font-semibold tracking-tight text-background transition-opacity hover:opacity-90"
        >
          <Sparkles className="size-4" />
          Generate Workout Plan
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </button>
        {plan ? (
          <button
            type="button"
            onClick={() => setPlan(null)}
            className="flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-5 py-3 text-sm font-medium tracking-tight text-foreground transition-colors hover:bg-secondary"
          >
            <RotateCcw className="size-4" />
            Reset
          </button>
        ) : null}
      </div>

      {plan ? (
        <section className="rounded-xl border border-border bg-card p-5 md:p-6">
          <div className="mb-5 flex flex-col gap-1 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-medium tracking-tight">Your {activeGoal.label} Plan</h2>
              <p className="text-sm text-muted-foreground capitalize">
                {level} · {plan.length}-day split
              </p>
            </div>
            <span className="mt-2 w-fit rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground sm:mt-0">
              AI generated
            </span>
          </div>
          <ul className="flex flex-col divide-y divide-border">
            {plan.map((d) => (
              <li key={d.day} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                <span className="w-14 shrink-0 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {d.day}
                </span>
                <div className="flex-1">
                  <p className="font-medium tracking-tight">{d.focus}</p>
                  <p className="text-sm text-muted-foreground">{d.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
