import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import MoxieChat from '@/components/MoxieChat'
import Link from 'next/link'

const TEAM = [
  {
    name: 'Founder & Visionary',
    role: 'Ubuntu Kreative Village',
    bio: 'Born from a deep conviction that the land heals, and that community is the highest technology. The founder spent years studying regenerative agriculture, African philosophy, and digital systems before bringing all three together in this village.',
    accent: 'var(--gold)',
    initial: 'U',
  },
  {
    name: 'Head of Farm Operations',
    role: 'The Living Farm',
    bio: 'Trained in both traditional Kenyan farming methods and modern precision agriculture. Manages all FarmERP integrations, livestock health protocols, and the daily rhythm of the six fields. The farm runs because of this team.',
    accent: 'var(--neon)',
    initial: 'F',
  },
  {
    name: 'Executive Chef',
    role: 'Farm-to-Fork Kitchen',
    bio: 'Classically trained with 14 years across Nairobi, London, and Cape Town. Returned to Kenya with one mission: to cook only what this land produces. Every menu is written the morning of service, based on what was harvested at dawn.',
    accent: 'var(--gold)',
    initial: 'K',
  },
  {
    name: 'Lead Practitioner',
    role: 'Arohamai Spa',
    bio: 'Certified in traditional African bodywork, Ayurveda, and sports therapy. Leads the practitioner team at Arohamai and is responsible for sourcing every botanical used in treatments directly from the Ubuntu farm.',
    accent: '#F0A8B8',
    initial: 'A',
  },
  {
    name: 'Artist in Residence',
    role: 'Gallery & Culture',
    bio: 'Rotates every three months. The current artist in residence is embedded in the farm community, responding to the land through their practice and exhibiting work in the Ubuntu Gallery throughout their stay.',
    accent: '#A8D8F0',
    initial: 'G',
  },
  {
    name: 'Moxie',
    role: 'AI Concierge · All 6 Logs',
    bio: 'Moxie is not a chatbot. She is a living layer of intelligence woven through the entire village system — reading the Farm Log, Restaurant Log, Spa Log, and Guest Passport in real time to serve every guest with complete, contextual knowledge.',
    accent: 'var(--neon)',
    initial: 'M',
  },
]

const VALUES = [
  {
    swahili: 'Ubuntu',
    english: 'I am because we are',
    description: 'The foundational philosophy. No single element of this village exists in isolation. The farm feeds the kitchen. The kitchen nourishes the guest. The guest funds the farm. The land holds everything.',
    accent: 'var(--gold)',
  },
  {
    swahili: 'Uhai',
    english: 'Life · Vitality',
    description: 'Everything here is alive. The farm is not a set piece — it is a working, breathing organism. The crops grow. The animals move. The menu changes daily. Moxie watches it all in real time.',
    accent: 'var(--neon)',
  },
  {
    swahili: 'Asili',
    english: 'Origin · Nature',
    description: 'We return to source. Farm-sourced botanicals in the spa. Farm-traced ingredients in every dish. Architecture that echoes the landscape. Technology that serves the land, not the other way around.',
    accent: '#A8D8F0',
  },
  {
    swahili: 'Umoja',
    english: 'Unity',
    description: 'The guest, the farmer, the chef, the practitioner, and the artist are all part of the same story. Ubuntu Kreative Village is not a resort — it is a community that welcomes you inside it.',
    accent: '#F0A8B8',
  },
]

const TIMELINE = [
  { year: '2019', event: 'Land acquired in the Kenyan highlands. First crops planted by hand.', accent: 'var(--neon)' },
  { year: '2021', event: 'First Pokomo Cottage completed. First farm-stay guests welcome.', accent: 'var(--gold)' },
  { year: '2022', event: 'Arohamai Spa opens. Botanical garden planted. First artist in residence.', accent: '#F0A8B8' },
  { year: '2023', event: 'FarmERP integration begins. Farm-to-fork restaurant opens to public.', accent: 'var(--neon)' },
  { year: '2024', event: 'All four Pokomo Cottages and two Farmhouse Suites operational. Moxie AI development begins.', accent: 'var(--gold)' },
  { year: '2025', event: 'Architecture Bible v2 written. Full digital platform build begins.', accent: '#A8D8F0' },
  { year: '2026', event: 'ubuntuecolodge.com launches. Moxie goes live. Phase 1 of 6 complete.', accent: 'var(--neon)' },
]

export default function AboutPage() {
  return (
    <main style={{ background: 'var(--obsidian)', minHeight: '100vh' }}>
      <Nav />

      {/* ── Hero ── */}
      <section
        className="relative flex items-end px-6 md:px-10 pb-20"
        style={{ minHeight: '65vh', paddingTop: '120px' }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 20% 80%, rgba(44,24,16,0.85) 0%, transparent 55%),
              radial-gradient(ellipse 60% 50% at 70% 30%, rgba(212,168,83,0.04) 0%, transparent 55%)
            `,
          }}
        />
        <div className="absolute pointer-events-none" style={{ top: '88px', left: '24px', width: 24, height: 24, borderTop: '1px solid rgba(212,168,83,0.35)', borderLeft: '1px solid rgba(212,168,83,0.35)' }} />
        <div className="absolute pointer-events-none" style={{ top: '88px', right: '24px', width: 24, height: 24, borderTop: '1px solid rgba(212,168,83,0.35)', borderRight: '1px solid rgba(212,168,83,0.35)' }} />

        <div className="relative max-w-8xl mx-auto w-full" style={{ zIndex: 2 }}>
          <div className="flex items-center gap-3 mb-6">
            <span style={{ display: 'block', width: 40, height: '1px', background: 'var(--gold)', opacity: 0.5 }} />
            <span className="font-body text-[9px] tracking-[0.3em] uppercase" style={{ color: 'var(--gold)' }}>
              Our Story · Our Philosophy
            </span>
          </div>
          <h1
            className="font-display leading-tight mb-6"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', fontWeight: 300, color: 'var(--cream)' }}
          >
            About Ubuntu
          </h1>
          <blockquote
            className="font-display italic mb-6"
            style={{ fontSize: 'clamp(1.2rem, 3vw, 2rem)', fontWeight: 300, color: 'var(--gold)', maxWidth: '700px' }}
          >
            &ldquo;A living, breathing experience that celebrates togetherness,
            creativity, and authenticity.&rdquo;
          </blockquote>
          <p className="font-body max-w-2xl" style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)', lineHeight: 2 }}>
            Ubuntu Kreative Village is an eco lodge and living farm in Kenya,
            built on the African philosophy that no individual thrives in
            isolation. Every system here — the farm, the kitchen, the spa,
            the gallery, the technology — is designed to serve a single
            purpose: genuine human connection with land, community, and self.
          </p>
        </div>
      </section>

      {/* ── Values ── */}
      <section
        className="px-6 md:px-10 py-20"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="max-w-8xl mx-auto">

          <div className="flex items-center gap-4 mb-12">
            <h2 className="font-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 300, color: 'var(--gold)' }}>
              Our Values
            </h2>
            <div className="neon-divider flex-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
            {VALUES.map(v => (
              <div key={v.swahili} className="glass p-8 relative overflow-hidden">
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(90deg,transparent,${v.accent},transparent)`, opacity: 0.6 }} />
                <div
                  className="font-display mb-1"
                  style={{ fontSize: '3rem', fontWeight: 300, color: v.accent, opacity: 0.15, position: 'absolute', top: 16, right: 24 }}
                >
                  {v.swahili}
                </div>
                <div className="font-body text-[9px] tracking-[0.25em] uppercase mb-2" style={{ color: v.accent }}>
                  {v.swahili}
                </div>
                <h3 className="font-display mb-3" style={{ fontSize: '1.6rem', fontWeight: 300, color: 'var(--cream)' }}>
                  {v.english}
                </h3>
                <p className="font-body text-[11px] leading-loose" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {v.description}
                </p>
              </div>
            ))}
          </div>

          {/* ── The System ── */}
          <div className="flex items-center gap-4 mb-12">
            <h2 className="font-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 300, color: 'var(--neon)' }}>
              The System
            </h2>
            <div className="neon-divider flex-1" />
          </div>

          <div
            className="p-8 mb-24"
            style={{
              background: 'rgba(0,255,65,0.03)',
              border: '1px solid rgba(0,255,65,0.12)',
              borderRadius: '16px',
            }}
          >
            <p className="font-body text-[12px] leading-loose mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Ubuntu Kreative Village runs on a custom-built digital platform designed to last 50 years.
              Six interconnected data logs — the Guest Log, Farm Log, Restaurant Log, Spa Log, Audit Log,
              and System Log — form the nervous system of the entire operation.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { log: 'Guest Log', label: 'The Passport', color: '#B8A9F0' },
                { log: 'Farm Log', label: 'The Pulse', color: 'var(--neon)' },
                { log: 'Restaurant Log', label: 'The Menu', color: 'var(--gold)' },
                { log: 'Spa Log', label: 'The Ritual', color: '#F0A8B8' },
                { log: 'Audit Log', label: 'The Memory', color: '#A8D8F0' },
                { log: 'System Log', label: 'The Guardian', color: '#A8F0D8' },
              ].map(l => (
                <div key={l.log} className="text-center p-4" style={{ border: `1px solid ${l.color}22`, borderRadius: '8px', background: `${l.color}08` }}>
                  <div className="font-body text-[8px] tracking-widest uppercase mb-1" style={{ color: l.color }}>
                    {l.label}
                  </div>
                  <div className="font-display" style={{ fontSize: '0.95rem', fontWeight: 300, color: 'var(--cream)' }}>
                    {l.log}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Team ── */}
          <div className="flex items-center gap-4 mb-12">
            <h2 className="font-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 300, color: 'var(--cream)' }}>
              The Team
            </h2>
            <div className="neon-divider flex-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
            {TEAM.map(member => (
              <div key={member.name} className="glass p-6 relative overflow-hidden">
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(90deg,transparent,${member.accent},transparent)`, opacity: 0.6 }} />
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="flex items-center justify-center shrink-0"
                    style={{
                      width: 48, height: 48,
                      borderRadius: '50%',
                      background: `${member.accent}18`,
                      border: `1px solid ${member.accent}44`,
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.4rem',
                      fontWeight: 300,
                      color: member.accent,
                    }}
                  >
                    {member.initial}
                  </div>
                  <div>
                    <div className="font-body text-[9px] tracking-wider uppercase mb-1" style={{ color: member.accent }}>
                      {member.role}
                    </div>
                    <h3 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 300, color: 'var(--cream)' }}>
                      {member.name}
                    </h3>
                  </div>
                </div>
                <p className="font-body text-[11px] leading-loose" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {member.bio}
                </p>
              </div>
            ))}
          </div>

          {/* ── Timeline ── */}
          <div className="flex items-center gap-4 mb-12">
            <h2 className="font-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 300, color: 'var(--cream)' }}>
              Our Story
            </h2>
            <div className="neon-divider flex-1" />
          </div>

          <div className="relative">
            <div
              className="absolute left-[60px] top-0 bottom-0 w-px"
              style={{ background: 'linear-gradient(to bottom, var(--neon), transparent)', opacity: 0.2 }}
            />
            <div className="space-y-8">
              {TIMELINE.map((item, i) => (
                <div key={i} className="flex items-start gap-6">
                  <div
                    className="shrink-0 font-display text-right"
                    style={{ width: 48, fontSize: '1.1rem', fontWeight: 300, color: item.accent, paddingTop: 2 }}
                  >
                    {item.year}
                  </div>
                  <div
                    className="shrink-0 mt-2"
                    style={{
                      width: 10, height: 10,
                      borderRadius: '50%',
                      background: item.accent,
                      boxShadow: `0 0 8px ${item.accent}`,
                      marginLeft: 2,
                    }}
                  />
                  <p className="font-body text-[12px] leading-relaxed pt-px" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {item.event}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <Footer />
      <MoxieChat />
    </main>
  )
}