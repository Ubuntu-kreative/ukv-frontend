interface PageHeroProps {
  eyebrow: string
  title: string
  titleGold?: string
  subtitle: string
}

export function PageHero({ eyebrow, title, titleGold, subtitle }: PageHeroProps) {
  return (
    <div
      className="px-8 md:px-10 py-16 md:py-20 animate-fade-up"
      style={{ borderBottom: '0.5px solid rgba(237,230,211,0.07)' }}
    >
      <p
        className="text-[9px] tracking-[0.28em] uppercase mb-5"
        style={{ color: 'var(--gold)', fontFamily: 'var(--font-body)' }}
      >
        {eyebrow}
      </p>
      <h1
        className="text-[48px] md:text-[60px] font-light leading-[1.06] mb-4"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--cream)' }}
      >
        {title}
        {titleGold && (
          <>
            <br />
            <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>{titleGold}</em>
          </>
        )}
      </h1>
      <p
        className="text-[14px] leading-[1.8] max-w-[520px]"
        style={{ color: 'var(--muted)', fontFamily: 'var(--font-body)' }}
      >
        {subtitle}
      </p>
    </div>
  )
}
