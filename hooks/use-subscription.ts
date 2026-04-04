"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"

export type PlanType = "trial" | "solo" | "pro" | "branch" | "expired"

export interface SubscriptionStatus {
  plan: PlanType
  isActive: boolean
  isTrial: boolean
  isExpired: boolean
  daysRemaining: number | null
  trialEndsAt: Date | null
  subscriptionEndsAt: Date | null
  canAccessFeature: (feature: FeatureKey) => boolean
  loading: boolean
}

export type FeatureKey = 
  | "team" // Pro+
  | "payroll" // Pro+
  | "booking" // All plans
  | "analytics" // All plans (basic for Solo)
  | "inventory" // All plans
  | "chemistry" // All plans
  | "whatsapp" // All plans
  | "sms" // Pro+
  | "multi_location" // Branch only
  | "unlimited_team" // Branch only
  | "custom_branding" // Pro+
  | "priority_support" // Pro+

// Feature access matrix
const FEATURE_ACCESS: Record<PlanType, FeatureKey[]> = {
  trial: [
    "team", "payroll", "booking", "analytics", "inventory", 
    "chemistry", "whatsapp", "sms", "custom_branding", "priority_support"
  ], // Trial gets Pro features
  solo: [
    "booking", "analytics", "inventory", "chemistry", "whatsapp"
  ],
  pro: [
    "team", "payroll", "booking", "analytics", "inventory", 
    "chemistry", "whatsapp", "sms", "custom_branding", "priority_support"
  ],
  branch: [
    "team", "payroll", "booking", "analytics", "inventory", 
    "chemistry", "whatsapp", "sms", "multi_location", "unlimited_team",
    "custom_branding", "priority_support"
  ],
  expired: [], // No features
}

// Team member limits per plan
export const TEAM_LIMITS: Record<PlanType, number> = {
  trial: 5,
  solo: 1, // Just the owner
  pro: 5,
  branch: 999, // Unlimited
  expired: 0,
}

export function useSubscription(): SubscriptionStatus {
  const [status, setStatus] = useState<SubscriptionStatus>({
    plan: "trial",
    isActive: true,
    isTrial: true,
    isExpired: false,
    daysRemaining: 14,
    trialEndsAt: null,
    subscriptionEndsAt: null,
    canAccessFeature: () => true,
    loading: true,
  })

  useEffect(() => {
    async function checkSubscription() {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setStatus(prev => ({ ...prev, loading: false, isExpired: true, plan: "expired" }))
        return
      }

      // Get shop data
      const { data: profile } = await supabase
        .from("profiles")
        .select("shop_id")
        .eq("id", user.id)
        .single()

      if (!profile?.shop_id) {
        setStatus(prev => ({ ...prev, loading: false }))
        return
      }

      const { data: shop } = await supabase
        .from("shops")
        .select("subscription_plan, subscription_status, subscription_start, subscription_end, created_at")
        .eq("id", profile.shop_id)
        .single()

      if (!shop) {
        setStatus(prev => ({ ...prev, loading: false }))
        return
      }

      const now = new Date()
      const createdAt = new Date(shop.created_at)
      const trialEndDate = new Date(createdAt.getTime() + 14 * 24 * 60 * 60 * 1000) // 14 days from signup
      const subscriptionEnd = shop.subscription_end ? new Date(shop.subscription_end) : null

      let plan: PlanType = "trial"
      let isActive = true
      let isTrial = false
      let isExpired = false
      let daysRemaining: number | null = null

      // Check subscription status
      if (shop.subscription_plan === "trial" && shop.subscription_status === "active") {
        // On trial
        plan = "trial"
        isTrial = true
        if (subscriptionEnd) {
          daysRemaining = Math.ceil((subscriptionEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          if (daysRemaining <= 0) {
            isExpired = true
            isActive = false
            plan = "expired"
          }
        }
      } else if (shop.subscription_plan && shop.subscription_plan !== "trial" && shop.subscription_status === "active") {
        // Has active paid subscription (solo, pro, branch)
        plan = shop.subscription_plan as PlanType
        if (subscriptionEnd) {
          daysRemaining = Math.ceil((subscriptionEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          if (daysRemaining <= 0) {
            isExpired = true
            isActive = false
            plan = "expired"
          }
        }
      } else if (now <= trialEndDate) {
        // Fallback: Still in trial period (for older accounts without subscription_plan set)
        plan = "trial"
        isTrial = true
        daysRemaining = Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      } else {
        // Trial expired, no paid subscription
        plan = "expired"
        isExpired = true
        isActive = false
        daysRemaining = 0
      }

      const canAccessFeature = (feature: FeatureKey): boolean => {
        if (!isActive) return false
        return FEATURE_ACCESS[plan]?.includes(feature) ?? false
      }

      setStatus({
        plan,
        isActive,
        isTrial,
        isExpired,
        daysRemaining,
        trialEndsAt: isTrial ? trialEndDate : null,
        subscriptionEndsAt: subscriptionEnd,
        canAccessFeature,
        loading: false,
      })
    }

    checkSubscription()
  }, [])

  return status
}
