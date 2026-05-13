import { PageHero } from '@/components/ui/PageHero'
import { SectionDivider } from '@/components/ui/SectionDivider'
import { ProductCard } from '@/components/ui/ProductCard'
import { DINING } from '@/lib/data'

export function RestaurantSection() {
  return (
    <div className="animate-fade-up">
      <PageHero
        eyebrow="Farm-to-Fork · Live Provenance Dining"
        title="Every dish traces back"
        titleGold="to one field"
        subtitle="Our kitchen is the farm. Book a table, a private dinner, a sunrise forager's walk — or all three. Every plate tells you exactly where it came from."
      />
      <div className="px-8 md:px-10 py-14">
        <SectionDivider label="Dining Experiences" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[rgba(200,168,75,0.1)]">
          {DINING.map((item, i) => (
            <ProductCard key={item.id} product={item} delay={i * 60} />
          ))}
        </div>
      </div>
    </div>
  )
}
