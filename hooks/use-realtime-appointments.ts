"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js"

interface Appointment {
  id: string
  appointment_time: string
  status: string
  notes: string | null
  shop_id: string
  client_id: string | null
  service_id: string | null
  barber_id: string | null
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

export function useRealtimeAppointments(shopId: string, initialAppointments: Appointment[]) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments)
  const supabase = createClient()

  useEffect(() => {
    // Update state when initial data changes (e.g., page refresh)
    setAppointments(initialAppointments)
  }, [initialAppointments])

  useEffect(() => {
    if (!shopId) return

    // Subscribe to realtime changes on appointments table
    const channel = supabase
      .channel(`appointments-${shopId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "appointments",
          filter: `shop_id=eq.${shopId}`,
        },
        async (payload: RealtimePostgresChangesPayload<Appointment>) => {
          console.log("[v0] Realtime appointment change:", payload.eventType)
          
          if (payload.eventType === "INSERT") {
            // Fetch the full appointment with relations
            const { data: newAppointment } = await supabase
              .from("appointments")
              .select(`
                *,
                clients(id, full_name, phone, email),
                services(id, name, duration_minutes, price),
                profiles!appointments_barber_id_fkey(id, full_name)
              `)
              .eq("id", payload.new.id)
              .single()

            if (newAppointment) {
              setAppointments((prev) => {
                // Avoid duplicates
                if (prev.some((a) => a.id === newAppointment.id)) return prev
                // Add and sort by time
                return [...prev, newAppointment].sort(
                  (a, b) => new Date(a.appointment_time).getTime() - new Date(b.appointment_time).getTime()
                )
              })
            }
          } else if (payload.eventType === "UPDATE") {
            // Fetch updated appointment with relations
            const { data: updatedAppointment } = await supabase
              .from("appointments")
              .select(`
                *,
                clients(id, full_name, phone, email),
                services(id, name, duration_minutes, price),
                profiles!appointments_barber_id_fkey(id, full_name)
              `)
              .eq("id", payload.new.id)
              .single()

            if (updatedAppointment) {
              setAppointments((prev) =>
                prev.map((a) => (a.id === updatedAppointment.id ? updatedAppointment : a))
              )
            }
          } else if (payload.eventType === "DELETE") {
            setAppointments((prev) => prev.filter((a) => a.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [shopId, supabase])

  return appointments
}
