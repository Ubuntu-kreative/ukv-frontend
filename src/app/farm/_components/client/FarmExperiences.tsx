'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { useCartStore } from '@/context/cartStore'
import toast from 'react-hot-toast'

import {
  EXPERIENCE_ITEMS, TAB_DATA,
  type ExperienceItem, type TabItem, type FarmTab,
} from '../../_data/farm-data'

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────────────── */

function useScrollLock(active: boolean) {
  useEffect(() => {
    if (active) document.documentElement.classList.add('farm-modal-open')
    else        document.documentElement.classList.remove('farm-modal-open')
    return () => document.documentElement.classList.remove('farm-modal-open')
  }, [active])
}

function useEscapeKey(onClose: () => void, active: boolean) {
  useEffect(() => {
    if (!active) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [active, onClose])
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */

export default function FarmExperiences() {
  const [activeTab, setActiveTab]         = useState<FarmTab>('walks')
  const [modalItem, setModalItem]         = useState<ExperienceItem | null>(null)
  const [tabModalItem, setTabModalItem]   = useState<TabItem | null>(null)

  const { addItem, items, openCart } = useCartStore()
  const farmCount = items.filter((i) => i.category === 'farm').length

  const isInCart = (id: string) => items.some((i) => i.id === id && i.category === 'farm')
  const getQty   = (id: string) => items.filter((i) => i.id === id && i.category === 'farm').length

  const addExperience = useCallback((exp: ExperienceItem, qty = 1) => {
    for (let i = 0; i < qty; i++) {
      addItem({ id: exp.id, name: exp.name, category: 'farm', tag: exp.category, price: exp.price, unit: '/ person' })
    }
    toast.success(`${exp.name} added to cart`)
  }, [addItem])

  const addTabItem = useCallback((item: TabItem) => {
    addItem({ id: item.id, name: item.name, category: 'farm', tag: item.tag, price: item.price ?? 0, unit: '/ person' })
    toast.success(`${item.name} added to cart`)
  }, [addItem])

  const closeExp    = useCallback(() => setModalItem(null),    [])
  const closeTabMod = useCallback(() => setTabModalItem(null), [])

  useScrollLock(!!(modalItem || tabModalItem))

  return (
    <section id="farm-experiences" style={{ padding: '80px 40px 0' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* ── HEADER ── */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ width: '40px', height: '1px', background: 'var(--neon)', opacity: 0.5, display: 'block' }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>
              Book directly · Instant confirmation
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.05, marginBottom: '8px' }}>
                Walk the land. <em style={{ color: 'var(--gold)', fontStyle: 'normal' }}>Know your food.</em>
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.8, maxWidth: '560px' }}>
                Pick what calls to you. Each experience is self-contained and goes directly into your cart.
              </p>
            </div>
            {farmCount > 0 && (
              <button onClick={openCart} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'12px 20px', background:'rgba(212,168,83,0.08)', border:'1px solid rgba(212,168,83,0.25)', borderRadius:'40px', cursor:'pointer', fontFamily:'var(--font-body)', fontSize:'9px', letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--gold)' }}>
                <span style={{ width:'20px', height:'20px', background:'var(--gold)', color:'var(--obsidian)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'9px', fontWeight:700 }}>{farmCount}</span>
                View Cart
              </button>
            )}
          </div>
        </div>

        {/* ── EXPERIENCE CARDS ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:'20px', marginBottom:'80px' }}>
          {EXPERIENCE_ITEMS.map((item) => (
            <ExperienceCard
              key={item.id}
              item={item}
              onOpenModal={setModalItem}
              isInCart={isInCart(item.id)}
              onAdd={() => addExperience(item)}
              onViewCart={openCart}
            />
          ))}
        </div>

        {/* ── TAB SECTION ── */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px' }}>
            <span style={{ width:'40px', height:'1px', background:'var(--gold)', opacity:0.4, display:'block' }} />
            <span style={{ fontFamily:'var(--font-body)', fontSize:'9px', letterSpacing:'0.3em', textTransform:'uppercase', color:'rgba(255,255,255,0.28)' }}>
              Explore by Category
            </span>
          </div>
          <div style={{ display:'flex', gap:0, borderBottom:'1px solid rgba(255,255,255,0.06)', overflowX:'auto' }}>
            {(Object.keys(TAB_DATA) as FarmTab[]).map((key) => (
              <button key={key} onClick={() => setActiveTab(key)} style={{ padding:'14px 24px', background:'none', border:'none', cursor:'pointer', fontFamily:'var(--font-body)', fontSize:'10px', letterSpacing:'0.14em', textTransform:'uppercase', color: activeTab===key ? 'var(--gold)' : 'rgba(255,255,255,0.28)', borderBottom: activeTab===key ? '1.5px solid var(--gold)' : '1.5px solid transparent', marginBottom:'-1px', transition:'all 0.2s', whiteSpace:'nowrap' }}>
                {TAB_DATA[key].label}
              </button>
            ))}
          </div>
        </div>

        {/* ── TAB GRID ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'16px' }}>
          {TAB_DATA[activeTab].items.map((item) => (
            <TabItemCard key={item.id} item={item} onOpen={setTabModalItem} onAdd={() => addTabItem(item)} />
          ))}
        </div>
      </div>

      {/* ── FLOATING CART ── */}
      {farmCount > 0 && (
        <button onClick={openCart} style={{ position:'fixed', bottom:'28px', right:'100px', zIndex:9990, display:'flex', alignItems:'center', gap:'12px', padding:'14px 22px', background:'linear-gradient(135deg,var(--gold) 0%,#c09a3a 100%)', border:'none', borderRadius:'50px', boxShadow:'0 8px 32px rgba(212,168,83,0.4)', cursor:'pointer', fontFamily:'var(--font-body)', fontSize:'10px', letterSpacing:'0.15em', textTransform:'uppercase', fontWeight:700, color:'var(--obsidian)' }}>
          <span>🌱 {farmCount} Booked</span>
          <span style={{ height:'16px', width:'1px', background:'rgba(5,8,4,0.2)' }} />
          <span>View Cart →</span>
        </button>
      )}

      {/* ── MODALS ── */}
      {modalItem && createPortal(
        <ExperienceModal
          item={modalItem}
          onClose={closeExp}
          isInCart={isInCart(modalItem.id)}
          cartQty={getQty(modalItem.id)}
          onAdd={(qty) => addExperience(modalItem, qty)}
          onViewCart={openCart}
        />,
        document.body
      )}
      {tabModalItem && createPortal(
        <TabItemModal
          item={tabModalItem}
          onClose={closeTabMod}
          onAdd={() => addTabItem(tabModalItem)}
          onViewCart={openCart}
        />,
        document.body
      )}
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   EXPERIENCE CARD
───────────────────────────────────────────────────────────────────────────── */

function ExperienceCard({ item, onOpenModal, isInCart, onAdd, onViewCart }: {
  item: ExperienceItem; onOpenModal: (i: ExperienceItem) => void
  isInCart: boolean; onAdd: () => void; onViewCart: () => void
}) {
  return (
    <div
      onClick={() => onOpenModal(item)}
      style={{ position:'relative', overflow:'hidden', cursor:'pointer', background:'rgba(255,255,255,0.02)', border: isInCart ? '1px solid rgba(0,255,65,0.35)' : '1px solid rgba(255,255,255,0.06)', borderRadius:'16px', transition:'border-color 0.3s, transform 0.3s, box-shadow 0.3s' }}
      onMouseEnter={(e) => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.borderColor='rgba(212,168,83,0.4)'; e.currentTarget.style.boxShadow='0 24px 60px rgba(0,0,0,0.5)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor=isInCart?'rgba(0,255,65,0.35)':'rgba(255,255,255,0.06)'; e.currentTarget.style.boxShadow='none' }}
    >
      <div style={{ position:'relative', height:'220px', overflow:'hidden' }}>
        <Image src={item.image} alt={item.name} fill style={{ objectFit:'cover', transition:'transform 0.6s ease' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,rgba(0,0,0,0.1) 0%,rgba(5,8,4,0.85) 100%)' }} />
        {item.badge && !isInCart && (
          <div style={{ position:'absolute', top:'12px', left:'12px', padding:'3px 10px', borderRadius:'20px', background:`${item.badgeColor}22`, border:`1px solid ${item.badgeColor}55`, color:item.badgeColor, fontFamily:'var(--font-body)', fontSize:'9px', letterSpacing:'0.15em', textTransform:'uppercase' }}>
            {item.badge}
          </div>
        )}
        <div style={{ position:'absolute', bottom:'14px', left:'14px', right:'14px' }}>
          <div style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', fontWeight:300, color:'var(--cream)', marginBottom:'4px' }}>{item.name}</div>
          <div style={{ display:'flex', gap:'10px' }}>
            <span style={{ fontFamily:'var(--font-body)', fontSize:'9px', color:'rgba(255,255,255,0.4)' }}>⏱ {item.duration}</span>
            <span style={{ fontFamily:'var(--font-body)', fontSize:'9px', color:'rgba(255,255,255,0.4)' }}>👥 {item.groupSize}</span>
          </div>
        </div>
      </div>
      <div style={{ padding:'16px 18px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <span style={{ fontFamily:'var(--font-body)', fontSize:'9px', letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(255,255,255,0.25)', display:'block', marginBottom:'2px' }}>per person</span>
            <span style={{ fontFamily:'var(--font-display)', fontSize:'1.3rem', fontWeight:300, color:'var(--gold)' }}>KES {item.price.toLocaleString()}</span>
          </div>
          <button onClick={(e) => { e.stopPropagation(); isInCart ? onViewCart() : onAdd() }} style={{ padding:'8px 16px', borderRadius:'8px', cursor:'pointer', fontFamily:'var(--font-body)', fontSize:'9px', letterSpacing:'0.12em', textTransform:'uppercase', fontWeight:600, background: isInCart ? 'rgba(0,255,65,0.12)' : 'var(--gold)', color: isInCart ? 'var(--neon)' : 'var(--obsidian)', border: isInCart ? '1px solid rgba(0,255,65,0.35)' : 'none' }}>
            {isInCart ? 'View Cart' : '+ Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   TAB ITEM CARD
───────────────────────────────────────────────────────────────────────────── */

function TabItemCard({ item, onOpen, onAdd }: { item: TabItem; onOpen: (i: TabItem) => void; onAdd: () => void }) {
  return (
    <div
      onClick={() => onOpen(item)}
      style={{ position:'relative', overflow:'hidden', cursor:'pointer', border:'1px solid rgba(255,255,255,0.06)', background:'rgba(255,255,255,0.02)', borderRadius:'16px', transition:'border-color 0.3s, transform 0.3s' }}
      onMouseEnter={(e) => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.borderColor=`${item.accentColor}44` }}
      onMouseLeave={(e) => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.06)' }}
    >
      <div style={{ position:'relative', height:'180px', overflow:'hidden' }}>
        <Image src={item.image} alt={item.name} fill style={{ objectFit:'cover' }} />
        <div style={{ position:'absolute', inset:0, background:`linear-gradient(to bottom,transparent 30%,rgba(5,8,4,0.9) 100%)` }} />
        <div style={{ position:'absolute', bottom:'12px', left:'14px' }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', fontWeight:300, color:'var(--cream)', marginBottom:'3px' }}>{item.name}</h3>
          {item.duration && (
            <span style={{ fontFamily:'var(--font-body)', fontSize:'9px', color:'rgba(255,255,255,0.4)' }}>⏱ {item.duration} · 👥 {item.capacity}</span>
          )}
        </div>
      </div>
      <div style={{ padding:'14px 16px 16px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          {item.price ? (
            <span style={{ fontFamily:'var(--font-display)', fontSize:'1.15rem', color:'var(--gold)' }}>KES {item.price.toLocaleString()}</span>
          ) : (
            <span style={{ fontFamily:'var(--font-body)', fontSize:'10px', color:'rgba(255,255,255,0.25)' }}>Included in walks</span>
          )}
          <button onClick={(e) => { e.stopPropagation(); onAdd() }} style={{ padding:'7px 14px', borderRadius:'8px', background:'var(--gold)', color:'var(--obsidian)', fontFamily:'var(--font-body)', fontSize:'8px', letterSpacing:'0.12em', textTransform:'uppercase', cursor:'pointer', fontWeight:600, border:'none' }}>
            + Cart
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   SHARED MODAL ANIMATION STYLES (injected once)
───────────────────────────────────────────────────────────────────────────── */

const MODAL_KEYFRAMES = `
  @keyframes fmOverlayIn   { from { opacity:0 }                                                to { opacity:1 } }
  @keyframes fmShellTiltIn {
    0%   { opacity:0; transform:perspective(1100px) rotateX(7deg) rotateY(-3deg) translateY(36px) scale(0.95); filter:blur(6px) }
    55%  { opacity:1; filter:blur(0) }
    80%  { transform:perspective(1100px) rotateX(-1deg) rotateY(0.5deg) translateY(-3px) scale(1.003) }
    100% { transform:perspective(1100px) rotateX(0) rotateY(0) translateY(0) scale(1); filter:blur(0) }
  }
  @keyframes fmCtaReveal   { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
`

function ModalStyleInjector() {
  const injected = useRef(false)
  useEffect(() => {
    if (injected.current) return
    injected.current = true
    const el = document.createElement('style')
    el.textContent = MODAL_KEYFRAMES
    document.head.appendChild(el)
    return () => el.remove()
  }, [])
  return null
}

/* ─────────────────────────────────────────────────────────────────────────────
   EXPERIENCE MODAL  — cinematic two-panel, tilt entrance
───────────────────────────────────────────────────────────────────────────── */

function ExperienceModal({ item, onClose, isInCart, cartQty, onAdd, onViewCart }: {
  item: ExperienceItem; onClose: () => void
  isInCart: boolean; cartQty: number
  onAdd: (qty: number) => void; onViewCart: () => void
}) {
  const [qty, setQty]                 = useState(1)
  const [addedQty, setAddedQty]       = useState(0)
  const [showCart, setShowCart]       = useState(isInCart)

  useEscapeKey(onClose, true)

  const totalInCart = cartQty + addedQty

  const handleAdd = () => {
    onAdd(qty)
    setAddedQty(q => q + qty)
    setShowCart(true)
  }

  // Responsive: stack on mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <>
      <ModalStyleInjector />
      <div
        onClick={onClose}
        style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(4,6,3,0.9)', backdropFilter:'blur(20px) saturate(1.3)', WebkitBackdropFilter:'blur(20px) saturate(1.3)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', animation:'fmOverlayIn 0.22s ease both' }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position:'relative',
            width:'100%',
            maxWidth:'960px',
            maxHeight:'92vh',
            display:'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            background:'#0c0f09',
            border:'1px solid rgba(212,168,83,0.2)',
            borderRadius:'24px',
            overflow:'hidden',
            boxShadow:'0 0 0 1px rgba(255,255,255,0.04), 0 48px 120px rgba(0,0,0,0.9), 0 0 80px rgba(212,168,83,0.07)',
            animation:'fmShellTiltIn 0.52s cubic-bezier(0.16,1,0.3,1) both',
          }}
        >

          {/* ── IMAGE PANEL ── */}
          <div style={{ position:'relative', minHeight: isMobile ? '300px' : '560px', overflow:'hidden' }}>
            <Image src={item.image} alt={item.name} fill sizes="(max-width:767px) 100vw, 480px" style={{ objectFit:'cover' }} priority />

            {/* Cinematic overlays */}
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,rgba(4,6,3,0.55) 0%,rgba(4,6,3,0.08) 35%,rgba(4,6,3,0.15) 55%,rgba(4,6,3,0.94) 100%)', pointerEvents:'none', zIndex:1 }} />
            <div style={{ position:'absolute', top:0, right:0, width:'1px', height:'100%', background:'linear-gradient(180deg,transparent 0%,rgba(212,168,83,0.3) 30%,rgba(212,168,83,0.3) 70%,transparent 100%)', zIndex:2 }} />

            {/* Close button */}
            <button onClick={onClose} aria-label="Close" style={{ position:'absolute', top:'12px', right:'12px', zIndex:10, width:'44px', height:'44px', borderRadius:'50%', background:'rgba(10,12,8,0.75)', border:'1px solid rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.65)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', backdropFilter:'blur(12px)', transition:'background 0.2s, border-color 0.2s, color 0.2s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background='rgba(212,168,83,0.18)'; (e.currentTarget as HTMLButtonElement).style.borderColor='rgba(212,168,83,0.5)'; (e.currentTarget as HTMLButtonElement).style.color='var(--gold)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background='rgba(10,12,8,0.75)'; (e.currentTarget as HTMLButtonElement).style.borderColor='rgba(255,255,255,0.12)'; (e.currentTarget as HTMLButtonElement).style.color='rgba(255,255,255,0.65)' }}
            >✕</button>

            {/* Badge */}
            {item.badge && (
              <span style={{ position:'absolute', top:'18px', left:'18px', zIndex:4, padding:'4px 14px', borderRadius:'20px', fontFamily:'var(--font-body)', fontSize:'10px', fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:item.badgeColor, borderWidth:'1px', borderStyle:'solid', borderColor:`${item.badgeColor}55`, background:`${item.badgeColor}22`, backdropFilter:'blur(8px)' }}>
                {item.badge}
              </span>
            )}

            {/* In-cart indicator */}
            {(isInCart || addedQty > 0) && (
              <span style={{ position:'absolute', top:'18px', right:'60px', zIndex:4, padding:'4px 14px', borderRadius:'20px', fontFamily:'var(--font-body)', fontSize:'10px', fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--neon)', border:'1px solid rgba(0,255,65,0.35)', background:'rgba(0,255,65,0.1)', backdropFilter:'blur(8px)', animation:'fmCtaReveal 0.28s ease both' }}>
                ✓ {totalInCart} in cart
              </span>
            )}

            {/* Image meta pinned to bottom */}
            <div style={{ position:'absolute', bottom:0, left:0, right:0, zIndex:3, padding:'24px 24px 22px' }}>
              <span style={{ display:'inline-block', fontFamily:'var(--font-body)', fontSize:'10px', fontWeight:600, letterSpacing:'0.28em', textTransform:'uppercase', color:'var(--gold)', opacity:0.8, marginBottom:'8px' }}>{item.category}</span>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.5rem,2.8vw,2.1rem)', fontWeight:300, color:'var(--cream)', lineHeight:1.1, marginBottom:'14px', letterSpacing:'-0.01em' }}>{item.name}</h2>
              <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                {[['⏱', item.duration], ['👥', item.groupSize]].map(([icon, val]) => (
                  <span key={String(val)} style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'5px 12px', borderRadius:'20px', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.14)', backdropFilter:'blur(8px)', fontFamily:'var(--font-body)', fontSize:'11px', letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.88)' }}>
                    <span style={{ opacity:0.6 }}>{icon}</span><span>{val}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── CONTENT PANEL ── */}
          <div style={{ display:'flex', flexDirection:'column', gap:0, padding:'32px 32px 28px', overflowY:'auto', overscrollBehavior:'contain', scrollbarWidth:'thin', scrollbarColor:'rgba(212,168,83,0.2) transparent', background:'#0c0f09' }}>

            {/* Price header */}
            <div style={{ marginBottom:'20px', paddingBottom:'20px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display:'flex', alignItems:'baseline', gap:'6px' }}>
                <span style={{ fontFamily:'var(--font-display)', fontSize:'2rem', fontWeight:300, color:'var(--gold)', letterSpacing:'-0.01em' }}>KES {item.price.toLocaleString()}</span>
                <span style={{ fontFamily:'var(--font-body)', fontSize:'12px', color:'rgba(255,255,255,0.38)', letterSpacing:'0.1em', textTransform:'uppercase' }}>/ person</span>
              </div>
            </div>

            {/* Story quote */}
            <blockquote style={{ fontFamily:'var(--font-display)', fontStyle:'italic', fontSize:'1.05rem', lineHeight:1.75, color:'rgba(255,255,255,0.52)', borderLeft:'2px solid rgba(212,168,83,0.3)', paddingLeft:'16px', margin:'0 0 20px' }}>
              "{item.storyLine}"
            </blockquote>

            {/* Description */}
            <p style={{ fontFamily:'var(--font-body)', fontSize:'0.9375rem', lineHeight:1.85, color:'rgba(255,255,255,0.6)', marginBottom:'22px' }}>{item.description}</p>

            {/* Includes */}
            <div style={{ marginBottom:'22px' }}>
              <div style={{ fontFamily:'var(--font-body)', fontSize:'10px', fontWeight:600, letterSpacing:'0.24em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)', marginBottom:'10px' }}>What's Included</div>
              <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'7px' }}>
                {item.includes.map((inc) => (
                  <li key={inc} style={{ display:'flex', alignItems:'flex-start', gap:'10px', fontFamily:'var(--font-body)', fontSize:'0.9rem', color:'rgba(255,255,255,0.68)', lineHeight:1.6 }}>
                    <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:'16px', height:'16px', borderRadius:'50%', background:'rgba(0,255,65,0.12)', border:'1px solid rgba(0,255,65,0.3)', color:'var(--neon)', fontSize:'9px', flexShrink:0, marginTop:'2px' }}>✓</span>
                    {inc}
                  </li>
                ))}
              </ul>
            </div>

            {/* Highlights */}
            <div style={{ marginBottom:'24px' }}>
              <div style={{ fontFamily:'var(--font-body)', fontSize:'10px', fontWeight:600, letterSpacing:'0.24em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)', marginBottom:'10px' }}>Highlights</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                {item.highlights.map((h) => (
                  <span key={h} style={{ fontFamily:'var(--font-body)', fontSize:'11px', fontWeight:500, letterSpacing:'0.12em', textTransform:'uppercase', padding:'4px 12px', borderRadius:'20px', border:'1px solid rgba(212,168,83,0.18)', background:'rgba(212,168,83,0.06)', color:'rgba(212,168,83,0.72)' }}>{h}</span>
                ))}
              </div>
            </div>

            {/* CTA section */}
            <div style={{ display:'flex', flexDirection:'column', gap:'14px', marginTop:'auto', paddingTop:'20px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>

              {/* Guest qty */}
              <div style={{ display:'flex', alignItems:'center', gap:'14px', padding:'14px 18px', background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'14px' }}>
                <span style={{ fontFamily:'var(--font-body)', fontSize:'11px', fontWeight:600, letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(255,255,255,0.42)', flexShrink:0 }}>Guests</span>
                <div style={{ display:'flex', alignItems:'center', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'10px', overflow:'hidden' }}>
                  {[['−', () => setQty(q => Math.max(1, q - 1))], ['+', () => setQty(q => q + 1)]].map(([label, fn], i) => (
                    i === 0 ? (
                      <button key={String(label)} onClick={fn as () => void} style={{ width:'36px', height:'36px', background:'none', border:'none', color:'rgba(255,255,255,0.55)', fontSize:'18px', fontWeight:300, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'background 0.15s, color 0.15s' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background='rgba(212,168,83,0.1)'; (e.currentTarget as HTMLButtonElement).style.color='var(--gold)' }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background='none'; (e.currentTarget as HTMLButtonElement).style.color='rgba(255,255,255,0.55)' }}>
                        {String(label)}
                      </button>
                    ) : null
                  ))}
                  <span style={{ minWidth:'40px', textAlign:'center', fontFamily:'var(--font-display)', fontSize:'1.25rem', fontWeight:300, color:'var(--cream)', borderLeft:'1px solid rgba(255,255,255,0.07)', borderRight:'1px solid rgba(255,255,255,0.07)', padding:'0 4px', lineHeight:'36px' }}>{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} style={{ width:'36px', height:'36px', background:'none', border:'none', color:'rgba(255,255,255,0.55)', fontSize:'18px', fontWeight:300, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'background 0.15s, color 0.15s' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background='rgba(212,168,83,0.1)'; (e.currentTarget as HTMLButtonElement).style.color='var(--gold)' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background='none'; (e.currentTarget as HTMLButtonElement).style.color='rgba(255,255,255,0.55)' }}>
                    +
                  </button>
                </div>
                <span style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', fontWeight:300, color:'var(--gold)', marginLeft:'auto', letterSpacing:'-0.01em' }}>= KES {(item.price * qty).toLocaleString()}</span>
              </div>

              {/* Add / cart buttons */}
              {showCart ? (
                <div style={{ display:'flex', gap:'10px', animation:'fmCtaReveal 0.3s cubic-bezier(0.16,1,0.3,1) both' }}>
                  <button onClick={handleAdd} style={{ flex:'0 0 auto', padding:'15px 20px', borderRadius:'12px', fontFamily:'var(--font-body)', fontSize:'11px', fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.7)', transition:'all 0.25s', minHeight:'52px' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background='rgba(255,255,255,0.07)'; (e.currentTarget as HTMLButtonElement).style.borderColor='rgba(255,255,255,0.2)'; (e.currentTarget as HTMLButtonElement).style.color='var(--cream)' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background='rgba(255,255,255,0.03)'; (e.currentTarget as HTMLButtonElement).style.borderColor='rgba(255,255,255,0.1)'; (e.currentTarget as HTMLButtonElement).style.color='rgba(255,255,255,0.7)' }}>
                    + Add More
                  </button>
                  <button onClick={onViewCart} style={{ flex:1, padding:'15px 22px', borderRadius:'12px', fontFamily:'var(--font-body)', fontSize:'11px', fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer', background:'linear-gradient(135deg,var(--gold) 0%,#c09a3a 100%)', border:'none', color:'#0a0a0a', boxShadow:'0 4px 24px rgba(212,168,83,0.3)', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', minHeight:'52px', transition:'all 0.25s' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow='0 8px 36px rgba(212,168,83,0.5)'; (e.currentTarget as HTMLButtonElement).style.transform='translateY(-1px)' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow='0 4px 24px rgba(212,168,83,0.3)'; (e.currentTarget as HTMLButtonElement).style.transform='translateY(0)' }}>
                    <span>View Cart</span>
                    <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', minWidth:'22px', height:'22px', padding:'0 6px', borderRadius:'11px', background:'rgba(0,0,0,0.22)', fontSize:'11px', fontWeight:700, letterSpacing:0, lineHeight:1 }}>{totalInCart}</span>
                    <span>→</span>
                  </button>
                </div>
              ) : (
                <button onClick={handleAdd} style={{ width:'100%', padding:'16px 22px', borderRadius:'12px', fontFamily:'var(--font-body)', fontSize:'11px', fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer', background:'linear-gradient(135deg,var(--gold) 0%,#c09a3a 100%)', border:'none', color:'#0a0a0a', boxShadow:'0 4px 24px rgba(212,168,83,0.25)', minHeight:'54px', transition:'all 0.25s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow='0 8px 36px rgba(212,168,83,0.45)'; (e.currentTarget as HTMLButtonElement).style.transform='translateY(-1px)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow='0 4px 24px rgba(212,168,83,0.25)'; (e.currentTarget as HTMLButtonElement).style.transform='translateY(0)' }}>
                  + Add to Cart
                </button>
              )}

              {totalInCart > 0 && (
                <p style={{ fontFamily:'var(--font-body)', fontSize:'11px', color:'rgba(0,255,65,0.45)', textAlign:'center', letterSpacing:'0.1em' }}>
                  {totalInCart} {totalInCart === 1 ? 'guest' : 'guests'} booked for this experience
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   TAB ITEM MODAL  — same two-panel premium layout, accent-coloured
───────────────────────────────────────────────────────────────────────────── */

function TabItemModal({ item, onClose, onAdd, onViewCart }: {
  item: TabItem; onClose: () => void; onAdd: () => void; onViewCart: () => void
}) {
  const [added, setAdded] = useState(false)

  useEscapeKey(onClose, true)

  const handleAdd = () => {
    onAdd()
    setAdded(true)
  }

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  const accentOverlay = `linear-gradient(180deg,rgba(4,6,3,0.5) 0%,rgba(4,6,3,0.05) 30%,${item.accentColor}14 65%,rgba(4,6,3,0.94) 100%)`

  return (
    <>
      <ModalStyleInjector />
      <div
        onClick={onClose}
        style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(4,6,3,0.9)', backdropFilter:'blur(20px) saturate(1.3)', WebkitBackdropFilter:'blur(20px) saturate(1.3)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', animation:'fmOverlayIn 0.22s ease both' }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ position:'relative', width:'100%', maxWidth:'920px', maxHeight:'92vh', display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', background:'#0c0f09', border:`1px solid ${item.accentColor}28`, borderRadius:'24px', overflow:'hidden', boxShadow:`0 0 0 1px rgba(255,255,255,0.04), 0 48px 120px rgba(0,0,0,0.9), 0 0 80px ${item.accentColor}0a`, animation:'fmShellTiltIn 0.52s cubic-bezier(0.16,1,0.3,1) both' }}
        >

          {/* ── IMAGE PANEL ── */}
          <div style={{ position:'relative', minHeight: isMobile ? '280px' : '520px', overflow:'hidden' }}>
            <Image src={item.image} alt={item.name} fill sizes="(max-width:767px) 100vw, 460px" style={{ objectFit:'cover' }} priority />
            <div style={{ position:'absolute', inset:0, background:accentOverlay, pointerEvents:'none', zIndex:1 }} />
            <div style={{ position:'absolute', top:0, right:0, width:'1px', height:'100%', background:`linear-gradient(180deg,transparent 0%,${item.accentColor}40 30%,${item.accentColor}40 70%,transparent 100%)`, zIndex:2 }} />

            {/* Close */}
            <button onClick={onClose} aria-label="Close" style={{ position:'absolute', top:'12px', right:'12px', zIndex:10, width:'44px', height:'44px', borderRadius:'50%', background:'rgba(10,12,8,0.75)', border:'1px solid rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.65)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', backdropFilter:'blur(12px)', transition:'all 0.2s' }}
              onMouseEnter={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.background=`${item.accentColor}22`; b.style.borderColor=`${item.accentColor}66`; b.style.color=item.accentColor }}
              onMouseLeave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.background='rgba(10,12,8,0.75)'; b.style.borderColor='rgba(255,255,255,0.12)'; b.style.color='rgba(255,255,255,0.65)' }}>
              ✕
            </button>

            {/* Tag badge */}
            <span style={{ position:'absolute', top:'18px', left:'18px', zIndex:4, padding:'4px 14px', borderRadius:'20px', fontFamily:'var(--font-body)', fontSize:'10px', fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:item.accentColor, borderWidth:'1px', borderStyle:'solid', borderColor:`${item.accentColor}44`, background:`${item.accentColor}18`, backdropFilter:'blur(8px)' }}>
              {item.tag}
            </span>

            {/* Image meta */}
            <div style={{ position:'absolute', bottom:0, left:0, right:0, zIndex:3, padding:'24px 24px 22px' }}>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.5rem,2.8vw,2.1rem)', fontWeight:300, color:'var(--cream)', lineHeight:1.1, marginBottom:'14px', letterSpacing:'-0.01em' }}>{item.name}</h2>
              {item.duration && (
                <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'5px 12px', borderRadius:'20px', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.14)', backdropFilter:'blur(8px)', fontFamily:'var(--font-body)', fontSize:'11px', letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.88)' }}>
                    <span style={{ opacity:0.6 }}>⏱</span><span>{item.duration}</span>
                  </span>
                  {item.capacity && (
                    <span style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'5px 12px', borderRadius:'20px', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.14)', backdropFilter:'blur(8px)', fontFamily:'var(--font-body)', fontSize:'11px', letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.88)' }}>
                      <span style={{ opacity:0.6 }}>👥</span><span>{item.capacity}</span>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── CONTENT PANEL ── */}
          <div style={{ display:'flex', flexDirection:'column', gap:0, padding:'32px 32px 28px', overflowY:'auto', overscrollBehavior:'contain', background:'#0c0f09' }}>

            {/* Price header */}
            <div style={{ marginBottom:'20px', paddingBottom:'20px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display:'inline-block', fontFamily:'var(--font-body)', fontSize:'10px', fontWeight:600, letterSpacing:'0.28em', textTransform:'uppercase', color:item.accentColor, opacity:0.75, marginBottom:'10px' }}>{item.tag}</div>
              {item.price ? (
                <div style={{ display:'flex', alignItems:'baseline', gap:'6px' }}>
                  <span style={{ fontFamily:'var(--font-display)', fontSize:'2rem', fontWeight:300, color:item.accentColor, letterSpacing:'-0.01em' }}>KES {item.price.toLocaleString()}</span>
                  <span style={{ fontFamily:'var(--font-body)', fontSize:'12px', color:'rgba(255,255,255,0.38)', letterSpacing:'0.1em', textTransform:'uppercase' }}>/ person</span>
                </div>
              ) : (
                <p style={{ fontFamily:'var(--font-body)', fontSize:'13px', color:'rgba(255,255,255,0.35)', letterSpacing:'0.08em' }}>Included in farm walks</p>
              )}
            </div>

            {/* Description */}
            <p style={{ fontFamily:'var(--font-body)', fontSize:'0.9375rem', lineHeight:1.85, color:'rgba(255,255,255,0.62)', marginBottom:'22px' }}>{item.description}</p>

            {/* Highlights */}
            <div style={{ marginBottom:'24px' }}>
              <div style={{ fontFamily:'var(--font-body)', fontSize:'10px', fontWeight:600, letterSpacing:'0.24em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)', marginBottom:'10px' }}>Highlights</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                {item.highlights.map((h) => (
                  <span key={h} style={{ fontFamily:'var(--font-body)', fontSize:'11px', fontWeight:500, letterSpacing:'0.12em', textTransform:'uppercase', padding:'4px 12px', borderRadius:'20px', border:`1px solid ${item.accentColor}28`, background:`${item.accentColor}0e`, color:`${item.accentColor}cc` }}>{h}</span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div style={{ display:'flex', flexDirection:'column', gap:'14px', marginTop:'auto', paddingTop:'20px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
              {item.price ? (
                added ? (
                  <div style={{ display:'flex', gap:'10px', animation:'fmCtaReveal 0.3s cubic-bezier(0.16,1,0.3,1) both' }}>
                    <button onClick={handleAdd} style={{ flex:'0 0 auto', padding:'15px 20px', borderRadius:'12px', fontFamily:'var(--font-body)', fontSize:'11px', fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.7)', minHeight:'52px', transition:'all 0.25s' }}>
                      + Add More
                    </button>
                    <button onClick={onViewCart} style={{ flex:1, padding:'15px 22px', borderRadius:'12px', fontFamily:'var(--font-body)', fontSize:'11px', fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer', background:`linear-gradient(135deg,${item.accentColor} 0%,${item.accentColor}cc 100%)`, border:'none', color:'#0a0a0a', boxShadow:`0 4px 24px ${item.accentColor}35`, display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', minHeight:'52px', transition:'all 0.25s' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow=`0 8px 36px ${item.accentColor}55`; (e.currentTarget as HTMLButtonElement).style.transform='translateY(-1px)' }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow=`0 4px 24px ${item.accentColor}35`; (e.currentTarget as HTMLButtonElement).style.transform='translateY(0)' }}>
                      View Cart →
                    </button>
                  </div>
                ) : (
                  <button onClick={handleAdd} style={{ width:'100%', padding:'16px 22px', borderRadius:'12px', fontFamily:'var(--font-body)', fontSize:'11px', fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer', background:`linear-gradient(135deg,${item.accentColor} 0%,${item.accentColor}cc 100%)`, border:'none', color:'#0a0a0a', boxShadow:`0 4px 24px ${item.accentColor}30`, minHeight:'54px', transition:'all 0.25s' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow=`0 8px 36px ${item.accentColor}50`; (e.currentTarget as HTMLButtonElement).style.transform='translateY(-1px)' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow=`0 4px 24px ${item.accentColor}30`; (e.currentTarget as HTMLButtonElement).style.transform='translateY(0)' }}>
                    + Add to Cart
                  </button>
                )
              ) : (
                <button onClick={onClose} style={{ width:'100%', padding:'15px', borderRadius:'12px', fontFamily:'var(--font-body)', fontSize:'11px', fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.6)', minHeight:'52px' }}>
                  Close
                </button>
              )}
              {added && (
                <p style={{ fontFamily:'var(--font-body)', fontSize:'11px', color:`${item.accentColor}88`, textAlign:'center', letterSpacing:'0.1em', animation:'fmCtaReveal 0.25s ease both' }}>
                  ✓ Added — ready in your cart
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}