import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { InventoryManagement } from "@/components/dashboard/inventory-management"

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
    redirect("/dashboard")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Inventory</h1>
        <p className="text-muted-foreground">Track products, supplies, and stock levels</p>
      </div>
      
      <InventoryManagement shopId={profile.shop_id} />
    </div>
  )
}
