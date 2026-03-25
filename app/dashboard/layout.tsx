import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { CurrencyProvider } from "@/lib/currency-context"
import { DashboardLayoutClient } from "@/components/dashboard/dashboard-layout-client"

// Force dynamic and no caching
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user's profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // Get shop separately if profile has shop_id
  let shopData = null
  if (profile?.shop_id) {
    const { data: shop } = await supabase
      .from("shops")
      .select("*")
      .eq("id", profile.shop_id)
      .single()
    shopData = shop
  }

  // Combine profile with shop
  const profileWithShop = profile ? { ...profile, shops: shopData } : null
  const shopCurrency = shopData?.currency || "USD"

  return (
    <CurrencyProvider currency={shopCurrency}>
      <DashboardLayoutClient user={user} profile={profileWithShop}>
        {children}
      </DashboardLayoutClient>
    </CurrencyProvider>
  )
}
