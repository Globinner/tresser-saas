"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Clock, User, CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Appointment {
  id: string
  date: string
  start_time: string
  end_time: string
  client_name: string | null
  client_phone: string | null
  status: string
  client_id: string | null
  clients: {
    id: string
    first_name: string
    last_name: string
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
}

const statusConfig = {
  scheduled: { icon: Clock, color: "text-blue-400", bg: "bg-blue-400/10" },
  confirmed: { icon: AlertCircle, color: "text-primary", bg: "bg-primary/10" },
  completed: { icon: CheckCircle, color: "text-green-400", bg: "bg-green-400/10" },
  cancelled: { icon: XCircle, color: "text-red-400", bg: "bg-red-400/10" },
  "no-show": { icon: XCircle, color: "text-muted-foreground", bg: "bg-muted" },
}

export function TodayAppointments({ appointments }: TodayAppointmentsProps) {
  const router = useRouter()
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
    router.refresh()
    setTimeout(() => setRefreshing(false), 1000)
  }

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Today's Schedule</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh"
          >
            <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
          </Button>
          <Link href="/dashboard/appointments">
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
              View all
            </Button>
          </Link>
        </div>
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
            const time = appointment.start_time?.slice(0, 5) || "00:00" // HH:MM
            const clientName = appointment.client_name || 
              (appointment.clients ? `${appointment.clients.first_name} ${appointment.clients.last_name}`.trim() : null) || 
              "Walk-in"
            
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
                        {clientName}
                      </Link>
                    ) : (
                      <p className="font-medium truncate">{clientName}</p>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {appointment.services?.name} • {appointment.services?.duration_minutes}min
                  </p>
                </div>

                <div className={cn("hidden sm:flex items-center gap-2 px-3 py-1 rounded-full", status.bg)}>
                  <status.icon className={cn("w-4 h-4", status.color)} />
                  <span className={cn("text-xs font-medium capitalize", status.color)}>
                    {appointment.status}
                  </span>
                </div>
                {/* Mobile: icon only */}
                <div className={cn("sm:hidden flex items-center justify-center w-8 h-8 rounded-full", status.bg)}>
                  <status.icon className={cn("w-4 h-4", status.color)} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
