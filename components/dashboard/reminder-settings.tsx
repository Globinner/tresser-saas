"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Clock,
  Check,
  Loader2
} from "lucide-react"

interface ReminderSettingsData {
  id: string
  shop_id: string
  email_enabled: boolean
  sms_enabled: boolean
  reminder_24h: boolean
  reminder_2h: boolean
  custom_message: string | null
}

export function ReminderSettings({ shopId }: { shopId: string }) {
  const [settings, setSettings] = useState<ReminderSettingsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    loadSettings()
  }, [shopId])

  async function loadSettings() {
    setLoading(true)
    setError(null)
    
    const { data, error: fetchError } = await supabase
      .from("reminder_settings")
      .select("*")
      .eq("shop_id", shopId)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 = no rows returned, which is fine
      setError(fetchError.message)
      setLoading(false)
      return
    }

    if (data) {
      setSettings(data)
    } else {
      // Create default settings
      const { data: newSettings, error: insertError } = await supabase
        .from("reminder_settings")
        .insert({
          shop_id: shopId,
          email_enabled: true,
          sms_enabled: false,
          reminder_24h: true,
          reminder_2h: true,
          custom_message: null
        })
        .select()
        .single()
      
      if (insertError) {
        setError(insertError.message)
      } else {
        setSettings(newSettings)
      }
    }
    setLoading(false)
  }

  async function saveSettings() {
    if (!settings) return
    setSaving(true)
    setError(null)
    
    const { error: updateError } = await supabase
      .from("reminder_settings")
      .update({
        email_enabled: settings.email_enabled,
        sms_enabled: settings.sms_enabled,
        reminder_24h: settings.reminder_24h,
        reminder_2h: settings.reminder_2h,
        custom_message: settings.custom_message
      })
      .eq("id", settings.id)

    if (updateError) {
      setError(updateError.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <Card className="glass">
        <CardContent className="p-8 text-center">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground mt-2">Loading settings...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="glass">
        <CardContent className="p-8 text-center">
          <p className="text-destructive">{error}</p>
          <Button onClick={loadSettings} className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!settings) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Appointment Reminders
          </h2>
          <p className="text-sm text-muted-foreground">
            Reduce no-shows with automated reminders
          </p>
        </div>
        <Button onClick={saveSettings} disabled={saving}>
          {saved ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Saved!
            </>
          ) : saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>

      {/* Notification Channels */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-base">Notification Channels</CardTitle>
          <CardDescription>Choose how to send reminders to clients</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Email Reminders</p>
                <p className="text-sm text-muted-foreground">Send reminders via email</p>
              </div>
            </div>
            <Switch
              checked={settings.email_enabled}
              onCheckedChange={(checked) => setSettings({ ...settings, email_enabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">SMS Reminders</p>
                <p className="text-sm text-muted-foreground">Send reminders via text message</p>
              </div>
            </div>
            <Switch
              checked={settings.sms_enabled}
              onCheckedChange={(checked) => setSettings({ ...settings, sms_enabled: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Timing */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-base">Reminder Timing</CardTitle>
          <CardDescription>When to send reminders before appointments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">24 Hours Before</p>
                <p className="text-sm text-muted-foreground">Send a reminder one day before</p>
              </div>
            </div>
            <Switch
              checked={settings.reminder_24h}
              onCheckedChange={(checked) => setSettings({ ...settings, reminder_24h: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">2 Hours Before</p>
                <p className="text-sm text-muted-foreground">Send a reminder 2 hours before</p>
              </div>
            </div>
            <Switch
              checked={settings.reminder_2h}
              onCheckedChange={(checked) => setSettings({ ...settings, reminder_2h: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Custom Message */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-base">Custom Message</CardTitle>
          <CardDescription>Add a personal message to your reminders (optional)</CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="custom-message" className="sr-only">Custom Message</Label>
          <Textarea
            id="custom-message"
            placeholder="e.g., We look forward to seeing you! Please arrive 5 minutes early."
            value={settings.custom_message || ""}
            onChange={(e) => setSettings({ ...settings, custom_message: e.target.value || null })}
            className="bg-secondary/50 min-h-[100px]"
          />
        </CardContent>
      </Card>
    </div>
  )
}
