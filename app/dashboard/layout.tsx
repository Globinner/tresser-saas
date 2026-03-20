import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { CurrencyProvider } from "@/lib/currency-context"
import { DashboardLayoutClient } from "@/components/dashboard/dashboard-layout-client"

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

  // Get user's profile and shop
  const { data: profile } = await supabase
    .from("profiles")
    .select("*, shops(*)")
    .eq("id", user.id)
    .single()

  const shopCurrency = profile?.shops?.currency || "USD"

  return (
    <CurrencyProvider currency={shopCurrency}>
      <DashboardLayoutClient user={user} profile={profile}>
        {children}
      </DashboardLayoutClient>
    </CurrencyProvider>
  )
}
