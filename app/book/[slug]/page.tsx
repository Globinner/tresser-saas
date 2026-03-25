"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Calendar, 
  Clock, 
  Scissors, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  MapPin,
  Phone,
  Star
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Shop {
  id: string
  name: string
  address: string | null
  phone: string | null
  logo_url: string | null
  public_booking_enabled: boolean
  booking_advance_days: number
  booking_days_open: string[] | null
  booking_start_time: string | null
  booking_end_time: string | null
  booking_slot_duration: number | null
  opening_hours: Record<string, { open: string; close: string; closed?: boolean }> | null
}

interface Service {
  id: string
  name: string
  description: string | null
  price: number
  duration_minutes: number
}

interface Barber {
  id: string
  full_name: string | null
  display_name: string | null
  avatar_url: string | null
}

interface ExistingAppointment {
  date: string
  start_time: string
  end_time: string
  barber_id: string | null
}

type Step = "service" | "barber" | "datetime" | "details" | "confirm"

export default function PublicBookingPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [shop, setShop] = useState<Shop | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [existingAppointments, setExistingAppointments] = useState<ExistingAppointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [step, setStep] = useState<Step>("service")
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    email: "",
    phone: "",
    notes: ""
  })
  const [submitting, setSubmitting] = useState(false)
  const [booked, setBooked] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)

  useEffect(() => {
    loadShopData()
  }, [slug])

  async function loadShopData() {
    const supabase = createClient()
    
    // Get shop by booking slug with booking enabled
    const { data: shopData } = await supabase
      .from("shops")
      .select("*")
      .eq("booking_slug", slug)
      .eq("public_booking_enabled", true)
      .single()

    if (!shopData) {
      setError("This booking page is not available")
      setLoading(false)
      return
    }

    setShop(shopData as Shop)

    // Load services
    const { data: servicesData } = await supabase
      .from("services")
      .select("*")
      .eq("shop_id", shopData.id)
      .eq("is_active", true)
      .order("name")

    setServices(servicesData || [])

    // Load barbers (team members linked to this shop)
    const { data: barbersData } = await supabase
      .from("profiles")
      .select("id, full_name, display_name, avatar_url")
      .eq("shop_id", shopData.id)

    setBarbers(barbersData || [])

    // Load existing appointments for the next booking_advance_days
    const today = new Date().toISOString().split("T")[0]
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + (shopData.booking_advance_days || 14))
    const maxDateStr = maxDate.toISOString().split("T")[0]

    const { data: appointmentsData, error: appointmentsError } = await supabase
      .from("appointments")
      .select("date, start_time, end_time, barber_id")
      .eq("shop_id", shopData.id)
      .gte("date", today)
      .lte("date", maxDateStr)
      .in("status", ["scheduled", "confirmed", "pending"])

    console.log("[v0] Appointments loaded:", appointmentsData?.length, "Error:", appointmentsError)
    console.log("[v0] Appointments data:", appointmentsData)
    setExistingAppointments(appointmentsData || [])
    setLoading(false)
  }

  function generateTimeSlots(date: Date): string[] {
    if (!shop) return []
    
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const dayName = dayNames[date.getDay()]
    
    // Check if this day is open
    if (shop.booking_days_open && !shop.booking_days_open.includes(dayName)) {
      return []
    }
    
    // Use opening_hours if available, otherwise use booking_start_time/end_time
    let openTime = "09:00"
    let closeTime = "18:00"
    
    if (shop.opening_hours && shop.opening_hours[dayName]) {
      const hours = shop.opening_hours[dayName]
      if (hours.closed) return []
      openTime = hours.open
      closeTime = hours.close
    } else if (shop.booking_start_time && shop.booking_end_time) {
      openTime = shop.booking_start_time
      closeTime = shop.booking_end_time
    }
    
    const slots: string[] = []
    const [openHour, openMin] = openTime.split(":").map(Number)
    const [closeHour, closeMin] = closeTime.split(":").map(Number)
    
    let currentMinutes = openHour * 60 + openMin
    const closeMinutes = closeHour * 60 + closeMin
    const slotDuration = shop.booking_slot_duration || 30
    const serviceDuration = selectedService?.duration_minutes || 30
    
    const dateStr = date.toISOString().split("T")[0]
    
    // Get appointments for this date and selected barber
    const dayAppointments = existingAppointments.filter(apt => {
      if (apt.date !== dateStr) return false
      // If a barber is selected, only check their appointments
      if (selectedBarber && apt.barber_id !== selectedBarber.id) return false
      // If no barber selected but we have barbers, the slot is available if ANY barber is free
      return true
    })
    
    console.log("[v0] Date:", dateStr, "Total appointments:", existingAppointments.length, "Day appointments:", dayAppointments.length, "Barbers:", barbers.length)
    
    while (currentMinutes + serviceDuration <= closeMinutes) {
      const h = Math.floor(currentMinutes / 60)
      const m = currentMinutes % 60
      const timeStr = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
      
      // Check if this slot overlaps with any existing appointment
      const slotStart = currentMinutes
      const slotEnd = currentMinutes + serviceDuration
      
      let isAvailable = true
      
      if (selectedBarber) {
        // Check if selected barber is busy
        for (const apt of dayAppointments) {
          const [aptStartH, aptStartM] = apt.start_time.split(":").map(Number)
          const [aptEndH, aptEndM] = apt.end_time.split(":").map(Number)
          const aptStart = aptStartH * 60 + aptStartM
          const aptEnd = aptEndH * 60 + aptEndM
          
          // Check for overlap
          if (slotStart < aptEnd && slotEnd > aptStart) {
            isAvailable = false
            break
          }
        }
      } else if (barbers.length > 0) {
        // If no barber selected, check if at least one barber is free
        isAvailable = barbers.some(barber => {
          const barberAppointments = existingAppointments.filter(
            apt => apt.date === dateStr && apt.barber_id === barber.id
          )
          
          for (const apt of barberAppointments) {
            const [aptStartH, aptStartM] = apt.start_time.split(":").map(Number)
            const [aptEndH, aptEndM] = apt.end_time.split(":").map(Number)
            const aptStart = aptStartH * 60 + aptStartM
            const aptEnd = aptEndH * 60 + aptEndM
            
            if (slotStart < aptEnd && slotEnd > aptStart) {
              return false // This barber is busy
            }
          }
          return true // This barber is free
        })
      } else {
        // No barbers in system, check all appointments without barber filter
        for (const apt of dayAppointments) {
          const [aptStartH, aptStartM] = apt.start_time.split(":").map(Number)
          const [aptEndH, aptEndM] = apt.end_time.split(":").map(Number)
          const aptStart = aptStartH * 60 + aptStartM
          const aptEnd = aptEndH * 60 + aptEndM
          
          if (slotStart < aptEnd && slotEnd > aptStart) {
            isAvailable = false
            break
          }
        }
      }
      
      if (isAvailable) {
        slots.push(timeStr)
      }
      
      currentMinutes += slotDuration
    }
    
    return slots
  }

  function generateCalendarDays(): (Date | null)[] {
    if (!selectedDate && !shop) return []
    
    const today = new Date()
    const currentMonth = selectedDate || today
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    
    const days: (Date | null)[] = []
    
    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null)
    }
    
    // Add all days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }
    
    return days
  }

  function isDateAvailable(date: Date): boolean {
    if (!shop) return false
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + (shop.booking_advance_days || 14))
    
    if (date < today || date > maxDate) return false
    
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const dayName = dayNames[date.getDay()]
    
    // Check booking_days_open array
    if (shop.booking_days_open && shop.booking_days_open.length > 0) {
      return shop.booking_days_open.includes(dayName)
    }
    
    // Check opening_hours
    if (shop.opening_hours && shop.opening_hours[dayName]) {
      return !shop.opening_hours[dayName].closed
    }
    
    // Default: weekdays open
    return date.getDay() !== 0 // Not Sunday
  }

  async function handleSubmit() {
    if (!shop || !selectedService || !selectedDate || !selectedTime) {
      console.log("[v0] Missing required data:", { shop: !!shop, selectedService: !!selectedService, selectedDate: !!selectedDate, selectedTime: !!selectedTime })
      return
    }
    
    setSubmitting(true)
    setBookingError(null)
    const supabase = createClient()
    
    console.log("[v0] Starting booking submission...")
    
    // Create or find client
    let clientId: string
    const { data: existingClient, error: findClientError } = await supabase
      .from("clients")
      .select("id")
      .eq("shop_id", shop.id)
      .eq("email", customerDetails.email)
      .single()

    console.log("[v0] Find client result:", existingClient, findClientError)

    if (existingClient) {
      clientId = existingClient.id
    } else {
      // Split name into first and last name
      const nameParts = customerDetails.name.trim().split(" ")
      const firstName = nameParts[0] || ""
      const lastName = nameParts.slice(1).join(" ") || ""
      
      console.log("[v0] Creating new client...")
      const { data: newClient, error: clientError } = await supabase
        .from("clients")
        .insert({
          shop_id: shop.id,
          first_name: firstName,
          last_name: lastName,
          email: customerDetails.email,
          phone: customerDetails.phone || null
        })
        .select("id")
        .single()

      console.log("[v0] Create client result:", newClient, clientError)

      if (clientError || !newClient) {
        console.error("[v0] Client creation failed:", clientError)
        setBookingError(`Failed to create client: ${clientError?.message || "Unknown error"}`)
        setSubmitting(false)
        return
      }
      clientId = newClient.id
    }

    // Create appointment
    const [hours, minutes] = selectedTime.split(":").map(Number)
    const endHours = hours + Math.floor((minutes + selectedService.duration_minutes) / 60)
    const endMinutes = (minutes + selectedService.duration_minutes) % 60
    
    const appointmentData = {
      shop_id: shop.id,
      client_id: clientId,
      client_name: customerDetails.name,
      client_email: customerDetails.email,
      client_phone: customerDetails.phone || null,
      service_id: selectedService.id,
      barber_id: selectedBarber?.id || (barbers.length === 1 ? barbers[0].id : null),
      date: selectedDate.toISOString().split("T")[0],
      start_time: selectedTime,
      end_time: `${endHours.toString().padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`,
      status: "pending",
      notes: customerDetails.notes || null,
      total_price: selectedService.price
    }
    
    console.log("[v0] Creating appointment with data:", appointmentData)

    const { data: appointmentResult, error: appointmentError } = await supabase
      .from("appointments")
      .insert(appointmentData)
      .select()

    console.log("[v0] Appointment result:", appointmentResult, appointmentError)

    if (appointmentError) {
      console.error("[v0] Booking error:", appointmentError)
      setBookingError(`Failed to book appointment: ${appointmentError.message}`)
      setSubmitting(false)
      return
    }

    console.log("[v0] Booking successful!")
    setBooked(true)
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full glass-strong">
          <CardContent className="pt-6 text-center">
            <Scissors className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Booking Unavailable</h2>
            <p className="text-muted-foreground">{error || "This booking page does not exist."}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (booked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full glass-strong">
          <CardContent className="pt-6 text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">See You Soon!</h2>
            <p className="text-lg text-muted-foreground mb-6">
              We're looking forward to seeing you at <span className="text-foreground font-medium">{shop.name}</span>
            </p>
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-5 text-left space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-semibold">{selectedDate?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-semibold">{selectedTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Scissors className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Service</p>
                  <p className="font-semibold">{selectedService?.name}</p>
                </div>
              </div>
              {selectedBarber && (
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Professional</p>
                    <p className="font-semibold">{selectedBarber.display_name || selectedBarber.full_name}</p>
                  </div>
                </div>
              )}
              {shop.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold">{shop.address}</p>
                  </div>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              A confirmation has been sent to <span className="font-medium">{customerDetails.email}</span>
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Book Another Appointment
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Build steps dynamically based on whether there are barbers
  const steps: { key: Step; label: string }[] = barbers.length > 1
    ? [
        { key: "service", label: "Service" },
        { key: "barber", label: "Professional" },
        { key: "datetime", label: "Date & Time" },
        { key: "details", label: "Your Details" },
        { key: "confirm", label: "Confirm" }
      ]
    : [
        { key: "service", label: "Service" },
        { key: "datetime", label: "Date & Time" },
        { key: "details", label: "Your Details" },
        { key: "confirm", label: "Confirm" }
      ]

  const currentStepIndex = steps.findIndex(s => s.key === step)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            {shop.logo_url ? (
              <img src={shop.logo_url} alt={shop.name} className="w-10 h-10 rounded-full" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Scissors className="w-5 h-5 text-primary" />
              </div>
            )}
            <div>
              <h1 className="font-bold text-lg">{shop.name}</h1>
              {shop.address && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {shop.address}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                i <= currentStepIndex 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary text-muted-foreground"
              )}>
                {i < currentStepIndex ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={cn(
                "ml-2 text-sm hidden sm:inline",
                i <= currentStepIndex ? "text-foreground" : "text-muted-foreground"
              )}>
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div className={cn(
                  "w-8 sm:w-16 h-0.5 mx-2",
                  i < currentStepIndex ? "bg-primary" : "bg-border"
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {step === "service" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Select a Service</h2>
            <div className="grid gap-3">
              {services.map(service => (
                <Card 
                  key={service.id}
                  className={cn(
                    "cursor-pointer transition-all hover:border-primary/50",
                    selectedService?.id === service.id && "border-primary glow-amber-soft"
                  )}
                  onClick={() => setSelectedService(service)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        selectedService?.id === service.id ? "bg-primary/20" : "bg-secondary"
                      )}>
                        <Scissors className={cn(
                          "w-5 h-5",
                          selectedService?.id === service.id ? "text-primary" : "text-muted-foreground"
                        )} />
                      </div>
                      <div>
                        <h3 className="font-medium">{service.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {service.duration_minutes} min
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">${service.price}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button 
              className="w-full mt-4" 
              disabled={!selectedService}
              onClick={() => {
                // If only one barber, auto-select them
                if (barbers.length === 1) {
                  setSelectedBarber(barbers[0])
                  setStep("datetime")
                } else if (barbers.length > 1) {
                  setStep("barber")
                } else {
                  setStep("datetime")
                }
              }}
            >
              Continue
            </Button>
          </div>
        )}

        {/* Barber Selection Step */}
        {step === "barber" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setStep("service")}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h2 className="text-xl font-semibold">Choose Your Professional</h2>
            </div>
            <div className="grid gap-3">
              {barbers.map(barber => (
                <Card 
                  key={barber.id}
                  className={cn(
                    "cursor-pointer transition-all hover:border-primary/50",
                    selectedBarber?.id === barber.id && "border-primary glow-amber-soft"
                  )}
                  onClick={() => setSelectedBarber(barber)}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    {barber.avatar_url ? (
                      <img 
                        src={barber.avatar_url} 
                        alt={barber.display_name || barber.full_name || "Professional"} 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium",
                        selectedBarber?.id === barber.id ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                      )}>
                        {(barber.display_name || barber.full_name || "?").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium">{barber.display_name || barber.full_name || "Professional"}</h3>
                    </div>
                    {selectedBarber?.id === barber.id && (
                      <Check className="w-5 h-5 text-primary ml-auto" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button 
              className="w-full mt-4" 
              disabled={!selectedBarber}
              onClick={() => setStep("datetime")}
            >
              Continue
            </Button>
          </div>
        )}

        {step === "datetime" && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => {
                if (barbers.length > 1) {
                  setStep("barber")
                } else {
                  setStep("service")
                }
              }}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h2 className="text-xl font-semibold">Choose Date & Time</h2>
              {selectedBarber && (
                <span className="text-sm text-muted-foreground ml-auto">
                  with {selectedBarber.display_name || selectedBarber.full_name}
                </span>
              )}
            </div>

            {/* Calendar */}
            <Card className="glass">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      const newDate = new Date(selectedDate || new Date())
                      newDate.setMonth(newDate.getMonth() - 1)
                      setSelectedDate(newDate)
                    }}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <span className="font-medium">
                    {(selectedDate || new Date()).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      const newDate = new Date(selectedDate || new Date())
                      newDate.setMonth(newDate.getMonth() + 1)
                      setSelectedDate(newDate)
                    }}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                    <div key={day} className="text-xs text-muted-foreground py-2">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {generateCalendarDays().map((date, i) => (
                    <button
                      key={i}
                      disabled={!date || !isDateAvailable(date)}
                      className={cn(
                        "aspect-square rounded-lg text-sm transition-colors",
                        !date && "invisible",
                        date && !isDateAvailable(date) && "text-muted-foreground/30 cursor-not-allowed",
                        date && isDateAvailable(date) && "hover:bg-primary/20 cursor-pointer",
                        date && selectedDate?.toDateString() === date.toDateString() && "bg-primary text-primary-foreground"
                      )}
                      onClick={() => date && isDateAvailable(date) && setSelectedDate(date)}
                    >
                      {date?.getDate()}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Time Slots */}
            {selectedDate && (
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Available Times
                </h3>
                {generateTimeSlots(selectedDate).length > 0 ? (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {generateTimeSlots(selectedDate).map(time => (
                      <button
                        key={time}
                        className={cn(
                          "py-2 px-3 rounded-lg text-sm border transition-colors",
                          selectedTime === time 
                            ? "border-primary bg-primary/20 text-primary" 
                            : "border-border hover:border-primary/50"
                        )}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No available times on this date.</p>
                    <p className="text-sm">Please select another day.</p>
                  </div>
                )}
              </div>
            )}

            <Button 
              className="w-full" 
              disabled={!selectedDate || !selectedTime}
              onClick={() => setStep("details")}
            >
              Continue
            </Button>
          </div>
        )}

        {step === "details" && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setStep("datetime")}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h2 className="text-xl font-semibold">Your Details</h2>
            </div>

            <Card className="glass">
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={customerDetails.name}
                    onChange={e => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                    placeholder="John Doe"
                    className="bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerDetails.email}
                    onChange={e => setCustomerDetails({ ...customerDetails, email: e.target.value })}
                    placeholder="john@example.com"
                    className="bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={customerDetails.phone}
                    onChange={e => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                    className="bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Special Requests</Label>
                  <Textarea
                    id="notes"
                    value={customerDetails.notes}
                    onChange={e => setCustomerDetails({ ...customerDetails, notes: e.target.value })}
                    placeholder="Any special requests or notes..."
                    className="bg-secondary/50"
                  />
                </div>
              </CardContent>
            </Card>

            <Button 
              className="w-full" 
              disabled={!customerDetails.name || !customerDetails.email}
              onClick={() => setStep("confirm")}
            >
              Review Booking
            </Button>
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setStep("details")}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h2 className="text-xl font-semibold">Confirm Booking</h2>
            </div>

            <Card className="glass-strong">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-border/50">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Scissors className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{selectedService?.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedService?.duration_minutes} minutes</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="font-bold text-lg text-primary">${selectedService?.price}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      {selectedDate?.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      {selectedTime}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <p className="text-sm text-muted-foreground mb-1">Contact</p>
                  <p className="font-medium">{customerDetails.name}</p>
                  <p className="text-sm text-muted-foreground">{customerDetails.email}</p>
                  {customerDetails.phone && (
                    <p className="text-sm text-muted-foreground">{customerDetails.phone}</p>
                  )}
                </div>

                {customerDetails.notes && (
                  <div className="pt-4 border-t border-border/50">
                    <p className="text-sm text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm">{customerDetails.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {bookingError && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {bookingError}
              </div>
            )}

            <Button 
              className="w-full glow-amber" 
              size="lg"
              disabled={submitting}
              onClick={handleSubmit}
            >
              {submitting ? "Booking..." : "Confirm Booking"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By booking, you agree to the shop&apos;s cancellation policy
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
