import { PageHeader } from "@/components/dashboard/page-header"
import { WorkoutGenerator } from "@/components/dashboard/workout-generator"

export default function DashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
      <PageHeader
        title="Train Smarter"
        description="Choose your primary fitness goal and experience level, then generate a split built for you."
      />
      <WorkoutGenerator />
    </div>
  )
}
