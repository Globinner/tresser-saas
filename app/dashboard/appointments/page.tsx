import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { AppointmentsList } from "@/components/dashboard/appointments-list"
import { NewAppointmentModal } from "@/components/dashboard/new-appointment-modal"
import { Calendar, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

// Disable caching for this page - always fetch fresh data
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Get user's shop
  const { data: profile } = await supabase
    .from("profiles")
    .select("shop_id")
    .eq("id", user.id)
    .single()

  const shopId = profile?.shop_id

  // Get all appointments
  const { data: appointments } = await supabase
    .from("appointments")
    .select(`
      *,
      clients(id, full_name, phone, email),
      services(id, name, duration_minutes, price),
      profiles!appointments_barber_id_fkey(id, full_name)
    `)
    .eq("shop_id", shopId)
    .order("appointment_time", { ascending: true })

  // Get clients for the modal
  const { data: clients } = await supabase
    .from("clients")
    .select("id, full_name, phone, email")
    .eq("shop_id", shopId)
    .order("full_name")

  // Get services for the modal
  const { data: services } = await supabase
    .from("services")
    .select("id, name, duration_minutes, price")
    .eq("shop_id", shopId)
    .eq("is_active", true)
    .order("name")

  // Get barbers for the modal
  const { data: barbers } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("shop_id", shopId)

  const showNewModal = params.new === "true"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Appointments</h1>
          <p className="text-muted-foreground">Manage your bookings and schedule</p>
        </div>
        <NewAppointmentModal
          clients={clients || []}
          services={services || []}
          barbers={barbers || []}
          shopId={shopId}
          defaultOpen={showNewModal}
        >
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-amber-soft">
            <Plus className="w-4 h-4 mr-2" />
            New Appointment
          </Button>
        </NewAppointmentModal>
      </div>

      {/* Appointments list */}
      <Suspense fallback={<div className="text-center py-12">Loading appointments...</div>}>
        <AppointmentsList appointments={appointments || []} />
      </Suspense>
    </div>
  )
}
