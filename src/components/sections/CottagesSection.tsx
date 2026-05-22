import { PageHero } from '@/components/ui/PageHero'
import { SectionDivider } from '@/components/ui/SectionDivider'
import { ProductCard } from '@/components/ui/ProductCard'
import { COTTAGES } from '@/lib/data'
import type { Product } from '@/types'

export function CottagesSection() {
  return (
    <div className="animate-fade-up">
      <PageHero
        eyebrow="Pokomo Cottages · 6 Cottages"
        title="Sleep inside the"
        titleGold="living village"
        subtitle="Each cottage is woven into the farm's rhythms — farm-to-pillow, fully off-grid capable, and entirely yours for the duration of your stay."
      />
      <div className="px-8 md:px-10 py-14">
        <SectionDivider label="Select Your Stay" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[rgba(200,168,75,0.1)]">
          {COTTAGES.map((cottage: Product, i: number) => (
            <ProductCard key={cottage.id} product={cottage} delay={i * 60} />
          ))}
        </div>
      </div>
    </div>
  )
}