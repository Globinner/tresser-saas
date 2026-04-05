"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { 
  Clock, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  MoreVertical,
  Phone,
  Scissors,
  RefreshCw,
  MessageCircle,
  Mail
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/lib/i18n/language-context"

interface Appointment {
  id: string
  date: string
  start_time: string
  end_time: string
  client_name: string | null
  client_phone: string | null
  client_email: string | null
  total_price: number
  status: string
  notes: string | null
  clients: {
    id: string
    first_name: string
    last_name: string
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

const getStatusConfig = (isHebrew: boolean) => ({
  scheduled: { icon: Clock, color: "text-blue-400", bg: "bg-blue-400/10", label: isHebrew ? "מתוזמן" : "Scheduled" },
  confirmed: { icon: AlertCircle, color: "text-primary", bg: "bg-primary/10", label: isHebrew ? "מאושר" : "Confirmed" },
  completed: { icon: CheckCircle, color: "text-green-400", bg: "bg-green-400/10", label: isHebrew ? "הושלם" : "Completed" },
  cancelled: { icon: XCircle, color: "text-red-400", bg: "bg-red-400/10", label: isHebrew ? "בוטל" : "Cancelled" },
  "no-show": { icon: XCircle, color: "text-muted-foreground", bg: "bg-muted", label: isHebrew ? "לא הגיע" : "No Show" },
})

// Exported RefreshButton component
export function RefreshButton() {
  const router = useRouter()
  const [refreshing, setRefreshing] = useState(false)
  const { locale, isRTL } = useLanguage()
  const isHebrew = locale === 'he'

  const handleRefresh = () => {
    setRefreshing(true)
    router.refresh()
    setTimeout(() => setRefreshing(false), 1000)
  }

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={handleRefresh}
      disabled={refreshing}
    >
      <RefreshCw className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2", refreshing && "animate-spin")} />
      {isHebrew ? "רענן" : "Refresh"}
    </Button>
  )
}

export function AppointmentsList({ appointments }: AppointmentsListProps) {
  const supabase = createClient()
  const router = useRouter()
  const [updating, setUpdating] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [sendingReminder, setSendingReminder] = useState<string | null>(null)
  const { locale, isRTL } = useLanguage()
  const isHebrew = locale === 'he'
  const statusConfig = getStatusConfig(isHebrew)

  const handleRefresh = () => {
    setRefreshing(true)
    router.refresh()
    setTimeout(() => setRefreshing(false), 1000)
  }

  // Group appointments by date
  const groupedAppointments = appointments.reduce((acc, appointment) => {
    // Parse date as YYYY-MM-DD and format nicely
    const [year, month, day] = appointment.date.split('-').map(Number)
    const dateObj = new Date(year, month - 1, day)
    const dateStr = dateObj.toLocaleDateString(isHebrew ? "he-IL" : "en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    if (!acc[dateStr]) acc[dateStr] = []
    acc[dateStr].push(appointment)
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

  async function sendReminder(appointment: Appointment, method: 'whatsapp' | 'email') {
    const clientName = appointment.client_name || 
      (appointment.clients ? `${appointment.clients.first_name} ${appointment.clients.last_name}`.trim() : null)
    const clientPhone = appointment.client_phone || appointment.clients?.phone
    const clientEmail = appointment.client_email || appointment.clients?.email
    
    if (!clientName && !clientPhone && !clientEmail) {
      toast.error("No client information available")
      return
    }

    setSendingReminder(appointment.id)
    
    const serviceName = appointment.services?.name || "Appointment"
    const [year, month, day] = appointment.date.split('-').map(Number)
    const appointmentDate = new Date(year, month - 1, day).toLocaleDateString()
    const appointmentTime = appointment.start_time.slice(0, 5)

    if (method === 'whatsapp') {
      const phone = clientPhone?.replace(/\D/g, '')
      if (!phone) {
        toast.error("Client has no phone number")
        setSendingReminder(null)
        return
      }
      
      const message = encodeURIComponent(
        `Hi ${clientName}! This is a reminder for your ${serviceName} appointment on ${appointmentDate} at ${appointmentTime}. We look forward to seeing you!`
      )
      
      window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
      toast.success("WhatsApp opened with reminder message")
    } else if (method === 'email') {
      const email = clientEmail
      if (!email) {
        toast.error("Client has no email address")
        setSendingReminder(null)
        return
      }
      
      const subject = encodeURIComponent(`Reminder: Your ${serviceName} Appointment`)
      const body = encodeURIComponent(
        `Hi ${clientName},\n\nThis is a friendly reminder for your upcoming appointment:\n\nService: ${serviceName}\nDate: ${appointmentDate}\nTime: ${appointmentTime}\n\nWe look forward to seeing you!\n\nBest regards,\nYour Barbershop Team`
      )
      
      window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank')
      toast.success("Email client opened with reminder")
    }

    setSendingReminder(null)
  }

  if (appointments.length === 0) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{isHebrew ? "אין תורים עדיין" : "No appointments yet"}</h3>
        <p className="text-muted-foreground mb-6">
          {isHebrew ? "התחל על ידי קביעת התור הראשון" : "Get started by scheduling your first appointment"}
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
              const time = appointment.start_time.slice(0, 5) // HH:MM
              const endTime = appointment.end_time?.slice(0, 5) || time
              const clientName = appointment.client_name || 
                (appointment.clients ? `${appointment.clients.first_name} ${appointment.clients.last_name}`.trim() : null) || 
                "Walk-in"
              const clientPhone = appointment.client_phone || appointment.clients?.phone
              const price = appointment.total_price || appointment.services?.price || 0

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
                          {clientName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold">{clientName}</p>
                          {clientPhone && (
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {clientPhone}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Scissors className="w-4 h-4" />
                          <span>{appointment.services?.name}</span>
                          <span className="text-primary font-medium">
                            ${price}
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
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      <div className={cn("hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full", status.bg)}>
                        <status.icon className={cn("w-4 h-4", status.color)} />
                        <span className={cn("text-sm font-medium", status.color)}>
                          {status.label}
                        </span>
                      </div>
                      {/* Mobile: icon only */}
                      <div className={cn("sm:hidden flex items-center justify-center w-8 h-8 rounded-full", status.bg)}>
                        <status.icon className={cn("w-4 h-4", status.color)} />
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass-strong">
                          {/* Send Reminder Options */}
                          {(clientPhone || appointment.clients?.phone) && (
                            <DropdownMenuItem 
                              onClick={() => sendReminder(appointment, 'whatsapp')}
                              disabled={sendingReminder === appointment.id}
                            >
                              <MessageCircle className={cn("w-4 h-4 text-green-500", isRTL ? "ml-2" : "mr-2")} />
                              {isHebrew ? "שלח תזכורת בוואטסאפ" : "Send WhatsApp Reminder"}
                            </DropdownMenuItem>
                          )}
                          {(appointment.client_email || appointment.clients?.email) && (
                            <DropdownMenuItem 
                              onClick={() => sendReminder(appointment, 'email')}
                              disabled={sendingReminder === appointment.id}
                            >
                              <Mail className={cn("w-4 h-4 text-blue-400", isRTL ? "ml-2" : "mr-2")} />
                              {isHebrew ? "שלח תזכורת באימייל" : "Send Email Reminder"}
                            </DropdownMenuItem>
                          )}
                          {(clientPhone || appointment.client_email || appointment.clients) && (
                            <div className="h-px bg-border my-1" />
                          )}
                          <DropdownMenuItem onClick={() => updateStatus(appointment.id, "confirmed")}>
                            <AlertCircle className={cn("w-4 h-4 text-primary", isRTL ? "ml-2" : "mr-2")} />
                            {isHebrew ? "סמן כמאושר" : "Mark Confirmed"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(appointment.id, "completed")}>
                            <CheckCircle className={cn("w-4 h-4 text-green-400", isRTL ? "ml-2" : "mr-2")} />
                            {isHebrew ? "סמן כהושלם" : "Mark Completed"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(appointment.id, "cancelled")}>
                            <XCircle className={cn("w-4 h-4 text-red-400", isRTL ? "ml-2" : "mr-2")} />
                            {isHebrew ? "בטל" : "Cancel"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(appointment.id, "no-show")}>
                            <XCircle className={cn("w-4 h-4 text-muted-foreground", isRTL ? "ml-2" : "mr-2")} />
                            {isHebrew ? "לא הגיע" : "No Show"}
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
