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
  Bell,
  Wallet,
  Shield,
  Camera
} from "lucide-react"

// Admin emails that can see admin link
const ADMIN_EMAILS = [
  "globinner@gmail.com",
  "davinocur@yahoo.com",
  // Add more admin emails as needed
]
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
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

export function DashboardSidebar({ user, profile }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const { t, isRTL } = useLanguage()
  
  // Check if user is owner by role OR if they own a shop
  const isOwner = profile?.role === "owner" || profile?.shops !== null
  const isAdmin = ADMIN_EMAILS.includes(user.email || "")
  
  // All users can see these
  const baseNavigation = [
    { name: t("sidebar.dashboard"), href: "/dashboard", icon: LayoutDashboard },
    { name: t("sidebar.appointments"), href: "/dashboard/appointments", icon: Calendar },
    { name: t("sidebar.queue"), href: "/dashboard/queue", icon: UsersRound },
    { name: t("sidebar.clients"), href: "/dashboard/clients", icon: Users },
    { name: t("sidebar.team"), href: "/dashboard/team", icon: Briefcase },
    { name: t("sidebar.services"), href: "/dashboard/services", icon: Scissors },
  ]
  
  // Only owners can see these
  const ownerNavigation = [
    { name: t("sidebar.inventory"), href: "/dashboard/inventory", icon: Package },
    { name: t("sidebar.payroll") || "Payroll", href: "/dashboard/payroll", icon: Wallet },
    { name: t("sidebar.analytics"), href: "/dashboard/analytics", icon: BarChart3 },
    { name: t("sidebar.photos") || "Photos", href: "/dashboard/photos", icon: Camera },
    { name: t("sidebar.onlineBooking"), href: "/dashboard/settings?tab=booking", icon: Globe },
    { name: t("sidebar.reminders"), href: "/dashboard/settings?tab=reminders", icon: Bell },
    { name: t("sidebar.billing"), href: "/dashboard/billing", icon: CreditCard },
    { name: t("sidebar.settings"), href: "/dashboard/settings", icon: Settings },
  ]
  
  // Admin only
  const adminNavigation = [
    { name: "Admin Panel", href: "/admin/referrals", icon: Shield },
  ]
  
  const navigation = isOwner 
    ? [...baseNavigation, ...ownerNavigation, ...(isAdmin ? adminNavigation : [])] 
    : [...baseNavigation, ...(isAdmin ? adminNavigation : [])]

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  // Mobile bottom nav items (simplified)
  const mobileNavigation = [
    { name: t("sidebar.dashboard"), href: "/dashboard", icon: LayoutDashboard },
    { name: t("sidebar.appointments"), href: "/dashboard/appointments", icon: Calendar },
    { name: t("sidebar.queue"), href: "/dashboard/queue", icon: UsersRound },
    { name: t("sidebar.clients"), href: "/dashboard/clients", icon: Users },
    { name: t("sidebar.team"), href: "/dashboard/team", icon: Briefcase },
  ]

  return (
    <>
      {/* Mobile bottom navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-sm border-t border-border">
        <div className="flex overflow-x-auto scrollbar-hide gap-1 px-2 py-2">
          {mobileNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center min-w-[64px] p-2 rounded-lg shrink-0 transition-colors",
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] mt-1 whitespace-nowrap">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={cn(
        "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col",
        isRTL ? "lg:right-0" : "lg:left-0"
      )}>
        <div className={cn(
          "flex grow flex-col gap-y-5 overflow-y-auto glass-strong px-6 pb-4 border-border",
          isRTL ? "border-l" : "border-r"
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
              <p className="text-xs text-muted-foreground">{t("demo.shopInfo") || "Shop Information"}</p>
              <p className="font-medium truncate">{profile.shops.name}</p>
            </div>
          )}

          {/* Time-based greeting */}
          <div className="px-3 py-2">
            <p className="text-lg font-medium">
              {(() => {
                const hour = new Date().getHours()
                const name = profile?.full_name?.split(' ')[0] || ''
                if (hour < 12) return `Good Morning${name ? `, ${name}` : ''}`
                if (hour < 18) return `Good Afternoon${name ? `, ${name}` : ''}`
                return `Good Evening${name ? `, ${name}` : ''}`
              })()}
            </p>
          </div>

          {/* Language Switcher */}
          <div className="px-1">
            <LanguageSwitcher />
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex gap-x-3 rounded-lg p-3 text-sm font-medium transition-all duration-200",
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
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                  {profile?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
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
                className="w-full mt-2 flex items-center gap-x-3 rounded-lg p-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <LogOut className="h-5 w-5" />
                {t("nav.logout")}
              </button>
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}
