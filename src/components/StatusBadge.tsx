type Status = 'live' | 'sync' | 'idle'

interface StatusBadgeProps {
  status: Status
  label?: string
}

const configs = {
  live: {
    defaultLabel: '● Live',
    color:  'var(--neon)',
    bg:     'rgba(0,255,65,0.07)',
    border: 'rgba(0,255,65,0.35)',
  },
  sync: {
    defaultLabel: '↻ Synced',
    color:  'var(--gold)',
    bg:     'rgba(212,168,83,0.07)',
    border: 'rgba(212,168,83,0.35)',
  },
  idle: {
    defaultLabel: '○ Idle',
    color:  'rgba(255,255,255,0.35)',
    bg:     'rgba(255,255,255,0.04)',
    border: 'rgba(255,255,255,0.12)',
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