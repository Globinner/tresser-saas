import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { WalkInQueue } from "@/components/dashboard/walk-in-queue"

export default async function QueuePage() {
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
        <h1 className="text-2xl font-bold text-foreground">Walk-in Queue</h1>
        <p className="text-muted-foreground">Manage walk-in customers and wait times</p>
      </div>
      
      <WalkInQueue shopId={profile.shop_id} />
    </div>
  )
}
