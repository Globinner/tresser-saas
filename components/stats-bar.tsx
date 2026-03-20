"use client"

import { useLanguage } from "@/lib/i18n/language-context"

export function StatsBar() {
  const { t, isRTL } = useLanguage()

  const stats = [
    { value: "2.5M+", label: t("stats.appointments"), highlight: true },
    { value: "98%", label: t("stats.retention") },
    { value: "45%", label: t("stats.revenue") },
    { value: "24/7", label: t("stats.support") },
  ]

  return (
    <section className="relative py-12 border-y border-border/30" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Subtle glow line */}
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center group"
            >
              <p className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-2 ${
                stat.highlight ? 'text-gradient' : 'text-foreground'
              }`}>
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </section>
  )
}
