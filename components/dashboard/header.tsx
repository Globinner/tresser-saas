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
  Bell
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
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
  
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Appointments", href: "/dashboard/appointments", icon: Calendar },
    { name: "Clients", href: "/dashboard/clients", icon: Users },
    { name: "Team", href: "/dashboard/team", icon: Briefcase },
    { name: "Services", href: "/dashboard/services", icon: Scissors },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  // Get current page title
  const currentPage = navigation.find(item => item.href === pathname)?.name || "Dashboard"

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

          {/* Right side actions */}
          <div className="flex items-center gap-4 ml-auto">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Button>
            
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-sm">
                {profile?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-72 glass-strong p-6 border-r border-border">
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
              <div className="px-3 py-2 rounded-lg bg-secondary/50 border border-border mb-6">
                <p className="text-xs text-muted-foreground">Current Shop</p>
                <p className="font-medium truncate">{profile.shops.name}</p>
              </div>
            )}

            <nav className="flex flex-col gap-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
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
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
