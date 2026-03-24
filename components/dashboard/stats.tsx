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
    return new Intl.NumberFormat('he-IL', {
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
      Icon: Calendar,
      change: "+12%",
    },
    {
      name: "Total Clients",
      value: totalClients,
      Icon: Users,
      change: "+8%",
    },
    {
      name: "Monthly Revenue",
      value: formatPrice(monthlyRevenue),
      Icon: DollarSign,
      change: "+23%",
    },
    {
      name: "Completed Appointments",
      value: completedAppointments,
      Icon: CheckCircle,
      change: "+15%",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" dir="ltr">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-card border border-border rounded-xl p-6 relative"
        >
          {/* Badge in top right */}
          <span className="absolute top-6 right-6 text-sm font-medium text-green-500">
            {stat.change}
          </span>
          
          {/* Icon - just the icon with background, no centering */}
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
            <stat.Icon className="w-6 h-6 text-primary" />
          </div>
          
          {/* Value */}
          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          
          {/* Label */}
          <p className="text-sm text-muted-foreground">{stat.name}</p>
        </div>
      ))}
    </div>
  )
}
