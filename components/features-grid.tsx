"use client"

import { 
  Calendar, 
  Users, 
  CreditCard, 
  BarChart3, 
  Bell, 
  Beaker,
  Camera,
  Package,
  UsersRound,
  CalendarDays,
  ShieldCheck,
  ChevronDown,
  Check,
  X
} from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { useLanguage } from "@/lib/i18n/language-context"

export function FeaturesGrid() {
  const { t, isRTL, locale } = useLanguage()
  const isHebrew = locale === 'he'
  const [permissionsExpanded, setPermissionsExpanded] = useState(false)

  // Permissions data for the table
  const permissions = [
    { feature: isHebrew ? "תורים משלהם" : "Own Appointments", team: true, owner: true },
    { feature: isHebrew ? "כל התורים" : "All Appointments", team: false, owner: true },
    { feature: isHebrew ? "לקוחות שטיפלו" : "Clients They Served", team: true, owner: true },
    { feature: isHebrew ? "כל הלקוחות" : "All Clients Data", team: false, owner: true },
    { feature: isHebrew ? "נתונים פיננסיים" : "Financial Data", team: false, owner: true },
    { feature: isHebrew ? "אנליטיקה והכנסות" : "Analytics & Revenue", team: false, owner: true },
    { feature: isHebrew ? "ניהול צוות" : "Team Management", team: false, owner: true },
    { feature: isHebrew ? "הגדרות חנות" : "Shop Settings", team: false, owner: true },
    { feature: isHebrew ? "שירותים ומחירים" : "Services & Pricing", team: false, owner: true },
    { feature: isHebrew ? "תור המתנה" : "Walk-in Queue", team: true, owner: true },
  ]

  const features = [
    {
      icon: Calendar,
      title: t("features.scheduling.title"),
      description: t("features.scheduling.description"),
      image: "/images/features/scheduling.jpg",
    },
    {
      icon: Users,
      title: t("features.clients.title"),
      description: t("features.clients.description"),
      image: "/images/features/clients.jpg",
    },
    {
      icon: Beaker,
      title: t("features.chemistry.title"),
      description: t("features.chemistry.description"),
      image: "/images/features/chemistry.jpg",
    },
    {
      icon: Camera,
      title: t("features.photos.title"),
      description: t("features.photos.description"),
      image: "/images/features/photos.jpg",
    },
    {
      icon: BarChart3,
      title: t("features.analytics.title"),
      description: t("features.analytics.description"),
      image: "/images/features/analytics.jpg",
    },
    {
      icon: Bell,
      title: t("features.reminders.title"),
      description: t("features.reminders.description"),
      image: "/images/features/reminders.jpg",
    },
    {
      icon: UsersRound,
      title: t("features.queue.title"),
      description: t("features.queue.description"),
      image: "/images/features/queue.jpg",
    },
    {
      icon: CalendarDays,
      title: t("features.teamSchedule.title"),
      description: t("features.teamSchedule.description"),
      image: "/images/features/scheduling.jpg",
    },
    {
      icon: Package,
      title: t("features.inventory.title"),
      description: t("features.inventory.description"),
      image: "/images/features/inventory.jpg",
    },
    {
      icon: CreditCard,
      title: t("features.payments.title"),
      description: t("features.payments.description"),
      image: "/images/features/payments.jpg",
    },
    {
      icon: ShieldCheck,
      title: t("features.permissions.title"),
      description: t("features.permissions.description"),
      image: null, // Special card - no image, has table instead
      isPermissions: true,
    },
  ]

  return (
    <section id="features" className="relative py-24 md:py-32" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full bg-primary/3 blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-4">
            {t("features.sectionLabel")}
          </p>
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance ${isHebrew ? 'font-hebrew-display' : ''}`}>
            {t("features.sectionTitle")}
            <span className="text-gradient"> {t("features.sectionTitleHighlight")}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("features.sectionSubtitle")}
          </p>
        </div>

        {/* Features Grid - Equal Size Boxes with Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isPermissionsCard = (feature as any).isPermissions
            
            return (
              <div
                key={index}
                className="group relative glass rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-500"
              >
                {/* Preview Image or Permissions Table */}
                {isPermissionsCard ? (
                  <div className="relative h-40 bg-gradient-to-br from-primary/10 via-background to-background overflow-hidden">
                    {/* Header with icon */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center backdrop-blur-sm group-hover:glow-amber-soft transition-all duration-300">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                        {feature.title}
                      </h3>
                    </div>
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-4 right-4 w-20 h-20 border border-primary/30 rounded-lg rotate-12" />
                      <div className="absolute top-8 right-8 w-16 h-16 border border-primary/20 rounded-lg rotate-6" />
                    </div>
                  </div>
                ) : (
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={feature.image!}
                      alt={feature.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                    
                    {/* Icon overlay */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center backdrop-blur-sm group-hover:glow-amber-soft transition-all duration-300">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                        {feature.title}
                      </h3>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-5">
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {feature.description}
                  </p>
                  
                  {/* Permissions Table (collapsible) */}
                  {isPermissionsCard && (
                    <div className="mt-4">
                      <button
                        onClick={() => setPermissionsExpanded(!permissionsExpanded)}
                        className="flex items-center gap-2 text-primary text-sm font-medium hover:underline w-full justify-between"
                      >
                        <span>{isHebrew ? "הצג טבלת הרשאות" : "View Permissions Table"}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${permissionsExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {permissionsExpanded && (
                        <div className="mt-4 border border-border/50 rounded-lg overflow-hidden">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="bg-muted/30">
                                <th className={`p-2 ${isRTL ? 'text-right' : 'text-left'} font-medium text-foreground`}>
                                  {isHebrew ? "תכונה" : "Feature"}
                                </th>
                                <th className="p-2 text-center font-medium text-foreground w-16">
                                  {isHebrew ? "צוות" : "Team"}
                                </th>
                                <th className="p-2 text-center font-medium text-foreground w-16">
                                  {isHebrew ? "בעלים" : "Owner"}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {permissions.map((perm, i) => (
                                <tr key={i} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/10'}>
                                  <td className={`p-2 ${isRTL ? 'text-right' : 'text-left'} text-muted-foreground`}>
                                    {perm.feature}
                                  </td>
                                  <td className="p-2 text-center">
                                    {perm.team ? (
                                      <Check className="w-4 h-4 text-green-500 mx-auto" />
                                    ) : (
                                      <X className="w-4 h-4 text-red-500/70 mx-auto" />
                                    )}
                                  </td>
                                  <td className="p-2 text-center">
                                    {perm.owner ? (
                                      <Check className="w-4 h-4 text-green-500 mx-auto" />
                                    ) : (
                                      <X className="w-4 h-4 text-red-500/70 mx-auto" />
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div className="p-2 bg-muted/20 text-[10px] text-muted-foreground text-center">
                            {isHebrew 
                              ? "עובדים שפוטרו מאבדים גישה מיידית" 
                              : "Fired employees lose access immediately"}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                </div>

                {/* Corner accent */}
                <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} w-20 h-20 overflow-hidden pointer-events-none`}>
                  <div className={`absolute top-4 ${isRTL ? 'left-[-30px]' : 'right-[-30px]'} w-[80px] h-px bg-primary/30 ${isRTL ? '-rotate-45' : 'rotate-45'}`} />
                  <div className={`absolute top-8 ${isRTL ? 'left-[-26px]' : 'right-[-26px]'} w-[70px] h-px bg-primary/20 ${isRTL ? '-rotate-45' : 'rotate-45'}`} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
