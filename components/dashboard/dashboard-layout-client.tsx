"use client"

import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { TrialBanner, UpgradePrompt } from "@/components/dashboard/upgrade-prompt"
import { useLanguage } from "@/lib/i18n/language-context"
import { useBookingNotifications } from "@/hooks/use-booking-notifications"
import { useSubscription } from "@/hooks/use-subscription"
import { cn } from "@/lib/utils"
import type { User } from "@supabase/supabase-js"

interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  role: string
  shop_id?: string | null
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
  const subscription = useSubscription()
  
  // Enable real-time booking notifications with sound
  useBookingNotifications(profile?.shop_id || profile?.shops?.id)
  
  return (
    <div className={cn("min-h-screen bg-background grain", isRTL ? "rtl" : "ltr")} dir={isRTL ? "rtl" : "ltr"}>
      <DashboardSidebar user={user} profile={profile} />
      <div className={cn("lg:pl-72", isRTL && "lg:pl-0 lg:pr-72")}>
        {/* Trial expiration banner */}
        {subscription.isTrial && subscription.daysRemaining !== null && (
          <TrialBanner daysRemaining={subscription.daysRemaining} />
        )}
        <DashboardHeader user={user} profile={profile} />
        <main className="p-6">
          {subscription.isExpired ? (
            <div className="flex items-center justify-center h-[60vh]">
              <UpgradePrompt 
                feature="Tresser" 
                requiredPlan="pro" 
                currentPlan={subscription.plan}
                isExpired={true}
              />
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  )
}
