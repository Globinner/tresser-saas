"use client"

import { useRouter } from "next/navigation"
import { Calendar, Users, DollarSign, CheckCircle, TrendingUp, UserPlus } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

interface DashboardStatsProps {
  todayAppointments: number
  totalClients: number
  todayRevenue: number
  monthlyRevenue: number
  completedAppointments: number
  newClientsToday: number
  currency?: string
}

export function DashboardStats({
  todayAppointments,
  totalClients,
  todayRevenue,
  monthlyRevenue,
  completedAppointments,
  newClientsToday,
  currency = "ILS",
}: DashboardStatsProps) {
  const router = useRouter()
  const { t, locale } = useLanguage()
  const isHebrew = locale === 'he'
  
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(isHebrew ? 'he-IL' : 'en-US', {
      style: 'currency',
      currency: isHebrew ? 'ILS' : 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const stats = [
    {
      name: t("dashboard.todayAppts"),
      value: todayAppointments,
      Icon: Calendar,
      href: "/dashboard/appointments",
    },
    {
      name: t("dashboard.totalClients"),
      value: totalClients,
      Icon: Users,
      href: "/dashboard/clients",
    },
    {
      name: t("dashboard.todayRevenue"),
      value: formatPrice(todayRevenue),
      Icon: TrendingUp,
      href: "/dashboard/analytics",
    },
    {
      name: t("dashboard.monthlyRevenue"),
      value: formatPrice(monthlyRevenue),
      Icon: DollarSign,
      href: "/dashboard/analytics",
    },
    {
      name: t("dashboard.completed"),
      value: completedAppointments,
      Icon: CheckCircle,
      href: "/dashboard/appointments",
    },
    {
      name: t("dashboard.newClients"),
      value: newClientsToday,
      Icon: UserPlus,
      href: "/dashboard/clients",
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3" dir="ltr">
      {stats.map((stat) => (
        <button
          key={stat.name}
          onClick={() => router.push(stat.href)}
          className="bg-card border border-border rounded-xl p-3 sm:p-4 text-left hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 active:scale-[0.98]"
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <stat.Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <p className="text-lg sm:text-xl font-bold text-foreground truncate">{stat.value}</p>
          </div>
          <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{stat.name}</p>
        </button>
      ))}
    </div>
  )
}
