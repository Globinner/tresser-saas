"use client"

import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  DollarSign, 
  Users,
  Scissors,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { cn } from "@/lib/utils"

interface AnalyticsOverviewProps {
  thisMonthAppointments: number
  lastMonthAppointments: number
  thisMonthRevenue: number
  lastMonthRevenue: number
  newClients: number
  totalClients: number
  topServices: { name: string; count: number }[]
  shopId: string | null
}

const COLORS = ["#d4a574", "#b8956a", "#9c8660", "#807756", "#64684c"]

export function AnalyticsOverview({
  thisMonthAppointments,
  lastMonthAppointments,
  thisMonthRevenue,
  lastMonthRevenue,
  newClients,
  totalClients,
  topServices,
}: AnalyticsOverviewProps) {
  const appointmentChange = lastMonthAppointments > 0 
    ? ((thisMonthAppointments - lastMonthAppointments) / lastMonthAppointments * 100).toFixed(1)
    : "100"
  
  const revenueChange = lastMonthRevenue > 0
    ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
    : "100"

  const stats = [
    {
      name: "Appointments This Month",
      value: thisMonthAppointments,
      change: parseFloat(appointmentChange),
      icon: Calendar,
    },
    {
      name: "Revenue This Month",
      value: `$${thisMonthRevenue.toLocaleString()}`,
      change: parseFloat(revenueChange),
      icon: DollarSign,
    },
    {
      name: "New Clients",
      value: newClients,
      subtext: `of ${totalClients} total`,
      icon: Users,
    },
    {
      name: "Avg Revenue per Appointment",
      value: thisMonthAppointments > 0 
        ? `$${(thisMonthRevenue / thisMonthAppointments).toFixed(2)}`
        : "$0",
      icon: TrendingUp,
    },
  ]

  // Mock weekly data for chart
  const weeklyData = [
    { week: "Week 1", appointments: Math.floor(Math.random() * 30) + 10, revenue: Math.floor(Math.random() * 2000) + 500 },
    { week: "Week 2", appointments: Math.floor(Math.random() * 30) + 10, revenue: Math.floor(Math.random() * 2000) + 500 },
    { week: "Week 3", appointments: Math.floor(Math.random() * 30) + 10, revenue: Math.floor(Math.random() * 2000) + 500 },
    { week: "Week 4", appointments: Math.floor(Math.random() * 30) + 10, revenue: Math.floor(Math.random() * 2000) + 500 },
  ]

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="glass rounded-xl p-6 hover:border-primary/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              {stat.change !== undefined && (
                <div className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  stat.change >= 0 ? "text-green-400" : "text-red-400"
                )}>
                  {stat.change >= 0 ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {Math.abs(stat.change)}%
                </div>
              )}
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.name}</p>
            {stat.subtext && (
              <p className="text-xs text-muted-foreground mt-1">{stat.subtext}</p>
            )}
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly performance */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-6">Weekly Performance</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="week" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(20, 20, 25, 0.9)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="appointments" fill="oklch(0.78 0.18 75)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular services */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-6">Popular Services</h3>
          {topServices.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Scissors className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No service data yet</p>
              </div>
            </div>
          ) : (
            <div className="h-[300px] flex items-center">
              <div className="w-1/2">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={topServices}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={50}
                    >
                      {topServices.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(20, 20, 25, 0.9)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-3">
                {topServices.map((service, index) => (
                  <div key={service.name} className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm truncate flex-1">{service.name}</span>
                    <span className="text-sm font-medium">{service.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
