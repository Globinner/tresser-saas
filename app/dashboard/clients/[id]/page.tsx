import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { ClientDetailView } from "@/components/dashboard/client-detail-view"
import { ShopSetupRequired } from "@/components/dashboard/shop-setup-required"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ClientDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get the user's shop
  const { data: profile } = await supabase
    .from("profiles")
    .select("shop_id")
    .eq("id", user.id)
    .single()

  if (!profile?.shop_id) {
    return <ShopSetupRequired userId={user.id} featureName="Client Details" />
  }

  // Get the client
  const { data: client, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .eq("shop_id", profile.shop_id)
    .single()

  if (error || !client) {
    notFound()
  }

  return (
    <ClientDetailView 
      client={client} 
      shopId={profile.shop_id} 
    />
  )
}
