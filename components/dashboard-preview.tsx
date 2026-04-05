"use client"

import { TrendingUp, Users, DollarSign, Clock, MoreVertical, ArrowUpRight } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

export function DashboardPreview() {
  const { t, isRTL, locale, isLocaleReady } = useLanguage()
  const isHebrew = locale === 'he'
  
  // Don't render until locale is FULLY determined to avoid flash of wrong language
  if (!isLocaleReady) {
    return (
      <section id="dashboard" className="relative py-24 md:py-32 overflow-hidden">
        <div className="container mx-auto px-6 flex justify-center items-center min-h-[600px]">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    )
  }

  const appointments = isHebrew ? [
    { time: "09:00", client: "יוסי כהן", service: "פייד", barber: "מיכאל", avatar: "יכ", status: "confirmed" },
    { time: "10:30", client: "דוד לוי", service: "תספורת קלאסית", barber: "מיכאל", avatar: "דל", status: "confirmed" },
    { time: "12:00", client: "אבי מזרחי", service: "עיצוב זקן", barber: "שרה", avatar: "אמ", status: "pending" },
    { time: "14:00", client: "משה פרץ", service: "צביעת שיער", barber: "שרה", avatar: "מפ", status: "confirmed" },
    { time: "15:30", client: "רון ביטון", service: "שיער + זקן", barber: "מיכאל", avatar: "רב", status: "confirmed" },
  ] : [
    { time: "09:00", client: "Marcus Johnson", service: "Fade", barber: "Mike", avatar: "MJ", status: "confirmed" },
    { time: "10:30", client: "David Chen", service: "Classic Haircut", barber: "Mike", avatar: "DC", status: "confirmed" },
    { time: "12:00", client: "James Wilson", service: "Beard Trim", barber: "Sarah", avatar: "JW", status: "pending" },
    { time: "14:00", client: "Alex Thompson", service: "Hair Color", barber: "Sarah", avatar: "AT", status: "confirmed" },
    { time: "15:30", client: "Michael Rodriguez", service: "Hair & Beard Combo", barber: "Mike", avatar: "MR", status: "confirmed" },
  ]

  const statsData = isHebrew ? [
    { label: t("dashboard.revenue"), value: "₪3,020", change: "+12%", icon: DollarSign },
    { label: t("sidebar.appointments"), value: "12", change: "+3", icon: Clock },
    { label: t("clients.title"), value: "4", change: "+2", icon: Users },
  ] : [
    { label: t("dashboard.revenue"), value: "$847", change: "+12%", icon: DollarSign },
    { label: t("sidebar.appointments"), value: "12", change: "+3", icon: Clock },
    { label: t("clients.title"), value: "4", change: "+2", icon: Users },
  ]

  return (
    <section id="dashboard" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-4">
            {t("dashboardPreview.badge")}
          </p>
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance ${isHebrew ? 'font-hebrew-display' : ''}`}>
            {t("dashboardPreview.title")}
            <span className="text-gradient"> {t("dashboardPreview.titleHighlight")}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("dashboardPreview.subtitle")}
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className={`max-w-6xl mx-auto ${isRTL ? 'rtl' : ''}`}>
          <div className="glass-strong rounded-3xl p-4 md:p-6 glow-amber-soft">
            {/* Dashboard Header */}
            <div className={`flex items-center justify-between mb-6 pb-4 border-b border-border/30 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={isRTL ? 'text-right' : ''}>
                <h3 className="text-xl font-semibold text-foreground">{t("dashboardPreview.greeting")}</h3>
                <p className="text-sm text-muted-foreground">{t("dashboardPreview.subgreeting")}</p>
              </div>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-sm text-muted-foreground">14/03/2026</span>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {statsData.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div 
                    key={index}
                    className="bg-secondary/50 rounded-xl p-4 border border-border/30 hover:border-primary/30 transition-all duration-300 group"
                  >
                    <div className={`flex items-start justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className={`text-xs text-primary font-medium flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {stat.change}
                        <TrendingUp className="w-3 h-3" />
                      </span>
                    </div>
                    <p className={`text-2xl font-bold text-foreground mb-1 ${isRTL ? 'text-right' : ''}`}>{stat.value}</p>
                    <p className={`text-sm text-muted-foreground ${isRTL ? 'text-right' : ''}`}>{stat.label}</p>
                  </div>
                )
              })}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Appointments List */}
              <div className="lg:col-span-2 bg-secondary/30 rounded-xl p-4 border border-border/30">
                <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h4 className="font-semibold text-foreground">{t("dashboard.todayAppointments")}</h4>
                  <button className={`text-primary text-sm hover:underline flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {t("dashboard.viewAll")} <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-3">
                  {appointments.map((apt, index) => (
                    <div 
                      key={index}
                      className={`flex items-center gap-4 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors border border-transparent hover:border-primary/20 ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <span className="text-sm text-muted-foreground w-12 font-mono">{apt.time}</span>
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary border border-primary/30">
                        {apt.avatar}
                      </div>
                      <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
                        <p className="font-medium text-foreground truncate">{apt.client}</p>
                        <p className="text-sm text-muted-foreground truncate">{apt.service} • {apt.barber}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        apt.status === 'confirmed' 
                          ? 'bg-primary/10 text-primary border border-primary/30' 
                          : 'bg-secondary text-muted-foreground border border-border/50'
                      }`}>
                        {apt.status === 'confirmed' ? t("appointments.status.confirmed") : t("appointments.status.scheduled")}
                      </div>
                      <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats Chart */}
              <div className="bg-secondary/30 rounded-xl p-4 border border-border/30">
                <h4 className={`font-semibold text-foreground mb-4 ${isRTL ? 'text-right' : ''}`}>{t("dashboardPreview.weeklyRevenue")}</h4>
                <div className="space-y-4">
                  {(isHebrew ? [
                    { day: "א׳", width: 56, value: "₪1,850" },
                    { day: "ב׳", width: 70, value: "₪2,300" },
                    { day: "ג׳", width: 52, value: "₪1,700" },
                    { day: "ד׳", width: 78, value: "₪2,550" },
                    { day: "ה׳", width: 92, value: "₪3,020" },
                    { day: "ו׳", width: 100, value: "₪3,280" },
                    { day: "ש׳", width: 3, value: "₪0" },
                  ] : [
                    { day: t("dashboardPreview.days.mon"), width: 57, value: "$520" },
                    { day: t("dashboardPreview.days.tue"), width: 71, value: "$650" },
                    { day: t("dashboardPreview.days.wed"), width: 52, value: "$480" },
                    { day: t("dashboardPreview.days.thu"), width: 78, value: "$720" },
                    { day: t("dashboardPreview.days.fri"), width: 92, value: "$850" },
                    { day: t("dashboardPreview.days.sat"), width: 100, value: "$920" },
                    { day: t("dashboardPreview.days.sun"), width: 66, value: "$610" },
                  ]).map((item, index) => (
                    <div key={index} className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-xs text-muted-foreground w-8">{item.day}</span>
                      <div className="flex-1 h-8 bg-background/50 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-500 ${isRTL ? 'ml-auto' : ''}`}
                          style={{ width: `${item.width}%`, minWidth: item.width > 0 ? '8px' : '0' }}
                        />
                      </div>
                      <span className={`text-xs font-medium text-foreground w-16 font-mono ${isRTL ? 'text-left' : 'text-right'}`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
                <div className={`mt-4 pt-4 border-t border-border/30 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-sm text-muted-foreground">{t("analytics.thisWeek")}</span>
                  <span className="text-lg font-bold text-gradient">{isHebrew ? "₪14,700" : "$4,750"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
