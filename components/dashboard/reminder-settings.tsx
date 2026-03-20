"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Clock,
  Check,
  AlertCircle,
  Settings
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ReminderSettings {
  id: string
  email_enabled: boolean
  email_hours_before: number
  email_template: string
  sms_enabled: boolean
  sms_hours_before: number
  sms_template: string
  follow_up_enabled: boolean
  follow_up_days_after: number
  follow_up_template: string
}

const DEFAULT_EMAIL_TEMPLATE = `Hi {{client_name}},

This is a friendly reminder about your upcoming appointment at {{shop_name}}.

📅 Date: {{date}}
⏰ Time: {{time}}
✂️ Service: {{service}}

We look forward to seeing you!

To reschedule or cancel, please contact us at {{shop_phone}}.

Best regards,
{{shop_name}}`

const DEFAULT_SMS_TEMPLATE = `Hi {{client_name}}! Reminder: You have an appointment at {{shop_name}} on {{date}} at {{time}} for {{service}}. See you soon!`

const DEFAULT_FOLLOW_UP_TEMPLATE = `Hi {{client_name}},

Thanks for visiting {{shop_name}}! We hope you loved your {{service}}.

We'd love to see you again soon. Book your next appointment at {{booking_link}}.

Best regards,
{{shop_name}}`

export function ReminderSettings({ shopId }: { shopId: string }) {
  const [settings, setSettings] = useState<ReminderSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [shopId])

  async function loadSettings() {
    const supabase = createClient()
    const { data } = await supabase
      .from("appointment_reminders")
      .select("*")
      .eq("shop_id", shopId)
      .single()

    if (data) {
      setSettings(data)
    } else {
      // Create default settings
      const { data: newSettings } = await supabase
        .from("appointment_reminders")
        .insert({
          shop_id: shopId,
          email_template: DEFAULT_EMAIL_TEMPLATE,
          sms_template: DEFAULT_SMS_TEMPLATE,
          follow_up_template: DEFAULT_FOLLOW_UP_TEMPLATE
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
      .from("appointment_reminders")
      .update({
        email_enabled: settings.email_enabled,
        email_hours_before: settings.email_hours_before,
        email_template: settings.email_template,
        sms_enabled: settings.sms_enabled,
        sms_hours_before: settings.sms_hours_before,
        sms_template: settings.sms_template,
        follow_up_enabled: settings.follow_up_enabled,
        follow_up_days_after: settings.follow_up_days_after,
        follow_up_template: settings.follow_up_template
      })
      .eq("id", settings.id)

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
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

  const variables = [
    { name: "{{client_name}}", desc: "Client's full name" },
    { name: "{{shop_name}}", desc: "Your shop name" },
    { name: "{{date}}", desc: "Appointment date" },
    { name: "{{time}}", desc: "Appointment time" },
    { name: "{{service}}", desc: "Service name" },
    { name: "{{shop_phone}}", desc: "Shop phone number" },
    { name: "{{booking_link}}", desc: "Online booking URL" },
  ]

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
            Reduce no-shows with automated email and SMS reminders
          </p>
        </div>
        <Button onClick={saveSettings} disabled={saving} className="glow-amber-soft">
          {saved ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Saved!
            </>
          ) : saving ? (
            "Saving..."
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>

      <Tabs defaultValue="email" className="space-y-4">
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            SMS
          </TabsTrigger>
          <TabsTrigger value="followup" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Follow-up
          </TabsTrigger>
        </TabsList>

        {/* Email Settings */}
        <TabsContent value="email">
          <Card className="glass">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Email Reminders</CardTitle>
                  <CardDescription>Send email reminders before appointments</CardDescription>
                </div>
                <Switch
                  checked={settings.email_enabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, email_enabled: checked })}
                />
              </div>
            </CardHeader>
            {settings.email_enabled && (
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Send reminder</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      max={72}
                      value={settings.email_hours_before}
                      onChange={(e) => setSettings({ ...settings, email_hours_before: parseInt(e.target.value) || 24 })}
                      className="bg-secondary/50 w-24"
                    />
                    <span className="text-muted-foreground">hours before appointment</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Email Template</Label>
                  <Textarea
                    value={settings.email_template}
                    onChange={(e) => setSettings({ ...settings, email_template: e.target.value })}
                    className="bg-secondary/50 min-h-[250px] font-mono text-sm"
                  />
                </div>
              </CardContent>
            )}
          </Card>
        </TabsContent>

        {/* SMS Settings */}
        <TabsContent value="sms">
          <Card className="glass">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">SMS Reminders</CardTitle>
                  <CardDescription>Send text message reminders before appointments</CardDescription>
                </div>
                <Switch
                  checked={settings.sms_enabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, sms_enabled: checked })}
                />
              </div>
            </CardHeader>
            {settings.sms_enabled && (
              <CardContent className="space-y-4">
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-primary mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-primary">SMS Integration Required</p>
                      <p className="text-muted-foreground">
                        To send SMS reminders, you&apos;ll need to connect a provider like Twilio or MessageBird.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Send reminder</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      max={72}
                      value={settings.sms_hours_before}
                      onChange={(e) => setSettings({ ...settings, sms_hours_before: parseInt(e.target.value) || 24 })}
                      className="bg-secondary/50 w-24"
                    />
                    <span className="text-muted-foreground">hours before appointment</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>SMS Template</Label>
                  <Textarea
                    value={settings.sms_template}
                    onChange={(e) => setSettings({ ...settings, sms_template: e.target.value })}
                    className="bg-secondary/50 min-h-[100px] font-mono text-sm"
                    maxLength={160}
                  />
                  <p className="text-xs text-muted-foreground">
                    {settings.sms_template.length}/160 characters (standard SMS limit)
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </TabsContent>

        {/* Follow-up Settings */}
        <TabsContent value="followup">
          <Card className="glass">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Follow-up Messages</CardTitle>
                  <CardDescription>Send thank you emails after appointments</CardDescription>
                </div>
                <Switch
                  checked={settings.follow_up_enabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, follow_up_enabled: checked })}
                />
              </div>
            </CardHeader>
            {settings.follow_up_enabled && (
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Send follow-up</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      max={14}
                      value={settings.follow_up_days_after}
                      onChange={(e) => setSettings({ ...settings, follow_up_days_after: parseInt(e.target.value) || 1 })}
                      className="bg-secondary/50 w-24"
                    />
                    <span className="text-muted-foreground">days after appointment</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Follow-up Template</Label>
                  <Textarea
                    value={settings.follow_up_template}
                    onChange={(e) => setSettings({ ...settings, follow_up_template: e.target.value })}
                    className="bg-secondary/50 min-h-[200px] font-mono text-sm"
                  />
                </div>
              </CardContent>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Template Variables */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="w-4 h-4 text-primary" />
            Available Variables
          </CardTitle>
          <CardDescription>Use these placeholders in your templates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {variables.map(v => (
              <div 
                key={v.name} 
                className="p-2 bg-secondary/30 rounded-lg border border-border/30"
              >
                <code className="text-xs text-primary">{v.name}</code>
                <p className="text-xs text-muted-foreground mt-1">{v.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
