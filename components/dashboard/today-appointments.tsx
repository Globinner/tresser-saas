"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Clock, User, CheckCircle, XCircle, AlertCircle, RefreshCw, MoreVertical, MessageCircle, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useLanguage } from "@/lib/i18n/language-context"

interface Appointment {
  id: string
  date: string
  start_time: string
  end_time: string
  client_name: string | null
  client_phone: string | null
  client_email: string | null
  status: string
  client_id: string | null
  clients: {
    id: string
    first_name: string
    last_name: string
    phone: string | null
    email: string | null
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
  const supabase = createClient()
  const [refreshing, setRefreshing] = useState(false)
  const [updating, setUpdating] = useState<string | null>(null)
  const { locale, isRTL } = useLanguage()
  const isHebrew = locale === 'he'

  const handleRefresh = () => {
    setRefreshing(true)
    router.refresh()
    setTimeout(() => setRefreshing(false), 1000)
  }

  async function updateStatus(appointmentId: string, newStatus: string) {
    setUpdating(appointmentId)
    await supabase
      .from("appointments")
      .update({ status: newStatus })
      .eq("id", appointmentId)
    router.refresh()
    setUpdating(null)
  }

  function sendReminder(appointment: Appointment, method: 'whatsapp' | 'email') {
    const clientName = appointment.client_name || 
      (appointment.clients ? `${appointment.clients.first_name} ${appointment.clients.last_name}`.trim() : null) || "Client"
    const clientPhone = appointment.client_phone || appointment.clients?.phone
    const serviceName = appointment.services?.name || "Appointment"
    const [year, month, day] = appointment.date.split('-').map(Number)
    const appointmentDate = new Date(year, month - 1, day).toLocaleDateString()
    const appointmentTime = appointment.start_time.slice(0, 5)

    if (method === 'whatsapp') {
      const phone = clientPhone?.replace(/\D/g, '')
      if (!phone) {
        toast.error("No phone number available")
        return
      }
      const message = encodeURIComponent(
        `Hi ${clientName}! Reminder for your ${serviceName} on ${appointmentDate} at ${appointmentTime}. See you soon!`
      )
      window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
      toast.success("WhatsApp opened")
    } else {
      const email = appointment.client_email || appointment.clients?.email
      if (!email) {
        toast.error("No email available")
        return
      }
      const subject = encodeURIComponent(`Reminder: ${serviceName} Appointment`)
      const body = encodeURIComponent(
        `Hi ${clientName},\n\nReminder for your ${serviceName} on ${appointmentDate} at ${appointmentTime}.\n\nSee you soon!`
      )
      window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank')
      toast.success("Email opened")
    }
  }

  return (
    <div className="glass rounded-xl p-4 sm:p-6 overflow-hidden">
      <div className={`flex items-center justify-between mb-4 sm:mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <h2 className="text-lg font-semibold">{isHebrew ? "לוח זמנים להיום" : "Today's Schedule"}</h2>
        <div className={`flex items-center gap-1 sm:gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
            onClick={handleRefresh}
            disabled={refreshing}
            title={isHebrew ? "רענן" : "Refresh"}
          >
            <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
          </Button>
          <Link href="/dashboard/appointments">
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 text-xs sm:text-sm px-2 sm:px-3">
              {isHebrew ? "הצג הכל" : "View all"}
            </Button>
          </Link>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">{isHebrew ? "אין תורים להיום" : "No appointments today"}</p>
          <Link href="/dashboard/appointments">
            <Button variant="outline" size="sm" className="mt-4">
              {isHebrew ? "קבע תור" : "Schedule one"}
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
            const clientPhone = appointment.client_phone || appointment.clients?.phone
            
            return (
              <div
                key={appointment.id}
                className="flex items-center p-3 sm:p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                {/* Time - fixed width aligned left */}
                <div className="w-14 sm:w-16 flex-shrink-0">
                  <p className="text-base sm:text-lg font-bold text-primary">{time}</p>
                </div>
                
                {/* Client info - directly after time, no extra gap */}
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    {appointment.clients?.id ? (
                      <Link 
                        href={`/dashboard/clients/${appointment.clients.id}`}
                        className="font-medium text-sm sm:text-base truncate block hover:text-primary transition-colors"
                      >
                        {clientName}
                      </Link>
                    ) : (
                      <p className="font-medium text-sm sm:text-base truncate">{clientName}</p>
                    )}
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {appointment.services?.name} • {appointment.services?.duration_minutes}min
                    </p>
                  </div>
                </div>

                {/* Desktop: full badge */}
                <div className={cn("hidden sm:flex items-center gap-2 px-3 py-1 rounded-full flex-shrink-0 ml-2", status.bg)}>
                  <status.icon className={cn("w-4 h-4", status.color)} />
                  <span className={cn("text-xs font-medium capitalize", status.color)}>
                    {appointment.status}
                  </span>
                </div>
                {/* Mobile: icon only */}
                <div className={cn("sm:hidden flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0 ml-2", status.bg)}>
                  <status.icon className={cn("w-3.5 h-3.5", status.color)} />
                </div>

                {/* 3-dot menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 ml-1" disabled={updating === appointment.id}>
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-strong">
                    {(clientPhone || appointment.clients?.phone) && (
                      <DropdownMenuItem onClick={() => sendReminder(appointment, 'whatsapp')}>
                        <MessageCircle className="w-4 h-4 mr-2 text-green-500" />
                        WhatsApp Reminder
                      </DropdownMenuItem>
                    )}
                    {(appointment.client_email || appointment.clients?.email) && (
                      <DropdownMenuItem onClick={() => sendReminder(appointment, 'email')}>
                        <Mail className="w-4 h-4 mr-2 text-blue-400" />
                        Email Reminder
                      </DropdownMenuItem>
                    )}
                    <div className="h-px bg-border my-1" />
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
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
