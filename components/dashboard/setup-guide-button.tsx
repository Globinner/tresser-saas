"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { HelpCircle } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { useOnboardingTrigger } from "@/components/dashboard/onboarding-provider"

export function SetupGuideButton() {
  const { t } = useLanguage()
  const { startWalkthrough } = useOnboardingTrigger()

  return (
    <Card className="mt-6 border-dashed">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">{t("onboarding.helpButton")}</p>
              <p className="text-sm text-muted-foreground">{t("onboarding.helpButtonDescription")}</p>
            </div>
          </div>
          <Button variant="outline" onClick={startWalkthrough}>
            {t("onboarding.showMeHow")}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
