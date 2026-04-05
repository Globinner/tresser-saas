import { createClient } from "@/lib/supabase/server"
import { ClientsList } from "@/components/dashboard/clients-list"
import { NewClientModal } from "@/components/dashboard/new-client-modal"
import { PageHeader } from "@/components/dashboard/page-header"
import { AddClientButton } from "@/components/dashboard/add-client-button"

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; search?: string }>
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

  // Get all clients with search
  let query = supabase
    .from("clients")
    .select("*")
    .eq("shop_id", shopId)
    .order("first_name")

  if (params.search) {
    query = query.or(`first_name.ilike.%${params.search}%,last_name.ilike.%${params.search}%,phone.ilike.%${params.search}%,email.ilike.%${params.search}%`)
  }

  const { data: clients } = await query

  const showNewModal = params.new === "true"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader titleKey="clients.title" subtitleKey="clients.subtitle" />
        <NewClientModal shopId={shopId} defaultOpen={showNewModal}>
          <AddClientButton />
        </NewClientModal>
      </div>

      {/* Clients list */}
      <ClientsList clients={clients || []} />
    </div>
  )
}
