import { createClient } from "@/lib/supabase/server"
import { ServicesList } from "@/components/dashboard/services-list"
import { NewServiceModal } from "@/components/dashboard/new-service-modal"
import { PageHeader } from "@/components/dashboard/page-header"
import { AddServiceButton } from "@/components/dashboard/add-service-button"

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
        <PageHeader titleKey="services.title" subtitleKey="services.subtitle" />
        <NewServiceModal shopId={shopId} defaultOpen={showNewModal}>
          <AddServiceButton />
        </NewServiceModal>
      </div>

      {/* Services list */}
      <ServicesList services={services || []} />
    </div>
  )
}
