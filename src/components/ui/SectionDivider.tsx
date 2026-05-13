interface SectionDividerProps {
  label: string
}

export function SectionDivider({ label }: SectionDividerProps) {
  return (
    <div className="section-divider mb-9">
      <span
        className="text-[9px] tracking-[0.22em] uppercase"
        style={{ color: 'var(--gold)', fontFamily: 'var(--font-body)' }}
      >
        {label}
      </span>
    </div>
  )
}
