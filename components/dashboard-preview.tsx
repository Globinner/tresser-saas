"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { DemoContent } from "@/app/demo/page"

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

        {/* Embedded Demo */}
        <div className={`max-w-7xl mx-auto ${isRTL ? 'rtl' : ''}`}>
          <div className="glass-strong rounded-3xl overflow-hidden glow-amber-soft" style={{ height: '700px' }}>
            <DemoContent embedded={true} />
          </div>
        </div>
      </div>
    </section>
  )
}
