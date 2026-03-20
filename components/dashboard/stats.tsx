"use client"

import { Calendar, Users, DollarSign, CheckCircle } from "lucide-react"

interface DashboardStatsProps {
  todayAppointments: number
  totalClients: number
  monthlyRevenue: number
  completedAppointments: number
}

export function DashboardStats({
  todayAppointments,
  totalClients,
  monthlyRevenue,
  completedAppointments,
}: DashboardStatsProps) {
  const stats = [
    {
      name: "Today's Appointments",
      value: todayAppointments,
      icon: Calendar,
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      name: "Total Clients",
      value: totalClients,
      icon: Users,
      change: "+8%",
      changeType: "positive" as const,
    },
    {
      name: "Monthly Revenue",
      value: `$${monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: "+23%",
      changeType: "positive" as const,
    },
    {
      name: "Completed Cuts",
      value: completedAppointments,
      icon: CheckCircle,
      change: "+15%",
      changeType: "positive" as const,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="glass rounded-xl p-6 hover:border-primary/30 transition-all duration-300 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <stat.icon className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-medium text-green-500">{stat.change}</span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.name}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
