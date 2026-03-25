"use client"

import { Clock, User, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRealtimeAppointments } from "@/hooks/use-realtime-appointments"

interface Appointment {
  id: string
  appointment_time: string
  status: string
  client_id: string | null
  clients: {
    id: string
    full_name: string
    phone: string | null
  } | null
  services: {
    name: string
    duration_minutes: number
    price: number
  } | null
  profiles: {
    full_name: string | null
  } | null
}

interface TodayAppointmentsProps {
  appointments: Appointment[]
  shopId: string
}

const statusConfig = {
  scheduled: { icon: Clock, color: "text-blue-400", bg: "bg-blue-400/10" },
  confirmed: { icon: AlertCircle, color: "text-primary", bg: "bg-primary/10" },
  completed: { icon: CheckCircle, color: "text-green-400", bg: "bg-green-400/10" },
  cancelled: { icon: XCircle, color: "text-red-400", bg: "bg-red-400/10" },
  "no-show": { icon: XCircle, color: "text-muted-foreground", bg: "bg-muted" },
}

export function TodayAppointments({ appointments: initialAppointments, shopId }: TodayAppointmentsProps) {
  // Use realtime hook for live updates
  const allAppointments = useRealtimeAppointments(shopId, initialAppointments as any)
  
  // Filter to only today's appointments
  const today = new Date()
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).getTime()
  
  const appointments = allAppointments.filter((apt) => {
    const aptTime = new Date(apt.appointment_time).getTime()
    return aptTime >= startOfDay && aptTime < endOfDay
  })

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Today's Schedule</h2>
        <Link href="/dashboard/appointments">
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            View all
          </Button>
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No appointments today</p>
          <Link href="/dashboard/appointments">
            <Button variant="outline" size="sm" className="mt-4">
              Schedule one
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.slice(0, 5).map((appointment) => {
            const status = statusConfig[appointment.status as keyof typeof statusConfig] || statusConfig.scheduled
            const time = new Date(appointment.appointment_time).toLocaleTimeString([], { 
              hour: "2-digit", 
              minute: "2-digit" 
            })
            
            return (
              <div
                key={appointment.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="text-center min-w-[60px]">
                  <p className="text-lg font-bold text-primary">{time}</p>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    {appointment.clients?.id ? (
                      <Link 
                        href={`/dashboard/clients/${appointment.clients.id}`}
                        className="font-medium truncate hover:text-primary transition-colors"
                      >
                        {appointment.clients.full_name}
                      </Link>
                    ) : (
                      <p className="font-medium truncate">Walk-in</p>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {appointment.services?.name} • {appointment.services?.duration_minutes}min
                  </p>
                </div>

                <div className={cn("flex items-center gap-2 px-3 py-1 rounded-full", status.bg)}>
                  <status.icon className={cn("w-4 h-4", status.color)} />
                  <span className={cn("text-xs font-medium capitalize", status.color)}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
