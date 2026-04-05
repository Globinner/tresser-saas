"use client"

import Link from "next/link"
import { Calendar, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/language-context"

export function QuickActions() {
  const { t, isRTL } = useLanguage()

  const actions = [
    {
      name: t("dashboard.newAppointment"),
      icon: Calendar,
      href: "/dashboard/appointments?new=true",
      primary: true,
    },
    {
      name: t("dashboard.addClient"),
      icon: UserPlus,
      href: "/dashboard/clients?new=true",
    },
  ]

  return (
    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
      {actions.map((action) => (
        <Link key={action.name} href={action.href}>
          <Button
            variant={action.primary ? "default" : "outline"}
            size="sm"
            className={action.primary 
              ? "bg-primary text-primary-foreground hover:bg-primary/90 glow-amber-soft" 
              : "border-border hover:bg-secondary hover:border-primary/30"
            }
          >
            <action.icon className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {action.name}
          </Button>
        </Link>
      ))}
    </div>
  )
}
