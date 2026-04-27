"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { DollarSign, Users, TrendingUp, Plus, CreditCard, Copy, Check } from "lucide-react"

interface ReferralCode {
  id: string
  code: string
  owner_name: string
  owner_email: string
  commission_percent: number
  total_earnings: number
  is_active: boolean
  created_at: string
  signups_count?: number
  paid_out?: number
}

interface Commission {
  id: string
  created_at: string
  payment_amount: number
  commission_amount: number
  payment_reference: string
  user_id: string
}

export default function ReferralsAdminPage() {
  const [referralCodes, setReferralCodes] = useState<ReferralCode[]>([])
  const [selectedCode, setSelectedCode] = useState<ReferralCode | null>(null)
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  
  // New code form
  const [newCode, setNewCode] = useState("")
  const [newOwnerName, setNewOwnerName] = useState("")
  const [newOwnerEmail, setNewOwnerEmail] = useState("")
  const [newCommissionPercent, setNewCommissionPercent] = useState(25)
  const [showNewCodeDialog, setShowNewCodeDialog] = useState(false)
  
  // Payout form
  const [payoutAmount, setPayoutAmount] = useState("")
  const [payoutMethod, setPayoutMethod] = useState("")
  const [payoutReference, setPayoutReference] = useState("")
  const [showPayoutDialog, setShowPayoutDialog] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    fetchReferralCodes()
  }, [])

  async function fetchReferralCodes() {
    setLoading(true)
    
    // Fetch codes with signup counts
    const { data: codes, error } = await supabase
      .from('referral_codes')
      .select('*')
      .order('total_earnings', { ascending: false })
    
    if (error) {
      console.error('Error fetching referral codes:', error)
      setLoading(false)
      return
    }

    // Fetch signup counts and payouts for each code
    const codesWithStats = await Promise.all((codes || []).map(async (code) => {
      const { count: signupsCount } = await supabase
        .from('referral_signups')
        .select('*', { count: 'exact', head: true })
        .eq('referral_code_id', code.id)
      
      const { data: payouts } = await supabase
        .from('referral_payouts')
        .select('amount')
        .eq('referral_code_id', code.id)
      
      const totalPaidOut = payouts?.reduce((sum, p) => sum + p.amount, 0) || 0
      
      return {
        ...code,
        signups_count: signupsCount || 0,
        paid_out: totalPaidOut
      }
    }))

    setReferralCodes(codesWithStats)
    setLoading(false)
  }

  async function createReferralCode() {
    const { error } = await supabase
      .from('referral_codes')
      .insert({
        code: newCode.toUpperCase(),
        owner_name: newOwnerName,
        owner_email: newOwnerEmail,
        commission_percent: newCommissionPercent,
      })
    
    if (error) {
      alert('Error creating code: ' + error.message)
      return
    }

    setShowNewCodeDialog(false)
    setNewCode("")
    setNewOwnerName("")
    setNewOwnerEmail("")
    setNewCommissionPercent(25)
    fetchReferralCodes()
  }

  async function recordPayout() {
    if (!selectedCode) return
    
    const { error } = await supabase
      .from('referral_payouts')
      .insert({
        referral_code_id: selectedCode.id,
        amount: parseFloat(payoutAmount),
        payment_method: payoutMethod,
        payment_reference: payoutReference,
      })
    
    if (error) {
      alert('Error recording payout: ' + error.message)
      return
    }

    setShowPayoutDialog(false)
    setPayoutAmount("")
    setPayoutMethod("")
    setPayoutReference("")
    setSelectedCode(null)
    fetchReferralCodes()
  }

  async function viewCommissions(code: ReferralCode) {
    setSelectedCode(code)
    
    const { data } = await supabase
      .from('referral_commissions')
      .select('*')
      .eq('referral_code_id', code.id)
      .order('created_at', { ascending: false })
    
    setCommissions(data || [])
  }

  async function toggleCodeStatus(code: ReferralCode) {
    await supabase
      .from('referral_codes')
      .update({ is_active: !code.is_active })
      .eq('id', code.id)
    
    fetchReferralCodes()
  }

  function copyReferralLink(code: string) {
    const link = `${window.location.origin}/auth/sign-up?ref=${code}`
    navigator.clipboard.writeText(link)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const totalEarnings = referralCodes.reduce((sum, c) => sum + c.total_earnings, 0)
  const totalPaidOut = referralCodes.reduce((sum, c) => sum + (c.paid_out || 0), 0)
  const totalOwed = totalEarnings - totalPaidOut
  const totalSignups = referralCodes.reduce((sum, c) => sum + (c.signups_count || 0), 0)

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Referral Management</h1>
            <p className="text-muted-foreground">Track reseller codes, commissions, and payouts</p>
          </div>
          
          <Dialog open={showNewCodeDialog} onOpenChange={setShowNewCodeDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Referral Code
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Referral Code</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Code (e.g., MIKE25)</Label>
                  <Input 
                    value={newCode} 
                    onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                    placeholder="MIKE25"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Owner Name</Label>
                  <Input 
                    value={newOwnerName} 
                    onChange={(e) => setNewOwnerName(e.target.value)}
                    placeholder="Mike Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Owner Email</Label>
                  <Input 
                    type="email"
                    value={newOwnerEmail} 
                    onChange={(e) => setNewOwnerEmail(e.target.value)}
                    placeholder="mike@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Commission Percent</Label>
                  <Input 
                    type="number"
                    value={newCommissionPercent} 
                    onChange={(e) => setNewCommissionPercent(parseInt(e.target.value))}
                    min={1}
                    max={100}
                  />
                </div>
                <Button onClick={createReferralCode} className="w-full">
                  Create Code
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Commissions</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">All time earnings</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Paid Out</CardTitle>
              <CreditCard className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">${totalPaidOut.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Already paid to resellers</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Owed</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${totalOwed.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Pending payouts</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Signups</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSignups}</div>
              <p className="text-xs text-muted-foreground">Via referral codes</p>
            </CardContent>
          </Card>
        </div>

        {/* Referral Codes Table */}
        <Card>
          <CardHeader>
            <CardTitle>Referral Codes</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Signups</TableHead>
                    <TableHead>Earned</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Owed</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referralCodes.map((code) => {
                    const owed = code.total_earnings - (code.paid_out || 0)
                    return (
                      <TableRow key={code.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold">{code.code}</span>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => copyReferralLink(code.code)}
                            >
                              {copiedCode === code.code ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{code.owner_name}</div>
                            <div className="text-sm text-muted-foreground">{code.owner_email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{code.commission_percent}%</TableCell>
                        <TableCell>{code.signups_count}</TableCell>
                        <TableCell>${code.total_earnings.toFixed(2)}</TableCell>
                        <TableCell className="text-green-500">${(code.paid_out || 0).toFixed(2)}</TableCell>
                        <TableCell className={owed > 0 ? "text-primary font-bold" : ""}>
                          ${owed.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={code.is_active ? "default" : "secondary"}
                            className="cursor-pointer"
                            onClick={() => toggleCodeStatus(code)}
                          >
                            {code.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => viewCommissions(code)}
                            >
                              View
                            </Button>
                            {owed > 0 && (
                              <Button 
                                size="sm"
                                onClick={() => {
                                  setSelectedCode(code)
                                  setPayoutAmount(owed.toFixed(2))
                                  setShowPayoutDialog(true)
                                }}
                              >
                                Pay
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Commission Details Dialog */}
        {selectedCode && !showPayoutDialog && (
          <Dialog open={!!selectedCode} onOpenChange={() => setSelectedCode(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Commission History - {selectedCode.code}</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <div className="mb-4 p-4 bg-muted rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">${selectedCode.total_earnings.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">Total Earned</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-500">${(selectedCode.paid_out || 0).toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">Paid Out</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        ${(selectedCode.total_earnings - (selectedCode.paid_out || 0)).toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">Owed</div>
                    </div>
                  </div>
                </div>
                
                {commissions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No commissions yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Payment Amount</TableHead>
                        <TableHead>Commission</TableHead>
                        <TableHead>Reference</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {commissions.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell>{new Date(c.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>${c.payment_amount.toFixed(2)}</TableCell>
                          <TableCell className="text-primary font-medium">
                            ${c.commission_amount.toFixed(2)}
                          </TableCell>
                          <TableCell className="font-mono text-xs">{c.payment_reference}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Payout Dialog */}
        <Dialog open={showPayoutDialog} onOpenChange={setShowPayoutDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Payout - {selectedCode?.code}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="p-4 bg-muted rounded-lg text-center">
                <div className="text-sm text-muted-foreground">Owed to {selectedCode?.owner_name}</div>
                <div className="text-2xl font-bold text-primary">
                  ${((selectedCode?.total_earnings || 0) - (selectedCode?.paid_out || 0)).toFixed(2)}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Payout Amount</Label>
                <Input 
                  type="number"
                  value={payoutAmount} 
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Input 
                  value={payoutMethod} 
                  onChange={(e) => setPayoutMethod(e.target.value)}
                  placeholder="PayPal, Bank Transfer, etc."
                />
              </div>
              <div className="space-y-2">
                <Label>Reference/Transaction ID</Label>
                <Input 
                  value={payoutReference} 
                  onChange={(e) => setPayoutReference(e.target.value)}
                  placeholder="Transaction ID or note"
                />
              </div>
              <Button onClick={recordPayout} className="w-full">
                Record Payout
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
