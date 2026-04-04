"use client"

import { CreditCard, Check, Zap, Star, Users, Calendar, BarChart3, Bell, Scissors, Package, Globe, Crown, FileText, Building2, Wallet, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const plans = [
  {
    id: "solo",
    name: "Solo",
    price: 22,
    period: "/month",
    description: "Perfect for independent barbers",
    features: [
      { text: "Up to 100 appointments/month", icon: Calendar },
      { text: "Client management", icon: Users },
      { text: "Online booking page", icon: Globe },
      { text: "Email reminders", icon: Bell },
      { text: "Basic analytics", icon: BarChart3 },
      { text: "Email support", icon: Bell },
    ],
    highlight: false,
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    period: "/month",
    description: "For growing shops that need more power",
    features: [
      { text: "Unlimited appointments", icon: Calendar },
      { text: "Full client management", icon: Users },
      { text: "Chemistry records", icon: Scissors },
      { text: "Team management (up to 5)", icon: Users },
      { text: "Advanced analytics", icon: BarChart3 },
      { text: "WhatsApp reminders", icon: Bell },
      { text: "Inventory management", icon: Package },
      { text: "Payroll reports", icon: Wallet },
      { text: "Priority support", icon: Star },
    ],
    highlight: false,
    popular: true,
  },
  {
    id: "branch",
    name: "Branch",
    price: 49,
    period: "/month",
    description: "For shops with multiple locations",
    features: [
      { text: "Everything in Pro", icon: Check },
      { text: "Up to 3 locations", icon: Building2 },
      { text: "Unlimited team members", icon: Users },
      { text: "Branch payroll reports", icon: Wallet },
      { text: "Branch analytics", icon: BarChart3 },
      { text: "Priority phone support", icon: Bell },
    ],
    highlight: true,
    popular: false,
  },
]

interface Shop {
  id: string
  name: string
  subscription_plan: string | null
  subscription_status: string | null
  subscription_id: string | null
  subscription_end: string | null
}

export default function BillingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [shop, setShop] = useState<Shop | null>(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState<string | null>(null)
  const [invoicesOpen, setInvoicesOpen] = useState(false)
  const [paypalOpen, setPaypalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null)
  
  useEffect(() => {
    async function fetchShop() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      
      const { data: profile } = await supabase
        .from("profiles")
        .select("shop_id")
        .eq("id", user.id)
        .single()
      
      if (!profile?.shop_id) return
      
      const { data: shopData } = await supabase
        .from("shops")
        .select("id, name, subscription_plan, subscription_status, subscription_id, subscription_end")
        .eq("id", profile.shop_id)
        .single()
      
      setShop(shopData)
      setLoading(false)
    }
    
    fetchShop()
  }, [supabase])

  const currentPlan = plans.find(p => p.id === (shop?.subscription_plan || "solo")) || plans[0]
  const isActive = shop?.subscription_status === "active"
  const isTrial = !shop?.subscription_plan || shop?.subscription_status === "trial"
  
  const handleUpgrade = async (plan: typeof plans[0]) => {
    setSelectedPlan(plan)
    setPaypalOpen(true)
  }

  const handlePayPalCheckout = async () => {
    if (!selectedPlan || !shop) return
    
    setUpgrading(selectedPlan.id)
    
    try {
      const response = await fetch("/api/subscriptions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlan.id,
          shopId: shop.id,
        }),
      })
      
      const data = await response.json()
      
      if (data.approvalUrl) {
        // Redirect to PayPal
        window.location.href = data.approvalUrl
      } else {
        alert("Error creating subscription. Please try again.")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error creating subscription. Please try again.")
    } finally {
      setUpgrading(null)
      setPaypalOpen(false)
    }
  }
  
  // Mock invoices
  const invoices = [
    { id: "INV-001", date: "Mar 1, 2026", amount: isTrial ? "$0.00" : `$${currentPlan.price}`, status: isTrial ? "Trial" : "Paid", plan: currentPlan.name },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-muted-foreground">Manage your subscription and billing</p>
      </div>

      {/* Current plan */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">Current Plan</h2>
            <p className="text-sm text-muted-foreground">
              You are currently on the <span className="text-primary font-medium">{currentPlan.name}</span> plan
              {isTrial && " (14-day free trial)"}
            </p>
          </div>
        </div>
        
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-4xl font-bold text-primary">
            ${currentPlan.price}
          </span>
          <span className="text-muted-foreground">{currentPlan.period}</span>
          {isTrial && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
              Trial Active
            </span>
          )}
          {isActive && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
              Active
            </span>
          )}
        </div>

        {shop?.subscription_end && (
          <p className="text-sm text-muted-foreground mb-4">
            {isTrial ? "Trial ends" : "Next billing date"}: {new Date(shop.subscription_end).toLocaleDateString()}
          </p>
        )}

        <div className="flex gap-3">
          {isActive && shop?.subscription_id && (
            <Button variant="outline" className="border-border">
              Manage Subscription
            </Button>
          )}
          <Button variant="outline" className="border-border" onClick={() => setInvoicesOpen(true)}>
            <FileText className="w-4 h-4 mr-2" />
            View Invoices
          </Button>
        </div>
      </div>
      
      {/* Invoices Dialog */}
      <Dialog open={invoicesOpen} onOpenChange={setInvoicesOpen}>
        <DialogContent className="glass border-border">
          <DialogHeader>
            <DialogTitle>Invoices</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {invoices.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No invoices yet</p>
            ) : (
              invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">{invoice.id}</p>
                      <p className="text-sm text-muted-foreground">{invoice.date} - {invoice.plan}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{invoice.amount}</p>
                    <p className="text-xs text-muted-foreground">{invoice.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* PayPal Checkout Dialog */}
      <Dialog open={paypalOpen} onOpenChange={setPaypalOpen}>
        <DialogContent className="glass border-border">
          <DialogHeader>
            <DialogTitle>Upgrade to {selectedPlan?.name}</DialogTitle>
            <DialogDescription>
              You will be redirected to PayPal to complete your subscription.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="p-4 rounded-lg bg-secondary/30">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{selectedPlan?.name} Plan</span>
                <span className="text-primary font-bold">${selectedPlan?.price}/month</span>
              </div>
              <p className="text-sm text-muted-foreground">{selectedPlan?.description}</p>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button 
                onClick={handlePayPalCheckout}
                disabled={upgrading !== null}
                className="w-full bg-[#0070ba] hover:bg-[#005ea6] text-white"
              >
                {upgrading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.774.774 0 0 1 .763-.642h6.507c2.627 0 4.507.627 5.595 1.863.454.517.778 1.116.968 1.783.197.69.258 1.503.184 2.418-.016.201-.04.402-.073.605a8.063 8.063 0 0 1-.258 1.173 7.264 7.264 0 0 1-.542 1.268c-.19.358-.422.693-.694 1.002a4.895 4.895 0 0 1-.99.86c-.37.265-.795.487-1.27.663-.477.177-1.013.311-1.601.401-.588.09-1.236.135-1.936.135H8.19a.962.962 0 0 0-.95.81l-.163 1.038-.816 5.174a.79.79 0 0 1-.78.67h-.404z"/>
                  </svg>
                )}
                {upgrading ? "Redirecting..." : "Pay with PayPal"}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                By subscribing, you agree to our Terms of Service and will be billed monthly until you cancel.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Plans */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Available Plans</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = plan.id === (shop?.subscription_plan || "solo")
            
            return (
              <div
                key={plan.name}
                className={`glass rounded-xl p-6 relative ${
                  plan.popular ? "border-primary glow-amber-soft" : ""
                } ${plan.highlight ? "border-primary/50" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Most Popular
                  </div>
                )}
                
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-amber-400 text-primary-foreground text-xs font-medium flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Multi-Location
                  </div>
                )}

                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>

                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-center gap-2 text-sm">
                      <feature.icon className="w-4 h-4 shrink-0 text-primary/70" />
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    isCurrent
                      ? "bg-secondary text-foreground cursor-default"
                      : plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : plan.highlight
                      ? "bg-gradient-to-r from-primary to-amber-400 text-primary-foreground hover:opacity-90"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                  disabled={isCurrent || upgrading !== null}
                  onClick={() => !isCurrent && handleUpgrade(plan)}
                >
                  {upgrading === plan.id ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  {isCurrent ? "Current Plan" : plan.price < currentPlan.price ? "Downgrade" : "Upgrade"}
                </Button>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Payment Methods */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#0070ba]/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-[#0070ba]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.774.774 0 0 1 .763-.642h6.507c2.627 0 4.507.627 5.595 1.863.454.517.778 1.116.968 1.783.197.69.258 1.503.184 2.418-.016.201-.04.402-.073.605a8.063 8.063 0 0 1-.258 1.173 7.264 7.264 0 0 1-.542 1.268c-.19.358-.422.693-.694 1.002a4.895 4.895 0 0 1-.99.86c-.37.265-.795.487-1.27.663-.477.177-1.013.311-1.601.401-.588.09-1.236.135-1.936.135H8.19a.962.962 0 0 0-.95.81l-.163 1.038-.816 5.174a.79.79 0 0 1-.78.67h-.404z"/>
            </svg>
          </div>
          <div>
            <h2 className="font-semibold">Payment Method</h2>
            <p className="text-sm text-muted-foreground">We accept PayPal for all subscriptions</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30">
          <svg className="w-12 h-8" viewBox="0 0 101 32" fill="none">
            <path d="M12.237 6.4H4.503a.932.932 0 0 0-.92.786L.583 25.42a.56.56 0 0 0 .553.646h3.7a.932.932 0 0 0 .92-.786l.813-5.156a.932.932 0 0 1 .92-.786h2.121c4.418 0 6.968-2.138 7.634-6.376.3-1.855.012-3.312-.858-4.332-.955-1.121-2.648-1.73-4.148-1.73z" fill="#253B80"/>
            <path d="M12.237 6.4H4.503a.932.932 0 0 0-.92.786L.583 25.42a.56.56 0 0 0 .553.646h3.7a.932.932 0 0 0 .92-.786l.813-5.156a.932.932 0 0 1 .92-.786h2.121c4.418 0 6.968-2.138 7.634-6.376.3-1.855.012-3.312-.858-4.332-.955-1.121-2.648-1.73-4.148-1.73z" fill="#253B80"/>
            <path d="M13.088 12.628c-.316 2.074-1.902 2.074-3.436 2.074h-.873l.612-3.875a.56.56 0 0 1 .553-.472h.4c1.044 0 2.03 0 2.538.595.304.355.396.882.206 1.678z" fill="#253B80"/>
            <path d="M35.932 12.534h-3.716a.56.56 0 0 0-.553.472l-.15.95-.238-.345c-.737-1.07-2.38-1.428-4.02-1.428-3.762 0-6.976 2.85-7.603 6.847-.326 1.994.137 3.902 1.27 5.23.04.05.082.097.124.144a.932.932 0 0 1-.92.786H17.02a.56.56 0 0 0-.553.646l.97 6.148a.932.932 0 0 0 .92.786h3.256a.932.932 0 0 0 .92-.786l1.62-10.27h3.716a.56.56 0 0 0 .553-.646l-.97-6.148a.56.56 0 0 1 .553-.646h3.716a.56.56 0 0 0 .553-.472l.15-.95a.56.56 0 0 0-.552-.646z" fill="#179BD7"/>
            <path d="M45.26 6.4h-7.734a.932.932 0 0 0-.92.786l-3 19.034a.56.56 0 0 0 .553.646h3.946a.652.652 0 0 0 .644-.55l.852-5.392a.932.932 0 0 1 .92-.786h2.121c4.418 0 6.968-2.138 7.634-6.376.3-1.855.012-3.312-.858-4.332-.955-1.121-2.648-1.73-4.158-1.03z" fill="#179BD7"/>
            <path d="M46.11 12.628c-.316 2.074-1.902 2.074-3.436 2.074h-.873l.612-3.875a.56.56 0 0 1 .553-.472h.4c1.044 0 2.03 0 2.538.595.304.355.396.882.206 1.678z" fill="#179BD7"/>
          </svg>
          <div>
            <p className="font-medium">PayPal</p>
            <p className="text-sm text-muted-foreground">Secure payments via PayPal</p>
          </div>
        </div>
      </div>
    </div>
  )
}
