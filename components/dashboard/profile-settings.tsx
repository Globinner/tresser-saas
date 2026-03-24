"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface Profile {
  id: string
  full_name: string | null
  display_name: string | null
  avatar_url: string | null
  role: string
}

interface ProfileSettingsProps {
  user: SupabaseUser
  profile: Profile | null
}

const ROLES = [
  { value: "owner", labelKey: "settings.roleOwner" },
  { value: "barber", labelKey: "settings.roleBarber" },
  { value: "receptionist", labelKey: "settings.roleReceptionist" },
]

export function ProfileSettings({ user, profile }: ProfileSettingsProps) {
  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [displayName, setDisplayName] = useState(profile?.display_name || "")
  const [role, setRole] = useState(profile?.role || "barber")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  
  const router = useRouter()
  const supabase = createClient()
  const { t } = useLanguage()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase
      .from("profiles")
      .update({ 
        full_name: fullName,
        display_name: displayName || null,
        role: role
      })
      .eq("id", user.id)

    if (error) {
      setMessage({ type: "error", text: error.message })
    } else {
      setMessage({ type: "success", text: t("settings.profileUpdated") })
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <User className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold">{t("settings.profileSettings")}</h2>
          <p className="text-sm text-muted-foreground">{t("settings.profileSettingsDesc")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">{t("settings.email")}</label>
          <Input
            type="email"
            value={user.email || ""}
            disabled
            className="bg-secondary/50 border-border text-muted-foreground"
          />
          <p className="text-xs text-muted-foreground">{t("settings.emailCannotChange")}</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t("settings.fullName")}</label>
          <Input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={t("settings.fullNamePlaceholder")}
            className="bg-input border-border"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t("settings.displayName")}</label>
          <Input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder={t("settings.displayNamePlaceholder")}
            className="bg-input border-border"
          />
          <p className="text-xs text-muted-foreground">{t("settings.displayNameHint")}</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t("settings.role")}</label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {t(r.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {message && (
          <div className={`p-3 rounded-lg text-sm ${
            message.type === "success" 
              ? "bg-green-400/10 text-green-400 border border-green-400/20" 
              : "bg-destructive/10 text-destructive border border-destructive/20"
          }`}>
            {message.text}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t("common.saving")}
            </>
          ) : (
            t("common.save")
          )}
        </Button>
      </form>
    </div>
  )
}
