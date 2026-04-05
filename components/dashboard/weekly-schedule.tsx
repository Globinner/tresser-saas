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
import { Calendar, Clock, Plus, Edit2, Trash2, Users } from "lucide-react"
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
}

interface WeeklyScheduleProps {
  shopId: string
  teamMembers: TeamMember[]
  isOwner?: boolean
}

const DAYS_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const DAYS_HE = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"]

const TIME_SLOTS = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", 
  "20:00", "21:00", "22:00"
]

export function WeeklySchedule({ shopId, teamMembers, isOwner = false }: WeeklyScheduleProps) {
  const [shifts, setShifts] = useState<Shift[]>([])
  const [loading, setLoading] = useState(true)
  const [editingShift, setEditingShift] = useState<Shift | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<string>("")
  const [selectedDay, setSelectedDay] = useState<number>(0)
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("17:00")
  const [isAvailable, setIsAvailable] = useState(true)
  const [saving, setSaving] = useState(false)
  
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
      const { data, error } = await supabase
        .from("team_shifts")
        .select("*")
        .in("profile_id", memberIds)
        .order("day_of_week")
        .order("start_time")

      if (error) throw error
      setShifts(data || [])
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
      if (editingShift) {
        const { error } = await supabase
          .from("team_shifts")
          .update({
            day_of_week: selectedDay,
            start_time: startTime,
            end_time: endTime,
            is_available: isAvailable,
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
          })

        if (error) throw error
        toast.success(isHebrew ? "המשמרת נוספה" : "Shift added")
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
    setSelectedMember("")
    setSelectedDay(0)
    setStartTime("09:00")
    setEndTime("17:00")
    setIsAvailable(true)
  }

  function openEditDialog(shift: Shift) {
    setEditingShift(shift)
    setSelectedMember(shift.profile_id)
    setSelectedDay(shift.day_of_week)
    setStartTime(shift.start_time)
    setEndTime(shift.end_time)
    setIsAvailable(shift.is_available)
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
    return shifts.filter(s => s.day_of_week === dayIndex)
  }

  function formatTime(time: string) {
    return time.slice(0, 5)
  }

  // Get today's day index (0 = Sunday)
  const today = new Date().getDay()

  return (
    <Card className="glass-card border-border">
      <CardHeader className={`flex flex-row items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <CardTitle className={`text-lg flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Calendar className="w-5 h-5 text-primary" />
          {isHebrew ? "לוח משמרות שבועי" : "Weekly Schedule"}
        </CardTitle>
        {isOwner && (
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Plus className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
                {isHebrew ? "הוסף משמרת" : "Add Shift"}
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-strong">
              <DialogHeader>
                <DialogTitle>
                  {editingShift 
                    ? (isHebrew ? "ערוך משמרת" : "Edit Shift")
                    : (isHebrew ? "הוסף משמרת" : "Add Shift")
                  }
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>{isHebrew ? "חבר צוות" : "Team Member"}</Label>
                  <Select value={selectedMember} onValueChange={setSelectedMember} disabled={!!editingShift}>
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

                <div className="space-y-2">
                  <Label>{isHebrew ? "יום" : "Day"}</Label>
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
                    <Label>{isHebrew ? "שעת התחלה" : "Start Time"}</Label>
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
                    <Label>{isHebrew ? "שעת סיום" : "End Time"}</Label>
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

                <Button 
                  onClick={handleSaveShift} 
                  disabled={saving}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {saving 
                    ? (isHebrew ? "שומר..." : "Saving...")
                    : (isHebrew ? "שמור" : "Save")
                  }
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
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
                        "rounded-lg p-3 min-h-[120px]",
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
                                shift.is_available 
                                  ? "bg-green-500/20 border border-green-500/30"
                                  : "bg-red-500/20 border border-red-500/30"
                              )}
                            >
                              <div className="flex items-center gap-1 mb-1">
                                <Avatar className="w-4 h-4">
                                  <AvatarFallback className="text-[8px] bg-primary/20">
                                    {getMemberInitials(shift.profile_id)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="truncate font-medium">
                                  {getMemberName(shift.profile_id).split(" ")[0]}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {formatTime(shift.start_time)}-{formatTime(shift.end_time)}
                              </div>
                              {isOwner && (
                                <div className="flex gap-1 mt-1">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-5 w-5"
                                    onClick={() => openEditDialog(shift)}
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-5 w-5 text-destructive"
                                    onClick={() => handleDeleteShift(shift.id)}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
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

            {/* Summary */}
            <div className={`flex items-center gap-4 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                {isHebrew ? "זמין" : "Available"}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                {isHebrew ? "לא זמין" : "Unavailable"}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
