"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Clock, User, Scissors } from "lucide-react"

interface Appointment {
  id: string
  date: string
  start_time: string
  client_name: string | null
  clients: { first_name: string; last_name: string } | null
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

      const now = new Date()
      const today = now.toISOString().split('T')[0]
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`
      
      // Get all upcoming appointments (today after current time + future days)
      const { data: allAppointments } = await supabase
        .from("appointments")
        .select(`
          id,
          date,
          start_time,
          client_name,
          clients(first_name, last_name),
          services(name)
        `)
        .eq("shop_id", profile.shop_id)
        .in("status", ["scheduled", "confirmed"])
        .gte("date", today)
        .order("date", { ascending: true })
        .order("start_time", { ascending: true })
        .limit(10)

      // Filter to find the next upcoming one (either today after now, or future date)
      const nextOne = allAppointments?.find(apt => {
        if (apt.date > today) return true // Future date
        if (apt.date === today && apt.start_time > currentTime) return true // Today but after now
        return false
      })

      setNextAppointment(nextOne || null)
    }

    fetchNextAppointment()
    const interval = setInterval(fetchNextAppointment, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!nextAppointment) return

    function updateTimeUntil() {
      const appointmentDateTime = new Date(`${nextAppointment.date}T${nextAppointment.start_time}`)
      const now = new Date()
      const diff = appointmentDateTime.getTime() - now.getTime()

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

  const time = nextAppointment.start_time.slice(0, 5) // Format HH:MM
  const clientName = nextAppointment.client_name || 
    (nextAppointment.clients ? `${nextAppointment.clients.first_name || ''} ${nextAppointment.clients.last_name || ''}`.trim() : null) || 
    "Walk-in"

return (
    <div 
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs sm:text-sm ${
        isUrgent 
          ? "bg-primary/20 border-primary animate-pulse" 
          : "bg-secondary/30 border-border"
      }`}
    >
      <Clock className={`w-3.5 h-3.5 flex-shrink-0 ${isUrgent ? "text-primary" : "text-muted-foreground"}`} />
      <span className={`font-medium ${isUrgent ? "text-primary" : ""}`}>{time}</span>
      <span className="text-muted-foreground">|</span>
      <User className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
      <span className="truncate max-w-[70px] sm:max-w-[100px]">{clientName}</span>
      <span className="text-muted-foreground">|</span>
      <Scissors className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
      <span className="text-muted-foreground truncate max-w-[60px] sm:max-w-[100px]">{nextAppointment.services?.name || "Service"}</span>
      <span className="text-muted-foreground">|</span>
      <span className={`font-bold whitespace-nowrap ${isUrgent ? "text-primary" : "text-primary/80"}`}>in {timeUntil}</span>
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

      const today = new Date().toISOString().split('T')[0]
      const { data } = await supabase
        .from("appointments")
        .select("date, start_time")
        .eq("shop_id", profile.shop_id)
        .in("status", ["scheduled", "confirmed"])
        .gte("date", today)
        .order("date", { ascending: true })
        .order("start_time", { ascending: true })
        .limit(1)
        .single()

      if (data) {
        const appointmentDateTime = new Date(`${data.date}T${data.start_time}`)
        const diffMs = appointmentDateTime.getTime() - Date.now()
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
