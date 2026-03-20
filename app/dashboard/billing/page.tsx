import { CreditCard, Check, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

const plans = [
  {
    name: "Starter",
    price: 29,
    description: "Perfect for solo barbers",
    features: [
      "Up to 100 appointments/month",
      "1 team member",
      "Basic analytics",
      "Email support",
    ],
    current: false,
  },
  {
    name: "Professional",
    price: 79,
    description: "For growing barbershops",
    features: [
      "Unlimited appointments",
      "Up to 5 team members",
      "Advanced analytics",
      "Priority support",
      "Custom branding",
      "SMS notifications",
    ],
    current: true,
    popular: true,
  },
  {
    name: "Enterprise",
    price: 199,
    description: "For multi-location shops",
    features: [
      "Everything in Professional",
      "Unlimited team members",
      "Multiple locations",
      "API access",
      "Dedicated account manager",
      "Custom integrations",
    ],
    current: false,
  },
]

export default function BillingPage() {
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
            <p className="text-sm text-muted-foreground">You are currently on the Professional plan</p>
          </div>
        </div>
        
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-4xl font-bold text-primary">$79</span>
          <span className="text-muted-foreground">/month</span>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="border-border">
            Manage Subscription
          </Button>
          <Button variant="outline" className="border-border">
            View Invoices
          </Button>
        </div>
      </div>

      {/* Plans */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Available Plans</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`glass rounded-xl p-6 relative ${
                plan.popular ? "border-primary glow-amber-soft" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Most Popular
                </div>
              )}

              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.current
                    ? "bg-secondary text-foreground cursor-default"
                    : plan.popular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
                disabled={plan.current}
              >
                {plan.current ? "Current Plan" : "Upgrade"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
