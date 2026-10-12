'use client'

/**
 * UbuntuStoryGrid.tsx — Ubuntu Kreative Village Cinematic Story Section
 *
 * Five-chapter cinematic narrative using real Ubuntu photography.
 * Replaces StatsStrip + SustainabilityMetrics on the homepage.
 * Placed directly after the Marquee strip.
 *
 * PHOTO SLOTS: swap any image path when real photography arrives.
 * All images are from /public/images/ — real Ubuntu property photos.
 *
 * Chapters:
 *  1. Origin  — The transformation story
 *  2. Place   — The village and its spaces
 *  3. People  — Community and culture (emotional heart)
 *  4. Experience — 4 cards: Restore · Nourish · Stay · Gather
 *  5. Purpose — Sustainability with honest goals
 *
 * Between chapters: visual strips holding the 8 image slots.
 */

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

// ─── Image assignments from real Ubuntu gallery ───────────────────────────────
// Slot 1: Origin / transformation — lush garden vista
const IMG_ORIGIN       = '/images/Harvest-of-Green-Abundance.jpeg'
// Slot 2: Village / place — farmhouse aerial feel
const IMG_VILLAGE      = '/images/Cottages-front.jpeg'
// Slot 3: Farm to fork
const IMG_FARM         = '/images/Garden-Feast.jpeg'
// Slot 4: Conference / gather
const IMG_CONFERENCE   = '/images/Team-Bunding-&-Building.jpeg'
// Slot 5: Wellness spaces
const IMG_WELLNESS     = '/images/Arohamai-Signature-Healing-Package.jpeg'
// Slot 6: Community / people
const IMG_COMMUNITY    = '/images/The-People-Who-Make-It-Possible.jpeg'
// Slot 7: Water / nature stewardship
const IMG_WATER        = '/images/Natures-Hidden-Gems.jpeg'
// Slot 8: Off-grid / solar
const IMG_SOLAR        = '/images/Under-the-Stars.jpeg'

// Chapter 2 split — cottage interior
const IMG_PLACE_2      = '/images/Marula-cottage1.jpeg'
// Experience cards
const IMG_SPA          = '/images/Mud-Bath.jpeg'
const IMG_DINING       = '/images/Dining-in-Paradise.jpeg'
const IMG_COTTAGE      = '/images/Marula-cottage2.jpeg'
const IMG_EVENTS       = '/images/Your-Dream-Garden-Wedding.jpeg'
// Purpose closing
const IMG_PURPOSE      = '/images/Garden-Gathering-Oasis.jpeg'

// ─── Lightbox gallery for each visual strip tile ─────────────────────────────
const STRIP_A_GALLERY = [
  { src: '/images/Garden-Feast.jpeg',                   caption: 'Farm to Fork · Every dish traced to a specific field' },
  { src: '/images/Garden-Breakfast-Beneath-the-Trees.jpeg', caption: 'Garden Breakfast · Beneath the forest canopy' },
  { src: '/images/A-Feast-Beneath-the-Forest-Canopy.jpeg',  caption: 'A Feast Beneath the Forest Canopy' },
  { src: '/images/Rustic-Feast-in-Bloom.jpeg',          caption: 'Rustic Feast in Bloom · Farm provenance dining' },
]
const STRIP_B_GALLERY = [
  { src: '/images/Team-Bunding-&-Building.jpeg',        caption: 'Team Building · Sustainable conference experiences' },
  { src: '/images/Story-Circle.jpeg',                   caption: 'Story Circle · Where ideas gather under open sky' },
  { src: '/images/Garden-Gathering-Oasis.jpeg',         caption: 'Garden Gathering Oasis · Corporate retreats' },
]
const STRIP_C_GALLERY = [
  { src: '/images/Arohamai-Signature-Healing-Package.jpeg', caption: 'Arohamai Signature Healing · Ancient African therapies' },
  { src: '/images/Mud-Bath.jpeg',                       caption: 'Mud Bath · Grounding and detoxifying' },
  { src: '/images/Moroccan-Bath.jpeg',                  caption: 'Moroccan Bath · Steam and renewal' },
  { src: '/images/Deep-Tissue-Massage.jpeg',            caption: 'Deep Tissue Massage · Restore muscle and mind' },
]
const STRIP_D_GALLERY = [
  { src: '/images/Natures-Hidden-Gems.jpeg',            caption: 'Nature\'s Hidden Gems · Water stewardship at Ubuntu' },
  { src: '/images/Sunbird-in-Flight.jpeg',              caption: 'Sunbird in Flight · Biodiversity on the estate' },
  { src: '/images/First-Light-Walk.jpeg',               caption: 'First Light Walk · Dawn on the living farm' },
]
const STRIP_E_GALLERY = [
  { src: '/images/Under-the-Stars.jpeg',                caption: 'Under the Stars · Off-grid living, uncompromised comfort' },
  { src: '/images/Golden-Nights.jpeg',                  caption: 'Golden Nights · Solar-powered evenings at Ubuntu' },
  { src: '/images/Campfire-Under-the-Stars.jpeg',       caption: 'Campfire · 87% solar powered, 0% grid dependency' },
]

type GalleryItem = { src: string; caption: string }

// ─── Intersection Observer hook ───────────────────────────────────────────────
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ items, startIndex, onClose }: {
  items: GalleryItem[]
  startIndex: number
  onClose: () => void
}) {
  const [idx, setIdx] = useState(startIndex)
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setIdx(i => (i + 1) % items.length)
      if (e.key === 'ArrowLeft')  setIdx(i => (i - 1 + items.length) % items.length)
    }
    window.addEventListener('keydown', fn)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', fn); document.body.style.overflow = '' }
  }, [items.length, onClose])

  const item = items[idx]
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative', maxWidth: '900px', width: '100%',
          borderRadius: '16px', overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10' }}>
          <Image src={item.src} alt={item.caption} fill style={{ objectFit: 'cover' }} />
        </div>
        <div style={{
          background: 'rgba(0,0,0,0.7)', padding: '14px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
        }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.7)', flex: 1 }}>
            {item.caption}
          </p>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>
            {idx + 1} / {items.length}
          </span>
        </div>
        {items.length > 1 && (
          <>
            <button
              onClick={() => setIdx(i => (i - 1 + items.length) % items.length)}
              style={{
                position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'rgba(0,0,0,0.6)', border: '0.5px solid rgba(255,255,255,0.2)',
                color: '#fff', fontSize: '18px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              aria-label="Previous image"
            >‹</button>
            <button
              onClick={() => setIdx(i => (i + 1) % items.length)}
              style={{
                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'rgba(0,0,0,0.6)', border: '0.5px solid rgba(255,255,255,0.2)',
                color: '#fff', fontSize: '18px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              aria-label="Next image"
            >›</button>
          </>
        )}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '12px', right: '12px',
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'rgba(0,0,0,0.7)', border: '0.5px solid rgba(255,255,255,0.25)',
            color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          aria-label="Close"
        >✕</button>
      </div>
    </div>
  )
}

// ─── Strip tile — opens lightbox ──────────────────────────────────────────────
function StripTile({ tag, tagColor, headline, image, alt, gallery, onOpen, style }: {
  tag: string; tagColor: string; headline: string
  image: string; alt: string; gallery: GalleryItem[]
  onOpen: (items: GalleryItem[], idx: number) => void
  style?: React.CSSProperties
}) {
  return (
    <button
      onClick={() => onOpen(gallery, 0)}
      aria-label={`Open ${headline} gallery`}
      style={{
        position: 'relative', overflow: 'hidden',
        borderRadius: 'clamp(10px,1.2vw,16px)',
        border: '0.5px solid var(--border2)',
        cursor: 'pointer', padding: 0, background: 'none',
        display: 'block', width: '100%',
        ...style,
      }}
    >
      <Image src={image} alt={alt} fill style={{ objectFit: 'cover', transition: 'transform 0.7s ease' }}
        className="ukv-strip-img" sizes="33vw" />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top,rgba(0,0,0,0.82) 0%,rgba(0,0,0,0.12) 60%,transparent 100%)',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: 'clamp(10px,1.5vw,16px)', textAlign: 'left',
      }}>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '7px', letterSpacing: '0.32em',
          textTransform: 'uppercase', color: tagColor, marginBottom: '4px',
        }}>{tag}</p>
        <p style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(10px,1.3vw,13px)',
          fontWeight: 300, color: '#fff', lineHeight: 1.2,
        }}>{headline}</p>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.18em',
          textTransform: 'uppercase', color: tagColor, marginTop: '6px', opacity: 0.8,
        }}>View gallery →</p>
      </div>
    </button>
  )
}

// ─── Chapter reveal wrapper ───────────────────────────────────────────────────
function Chapter({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useReveal()
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.75s ease ${delay}ms, transform 0.75s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function UbuntuStoryGrid() {
  const [lightbox, setLightbox] = useState<{ items: GalleryItem[]; idx: number } | null>(null)
  const openLightbox = (items: GalleryItem[], idx: number) => setLightbox({ items, idx })
  const closeLightbox = () => setLightbox(null)

  const gap    = 'clamp(0.6rem,1vw,0.875rem)'
  const radius = 'clamp(10px,1.2vw,18px)'
  const pad    = 'clamp(1.25rem,3vw,2.25rem)'

  return (
    <>
      {lightbox && (
        <Lightbox items={lightbox.items} startIndex={lightbox.idx} onClose={closeLightbox} />
      )}

      <section
        aria-label="Ubuntu Kreative Village — Our Story"
        style={{
          padding: `clamp(4rem,8vw,6.5rem) clamp(1.25rem,4vw,3rem)`,
          background: 'var(--bg)',
        }}
      >
        {/* ── Section intro ── */}
        <Chapter>
          <div style={{ maxWidth: '48rem', marginBottom: 'clamp(2.5rem,5vw,4rem)' }}>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '10px',
              letterSpacing: '0.4em', textTransform: 'uppercase',
              color: 'var(--gold)', marginBottom: '1rem',
            }}>
              From Place to Possibility · Ubuntu Kreative Village
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4.5vw,3.5rem)',
              fontWeight: 300, lineHeight: 1.06, color: 'var(--cream)',
              marginBottom: '1.25rem', letterSpacing: '-0.01em',
            }}>
              A place where nature grounds us,<br />
              culture connects us,{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>
                creativity inspires us.
              </em>
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '0.9375rem',
              lineHeight: 1.78, color: 'var(--muted)', maxWidth: '40rem',
            }}>
              Five chapters. One living village. Discover the origin,
              landscape, community, experiences, and future of Ubuntu
              Kreative Village in Kajiado County, Kenya.
            </p>
          </div>
        </Chapter>

        {/* ── CHAPTER 1: ORIGIN — full-width hero ── */}
        <Chapter delay={80}>
          <div style={{
            position: 'relative', borderRadius: radius,
            overflow: 'hidden', minHeight: 'clamp(380px,50vw,620px)',
            marginBottom: gap, display: 'flex', alignItems: 'flex-end',
          }}>
            <Image src={IMG_ORIGIN} alt="Harvest of green abundance at Ubuntu Kreative Village"
              fill loading="lazy" style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
              className="ukv-hero-img" sizes="100vw" />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top,rgba(0,0,0,0.88) 0%,rgba(0,0,0,0.3) 55%,rgba(0,0,0,0.06) 100%)',
            }} />
            <div style={{
              position: 'relative', zIndex: 2, padding: pad,
              maxWidth: '600px',
            }}>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '9px',
                letterSpacing: '0.4em', textTransform: 'uppercase',
                color: '#C9A040', marginBottom: '12px',
              }}>Chapter One · The Origin</p>
              <h3 style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,3.5vw,2.8rem)',
                fontWeight: 300, color: '#fff', lineHeight: 1.1, marginBottom: '14px',
              }}>
                Rooted in nature.<br />
                Connected by culture.<br />
                <em style={{ fontStyle: 'italic', color: '#C9A040' }}>Inspired by possibility.</em>
              </h3>
              {/* Exact quote from Document 1 — displayed prominently */}
              <blockquote style={{
                borderLeft: '2px solid #C9A040',
                paddingLeft: '16px',
                marginBottom: '18px',
                maxWidth: '440px',
              }}>
                <p style={{
                  fontFamily: 'var(--font-display)', fontSize: 'clamp(12px,1.4vw,15px)',
                  fontWeight: 300, fontStyle: 'italic',
                  lineHeight: 1.68, color: 'rgba(255,255,255,0.82)',
                }}>
                  "Ubuntu is a transformational, inspirational, ecological
                  masterpiece — from zero trees to a thriving miniforest."
                </p>
              </blockquote>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '12px',
                lineHeight: 1.78, color: 'rgba(255,255,255,0.5)',
                maxWidth: '420px', marginBottom: '20px',
              }}>
                Begun in 2019 on bare, dry earth in Kajiado County, Kenya.
                Built seed by seed, community by community.
              </p>
              <Link href="/about" style={{
                fontFamily: 'var(--font-body)', fontSize: '9px',
                letterSpacing: '0.24em', textTransform: 'uppercase',
                color: '#C9A040', textDecoration: 'none',
              }}>
                Discover the village →
              </Link>
            </div>
            {/* Corner stats */}
            <div style={{
              position: 'absolute', bottom: pad, right: pad, zIndex: 2,
              display: 'flex', gap: '24px',
            }}>
              {[
                { n: 'Est.', l: '2019' },
                { n: '200+', l: 'Acres' },
                { n: 'Kajiado', l: 'Kenya' },
              ].map(s => (
                <div key={s.l} style={{ textAlign: 'right' }}>
                  <span style={{
                    fontFamily: 'var(--font-display)', fontSize: '18px',
                    fontWeight: 300, color: '#C9A040', display: 'block', lineHeight: 1,
                  }}>{s.n}</span>
                  <span style={{
                    fontFamily: 'var(--font-body)', fontSize: '7px',
                    letterSpacing: '0.28em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.3)', display: 'block', marginTop: '3px',
                  }}>{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </Chapter>

        {/* ── CHAPTER 2: PLACE — split layout ── */}
        <Chapter delay={60}>
          <div style={{
            display: 'grid', gridTemplateColumns: '3fr 2fr',
            borderRadius: radius, overflow: 'hidden',
            border: '0.5px solid var(--border2)',
            minHeight: 'clamp(240px,30vw,400px)',
            marginBottom: gap,
          }}>
            {/* Image side */}
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              <Image src={IMG_VILLAGE} alt="Ubuntu Kreative Village cottages and farmland"
                fill style={{ objectFit: 'cover', objectPosition: 'center' }}
                className="ukv-split-img" sizes="60vw" />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to right,rgba(0,0,0,0.08) 0%,rgba(0,0,0,0.02) 100%)',
              }} />
            </div>
            {/* Text side */}
            <div style={{
              background: 'var(--bg2)',
              padding: 'clamp(1.75rem,4vw,3rem)',
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
            }}>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(40px,5vw,72px)',
                fontWeight: 300, color: 'var(--border2)', lineHeight: 1, marginBottom: '18px',
              }}>02</span>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '9px',
                letterSpacing: '0.4em', textTransform: 'uppercase',
                color: 'var(--gold)', marginBottom: '10px',
              }}>Chapter Two · The Place</p>
              <h3 style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(1.1rem,2vw,1.65rem)',
                fontWeight: 300, color: 'var(--cream)', lineHeight: 1.2, marginBottom: '12px',
              }}>
                More than a destination.<br />A place designed to belong.
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                {['Pokomo Cottages', 'Farmhouse Suite', 'Living Farm', 'Gathering Spaces'].map(t => (
                  <span key={t} style={{
                    fontFamily: 'var(--font-body)', fontSize: '8px',
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    padding: '4px 10px', borderRadius: '999px',
                    border: '0.5px solid var(--border2)', color: 'var(--muted2)',
                  }}>{t}</span>
                ))}
              </div>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '12px',
                lineHeight: 1.78, color: 'var(--muted)', marginBottom: '18px',
              }}>
                Six exclusive sanctuaries inside a working farm. Every space —
                the cottages, the open-air halls, the forest paths — contributes
                to one unified experience rooted in the land.
              </p>
              <Link href="/cottages" style={{
                fontFamily: 'var(--font-body)', fontSize: '9px',
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: 'var(--gold)', textDecoration: 'none',
              }}>
                Explore the village →
              </Link>
            </div>
          </div>
        </Chapter>

        {/* ── VISUAL STRIP A: slots 3 · 4 · 5 ── */}
        <Chapter delay={40}>
          <div style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 1fr',
            gap, marginBottom: gap,
            minHeight: 'clamp(160px,20vw,260px)',
          }}>
            <StripTile
              tag="Farm to Fork" tagColor="#C9A040"
              headline="200 metres from soil to skin"
              image={IMG_FARM} alt="Garden feast at Ubuntu farm"
              gallery={STRIP_A_GALLERY} onOpen={openLightbox}
              style={{ minHeight: 'clamp(160px,20vw,260px)' }}
            />
            <StripTile
              tag="Gather" tagColor="#00A832"
              headline="Africa's most sustainable conference room"
              image={IMG_CONFERENCE} alt="Team gathering at Ubuntu village"
              gallery={STRIP_B_GALLERY} onOpen={openLightbox}
              style={{ minHeight: 'clamp(160px,20vw,260px)' }}
            />
            <StripTile
              tag="Restore" tagColor="#C9A040"
              headline="Wellness escape spaces"
              image={IMG_WELLNESS} alt="Arohamai spa healing treatment"
              gallery={STRIP_C_GALLERY} onOpen={openLightbox}
              style={{ minHeight: 'clamp(160px,20vw,260px)' }}
            />
          </div>
        </Chapter>

        {/* ── CHAPTER 3: PEOPLE — immersive full width ── */}
        <Chapter delay={60}>
          <div style={{
            position: 'relative', borderRadius: radius, overflow: 'hidden',
            minHeight: 'clamp(300px,38vw,500px)',
            marginBottom: gap, display: 'flex', alignItems: 'flex-end',
          }}>
            <Image src={IMG_COMMUNITY}
              alt="The people who make Ubuntu Kreative Village possible"
              fill style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
              className="ukv-hero-img" sizes="100vw" />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to right,rgba(0,0,0,0.88) 0%,rgba(0,0,0,0.18) 60%,rgba(0,0,0,0.04) 100%)',
            }} />
            <div style={{ position: 'relative', zIndex: 2, padding: pad, maxWidth: '480px' }}>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '9px',
                letterSpacing: '0.4em', textTransform: 'uppercase',
                color: '#00A832', marginBottom: '12px',
              }}>Chapter Three · The People</p>
              <h3 style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem,2.8vw,2.2rem)',
                fontWeight: 300, color: '#fff', lineHeight: 1.14, marginBottom: '12px',
              }}>
                Culture is not decoration.<br />
                It is what we share,<br />
                create, and experience together.
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '12px',
                lineHeight: 1.78, color: 'rgba(255,255,255,0.55)',
                marginBottom: '18px', maxWidth: '380px',
              }}>
                Ubuntu philosophy — "I am because we are" — runs through
                every part of the village. Local women, farmers, artisans,
                and creative practitioners are the reason Ubuntu exists.
              </p>
              {/* Women Impact — prominently called out per Document 2 */}
              <div style={{
                display: 'flex', flexDirection: 'column', gap: '10px',
              }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  border: '0.5px solid rgba(0,168,50,0.4)',
                  padding: '7px 16px', borderRadius: '999px',
                  width: 'fit-content',
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00A832', display: 'inline-block' }} />
                  <span style={{
                    fontFamily: 'var(--font-body)', fontSize: '8px',
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.6)',
                  }}>Women-led · Community-rooted · Locally owned</span>
                </div>
                <p style={{
                  fontFamily: 'var(--font-display)', fontSize: 'clamp(13px,1.6vw,17px)',
                  fontWeight: 300, fontStyle: 'italic',
                  color: '#00A832', maxWidth: '340px', lineHeight: 1.4,
                }}>
                  "The women of Ubuntu are not part of the story.
                  They are the story."
                </p>
              </div>
            </div>
          </div>
        </Chapter>

        {/* ── CHAPTER 4: EXPERIENCE — 4 cards ── */}
        <Chapter delay={40}>
          <div style={{ marginBottom: gap }}>
            <div style={{ marginBottom: '20px' }}>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '9px',
                letterSpacing: '0.4em', textTransform: 'uppercase',
                color: 'var(--gold)', marginBottom: '8px',
              }}>Chapter Four · The Experiences</p>
              <h3 style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem,2.5vw,1.9rem)',
                fontWeight: 300, color: 'var(--cream)', marginBottom: '6px',
              }}>Seven ways to be present</h3>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '12px',
                color: 'var(--muted)', lineHeight: 1.7, maxWidth: '38rem',
              }}>
                Stay · Nourish · Restore · Connect · Create · Gather · Discover.
                Every pillar of Ubuntu, every link leads deeper into the village.
              </p>
            </div>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
              gap, minHeight: 'clamp(180px,22vw,300px)',
              marginBottom: gap,
            }}>
              {[
                { tag: 'Restore', color: '#C9A040', h: 'Arohamai Spa', desc: 'Mud baths. Hammam. Ancient African therapies.', href: '/spa', img: IMG_SPA, alt: 'Arohamai Spa mud bath treatment' },
                { tag: 'Nourish', color: '#00A832', h: 'Farm-to-Fork Dining', desc: 'Every dish traced to a specific field.', href: '/restaurant', img: IMG_DINING, alt: 'Dining in paradise at Ubuntu restaurant' },
                { tag: 'Stay',    color: '#C9A040', h: 'Pokomo Cottages', desc: 'Six sanctuaries inside the living farm.', href: '/cottages', img: IMG_COTTAGE, alt: 'Marula cottage at Ubuntu village' },
                { tag: 'Gather', color: '#3A8BD4', h: 'Events and Retreats', desc: 'Meetings, weddings, and shared ideas.', href: '/events', img: IMG_EVENTS, alt: 'Dream garden wedding at Ubuntu' },
              ].map(card => (
                <Link
                  key={card.tag}
                  href={card.href}
                  style={{
                    position: 'relative', overflow: 'hidden',
                    borderRadius: radius, border: '0.5px solid var(--border2)',
                    display: 'block', textDecoration: 'none',
                    minHeight: 'clamp(180px,22vw,300px)',
                  }}
                >
                  <Image src={card.img} alt={card.alt} fill
                    style={{ objectFit: 'cover', transition: 'transform 0.7s ease' }}
                    className="ukv-exp-img" sizes="25vw" />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top,rgba(0,0,0,0.86) 0%,rgba(0,0,0,0.08) 60%,transparent 100%)',
                  }} />
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    padding: 'clamp(10px,1.5vw,16px)',
                  }}>
                    <p style={{
                      fontFamily: 'var(--font-body)', fontSize: '7px',
                      letterSpacing: '0.32em', textTransform: 'uppercase',
                      color: card.color, marginBottom: '4px',
                    }}>{card.tag}</p>
                    <h4 style={{
                      fontFamily: 'var(--font-display)', fontSize: 'clamp(11px,1.4vw,15px)',
                      fontWeight: 300, color: '#fff', lineHeight: 1.2, marginBottom: '4px',
                    }}>{card.h}</h4>
                    <p style={{
                      fontFamily: 'var(--font-body)', fontSize: '9px',
                      color: 'rgba(255,255,255,0.45)', lineHeight: 1.5, marginBottom: '6px',
                    }}>{card.desc}</p>
                    <span style={{
                      fontFamily: 'var(--font-body)', fontSize: '8px',
                      letterSpacing: '0.18em', textTransform: 'uppercase', color: card.color,
                    }}>Explore →</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* ── Create · Connect · Discover row ── */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
              gap, minHeight: 'clamp(140px,16vw,220px)',
            }}>
              {[
                {
                  tag: 'Create', color: '#C9A040',
                  h: 'Art, Pottery & Batik',
                  desc: 'Hands-on workshops with local artisans — clay, natural dye, beadwork, and wheel pottery.',
                  href: '/gallery',
                  img: '/images/Hands-Clay-&-Heritage.jpeg',
                  alt: 'Hands clay and heritage workshop at Ubuntu',
                },
                {
                  tag: 'Connect', color: '#00A832',
                  h: 'Ubuntu Philosophy',
                  desc: '"I am because we are." Cultural story circles, community experiences, and living heritage.',
                  href: '/about',
                  img: '/images/Story-Circle.jpeg',
                  alt: 'Story circle community gathering at Ubuntu',
                },
                {
                  tag: 'Discover', color: '#3A8BD4',
                  h: 'Farm Tours & Nature Walks',
                  desc: 'Living classroom. 24 animals. 6 fields. First light walks and farm-to-table harvesting.',
                  href: '/farm',
                  img: '/images/First-Light-Walk.jpeg',
                  alt: 'First light walk on the Ubuntu living farm',
                },
              ].map(card => (
                <Link
                  key={card.tag}
                  href={card.href}
                  onClick={e => e.stopPropagation()}
                  style={{
                    position: 'relative', overflow: 'hidden',
                    borderRadius: radius, border: '0.5px solid var(--border2)',
                    display: 'block', textDecoration: 'none',
                    minHeight: 'clamp(140px,16vw,220px)',
                  }}
                >
                  <Image src={card.img} alt={card.alt} fill
                    style={{ objectFit: 'cover' }}
                    className="ukv-exp-img" sizes="33vw" />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top,rgba(0,0,0,0.86) 0%,rgba(0,0,0,0.08) 60%,transparent 100%)',
                  }} />
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    padding: 'clamp(10px,1.5vw,16px)',
                  }}>
                    <p style={{
                      fontFamily: 'var(--font-body)', fontSize: '7px',
                      letterSpacing: '0.32em', textTransform: 'uppercase',
                      color: card.color, marginBottom: '4px',
                    }}>{card.tag}</p>
                    <h4 style={{
                      fontFamily: 'var(--font-display)', fontSize: 'clamp(11px,1.4vw,14px)',
                      fontWeight: 300, color: '#fff', lineHeight: 1.2, marginBottom: '4px',
                    }}>{card.h}</h4>
                    <p style={{
                      fontFamily: 'var(--font-body)', fontSize: '9px',
                      color: 'rgba(255,255,255,0.42)', lineHeight: 1.5, marginBottom: '6px',
                    }}>{card.desc}</p>
                    <span style={{
                      fontFamily: 'var(--font-body)', fontSize: '8px',
                      letterSpacing: '0.18em', textTransform: 'uppercase', color: card.color,
                    }}>Explore →</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* View all experiences link */}
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <Link href="/contact" style={{
                fontFamily: 'var(--font-body)', fontSize: '9px',
                letterSpacing: '0.24em', textTransform: 'uppercase',
                color: 'var(--gold)', textDecoration: 'none',
                borderBottom: '0.5px solid var(--gold)',
                paddingBottom: '2px',
              }}>
                View all Ubuntu experiences & packages →
              </Link>
            </div>
          </div>
        </Chapter>

        {/* ── VISUAL STRIP B: slots 7 + 8 ── */}
        <Chapter delay={40}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap, marginBottom: gap,
            minHeight: 'clamp(140px,16vw,220px)',
          }}>
            <StripTile
              tag="Water Stewardship" tagColor="#3A8BD4"
              headline="Every drop, honoured"
              image={IMG_WATER} alt="Nature's hidden gems — water stewardship at Ubuntu"
              gallery={STRIP_D_GALLERY} onOpen={openLightbox}
              style={{ minHeight: 'clamp(140px,16vw,220px)' }}
            />
            <StripTile
              tag="Off-Grid Living" tagColor="#C9A040"
              headline="Powered by the sun. Rooted in the earth."
              image={IMG_SOLAR} alt="Under the stars — solar powered Ubuntu village"
              gallery={STRIP_E_GALLERY} onOpen={openLightbox}
              style={{ minHeight: 'clamp(140px,16vw,220px)' }}
            />
          </div>
        </Chapter>

        {/* ── CHAPTER 5: PURPOSE ── */}
        <Chapter delay={60}>
          <div style={{
            position: 'relative', borderRadius: radius, overflow: 'hidden',
            minHeight: 'clamp(240px,28vw,380px)',
            marginBottom: 'clamp(2rem,4vw,3.5rem)',
            display: 'flex', alignItems: 'flex-end',
          }}>
            <Image src={IMG_PURPOSE}
              alt="Garden gathering oasis — sustainability at Ubuntu Kreative Village"
              fill style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
              className="ukv-hero-img" sizes="100vw" />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top,rgba(0,0,0,0.92) 0%,rgba(0,0,0,0.4) 55%,rgba(0,0,0,0.1) 100%)',
            }} />
            <div style={{
              position: 'relative', zIndex: 2, padding: pad, width: '100%',
              display: 'flex', alignItems: 'flex-end',
              justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px',
            }}>
              <div style={{ maxWidth: '400px' }}>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '9px',
                  letterSpacing: '0.4em', textTransform: 'uppercase',
                  color: '#C9A040', marginBottom: '10px',
                }}>Chapter Five · The Purpose</p>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem,2.5vw,2rem)',
                  fontWeight: 300, color: '#fff', lineHeight: 1.2, marginBottom: '10px',
                }}>A future shaped by responsibility</h3>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '12px',
                  lineHeight: 1.75, color: 'rgba(255,255,255,0.5)',
                }}>
                  Solar energy, rainwater harvesting, regenerative farming,
                  zero-waste practices, and genuine community benefit —
                  not as certification, but as everyday practice.
                </p>
              </div>
              {/* Goals — clearly labelled */}
              <div style={{ display: 'flex', gap: 'clamp(16px,3vw,32px)', flexShrink: 0 }}>
                {[
                  { n: '87%',   l: 'Solar powered',      note: 'target · renewable energy' },
                  { n: '40%',   l: 'Water conserved',    note: 'target · rainwater harvesting' },
                  { n: '−12t',  l: 'CO₂ offset',         note: 'goal · monthly' },
                  { n: '94%',   l: 'Zero waste',         note: 'target · landfill diversion' },
                ].map(m => (
                  <div key={m.l} style={{ textAlign: 'center' }}>
                    <span style={{
                      fontFamily: 'var(--font-display)', fontSize: 'clamp(16px,2.5vw,22px)',
                      fontWeight: 300, color: '#C9A040', display: 'block', lineHeight: 1,
                    }}>{m.n}</span>
                    <span style={{
                      fontFamily: 'var(--font-body)', fontSize: '7px',
                      letterSpacing: '0.24em', textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.4)', display: 'block', marginTop: '4px',
                    }}>{m.l}</span>
                    <span style={{
                      fontFamily: 'var(--font-body)', fontSize: '6px',
                      color: 'rgba(255,255,255,0.22)', display: 'block', marginTop: '2px',
                    }}>{m.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Chapter>

        {/* ── Bottom bar ── */}
        <div style={{
          paddingTop: '2rem',
          borderTop: '0.5px solid var(--border2)',
          display: 'flex', flexDirection: 'column', gap: '1.5rem',
        }}>

          {/* Guestbook teaser row */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
            padding: '1.25rem 1.5rem',
            borderRadius: 'clamp(10px,1.2vw,16px)',
            background: 'var(--bg2)',
            border: '0.5px solid var(--border2)',
          }}>
            <div>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '9px',
                letterSpacing: '0.35em', textTransform: 'uppercase',
                color: 'var(--gold)', marginBottom: '5px',
              }}>Ubuntu Guestbook</p>
              <p style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem,1.8vw,1.4rem)',
                fontWeight: 300, color: 'var(--cream)', lineHeight: 1.2,
              }}>
                Real stories from guests who stayed, ate, healed, and created here.
              </p>
            </div>
            <Link href="/journal/voices" style={{
              fontFamily: 'var(--font-body)', fontSize: '9px',
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'var(--gold)', textDecoration: 'none',
              border: '0.5px solid var(--gold)',
              padding: '10px 22px', borderRadius: '999px',
              whiteSpace: 'nowrap', flexShrink: 0,
            }}>Read guest stories →</Link>
          </div>

          {/* Moxie + hashtag + CTA row */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '10px',
                letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted2)',
              }}>#MyUbuntuMoment — share your story</p>
              <Link href="/moxie" style={{
                fontFamily: 'var(--font-body)', fontSize: '10px',
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'var(--muted2)', textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: '#00FF41', display: 'inline-block',
                  boxShadow: '0 0 6px rgba(0,255,65,0.6)',
                }} />
                Ask Moxie about the village
              </Link>
            </div>
            <Link href="/contact" style={{
              fontFamily: 'var(--font-body)', fontSize: '10px',
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'var(--bg)', background: 'var(--gold)',
              padding: '12px 28px', borderRadius: '999px',
              textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
            }}>Reserve your stay →</Link>
          </div>
        </div>
      </section>

      {/* Hover styles — injected once */}
      <style>{`
        .ukv-hero-img  { transition: transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94) !important; }
        .ukv-split-img { transition: transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94) !important; }
        .ukv-exp-img   { transition: transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94) !important; }
        .ukv-strip-img { transition: transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94) !important; }
        a:hover .ukv-exp-img,
        a:hover .ukv-hero-img,
        a:hover .ukv-split-img,
        button:hover .ukv-strip-img { transform: scale(1.045) !important; }
        @media (max-width: 768px) {
          .ukv-exp-grid   { grid-template-columns: 1fr 1fr !important; }
          .ukv-strip-a    { grid-template-columns: 1fr !important; }
          .ukv-split      { grid-template-columns: 1fr !important; }
          .ukv-strip-b    { grid-template-columns: 1fr 1fr !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ukv-hero-img,.ukv-split-img,.ukv-exp-img,.ukv-strip-img {
            transition: none !important;
          }
        }
      `}</style>
    </>
  )
}