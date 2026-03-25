"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Loader2, Camera, Upload } from "lucide-react"
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
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "")
  const [role, setRole] = useState(profile?.role || "barber")
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const router = useRouter()
  const supabase = createClient()
  const { t } = useLanguage()

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setAvatarUrl(data.url)
      
      // Update profile with new avatar URL
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: data.url })
        .eq("id", user.id)

      if (error) throw error

      setMessage({ type: "success", text: t("settings.avatarUpdated") || "Avatar updated!" })
      router.refresh()
    } catch (error: any) {
      setMessage({ type: "error", text: error.message })
    } finally {
      setUploading(false)
    }
  }

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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex items-center gap-6">
          <div className="relative">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt="Profile" 
                className="w-20 h-20 rounded-full object-cover border-2 border-primary/30"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-medium">
                {fullName?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{t("settings.profilePhoto") || "Profile Photo"}</h3>
            <p className="text-sm text-muted-foreground mb-2">{t("settings.profilePhotoDesc") || "This will be shown in the header and booking page"}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? t("common.uploading") || "Uploading..." : t("settings.uploadPhoto") || "Upload Photo"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
        </div>

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
