import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { ClientDetailView } from "@/components/dashboard/client-detail-view"
import Link from "next/link"

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
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="text-xl font-semibold mb-2">Create Your Shop First</h2>
        <p className="text-muted-foreground mb-4">Go to Settings &gt; Shop to set up your shop</p>
        <Link href="/dashboard/settings?tab=shop" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">
          Go to Settings
        </Link>
      </div>
    )
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
