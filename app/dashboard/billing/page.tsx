"use client"

import { CreditCard, Check, Zap, Star, Rocket, Users, Calendar, BarChart3, Bell, Scissors, Package, Globe, Crown, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const plans = [
  {
    name: "Free",
    price: 0,
    period: "3 months trial",
    description: "Try all features free for 3 months",
    features: [
      { text: "Up to 5 clients", icon: Users },
      { text: "Unlimited appointments", icon: Calendar },
      { text: "Full analytics dashboard", icon: BarChart3 },
      { text: "Online booking page", icon: Globe },
      { text: "Team management", icon: Users },
      { text: "Services & pricing", icon: Scissors },
      { text: "Client preferences tracking", icon: Star },
      { text: "WhatsApp/Email reminders", icon: Bell },
      { text: "Inventory management", icon: Package },
    ],
    current: true,
    highlight: false,
  },
  {
    name: "Flower",
    price: 18,
    period: "/month",
    description: "For growing barbershops",
    features: [
      { text: "Up to 50 clients", icon: Users },
      { text: "Unlimited appointments", icon: Calendar },
      { text: "Full analytics dashboard", icon: BarChart3 },
      { text: "Online booking page", icon: Globe },
      { text: "Team management", icon: Users },
      { text: "Services & pricing", icon: Scissors },
      { text: "Client preferences tracking", icon: Star },
      { text: "WhatsApp/Email reminders", icon: Bell },
      { text: "Inventory management", icon: Package },
      { text: "Priority email support", icon: Bell },
    ],
    current: false,
    popular: true,
  },
  {
    name: "Fronted",
    price: 26,
    period: "/month",
    description: "Maximum visibility & growth",
    features: [
      { text: "Unlimited clients", icon: Users },
      { text: "Unlimited appointments", icon: Calendar },
      { text: "Full analytics dashboard", icon: BarChart3 },
      { text: "Online booking page", icon: Globe },
      { text: "Team management", icon: Users },
      { text: "Services & pricing", icon: Scissors },
      { text: "Client preferences tracking", icon: Star },
      { text: "WhatsApp/Email reminders", icon: Bell },
      { text: "Inventory management", icon: Package },
      { text: "Priority support", icon: Bell },
      { text: "Featured on Tresser homepage", icon: Crown, highlight: true },
      { text: "Boost shop visibility", icon: Rocket, highlight: true },
      { text: "More customer exposure", icon: Star, highlight: true },
    ],
    current: false,
    highlight: true,
  },
]

export default function BillingPage() {
  const currentPlan = plans.find(p => p.current)
  const [invoicesOpen, setInvoicesOpen] = useState(false)
  
  // Mock invoices - will be real data later
  const invoices = [
    { id: "INV-001", date: "Mar 1, 2026", amount: "$0.00", status: "Free Trial", plan: "Free" },
  ]
  
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
              You are currently on the <span className="text-primary font-medium">{currentPlan?.name}</span> plan
            </p>
          </div>
        </div>
        
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-4xl font-bold text-primary">
            {currentPlan?.price === 0 ? "Free" : `$${currentPlan?.price}`}
          </span>
          <span className="text-muted-foreground">{currentPlan?.period}</span>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="border-border">
            Manage Subscription
          </Button>
          <Button variant="outline" className="border-border" onClick={() => setInvoicesOpen(true)}>
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

      {/* Plans */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Available Plans</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
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
              
              {plan.highlight && !plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-amber-400 text-primary-foreground text-xs font-medium flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  Best Value
                </div>
              )}

              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

              <div className="flex items-baseline gap-2 mb-6">
                {plan.price === 0 ? (
                  <>
                    <span className="text-3xl font-bold text-primary">Free</span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </>
                ) : (
                  <>
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </>
                )}
              </div>

              <ul className="space-y-2.5 mb-6">
                {plan.features.map((feature) => (
                  <li 
                    key={feature.text} 
                    className={`flex items-center gap-2 text-sm ${
                      feature.highlight ? "text-primary font-medium" : ""
                    }`}
                  >
                    <feature.icon className={`w-4 h-4 shrink-0 ${
                      feature.highlight ? "text-primary" : "text-primary/70"
                    }`} />
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.current
                    ? "bg-secondary text-foreground cursor-default"
                    : plan.highlight
                    ? "bg-gradient-to-r from-primary to-amber-400 text-primary-foreground hover:opacity-90"
                    : plan.popular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
                disabled={plan.current}
              >
                {plan.current ? "Current Plan" : plan.price === 0 ? "Start Free Trial" : "Upgrade"}
              </Button>
            </div>
          ))}
        </div>
        
        {/* Fronted explanation */}
        <div className="mt-8 glass rounded-xl p-6 border-primary/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-amber-400 flex items-center justify-center">
              <Crown className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">What is &quot;Fronted&quot; exposure?</h3>
              <p className="text-sm text-muted-foreground">Get more customers with premium visibility</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="p-4 rounded-lg bg-secondary/30">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-primary" />
                <span className="font-medium">Featured Shops</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your shop appears in the &quot;Featured&quot; section on Tresser homepage. Top 3 highlighted spots with premium card design.
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-secondary/30">
              <div className="flex items-center gap-2 mb-2">
                <Rocket className="w-5 h-5 text-primary" />
                <span className="font-medium">Boosted Visibility</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Appear higher in search results when customers look for barbershops. More impressions = more bookings.
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-secondary/30">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-medium">Customer Acquisition</span>
              </div>
              <p className="text-sm text-muted-foreground">
                We bring customers directly to your booking page. New clients discover your shop through our platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
