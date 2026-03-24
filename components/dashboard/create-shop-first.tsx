"use client"

import { Button } from "@/components/ui/button"
import { Store, ArrowRight, Settings } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/context"

interface CreateShopFirstProps {
  featureName?: string
}

export function CreateShopFirst({ featureName }: CreateShopFirstProps) {
  const { t, isRTL } = useLanguage()
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Store className="w-8 h-8 text-primary" />
      </div>
      
      <h2 className="text-2xl font-bold text-foreground mb-2">
        {t("onboarding.createShopFirst")}
      </h2>
      
      <p className="text-muted-foreground max-w-md mb-8">
        {t("onboarding.createShopDescription")}
        {featureName && (
          <span className="block mt-2 text-sm">
            {isRTL ? `תכונה: ${featureName}` : `Feature: ${featureName}`}
          </span>
        )}
      </p>
      
      <Button asChild size="lg">
        <Link href="/dashboard/settings">
          <Settings className="w-4 h-4" />
          <span className="mx-2">{t("onboarding.goToSettings")}</span>
          <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
        </Link>
      </Button>
    </div>
  )
}
