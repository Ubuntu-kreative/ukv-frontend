type Status = 'live' | 'sync' | 'idle'

interface StatusBadgeProps {
  status: Status
  label?: string
}

const configs = {
  live: {
    defaultLabel: '● Live',
    color:  'var(--neon)',
    bg:     'rgba(0,255,65,0.12)',
    border: 'rgba(0,255,65,0.45)',
  },
  sync: {
    defaultLabel: '↻ Synced',
    color:  'var(--gold)',
    bg:     'rgba(212,168,83,0.12)',
    border: 'rgba(212,168,83,0.45)',
  },
  idle: {
    defaultLabel: '○ Idle',
    color:  'rgba(255,255,255,0.72)',
    bg:     'rgba(255,255,255,0.08)',
    border: 'rgba(255,255,255,0.25)',
  },
} satisfies Record<Status, { defaultLabel: string; color: string; bg: string; border: string }>

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const c = configs[status]

  return (
    <span
      className="log-badge"
      style={{
        color:       c.color,
        background:  c.bg,
        borderColor: c.border,
      }}
    >
      {label ?? c.defaultLabel}
    </span>
  )
}