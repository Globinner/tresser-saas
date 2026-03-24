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
    },
    {
      name: "Total Clients",
      value: totalClients,
      icon: Users,
      change: "+8%",
    },
    {
      name: "Monthly Revenue",
      value: formatPrice(monthlyRevenue),
      icon: DollarSign,
      change: "+23%",
    },
    {
      name: "Completed Appointments",
      value: completedAppointments,
      icon: CheckCircle,
      change: "+15%",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" dir="ltr">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="glass rounded-xl p-6 hover:border-primary/30 transition-all duration-300 group"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <stat.icon style={{ width: '24px', height: '24px' }} className="text-primary" />
            </div>
            <span className="text-sm font-medium text-green-500">{stat.change}</span>
          </div>
          <p style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>{stat.value}</p>
          <p className="text-sm text-muted-foreground">{stat.name}</p>
        </div>
      ))}
    </div>
  )
}
