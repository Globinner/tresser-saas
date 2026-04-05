import { createClient } from "@/lib/supabase/server"
import { DashboardStats } from "@/components/dashboard/stats"
import { TodayAppointments } from "@/components/dashboard/today-appointments"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { RecentClients } from "@/components/dashboard/recent-clients"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { WeeklySchedule } from "@/components/dashboard/weekly-schedule"

// Disable caching - always fetch fresh data
export const dynamic = "force-dynamic"
export const revalidate = 0

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
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0] // YYYY-MM-DD
  
  const { data: todayAppointments } = await supabase
    .from("appointments")
    .select(`
      *,
      clients(id, first_name, last_name, phone, email),
      services(name, duration_minutes, price),
      profiles!appointments_barber_id_fkey(full_name)
    `)
    .eq("shop_id", shopId)
    .eq("date", todayStr)
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

  // Get today's revenue from transactions
  const todayStart = new Date(today)
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date(today)
  todayEnd.setHours(23, 59, 59, 999)
  
  const { data: todayTransactions } = await supabase
    .from("transactions")
    .select("amount")
    .eq("shop_id", shopId)
    .gte("created_at", todayStart.toISOString())
    .lte("created_at", todayEnd.toISOString())

  const todayRevenue = todayTransactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0

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

  // Get new clients today
  const { count: newClientsToday } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true })
    .eq("shop_id", shopId)
    .gte("created_at", todayStart.toISOString())
    .lte("created_at", todayEnd.toISOString())

  // Get recent clients
  const { data: recentClients } = await supabase
    .from("clients")
    .select("*")
    .eq("shop_id", shopId)
    .order("created_at", { ascending: false })
    .limit(5)

  // Get team members for weekly schedule
  const { data: teamMembers } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, role")
    .eq("shop_id", shopId)
    .in("role", ["owner", "barber", "admin", "nail_tech"])
    .order("role")

  // Check if current user is owner
  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
  
  const isOwner = currentProfile?.role === "owner"

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <DashboardStats
        todayAppointments={todayAppointments?.length || 0}
        totalClients={totalClients || 0}
        todayRevenue={todayRevenue}
        monthlyRevenue={monthlyRevenue}
        completedAppointments={totalAppointments || 0}
        newClientsToday={newClientsToday || 0}
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

      {/* Weekly Schedule */}
      <WeeklySchedule 
        shopId={shopId} 
        teamMembers={teamMembers || []} 
        isOwner={isOwner} 
      />

      {/* Recent clients */}
      <RecentClients clients={recentClients || []} />
    </div>
  )
}
