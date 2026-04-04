"use client"

import { Button } from "@/components/ui/button"
import { Check, Zap } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

export function PricingSection() {
  const { t, isRTL, locale } = useLanguage()
  const isHebrew = locale === 'he'

  const plans = [
    {
      name: t("pricing.solo.name"),
      description: t("pricing.solo.description"),
      price: "22",
      period: t("pricing.perMonth"),
      features: [
        t("pricing.solo.feature1"),
        t("pricing.solo.feature2"),
        t("pricing.solo.feature3"),
        t("pricing.solo.feature4"),
        t("pricing.solo.feature5"),
        t("pricing.solo.feature6"),
      ],
      cta: t("nav.startFreeTrial"),
      popular: false,
    },
    {
      name: t("pricing.pro.name"),
      description: t("pricing.pro.description"),
      price: "29",
      period: t("pricing.perMonth"),
      features: [
        t("pricing.pro.feature1"),
        t("pricing.pro.feature2"),
        t("pricing.pro.feature3"),
        t("pricing.pro.feature4"),
        t("pricing.pro.feature5"),
        t("pricing.pro.feature6"),
        t("pricing.pro.feature7"),
        t("pricing.pro.feature8"),
      ],
      cta: t("nav.startFreeTrial"),
      popular: true,
    },
    {
      name: t("pricing.branch.name"),
      description: t("pricing.branch.description"),
      price: "49",
      period: t("pricing.perMonth"),
      features: [
        t("pricing.branch.feature1"),
        t("pricing.branch.feature2"),
        t("pricing.branch.feature3"),
        t("pricing.branch.feature4"),
        t("pricing.branch.feature5"),
        t("pricing.branch.feature6"),
      ],
      cta: t("pricing.contactSales"),
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="relative py-24 md:py-32" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-1/3 left-0 w-[300px] h-[300px] rounded-full bg-primary/3 blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-4">
            {t("pricing.sectionLabel")}
          </p>
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance ${isHebrew ? 'font-hebrew-display' : ''}`}>
            {t("pricing.sectionTitle")}
            <span className="text-gradient"> {t("pricing.sectionTitleHighlight")}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("pricing.sectionSubtitle")}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative glass rounded-2xl p-8 transition-all duration-500 ${
                plan.popular 
                  ? 'border-primary/50 glow-amber-soft scale-105 md:scale-110 z-10' 
                  : 'hover:border-primary/30'
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full text-sm font-semibold bg-primary text-primary-foreground flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    {t("pricing.mostPopular")}
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-gradient">${plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 border border-primary/30">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button 
                className={`w-full py-6 text-lg transition-all duration-300 ${
                  plan.popular 
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 glow-amber-soft' 
                    : 'bg-secondary hover:bg-secondary/80 text-foreground border border-border/50 hover:border-primary/30'
                }`}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className={`flex flex-wrap items-center justify-center gap-8 mt-16 text-muted-foreground text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Check className="w-4 h-4 text-primary" />
            {t("pricing.freeTrial")}
          </span>
          <span className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Check className="w-4 h-4 text-primary" />
            {t("pricing.noCard")}
          </span>
          <span className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Check className="w-4 h-4 text-primary" />
            {t("pricing.cancelAnytime")}
          </span>
        </div>
      </div>
    </section>
  )
}
