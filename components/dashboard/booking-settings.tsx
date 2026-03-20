"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
  Globe, 
  Copy, 
  Check, 
  ExternalLink,
  Clock,
  Calendar
} from "lucide-react"
import { cn } from "@/lib/utils"

interface BookingSettings {
  id: string
  is_enabled: boolean
  booking_slug: string
  booking_advance_days: number
  slot_duration_minutes: number
  business_hours: Record<string, { open: string; close: string; closed?: boolean }>
}

const DEFAULT_HOURS = {
  monday: { open: "09:00", close: "18:00" },
  tuesday: { open: "09:00", close: "18:00" },
  wednesday: { open: "09:00", close: "18:00" },
  thursday: { open: "09:00", close: "18:00" },
  friday: { open: "09:00", close: "18:00" },
  saturday: { open: "09:00", close: "17:00" },
  sunday: { open: "10:00", close: "16:00", closed: true }
}

const DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" }
]

export function BookingSettings({ shopId }: { shopId: string }) {
  const [settings, setSettings] = useState<BookingSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [shopId])

  async function loadSettings() {
    const supabase = createClient()
    const { data } = await supabase
      .from("public_booking_settings")
      .select("*")
      .eq("shop_id", shopId)
      .single()

    if (data) {
      setSettings(data)
    } else {
      // Create default settings
      const slug = `shop-${shopId.slice(0, 8)}`
      const { data: newSettings } = await supabase
        .from("public_booking_settings")
        .insert({
          shop_id: shopId,
          booking_slug: slug,
          business_hours: DEFAULT_HOURS
        })
        .select()
        .single()
      
      setSettings(newSettings)
    }
    setLoading(false)
  }

  async function saveSettings() {
    if (!settings) return
    setSaving(true)
    
    const supabase = createClient()
    await supabase
      .from("public_booking_settings")
      .update({
        is_enabled: settings.is_enabled,
        booking_slug: settings.booking_slug,
        booking_advance_days: settings.booking_advance_days,
        slot_duration_minutes: settings.slot_duration_minutes,
        business_hours: settings.business_hours
      })
      .eq("id", settings.id)

    setSaving(false)
  }

  function copyLink() {
    const url = `${window.location.origin}/book/${settings?.booking_slug}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function updateHours(day: string, field: "open" | "close" | "closed", value: string | boolean) {
    if (!settings) return
    
    const newHours = { ...settings.business_hours }
    if (field === "closed") {
      newHours[day] = { ...newHours[day], closed: value as boolean }
    } else {
      newHours[day] = { ...newHours[day], [field]: value as string }
    }
    
    setSettings({ ...settings, business_hours: newHours })
  }

  if (loading) {
    return (
      <Card className="glass">
        <CardContent className="p-8 text-center">
          <div className="animate-pulse text-muted-foreground">Loading settings...</div>
        </CardContent>
      </Card>
    )
  }

  if (!settings) return null

  const bookingUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/book/${settings.booking_slug}`

  return (
    <div className="space-y-6">
      {/* Enable/Disable */}
      <Card className="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Online Booking
              </CardTitle>
              <CardDescription>Allow clients to book appointments online</CardDescription>
            </div>
            <Switch
              checked={settings.is_enabled}
              onCheckedChange={(checked) => setSettings({ ...settings, is_enabled: checked })}
            />
          </div>
        </CardHeader>
        {settings.is_enabled && (
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
              <Input
                value={bookingUrl}
                readOnly
                className="bg-transparent border-0 text-sm"
              />
              <Button variant="ghost" size="icon" onClick={copyLink}>
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href={bookingUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Booking URL Slug */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-base">Booking URL</CardTitle>
          <CardDescription>Customize your booking page URL</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">/book/</span>
            <Input
              value={settings.booking_slug}
              onChange={(e) => setSettings({ ...settings, booking_slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
              className="bg-secondary/50 max-w-xs"
              placeholder="your-shop-name"
            />
          </div>
        </CardContent>
      </Card>

      {/* Booking Rules */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Booking Rules
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Advance Booking (days)</Label>
              <Input
                type="number"
                min={1}
                max={90}
                value={settings.booking_advance_days}
                onChange={(e) => setSettings({ ...settings, booking_advance_days: parseInt(e.target.value) || 14 })}
                className="bg-secondary/50"
              />
              <p className="text-xs text-muted-foreground">How far in advance clients can book</p>
            </div>
            <div className="space-y-2">
              <Label>Time Slot Duration (min)</Label>
              <Input
                type="number"
                min={15}
                max={120}
                step={15}
                value={settings.slot_duration_minutes}
                onChange={(e) => setSettings({ ...settings, slot_duration_minutes: parseInt(e.target.value) || 30 })}
                className="bg-secondary/50"
              />
              <p className="text-xs text-muted-foreground">Interval between available slots</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Hours */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Business Hours
          </CardTitle>
          <CardDescription>Set your available hours for online booking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {DAYS.map(day => {
              const hours = settings.business_hours[day.key] || { open: "09:00", close: "18:00", closed: true }
              return (
                <div key={day.key} className="flex items-center gap-4">
                  <div className="w-24">
                    <span className={cn(
                      "text-sm font-medium",
                      hours.closed && "text-muted-foreground"
                    )}>
                      {day.label}
                    </span>
                  </div>
                  <Switch
                    checked={!hours.closed}
                    onCheckedChange={(checked) => updateHours(day.key, "closed", !checked)}
                  />
                  {!hours.closed && (
                    <>
                      <Input
                        type="time"
                        value={hours.open}
                        onChange={(e) => updateHours(day.key, "open", e.target.value)}
                        className="bg-secondary/50 w-32"
                      />
                      <span className="text-muted-foreground">to</span>
                      <Input
                        type="time"
                        value={hours.close}
                        onChange={(e) => updateHours(day.key, "close", e.target.value)}
                        className="bg-secondary/50 w-32"
                      />
                    </>
                  )}
                  {hours.closed && (
                    <span className="text-sm text-muted-foreground">Closed</span>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Button onClick={saveSettings} disabled={saving} className="w-full glow-amber-soft">
        {saving ? "Saving..." : "Save Booking Settings"}
      </Button>
    </div>
  )
}
