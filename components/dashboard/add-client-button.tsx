"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/language-context"
import { cn } from "@/lib/utils"

export function AddClientButton() {
  const { locale, isRTL } = useLanguage()
  const isHebrew = locale === 'he'

  return (
    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-amber-soft">
      <Plus className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
      {isHebrew ? "הוסף לקוח" : "Add Client"}
    </Button>
  )
}
