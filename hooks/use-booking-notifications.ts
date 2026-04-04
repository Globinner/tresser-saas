"use client"

import { useEffect, useRef, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface Appointment {
  id: string
  date: string
  start_time: string
  client_name: string | null
  clients: {
    first_name: string
    last_name: string
  } | null
  services: {
    name: string
  } | null
}

export function useBookingNotifications(shopId: string | undefined) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const lastNotifiedRef = useRef<Set<string>>(new Set())
  
  // Initialize audio on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Create audio element with a pleasant notification sound
      audioRef.current = new Audio()
      // Use a data URI for a simple notification beep
      audioRef.current.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleREOnNnznHwiBXC8/NKjYgAAVI3+9syADgBLl/z9zHsKAFib+f3HdgMAaJ/2+8FxAAB4pfT6u2wAAIap8vm2aAAAlq3v+bFkAACksfD5rGAAALK18PenXAAAv7nw9qNYAADMvfD1oFQAANjB8PWcUQAA5MXv9JlOAADvyO/0lkwAAPrL7/STSgAABM/u85FIAAAOzu7zj0cAABfN7fONRgAAH8zt84xFAAAmy+3zi0QAACzK7fOKQwAAMcnt84lCAAA2yO3ziEEAADrH7fOHQAAAP8bt84ZAAAACxe3zhj8AAAXE7fKGPgAACcPt8oY9AAAMwu3yhTwAAA7B7PKFOwAAEMDr8oU6AAAR/+vyhjkAABL+6vKHOAAAEv3q8og3AAAR/Oryijk="
      audioRef.current.volume = 0.7
    }
  }, [])

  const playNotificationSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {
        // Autoplay might be blocked, that's ok
        console.log("[v0] Audio autoplay blocked - user interaction needed")
      })
    }
  }, [])

  const showNotification = useCallback((appointment: Appointment) => {
    const clientName = appointment.clients 
      ? `${appointment.clients.first_name} ${appointment.clients.last_name}`
      : appointment.client_name || "New Client"
    
    const serviceName = appointment.services?.name || "Appointment"
    const time = appointment.start_time?.slice(0, 5) || ""
    const date = appointment.date 
      ? new Date(appointment.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : ""

    // Play sound
    playNotificationSound()

    // Show toast notification
    toast.success(`New Booking!`, {
      description: `${clientName} booked ${serviceName} for ${date} at ${time}`,
      duration: 8000,
      action: {
        label: "View",
        onClick: () => {
          window.location.href = "/dashboard/appointments"
        },
      },
    })

    // Also try browser notification if permitted
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("New Booking!", {
          body: `${clientName} booked ${serviceName} for ${date} at ${time}`,
          icon: "/favicon.ico",
          tag: `booking-${appointment.id}`,
        })
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission()
      }
    }
  }, [playNotificationSound])

  // Subscribe to real-time appointment inserts
  useEffect(() => {
    if (!shopId) return

    const supabase = createClient()
    
    const channel = supabase
      .channel("new-bookings")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "appointments",
          filter: `shop_id=eq.${shopId}`,
        },
        async (payload) => {
          const newAppointment = payload.new as any
          
          // Avoid duplicate notifications
          if (lastNotifiedRef.current.has(newAppointment.id)) return
          lastNotifiedRef.current.add(newAppointment.id)
          
          // Fetch full appointment details with client and service info
          const { data } = await supabase
            .from("appointments")
            .select(`
              id,
              date,
              start_time,
              client_name,
              clients(first_name, last_name),
              services(name)
            `)
            .eq("id", newAppointment.id)
            .single()

          if (data) {
            showNotification(data)
          }
          
          // Clean up old IDs after 1 minute
          setTimeout(() => {
            lastNotifiedRef.current.delete(newAppointment.id)
          }, 60000)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [shopId, showNotification])

  return { playNotificationSound }
}
