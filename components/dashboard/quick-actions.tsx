"use client"

import Link from "next/link"
import { Plus, Calendar, UserPlus, Scissors } from "lucide-react"
import { Button } from "@/components/ui/button"

export function QuickActions() {
  const actions = [
    {
      name: "New Appointment",
      description: "Schedule a new booking",
      icon: Calendar,
      href: "/dashboard/appointments?new=true",
      primary: true,
    },
    {
      name: "Add Client",
      description: "Register a new client",
      icon: UserPlus,
      href: "/dashboard/clients?new=true",
    },
    {
      name: "Add Service",
      description: "Create a new service",
      icon: Scissors,
      href: "/dashboard/services?new=true",
    },
  ]

  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((action) => (
        <Link key={action.name} href={action.href}>
          <Button
            variant={action.primary ? "default" : "outline"}
            className={action.primary 
              ? "bg-primary text-primary-foreground hover:bg-primary/90 glow-amber-soft" 
              : "border-border hover:bg-secondary hover:border-primary/30"
            }
          >
            <action.icon className="w-4 h-4 mr-2" />
            {action.name}
          </Button>
        </Link>
      ))}
    </div>
  )
}
