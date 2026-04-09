"use client"

import { 
  Calendar, 
  CalendarDays,
  Users, 
  CreditCard, 
  BarChart3, 
  Bell, 
  Beaker,
  Camera,
  Package,
  UsersRound
} from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/lib/i18n/language-context"

export function FeaturesGrid() {
  const { t, isRTL, locale } = useLanguage()
  const isHebrew = locale === 'he'

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
      icon: UsersRound,
      title: t("features.teamManagement.title"),
      description: t("features.teamManagement.description"),
      image: "/images/features/team.jpg",
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
            
            return (
              <div
                key={index}
                className="group relative glass rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-500"
              >
                {/* Preview Image */}
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={feature.image}
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

{/* Content */}
                <div className="p-5">
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {feature.description}
                  </p>
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
