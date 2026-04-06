import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Tresser",
  description: "Tresser Refund and Cancellation Policy - Understand our policies for subscriptions and service cancellations.",
}

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-2">Refund & Cancellation Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: April 6, 2026</p>
        
        <div className="prose prose-invert max-w-none space-y-8">
          
          <section>
            <h2 className="text-2xl font-semibold text-foreground">1. Overview</h2>
            <p className="text-foreground/80">
              This Refund and Cancellation Policy explains our policies regarding subscription fees, service cancellations, and refunds for the Tresser platform. Please read this policy carefully before subscribing to our services.
            </p>
            <p className="text-foreground/80 mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <strong>Important:</strong> Tresser is a software platform that connects Clients with Service Providers. For refunds related to services provided by Service Providers (haircuts, treatments, etc.), please contact the Service Provider directly. Tresser does not process refunds for third-party services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">2. Subscription Plans</h2>
            <h3 className="text-xl font-medium text-foreground mt-4">2.1 Free Trial</h3>
            <p className="text-foreground/80">
              We offer a 14-day free trial for new users. During the trial period:
            </p>
            <ul className="text-foreground/80 list-disc pl-6 space-y-2">
              <li>No payment information is required to start</li>
              <li>You can cancel at any time without charge</li>
              <li>Full access to plan features during the trial</li>
              <li>Trial automatically converts to paid subscription unless cancelled</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mt-4">2.2 Paid Subscriptions</h3>
            <p className="text-foreground/80">
              Our paid subscription plans (Solo, Pro, Branch) are billed on a monthly or yearly basis, as selected at the time of purchase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">3. Refund Policy for Subscriptions</h2>
            <h3 className="text-xl font-medium text-foreground mt-4">3.1 General Policy</h3>
            <p className="text-foreground/80">
              <strong>Subscription fees are generally non-refundable.</strong> When you subscribe, you agree to pay for the full subscription period (monthly or yearly).
            </p>

            <h3 className="text-xl font-medium text-foreground mt-4">3.2 Exceptions</h3>
            <p className="text-foreground/80">
              We may, at our sole discretion, provide refunds in the following circumstances:
            </p>
            <ul className="text-foreground/80 list-disc pl-6 space-y-2">
              <li><strong>Technical Issues:</strong> If the Service is completely unavailable for an extended period due to our fault</li>
              <li><strong>Duplicate Charges:</strong> If you were charged multiple times for the same subscription</li>
              <li><strong>Unauthorized Charges:</strong> If a charge was made without your authorization (subject to verification)</li>
              <li><strong>Within 48 Hours:</strong> If you cancel within 48 hours of initial purchase and have not significantly used the Service</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mt-4">3.3 Yearly Subscriptions</h3>
            <p className="text-foreground/80">
              For yearly subscriptions, no partial refunds are provided for unused months. If you choose to cancel, your subscription will remain active until the end of the billing period.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">4. Cancellation Policy</h2>
            <h3 className="text-xl font-medium text-foreground mt-4">4.1 How to Cancel</h3>
            <p className="text-foreground/80">
              You can cancel your subscription at any time through:
            </p>
            <ul className="text-foreground/80 list-disc pl-6 space-y-2">
              <li>Your account settings in the dashboard</li>
              <li>Contacting our support team at support@tresser.com</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mt-4">4.2 Effect of Cancellation</h3>
            <p className="text-foreground/80">
              When you cancel:
            </p>
            <ul className="text-foreground/80 list-disc pl-6 space-y-2">
              <li>Your subscription will remain active until the end of the current billing period</li>
              <li>You will not be charged for future billing periods</li>
              <li>You retain access to your data for 30 days after expiration</li>
              <li>After 30 days, your data may be permanently deleted</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mt-4">4.3 Downgrading Plans</h3>
            <p className="text-foreground/80">
              You can downgrade from a higher-tier plan to a lower-tier plan at any time. The change will take effect at the start of your next billing period. No refunds are provided for the difference in plan pricing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">5. Appointment Cancellations (For Clients)</h2>
            <p className="text-foreground/80">
              <strong>Tresser does not control appointment cancellation policies.</strong> Each Service Provider sets their own cancellation policy, which may include:
            </p>
            <ul className="text-foreground/80 list-disc pl-6 space-y-2">
              <li>Minimum notice required for cancellation (e.g., 24-48 hours)</li>
              <li>Cancellation fees (up to 100% of service value)</li>
              <li>No-show charges</li>
              <li>Rescheduling policies</li>
            </ul>
            <p className="text-foreground/80 mt-4">
              Please review the Service Provider&apos;s cancellation policy before booking. These policies are displayed during the booking process. For disputes about cancellation fees, please contact the Service Provider directly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">6. Service Provider Obligations</h2>
            <p className="text-foreground/80">
              If you are a Service Provider using Tresser:
            </p>
            <ul className="text-foreground/80 list-disc pl-6 space-y-2">
              <li>You must clearly display your cancellation and refund policies to clients</li>
              <li>You are responsible for processing refunds for your own services</li>
              <li>Cancellation policies must comply with applicable consumer protection laws</li>
              <li>You must honor the policies you have set</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">7. Chargebacks and Disputes</h2>
            <p className="text-foreground/80">
              Before initiating a chargeback with your bank or payment provider, please contact us first. We encourage you to resolve any billing disputes directly with us.
            </p>
            <p className="text-foreground/80 mt-4">
              Initiating a chargeback may result in:
            </p>
            <ul className="text-foreground/80 list-disc pl-6 space-y-2">
              <li>Immediate suspension of your account</li>
              <li>Loss of access to the Service</li>
              <li>Collection of any outstanding amounts owed</li>
              <li>Being barred from future use of the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">8. How to Request a Refund</h2>
            <p className="text-foreground/80">
              To request a refund (where eligible), please:
            </p>
            <ol className="text-foreground/80 list-decimal pl-6 space-y-2">
              <li>Email support@tresser.com with subject line &quot;Refund Request&quot;</li>
              <li>Include your account email and order/transaction ID</li>
              <li>Explain the reason for your refund request</li>
              <li>Provide any relevant documentation</li>
            </ol>
            <p className="text-foreground/80 mt-4">
              We will review your request within 5-7 business days and notify you of our decision. If approved, refunds are typically processed within 10 business days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">9. Changes to This Policy</h2>
            <p className="text-foreground/80">
              We reserve the right to modify this Refund and Cancellation Policy at any time. Changes will be effective when posted on this page with an updated &quot;Last updated&quot; date. Your continued use of the Service constitutes acceptance of the modified policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">10. Contact Us</h2>
            <p className="text-foreground/80">
              For questions about this policy or to request a refund, please contact us:
            </p>
            <p className="text-foreground/80 mt-2">
              Email: support@tresser.com<br />
              Subject: Refund Request / Cancellation Inquiry
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
