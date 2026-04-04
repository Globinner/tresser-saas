"use client"

import { useSubscription, FeatureKey } from "@/hooks/use-subscription"
import { FeatureGate } from "@/components/dashboard/upgrade-prompt"
import { Loader2 } from "lucide-react"

interface SubscriptionGateProps {
  feature: FeatureKey
  featureName: string
  requiredPlan: "pro" | "branch"
  children: React.ReactNode
}

export function SubscriptionGate({ 
  feature, 
  featureName, 
  requiredPlan, 
  children 
}: SubscriptionGateProps) {
  const subscription = useSubscription()

  if (subscription.loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  // Check if feature is accessible
  const hasAccess = subscription.canAccessFeature(feature)

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <FeatureGate
          feature={featureName}
          requiredPlan={requiredPlan}
          currentPlan={subscription.plan}
          isActive={subscription.isActive}
        >
          {children}
        </FeatureGate>
      </div>
    )
  }

  return <>{children}</>
}

// Expired account blocker - shows when trial/subscription has expired
export function ExpiredAccountBlocker({ children }: { children: React.ReactNode }) {
  const subscription = useSubscription()

  if (subscription.loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (subscription.isExpired) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <FeatureGate
          feature="Tresser"
          requiredPlan="pro"
          currentPlan={subscription.plan}
          isActive={false}
        >
          {children}
        </FeatureGate>
      </div>
    )
  }

  return <>{children}</>
}
