import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { InventoryManagement } from "@/components/dashboard/inventory-management"
import { PageHeader } from "@/components/dashboard/page-header"
import Link from "next/link"

export default async function InventoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("shop_id")
    .eq("id", user.id)
    .single()

  if (!profile?.shop_id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="text-xl font-semibold mb-2">Create Your Shop First</h2>
        <p className="text-muted-foreground mb-4">Go to Settings &gt; Shop to set up your shop</p>
        <Link href="/dashboard/settings?tab=shop" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">
          Go to Settings
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader titleKey="inventory.title" subtitleKey="inventory.subtitle" />
      
      <InventoryManagement shopId={profile.shop_id} />
    </div>
  )
}
