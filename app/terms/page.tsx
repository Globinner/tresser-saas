import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | Tresser",
  description: "Tresser Terms of Service - Please read these terms carefully before using our services.",
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: April 6, 2026</p>
        
        <div className="prose prose-invert max-w-none space-y-8">
          
          <section>
            <h2 className="text-2xl font-semibold text-foreground">1. Introduction and Acceptance</h2>
            <p className="text-foreground/80">
              Welcome to Tresser. These Terms of Service (&quot;Terms&quot;, &quot;Agreement&quot;) govern your access to and use of the Tresser platform, including our website, mobile applications, and all related services (collectively, the &quot;Service&quot; or &quot;Platform&quot;).
            </p>
            <p className="text-foreground/80">
              By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Service. These Terms constitute a legally binding agreement between you and Tresser.
            </p>
            <p className="text-foreground/80">
              <strong>IMPORTANT:</strong> These Terms contain an arbitration agreement and class action waiver that affect your legal rights. Please read them carefully.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">2. Definitions</h2>
            <ul className="text-foreground/80 list-disc pl-6 space-y-2">
              <li><strong>&quot;Tresser&quot;</strong>, <strong>&quot;we&quot;</strong>, <strong>&quot;us&quot;</strong>, or <strong>&quot;our&quot;</strong> refers to Tresser and its subsidiaries, affiliates, officers, employees, agents, partners, and licensors.</li>
              <li><strong>&quot;User&quot;</strong>, <strong>&quot;you&quot;</strong>, or <strong>&quot;your&quot;</strong> refers to any individual or entity that accesses or uses the Service.</li>
              <li><strong>&quot;Service Provider&quot;</strong> or <strong>&quot;Professional&quot;</strong> refers to barbers, hairdressers, nail technicians, beauty professionals, and other service providers who use Tresser to manage their business.</li>
              <li><strong>&quot;Client&quot;</strong> or <strong>&quot;Customer&quot;</strong> refers to individuals who book appointments or purchase services through the Platform.</li>
              <li><strong>&quot;Booking&quot;</strong> or <strong>&quot;Appointment&quot;</strong> refers to any reservation made through the Platform for services.</li>
              <li><strong>&quot;Content&quot;</strong> refers to text, images, photos, audio, video, and all other forms of data or communication.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">3. Service Description</h2>
            <p className="text-foreground/80">
              Tresser provides a software platform that enables Service Providers to manage their business operations, including but not limited to:
            </p>
            <ul className="text-foreground/80 list-disc pl-6 space-y-2">
              <li>Appointment scheduling and calendar management</li>
              <li>Client relationship management</li>
              <li>Team and staff management</li>
              <li>Inventory tracking</li>
              <li>Business analytics and reporting</li>
              <li>Online booking pages</li>
              <li>Communication tools (SMS, WhatsApp reminders)</li>
            </ul>
            <p className="text-foreground/80 mt-4">
              <strong>TRESSER IS A TECHNOLOGY PLATFORM ONLY.</strong> We do not provide, perform, or control any of the services offered by Service Providers. Service Providers are independent contractors and are not employees, agents, or representatives of Tresser. Any contract for services is solely between the Client and the Service Provider.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">4. Account Registration</h2>
            <p className="text-foreground/80">
              To use certain features of the Service, you must register for an account. When registering, you agree to:
            </p>
            <ul className="text-foreground/80 list-disc pl-6 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security and confidentiality of your login credentials</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
            <p className="text-foreground/80 mt-4">
              You must be at least 18 years old (or the age of majority in your jurisdiction) to create an account. By creating an account, you represent and warrant that you meet this requirement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">5. Service Provider Terms</h2>
            <p className="text-foreground/80">
              If you are a Service Provider using Tresser to manage your business, you additionally agree to:
            </p>
            <ul className="text-foreground/80 list-disc pl-6 space-y-2">
              <li>Maintain all required licenses, permits, certifications, and insurance for your profession</li>
              <li>Provide services that meet or exceed industry standards</li>
              <li>Accurately represent your services, pricing, and availability</li>
              <li>Honor all confirmed bookings unless cancelled in accordance with your stated policy</li>
              <li>Handle all client complaints and disputes professionally</li>
              <li>Comply with all applicable laws, regulations, and health codes</li>
              <li>Obtain necessary consents for storing and using client information</li>
              <li>Be solely responsible for tax obligations arising from your services</li>
            </ul>
            <p className="text-foreground/80 mt-4">
              <strong>Service Providers are solely responsible</strong> for the quality, safety, and legality of the services they provide. Tresser assumes no liability for the actions or omissions of Service Providers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">6. Bookings, Cancellations, and No-Shows</h2>
            <h3 className="text-xl font-medium text-foreground mt-4">6.1 Booking Confirmation</h3>
            <p className="text-foreground/80">
              When a Client makes a booking through the Platform, Tresser sends confirmation to both parties. This confirmation creates a contract between the Client and Service Provider only. Tresser is not a party to this contract.
            </p>
            
            <h3 className="text-xl font-medium text-foreground mt-4">6.2 Cancellation Policies</h3>
            <p className="text-foreground/80">
              Service Providers may set their own cancellation policies. Clients agree to review and accept these policies before confirming bookings. Cancellation fees, if any, are determined solely by the Service Provider.
            </p>
            
            <h3 className="text-xl font-medium text-foreground mt-4">6.3 No-Show Policy</h3>
            <p className="text-foreground/80">
              Failure to appear for a confirmed appointment without prior cancellation may result in charges as determined by the Service Provider&apos;s policy. Repeated no-shows may result in account restrictions or termination.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">7. Fees and Payment</h2>
            <h3 className="text-xl font-medium text-foreground mt-4">7.1 Subscription Fees</h3>
            <p className="text-foreground/80">
              Service Providers may be required to pay subscription fees for access to certain features. Current pricing is available on our website. We reserve the right to change pricing with 30 days&apos; notice.
            </p>
            
            <h3 className="text-xl font-medium text-foreground mt-4">7.2 Payment Processing</h3>
            <p className="text-foreground/80">
              Payment processing services may be provided by third-party payment processors. By using payment features, you agree to their terms and conditions. Tresser is not responsible for errors or failures of third-party payment processors.
            </p>
            
            <h3 className="text-xl font-medium text-foreground mt-4">7.3 Refunds</h3>
            <p className="text-foreground/80">
              Subscription fees are generally non-refundable. Refunds for services rendered by Service Providers are handled directly between the Client and Service Provider. Tresser does not guarantee or process refunds for third-party services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">8. Intellectual Property</h2>
            <p className="text-foreground/80">
              The Service and its original content, features, and functionality are owned by Tresser and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p className="text-foreground/80">
              You retain ownership of any content you submit to the Platform. By submitting content, you grant Tresser a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display such content in connection with providing the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">9. Prohibited Conduct</h2>
            <p className="text-foreground/80">You agree not to:</p>
            <ul className="text-foreground/80 list-disc pl-6 space-y-2">
              <li>Use the Service for any unlawful purpose or in violation of these Terms</li>
              <li>Impersonate any person or entity or misrepresent your affiliation</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Attempt to gain unauthorized access to any portion of the Service</li>
              <li>Use automated systems (bots, scrapers) to access the Service</li>
              <li>Transmit viruses, malware, or other harmful code</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Post false, misleading, or fraudulent content</li>
              <li>Violate the privacy or intellectual property rights of others</li>
              <li>Use the Service to send spam or unsolicited communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">10. Disclaimer of Warranties</h2>
            <p className="text-foreground/80 uppercase">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
            </p>
            <p className="text-foreground/80 mt-4">
              WE DO NOT WARRANT THAT: (A) THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE; (B) THE RESULTS OBTAINED FROM THE SERVICE WILL BE ACCURATE OR RELIABLE; (C) ANY ERRORS WILL BE CORRECTED; OR (D) THE SERVICE WILL MEET YOUR REQUIREMENTS.
            </p>
            <p className="text-foreground/80 mt-4">
              WE MAKE NO WARRANTIES REGARDING THE QUALITY, SAFETY, LEGALITY, OR SUITABILITY OF ANY SERVICES PROVIDED BY SERVICE PROVIDERS THROUGH THE PLATFORM.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">11. Limitation of Liability</h2>
            <p className="text-foreground/80 uppercase">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL TRESSER, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, PARTNERS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR IN CONNECTION WITH:
            </p>
            <ul className="text-foreground/80 list-disc pl-6 space-y-2 mt-4">
              <li>YOUR ACCESS TO OR USE OF (OR INABILITY TO ACCESS OR USE) THE SERVICE</li>
              <li>ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE</li>
              <li>ANY SERVICES PROVIDED BY SERVICE PROVIDERS</li>
              <li>UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR DATA</li>
              <li>ANY OTHER MATTER RELATING TO THE SERVICE</li>
            </ul>
            <p className="text-foreground/80 mt-4 uppercase">
              OUR TOTAL LIABILITY SHALL NOT EXCEED THE GREATER OF: (A) THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS PRIOR TO THE CLAIM; OR (B) ONE HUNDRED US DOLLARS ($100).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">12. Indemnification</h2>
            <p className="text-foreground/80">
              You agree to indemnify, defend, and hold harmless Tresser and its officers, directors, employees, agents, and affiliates from and against any and all claims, damages, obligations, losses, liabilities, costs, and expenses (including attorneys&apos; fees) arising from:
            </p>
            <ul className="text-foreground/80 list-disc pl-6 space-y-2">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another party</li>
              <li>Any content you submit to the Service</li>
              <li>Services you provide as a Service Provider</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">13. Arbitration and Dispute Resolution</h2>
            <p className="text-foreground/80">
              <strong>PLEASE READ THIS SECTION CAREFULLY. IT AFFECTS YOUR LEGAL RIGHTS.</strong>
            </p>
            <p className="text-foreground/80 mt-4">
              Any dispute, controversy, or claim arising out of or relating to these Terms or the Service shall be resolved by binding arbitration, rather than in court, except that you may assert claims in small claims court if your claims qualify.
            </p>
            <p className="text-foreground/80 mt-4">
              <strong>CLASS ACTION WAIVER:</strong> YOU AND TRESSER AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">14. Termination</h2>
            <p className="text-foreground/80">
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the Service will immediately cease.
            </p>
            <p className="text-foreground/80 mt-4">
              You may terminate your account at any time by contacting us. Termination does not relieve you of any obligations incurred prior to termination.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">15. Modifications to Terms</h2>
            <p className="text-foreground/80">
              We reserve the right to modify these Terms at any time. We will provide notice of material changes by posting the updated Terms on this page and updating the &quot;Last updated&quot; date. Your continued use of the Service after changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">16. Governing Law</h2>
            <p className="text-foreground/80">
              These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">17. Severability</h2>
            <p className="text-foreground/80">
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">18. Contact Information</h2>
            <p className="text-foreground/80">
              For questions about these Terms, please contact us at:
            </p>
            <p className="text-foreground/80 mt-2">
              Email: legal@tresser.com<br />
              Address: [Your Business Address]
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
