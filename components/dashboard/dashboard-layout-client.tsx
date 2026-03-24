"use client"

import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { OnboardingWalkthrough } from "@/components/dashboard/onboarding-walkthrough"
import { useLanguage } from "@/lib/i18n/language-context"
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
    currency?: string
  } | null
}

interface DashboardLayoutClientProps {
  user: User
  profile: Profile | null
  children: React.ReactNode
}

export function DashboardLayoutClient({ user, profile, children }: DashboardLayoutClientProps) {
  const { isRTL } = useLanguage()
  
  return (
    <div className={cn("min-h-screen bg-background grain", isRTL ? "rtl" : "ltr")} dir={isRTL ? "rtl" : "ltr"}>
      <DashboardSidebar user={user} profile={profile} />
      <div className={cn("lg:pl-72", isRTL && "lg:pl-0 lg:pr-72")}>
        <DashboardHeader user={user} profile={profile} />
        <main className="p-6">
          {children}
        </main>
      </div>
      <OnboardingWalkthrough />
    </div>
  )
}
