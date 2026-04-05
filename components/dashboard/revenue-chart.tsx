"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

interface RevenueChartProps {
  shopId: string | null
}

export function RevenueChart({ shopId }: RevenueChartProps) {
  const { t, isRTL, locale } = useLanguage()
  const isHebrew = locale === 'he'
  const [currentWeekData, setCurrentWeekData] = useState<{ day: string; revenue: number }[]>([])
  const [lastWeekData, setLastWeekData] = useState<{ day: string; revenue: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [showLastWeek, setShowLastWeek] = useState(false)
  
  const currency = isHebrew ? "₪" : "$"
  const dayNamesEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const dayNamesHe = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"]
  const dayNames = isHebrew ? dayNamesHe : dayNamesEn

  useEffect(() => {
    async function fetchData() {
      // Use index-based array to maintain order
      const localDayNames = isHebrew 
        ? ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"]
        : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      
      if (!shopId) {
        // Show empty data if no shop - all zeros, starting from Sunday
        const emptyData = localDayNames.map((day) => ({
          day,
          revenue: 0,
        }))
        setCurrentWeekData(emptyData)
        setLastWeekData(emptyData)
        setLoading(false)
        return
      }

      const supabase = createClient()
      
      // Get current week (last 7 days)
      const currentEndDate = new Date()
      const currentStartDate = new Date()
      currentStartDate.setDate(currentStartDate.getDate() - 6)

      // Get last week (7-14 days ago)
      const lastWeekEndDate = new Date()
      lastWeekEndDate.setDate(lastWeekEndDate.getDate() - 7)
      const lastWeekStartDate = new Date()
      lastWeekStartDate.setDate(lastWeekStartDate.getDate() - 13)

      const [currentWeekResult, lastWeekResult] = await Promise.all([
        supabase
          .from("transactions")
          .select("amount, created_at")
          .eq("shop_id", shopId)
          .gte("created_at", currentStartDate.toISOString())
          .lte("created_at", currentEndDate.toISOString()),
        supabase
          .from("transactions")
          .select("amount, created_at")
          .eq("shop_id", shopId)
          .gte("created_at", lastWeekStartDate.toISOString())
          .lte("created_at", lastWeekEndDate.toISOString())
      ])

      // Process current week - use array index to maintain order
      const currentRevenueByIndex: number[] = [0, 0, 0, 0, 0, 0, 0]
      currentWeekResult.data?.forEach((t) => {
        const dayIndex = new Date(t.created_at).getDay()
        currentRevenueByIndex[dayIndex] += Number(t.amount)
      })

      // Process last week
      const lastRevenueByIndex: number[] = [0, 0, 0, 0, 0, 0, 0]
      lastWeekResult.data?.forEach((t) => {
        const dayIndex = new Date(t.created_at).getDay()
        lastRevenueByIndex[dayIndex] += Number(t.amount)
      })

      // Convert to array with day names in correct order
      setCurrentWeekData(localDayNames.map((day, i) => ({ day, revenue: currentRevenueByIndex[i] })))
      setLastWeekData(localDayNames.map((day, i) => ({ day, revenue: lastRevenueByIndex[i] })))
      setLoading(false)
    }

    fetchData()
  }, [shopId, isHebrew])

  const data = showLastWeek ? lastWeekData : currentWeekData
  const maxRevenue = Math.max(...data.map(d => d.revenue), 1)
  const total = data.reduce((sum, d) => sum + d.revenue, 0)
  const lastWeekTotal = lastWeekData.reduce((sum, d) => sum + d.revenue, 0)
  const currentWeekTotal = currentWeekData.reduce((sum, d) => sum + d.revenue, 0)
  const percentChange = lastWeekTotal > 0 ? ((currentWeekTotal - lastWeekTotal) / lastWeekTotal * 100).toFixed(1) : "0"

  return (
    <div className="glass rounded-xl p-4 sm:p-6 overflow-hidden">
      <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div>
          <h2 className="text-lg font-semibold">{t("dashboard.weeklyRevenue")}</h2>
          <p className="text-xs text-muted-foreground">
            {showLastWeek 
              ? (isHebrew ? "שבוע שעבר" : "Last week") 
              : (isHebrew ? "השבוע הנוכחי" : "Current week")}
          </p>
        </div>
        <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button 
            onClick={() => setShowLastWeek(false)}
            className={`p-1.5 rounded-md transition-colors ${!showLastWeek ? 'bg-primary/20 text-primary' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setShowLastWeek(true)}
            className={`p-1.5 rounded-md transition-colors ${showLastWeek ? 'bg-primary/20 text-primary' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="w-full">
        {loading ? (
          <div className="h-[200px] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {data.map((item, index) => (
                <div key={index} className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-xs text-muted-foreground w-8">{item.day}</span>
                  <div className="flex-1 h-8 bg-background/50 rounded-md overflow-hidden">
                    <div 
                      className={`h-full rounded-md transition-all duration-500 ${showLastWeek ? 'bg-muted-foreground/60' : 'bg-primary'} ${isRTL ? 'ml-auto' : ''}`}
                      style={{ width: `${Math.max((item.revenue / maxRevenue) * 100, item.revenue > 0 ? 5 : 0)}%` }}
                    />
                  </div>
                  <span className={`text-xs font-medium w-20 font-mono ${isRTL ? 'text-left' : 'text-right'}`}>
                    {currency}{item.revenue.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className={`mt-4 pt-4 border-t border-border/30 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-sm text-muted-foreground">
                {showLastWeek 
                  ? (isHebrew ? "סה״כ שבוע שעבר" : "Total last week")
                  : (isHebrew ? "סה״כ השבוע" : "Total this week")}
              </span>
              <span className={`text-xl font-bold ${showLastWeek ? 'text-muted-foreground' : 'text-primary'}`}>
                {currency}{total.toLocaleString()}
              </span>
            </div>
            {showLastWeek && lastWeekTotal > 0 && (
              <div className={`mt-3 flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                <span className={`text-sm font-bold ${Number(percentChange) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Number(percentChange) >= 0 ? '+' : ''}{percentChange}%
                </span>
                <span className="text-xs text-muted-foreground">
                  {isHebrew ? "השבוע לעומת שבוע שעבר" : "this week vs last"}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
