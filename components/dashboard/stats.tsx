"use client"

import { Calendar, Users, DollarSign, CheckCircle } from "lucide-react"

interface DashboardStatsProps {
  todayAppointments: number
  totalClients: number
  monthlyRevenue: number
  completedAppointments: number
  currency?: string
}

export function DashboardStats({
  todayAppointments,
  totalClients,
  monthlyRevenue,
  completedAppointments,
  currency = "ILS",
}: DashboardStatsProps) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }
  
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
      value: formatPrice(monthlyRevenue),
      icon: DollarSign,
      change: "+23%",
      changeType: "positive" as const,
    },
    {
      name: "Completed Appointments",
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
          className="glass rounded-xl p-6 hover:border-primary/30 transition-all duration-300 group relative"
        >
          <span className="absolute top-6 right-6 text-sm font-medium text-green-500">{stat.change}</span>
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors mb-4">
            <stat.icon className="w-6 h-6 text-primary" />
          </div>
          <p className="text-2xl font-bold">{stat.value}</p>
          <p className="text-sm text-muted-foreground">{stat.name}</p>
        </div>
      ))}
    </div>
  )
}
