// ── SkeletonCard ──────────────────────────────────────────────
// Shimmer loading state shown when FarmERP or WordPress is slow.
// Used in BentoGrid while data is fetching.
// Also shown when kill_switch is active for a service.

interface SkeletonCardProps {
  colSpan?: string       // Tailwind col-span class e.g. "col-span-5"
  height?:  number       // min height in px, default 200
  lastSync?: string      // e.g. "10m ago" — shown when service is degraded
  label?:   string       // e.g. "Farm Log" — shown above shimmer
}

export default function SkeletonCard({
  colSpan  = 'col-span-12',
  height   = 200,
  lastSync,
  label,
}: SkeletonCardProps) {
  return (
    <div
      className={`${colSpan} relative overflow-hidden`}
      style={{
        minHeight:   height,
        borderRadius:'16px',
        border:      '1px solid rgba(255,255,255,0.07)',
        background:  'rgba(255,255,255,0.02)',
      }}
    >
      {/* ── Shimmer layer ── */}
      <div className="skeleton absolute inset-0" />

      {/* ── Corner brackets ── */}
      <span className="corner-tl" />
      <span className="corner-br" />

      {/* ── Content ── */}
      <div className="relative z-10 p-6 flex flex-col justify-between h-full">

        {/* Top row */}
        <div className="flex items-center justify-between">
          {label && (
            <span
              className="font-body text-[9px] tracking-[0.25em] uppercase"
              style={{ color: 'rgba(255,255,255,0.2)' }}
            >
              {label}
            </span>
          )}
          {/* Degraded badge */}
          {lastSync && (
            <span
              className="log-badge"
              style={{
                color:       'var(--gold)',
                background:  'rgba(212,168,83,0.07)',
                borderColor: 'rgba(212,168,83,0.3)',
              }}
            >
              ↻ Last synced {lastSync}
            </span>
          )}
        </div>

        {/* Shimmer title bar */}
        <div className="mt-6 space-y-3">
          <div
            className="skeleton rounded"
            style={{ height: 24, width: '55%' }}
          />
          <div
            className="skeleton rounded"
            style={{ height: 14, width: '75%' }}
          />
          <div
            className="skeleton rounded"
            style={{ height: 14, width: '45%' }}
          />
        </div>

        {/* Shimmer metric */}
        <div className="mt-6">
          <div
            className="skeleton rounded"
            style={{ height: 48, width: '30%' }}
          />
        </div>

      </div>
    </div>
  )
}