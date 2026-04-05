"use client"

import { useState, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Copy, Check, UserPlus, Link2, Loader2, Scissors, Sparkles, Shield } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/i18n/language-context"

interface InviteTeamModalProps {
  shopId: string | null
  children: ReactNode
}

export function InviteTeamModal({
  shopId,
  children,
}: InviteTeamModalProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [role, setRole] = useState<string>("barber")
  const router = useRouter()
  const supabase = createClient()
  const { locale, isRTL } = useLanguage()
  const isHebrew = locale === 'he'
  
  // Generate an invite link (in production, this would be a proper invite system)
  const inviteLink = typeof window !== "undefined" 
    ? `${window.location.origin}/join/${shopId}`
    : ""

  async function copyLink() {
    await navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function resetForm() {
    setFirstName("")
    setLastName("")
    setEmail("")
    setPhone("")
    setRole("barber")
  }

  async function handleAddMember() {
    if (!firstName.trim()) {
      toast.error(isHebrew ? "נא להזין שם פרטי" : "Please enter first name")
      return
    }
    if (!shopId) {
      toast.error(isHebrew ? "חנות לא נמצאה" : "Shop not found")
      return
    }

    setLoading(true)
    try {
      // Create a new profile without auth (manual team member)
      // Generate a unique ID for this member
      const memberId = crypto.randomUUID()
      
      const { error } = await supabase
        .from("profiles")
        .insert({
          id: memberId,
          first_name: firstName.trim(),
          last_name: lastName.trim() || null,
          email: email.trim() || null,
          phone: phone.trim() || null,
          role: role,
          shop_id: shopId,
        })

      if (error) throw error

      toast.success(isHebrew ? "חבר צוות נוסף בהצלחה" : "Team member added successfully")
      resetForm()
      setOpen(false)
      router.refresh()
    } catch (error: unknown) {
      console.error("Error adding team member:", error)
      toast.error(isHebrew ? "שגיאה בהוספת חבר צוות" : "Failed to add team member")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen)
      if (!isOpen) resetForm()
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="glass-strong border-border sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className={`text-xl font-bold ${isRTL ? 'text-right' : ''}`}>
            {isHebrew ? "הוסף חבר צוות" : "Add Team Member"}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="manual" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              {isHebrew ? "הוסף ידנית" : "Add Manually"}
            </TabsTrigger>
            <TabsTrigger value="invite" className="flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              {isHebrew ? "קישור הזמנה" : "Invite Link"}
            </TabsTrigger>
          </TabsList>

          {/* Manual Add Tab */}
          <TabsContent value="manual" className="space-y-4 mt-4">
            <div className={`grid grid-cols-2 gap-4 ${isRTL ? 'text-right' : ''}`}>
              <div className="space-y-2">
                <Label>{isHebrew ? "שם פרטי *" : "First Name *"}</Label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={isHebrew ? "יוסי" : "John"}
                  className={isRTL ? 'text-right' : ''}
                />
              </div>
              <div className="space-y-2">
                <Label>{isHebrew ? "שם משפחה" : "Last Name"}</Label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={isHebrew ? "כהן" : "Doe"}
                  className={isRTL ? 'text-right' : ''}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{isHebrew ? "טלפון" : "Phone"}</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="050-123-4567"
                className={isRTL ? 'text-right' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label>{isHebrew ? "אימייל (אופציונלי)" : "Email (optional)"}</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className={isRTL ? 'text-right' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label>{isHebrew ? "תפקיד" : "Role"}</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="barber">
                    <div className="flex items-center gap-2">
                      <Scissors className="w-4 h-4 text-blue-400" />
                      {isHebrew ? "ספר" : "Barber"}
                    </div>
                  </SelectItem>
                  <SelectItem value="nail_tech">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-pink-400" />
                      {isHebrew ? "מומחה ציפורניים" : "Nail Tech"}
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-purple-400" />
                      {isHebrew ? "מנהל" : "Admin"}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleAddMember}
              disabled={loading || !firstName.trim()}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  {isHebrew ? "הוסף חבר צוות" : "Add Team Member"}
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              {isHebrew 
                ? "חבר צוות שנוסף ידנית לא יוכל להתחבר לאפליקציה. השתמש בקישור הזמנה אם הם צריכים גישה."
                : "Manually added members won't be able to log in. Use invite link if they need app access."}
            </p>
          </TabsContent>

          {/* Invite Link Tab */}
          <TabsContent value="invite" className="mt-4">
            <div className="text-center py-8 px-4 rounded-xl bg-secondary/30 border border-border">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">
                {isHebrew ? "שתף קישור הזמנה" : "Share Invite Link"}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                {isHebrew 
                  ? "שלח קישור זה להזמנת חברי צוות להצטרף לחנות שלך"
                  : "Send this link to invite team members to join your shop"}
              </p>
              
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={inviteLink}
                  className="bg-input border-border text-sm"
                />
                <Button
                  onClick={copyLink}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground mt-4">
              <p>{isHebrew ? "חברי צוות יצטרכו ליצור חשבון ו" : "Team members will need to create an account and"}</p>
              <p>{isHebrew ? "להשתמש בקישור זה להצטרפות לחנות שלך." : "use this link to join your shop."}</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
