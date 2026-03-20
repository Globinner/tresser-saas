import { createClient } from "@/lib/supabase/server"
import { ClientsList } from "@/components/dashboard/clients-list"
import { NewClientModal } from "@/components/dashboard/new-client-modal"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

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
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-muted-foreground">Manage your client database</p>
        </div>
        <NewClientModal shopId={shopId} defaultOpen={showNewModal}>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-amber-soft">
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </Button>
        </NewClientModal>
      </div>

      {/* Clients list */}
      <ClientsList clients={clients || []} />
    </div>
  )
}
