"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface RevenueChartProps {
  shopId: string | null
}

export function RevenueChart({ shopId }: RevenueChartProps) {
  const [data, setData] = useState<{ day: string; revenue: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      if (!shopId) {
        // Show empty data if no shop - all zeros
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        const emptyData = days.map((day) => ({
          day,
          revenue: 0,
        }))
        setData(emptyData)
        setLoading(false)
        return
      }

      const supabase = createClient()
      
      // Get last 7 days of transactions
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 6)

      const { data: transactions } = await supabase
        .from("transactions")
        .select("amount, created_at")
        .eq("shop_id", shopId)
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString())

      // Group by day
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      const revenueByDay: Record<string, number> = {}

      // Initialize all days
      for (let i = 0; i < 7; i++) {
        const date = new Date()
        date.setDate(date.getDate() - (6 - i))
        const dayName = dayNames[date.getDay()]
        revenueByDay[dayName] = 0
      }

      // Sum transactions by day
      transactions?.forEach((t) => {
        const dayName = dayNames[new Date(t.created_at).getDay()]
        revenueByDay[dayName] = (revenueByDay[dayName] || 0) + Number(t.amount)
      })

      // Convert to array
      const chartData = Object.entries(revenueByDay).map(([day, revenue]) => ({
        day,
        revenue,
      }))

      setData(chartData)
      setLoading(false)
    }

    fetchData()
  }, [shopId])

  return (
    <div className="glass rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-6">Weekly Revenue</h2>
      
      <div className="h-[300px]">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="day" 
                stroke="rgba(255,255,255,0.5)"
                fontSize={12}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.5)"
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(20, 20, 25, 0.9)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                formatter={(value: number) => [`$${value}`, "Revenue"]}
              />
              <Bar 
                dataKey="revenue" 
                fill="oklch(0.78 0.18 75)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
