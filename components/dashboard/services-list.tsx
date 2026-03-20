"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { 
  Scissors, 
  Clock, 
  DollarSign,
  MoreVertical,
  Trash2,
  Edit,
  ToggleLeft,
  ToggleRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface Service {
  id: string
  name: string
  description: string | null
  duration_minutes: number
  price: number
  is_active: boolean
  created_at: string
}

interface ServicesListProps {
  services: Service[]
}

export function ServicesList({ services }: ServicesListProps) {
  const router = useRouter()
  const supabase = createClient()
  const [updating, setUpdating] = useState<string | null>(null)

  async function toggleActive(serviceId: string, currentStatus: boolean) {
    setUpdating(serviceId)
    await supabase
      .from("services")
      .update({ is_active: !currentStatus })
      .eq("id", serviceId)
    router.refresh()
    setUpdating(null)
  }

  async function handleDelete(serviceId: string) {
    if (!confirm("Are you sure you want to delete this service?")) return
    
    setUpdating(serviceId)
    await supabase.from("services").delete().eq("id", serviceId)
    router.refresh()
    setUpdating(null)
  }

  if (services.length === 0) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-6">
          <Scissors className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No services yet</h3>
        <p className="text-muted-foreground mb-6">
          Create your first service to start booking appointments
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <div
          key={service.id}
          className={cn(
            "glass rounded-xl p-6 hover:border-primary/30 transition-all duration-300 group",
            updating === service.id && "opacity-50",
            !service.is_active && "opacity-60"
          )}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <Scissors className="w-6 h-6 text-primary" />
            </div>

            <div className="flex items-center gap-2">
              <span className={cn(
                "text-xs px-2 py-1 rounded-full",
                service.is_active 
                  ? "bg-green-400/10 text-green-400" 
                  : "bg-muted text-muted-foreground"
              )}>
                {service.is_active ? "Active" : "Inactive"}
              </span>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-strong">
                  <DropdownMenuItem onClick={() => toggleActive(service.id, service.is_active)}>
                    {service.is_active ? (
                      <>
                        <ToggleLeft className="w-4 h-4 mr-2" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <ToggleRight className="w-4 h-4 mr-2" />
                        Activate
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={() => handleDelete(service.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
          
          {service.description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {service.description}
            </p>
          )}

          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-primary" />
              <span>{service.duration_minutes} min</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="font-semibold">${service.price}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
