"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { 
  DollarSign, 
  Users, 
  Calendar,
  TrendingUp,
  Settings,
  Download,
  ChevronDown,
  Percent,
  Banknote
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/language-context"

interface TeamMember {
  id: string
  full_name: string | null
  avatar_url: string | null
  role: string
  commission_rate: number | null
  commission_type: string | null
  fixed_commission: number | null
  is_active: boolean
}

interface Appointment {
  id: string
  date: string
  barber_id: string | null
  total_price: number | null
  status: string
  services: {
    id: string
    name: string
    price: number
  } | null
}

interface Transaction {
  id: string
  amount: number
  barber_id: string | null
  created_at: string
}

interface PayrollDashboardProps {
  teamMembers: TeamMember[]
  appointments: Appointment[]
  transactions: Transaction[]
  shopId: string
  startDate: string
  endDate: string
}

export function PayrollDashboard({ 
  teamMembers, 
  appointments, 
  transactions,
  shopId,
  startDate,
  endDate 
}: PayrollDashboardProps) {
  const router = useRouter()
  const supabase = createClient()
  const { t, isRTL, locale } = useLanguage()
  const isHebrew = locale === 'he'
  const [selectedPeriod, setSelectedPeriod] = useState("current")
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [commissionType, setCommissionType] = useState<string>("percentage")
  const [commissionRate, setCommissionRate] = useState<string>("")
  const [fixedCommission, setFixedCommission] = useState<string>("")
  const [saving, setSaving] = useState(false)

  // Calculate payroll data for each team member
  const payrollData = teamMembers.map(member => {
    // Count appointments for this barber
    const memberAppointments = appointments.filter(a => a.barber_id === member.id)
    const clientsServed = memberAppointments.length
    
    // Calculate total revenue from appointments
    const totalRevenue = memberAppointments.reduce((sum, apt) => {
      return sum + (apt.total_price || apt.services?.price || 0)
    }, 0)

    // Calculate commission based on type
    let commission = 0
    if (member.commission_type === "percentage" && member.commission_rate) {
      commission = (totalRevenue * member.commission_rate) / 100
    } else if (member.commission_type === "fixed" && member.fixed_commission) {
      commission = member.fixed_commission * clientsServed
    } else if (member.commission_type === "mixed" && member.commission_rate && member.fixed_commission) {
      commission = ((totalRevenue * member.commission_rate) / 100) + (member.fixed_commission * clientsServed)
    }

    return {
      ...member,
      clientsServed,
      totalRevenue,
      commission: Math.round(commission * 100) / 100
    }
  })

  // Calculate totals
  const totalRevenue = payrollData.reduce((sum, m) => sum + m.totalRevenue, 0)
  const totalCommissions = payrollData.reduce((sum, m) => sum + m.commission, 0)
  const totalClients = payrollData.reduce((sum, m) => sum + m.clientsServed, 0)

  // Handle commission settings update
  async function handleSaveCommission() {
    if (!editingMember) return
    setSaving(true)

    const updates: Record<string, unknown> = {
      commission_type: commissionType,
      commission_rate: commissionType === "fixed" ? null : parseFloat(commissionRate) || null,
      fixed_commission: commissionType === "percentage" ? null : parseFloat(fixedCommission) || null,
    }

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", editingMember.id)

    if (!error) {
      router.refresh()
      setEditingMember(null)
    }
    setSaving(false)
  }

  // Open edit modal
  function openEditModal(member: TeamMember) {
    setEditingMember(member)
    setCommissionType(member.commission_type || "percentage")
    setCommissionRate(member.commission_rate?.toString() || "")
    setFixedCommission(member.fixed_commission?.toString() || "")
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IL', { style: 'currency', currency: 'ILS' }).format(amount)
  }

  // Format date range for display
  const formatDateRange = () => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    return `${start.toLocaleDateString('en-IL', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-IL', { month: 'short', day: 'numeric', year: 'numeric' })}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className={isRTL ? "text-right" : ""}>
          <h1 className="text-2xl font-bold">{isHebrew ? "שכר" : "Payroll"}</h1>
          <p className="text-muted-foreground">{isHebrew ? "עקוב אחר הכנסות ועמלות לצוות שלך" : "Track earnings and commissions for your team"}</p>
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDateRange()}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedPeriod("current")}>
                {isHebrew ? "החודש הנוכחי" : "Current Month"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedPeriod("previous")}>
                {isHebrew ? "החודש הקודם" : "Previous Month"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedPeriod("custom")}>
                {isHebrew ? "טווח מותאם" : "Custom Range"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <Download className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
            {isHebrew ? "ייצא" : "Export"}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-border">
          <CardContent className="p-6">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={isRTL ? 'text-right' : ''}>
                <p className="text-sm text-muted-foreground">{isHebrew ? "סה״כ הכנסות" : "Total Revenue"}</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border">
          <CardContent className="p-6">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={isRTL ? 'text-right' : ''}>
                <p className="text-sm text-muted-foreground">{isHebrew ? "סה״כ עמלות" : "Total Commissions"}</p>
                <p className="text-2xl font-bold">{formatCurrency(totalCommissions)}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <Banknote className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border">
          <CardContent className="p-6">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={isRTL ? 'text-right' : ''}>
                <p className="text-sm text-muted-foreground">{isHebrew ? "לקוחות שרותו" : "Clients Served"}</p>
                <p className="text-2xl font-bold">{totalClients}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border">
          <CardContent className="p-6">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={isRTL ? 'text-right' : ''}>
                <p className="text-sm text-muted-foreground">{isHebrew ? "רווח העסק" : "Shop Profit"}</p>
                <p className="text-2xl font-bold text-green-500">{formatCurrency(totalRevenue - totalCommissions)}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Payroll Table */}
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle>{isHebrew ? "הכנסות הצוות" : "Team Earnings"}</CardTitle>
          <CardDescription>{isHebrew ? `פירוט לפי חבר צוות עבור ${formatDateRange()}` : `Breakdown by team member for ${formatDateRange()}`}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={isRTL ? 'text-right' : ''}>{isHebrew ? "חבר צוות" : "Team Member"}</TableHead>
                <TableHead className="text-center">{isHebrew ? "לקוחות" : "Clients"}</TableHead>
                <TableHead className={isRTL ? 'text-left' : 'text-right'}>{isHebrew ? "הכנסות" : "Revenue"}</TableHead>
                <TableHead className="text-center">{isHebrew ? "אחוז עמלה" : "Commission Rate"}</TableHead>
                <TableHead className={isRTL ? 'text-left' : 'text-right'}>{isHebrew ? "רווחים" : "Earnings"}</TableHead>
                <TableHead className={isRTL ? 'text-left' : 'text-right'}>{isHebrew ? "פעולות" : "Actions"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollData.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {member.avatar_url ? (
                        <img 
                          src={member.avatar_url} 
                          alt={member.full_name || ""} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                          {member.full_name?.charAt(0) || "?"}
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{member.full_name || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium">{member.clientsServed}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-medium">{formatCurrency(member.totalRevenue)}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    {member.commission_type === "percentage" && member.commission_rate && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-sm">
                        <Percent className="w-3 h-3" />
                        {member.commission_rate}%
                      </span>
                    )}
                    {member.commission_type === "fixed" && member.fixed_commission && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-sm">
                        <Banknote className="w-3 h-3" />
                        {formatCurrency(member.fixed_commission)}/client
                      </span>
                    )}
                    {member.commission_type === "mixed" && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/10 text-blue-500 text-sm">
                        {member.commission_rate}% + {formatCurrency(member.fixed_commission || 0)}
                      </span>
                    )}
                    {!member.commission_type && (
                      <span className="text-muted-foreground text-sm">Not set</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-bold text-green-500">{formatCurrency(member.commission)}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(member)}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {payrollData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {isHebrew ? "לא נמצאו חברי צוות. הוסף ספרים לצוות שלך קודם." : "No team members found. Add barbers to your team first."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Totals Row */}
      <Card className="glass-card border-border bg-secondary/30">
        <CardContent className="p-4">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="font-semibold">{isHebrew ? "סיכום תקופה" : "Period Totals"}</span>
            <div className={`flex items-center gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">{isHebrew ? "לקוחות" : "Clients"}</p>
                <p className="font-bold">{totalClients}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">{isHebrew ? "הכנסות" : "Revenue"}</p>
                <p className="font-bold">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">{isHebrew ? "עמלות" : "Commissions"}</p>
                <p className="font-bold text-green-500">{formatCurrency(totalCommissions)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">{isHebrew ? "רווח העסק" : "Shop Profit"}</p>
                <p className="font-bold text-primary">{formatCurrency(totalRevenue - totalCommissions)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Commission Settings Modal */}
      <Dialog open={!!editingMember} onOpenChange={() => setEditingMember(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Commission Settings</DialogTitle>
            <DialogDescription>
              Set commission rate for {editingMember?.full_name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Commission Type</Label>
              <Select value={commissionType} onValueChange={setCommissionType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage of Revenue</SelectItem>
                  <SelectItem value="fixed">Fixed Amount per Client</SelectItem>
                  <SelectItem value="mixed">Mixed (Percentage + Fixed)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(commissionType === "percentage" || commissionType === "mixed") && (
              <div className="space-y-2">
                <Label>Commission Rate (%)</Label>
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                    placeholder="e.g., 40"
                    className="pr-8"
                  />
                  <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Barber receives this percentage of each service revenue
                </p>
              </div>
            )}

            {(commissionType === "fixed" || commissionType === "mixed") && (
              <div className="space-y-2">
                <Label>Fixed Amount per Client (₪)</Label>
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={fixedCommission}
                    onChange={(e) => setFixedCommission(e.target.value)}
                    placeholder="e.g., 20"
                    className="pl-8"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₪</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Barber receives this fixed amount per client served
                </p>
              </div>
            )}

            {/* Preview calculation */}
            <div className="p-3 rounded-lg bg-secondary/50 border border-border">
              <p className="text-sm font-medium mb-2">Example Calculation</p>
              <p className="text-xs text-muted-foreground">
                For a ₪100 service:
              </p>
              <p className="text-sm font-bold text-primary">
                {commissionType === "percentage" && commissionRate && (
                  <>Barber earns: ₪{(100 * parseFloat(commissionRate) / 100).toFixed(2)}</>
                )}
                {commissionType === "fixed" && fixedCommission && (
                  <>Barber earns: ₪{parseFloat(fixedCommission).toFixed(2)}</>
                )}
                {commissionType === "mixed" && (
                  <>Barber earns: ₪{((100 * (parseFloat(commissionRate) || 0) / 100) + (parseFloat(fixedCommission) || 0)).toFixed(2)}</>
                )}
                {!commissionRate && !fixedCommission && "Enter values above"}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingMember(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCommission} disabled={saving}>
              {saving ? "Saving..." : "Save Settings"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
