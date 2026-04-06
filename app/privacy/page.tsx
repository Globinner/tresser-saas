import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Tresser",
  description: "Tresser Privacy Policy - Learn how we collect, use, and protect your personal information.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: April 6, 2026</p>
        
        <div className="prose prose-invert max-w-none space-y-8">
          
          <section>
            <h2 className="text-2xl font-semibold text-foreground">1. Introduction</h2>
            <p className="text-foreground/80">
              Tresser (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform, website, and services (collectively, the &quot;Service&quot;).
            </p>
            <p className="text-foreground/80">
              Please read this Privacy Policy carefully. By accessing or using the Service, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium text-foreground mt-4">2.1 Information You Provide</h3>
            <ul className="text-foreground/80 list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, phone number, password, business name, business address</li>
              <li><strong>Profile Information:</strong> Photos, bio, professional qualifications, services offered</li>
              <li><strong>Payment Information:</strong> Credit card details, billing address, bank account information (processed by third-party payment processors)</li>
              <li><strong>Client Records:</strong> Names, contact information, appointment history, service preferences, notes, chemical/treatment records</li>
              <li><strong>Communications:</strong> Messages, support requests, feedback</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mt-4">2.2 Information Collected Automatically</h3>
            <ul className="text-foreground/80 list-disc pl-6 space-y-2">
              <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent, clicks, navigation patterns</li>
              <li><strong>Location Data:</strong> General location based on IP address; precise location if you grant permission</li>
              <li><strong>Cookies and Tracking:</strong> Cookies, web beacons, pixels, and similar technologies</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mt-4">2.3 Information from Third Parties</h3>
            <ul className="text-foreground/80 list-disc pl-6 space-y-2">
              <li>Social media platforms if you connect your account</li>
              <li>Payment processors for transaction data</li>
              <li>Analytics providers</li>
              <li>Marketing partners</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">3. How We Use Your Information</h2>
            <p className="text-foreground/80">We use collected information to:</p>
            <ul className="text-foreground/80 list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve the Service</li>
              <li>Process transactions and send related information</li>
              <li>Send appointment reminders and notifications</li>
              <li>Respond to your comments, questions, and support requests</li>
              <li>Send promotional communications (with your consent)</li>
              <li>Monitor and analyze usage trends and preferences</li>
              <li>Detect, investigate, and prevent fraudulent or unauthorized activities</li>
              <li>Comply with legal obligations</li>
              <li>Enforce our terms, conditions, and policies</li>
              <li>Personalize your experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">4. How We Share Your Information</h2>
            <p className="text-foreground/80">We may share your information in the following circumstances:</p>
            
            <h3 className="text-xl font-medium text-foreground mt-4">4.1 With Service Providers</h3>
            <p className="text-foreground/80">
              We share data with third-party vendors who perform services on our behalf, including payment processing, data analysis, email delivery, hosting, customer service, and marketing.
            </p>

            <h3 className="text-xl font-medium text-foreground mt-4">4.2 Between Users</h3>
            <p className="text-foreground/80">
              When Clients book appointments, their information is shared with Service Providers. Service Provider profiles and business information may be visible to Clients.
            </p>

            <h3 className="text-xl font-medium text-foreground mt-4">4.3 Legal Requirements</h3>
            <p className="text-foreground/80">
              We may disclose information if required by law, court order, or governmental authority, or when we believe disclosure is necessary to protect our rights, your safety, or the safety of others.
            </p>

            <h3 className="text-xl font-medium text-foreground mt-4">4.4 Business Transfers</h3>
            <p className="text-foreground/80">
              In connection with a merger, acquisition, bankruptcy, or sale of assets, your information may be transferred to another entity.
            </p>

            <h3 className="text-xl font-medium text-foreground mt-4">4.5 With Your Consent</h3>
            <p className="text-foreground/80">
              We may share your information with third parties when you explicitly consent to such sharing.
            </p>

            <p className="text-foreground/80 mt-4">
              <strong>We do not sell your personal information to third parties.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">5. Data Retention</h2>
            <p className="text-foreground/80">
              We retain your personal information for as long as your account is active or as needed to provide you with services. We may also retain information to comply with legal obligations, resolve disputes, enforce agreements, and as permitted by applicable law.
            </p>
            <p className="text-foreground/80 mt-4">
              Service Providers are responsible for their own data retention policies regarding client records stored on the Platform. We recommend Service Providers maintain records in accordance with applicable professional regulations and laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">6. Data Security</h2>
            <p className="text-foreground/80">
              We implement appropriate technical and organizational security measures to protect your personal information, including:
            </p>
            <ul className="text-foreground/80 list-disc pl-6 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure authentication mechanisms</li>
              <li>Regular security assessments</li>
              <li>Access controls and monitoring</li>
              <li>Secure payment processing through certified providers</li>
            </ul>
            <p className="text-foreground/80 mt-4">
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">7. Your Rights and Choices</h2>
            <p className="text-foreground/80">Depending on your location, you may have the following rights:</p>
            <ul className="text-foreground/80 list-disc pl-6 space-y-2">
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
              <li><strong>Opt-out:</strong> Opt out of marketing communications</li>
              <li><strong>Restriction:</strong> Request restriction of processing</li>
              <li><strong>Objection:</strong> Object to certain processing activities</li>
            </ul>
            <p className="text-foreground/80 mt-4">
              To exercise these rights, please contact us at privacy@tresser.com. We will respond within the timeframe required by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">8. Cookies and Tracking Technologies</h2>
            <p className="text-foreground/80">
              We use cookies and similar tracking technologies to collect and store information. You can control cookies through your browser settings. However, disabling cookies may limit your ability to use certain features of the Service.
            </p>
            <p className="text-foreground/80 mt-4">
              Types of cookies we use:
            </p>
            <ul className="text-foreground/80 list-disc pl-6 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for basic functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand usage patterns</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Marketing Cookies:</strong> Used for targeted advertising (with consent)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">9. International Data Transfers</h2>
            <p className="text-foreground/80">
              Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. When we transfer data internationally, we implement appropriate safeguards to protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">10. Children&apos;s Privacy</h2>
            <p className="text-foreground/80">
              The Service is not directed to children under 18 years of age. We do not knowingly collect personal information from children. If we learn we have collected personal information from a child, we will delete that information promptly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">11. California Privacy Rights (CCPA)</h2>
            <p className="text-foreground/80">
              If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
            </p>
            <ul className="text-foreground/80 list-disc pl-6 space-y-2">
              <li>Right to know what personal information is collected, used, shared, or sold</li>
              <li>Right to delete personal information</li>
              <li>Right to opt-out of the sale of personal information</li>
              <li>Right to non-discrimination for exercising CCPA rights</li>
            </ul>
            <p className="text-foreground/80 mt-4">
              We do not sell personal information as defined by the CCPA.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">12. European Privacy Rights (GDPR)</h2>
            <p className="text-foreground/80">
              If you are located in the European Economic Area (EEA), United Kingdom, or Switzerland, you have rights under the General Data Protection Regulation (GDPR):
            </p>
            <ul className="text-foreground/80 list-disc pl-6 space-y-2">
              <li>Right of access to your data</li>
              <li>Right to rectification</li>
              <li>Right to erasure (&quot;right to be forgotten&quot;)</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Rights related to automated decision-making</li>
            </ul>
            <p className="text-foreground/80 mt-4">
              Legal bases for processing include: contract performance, legitimate interests, consent, and legal compliance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">13. Changes to This Privacy Policy</h2>
            <p className="text-foreground/80">
              We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated Privacy Policy on this page and updating the &quot;Last updated&quot; date. Your continued use of the Service after changes constitutes acceptance of the modified Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">14. Contact Us</h2>
            <p className="text-foreground/80">
              If you have questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <p className="text-foreground/80 mt-2">
              Email: privacy@tresser.com<br />
              Data Protection Officer: dpo@tresser.com<br />
              Address: [Your Business Address]
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
