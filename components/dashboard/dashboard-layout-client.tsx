"use client"

import { useLanguage } from "@/lib/i18n/context"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
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
    <div className="min-h-screen bg-background grain">
      <DashboardSidebar user={user} profile={profile} />
      <div className={isRTL ? "lg:pr-72" : "lg:pl-72"}>
        <DashboardHeader user={user} profile={profile} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
