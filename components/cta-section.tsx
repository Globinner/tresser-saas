"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Scissors } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

export function CTASection() {
  const { t, isRTL, locale } = useLanguage()
  const isHebrew = locale === 'he'

  return (
    <section className="relative py-24 md:py-32 overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Background with dramatic effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/10 blur-[200px]" />
        
        {/* Animated lines */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/30 glow-amber animate-float">
            <Scissors className="w-10 h-10 text-primary rotate-[-45deg]" />
          </div>

          {/* Headline */}
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance ${isHebrew ? 'font-hebrew-display' : ''}`}>
            {t("cta.title")}
            <br />
            <span className="text-gradient">{t("cta.titleHighlight")}</span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            {t("cta.subtitle")}
          </p>

          {/* CTAs */}
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-7 text-lg glow-amber group"
              asChild
            >
              <a href="/auth/sign-up">
                {t("cta.startTrial")}
                <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
              </a>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-border/50 hover:border-primary/50 px-10 py-7 text-lg"
              asChild
            >
              <a href="/demo">
                {t("cta.scheduleDemo")}
              </a>
            </Button>
          </div>

          {/* Guarantee */}
          <p className="mt-8 text-sm text-muted-foreground">
            {t("cta.guarantee")}
          </p>
        </div>
      </div>
    </section>
  )
}
