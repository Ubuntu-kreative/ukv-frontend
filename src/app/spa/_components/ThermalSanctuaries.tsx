/**
 * _components/ThermalSanctuaries.tsx — SERVER COMPONENT
 * All hover effects are pure CSS transitions.
 */

import Image from "next/image";
import { THERMALS } from "../_data/spa-data";

export default function ThermalSanctuaries() {
  return (
    <section className="py-28 px-6 md:px-10 bg-[#080808] border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-20">
          <p className="text-gold uppercase tracking-[0.35em] text-[10px] mb-5">
            Bath & Heat Therapies
          </p>
          <h2 className="font-display text-5xl md:text-6xl leading-none mb-6">
            CLEANSE. DETOX.<span className="italic text-gold"> RESTORE.</span>
          </h2>
          <p className="text-white/38 text-lg leading-relaxed">
            Eight distinct bath and heat experiences. Each operates at a
            different temperature, tradition and intensity.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-7">
          {/* Large cards */}
          <div className="lg:col-span-2 flex flex-col gap-7 h-full">
            <div className="grid md:grid-cols-2 gap-7 auto-rows-fr lg:h-[482px]">
              {THERMALS.slice(0, 2).map((t) => (
                <div
                  key={t.name}
                  data-ritual-id={t.ritualId}
                  className="group relative overflow-hidden rounded-[2.5rem] border border-white/5 hover:border-gold/18 cursor-pointer transition-all duration-700 h-full flex flex-col"
                >
                  <div className="relative h-[320px]">
                    <Image
                      src={t.image}
                      alt={t.name}
                      fill
                      sizes="(max-width:768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-[1.04] transition-all duration-[2000ms]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[1200ms]"
                      style={{
                        background: `radial-gradient(circle at center, ${t.glow}, transparent 70%)`,
                      }}
                    />
                  </div>
                  <div className="p-8 bg-[#0a0a0a] flex flex-col justify-between flex-1">
                    <div>
                      <p className="text-[8px] uppercase tracking-[0.35em] text-gold/60 mb-2">
                        {t.spec}
                      </p>
                      <h3 className="font-display text-4xl leading-none mb-3">
                        {t.name}
                      </h3>
                      <p className="text-white/42 text-sm leading-relaxed mb-5">
                        {t.description}
                      </p>
                    </div>
                    <span className="text-[9px] uppercase tracking-[0.28em] text-gold border border-gold/22 px-5 py-2.5 rounded-full hover:bg-gold/8 transition-all inline-block">
                      Book Now →
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div
              data-ritual-id="full-day-escape"
              className="group relative overflow-hidden rounded-[2.5rem] border border-white/5 hover:border-gold/18 cursor-pointer transition-all duration-700 ease-out h-[482px]"
            >
              {/* ── Background image — full-bleed, GPU-composited scale on hover ── */}
              <div className="absolute inset-0">
                <Image
                  src="https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop"
                  alt="Full Arohamai Wellness Escape"
                  fill
                  sizes="(max-width:768px) 100vw, 66vw"
                  className="object-cover transition-transform duration-[2000ms] group-hover:scale-[1.03]"
                />
              </div>

              {/* ── Overlay stack — 4 layers, always-readable text ── */}

              {/*
                Layer 1 — Flat base coat (the critical missing piece).
                A uniform 72% black over the ENTIRE card so no bright patch
                in the image can ever punch through the layers above.
                This is what guarantees contrast on all screen calibrations.
              */}
              <div className="absolute inset-0 bg-black/72" />

              {/*
                Layer 2 — Directional cinema gradient.
                Sits ON TOP of the base coat so the left (text) side
                reaches ~95% dark while the right edge stays at ~72%
                (the base coat floor). The image is still visible on the
                right but can never be brighter than the base coat allows.
              */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

              {/*
                Layer 3 — Bottom vignette.
                Extra darkening in the bottom 65% where the price block
                and feature icons live. Prevents any warm image tone
                from making small text unreadable.
              */}
              <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

              {/*
                Layer 4 — Top vignette.
                Darkens the top 35% so the eyebrow label and headline
                are anchored in shadow, not floating on a bright field.
              */}
              <div className="absolute inset-x-0 top-0 h-[35%] bg-gradient-to-b from-black/60 to-transparent" />

              {/*
                Layer 5 — Hover accent glow (GPU-only, zero reflow).
                Warm gold ellipse blooms from the right on hover.
                Opacity 0 at rest so it costs nothing at idle.
              */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[1400ms]"
                style={{
                  background:
                    "radial-gradient(ellipse 50% 65% at 78% 55%, rgba(200,168,75,0.06), transparent 60%)",
                }}
              />

              {/* ── Content ── */}
              <div className="relative z-10 flex h-full flex-col justify-between p-8 md:p-10">
                {/*
                  TOP section — eyebrow · headline · poetry.

                  CRITICAL: min-h-0 overrides the CSS default of
                  min-height:auto on flex children. Without it, the
                  browser refuses to shrink this div below its content
                  height, pushing the bottom section outside the card.
                  overflow-hidden clips any poetry text that doesn't fit
                  rather than letting it bleed over the bottom section.
                */}
                <div className="max-w-md min-h-0 overflow-hidden">
                  <p className="text-[8px] uppercase tracking-[0.38em] text-gold/82 mb-2">
                    THE AROHAMAI EXPERIENCE
                  </p>
                  <h3 className="font-display text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight text-[#ede6d3] mb-3">
                    Full Day Wellness Escape
                  </h3>
                  {/* Poetry — 62% white, tight spacing to preserve as many lines as possible */}
                  <div className="space-y-2 text-white/62 text-[11px] leading-relaxed">
                    <p>You do not come here for treatments.</p>
                    <p>You come to be restored.</p>
                    <p>
                      Time slows.
                      <br />
                      The body softens.
                      <br />
                      The mind lets go.
                    </p>
                    <p>
                      Heat, water, touch, and stillness—
                      <br />
                      layer by layer, they return you to yourself.
                    </p>
                    <p>
                      Eight hours.
                      <br />
                      No interruption.
                      <br />
                      Only restoration.
                    </p>
                  </div>
                </div>

                {/*
                  BOTTOM section — CTA · price · feature icons.

                  CRITICAL: flex-shrink-0 prevents this section from
                  shrinking when the flex container runs out of space.
                  justify-between on the parent keeps it pinned to the
                  bottom of the card at all viewport sizes.
                */}
                <div className="max-w-md flex flex-col gap-4 flex-shrink-0">
                  {/*
                    CTA button — solid gold fill (primary action).
                    Gold background reads as premium; glass outline
                    reads as secondary. Pill shape, max scale 1.02.
                  */}
                  <button
                    type="button"
                    className="inline-flex max-w-max items-center justify-center gap-2 rounded-full
                               bg-[rgba(200,168,75,0.88)] border border-gold/50
                               px-7 py-3.5 text-[10px] font-semibold uppercase tracking-[0.26em]
                               text-[#0a0a0a]
                               shadow-[0_0_28px_rgba(200,168,75,0.18)]
                               transition-all duration-300
                               hover:bg-gold hover:shadow-[0_0_36px_rgba(200,168,75,0.28)] hover:scale-[1.02]
                               active:scale-[0.99]"
                  >
                    EXPLORE EXPERIENCE →
                  </button>

                  {/* Price + features */}
                  <div className="border-t border-white/8 pt-4 space-y-3">
                    {/* Price block — clear 3-level hierarchy */}
                    <div>
                      {/* KES amount — display font, gold glow */}
                      <p
                        className="font-display text-[1.7rem] leading-none tracking-[0.04em] text-gold
                                    [text-shadow:0_0_24px_rgba(200,168,75,0.22)]"
                      >
                        KES 30,000
                      </p>
                      {/* Tier label */}
                      <p className="text-[8px] uppercase tracking-[0.28em] text-white/35 mt-1">
                        PER SESSION
                      </p>
                      {/* Package label */}
                      <p className="text-[8px] uppercase tracking-[0.22em] text-gold/42 mt-0.5">
                        FULL SANCTUARY ACCESS
                      </p>
                    </div>

                    {/*
                      Feature icon row — 4 columns, evenly spaced.
                      Icon sits above two-line label so each column
                      stays narrow enough to fit across max-w-md at any breakpoint.
                    */}
                    <div className="grid grid-cols-4 gap-2">
                      {(
                        [
                          { icon: "◷", lines: ["8 HOURS", "DURATION"] },
                          { icon: "♨", lines: ["ALL THERMAL", "EXPERIENCES"] },
                          { icon: "✦", lines: ["FULLY", "PERSONALISED"] },
                          { icon: "◈", lines: ["SIGNATURE", "RITUALS"] },
                        ] as { icon: string; lines: [string, string] }[]
                      ).map(({ icon, lines }) => (
                        <div
                          key={lines[0]}
                          className="flex flex-col items-center gap-1.5 text-center"
                        >
                          {/* Icon — slightly larger, gold/50 opacity, subtle glow */}
                          <span
                            className="text-gold/50 text-sm leading-none
                                       [text-shadow:0_0_8px_rgba(200,168,75,0.15)]"
                            aria-hidden="true"
                          >
                            {icon}
                          </span>
                          {/* Two-line label */}
                          <span className="text-[7px] uppercase tracking-[0.15em] text-gold/42 leading-tight">
                            {lines[0]}
                          </span>
                          <span className="text-[7px] uppercase tracking-[0.15em] text-gold/42 leading-tight">
                            {lines[1]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Smaller cards */}
          <div className="flex flex-col gap-7 h-full">
            {THERMALS.slice(2).map((t) => (
              <div
                key={t.name}
                data-ritual-id={t.ritualId}
                className="group relative overflow-hidden rounded-[2.5rem] border border-white/5 hover:border-gold/18 cursor-pointer transition-all duration-700 flex flex-col lg:h-[482px]"
              >
                <div className="relative h-[220px]">
                  <Image
                    src={t.image}
                    alt={t.name}
                    fill
                    sizes="(max-width:1024px) 100vw, 25vw"
                    className="object-cover group-hover:scale-[1.04] transition-all duration-[2000ms]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[1200ms]"
                    style={{
                      background: `radial-gradient(circle at center, ${t.glow}, transparent 70%)`,
                    }}
                  />
                </div>
                <div className="p-6 bg-[#0a0a0a] flex flex-col justify-between flex-1">
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.35em] text-gold/55 mb-1.5">
                      {t.spec}
                    </p>
                    <h3 className="font-display text-2xl md:text-3xl leading-none mb-2">
                      {t.name}
                    </h3>
                    <p className="text-white/38 text-sm leading-relaxed line-clamp-3">
                      {t.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
