"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  Scissors, 
  Menu, 
  X,
  LayoutDashboard, 
  Calendar, 
  Users, 
  Briefcase,
  Settings,
  LogOut,
  BarChart3,
  CreditCard,
  Bell,
  UsersRound,
  Package,
  Globe
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { NextAppointmentTicker, useNextAppointmentAlert } from "@/components/dashboard/next-appointment-ticker"
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

interface DashboardHeaderProps {
  user: User
  profile: Profile | null
}

export function DashboardHeader({ user, profile }: DashboardHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const { t, isRTL } = useLanguage()
  const { isUrgent, minutesUntil } = useNextAppointmentAlert()
  
  const isOwner = profile?.role === "owner"
  
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
    { name: t("sidebar.analytics"), href: "/dashboard/analytics", icon: BarChart3 },
    { name: t("sidebar.onlineBooking"), href: "/dashboard/settings?tab=booking", icon: Globe },
    { name: t("sidebar.reminders"), href: "/dashboard/settings?tab=reminders", icon: Bell },
    { name: t("sidebar.billing"), href: "/dashboard/billing", icon: CreditCard },
    { name: t("sidebar.settings"), href: "/dashboard/settings", icon: Settings },
  ]
  
  const navigation = isOwner ? [...baseNavigation, ...ownerNavigation] : baseNavigation
  
  // Mobile menu shows only owner/settings items (main nav is in bottom bar)
  const mobileMenuNavigation = isOwner ? [
    { name: t("sidebar.services"), href: "/dashboard/services", icon: Scissors },
    { name: t("sidebar.inventory"), href: "/dashboard/inventory", icon: Package },
    { name: t("sidebar.analytics"), href: "/dashboard/analytics", icon: BarChart3 },
    { name: t("sidebar.onlineBooking"), href: "/dashboard/settings?tab=booking", icon: Globe },
    { name: t("sidebar.reminders"), href: "/dashboard/settings?tab=reminders", icon: Bell },
    { name: t("sidebar.billing"), href: "/dashboard/billing", icon: CreditCard },
    { name: t("sidebar.settings"), href: "/dashboard/settings", icon: Settings },
  ] : [
    { name: t("sidebar.services"), href: "/dashboard/services", icon: Scissors },
    { name: t("sidebar.settings"), href: "/dashboard/settings", icon: Settings },
  ]

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  // Get current page title
  const currentPage = navigation.find(item => item.href === pathname)?.name || t("sidebar.dashboard")

  return (
    <>
      <header className="sticky top-0 z-40 glass-strong border-b border-border">
        {/* Main header row */}
        <div className="flex h-14 items-center gap-4 px-4 sm:px-6">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden -m-2.5 p-2.5 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>

          {/* Page title - On mobile show shop name on dashboard page */}
          <h1 className="text-lg font-semibold">
            <span className="hidden sm:inline">{currentPage}</span>
            <span className="sm:hidden">
              {pathname === "/dashboard" ? (profile?.shops?.name || currentPage) : currentPage}
            </span>
          </h1>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right side actions */}
          <div className={cn("flex items-center gap-2", isRTL ? "" : "")}>
            {/* Language Switcher - visible on desktop */}
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "relative transition-all duration-300",
                isUrgent && "bg-primary/20 hover:bg-primary/30"
              )}
              onClick={() => router.push("/dashboard/appointments")}
              title={minutesUntil !== null ? `Next appointment in ${minutesUntil} minutes` : "Appointments"}
            >
              <Bell className={cn(
                "transition-all duration-300",
                isUrgent 
                  ? "h-6 w-6 text-primary animate-bell-ring" 
                  : "h-5 w-5"
              )} />
              {isUrgent && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold text-primary-foreground animate-bounce">
                  !
                </span>
              )}
              {!isUrgent && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Ticker row - full width, separate line */}
        <div className="w-full overflow-hidden border-t border-border/50 bg-background/50">
          <div className="animate-marquee-slow py-2 px-4">
            <NextAppointmentTicker />
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className={cn(
            "fixed inset-y-0 w-72 glass-strong p-6 border-border flex flex-col",
            isRTL ? "right-0 border-l" : "left-0 border-r"
          )}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center glow-amber-soft">
                  <Settings className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xl font-bold tracking-tight">{isRTL ? "עוד" : "More"}</span>
              </div>
              <button
                type="button"
                className="-m-2.5 p-2.5 text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {profile?.shops && (
              <div className="px-3 py-2 rounded-lg bg-secondary/50 border border-border mb-4">
                <p className="text-xs text-muted-foreground">{t("demo.shopInfo") || "Current Shop"}</p>
                <p className="font-medium truncate">{profile.shops.name}</p>
              </div>
            )}

            {/* Language Switcher in mobile */}
            <div className="mb-4">
              <LanguageSwitcher />
            </div>

            <nav className="flex flex-col gap-1 flex-1 overflow-y-auto pb-4">
              {mobileMenuNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg p-3 text-sm font-medium transition-all",
                      isActive 
                        ? "bg-primary/20 text-primary" 
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            <div className="pt-4 border-t border-border mt-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                  {profile?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{profile?.full_name || "User"}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <LogOut className="h-5 w-5" />
                {t("nav.logout")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
