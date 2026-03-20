"use client"

import { useState, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, X, Calendar, Clock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Client {
  id: string
  full_name: string
  phone: string | null
  email: string | null
}

interface Service {
  id: string
  name: string
  duration_minutes: number
  price: number
}

interface Barber {
  id: string
  full_name: string | null
}

interface NewAppointmentModalProps {
  clients: Client[]
  services: Service[]
  barbers: Barber[]
  shopId: string | null
  defaultOpen?: boolean
  children: ReactNode
}

export function NewAppointmentModal({
  clients,
  services,
  barbers,
  shopId,
  defaultOpen = false,
  children,
}: NewAppointmentModalProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [clientId, setClientId] = useState("")
  const [serviceId, setServiceId] = useState("")
  const [barberId, setBarberId] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [notes, setNotes] = useState("")

  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!shopId) {
      setError("No shop found. Please set up your shop first.")
      setLoading(false)
      return
    }

    const appointmentTime = new Date(`${date}T${time}`).toISOString()

    const { error: insertError } = await supabase
      .from("appointments")
      .insert({
        shop_id: shopId,
        client_id: clientId || null,
        service_id: serviceId,
        barber_id: barberId,
        appointment_time: appointmentTime,
        status: "scheduled",
        notes: notes || null,
      })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    setOpen(false)
    resetForm()
    router.refresh()
  }

  function resetForm() {
    setClientId("")
    setServiceId("")
    setBarberId("")
    setDate("")
    setTime("")
    setNotes("")
    setError(null)
    setLoading(false)
  }

  const selectedService = services.find(s => s.id === serviceId)

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen)
      if (!newOpen) resetForm()
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="glass-strong border-border sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">New Appointment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Client selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Client (optional for walk-ins)
            </label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full h-10 rounded-lg bg-input border border-border px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="">Walk-in client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.full_name} {client.phone ? `- ${client.phone}` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Service selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Service <span className="text-destructive">*</span>
            </label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              required
              className="w-full h-10 rounded-lg bg-input border border-border px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="">Select a service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} - ${service.price} ({service.duration_minutes}min)
                </option>
              ))}
            </select>
            {selectedService && (
              <p className="text-xs text-muted-foreground">
                Duration: {selectedService.duration_minutes} minutes
              </p>
            )}
          </div>

          {/* Barber selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Barber <span className="text-destructive">*</span>
            </label>
            <select
              value={barberId}
              onChange={(e) => setBarberId(e.target.value)}
              required
              className="w-full h-10 rounded-lg bg-input border border-border px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="">Select a barber</option>
              {barbers.map((barber) => (
                <option key={barber.id} value={barber.id}>
                  {barber.full_name || "Unnamed Barber"}
                </option>
              ))}
            </select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Date <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="pl-10 bg-input border-border"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Time <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  className="pl-10 bg-input border-border"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requests or notes..."
              rows={3}
              className="w-full rounded-lg bg-input border border-border px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-border"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Appointment"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
