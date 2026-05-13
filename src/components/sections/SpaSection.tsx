import { PageHero } from '@/components/ui/PageHero'
import { SectionDivider } from '@/components/ui/SectionDivider'
import { ProductCard } from '@/components/ui/ProductCard'
import { SPA_TREATMENTS } from '@/lib/data'

export function SpaSection() {
  return (
    <div className="animate-fade-up">
      <PageHero
        eyebrow="Arohamai Spa · Ancient African Therapies"
        title="Farm-sourced"
        titleGold="ritual healing"
        subtitle="200m from field to treatment room. Every botanical grown, harvested, and applied on-site. Healing that begins in the soil."
      />
      <div className="px-8 md:px-10 py-14">
        <SectionDivider label="Treatments & Rituals" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[rgba(200,168,75,0.1)]">
          {SPA_TREATMENTS.map((item, i) => (
            <ProductCard key={item.id} product={item} delay={i * 60} />
          ))}
        </div>
      </div>
    </div>
  )
}
