"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, Zap, Tag, Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function PricingSection() {
  const { t, isRTL, locale } = useLanguage()
  const isHebrew = locale === 'he'
  const router = useRouter()
  const [couponCode, setCouponCode] = useState("")
  const [couponLoading, setCouponLoading] = useState(false)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    setCouponResult(null)
    
    // Redirect to signup with coupon code
    router.push(`/auth/sign-up?coupon=${couponCode.toUpperCase().trim()}`)
  }

  // Calculate savings percentages
  // Solo: $22/mo = $264/yr, yearly $215 = save 19%
  // Pro: $29/mo = $348/yr, yearly $278 = save 20%
  // Branch: $77/mo = $924/yr, yearly $785 = save 15%
  
  const plans = [
    {
      name: isHebrew ? "סולו" : "Solo",
      description: isHebrew ? "מושלם לספרים עצמאיים" : "Perfect for independent barbers",
      monthlyPrice: "22",
      yearlyPrice: "215",
      yearlySavings: "19",
      period: billingPeriod === 'monthly' 
        ? (isHebrew ? "/חודש" : "/month")
        : (isHebrew ? "/שנה" : "/year"),
      trial: isHebrew ? "14 יום ניסיון חינם" : "14-day free trial",
      features: isHebrew ? [
        "תורים ללא הגבלה",
        "ניהול לקוחות מלא",
        "רשומות כימיה",
        "ניתוח מתקדם",
        "תזכורות WhatsApp",
        "ניהול מלאי",
        "תמיכה במייל",
        "דף הזמנות מקוון",
      ] : [
        "Unlimited appointments",
        "Full client management",
        "Chemistry records",
        "Advanced analytics",
        "WhatsApp reminders",
        "Inventory management",
        "Email support",
        "Online booking page",
      ],
      cta: isHebrew ? "קבל את זה" : "Get It",
      popular: false,
      href: "/auth/sign-up?plan=solo",
    },
    {
      name: isHebrew ? "פרו" : "Pro",
      description: isHebrew ? "למספרות צומחות שצריכות יותר עוצמה" : "For growing shops that need more power",
      monthlyPrice: "29",
      yearlyPrice: "278",
      yearlySavings: "20",
      period: billingPeriod === 'monthly' 
        ? (isHebrew ? "/חודש" : "/month")
        : (isHebrew ? "/שנה" : "/year"),
      trial: isHebrew ? "14 יום ניסיון חינם" : "14-day free trial",
      features: isHebrew ? [
        "הכל בסולו",
        "ניהול צוות (עד 5)",
        "לוח משמרות שבועי",
        "דף הזמנות מקוון",
        "דוחות שכר",
        "תזכורות WhatsApp",
        "תמיכת WhatsApp בעדיפות",
        "מיתוג מותאם אישית",
        "תזכורות SMS",
        "דוחות מתקדמים",
      ] : [
        "Everything in Solo",
        "Team management (up to 5)",
        "Weekly team schedule",
        "Online booking page",
        "Payroll reports",
        "WhatsApp reminders",
        "Priority WhatsApp support",
        "Custom branding",
        "SMS reminders",
        "Advanced reports",
      ],
      cta: isHebrew ? "קבל את זה" : "Get It",
      popular: true,
      href: "/auth/sign-up?plan=pro",
    },
    {
      name: isHebrew ? "ברנ'ץ" : "Branch",
      description: isHebrew ? "למספרות עם מספר סניפים" : "For shops with multiple locations",
      monthlyPrice: "77",
      yearlyPrice: "785",
      yearlySavings: "15",
      period: billingPeriod === 'monthly' 
        ? (isHebrew ? "/חודש" : "/month")
        : (isHebrew ? "/שנה" : "/year"),
      trial: null,
      features: isHebrew ? [
        "הכל בפרו",
        "עד 3 סניפים",
        "חברי צוות ללא הגבלה",
        "לוח משמרות לכל הסניפים",
        "דוחות שכר",
        "תזכורות WhatsApp",
        "ניתוח לפי סניף",
        "תמיכה טלפונית בעדיפות",
      ] : [
        "Everything in Pro",
        "Up to 3 locations",
        "Unlimited team members",
        "Team schedule for all branches",
        "Payroll reports",
        "WhatsApp reminders",
        "Branch analytics",
        "Priority phone support",
      ],
      cta: isHebrew ? "קבל את זה" : "Get It",
      popular: false,
      href: "/auth/sign-up?plan=branch",
    },
  ]
  
  // For Hebrew RTL, reverse the order so Solo appears on left visually
  const displayPlans = isHebrew ? [...plans].reverse() : plans

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
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                billingPeriod === 'monthly' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {isHebrew ? "חודשי" : "Monthly"}
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                billingPeriod === 'yearly' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {isHebrew ? "שנתי" : "Yearly"}
              <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                {isHebrew ? "חסוך עד 20%" : "Save up to 20%"}
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {displayPlans.map((plan, index) => (
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
                    {t("pricing.mostPopular") !== "pricing.mostPopular" ? t("pricing.mostPopular") : "Most Popular"}
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-gradient">
                    ${billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                  </span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                {billingPeriod === 'yearly' && (
                  <p className="text-sm text-green-400 mt-2 font-medium">
                    {isHebrew ? `חסוך ${plan.yearlySavings}%` : `Save ${plan.yearlySavings}%`}
                  </p>
                )}
                {billingPeriod === 'monthly' && plan.trial && (
                  <p className="text-sm text-primary mt-2 font-medium">{plan.trial}</p>
                )}
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
              <Link href={plan.href}>
                <Button 
                  className={`w-full py-6 text-lg transition-all duration-300 ${
                    plan.popular 
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 glow-amber-soft' 
                      : 'bg-secondary hover:bg-secondary/80 text-foreground border border-border/50 hover:border-primary/30'
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Coupon Code Section */}
        <div className="max-w-md mx-auto mt-12 glass rounded-xl p-6">
          <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Tag className="w-5 h-5 text-primary" />
            </div>
            <div className={isRTL ? 'text-right' : ''}>
              <h3 className="font-semibold text-foreground">{isHebrew ? "יש לך קוד קופון?" : "Have a Coupon Code?"}</h3>
              <p className="text-sm text-muted-foreground">{isHebrew ? "הזן את הקוד שלך כדי להתחיל עם הנחה" : "Enter your code to get started with a discount"}</p>
            </div>
          </div>
          
          <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              placeholder={isHebrew ? "הזן קוד קופון" : "Enter coupon code"}
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className={`flex-1 bg-secondary/50 border-border uppercase ${isRTL ? 'text-right' : ''}`}
              disabled={couponLoading}
            />
            <Button 
              onClick={handleApplyCoupon}
              disabled={couponLoading || !couponCode.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {couponLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                isHebrew ? "החל" : "Apply"
              )}
            </Button>
          </div>
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
