import { createClient } from "@/lib/supabase/server"
import { AnalyticsOverview } from "@/components/dashboard/analytics-overview"
import { PageHeader } from "@/components/dashboard/page-header"

export default async function AnalyticsPage() {
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

  // Get monthly stats
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

  // This month's appointments
  const { count: thisMonthAppointments } = await supabase
    .from("appointments")
    .select("*", { count: "exact", head: true })
    .eq("shop_id", shopId)
    .gte("appointment_time", startOfMonth.toISOString())

  // Last month's appointments
  const { count: lastMonthAppointments } = await supabase
    .from("appointments")
    .select("*", { count: "exact", head: true })
    .eq("shop_id", shopId)
    .gte("appointment_time", startOfLastMonth.toISOString())
    .lte("appointment_time", endOfLastMonth.toISOString())

  // This month's revenue
  const { data: thisMonthTransactions } = await supabase
    .from("transactions")
    .select("amount")
    .eq("shop_id", shopId)
    .gte("created_at", startOfMonth.toISOString())

  const thisMonthRevenue = thisMonthTransactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0

  // Last month's revenue
  const { data: lastMonthTransactions } = await supabase
    .from("transactions")
    .select("amount")
    .eq("shop_id", shopId)
    .gte("created_at", startOfLastMonth.toISOString())
    .lte("created_at", endOfLastMonth.toISOString())

  const lastMonthRevenue = lastMonthTransactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0

  // New clients this month
  const { count: newClients } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true })
    .eq("shop_id", shopId)
    .gte("created_at", startOfMonth.toISOString())

  // Total clients
  const { count: totalClients } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true })
    .eq("shop_id", shopId)

  // Popular services
  const { data: popularServices } = await supabase
    .from("appointments")
    .select("service_id, services(name)")
    .eq("shop_id", shopId)
    .gte("appointment_time", startOfMonth.toISOString())

  // Count services
  const serviceCount: Record<string, { name: string; count: number }> = {}
  popularServices?.forEach((apt) => {
    const serviceName = apt.services?.name || "Unknown"
    if (!serviceCount[serviceName]) {
      serviceCount[serviceName] = { name: serviceName, count: 0 }
    }
    serviceCount[serviceName].count++
  })

  const topServices = Object.values(serviceCount)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <PageHeader titleKey="analytics.title" subtitleKey="analytics.subtitle" />

      <AnalyticsOverview
        thisMonthAppointments={thisMonthAppointments || 0}
        lastMonthAppointments={lastMonthAppointments || 0}
        thisMonthRevenue={thisMonthRevenue}
        lastMonthRevenue={lastMonthRevenue}
        newClients={newClients || 0}
        totalClients={totalClients || 0}
        topServices={topServices}
        shopId={shopId}
      />
    </div>
  )
}
