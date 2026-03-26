"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { 
  User, 
  Phone, 
  Mail, 
  Search,
  MoreVertical,
  Trash2,
  Edit,
  Calendar
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface Client {
  id: string
  first_name: string
  last_name: string | null
  email: string | null
  phone: string | null
  notes: string | null
  created_at: string
}

interface ClientsListProps {
  clients: Client[]
}

export function ClientsList({ clients }: ClientsListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [deleting, setDeleting] = useState<string | null>(null)
  const supabase = createClient()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    if (search) {
      params.set("search", search)
    } else {
      params.delete("search")
    }
    router.push(`/dashboard/clients?${params.toString()}`)
  }

  async function handleDelete(clientId: string) {
    if (!confirm("Are you sure you want to delete this client?")) return
    
    setDeleting(clientId)
    await supabase.from("clients").delete().eq("id", clientId)
    router.refresh()
    setDeleting(null)
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search clients by name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-input border-border"
          />
        </div>
        <Button type="submit" variant="outline" className="border-border">
          Search
        </Button>
      </form>

      {/* Clients grid */}
      {clients.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No clients found</h3>
          <p className="text-muted-foreground mb-6">
            {searchParams.get("search") 
              ? "Try a different search term"
              : "Add your first client to get started"
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => {
            const fullName = `${client.first_name} ${client.last_name || ""}`.trim()
            return (
            <div
              key={client.id}
              className={cn(
                "glass rounded-xl p-5 hover:border-primary/30 transition-all duration-300 group",
                deleting === client.id && "opacity-50"
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <Link href={`/dashboard/clients/${client.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                    {client.first_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold hover:text-primary transition-colors">{fullName}</h3>
                    <p className="text-xs text-muted-foreground">
                      Since {new Date(client.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-strong">
                    <DropdownMenuItem>
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Appointment
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => handleDelete(client.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                {client.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${client.phone}`} className="hover:text-foreground transition-colors">
                      {client.phone}
                    </a>
                  </div>
                )}
                {client.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${client.email}`} className="hover:text-foreground transition-colors truncate">
                      {client.email}
                    </a>
                  </div>
                )}
                {client.notes && (
                  <div className="text-sm mt-3 space-y-1">
                    {client.notes.split('\n').map((line, idx) => {
                      const colonIndex = line.indexOf(':')
                      if (colonIndex > 0) {
                        const label = line.substring(0, colonIndex + 1)
                        const value = line.substring(colonIndex + 1)
                        return (
                          <p key={idx} className="text-muted-foreground">
                            <span className="text-primary font-medium">{label}</span>
                            {value}
                          </p>
                        )
                      }
                      return <p key={idx} className="text-muted-foreground italic">{line}</p>
                    })}
                  </div>
                )}
              </div>
            </div>
          )})}
        </div>
      )}
    </div>
  )
}
