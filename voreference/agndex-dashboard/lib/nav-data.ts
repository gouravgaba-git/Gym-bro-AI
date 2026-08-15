import {
  Dumbbell,
  LayoutDashboard,
  Settings,
  User,
  LifeBuoy,
  BookOpen,
  type LucideIcon,
} from "lucide-react"

export type NavItem = {
  name: string
  href: string
  icon: LucideIcon
  external?: boolean
}

export type NavGroup = {
  label: string
  items: NavItem[]
}

export const navigationGroups: NavGroup[] = [
  {
    label: "General",
    items: [{ name: "Dashboard", href: "/", icon: LayoutDashboard }],
  },
  {
    label: "Account",
    items: [
      { name: "My Profile", href: "/profile", icon: User },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
  {
    label: "Support",
    items: [
      { name: "Exercise Guide", href: "#", icon: BookOpen },
      { name: "Help Center", href: "#", icon: LifeBuoy },
    ],
  },
]

export const allNavItems = navigationGroups.flatMap((g) => g.items)

export const brand = {
  name: "GYM BRO",
  tagline: "Athlete Portal",
  icon: Dumbbell,
}

export const currentUser = {
  name: "Alex Carter",
  email: "alex@gymbro.app",
  initials: "AC",
  plan: "Pro Athlete",
}
