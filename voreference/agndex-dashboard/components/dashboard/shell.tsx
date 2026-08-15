"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronsUpDown, LogOut, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { navigationGroups, allNavItems, brand, currentUser } from "@/lib/nav-data"
import { ThemeToggle } from "./theme-toggle"

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const BrandIcon = brand.icon

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 px-5 pt-6 pb-2">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <BrandIcon className="size-4.5" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">
            {brand.name}
          </span>
        </div>
        <span className="rounded-md bg-sidebar-badge px-2 py-1 text-[10px] font-medium tracking-wide text-sidebar-foreground/70 uppercase">
          {brand.tagline}
        </span>
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-7 overflow-y-auto px-4 no-scrollbar">
        {navigationGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-3 text-xs font-medium tracking-wide text-sidebar-muted uppercase">
              {group.label}
            </p>
            <ul className="flex flex-col gap-1">
              {group.items.map((item) => {
                const active = isActive(pathname, item.href)
                const Icon = item.icon
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm tracking-tight transition-colors",
                        active
                          ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                          : "text-sidebar-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                      )}
                    >
                      <Icon className="size-4.5 shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="flex flex-col gap-1 px-4 pb-6">
        <button
          type="button"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm tracking-tight text-sidebar-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="size-4.5 -rotate-90" />
          <span>Log out</span>
        </button>
        <div className="flex items-center gap-2.5 rounded-lg px-3 py-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-sidebar-accent text-xs font-medium text-sidebar-accent-foreground">
            {currentUser.initials}
          </span>
          <span className="flex-1 truncate text-sm font-medium tracking-tight text-sidebar-foreground">
            {currentUser.name}
          </span>
          <ChevronsUpDown className="size-4 text-sidebar-foreground/40" />
        </div>
      </div>
    </div>
  )
}

function Topbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const pathname = usePathname()
  const current = allNavItems.find((item) => isActive(pathname, item.href)) ?? allNavItems[0]

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-2 border-b border-border/60 px-4 md:h-16 md:px-6">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open navigation menu"
          className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
        >
          <Menu className="size-5" />
        </button>
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="hidden sm:inline">Gym Bro</span>
          <span className="hidden text-border sm:inline">/</span>
          <span className="font-medium text-foreground">{current.name}</span>
        </nav>
      </div>
      <ThemeToggle />
    </header>
  )
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-svh overflow-hidden bg-sidebar">
      {/* Desktop sidebar */}
      <aside className="hidden w-[17rem] shrink-0 md:block">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 w-[17rem] bg-sidebar shadow-xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
              className="absolute top-6 right-3 flex size-8 items-center justify-center rounded-lg text-sidebar-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <X className="size-4.5" />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content card */}
      <main className="flex-1 overflow-hidden p-0 md:py-2 md:pr-2">
        <div className="flex h-full flex-col overflow-hidden bg-background md:rounded-xl md:border md:border-border/60">
          <Topbar onOpenMenu={() => setMobileOpen(true)} />
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </main>
    </div>
  )
}
