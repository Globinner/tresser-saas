import { createClient } from "@/lib/supabase/server"
import { ServicesList } from "@/components/dashboard/services-list"
import { NewServiceModal } from "@/components/dashboard/new-service-modal"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function ServicesPage({
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

  // Get all services
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("shop_id", shopId)
    .order("name")

  const showNewModal = params.new === "true"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Services</h1>
          <p className="text-muted-foreground">Manage your service offerings and pricing</p>
        </div>
        <NewServiceModal shopId={shopId} defaultOpen={showNewModal}>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-amber-soft">
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
        </NewServiceModal>
      </div>

      {/* Services list */}
      <ServicesList services={services || []} />
    </div>
  )
}
