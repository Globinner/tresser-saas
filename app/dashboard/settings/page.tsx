import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SettingsTabs } from "@/components/dashboard/settings-tabs"

export default async function SettingsPage() {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account, shop, and integrations</p>
      </div>

      <SettingsTabs user={user} profile={profileWithShop} />
    </div>
  )
}
