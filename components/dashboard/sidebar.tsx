"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Scissors, 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Briefcase,
  Settings,
  LogOut,
  BarChart3,
  CreditCard,
  UsersRound,
  Package,
  Globe,
  Bell
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/language-context"
import type { User } from "@supabase/supabase-js"

interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  role: string
  shops: {
    id: string
    name: string
  } | null
}

interface DashboardSidebarProps {
  user: User
  profile: Profile | null
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Appointments", href: "/dashboard/appointments", icon: Calendar },
  { name: "Walk-in Queue", href: "/dashboard/queue", icon: UsersRound },
  { name: "Clients", href: "/dashboard/clients", icon: Users },
  { name: "Team", href: "/dashboard/team", icon: Briefcase },
  { name: "Services", href: "/dashboard/services", icon: Scissors },
  { name: "Inventory", href: "/dashboard/inventory", icon: Package },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Online Booking", href: "/dashboard/settings?tab=booking", icon: Globe },
  { name: "Reminders", href: "/dashboard/settings?tab=reminders", icon: Bell },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardSidebar({ user, profile }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const { isRTL } = useLanguage()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <>
      {/* Desktop sidebar */}
      <div className={cn(
        "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col",
        isRTL ? "lg:right-0" : "lg:left-0"
      )}>
        <div className={cn(
          "flex grow flex-col gap-y-5 overflow-y-auto glass-strong px-6 pb-4",
          isRTL ? "border-l border-border" : "border-r border-border"
        )}>
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center glow-amber-soft">
              <Scissors className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">Tresser</span>
          </div>

          {/* Shop name */}
          {profile?.shops && (
            <div className="px-3 py-2 rounded-lg bg-secondary/50 border border-border">
              <p className="text-xs text-muted-foreground">Current Shop</p>
              <p className="font-medium truncate">{profile.shops.name}</p>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex gap-x-3 rounded-lg p-3 text-sm font-medium transition-all duration-200",
                        isRTL && "flex-row-reverse text-right",
                        isActive 
                          ? "bg-primary/20 text-primary glow-amber-soft" 
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      )}
                    >
                      <item.icon className={cn(
                        "h-5 w-5 shrink-0",
                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      )} />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>

            {/* User section */}
            <div className="mt-auto pt-4 border-t border-border">
              <div className={cn("flex items-center gap-3 px-3 py-2", isRTL && "flex-row-reverse")}>
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                  {profile?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
                </div>
                <div className={cn("flex-1 min-w-0", isRTL && "text-right")}>
                  <p className="text-sm font-medium truncate">
                    {profile?.full_name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className={cn(
                  "w-full mt-2 flex items-center gap-x-3 rounded-lg p-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors",
                  isRTL && "flex-row-reverse"
                )}
              >
                <LogOut className="h-5 w-5" />
                Sign out
              </button>
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}
