"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, ArrowRight, X } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { useOnboardingTrigger } from "@/components/dashboard/onboarding-provider"
import { useState, useEffect } from "react"

export function WelcomeCard() {
  const { startWalkthrough } = useOnboardingTrigger()
  const { t } = useLanguage()
  const [dismissed, setDismissed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const isDismissed = localStorage.getItem("tresser_welcome_dismissed")
    if (isDismissed) {
      setDismissed(true)
    }
  }, [])

  const handleDismiss = () => {
    localStorage.setItem("tresser_welcome_dismissed", "true")
    setDismissed(true)
  }

  const handleStartGuide = () => {
    startWalkthrough()
  }

  if (!mounted || dismissed) {
    return null
  }

  return (
    <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
      
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {t("onboarding.welcome")}
              </h2>
              <p className="text-lg text-primary font-medium mt-1">
                {t("onboarding.welcomeSubtitle")}
              </p>
            </div>
            
            <p className="text-muted-foreground leading-relaxed">
              {t("onboarding.welcomeDescription")}
            </p>
            
            <div className="flex flex-wrap gap-3 pt-2">
              <Button onClick={handleStartGuide} size="lg" className="gap-2">
                {t("onboarding.startSetupGuide")}
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="lg" onClick={handleDismiss}>
                {t("onboarding.maybeLater")}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
