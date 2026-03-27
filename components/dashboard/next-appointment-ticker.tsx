"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Clock, User, Scissors } from "lucide-react"

interface Appointment {
  id: string
  appointment_time: string
  clients: { full_name: string } | null
  services: { name: string } | null
}

export function NextAppointmentTicker() {
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null)
  const [timeUntil, setTimeUntil] = useState<string>("")
  const [isUrgent, setIsUrgent] = useState(false)

  useEffect(() => {
    async function fetchNextAppointment() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from("profiles")
        .select("shop_id")
        .eq("id", user.id)
        .single()

      if (!profile?.shop_id) return

      const now = new Date().toISOString()
      const { data } = await supabase
        .from("appointments")
        .select(`
          id,
          appointment_time,
          clients(full_name),
          services(name)
        `)
        .eq("shop_id", profile.shop_id)
        .in("status", ["scheduled", "confirmed"])
        .gte("appointment_time", now)
        .order("appointment_time", { ascending: true })
        .limit(1)
        .single()

      setNextAppointment(data)
    }

    fetchNextAppointment()
    const interval = setInterval(fetchNextAppointment, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!nextAppointment) return

    function updateTimeUntil() {
      const appointmentTime = new Date(nextAppointment.appointment_time)
      const now = new Date()
      const diff = appointmentTime.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeUntil("NOW")
        setIsUrgent(true)
        return
      }

      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(minutes / 60)
      const mins = minutes % 60

      if (minutes <= 15) {
        setIsUrgent(true)
      } else {
        setIsUrgent(false)
      }

      if (hours > 0) {
        setTimeUntil(`${hours}h ${mins}m`)
      } else {
        setTimeUntil(`${mins}m`)
      }
    }

    updateTimeUntil()
    const interval = setInterval(updateTimeUntil, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [nextAppointment])

  if (!nextAppointment) return null

  const time = new Date(nextAppointment.appointment_time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="hidden md:flex items-center overflow-hidden">
      <div 
        className={`flex items-center gap-4 px-4 py-2 rounded-lg border ${
          isUrgent 
            ? "bg-primary/20 border-primary animate-pulse" 
            : "bg-secondary/30 border-border"
        }`}
      >
        <div className="flex items-center gap-2 animate-marquee whitespace-nowrap">
          <Clock className={`w-4 h-4 ${isUrgent ? "text-primary" : "text-muted-foreground"}`} />
          <span className={`text-sm font-medium ${isUrgent ? "text-primary" : ""}`}>
            Next: {time}
          </span>
          <span className="text-muted-foreground">|</span>
          <User className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">
            {nextAppointment.clients?.full_name || "Walk-in"}
          </span>
          <span className="text-muted-foreground">|</span>
          <Scissors className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {nextAppointment.services?.name || "Service"}
          </span>
          <span className="text-muted-foreground">|</span>
          <span className={`text-sm font-bold ${isUrgent ? "text-primary" : "text-primary/80"}`}>
            in {timeUntil}
          </span>
        </div>
      </div>
    </div>
  )
}

export function useNextAppointmentAlert() {
  const [isUrgent, setIsUrgent] = useState(false)
  const [minutesUntil, setMinutesUntil] = useState<number | null>(null)

  useEffect(() => {
    async function checkUpcoming() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from("profiles")
        .select("shop_id")
        .eq("id", user.id)
        .single()

      if (!profile?.shop_id) return

      const now = new Date().toISOString()
      const { data } = await supabase
        .from("appointments")
        .select("appointment_time")
        .eq("shop_id", profile.shop_id)
        .in("status", ["scheduled", "confirmed"])
        .gte("appointment_time", now)
        .order("appointment_time", { ascending: true })
        .limit(1)
        .single()

      if (data) {
        const appointmentTime = new Date(data.appointment_time)
        const diffMs = appointmentTime.getTime() - Date.now()
        const mins = Math.floor(diffMs / 60000)
        setMinutesUntil(mins)
        setIsUrgent(mins <= 15 && mins >= 0)
      }
    }

    checkUpcoming()
    const interval = setInterval(checkUpcoming, 30000)
    return () => clearInterval(interval)
  }, [])

  return { isUrgent, minutesUntil }
}
