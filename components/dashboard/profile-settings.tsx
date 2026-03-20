"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Loader2 } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  role: string
}

interface ProfileSettingsProps {
  user: SupabaseUser
  profile: Profile | null
}

export function ProfileSettings({ user, profile }: ProfileSettingsProps) {
  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", user.id)

    if (error) {
      setMessage({ type: "error", text: error.message })
    } else {
      setMessage({ type: "success", text: "Profile updated successfully" })
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
          <h2 className="font-semibold">Profile Settings</h2>
          <p className="text-sm text-muted-foreground">Update your personal information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input
            type="email"
            value={user.email || ""}
            disabled
            className="bg-secondary/50 border-border text-muted-foreground"
          />
          <p className="text-xs text-muted-foreground">Email cannot be changed</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Full Name</label>
          <Input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            className="bg-input border-border"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Role</label>
          <Input
            type="text"
            value={profile?.role || "barber"}
            disabled
            className="bg-secondary/50 border-border text-muted-foreground capitalize"
          />
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
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </div>
  )
}
