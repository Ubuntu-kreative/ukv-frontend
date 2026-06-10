/**
 * _components/MembershipSection.tsx — SERVER COMPONENT
 */

import Link from 'next/link'
import { MEMBERSHIP_PLANS } from '../_data/spa-data'

export default function MembershipSection() {
  return (
    <section className="py-28 px-6 md:px-10 bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-16">
          <p className="text-gold uppercase tracking-[0.35em] text-[10px] mb-5">Arohamai Membership</p>
          <h2 className="font-display text-5xl md:text-6xl leading-none mb-6">
            YOUR BODY<span className="italic text-gold"> DESERVES A PLAN</span>
          </h2>
          <p className="text-white/38 text-lg leading-relaxed">
            Healing is not a one-time event. It is a practice. Membership makes it sustainable.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {MEMBERSHIP_PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`border rounded-[2.5rem] p-9 flex flex-col ${
                plan.featured ? 'border-gold/28 bg-gold/5' : 'border-white/5 bg-[#0a0a0a]'
              }`}
            >
              {plan.featured && (
                <span className="text-[8px] uppercase tracking-[0.3em] text-gold mb-4 block">Most Popular</span>
              )}
              <h3 className="font-display text-4xl leading-none mb-1">{plan.name}</h3>
              <p className="text-[8px] uppercase tracking-[0.25em] text-white/25 mb-5">{plan.sessions}</p>
              <div className="mb-7">
                <span className="font-display text-5xl text-gold">{plan.price}</span>
                <span className="text-white/28 text-sm ml-1">{plan.period}</span>
              </div>
              <div className="space-y-3 mb-9 flex-1">
                {plan.perks.map((perk) => (
                  <div key={perk} className="flex gap-2.5 items-start">
                    <span className="text-gold text-[10px] mt-0.5 flex-shrink-0" aria-hidden="true">✓</span>
                    <p className="text-white/42 text-xs leading-relaxed">{perk}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/contact"
                className={`text-center py-4 text-[9px] uppercase tracking-[0.25em] transition-all duration-500 rounded-full ${
                  plan.featured
                    ? 'btn-gold'
                    : 'border border-white/15 text-white/55 hover:border-gold/28 hover:text-gold'
                }`}
              >
                Join {plan.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}