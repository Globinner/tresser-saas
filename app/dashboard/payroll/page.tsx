import { createClient } from "@/lib/supabase/server"
import { PayrollDashboard } from "@/components/dashboard/payroll-dashboard"
import { SubscriptionGate } from "@/components/dashboard/subscription-gate"

export default async function PayrollPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Get user's shop
  const { data: profile } = await supabase
    .from("profiles")
    .select("shop_id, role")
    .eq("id", user.id)
    .single()

  const shopId = profile?.shop_id
  const isOwner = profile?.role === "owner"

  if (!isOwner) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Access Denied</h2>
          <p className="text-muted-foreground mt-2">Only shop owners can access payroll information.</p>
        </div>
      </div>
    )
  }

  // Get all team members with their commission settings
  const { data: teamMembers } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, role, commission_rate, commission_type, fixed_commission, is_active")
    .eq("shop_id", shopId)
    .in("role", ["barber", "owner"])
    .order("full_name")

  // Get current month's date range
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]

  // Get all completed appointments this month with service prices
  const { data: appointments } = await supabase
    .from("appointments")
    .select(`
      id,
      date,
      barber_id,
      total_price,
      status,
      services(id, name, price)
    `)
    .eq("shop_id", shopId)
    .eq("status", "completed")
    .gte("date", startOfMonth)
    .lte("date", endOfMonth)

  // Get transactions for the month
  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("shop_id", shopId)
    .gte("created_at", startOfMonth)
    .lte("created_at", endOfMonth + "T23:59:59")

  return (
    <SubscriptionGate feature="payroll" featureName="Payroll Reports" requiredPlan="pro">
      <PayrollDashboard 
        teamMembers={teamMembers || []}
        appointments={appointments || []}
        transactions={transactions || []}
        shopId={shopId}
        startDate={startOfMonth}
        endDate={endOfMonth}
      />
    </SubscriptionGate>
  )
}
