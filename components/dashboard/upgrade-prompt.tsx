"use client"

import { Button } from "@/components/ui/button"
import { Crown, Lock, Zap, Clock } from "lucide-react"
import Link from "next/link"
import { PlanType } from "@/hooks/use-subscription"

interface UpgradePromptProps {
  feature: string
  requiredPlan: "pro" | "branch"
  currentPlan: PlanType
  isExpired?: boolean
  variant?: "inline" | "modal" | "banner"
}

export function UpgradePrompt({ 
  feature, 
  requiredPlan, 
  currentPlan, 
  isExpired = false,
  variant = "inline" 
}: UpgradePromptProps) {
  const planNames = {
    solo: "Solo",
    pro: "Pro",
    branch: "Branch",
    trial: "Trial",
    expired: "Expired",
  }

  if (isExpired) {
    return (
      <div className={`
        ${variant === "banner" ? "w-full" : "max-w-md mx-auto"}
        glass rounded-xl p-6 text-center
      `}>
        <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-xl font-bold mb-2">Your Trial Has Expired</h3>
        <p className="text-muted-foreground mb-6">
          Upgrade to continue using Tresser and manage your barbershop.
        </p>
        <Link href="/dashboard/billing">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-amber-soft">
            <Crown className="w-4 h-4 mr-2" />
            View Plans
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className={`
      ${variant === "banner" ? "w-full" : "max-w-md mx-auto"}
      glass rounded-xl p-6 text-center border border-primary/20
    `}>
      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
        <Lock className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-xl font-bold mb-2">{feature} is a {planNames[requiredPlan]} Feature</h3>
      <p className="text-muted-foreground mb-6">
        {currentPlan === "solo" 
          ? `Upgrade to ${planNames[requiredPlan]} to unlock ${feature.toLowerCase()} and more powerful features.`
          : `This feature requires the ${planNames[requiredPlan]} plan.`
        }
      </p>
      <Link href="/dashboard/billing">
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-amber-soft">
          <Zap className="w-4 h-4 mr-2" />
          Upgrade to {planNames[requiredPlan]}
        </Button>
      </Link>
    </div>
  )
}

// Trial banner component
interface TrialBannerProps {
  daysRemaining: number
}

export function TrialBanner({ daysRemaining }: TrialBannerProps) {
  if (daysRemaining > 7) return null

  const isUrgent = daysRemaining <= 3

  return (
    <div className={`
      w-full py-2 px-4 text-center text-sm font-medium
      ${isUrgent 
        ? "bg-destructive/20 text-destructive border-b border-destructive/30" 
        : "bg-primary/20 text-primary border-b border-primary/30"
      }
    `}>
      <div className="flex items-center justify-center gap-2">
        <Clock className="w-4 h-4" />
        <span>
          {daysRemaining === 0 
            ? "Your trial expires today!" 
            : daysRemaining === 1
              ? "Your trial expires tomorrow!"
              : `${daysRemaining} days left in your trial`
          }
        </span>
        <Link href="/dashboard/billing" className="underline hover:no-underline ml-2">
          Upgrade now
        </Link>
      </div>
    </div>
  )
}

// Feature gate wrapper component
interface FeatureGateProps {
  feature: string
  requiredPlan: "pro" | "branch"
  currentPlan: PlanType
  isActive: boolean
  children: React.ReactNode
}

export function FeatureGate({ 
  feature, 
  requiredPlan, 
  currentPlan, 
  isActive, 
  children 
}: FeatureGateProps) {
  // Check if user has access
  const planOrder: PlanType[] = ["expired", "solo", "pro", "branch", "trial"]
  const requiredIndex = planOrder.indexOf(requiredPlan)
  const currentIndex = planOrder.indexOf(currentPlan)
  
  // Trial users get Pro access
  const effectiveIndex = currentPlan === "trial" ? planOrder.indexOf("pro") : currentIndex

  const hasAccess = isActive && effectiveIndex >= requiredIndex

  if (!isActive) {
    return <UpgradePrompt feature={feature} requiredPlan={requiredPlan} currentPlan={currentPlan} isExpired />
  }

  if (!hasAccess) {
    return <UpgradePrompt feature={feature} requiredPlan={requiredPlan} currentPlan={currentPlan} />
  }

  return <>{children}</>
}
