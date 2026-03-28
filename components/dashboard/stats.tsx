"use client"

import { useRouter } from "next/navigation"
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
  const router = useRouter()
  
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
      href: "/dashboard/appointments",
    },
    {
      name: "Total Clients",
      value: totalClients,
      Icon: Users,
      href: "/dashboard/clients",
    },
    {
      name: "Monthly Revenue",
      value: formatPrice(monthlyRevenue),
      Icon: DollarSign,
      href: "/dashboard/analytics",
    },
    {
      name: "Completed",
      value: completedAppointments,
      Icon: CheckCircle,
      href: "/dashboard/appointments",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4" dir="ltr">
      {stats.map((stat) => (
        <button
          key={stat.name}
          onClick={() => router.push(stat.href)}
          className="bg-card border border-border rounded-xl p-4 sm:p-6 text-left hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 active:scale-[0.98]"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <stat.Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
          </div>
          
          <p className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</p>
          <p className="text-xs sm:text-sm text-muted-foreground truncate">{stat.name}</p>
        </button>
      ))}
    </div>
  )
}
