import { createClient } from "@/lib/supabase/server"
import { TeamList } from "@/components/dashboard/team-list"
import { InviteTeamModal } from "@/components/dashboard/invite-team-modal"
import { SubscriptionGate } from "@/components/dashboard/subscription-gate"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function TeamPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Get user's shop
  const { data: profile } = await supabase
    .from("profiles")
    .select("shop_id, role")
    .eq("id", user.id)
    .single()

  const shopId = profile?.shop_id
  const isOwner = profile?.role === "owner"

  // Get all team members
  const { data: teamMembers } = await supabase
    .from("profiles")
    .select("*")
    .eq("shop_id", shopId)
    .order("role")

  return (
    <SubscriptionGate feature="team" featureName="Team Management" requiredPlan="pro">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Team</h1>
            <p className="text-muted-foreground">Manage your shop&apos;s barbers and staff</p>
          </div>
          {isOwner && (
            <InviteTeamModal shopId={shopId}>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-amber-soft">
                <Plus className="w-4 h-4 mr-2" />
                Invite Member
              </Button>
            </InviteTeamModal>
          )}
        </div>

        {/* Team list */}
        <TeamList members={teamMembers || []} currentUserId={user.id} isOwner={isOwner} />
      </div>
    </SubscriptionGate>
  )
}
