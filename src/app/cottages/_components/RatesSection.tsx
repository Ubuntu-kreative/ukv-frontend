'use client'

// ─────────────────────────────────────────────────────────────
// RatesSection.tsx  — Isolated client component
//
// OPTIMIZATION: Extracted from page so its useState does NOT
// cause the entire page to re-render when tabs change.
// Previously, this component's tab state was co-located in
// the 1500-line page, which caused a full-page re-render tree
// on every tab click.
// ─────────────────────────────────────────────────────────────

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BOARD_OPTIONS } from '../_data/stays-data'

type RateTab = 'standard' | 'honeymoon' | 'children' | 'latecheckout' | 'holidays'

const TABS = [
  { id: 'standard'    as const, label: 'Standard Rates' },
  { id: 'honeymoon'   as const, label: 'Honeymoon' },
  { id: 'children'    as const, label: "Children's Rates" },
  { id: 'latecheckout' as const, label: 'Late Check-Out' },
  { id: 'holidays'    as const, label: 'Holidays' },
]

const FADE = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.22 } }

export function RatesSection() {
  const [activeTab, setActiveTab] = useState<RateTab>('standard')

  return (
    <section id="rates" className="py-24 px-4 sm:px-6 md:px-10 border-t border-white/5 bg-[#080808]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
            <div className="w-8 h-px bg-[var(--gold)]" />
            <span className="text-[var(--gold)] font-mono text-[9px] tracking-[0.4em] uppercase opacity-60">2026 – 2027 Season</span>
            <div className="w-8 h-px bg-[var(--gold)]" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-light leading-[0.9] mb-4">
            RATES &amp; <span className="italic text-[var(--gold)]">PACKAGES</span>
          </h2>
          <p className="font-body text-sm text-white/35 max-w-xl mx-auto md:mx-0">
            All rates are in Kenya Shillings (KES) · per person · per night · VAT 16% not included
          </p>
        </div>

        {/* Tab Nav */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-[10px] uppercase tracking-[0.18em] border rounded-lg transition-all duration-200 ${activeTab === tab.id ? 'border-[var(--gold)] text-[var(--gold)] bg-[var(--gold)]/[0.06]' : 'border-white/[0.08] text-white/30 hover:border-white/20 hover:text-white/55'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'standard' && (
            <motion.div key="standard" {...FADE}>
              <RateTable rows={[
                { label: 'Pokomo Cottages', rates: { bedOnly: 5000, bedBreakfast: 6500, halfBoard: 8500,  fullBoard: 10500 } },
                { label: 'Farm House',      rates: { bedOnly: 7500, bedBreakfast: 9000, halfBoard: 10500, fullBoard: 12500 } },
                { label: 'Pent Houses',     rates: { bedOnly: 9000, bedBreakfast: 10500, halfBoard: 12000, fullBoard: 14000 }, gold: true },
              ]} />
              <p className="mt-5 text-[9px] text-white/20 font-body">* All rates per person · per night · VAT 16% added at checkout</p>
            </motion.div>
          )}

          {activeTab === 'honeymoon' && (
            <motion.div key="honeymoon" {...FADE}>
              <div className="mb-6 p-4 border border-[var(--gold)]/20 rounded-xl bg-[var(--gold)]/[0.03]">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold)]/60 mb-1">Honeymooners Package</p>
                <p className="text-sm text-white/40 font-body">Special rates for couples celebrating their honeymoon. Please mention at time of booking to qualify.</p>
              </div>
              <RateTable rows={[
                { label: 'Pokomo Cottages', rates: { bedOnly: 7000, bedBreakfast: 8500,  halfBoard: 10500, fullBoard: 12500 } },
                { label: 'Farm House',      rates: { bedOnly: 9000, bedBreakfast: 11000, halfBoard: 12500, fullBoard: 14500 } },
              ]} />
            </motion.div>
          )}

          {activeTab === 'children' && (
            <motion.div key="children" {...FADE}>
              <div className="space-y-3">
                {[
                  { age: '0 – 4 Years',       rate: 'Free of charge',    note: 'Sharing bed with parent' },
                  { age: '5 – 11 Years',       rate: '30% of adult rate', note: 'Based on applicable room rate' },
                  { age: '12 Years & above',   rate: 'Full adult rate',   note: 'Standard room rate applies' },
                ].map((row) => (
                  <div key={row.age} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-white/[0.05] rounded-xl px-5 py-4 hover:bg-white/[0.02] transition-colors">
                    <div>
                      <p className="font-body text-sm text-white/60">{row.age}</p>
                      <p className="text-[10px] text-white/25 mt-0.5">{row.note}</p>
                    </div>
                    <p className="font-mono text-sm text-[var(--gold)] flex-shrink-0">{row.rate}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'latecheckout' && (
            <motion.div key="latecheckout" {...FADE}>
              <div className="space-y-3">
                {[
                  { time: 'Up to 12:00 Noon',    rate: 'Complimentary',           note: 'Subject to availability' },
                  { time: '12:00 Noon – 5:00 PM', rate: "50% of day's rack rate",  note: 'Half-day charge applies' },
                  { time: 'From 5:00 PM',         rate: 'Full room rate',           note: 'Full night rate charged' },
                ].map((row) => (
                  <div key={row.time} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-white/[0.05] rounded-xl px-5 py-4 hover:bg-white/[0.02] transition-colors">
                    <div>
                      <p className="font-body text-sm text-white/60">{row.time}</p>
                      <p className="text-[10px] text-white/25 mt-0.5">{row.note}</p>
                    </div>
                    <p className="font-mono text-sm text-[var(--gold)] flex-shrink-0">{row.rate}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'holidays' && (
            <motion.div key="holidays" {...FADE}>
              <div className="border border-[var(--gold)]/20 rounded-xl bg-[var(--gold)]/[0.03] p-6 mb-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold)]/60 mb-3">Holiday Surcharge</p>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-3 mb-3">
                  <p className="font-display text-3xl text-[var(--gold)]">KES 1,000</p>
                  <p className="font-body text-sm text-white/40">extra per person · per night during public holidays</p>
                </div>
                <p className="text-sm text-white/35 font-body leading-relaxed">
                  An additional surcharge of KES 1,000 per person per night applies during all public holidays and peak festive periods.
                </p>
              </div>
              <div className="border border-white/[0.05] rounded-xl px-5 py-4 bg-white/[0.01]">
                <p className="text-[10px] uppercase tracking-widest text-white/25 mb-2">Exemption</p>
                <p className="text-sm text-white/45 font-body">Children below 5 years of age are exempt from the holiday surcharge.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

// ── Shared rate table sub-component ───────────────────────────────────
function RateTable({ rows }: { rows: { label: string; rates: Record<string, number>; gold?: boolean }[] }) {
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/[0.08]">
              <th className="text-left py-4 px-5 text-[9px] uppercase tracking-[0.3em] text-white/25 font-normal">Accommodation</th>
              {BOARD_OPTIONS.map(o => (
                <th key={o.value} className="text-right py-4 px-5 text-[9px] uppercase tracking-[0.3em] text-[var(--gold)]/60 font-normal">{o.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-white/[0.04] hover:bg-white/[0.01] transition-colors">
                <td className={`py-4 px-5 font-body text-sm ${row.gold ? 'text-[var(--gold)]' : 'text-white/60'}`}>{row.label}</td>
                {BOARD_OPTIONS.map(o => (
                  <td key={o.value} className={`text-right py-4 px-5 font-mono text-sm tabular-nums ${row.gold ? 'text-[var(--gold)]' : 'text-white/50'}`}>
                    KES {row.rates[o.value].toLocaleString()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile */}
      <div className="md:hidden space-y-4">
        {rows.map((row) => (
          <div key={row.label} className="border border-white/[0.06] rounded-xl p-5">
            <p className="font-display text-base text-[var(--gold)] mb-4">{row.label}</p>
            <div className="grid grid-cols-2 gap-3">
              {BOARD_OPTIONS.map(o => (
                <div key={o.value} className="bg-white/[0.02] rounded-lg p-3">
                  <p className="text-[8px] uppercase tracking-widest text-white/25 mb-1">{o.label}</p>
                  <p className="font-mono text-sm text-white/60 tabular-nums">KES {row.rates[o.value].toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}