"use client"

import { useState, ReactNode, useMemo, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, X, Calendar, Clock, Search, User, UserPlus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useLanguage } from "@/lib/i18n/language-context"
import { cn } from "@/lib/utils"

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
  const [clientSearch, setClientSearch] = useState("")
  const [showClientDropdown, setShowClientDropdown] = useState(false)
  const [serviceId, setServiceId] = useState("")
  const [barberId, setBarberId] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [notes, setNotes] = useState("")
  const { locale, isRTL } = useLanguage()
  const isHebrew = locale === 'he'
  const currency = isHebrew ? '₪' : '$'

  // Filter clients based on search
  const filteredClients = useMemo(() => {
    if (!clientSearch) return clients
    const search = clientSearch.toLowerCase()
    return clients.filter(
      (c) =>
        c.full_name.toLowerCase().includes(search) ||
        c.phone?.toLowerCase().includes(search) ||
        c.email?.toLowerCase().includes(search)
    )
  }, [clients, clientSearch])

  const selectedClient = clients.find((c) => c.id === clientId)
  const clientDropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (clientDropdownRef.current && !clientDropdownRef.current.contains(event.target as Node)) {
        setShowClientDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

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

    // Get selected client and service for additional fields
    const client = clients.find(c => c.id === clientId)
    const service = services.find(s => s.id === serviceId)

    // Calculate end time based on service duration
    const [hours, minutes] = time.split(':').map(Number)
    const startDate = new Date()
    startDate.setHours(hours, minutes, 0, 0)
    const endDate = new Date(startDate.getTime() + (service?.duration_minutes || 30) * 60000)
    const endTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}:00`
    const startTimeFormatted = `${time}:00` // Format as HH:MM:SS

    const appointmentData = {
      shop_id: shopId,
      client_id: clientId || null,
      client_name: client?.full_name || null,
      client_email: client?.email || null,
      client_phone: client?.phone || null,
      service_id: serviceId || null,
      barber_id: barberId || null,
      date: date,
      start_time: startTimeFormatted,
      end_time: endTime,
      total_price: service?.price || 0,
      status: "scheduled",
      notes: notes || null,
    }
    
    console.log("[v0] Creating appointment with data:", appointmentData)
    
    const { data: insertedData, error: insertError } = await supabase
      .from("appointments")
      .insert(appointmentData)
      .select()

    if (insertError) {
      console.log("[v0] Insert error:", insertError)
      setError(insertError.message)
      setLoading(false)
      return
    }

    console.log("[v0] Appointment created successfully:", insertedData)
    setOpen(false)
    resetForm()
    router.refresh()
  }

  function resetForm() {
    setClientId("")
    setClientSearch("")
    setShowClientDropdown(false)
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
          <DialogTitle className="text-xl font-bold">{isHebrew ? "תור חדש" : "New Appointment"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Client selection with search */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {isHebrew ? "לקוח (אופציונלי לכניסה ללא תור)" : "Client (optional for walk-ins)"}
            </label>
            <div className="relative" ref={clientDropdownRef}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={selectedClient ? selectedClient.full_name : (isHebrew ? "חפש או בחר לקוח..." : "Search or select client...")}
                value={clientSearch}
                onChange={(e) => {
                  setClientSearch(e.target.value)
                  setShowClientDropdown(true)
                }}
                onFocus={() => setShowClientDropdown(true)}
                className="pl-10 bg-input border-border"
              />
              {selectedClient && (
                <button
                  type="button"
                  onClick={() => {
                    setClientId("")
                    setClientSearch("")
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              
              {/* Client dropdown */}
              {showClientDropdown && (
                <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-lg bg-secondary border border-border shadow-lg">
                  {/* Walk-in option */}
                  <button
                    type="button"
                    onClick={() => {
                      setClientId("")
                      setClientSearch("")
                      setShowClientDropdown(false)
                    }}
                    className={cn("w-full px-3 py-2 text-sm hover:bg-primary/10 flex items-center gap-2 border-b border-border", isRTL ? "text-right flex-row-reverse" : "text-left")}
                  >
                    <UserPlus className="w-4 h-4 text-primary" />
                    <span className="font-medium">{isHebrew ? "לקוח ללא תור" : "Walk-in client"}</span>
                  </button>
                  
                  {/* Client list */}
                  {filteredClients.length > 0 ? (
                    filteredClients.map((client) => (
                      <button
                        type="button"
                        key={client.id}
                        onClick={() => {
                          setClientId(client.id)
                          setClientSearch("")
                          setShowClientDropdown(false)
                        }}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-primary/10 flex items-center gap-2 ${
                          clientId === client.id ? "bg-primary/20" : ""
                        }`}
                      >
                        <User className="w-4 h-4 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{client.full_name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {client.phone || client.email || (isHebrew ? "אין פרטי קשר" : "No contact info")}
                          </p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                      {isHebrew ? "לא נמצאו לקוחות" : "No clients found"}
                    </div>
                  )}
                </div>
              )}
            </div>
            {selectedClient && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/10 border border-primary/20">
                <User className="w-4 h-4 text-primary" />
                <div className="text-sm">
                  <span className="font-medium">{selectedClient.full_name}</span>
                  {selectedClient.phone && <span className="text-muted-foreground"> - {selectedClient.phone}</span>}
                </div>
              </div>
            )}
          </div>

          {/* Service selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {isHebrew ? "שירות" : "Service"} <span className="text-destructive">*</span>
            </label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              required
              className={cn("w-full h-10 rounded-lg bg-input border border-border px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary", isRTL && "text-right")}
            >
              <option value="">{isHebrew ? "בחר שירות" : "Select a service"}</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} - {currency}{service.price} ({service.duration_minutes}{isHebrew ? "ד׳" : "min"})
                </option>
              ))}
            </select>
            {selectedService && (
              <p className="text-xs text-muted-foreground">
                {isHebrew ? "משך:" : "Duration:"} {selectedService.duration_minutes} {isHebrew ? "דקות" : "minutes"}
              </p>
            )}
          </div>

          {/* Barber selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {isHebrew ? "ספר" : "Barber"} <span className="text-destructive">*</span>
            </label>
            <select
              value={barberId}
              onChange={(e) => setBarberId(e.target.value)}
              required
              className={cn("w-full h-10 rounded-lg bg-input border border-border px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary", isRTL && "text-right")}
            >
              <option value="">{isHebrew ? "בחר ספר" : "Select a barber"}</option>
              {barbers.map((barber) => (
                <option key={barber.id} value={barber.id}>
                  {barber.full_name || (isHebrew ? "ספר ללא שם" : "Unnamed Barber")}
                </option>
              ))}
            </select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {isHebrew ? "תאריך" : "Date"} <span className="text-destructive">*</span>
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
                {isHebrew ? "שעה" : "Time"} <span className="text-destructive">*</span>
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
            <label className="text-sm font-medium text-foreground">{isHebrew ? "הערות" : "Notes"}</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isHebrew ? "בקשות מיוחדות או הערות..." : "Any special requests or notes..."}
              rows={3}
              className={cn("w-full rounded-lg bg-input border border-border px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary resize-none", isRTL && "text-right")}
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          <div className={cn("flex gap-3 pt-4", isRTL ? "justify-start flex-row-reverse" : "justify-end")}>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-border"
            >
              {isHebrew ? "ביטול" : "Cancel"}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <Loader2 className={cn("w-4 h-4 animate-spin", isRTL ? "ml-2" : "mr-2")} />
                  {isHebrew ? "יוצר..." : "Creating..."}
                </>
              ) : (
                isHebrew ? "צור תור" : "Create Appointment"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
