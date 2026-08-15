import { PageHeader } from "@/components/dashboard/page-header"
import { AppearancePanel, NotificationsPanel } from "@/components/dashboard/settings-panels"

export default function SettingsPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
      <PageHeader title="Settings" description="Manage your appearance and notification preferences." />
      <AppearancePanel />
      <NotificationsPanel />

      <section className="rounded-xl border border-destructive/30 bg-card">
        <div className="border-b border-destructive/20 px-5 py-4 md:px-6">
          <h2 className="font-medium tracking-tight text-destructive">Danger Zone</h2>
        </div>
        <div className="flex flex-col items-start justify-between gap-3 px-5 py-4 sm:flex-row sm:items-center md:px-6">
          <div>
            <p className="text-sm font-medium tracking-tight">Delete account</p>
            <p className="text-sm text-muted-foreground text-pretty">
              Permanently remove your account and all training data.
            </p>
          </div>
          <button
            type="button"
            className="rounded-lg border border-destructive/40 px-4 py-2 text-sm font-medium tracking-tight text-destructive transition-colors hover:bg-destructive/10"
          >
            Delete account
          </button>
        </div>
      </section>
    </div>
  )
}
