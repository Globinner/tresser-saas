"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Users, 
  Plus, 
  Clock, 
  User,
  Phone,
  Scissors,
  CheckCircle,
  XCircle,
  Play,
  ChevronUp,
  ChevronDown,
  Timer
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/language-context"

interface QueueEntry {
  id: string
  customer_name: string
  phone: string | null
  party_size: number
  service_id: string | null
  status: "waiting" | "in_service" | "completed" | "no_show"
  position: number
  estimated_wait_minutes: number | null
  check_in_time: string
  service_start_time: string | null
  service_end_time: string | null
  services?: { name: string; duration_minutes: number } | null
}

interface Service {
  id: string
  name: string
  duration_minutes: number
}

export function WalkInQueue({ shopId }: { shopId: string }) {
  const [queue, setQueue] = useState<QueueEntry[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [newEntry, setNewEntry] = useState({
    customer_name: "",
    phone: "",
    party_size: 1,
    service_id: ""
  })
  const { locale, isRTL } = useLanguage()
  const isHebrew = locale === 'he'

  useEffect(() => {
    loadQueue()
    loadServices()
    
    // Subscribe to real-time updates
    const supabase = createClient()
    const channel = supabase
      .channel("queue-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "walk_in_queue", filter: `shop_id=eq.${shopId}` },
        () => {
          loadQueue()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [shopId])

  async function loadQueue() {
    const supabase = createClient()
    const { data } = await supabase
      .from("walk_in_queue")
      .select("*, services(name, duration_minutes)")
      .eq("shop_id", shopId)
      .in("status", ["waiting", "in_service"])
      .order("position")

    setQueue(data || [])
    setLoading(false)
  }

  async function loadServices() {
    const supabase = createClient()
    const { data } = await supabase
      .from("services")
      .select("id, name, duration_minutes")
      .eq("shop_id", shopId)
      .eq("is_active", true)

    setServices(data || [])
  }

  async function addToQueue() {
    if (!newEntry.customer_name) return
    
    const supabase = createClient()
    
    // Get next position
    const waitingCount = queue.filter(q => q.status === "waiting").length
    const nextPosition = waitingCount + 1

    // Calculate estimated wait time
    const selectedService = services.find(s => s.id === newEntry.service_id)
    const avgServiceTime = selectedService?.duration_minutes || 30
    const estimatedWait = waitingCount * avgServiceTime

    await supabase.from("walk_in_queue").insert({
      shop_id: shopId,
      customer_name: newEntry.customer_name,
      phone: newEntry.phone || null,
      party_size: newEntry.party_size,
      service_id: newEntry.service_id || null,
      position: nextPosition,
      estimated_wait_minutes: estimatedWait
    })

    setNewEntry({ customer_name: "", phone: "", party_size: 1, service_id: "" })
    setIsOpen(false)
  }

  async function updateStatus(entryId: string, status: QueueEntry["status"]) {
    const supabase = createClient()
    const updates: Record<string, unknown> = { status }

    if (status === "in_service") {
      updates.service_start_time = new Date().toISOString()
    } else if (status === "completed" || status === "no_show") {
      updates.service_end_time = new Date().toISOString()
    }

    await supabase
      .from("walk_in_queue")
      .update(updates)
      .eq("id", entryId)

    // Recalculate positions for waiting entries
    if (status === "completed" || status === "no_show") {
      await recalculatePositions()
    }
  }

  async function recalculatePositions() {
    const supabase = createClient()
    const waitingEntries = queue
      .filter(q => q.status === "waiting")
      .sort((a, b) => a.position - b.position)

    for (let i = 0; i < waitingEntries.length; i++) {
      await supabase
        .from("walk_in_queue")
        .update({ position: i + 1 })
        .eq("id", waitingEntries[i].id)
    }
    
    loadQueue()
  }

  async function moveInQueue(entryId: string, direction: "up" | "down") {
    const entry = queue.find(q => q.id === entryId)
    if (!entry || entry.status !== "waiting") return

    const supabase = createClient()
    const waitingEntries = queue
      .filter(q => q.status === "waiting")
      .sort((a, b) => a.position - b.position)

    const currentIndex = waitingEntries.findIndex(q => q.id === entryId)
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1

    if (newIndex < 0 || newIndex >= waitingEntries.length) return

    // Swap positions
    const otherEntry = waitingEntries[newIndex]
    
    await supabase
      .from("walk_in_queue")
      .update({ position: otherEntry.position })
      .eq("id", entry.id)

    await supabase
      .from("walk_in_queue")
      .update({ position: entry.position })
      .eq("id", otherEntry.id)
  }

  function getWaitTime(checkInTime: string): string {
    const minutes = Math.floor((Date.now() - new Date(checkInTime).getTime()) / 60000)
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const waitingEntries = queue.filter(q => q.status === "waiting")
  const inServiceEntries = queue.filter(q => q.status === "in_service")

  if (loading) {
    return (
      <Card className="glass">
        <CardContent className="p-8 text-center">
          <div className="animate-pulse text-muted-foreground">{isHebrew ? "טוען תור..." : "Loading queue..."}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="glass">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{waitingEntries.length}</p>
              <p className="text-sm text-muted-foreground">{isHebrew ? "ממתינים" : "Waiting"}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <Scissors className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{inServiceEntries.length}</p>
              <p className="text-sm text-muted-foreground">{isHebrew ? "בשירות" : "In Service"}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Timer className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {waitingEntries.length > 0 
                  ? `~${Math.round(waitingEntries.reduce((sum, e) => sum + (e.estimated_wait_minutes || 30), 0) / waitingEntries.length)}${isHebrew ? "ד׳" : "m"}`
                  : isHebrew ? "0ד׳" : "0m"
                }
              </p>
              <p className="text-sm text-muted-foreground">{isHebrew ? "המתנה ממוצעת" : "Avg Wait"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add to Queue */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="w-full glow-amber" size="lg">
            <Plus className={cn("w-5 h-5", isRTL ? "ml-2" : "mr-2")} />
            {isHebrew ? "הוסף לקוח ללא תור" : "Add Walk-in Customer"}
          </Button>
        </DialogTrigger>
        <DialogContent className="glass-strong">
          <DialogHeader>
            <DialogTitle>{isHebrew ? "הוסף לתור" : "Add to Queue"}</DialogTitle>
            <DialogDescription>
              {isHebrew ? "הוסף לקוח ללא תור לרשימת ההמתנה" : "Add a walk-in customer to the waiting list"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>{isHebrew ? "שם הלקוח *" : "Customer Name *"}</Label>
              <Input
                value={newEntry.customer_name}
                onChange={(e) => setNewEntry({ ...newEntry, customer_name: e.target.value })}
                placeholder={isHebrew ? "הזן שם" : "Enter name"}
                className={cn("bg-secondary/50", isRTL && "text-right")}
              />
            </div>
            <div className="space-y-2">
              <Label>{isHebrew ? "טלפון (להתראות)" : "Phone (for notifications)"}</Label>
              <Input
                type="tel"
                value={newEntry.phone}
                onChange={(e) => setNewEntry({ ...newEntry, phone: e.target.value })}
                placeholder="(555) 123-4567"
                className="bg-secondary/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{isHebrew ? "גודל הקבוצה" : "Party Size"}</Label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={newEntry.party_size}
                  onChange={(e) => setNewEntry({ ...newEntry, party_size: parseInt(e.target.value) || 1 })}
                  className="bg-secondary/50"
                />
              </div>
              <div className="space-y-2">
                <Label>{isHebrew ? "שירות" : "Service"}</Label>
                <Select 
                  value={newEntry.service_id} 
                  onValueChange={(v) => setNewEntry({ ...newEntry, service_id: v })}
                >
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue placeholder={isHebrew ? "בחר..." : "Select..."} />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map(service => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name} ({service.duration_minutes}{isHebrew ? "ד׳" : "min"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {waitingEntries.length > 0 && (
              <div className="p-3 bg-secondary/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {isHebrew ? "זמן המתנה משוער: " : "Estimated wait time: "}<span className="text-foreground font-medium">
                    ~{waitingEntries.length * 30} {isHebrew ? "דקות" : "minutes"}
                  </span>
                </p>
              </div>
            )}

            <Button onClick={addToQueue} className="w-full" disabled={!newEntry.customer_name}>
              {isHebrew ? "הוסף לתור" : "Add to Queue"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* In Service */}
      {inServiceEntries.length > 0 && (
        <Card className="glass border-green-500/30">
          <CardHeader>
            <CardTitle className={`text-base flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Scissors className="w-5 h-5 text-green-400" />
              {isHebrew ? "כעת בשירות" : "Currently In Service"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {inServiceEntries.map(entry => (
              <div 
                key={entry.id}
                className={`flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/30 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-green-400" />
                  </div>
                  <div className={isRTL ? 'text-right' : ''}>
                    <p className="font-medium">{entry.customer_name}</p>
                    <div className={`flex items-center gap-2 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {entry.services?.name && <span>{entry.services.name}</span>}
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {isHebrew ? `התחיל לפני ${entry.service_start_time && getWaitTime(entry.service_start_time)}` : `Started ${entry.service_start_time && getWaitTime(entry.service_start_time)} ago`}
                      </span>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => updateStatus(entry.id, "completed")}
                  className="bg-green-500/20 hover:bg-green-500/30 text-green-400"
                >
                  <CheckCircle className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
                  {isHebrew ? "הושלם" : "Complete"}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Waiting Queue */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className={`text-base flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Users className="w-5 h-5 text-primary" />
            {isHebrew ? `ממתינים (${waitingEntries.length})` : `Waiting (${waitingEntries.length})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {waitingEntries.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">{isHebrew ? "אין לקוחות ממתינים" : "No customers waiting"}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {waitingEntries
                .sort((a, b) => a.position - b.position)
                .map((entry, index) => (
                  <div 
                    key={entry.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/30 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                        {entry.position}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{entry.customer_name}</p>
                          {entry.party_size > 1 && (
                            <Badge variant="outline" className="text-xs">
                              {entry.party_size} {isHebrew ? "אנשים" : "people"}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {entry.services?.name && <span>{entry.services.name}</span>}
                          {entry.services?.name && <span>•</span>}
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {isHebrew ? `ממתין ${getWaitTime(entry.check_in_time)}` : `Waiting ${getWaitTime(entry.check_in_time)}`}
                          </span>
                          {entry.phone && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {entry.phone}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Position controls */}
                      <div className="flex flex-col">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          disabled={index === 0}
                          onClick={() => moveInQueue(entry.id, "up")}
                        >
                          <ChevronUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          disabled={index === waitingEntries.length - 1}
                          onClick={() => moveInQueue(entry.id, "down")}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {/* Action buttons */}
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                        onClick={() => updateStatus(entry.id, "no_show")}
                      >
                        <XCircle className="w-5 h-5" />
                      </Button>
                      <Button 
                        onClick={() => updateStatus(entry.id, "in_service")}
                        className="bg-primary/20 hover:bg-primary/30 text-primary"
                      >
                        <Play className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
                        {isHebrew ? "התחל" : "Start"}
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
