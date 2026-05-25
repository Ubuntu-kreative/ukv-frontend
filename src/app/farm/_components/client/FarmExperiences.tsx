'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useCartStore } from '@/context/cartStore'
import toast from 'react-hot-toast'

import {
  EXPERIENCE_ITEMS, TAB_DATA,
  type ExperienceItem, type TabItem, type FarmTab,
} from '../../_data/farm-data'

export default function FarmExperiences() {
  const [activeTab, setActiveTab] = useState<FarmTab>('walks')
  const [modalItem, setModalItem] = useState<ExperienceItem | null>(null)
  const [tabModalItem, setTabModalItem] = useState<TabItem | null>(null)
  
  const { addItem, items, openCart } = useCartStore()
  const farmCount = items.filter((i) => i.category === 'farm').length

  const isInCart = (id: string) => items.some((i) => i.id === id && i.category === 'farm')
  const getQty = (id: string) => items.filter((i) => i.id === id && i.category === 'farm').length

  const addExperience = (exp: ExperienceItem, qty = 1) => {
    for (let i = 0; i < qty; i++) {
      addItem({
        id: exp.id,
        name: exp.name,
        category: 'farm',
        tag: exp.category,
        price: exp.price,
        unit: '/ person',
      })
    }
    toast.success(`${exp.name} added to cart`)
  }

  const addTabItem = (item: TabItem) => {
    addItem({
      id: item.id,
      name: item.name,
      category: 'farm',
      tag: item.tag,
      price: item.price ?? 0,
      unit: '/ person',
    })
    toast.success(`${item.name} added to cart`)
  }

  // Lock body scroll when modal open
  useEffect(() => {
    if (modalItem || tabModalItem) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [modalItem, tabModalItem])

  return (
    <section id="farm-experiences" style={{ padding: '80px 40px 0' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ width: '40px', height: '1px', background: 'var(--neon)', opacity: '0.5', display: 'block' }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>
              Book directly · Instant confirmation
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.05, marginBottom: '8px' }}>
                Walk the land. <em style={{ color: 'var(--gold)', fontStyle: 'normal' }}>Know your food.</em>
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.8, maxWidth: '560px' }}>
                Pick what calls to you. Each experience is self-contained and goes directly into your cart.
              </p>
            </div>
            {farmCount > 0 && (
              <button
                onClick={openCart}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 20px',
                  background: 'rgba(212,168,83,0.08)',
                  border: '1px solid rgba(212,168,83,0.25)',
                  borderRadius: '40px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: '9px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--gold)',
                }}
              >
                <span style={{ width: '20px', height: '20px', background: 'var(--gold)', color: 'var(--obsidian)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700 }}>
                  {farmCount}
                </span>
                View Cart
              </button>
            )}
          </div>
        </div>

        {/* Experience cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', marginBottom: '80px' }}>
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

        {/* Tab section */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <span style={{ width: '40px', height: '1px', background: 'var(--gold)', opacity: '0.4', display: 'block' }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>
              Explore by Category
            </span>
          </div>

          {/* Tab buttons */}
          <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid rgba(255,255,255,0.06)', overflowX: 'auto' }}>
            {(Object.keys(TAB_DATA) as FarmTab[]).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{
                  padding: '14px 24px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: '10px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: activeTab === key ? 'var(--gold)' : 'rgba(255,255,255,0.28)',
                  borderBottom: activeTab === key ? '1.5px solid var(--gold)' : '1.5px solid transparent',
                  marginBottom: '-1px',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                {TAB_DATA[key].label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {TAB_DATA[activeTab].items.map((item) => (
            <TabItemCard
              key={item.id}
              item={item}
              onOpen={setTabModalItem}
              onAdd={() => addTabItem(item)}
            />
          ))}
        </div>
      </div>

      {/* Modals */}
      {modalItem && (
        <ExperienceModal
          item={modalItem}
          onClose={() => setModalItem(null)}
          isInCart={isInCart(modalItem.id)}
          cartQty={getQty(modalItem.id)}
          onAdd={(qty) => addExperience(modalItem, qty)}
          onViewCart={openCart}
        />
      )}
      {tabModalItem && (
        <TabItemModal
          item={tabModalItem}
          onClose={() => setTabModalItem(null)}
          onAdd={() => addTabItem(tabModalItem)}
          onViewCart={openCart}
        />
      )}

      {/* Floating cart */}
      {farmCount > 0 && (
        <button
          onClick={openCart}
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '100px',
            zIndex: 9990,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 22px',
            background: 'linear-gradient(135deg, var(--gold) 0%, #c09a3a 100%)',
            border: 'none',
            borderRadius: '50px',
            boxShadow: '0 8px 32px rgba(212,168,83,0.4)',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            fontSize: '10px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontWeight: 700,
            color: 'var(--obsidian)',
          }}
        >
          <span>🌱 {farmCount} Booked</span>
          <span style={{ height: '16px', width: '1px', background: 'rgba(5,8,4,0.2)' }} />
          <span>View Cart →</span>
        </button>
      )}
    </section>
  )
}

// Simple experience card
function ExperienceCard({ item, onOpenModal, isInCart, onAdd, onViewCart }: {
  item: ExperienceItem
  onOpenModal: (item: ExperienceItem) => void
  isInCart: boolean
  onAdd: () => void
  onViewCart: () => void
}) {
  return (
    <div
      onClick={() => onOpenModal(item)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        background: 'rgba(255,255,255,0.02)',
        border: isInCart ? '1px solid rgba(0,255,65,0.35)' : '1px solid rgba(255,255,255,0.06)',
        borderRadius: '16px',
        transition: 'border-color 0.3s, transform 0.3s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.borderColor = 'rgba(212,168,83,0.4)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = isInCart ? 'rgba(0,255,65,0.35)' : 'rgba(255,255,255,0.06)'
      }}
    >
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
        <Image
          src={item.image}
          alt={item.name}
          fill
          style={{ objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(5,8,4,0.85) 100%)' }} />

        {item.badge && !isInCart && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            padding: '3px 10px',
            borderRadius: '20px',
            background: `${item.badgeColor}22`,
            border: `1px solid ${item.badgeColor}55`,
            color: item.badgeColor,
            fontFamily: 'var(--font-body)',
            fontSize: '9px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}>
            {item.badge}
          </div>
        )}

        <div style={{ position: 'absolute', bottom: '14px', left: '14px', right: '14px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 300, color: 'var(--cream)', marginBottom: '4px' }}>
            {item.name}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>⏱ {item.duration}</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>👥 {item.groupSize}</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 18px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', display: 'block', marginBottom: '2px' }}>
              per person
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 300, color: 'var(--gold)' }}>
              KES {item.price.toLocaleString()}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              isInCart ? onViewCart() : onAdd()
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: '9px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 600,
              background: isInCart ? 'rgba(0,255,65,0.12)' : 'var(--gold)',
              color: isInCart ? 'var(--neon)' : 'var(--obsidian)',
              border: isInCart ? '1px solid rgba(0,255,65,0.35)' : 'none',
            }}
          >
            {isInCart ? 'View Cart' : '+ Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Simple tab item card
function TabItemCard({ item, onOpen, onAdd }: {
  item: TabItem
  onOpen: (item: TabItem) => void
  onAdd: () => void
}) {
  return (
    <div
      onClick={() => onOpen(item)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '16px',
        transition: 'border-color 0.3s, transform 0.3s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.borderColor = `${item.accentColor}44`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
      }}
    >
      <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
        <Image
          src={item.image}
          alt={item.name}
          fill
          style={{ objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(5,8,4,0.9) 100%)' }} />

        <div style={{ position: 'absolute', bottom: '12px', left: '14px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 300, color: 'var(--cream)', marginBottom: '3px' }}>
            {item.name}
          </h3>
          {item.duration && (
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>
              ⏱ {item.duration} · 👥 {item.capacity}
            </span>
          )}
        </div>
      </div>

      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {item.price ? (
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--gold)' }}>
              KES {item.price.toLocaleString()}
            </span>
          ) : (
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>
              Included in walks
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onAdd()
            }}
            style={{
              padding: '7px 14px',
              borderRadius: '8px',
              background: 'var(--gold)',
              color: 'var(--obsidian)',
              fontFamily: 'var(--font-body)',
              fontSize: '8px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontWeight: 600,
              border: 'none',
            }}
          >
            + Cart
          </button>
        </div>
      </div>
    </div>
  )
}

// Simple experience modal
function ExperienceModal({ item, onClose, isInCart, cartQty, onAdd, onViewCart }: {
  item: ExperienceItem
  onClose: () => void
  isInCart: boolean
  cartQty: number
  onAdd: (qty: number) => void
  onViewCart: () => void
}) {
  const [qty, setQty] = useState(1)

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5,8,4,0.92)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '860px',
          background: 'rgba(16,20,12,0.98)',
          border: '1px solid rgba(212,168,83,0.2)',
          borderRadius: '20px',
          overflow: 'hidden',
          maxHeight: '90vh',
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        <div style={{ position: 'relative', minHeight: '480px' }}>
          <Image
            src={item.image}
            alt={item.name}
            fill
            style={{ objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, rgba(16,20,12,0.9) 100%)' }} />

          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', display: 'block', marginBottom: '6px' }}>
              {item.category}
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.25, marginBottom: '4px' }}>
              {item.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300, color: 'var(--gold)' }}>
                KES {item.price.toLocaleString()}
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>
                / person
              </span>
            </div>
          </div>

          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.85 }}>
            {item.description}
          </p>

          <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
                Guests
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{
                    width: '28px',
                    height: '28px',
                    background: 'none',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'var(--cream)',
                    cursor: 'pointer',
                    fontSize: '16px',
                    borderRadius: '4px',
                  }}
                >
                  −
                </button>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--gold)', minWidth: '24px', textAlign: 'center' }}>
                  {qty}
                </span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  style={{
                    width: '28px',
                    height: '28px',
                    background: 'none',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'var(--cream)',
                    cursor: 'pointer',
                    fontSize: '16px',
                    borderRadius: '4px',
                  }}
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={() => onAdd(qty)}
              style={{
                width: '100%',
                padding: '14px 0',
                background: 'linear-gradient(135deg, var(--gold) 0%, #c09a3a 100%)',
                border: 'none',
                borderRadius: '10px',
                color: 'var(--obsidian)',
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Add {qty} to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Simple tab item modal
function TabItemModal({ item, onClose, onAdd, onViewCart }: {
  item: TabItem
  onClose: () => void
  onAdd: () => void
  onViewCart: () => void
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5,8,4,0.92)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '720px',
          background: 'rgba(16,20,12,0.98)',
          border: `1px solid ${item.accentColor}33`,
          borderRadius: '20px',
          overflow: 'hidden',
          maxHeight: '85vh',
        }}
      >
        <div style={{ position: 'relative', height: '280px' }}>
          <Image
            src={item.image}
            alt={item.name}
            fill
            style={{ objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(16,20,12,0.95) 100%)' }} />

          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
            }}
          >
            ✕
          </button>

          <div style={{ position: 'absolute', bottom: '20px', left: '24px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300, color: 'var(--cream)', marginBottom: '4px' }}>
              {item.name}
            </h2>
            {item.price && (
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--gold)' }}>
                KES {item.price.toLocaleString()} <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>/ person</span>
              </span>
            )}
          </div>
        </div>

        <div style={{ padding: '28px 32px 32px' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.85, marginBottom: '20px' }}>
            {item.description}
          </p>

          {item.price ? (
            <button
              onClick={onAdd}
              style={{
                width: '100%',
                padding: '14px 0',
                background: 'linear-gradient(135deg, var(--gold) 0%, #c09a3a 100%)',
                border: 'none',
                borderRadius: '10px',
                color: 'var(--obsidian)',
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              + Add to Cart
            </button>
          ) : (
            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '14px 0',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                color: 'rgba(255,255,255,0.5)',
                fontFamily: 'var(--font-body)',
                fontSize: '10px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
