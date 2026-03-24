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
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        direction: 'ltr',
      }}
    >
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.name}
            style={{
              background: 'rgba(30, 30, 30, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '24px',
              position: 'relative',
              direction: 'ltr',
              textAlign: 'left',
            }}
          >
            {/* Percentage badge - top right */}
            <span
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#22c55e',
              }}
            >
              {stat.change}
            </span>

            {/* Icon box with icon aligned to bottom-left to match text alignment */}
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'flex-start',
                padding: '8px',
                marginBottom: '16px',
              }}
            >
              <Icon
                style={{
                  width: '24px',
                  height: '24px',
                  color: '#f59e0b',
                }}
              />
            </div>

            {/* Value */}
            <div
              style={{
                fontSize: '24px',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '4px',
              }}
            >
              {stat.value}
            </div>

            {/* Label */}
            <div
              style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.6)',
              }}
            >
              {stat.name}
            </div>
          </div>
        )
      })}
    </div>
  )
}
