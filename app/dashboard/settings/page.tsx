import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SettingsTabs } from "@/components/dashboard/settings-tabs"

export default async function SettingsPage() {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account, shop, and integrations</p>
      </div>

      <SettingsTabs user={user} profile={profile} />
    </div>
  )
}
