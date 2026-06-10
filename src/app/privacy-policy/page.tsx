import type { Metadata } from 'next'
import NavWrapper from '@/components/NavWrapper'
import Footer from '@/components/Footer'
import MoxieChat from '@/components/MoxieChat'

export const metadata: Metadata = {
  title: 'Privacy Policy | Ubuntu Kreative Village',
  description: 'Privacy policy and data handling practices at Ubuntu Kreative Village eco lodge. Learn how we protect your personal information.',
  robots: 'noindex, follow',
  alternates: {
    canonical: 'https://ubuntuecolodge.com/privacy-policy',
  },
}

const SECTIONS = [
  {
    title: '1. Who We Are',
    content: `Ubuntu Kreative Village ("we", "us", "our") is an eco lodge and living farm retreat located in Kenya. We operate the website ubuntuecolodge.com and the Moxie AI concierge system. Our contact email is hello@ubuntuecolodge.com.`,
  },
  {
    title: '2. What Data We Collect',
    content: `We collect the following personal data when you make an enquiry, reserving, or interact with Moxie:

- Full name and contact details (email, phone number)
- Reservation information (dates, accommodation preference, number of guests)
- Dietary requirements and allergy information
- Payment references (Stripe transaction IDs and M-Pesa references — we never store card numbers)
- AI conversation logs with Moxie (stored in our Audit Log for service improvement)
- Cookie consent status and date
- Technical data (browser type, IP address via Cloudflare)`,
  },
  {
    title: '3. How We Use Your Data',
    content: `We use your personal data only for the following purposes:

- To respond to your Reservation enquiry within 24 hours
- To manage your reservation, spa Reservations, and dining arrangements
- To personalise your Moxie AI concierge experience during your stay
- To send transactional emails (Reservation confirmations, spa reminders, pre-arrival information)
- To send a post-stay review request (one email, 24 hours after checkout)
- To comply with Kenya Revenue Authority financial record-keeping requirements`,
  },
  {
    title: '4. Legal Basis for Processing',
    content: `We process your personal data under the Kenya Data Protection Act 2019 on the following bases:

- Contractual necessity — to fulfil your Reservation
- Legitimate interests — to improve our services and personalise your stay
- Legal obligation — to maintain financial records for tax compliance
- Consent — for marketing communications (you may withdraw at any time)`,
  },
  {
    title: '5. Data Retention',
    content: `We retain your personal data as follows:

- Guest Reservation records: 3 years after your last stay, then anonymised
- Financial records (payment references): 7 years, as required by KRA
- AI conversation logs (Moxie): 12 months, then permanently deleted
- Email correspondence: 2 years
- Cookie consent records: 3 years

After retention periods expire, your personal identifiable information (name, email, phone) is anonymised — the statistical record is kept but cannot be linked back to you.`,
  },
  {
    title: '6. Your Rights Under the Kenya Data Protection Act 2019',
    content: `You have the following rights regarding your personal data:

- Right of Access — request a copy of all data we hold about you
- Right to Rectification — request correction of inaccurate data
- Right to Erasure — request deletion of your personal data (subject to legal retention obligations)
- Right to Object — object to processing of your data for marketing purposes
- Right to Data Portability — request your data in a machine-readable format
- Right to Lodge a Complaint — with the Office of the Data Protection Commissioner of Kenya

To exercise any of these rights, email us at hello@ubuntuecolodge.com with the subject line "Data Request". We will respond within 21 days.`,
  },
  {
    title: '7. Cookies',
    content: `We use the following cookies on ubuntuecolodge.com:

- Essential cookies — required for the site to function (session management, security)
- Preference cookies — remember your consent choice and display preferences
- Analytics cookies — anonymous usage statistics to improve the site (only with your consent)

We do not use advertising cookies. We do not sell your data to advertisers. You may withdraw cookie consent at any time by clearing your browser cookies.`,
  },
  {
    title: '8. Third-Party Data Processors',
    content: `We share your data only with the following processors, each bound by a Data Processing Agreement:

- Stripe Inc. — payment processing (PCI-DSS Level 1 certified)
- Safaricom PLC (M-Pesa) — mobile payment processing
- OpenAI Inc. — Moxie AI concierge processing
- Resend Inc. — transactional email delivery
- Vercel Inc. — website hosting and infrastructure
- Sentry Inc. — error monitoring (anonymised technical data only)
- Amazon Web Services — long-term data backup (S3 Glacier)
- Cloudflare Inc. — DDoS protection and CDN

We do not share your data with any other third parties without your explicit consent.`,
  },
  {
    title: '9. Data Security',
    content: `We protect your personal data using the following measures:

- All data is transmitted over HTTPS (TLS 1.3)
- WordPress admin access is restricted by IP allowlist via Cloudflare
- Role-based access control (RBAC) limits staff access to only the data they need
- Daily automated backups to AWS S3 Glacier with 11-nines durability
- JWT-based Guest Passports for secure session management
- Sentry monitors all systems for security anomalies in real time`,
  },
  {
    title: '10. Children\'s Privacy',
    content: `Our services are not directed at children under the age of 18. We do not knowingly collect personal data from minors. If you believe we have inadvertently collected data about a minor, please contact us immediately at hello@ubuntuecolodge.com and we will delete it promptly.`,
  },
  {
    title: '11. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices or in Kenyan data protection law. We will notify guests of material changes by email. The date of the last update is shown at the bottom of this page. Continued use of our website after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: '12. Contact & Complaints',
    content: `For any privacy-related questions or to exercise your rights:

Email: hello@ubuntuecolodge.com
Subject line: "Privacy / Data Request"
Response time: within 21 days

If you are unsatisfied with our response, you have the right to lodge a complaint with the Office of the Data Protection Commissioner of Kenya (ODPC):
Website: www.odpc.go.ke`,
  },
]

export default function PrivacyPolicyPage() {
  return (
    <main style={{ background: 'var(--obsidian)', minHeight: '100dvh' }}>
      <NavWrapper />

      {/* ── Hero ── */}
      <section
        className="relative px-6 md:px-10 pb-16"
        style={{ paddingTop: '120px' }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 70% 50% at 20% 80%, rgba(44,24,16,0.7) 0%, transparent 60%),
              radial-gradient(ellipse 40% 40% at 80% 20%, rgba(0,255,65,0.03) 0%, transparent 50%)
            `,
          }}
        />
        <div className="absolute pointer-events-none" style={{ top: '88px', left: '24px', width: 24, height: 24, borderTop: '1px solid rgba(0,255,65,0.35)', borderLeft: '1px solid rgba(0,255,65,0.35)' }} />
        <div className="absolute pointer-events-none" style={{ top: '88px', right: '24px', width: 24, height: 24, borderTop: '1px solid rgba(0,255,65,0.35)', borderRight: '1px solid rgba(0,255,65,0.35)' }} />

        <div className="relative max-w-4xl mx-auto" style={{ zIndex: 2 }}>
          <div className="flex items-center gap-3 mb-6">
            <span style={{ display: 'block', width: 40, height: '1px', background: 'var(--neon)', opacity: 0.5 }} />
            <span className="font-body text-[9px] tracking-[0.3em] uppercase" style={{ color: 'var(--neon)' }}>
              Kenya Data Protection Act 2019 · Compliant
            </span>
          </div>
          <h1
            className="font-display leading-tight mb-4"
            style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)', fontWeight: 300, color: 'var(--cream)' }}
          >
            Privacy Policy
          </h1>
          <p className="font-body text-[11px] leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Last updated: May 2026 · Version 2.0
          </p>
          <p className="font-body text-[12px] leading-loose max-w-2xl" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Ubuntu Kreative Village is committed to protecting your personal data and
            respecting your privacy rights under the Kenya Data Protection Act 2019.
            This policy explains what data we collect, why, and how you can control it.
          </p>
        </div>
      </section>

      {/* ── Sections ── */}
      <section className="px-6 md:px-10 py-16">
        <div className="max-w-4xl mx-auto">

          {/* Quick summary box */}
          <div
            className="p-6 mb-14"
            style={{
              background:   'rgba(0,255,65,0.04)',
              border:       '1px solid rgba(0,255,65,0.15)',
              borderRadius: '12px',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="status-dot" />
              <span className="font-body text-[9px] tracking-widest uppercase" style={{ color: 'var(--neon)' }}>
                Plain English Summary
              </span>
            </div>
            <ul className="space-y-2">
              {[
                'We collect only what we need to run your reservation and personalise your stay.',
                'We never sell your data to advertisers or third parties.',
                'Moxie AI conversations are stored for 12 months then permanently deleted.',
                'You can request deletion of your data at any time by emailing us.',
                'We use Stripe and M-Pesa for payments — we never see your card number.',
                'ubuntuecolodge.com is ad-free and always will be.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 font-body text-[11px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  <span style={{ color: 'var(--neon)', fontSize: '8px', marginTop: '4px', flexShrink: 0 }}>▸</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Policy sections */}
          <div className="space-y-10">
            {SECTIONS.map((section, i) => (
              <div
                key={i}
                className="relative"
                style={{ paddingLeft: '24px', borderLeft: '1px solid rgba(255,255,255,0.06)' }}
              >
                {/* Section number dot */}
                <div
                  style={{
                    position:     'absolute',
                    left:         '-5px',
                    top:          '6px',
                    width:        '9px',
                    height:       '9px',
                    borderRadius: '50%',
                    background:   i % 2 === 0 ? 'var(--neon)' : 'var(--gold)',
                    boxShadow:    i % 2 === 0 ? '0 0 8px var(--neon)' : '0 0 8px var(--gold)',
                  }}
                />

                <h2
                  className="font-display mb-4"
                  style={{
                    fontSize:   'clamp(1.1rem, 2vw, 1.5rem)',
                    fontWeight: 300,
                    color:      i % 2 === 0 ? 'var(--neon)' : 'var(--gold)',
                  }}
                >
                  {section.title}
                </h2>

                <div
                  className="font-body text-[11px] leading-loose whitespace-pre-line"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  {section.content}
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div
            className="mt-16 pt-8 text-center"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <p className="font-body text-[10px] leading-loose" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Ubuntu Kreative Village · hello@ubuntuecolodge.com · Kenya<br />
              This policy is governed by the Kenya Data Protection Act 2019 and the regulations thereunder.<br />
              Version 2.0 · Last updated May 2026
            </p>
          </div>

        </div>
      </section>

      <Footer />
      <MoxieChat />
    </main>
  )
}