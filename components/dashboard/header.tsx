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
  
  const navigation = [
    { name: t("sidebar.dashboard"), href: "/dashboard", icon: LayoutDashboard },
    { name: t("sidebar.appointments"), href: "/dashboard/appointments", icon: Calendar },
    { name: t("sidebar.queue"), href: "/dashboard/queue", icon: UsersRound },
    { name: t("sidebar.clients"), href: "/dashboard/clients", icon: Users },
    { name: t("sidebar.team"), href: "/dashboard/team", icon: Briefcase },
    { name: t("sidebar.services"), href: "/dashboard/services", icon: Scissors },
    { name: t("sidebar.inventory"), href: "/dashboard/inventory", icon: Package },
    { name: t("sidebar.analytics"), href: "/dashboard/analytics", icon: BarChart3 },
    { name: t("sidebar.onlineBooking"), href: "/dashboard/settings?tab=booking", icon: Globe },
    { name: t("sidebar.reminders"), href: "/dashboard/settings?tab=reminders", icon: Bell },
    { name: t("sidebar.billing"), href: "/dashboard/billing", icon: CreditCard },
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
        <div className="flex h-16 items-center gap-4 px-6">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden -m-2.5 p-2.5 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>

          {/* Page title */}
          <h1 className="text-lg font-semibold">{currentPage}</h1>

          {/* Shop/User name */}
          <div className={cn("hidden md:flex items-center gap-3 px-4 py-2 rounded-lg bg-secondary/30 border border-border", isRTL ? "mr-auto" : "ml-auto")}>
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt={profile?.full_name || "User"} 
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-sm">
                {profile?.shops?.name?.charAt(0) || profile?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm font-medium truncate max-w-[150px]">
                {profile?.shops?.name || profile?.display_name || profile?.full_name || "My Shop"}
              </span>
              <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                {profile?.full_name || user.email}
              </span>
            </div>
          </div>

          {/* Right side actions */}
          <div className={cn("flex items-center gap-4", isRTL ? "" : "")}>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Button>
            
            <div className="md:hidden flex items-center">
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={profile?.full_name || "User"} 
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-sm">
                  {profile?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className={cn(
            "fixed inset-y-0 w-72 glass-strong p-6 border-border",
            isRTL ? "right-0 border-l" : "left-0 border-r"
          )}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center glow-amber-soft">
                  <Scissors className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xl font-bold tracking-tight">Tresser</span>
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
            <div className="mb-6">
              <LanguageSwitcher />
            </div>

            <nav className="flex flex-col gap-1">
              {navigation.map((item) => {
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

            <div className="mt-auto pt-6 border-t border-border absolute bottom-6 left-6 right-6">
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
