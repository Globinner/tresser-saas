"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { 
  Clock, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  MoreVertical,
  Phone,
  Scissors
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Appointment {
  id: string
  appointment_time: string
  status: string
  notes: string | null
  clients: {
    id: string
    full_name: string
    phone: string | null
    email: string | null
  } | null
  services: {
    id: string
    name: string
    duration_minutes: number
    price: number
  } | null
  profiles: {
    id: string
    full_name: string | null
  } | null
}

interface AppointmentsListProps {
  appointments: Appointment[]
}

const statusConfig = {
  scheduled: { icon: Clock, color: "text-blue-400", bg: "bg-blue-400/10", label: "Scheduled" },
  confirmed: { icon: AlertCircle, color: "text-primary", bg: "bg-primary/10", label: "Confirmed" },
  completed: { icon: CheckCircle, color: "text-green-400", bg: "bg-green-400/10", label: "Completed" },
  cancelled: { icon: XCircle, color: "text-red-400", bg: "bg-red-400/10", label: "Cancelled" },
  "no-show": { icon: XCircle, color: "text-muted-foreground", bg: "bg-muted", label: "No Show" },
}

export function AppointmentsList({ appointments }: AppointmentsListProps) {
  const router = useRouter()
  const supabase = createClient()
  const [updating, setUpdating] = useState<string | null>(null)

  // Group appointments by date
  const groupedAppointments = appointments.reduce((acc, appointment) => {
    const date = new Date(appointment.appointment_time).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    if (!acc[date]) acc[date] = []
    acc[date].push(appointment)
    return acc
  }, {} as Record<string, Appointment[]>)

  async function updateStatus(appointmentId: string, newStatus: string) {
    setUpdating(appointmentId)
    await supabase
      .from("appointments")
      .update({ status: newStatus })
      .eq("id", appointmentId)
    
    router.refresh()
    setUpdating(null)
  }

  if (appointments.length === 0) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No appointments yet</h3>
        <p className="text-muted-foreground mb-6">
          Get started by scheduling your first appointment
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedAppointments).map(([date, dayAppointments]) => (
        <div key={date}>
          <h3 className="text-sm font-medium text-muted-foreground mb-4">{date}</h3>
          <div className="space-y-3">
            {dayAppointments.map((appointment) => {
              const status = statusConfig[appointment.status as keyof typeof statusConfig] || statusConfig.scheduled
              const time = new Date(appointment.appointment_time).toLocaleTimeString([], { 
                hour: "2-digit", 
                minute: "2-digit" 
              })
              const endTime = new Date(
                new Date(appointment.appointment_time).getTime() + 
                (appointment.services?.duration_minutes || 30) * 60000
              ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

              return (
                <div
                  key={appointment.id}
                  className={cn(
                    "glass rounded-xl p-4 hover:border-primary/30 transition-all duration-300",
                    updating === appointment.id && "opacity-50"
                  )}
                >
                  <div className="flex items-start gap-4">
                    {/* Time */}
                    <div className="text-center min-w-[80px] py-2 px-3 rounded-lg bg-secondary/50">
                      <p className="text-lg font-bold text-primary">{time}</p>
                      <p className="text-xs text-muted-foreground">to {endTime}</p>
                    </div>

                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                          {appointment.clients?.full_name?.charAt(0) || "W"}
                        </div>
                        <div>
                          <p className="font-semibold">
                            {appointment.clients?.full_name || "Walk-in"}
                          </p>
                          {appointment.clients?.phone && (
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {appointment.clients.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Scissors className="w-4 h-4" />
                          <span>{appointment.services?.name}</span>
                          <span className="text-primary font-medium">
                            ${appointment.services?.price}
                          </span>
                        </div>
                        
                        {appointment.profiles?.full_name && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="w-4 h-4" />
                            <span>{appointment.profiles.full_name}</span>
                          </div>
                        )}
                      </div>

                      {appointment.notes && (
                        <p className="mt-2 text-sm text-muted-foreground italic">
                          {appointment.notes}
                        </p>
                      )}
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center gap-3">
                      <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full", status.bg)}>
                        <status.icon className={cn("w-4 h-4", status.color)} />
                        <span className={cn("text-sm font-medium", status.color)}>
                          {status.label}
                        </span>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass-strong">
                          <DropdownMenuItem onClick={() => updateStatus(appointment.id, "confirmed")}>
                            <AlertCircle className="w-4 h-4 mr-2 text-primary" />
                            Mark Confirmed
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(appointment.id, "completed")}>
                            <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                            Mark Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(appointment.id, "cancelled")}>
                            <XCircle className="w-4 h-4 mr-2 text-red-400" />
                            Cancel
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(appointment.id, "no-show")}>
                            <XCircle className="w-4 h-4 mr-2 text-muted-foreground" />
                            No Show
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
