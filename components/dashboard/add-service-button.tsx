"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/language-context"
import { cn } from "@/lib/utils"

export function AddServiceButton() {
  const { locale, isRTL } = useLanguage()
  const isHebrew = locale === 'he'

  return (
    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-amber-soft">
      <Plus className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
      {isHebrew ? "הוסף שירות" : "Add Service"}
    </Button>
  )
}
