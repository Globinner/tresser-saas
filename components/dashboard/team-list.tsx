"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { 
  User, 
  Crown,
  Scissors,
  MoreVertical,
  Trash2,
  Shield,
  Mail,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/language-context"

interface TeamMember {
  id: string
  full_name: string | null
  avatar_url: string | null
  role: string
  created_at: string
}

interface TeamListProps {
  members: TeamMember[]
  currentUserId: string
  isOwner: boolean
}

const roleConfig = {
  owner: { icon: Crown, label: "Owner", color: "text-primary", bg: "bg-primary/10" },
  barber: { icon: Scissors, label: "Barber", color: "text-blue-400", bg: "bg-blue-400/10" },
  admin: { icon: Shield, label: "Admin", color: "text-purple-400", bg: "bg-purple-400/10" },
  nail_tech: { icon: Sparkles, label: "Nail Tech", color: "text-pink-400", bg: "bg-pink-400/10" },
}

export function TeamList({ members, currentUserId, isOwner }: TeamListProps) {
  const router = useRouter()
  const supabase = createClient()
  const [removing, setRemoving] = useState<string | null>(null)
  const { locale, isRTL } = useLanguage()
  const isHebrew = locale === 'he'

  const roleLabels = {
    owner: isHebrew ? "בעלים" : "Owner",
    barber: isHebrew ? "ספר" : "Barber",
    admin: isHebrew ? "מנהל" : "Admin",
    nail_tech: isHebrew ? "לק ג'ל בניה ועיצוב ציפורניים" : "Nail Tech",
  }

  async function handleRemove(memberId: string) {
    if (!confirm(isHebrew ? "האם אתה בטוח שברצונך להסיר חבר צוות זה?" : "Are you sure you want to remove this team member?")) return
    
    setRemoving(memberId)
    await supabase
      .from("profiles")
      .update({ shop_id: null, role: "barber" })
      .eq("id", memberId)
    router.refresh()
    setRemoving(null)
  }

  async function changeRole(memberId: string, newRole: string) {
    await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", memberId)
    router.refresh()
  }

  if (members.length === 0) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-6">
          <User className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{isHebrew ? "אין חברי צוות עדיין" : "No team members yet"}</h3>
        <p className="text-muted-foreground mb-6">
          {isHebrew ? "הזמן ספרים וצוות להצטרף לעסק שלך" : "Invite barbers and staff to join your shop"}
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((member) => {
        const role = roleConfig[member.role as keyof typeof roleConfig] || roleConfig.barber
        const isCurrentUser = member.id === currentUserId

        return (
          <div
            key={member.id}
            className={cn(
              "glass rounded-xl p-6 hover:border-primary/30 transition-all duration-300 group",
              removing === member.id && "opacity-50"
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                {member.avatar_url ? (
                  <img 
                    src={member.avatar_url} 
                    alt={member.full_name || "Team member"}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                    {member.full_name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    {member.full_name || "Unnamed"}
                    {isCurrentUser && (
                      <span className="text-xs text-muted-foreground">(You)</span>
                    )}
                  </h3>
                  <div className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium", role.bg)}>
                    <role.icon className={cn("w-3 h-3", role.color)} />
                    <span className={role.color}>{roleLabels[member.role as keyof typeof roleLabels] || role.label}</span>
                  </div>
                </div>
              </div>

              {isOwner && !isCurrentUser && member.role !== "owner" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-strong">
                    <DropdownMenuItem onClick={() => changeRole(member.id, "barber")}>
                      <Scissors className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
                      {isHebrew ? "הגדר כספר" : "Set as Barber"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => changeRole(member.id, "nail_tech")}>
                      <Sparkles className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
                      {isHebrew ? "הגדר כמומחה ציפורניים" : "Set as Nail Tech"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => changeRole(member.id, "admin")}>
                      <Shield className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
                      {isHebrew ? "הגדר כמנהל" : "Set as Admin"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => handleRemove(member.id)}
                    >
                      <Trash2 className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
                      {isHebrew ? "הסר מהצוות" : "Remove from Team"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              {isHebrew ? "הצטרף " : "Joined "}{new Date(member.created_at).toLocaleDateString(isHebrew ? 'he-IL' : 'en-US')}
            </div>
          </div>
        )
      })}
    </div>
  )
}
