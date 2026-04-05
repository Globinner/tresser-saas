"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, Plus, Edit2, Trash2, Users, CheckCircle, XCircle, AlertCircle, Send } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useLanguage } from "@/lib/i18n/language-context"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface TeamMember {
  id: string
  first_name: string | null
  last_name: string | null
  role: string
}

interface Shift {
  id: string
  profile_id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_available: boolean
  status: 'pending' | 'approved' | 'rejected'
  submitted_by: string | null
  notes: string | null
}

interface WeeklyScheduleProps {
  shopId: string
  teamMembers: TeamMember[]
  isOwner?: boolean
  currentUserId?: string
}

const DAYS_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const DAYS_HE = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"]

const TIME_SLOTS = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", 
  "20:00", "21:00", "22:00"
]

export function WeeklySchedule({ shopId, teamMembers, isOwner = false, currentUserId }: WeeklyScheduleProps) {
  const [shifts, setShifts] = useState<Shift[]>([])
  const [loading, setLoading] = useState(true)
  const [editingShift, setEditingShift] = useState<Shift | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<string>("")
  const [selectedDay, setSelectedDay] = useState<number>(0)
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("17:00")
  const [isAvailable, setIsAvailable] = useState(true)
  const [notes, setNotes] = useState("")
  const [saving, setSaving] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)
  
  const supabase = createClient()
  const { locale, isRTL } = useLanguage()
  const isHebrew = locale === 'he'
  const DAYS = isHebrew ? DAYS_HE : DAYS_EN

  useEffect(() => {
    loadShifts()
  }, [shopId])

  async function loadShifts() {
    setLoading(true)
    try {
      const memberIds = teamMembers.map(m => m.id)
      if (memberIds.length === 0) {
        setShifts([])
        setLoading(false)
        return
      }
      
      const { data, error } = await supabase
        .from("team_shifts")
        .select("*")
        .in("profile_id", memberIds)
        .order("day_of_week")
        .order("start_time")

      if (error) throw error
      setShifts(data || [])
      setPendingCount((data || []).filter(s => s.status === 'pending').length)
    } catch (error) {
      console.error("Error loading shifts:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveShift() {
    if (!selectedMember || !startTime || !endTime) {
      toast.error(isHebrew ? "נא למלא את כל השדות" : "Please fill all fields")
      return
    }

    setSaving(true)
    try {
      // If owner creates shift, it's auto-approved
      // If staff submits, it's pending approval
      const status = isOwner ? 'approved' : 'pending'
      const submittedBy = isOwner ? null : currentUserId

      if (editingShift) {
        const { error } = await supabase
          .from("team_shifts")
          .update({
            day_of_week: selectedDay,
            start_time: startTime,
            end_time: endTime,
            is_available: isAvailable,
            notes: notes || null,
          })
          .eq("id", editingShift.id)

        if (error) throw error
        toast.success(isHebrew ? "המשמרת עודכנה" : "Shift updated")
      } else {
        const { error } = await supabase
          .from("team_shifts")
          .insert({
            profile_id: selectedMember,
            shop_id: shopId,
            day_of_week: selectedDay,
            start_time: startTime,
            end_time: endTime,
            is_available: isAvailable,
            status,
            submitted_by: submittedBy,
            notes: notes || null,
          })

        if (error) throw error
        
        if (isOwner) {
          toast.success(isHebrew ? "המשמרת נוספה" : "Shift added")
        } else {
          toast.success(isHebrew ? "הבקשה נשלחה לאישור" : "Request sent for approval")
        }
      }

      setIsDialogOpen(false)
      resetForm()
      loadShifts()
    } catch (error) {
      console.error("Error saving shift:", error)
      toast.error(isHebrew ? "שגיאה בשמירת המשמרת" : "Error saving shift")
    } finally {
      setSaving(false)
    }
  }

  async function handleApproveShift(shiftId: string) {
    try {
      const { error } = await supabase
        .from("team_shifts")
        .update({ status: 'approved' })
        .eq("id", shiftId)

      if (error) throw error
      toast.success(isHebrew ? "המשמרת אושרה" : "Shift approved")
      loadShifts()
    } catch (error) {
      console.error("Error approving shift:", error)
      toast.error(isHebrew ? "שגיאה באישור המשמרת" : "Error approving shift")
    }
  }

  async function handleRejectShift(shiftId: string) {
    try {
      const { error } = await supabase
        .from("team_shifts")
        .update({ status: 'rejected' })
        .eq("id", shiftId)

      if (error) throw error
      toast.success(isHebrew ? "המשמרת נדחתה" : "Shift rejected")
      loadShifts()
    } catch (error) {
      console.error("Error rejecting shift:", error)
      toast.error(isHebrew ? "שגיאה בדחיית המשמרת" : "Error rejecting shift")
    }
  }

  async function handleDeleteShift(shiftId: string) {
    if (!confirm(isHebrew ? "האם למחוק משמרת זו?" : "Delete this shift?")) return

    try {
      const { error } = await supabase
        .from("team_shifts")
        .delete()
        .eq("id", shiftId)

      if (error) throw error
      toast.success(isHebrew ? "המשמרת נמחקה" : "Shift deleted")
      loadShifts()
    } catch (error) {
      console.error("Error deleting shift:", error)
      toast.error(isHebrew ? "שגיאה במחיקת המשמרת" : "Error deleting shift")
    }
  }

  function resetForm() {
    setEditingShift(null)
    setSelectedMember(isOwner ? "" : (currentUserId || ""))
    setSelectedDay(0)
    setStartTime("09:00")
    setEndTime("17:00")
    setIsAvailable(true)
    setNotes("")
  }

  function openEditDialog(shift: Shift) {
    setEditingShift(shift)
    setSelectedMember(shift.profile_id)
    setSelectedDay(shift.day_of_week)
    setStartTime(shift.start_time)
    setEndTime(shift.end_time)
    setIsAvailable(shift.is_available)
    setNotes(shift.notes || "")
    setIsDialogOpen(true)
  }

  function openAddDialog() {
    resetForm()
    // If not owner, pre-select self
    if (!isOwner && currentUserId) {
      setSelectedMember(currentUserId)
    }
    // If owner and only one team member, pre-select them
    if (isOwner && teamMembers.length === 1) {
      setSelectedMember(teamMembers[0].id)
    }
    setIsDialogOpen(true)
  }

  function getMemberName(profileId: string) {
    const member = teamMembers.find(m => m.id === profileId)
    if (!member) return "Unknown"
    return `${member.first_name || ""} ${member.last_name || ""}`.trim() || "Unknown"
  }

  function getMemberInitials(profileId: string) {
    const member = teamMembers.find(m => m.id === profileId)
    if (!member) return "?"
    const first = member.first_name?.[0] || ""
    const last = member.last_name?.[0] || ""
    return (first + last).toUpperCase() || "?"
  }

  function getShiftsForDay(dayIndex: number) {
    return shifts.filter(s => {
      if (s.day_of_week !== dayIndex) return false
      
      // Owner sees all shifts
      if (isOwner) return true
      
      // Staff sees:
      // 1. All approved shifts (the final schedule)
      // 2. Their own pending shifts
      // 3. NOT rejected shifts (unless their own, to know it was rejected)
      if (s.status === 'approved') return true
      if (s.profile_id === currentUserId && s.status === 'pending') return true
      // Don't show rejected shifts to staff
      return false
    })
  }

  function formatTime(time: string) {
    return time.slice(0, 5)
  }

  function canEditShift(shift: Shift) {
    // Owner can edit any shift
    // Staff can only edit their own pending shifts
    if (isOwner) return true
    return shift.profile_id === currentUserId && shift.status === 'pending'
  }

  function canDeleteShift(shift: Shift) {
    // Owner can delete any shift
    // Staff can only delete their own pending shifts
    if (isOwner) return true
    return shift.profile_id === currentUserId && shift.status === 'pending'
  }

  // Get today's day index (0 = Sunday)
  const today = new Date().getDay()

  return (
    <Card className="glass-card border-border">
      <CardHeader className={`flex flex-row items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <CardTitle className={`text-lg flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Calendar className="w-5 h-5 text-primary" />
            {isOwner 
              ? (isHebrew ? "לוח משמרות שבועי" : "Weekly Schedule")
              : (isHebrew ? "לוח עבודה השבוע" : "This Week's Schedule")
            }
          </CardTitle>
          {pendingCount > 0 && isOwner && (
            <Badge className="bg-yellow-500 text-black">
              {pendingCount} {isHebrew ? "ממתינים" : "pending"}
            </Badge>
          )}
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={openAddDialog}>
              {isOwner ? (
                <>
                  <Plus className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
                  {isHebrew ? "הוסף משמרת" : "Add Shift"}
                </>
              ) : (
                <>
                  <Send className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
                  {isHebrew ? "שלח זמינות" : "Submit Availability"}
                </>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-strong">
            <DialogHeader>
              <DialogTitle className={isRTL ? 'text-right' : ''}>
                {editingShift 
                  ? (isHebrew ? "ערוך משמרת" : "Edit Shift")
                  : isOwner 
                    ? (isHebrew ? "הוסף משמרת" : "Add Shift")
                    : (isHebrew ? "שלח בקשת זמינות" : "Submit Availability Request")
                }
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {/* Team Member - only shown to owner */}
              {isOwner && (
                <div className="space-y-2">
                  <Label className={isRTL ? 'text-right block' : ''}>{isHebrew ? "חבר צוות" : "Team Member"}</Label>
                  <Select 
                    value={selectedMember} 
                    onValueChange={setSelectedMember} 
                    disabled={!!editingShift}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={isHebrew ? "בחר חבר צוות" : "Select team member"} />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          {getMemberName(member.id)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label className={isRTL ? 'text-right block' : ''}>{isHebrew ? "יום" : "Day"}</Label>
                <Select value={selectedDay.toString()} onValueChange={(v) => setSelectedDay(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.map((day, idx) => (
                      <SelectItem key={idx} value={idx.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className={isRTL ? 'text-right block' : ''}>{isHebrew ? "שעת התחלה" : "Start Time"}</Label>
                  <Select value={startTime} onValueChange={setStartTime}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map(time => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className={isRTL ? 'text-right block' : ''}>{isHebrew ? "שעת סיום" : "End Time"}</Label>
                  <Select value={endTime} onValueChange={setEndTime}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map(time => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Label>{isHebrew ? "זמין לעבודה" : "Available for work"}</Label>
                <Switch checked={isAvailable} onCheckedChange={setIsAvailable} />
              </div>

              <div className="space-y-2">
                <Label className={isRTL ? 'text-right block' : ''}>{isHebrew ? "הערות (אופציונלי)" : "Notes (optional)"}</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isHebrew ? "למשל: אחרי 14:00 בלבד..." : "e.g., After 2pm only..."}
                  className={`bg-secondary/50 ${isRTL ? 'text-right' : ''}`}
                  rows={2}
                />
              </div>

              {!isOwner && !editingShift && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-sm">
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                    <span className="text-yellow-500">
                      {isHebrew ? "הבקשה תישלח לאישור הבע��ים" : "Request will be sent to owner for approval"}
                    </span>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleSaveShift} 
                disabled={saving || (!isOwner && !selectedMember)}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {saving 
                  ? (isHebrew ? "שומר..." : "Saving...")
                  : isOwner
                    ? (isHebrew ? "שמור" : "Save")
                    : (isHebrew ? "שלח בקשה" : "Send Request")
                }
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">
              {isHebrew ? "אין חברי צוות עדיין" : "No team members yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Legend */}
            <div className={`flex flex-wrap items-center gap-4 text-xs text-muted-foreground ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
              <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>{isHebrew ? "זמין" : "Available"}</span>
              </div>
              <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span>{isHebrew ? "לא זמין" : "Unavailable"}</span>
              </div>
              {/* Only show pending legend to owner or staff who have pending shifts */}
              {(isOwner || shifts.some(s => s.profile_id === currentUserId && s.status === 'pending')) && (
                <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span>{isHebrew ? "ממתין לאישור" : "Pending approval"}</span>
                </div>
              )}
            </div>

            {/* Week view - horizontal scrollable on mobile */}
            <div className="overflow-x-auto pb-2">
              <div className="grid grid-cols-7 gap-2 min-w-[700px]">
                {DAYS.map((day, dayIndex) => {
                  const dayShifts = getShiftsForDay(dayIndex)
                  const isToday = dayIndex === today
                  
                  return (
                    <div 
                      key={dayIndex}
                      className={cn(
                        "rounded-lg p-3 min-h-[140px]",
                        isToday 
                          ? "bg-primary/10 border border-primary/30" 
                          : "bg-secondary/30"
                      )}
                    >
                      <div className={cn(
                        "text-sm font-medium mb-2 text-center",
                        isToday ? "text-primary" : "text-muted-foreground"
                      )}>
                        {day}
                        {isToday && (
                          <Badge variant="outline" className="ml-2 text-[10px] border-primary text-primary">
                            {isHebrew ? "היום" : "Today"}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        {dayShifts.length === 0 ? (
                          <p className="text-xs text-muted-foreground/50 text-center">
                            {isHebrew ? "אין משמרות" : "No shifts"}
                          </p>
                        ) : (
                          dayShifts.map(shift => (
                            <div 
                              key={shift.id}
                              className={cn(
                                "rounded-md p-2 text-xs",
                                shift.status === 'pending' && "bg-yellow-500/20 border border-yellow-500/30",
                                shift.status === 'approved' && shift.is_available && "bg-green-500/20 border border-green-500/30",
                                shift.status === 'approved' && !shift.is_available && "bg-red-500/20 border border-red-500/30",
                                shift.status === 'rejected' && "bg-secondary/50 border border-border opacity-50"
                              )}
                            >
                              <div className={`flex items-center gap-1 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <Avatar className="w-4 h-4">
                                  <AvatarFallback className="text-[8px] bg-primary/20">
                                    {getMemberInitials(shift.profile_id)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="truncate font-medium">
                                  {getMemberName(shift.profile_id).split(" ")[0]}
                                </span>
                              </div>
                              <div className={`flex items-center gap-1 text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <Clock className="w-3 h-3" />
                                {formatTime(shift.start_time)}-{formatTime(shift.end_time)}
                              </div>
                              
                              {/* Status badge for pending */}
                              {shift.status === 'pending' && (
                                <Badge variant="outline" className="mt-1 text-[9px] bg-yellow-500/20 text-yellow-500 border-yellow-500/50">
                                  <AlertCircle className="w-2 h-2 mr-0.5" />
                                  {isHebrew ? "ממתין" : "Pending"}
                                </Badge>
                              )}

                              {/* Status badge for rejected */}
                              {shift.status === 'rejected' && (
                                <Badge variant="outline" className="mt-1 text-[9px] bg-red-500/20 text-red-500 border-red-500/50">
                                  <XCircle className="w-2 h-2 mr-0.5" />
                                  {isHebrew ? "נדחה" : "Rejected"}
                                </Badge>
                              )}

                              {/* Approval buttons for owner on pending shifts */}
                              {isOwner && shift.status === 'pending' && (
                                <div className={`flex gap-1 mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-5 w-5 bg-green-500/20 hover:bg-green-500/30"
                                    onClick={() => handleApproveShift(shift.id)}
                                    title={isHebrew ? "אשר" : "Approve"}
                                  >
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-5 w-5 bg-red-500/20 hover:bg-red-500/30"
                                    onClick={() => handleRejectShift(shift.id)}
                                    title={isHebrew ? "דחה" : "Reject"}
                                  >
                                    <XCircle className="w-3 h-3 text-red-500" />
                                  </Button>
                                </div>
                              )}

                              {/* Edit/Delete for owner or own pending shifts */}
                              {(canEditShift(shift) || canDeleteShift(shift)) && shift.status !== 'rejected' && (
                                <div className={`flex gap-1 mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                  {canEditShift(shift) && (
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-5 w-5"
                                      onClick={() => openEditDialog(shift)}
                                    >
                                      <Edit2 className="w-3 h-3" />
                                    </Button>
                                  )}
                                  {canDeleteShift(shift) && (
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-5 w-5 text-destructive"
                                      onClick={() => handleDeleteShift(shift.id)}
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Help text */}
            <p className={`text-xs text-muted-foreground ${isRTL ? 'text-right' : ''}`}>
              {isOwner 
                ? (isHebrew 
                    ? "הוסף משמרות ידנית או אשר בקשות מהצוות" 
                    : "Add shifts manually or approve staff requests")
                : (isHebrew 
                    ? "שלח את הזמינות שלך לאישור הבעלים" 
                    : "Submit your availability for owner approval")
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
