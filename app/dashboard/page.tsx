import { createClient } from "@/lib/supabase/server"
import { DashboardStats } from "@/components/dashboard/stats"
import { TodayAppointments } from "@/components/dashboard/today-appointments"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { RecentClients } from "@/components/dashboard/recent-clients"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { SeedDemoButton } from "@/components/dashboard/seed-demo-button"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Get user's shop
  const { data: profile } = await supabase
    .from("profiles")
    .select("shop_id")
    .eq("id", user.id)
    .single()

  const shopId = profile?.shop_id

  // Get today's appointments
  const today = new Date().toISOString().split("T")[0]
  const { data: todayAppointments } = await supabase
    .from("appointments")
    .select(`
      *,
      clients(first_name, last_name, phone),
      services(name, duration_minutes, price)
    `)
    .eq("shop_id", shopId)
    .eq("date", today)
    .order("start_time", { ascending: true })

  // Get stats
  const { count: totalClients } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true })
    .eq("shop_id", shopId)

  const { count: totalAppointments } = await supabase
    .from("appointments")
    .select("*", { count: "exact", head: true })
    .eq("shop_id", shopId)
    .eq("status", "completed")

  // Get this month's revenue
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)
  
  const { data: monthTransactions } = await supabase
    .from("transactions")
    .select("amount")
    .eq("shop_id", shopId)
    .gte("created_at", startOfMonth.toISOString())

  const monthlyRevenue = monthTransactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0

  // Get recent clients
  const { data: recentClients } = await supabase
    .from("clients")
    .select("*")
    .eq("shop_id", shopId)
    .order("created_at", { ascending: false })
    .limit(5)

  // Check if shop has any data
  const hasData = (totalClients || 0) > 0

  return (
    <div className="space-y-6">
      {/* Show seed demo data button if no data exists */}
      {!hasData && <SeedDemoButton />}
      
      {/* Stats cards */}
      <DashboardStats
        todayAppointments={todayAppointments?.length || 0}
        totalClients={totalClients || 0}
        monthlyRevenue={monthlyRevenue}
        completedAppointments={totalAppointments || 0}
      />

      {/* Quick actions */}
      <QuickActions />

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's appointments */}
        <TodayAppointments appointments={todayAppointments || []} />

        {/* Revenue chart */}
        <RevenueChart shopId={shopId} />
      </div>

      {/* Recent clients */}
      <RecentClients clients={recentClients || []} />
    </div>
  )
}
