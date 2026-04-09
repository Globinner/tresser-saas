"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { ArrowRight, Calendar, Users, DollarSign, Clock } from "lucide-react"

export function DashboardPreview() {
  const { t, isRTL, locale, isLocaleReady } = useLanguage()
  const isHebrew = locale === 'he'
  
  if (!isLocaleReady) {
    return (
      <section id="dashboard" className="relative py-24 md:py-32 overflow-hidden">
        <div className="container mx-auto px-6 flex justify-center items-center min-h-[600px]">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    )
  }

  // Demo data
  const stats = [
    { icon: Calendar, value: "5", label: isHebrew ? "תורים היום" : "Today's Appointments", change: "+12%" },
    { icon: Users, value: "127", label: isHebrew ? "סה״כ לקוחות" : "Total Clients", change: "+8%" },
    { icon: DollarSign, value: isHebrew ? "₪4,750" : "$4,750", label: isHebrew ? "הכנסות השבוע" : "This Week Revenue", change: "+23%" },
    { icon: Clock, value: "3", label: isHebrew ? "ממתינים בתור" : "Walk-ins Waiting", badge: "3" },
  ]

  const appointments = [
    { time: "09:00", initials: "MJ", name: isHebrew ? "מרקוס ג׳ונסון" : "Marcus Johnson", service: isHebrew ? "פייד" : "Fade", barber: isHebrew ? "מייק" : "Mike", status: "confirmed" },
    { time: "10:30", initials: "DC", name: isHebrew ? "דוד חן" : "David Chen", service: isHebrew ? "תספורת קלאסית" : "Classic Haircut", barber: isHebrew ? "מייק" : "Mike", status: "confirmed" },
    { time: "11:00", initials: "JW", name: isHebrew ? "ג׳יימס וויליאמס" : "James Williams", service: isHebrew ? "עיצוב זקן" : "Beard Trim", barber: isHebrew ? "שרה" : "Sarah", status: "pending" },
    { time: "14:00", initials: "AT", name: isHebrew ? "אלכס תומפסון" : "Alex Thompson", service: isHebrew ? "צביעת שיער" : "Hair Color", barber: isHebrew ? "שרה" : "Sarah", status: "confirmed" },
    { time: "15:30", initials: "MR", name: isHebrew ? "מייקל רודריגז" : "Michael Rodriguez", service: isHebrew ? "שיער + זקן" : "Hair & Beard Combo", barber: isHebrew ? "מייק" : "Mike", status: "confirmed" },
  ]

  const weeklyRevenue = [
    { day: isHebrew ? "א׳" : "Mon", amount: 520 },
    { day: isHebrew ? "ב׳" : "Tue", amount: 650 },
    { day: isHebrew ? "ג׳" : "Wed", amount: 480 },
    { day: isHebrew ? "ד׳" : "Thu", amount: 720 },
    { day: isHebrew ? "ה׳" : "Fri", amount: 850 },
    { day: isHebrew ? "ו׳" : "Sat", amount: 920 },
    { day: isHebrew ? "ש׳" : "Sun", amount: 610 },
  ]

  const maxRevenue = Math.max(...weeklyRevenue.map(d => d.amount))
  const totalRevenue = weeklyRevenue.reduce((sum, d) => sum + d.amount, 0)

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
          <div className="glass-strong rounded-3xl overflow-hidden glow-amber-soft p-4 md:p-6">
            {/* Dashboard Header with Greeting */}
            <div className="mb-6">
              <h3 className={`text-2xl font-bold ${isHebrew ? 'text-right' : 'text-left'}`}>
                {t("dashboardPreview.greeting")}
              </h3>
              <p className={`text-muted-foreground ${isHebrew ? 'text-right' : 'text-left'}`}>
                {t("dashboardPreview.subgreeting")}
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-card/50 border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <stat.icon className="w-5 h-5 text-primary" />
                      </div>
                      {stat.change && (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30 text-xs">
                          {stat.change}
                        </Badge>
                      )}
                      {stat.badge && (
                        <Badge className="bg-primary text-primary-foreground text-xs">
                          {stat.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Today's Schedule */}
              <Card className="bg-card/50 border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{isHebrew ? "לוח זמנים להיום" : "Today's Schedule"}</CardTitle>
                  <p className="text-sm text-muted-foreground">{isHebrew ? "נהל את התורים שלך" : "Manage your appointments"}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {appointments.map((apt, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                      <span className="text-primary font-mono text-sm w-12">{apt.time}</span>
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                          {apt.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{apt.name}</p>
                        <p className="text-xs text-muted-foreground">{apt.service}</p>
                      </div>
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Badge variant="outline" className="text-xs">{apt.barber}</Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${apt.status === 'confirmed' ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'}`}
                        >
                          {apt.status === 'confirmed' ? (isHebrew ? 'מאושר' : 'confirmed') : (isHebrew ? 'ממתין' : 'pending')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Weekly Revenue */}
              <Card className="bg-card/50 border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{isHebrew ? "הכנסות שבועיות" : "Weekly Revenue"}</CardTitle>
                  <p className="text-sm text-muted-foreground">{isHebrew ? "השבוע הנוכחי" : "Current week"}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {weeklyRevenue.map((day, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground w-8">{day.day}</span>
                        <div className="flex-1 h-6 bg-muted/30 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${(day.amount / maxRevenue) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-16 text-right">
                          {isHebrew ? `₪${day.amount}` : `$${day.amount}`}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className={`mt-4 pt-4 border-t border-border/50 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-sm text-muted-foreground">{isHebrew ? "סה״כ השבוע" : "Total this week"}</span>
                    <span className="text-xl font-bold text-primary">
                      {isHebrew ? `₪${totalRevenue.toLocaleString()}` : `$${totalRevenue.toLocaleString()}`}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* CTA Button */}
          <div className="flex justify-center mt-8">
            <Button size="lg" asChild className="glow-amber-soft">
              <Link href="/demo" className="gap-2">
                {t("dashboardPreview.tryDemo")}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
