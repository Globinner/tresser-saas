"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  Calendar,
  Clock,
  DollarSign,
  Scissors,
  Star,
  Edit,
  MessageSquare
} from "lucide-react"
import { ClientChemistry } from "./client-chemistry"
import { ClientPhotos } from "./client-photos"

interface Client {
  id: string
  first_name: string
  last_name: string | null
  email: string | null
  phone: string | null
  notes: string | null
  created_at: string
}

interface Appointment {
  id: string
  date: string
  start_time: string
  status: string
  services: { name: string; price: number } | null
}

interface ClientDetailViewProps {
  client: Client
  shopId: string
}

export function ClientDetailView({ client, shopId }: ClientDetailViewProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [stats, setStats] = useState({
    totalVisits: 0,
    totalSpent: 0,
    lastVisit: null as string | null,
    favoriteService: null as string | null,
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchClientData()
  }, [client.id])

  async function fetchClientData() {
    setLoading(true)

    // Fetch appointments
    const { data: appointmentsData } = await supabase
      .from("appointments")
      .select(`
        id,
        date,
        start_time,
        status,
        services (name, price)
      `)
      .eq("client_id", client.id)
      .order("date", { ascending: false })
      .limit(10)

    if (appointmentsData) {
      setAppointments(appointmentsData)

      // Calculate stats
      const completed = appointmentsData.filter(a => a.status === "completed")
      const totalSpent = completed.reduce((sum, a) => sum + (a.services?.price || 0), 0)
      
      // Get service frequency
      const serviceCounts: Record<string, number> = {}
      completed.forEach(a => {
        if (a.services?.name) {
          serviceCounts[a.services.name] = (serviceCounts[a.services.name] || 0) + 1
        }
      })
      const favoriteService = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0]?.[0]

      setStats({
        totalVisits: completed.length,
        totalSpent,
        lastVisit: completed[0]?.date || null,
        favoriteService: favoriteService || null,
      })
    }

    setLoading(false)
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  function formatTime(timeStr: string) {
    const [hours, minutes] = timeStr.split(":")
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  const statusColors: Record<string, string> = {
    scheduled: "bg-blue-500/20 text-blue-400",
    confirmed: "bg-green-500/20 text-green-400",
    completed: "bg-primary/20 text-primary",
    cancelled: "bg-red-500/20 text-red-400",
    no_show: "bg-orange-500/20 text-orange-400",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/clients">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{client.first_name} {client.last_name || ""}</h1>
            <p className="text-muted-foreground">
              Client since {formatDate(client.created_at)}
            </p>
          </div>
        </div>
        <Button variant="outline" className="border-border/50">
          <Edit className="w-4 h-4 mr-2" />
          Edit Client
        </Button>
      </div>

      {/* Client Info & Stats */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Contact Info */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Contact Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {client.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{client.phone}</span>
              </div>
            )}
            {client.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{client.email}</span>
              </div>
            )}
            {client.notes && (
              <div className="pt-3 border-t border-border/30">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Notes</span>
                </div>
                <p className="text-sm text-foreground bg-secondary/30 rounded-lg p-3">
                  {client.notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="glass border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Client Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-secondary/30">
                <div className="text-3xl font-bold text-primary">{stats.totalVisits}</div>
                <div className="text-sm text-muted-foreground">Total Visits</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-secondary/30">
                <div className="text-3xl font-bold text-foreground">
                  ${stats.totalSpent.toFixed(0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Spent</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-secondary/30">
                <div className="text-lg font-semibold text-foreground">
                  {stats.lastVisit ? formatDate(stats.lastVisit) : "—"}
                </div>
                <div className="text-sm text-muted-foreground">Last Visit</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-secondary/30">
                <div className="text-lg font-semibold text-foreground truncate">
                  {stats.favoriteService || "—"}
                </div>
                <div className="text-sm text-muted-foreground">Favorite Service</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Before/After Photos */}
      <Card className="glass border-border/50">
        <CardContent className="pt-6">
          <ClientPhotos clientId={client.id} shopId={shopId} />
        </CardContent>
      </Card>

      {/* Chemistry Records */}
      <ClientChemistry 
        clientId={client.id} 
        clientName={`${client.first_name} ${client.last_name || ""}`.trim()}
        shopId={shopId}
      />

      {/* Recent Appointments */}
      <Card className="glass border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Appointment History
          </CardTitle>
          <Link href={`/dashboard/appointments?client=${client.id}`}>
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-8">
              <Scissors className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No appointments yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-border/30 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[60px]">
                      <div className="text-lg font-bold text-foreground">
                        {new Date(apt.date).getDate()}
                      </div>
                      <div className="text-xs text-muted-foreground uppercase">
                        {new Date(apt.date).toLocaleDateString("en-US", { month: "short" })}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        {apt.services?.name || "Service"}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        {formatTime(apt.start_time)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {apt.services?.price && (
                      <span className="flex items-center gap-1 text-foreground">
                        <DollarSign className="w-4 h-4 text-primary" />
                        {apt.services.price}
                      </span>
                    )}
                    <Badge className={`capitalize ${statusColors[apt.status] || ""}`}>
                      {apt.status.replace("_", " ")}
                    </Badge>
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
