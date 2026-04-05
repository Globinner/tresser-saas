import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SettingsTabs } from "@/components/dashboard/settings-tabs"
import { PageHeader } from "@/components/dashboard/page-header"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user's profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  console.log("[v0] Settings - User ID:", user.id)
  console.log("[v0] Settings - Profile:", profile)
  console.log("[v0] Settings - Profile Error:", profileError)

  // Get shop separately if profile has shop_id
  let shopData = null
  if (profile?.shop_id) {
    const { data: shop, error: shopError } = await supabase
      .from("shops")
      .select("*")
      .eq("id", profile.shop_id)
      .single()
    shopData = shop
    console.log("[v0] Settings - Shop:", shop)
    console.log("[v0] Settings - Shop Error:", shopError)
  } else {
    // Also try fetching shop by owner_id as fallback
    const { data: ownedShop, error: ownedShopError } = await supabase
      .from("shops")
      .select("*")
      .eq("owner_id", user.id)
      .single()
    
    console.log("[v0] Settings - Owned Shop fallback:", ownedShop)
    console.log("[v0] Settings - Owned Shop Error:", ownedShopError)
    
    if (ownedShop) {
      shopData = ownedShop
      // Also update profile with shop_id for next time
      await supabase
        .from("profiles")
        .update({ shop_id: ownedShop.id, role: 'owner' })
        .eq("id", user.id)
    }
  }

  // Combine profile with shop
  const profileWithShop = profile ? { ...profile, shops: shopData } : null

  return (
    <div className="space-y-6">
      <PageHeader titleKey="settings.title" subtitleKey="settings.subtitle" />

      <SettingsTabs user={user} profile={profileWithShop} />
    </div>
  )
}
