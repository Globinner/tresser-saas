"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Sparkles, Users, Calendar, TrendingUp } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

export function HeroSection() {
  const { t, isRTL, locale, isLoading } = useLanguage()
  const isHebrew = locale === 'he'

  // Show nothing until language is loaded to prevent flash
  if (isLoading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-12 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Skeleton loader */}
            <div className="animate-pulse">
              <div className="h-8 w-48 bg-muted/20 rounded-full mx-auto mb-8" />
              <div className="h-16 w-3/4 bg-muted/20 rounded-lg mx-auto mb-4" />
              <div className="h-16 w-2/3 bg-muted/20 rounded-lg mx-auto mb-4" />
              <div className="h-16 w-1/2 bg-muted/20 rounded-lg mx-auto mb-8" />
              <div className="h-6 w-2/3 bg-muted/20 rounded-lg mx-auto mb-10" />
              <div className="flex gap-4 justify-center mb-16">
                <div className="h-14 w-40 bg-muted/20 rounded-lg" />
                <div className="h-14 w-40 bg-muted/20 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-12 overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Dramatic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/8 blur-[100px]" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, oklch(0.78 0.18 75 / 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, oklch(0.78 0.18 75 / 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
        
        {/* Diagonal lines */}
        <div className="absolute top-20 right-20 w-64 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent rotate-45" />
        <div className="absolute bottom-40 left-20 w-48 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent -rotate-45" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Floating Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 mb-8 animate-slide-up">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">
              {t("hero.badge")}
            </span>
          </div>

          {/* Main Headline */}
          <h1 
            className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 animate-slide-up ${isHebrew ? 'font-hebrew-display' : ''}`} 
            style={{ animationDelay: '0.1s' }}
          >
            <span className="block text-foreground">{t("hero.titleLine1")}</span>
            <span className="block text-foreground">{t("hero.titleLine2")}</span>
            <span className="block text-gradient">{t("hero.titleLine3")}</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {t("hero.subtitle")}
          </p>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up ${isRTL ? 'sm:flex-row-reverse' : ''}`} style={{ animationDelay: '0.3s' }}>
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg glow-amber group transition-all duration-300"
              asChild
            >
              <a href="/auth/sign-up">
                {t("nav.startFreeTrial")}
                <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
              </a>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary/50 hover:border-primary bg-primary/10 hover:bg-primary/20 px-10 py-7 text-lg font-semibold group relative overflow-hidden transition-all duration-300 shadow-[0_0_20px_rgba(217,160,50,0.3)] hover:shadow-[0_0_30px_rgba(217,160,50,0.5)]"
              asChild
            >
              <a href="/demo">
                <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 animate-shimmer" />
                <Play className={`w-6 h-6 text-primary group-hover:scale-125 transition-transform ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t("hero.watchDemo")}
              </a>
            </Button>
          </div>

          {/* Floating Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="glass rounded-xl p-4 flex items-center gap-4 hover:border-primary/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:glow-amber-soft transition-all">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="font-semibold text-foreground">{t("hero.featureBooking")}</p>
                <p className="text-sm text-muted-foreground">{t("hero.featureBookingDesc")}</p>
              </div>
            </div>
            
            <div className="glass rounded-xl p-4 flex items-center gap-4 hover:border-primary/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:glow-amber-soft transition-all">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="font-semibold text-foreground">{t("hero.featureCRM")}</p>
                <p className="text-sm text-muted-foreground">{t("hero.featureCRMDesc")}</p>
              </div>
            </div>
            
            <div className="glass rounded-xl p-4 flex items-center gap-4 hover:border-primary/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:glow-amber-soft transition-all">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="font-semibold text-foreground">{t("hero.featureAnalytics")}</p>
                <p className="text-sm text-muted-foreground">{t("hero.featureAnalyticsDesc")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
