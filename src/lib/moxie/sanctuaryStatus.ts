// src/lib/moxie/sanctuaryStatus.ts
// ─────────────────────────────────────────────────────────────────────────────
// Ubuntu Kreative Village — Moxie Visual Operating System
// Sanctuary Design Engine — CSS exported as a TypeScript module
//
// Usage:
//   import { sanctuaryStyles } from '@/lib/moxie/sanctuaryStatus'
//
//   // In a Client Component:
//   <style dangerouslySetInnerHTML={{ __html: sanctuaryStyles }} />
//
//   // Or inject once in layout via useEffect:
//   useEffect(() => {
//     const el = document.createElement('style')
//     el.id = 'sanctuary-styles'
//     el.textContent = sanctuaryStyles
//     if (!document.getElementById('sanctuary-styles')) {
//       document.head.appendChild(el)
//     }
//   }, [])
// ─────────────────────────────────────────────────────────────────────────────

export const sanctuaryStyles = `

/* ============================================================
   MOXIE VISUAL OPERATING SYSTEM
   Ubuntu Kreative Village — Sanctuary Design Engine
   ============================================================ */

/* ---------- DESIGN TOKENS ---------- */
:root {
  --gold: #D4AF37;
  --gold-light: #F0D060;
  --gold-dim: rgba(212, 175, 55, 0.18);
  --obsidian: #0A0A0A;
  --obsidian-mid: #111111;
  --obsidian-surface: #161616;
  --obsidian-raised: #1E1E1E;
  --white-whisper: rgba(255, 255, 255, 0.04);
  --white-soft: rgba(255, 255, 255, 0.08);
  --ecology-green: #3D6B4F;
  --ecology-light: #5A9E72;
  --sanctuary-blue: #1A2E40;
  --glow-gold: 0 0 60px rgba(212, 175, 55, 0.2);
  --glow-gold-strong: 0 0 100px rgba(212, 175, 55, 0.35);
  --glow-green: 0 0 60px rgba(61, 107, 79, 0.3);
  --font-display: 'Cormorant Garamond', 'Playfair Display', Georgia, serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
  --font-body: 'Instrument Sans', 'DM Sans', system-ui, sans-serif;
}

/* ---------- GLOBAL MOXIE BASE ---------- */
.moxie-page {
  background-color: var(--obsidian);
  color: #ffffff;
  font-family: var(--font-body);
  overflow-x: hidden;
}

/* ---------- HERO SECTION ---------- */
.moxie-hero {
  background: var(--obsidian);
}

.moxie-hero-title {
  font-family: var(--font-display);
  background: linear-gradient(
    160deg,
    #ffffff 30%,
    var(--gold-light) 60%,
    var(--gold) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

/* ---------- ATMOSPHERIC BACKGROUNDS ---------- */
.bg-obsidian { background-color: var(--obsidian); }

.bg-gradient-radial-hero {
  background:
    radial-gradient(
      ellipse 80% 60% at 50% 0%,
      rgba(212, 175, 55, 0.06) 0%,
      transparent 60%
    ),
    radial-gradient(
      ellipse 60% 80% at 20% 100%,
      rgba(61, 107, 79, 0.07) 0%,
      transparent 60%
    ),
    linear-gradient(
      to bottom,
      #0A0A0A 0%,
      #0D0D0D 50%,
      #0A0A0A 100%
    );
}

/* ---------- NOISE + GRID OVERLAYS ---------- */
.moxie-noise-overlay {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 128px 128px;
  pointer-events: none;
}

.moxie-grid-overlay {
  background-image:
    linear-gradient(rgba(212, 175, 55, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(212, 175, 55, 0.04) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
}

/* ---------- TELEMETRY BADGE ---------- */
.moxie-telemetry-badge {
  font-family: var(--font-mono);
}

/* ---------- CTA BUTTON ---------- */
.moxie-cta-primary {
  background-color: var(--gold);
  color: var(--obsidian);
}

/* ---------- GLASS PANELS ---------- */
.moxie-glass {
  background: rgba(255, 255, 255, 0.025);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
}

.moxie-glass-gold {
  background: rgba(212, 175, 55, 0.04);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(212, 175, 55, 0.12);
  border-radius: 16px;
}

/* ---------- GLOW CARDS ---------- */
.moxie-glow-card {
  position: relative;
  background: var(--obsidian-surface);
  border: 1px solid rgba(212, 175, 55, 0.08);
  border-radius: 20px;
  transition: border-color 0.4s ease, box-shadow 0.4s ease;
}

.moxie-glow-card:hover {
  border-color: rgba(212, 175, 55, 0.25);
  box-shadow: var(--glow-gold);
}

/* ---------- TELEMETRY INDICATOR ---------- */
.moxie-telemetry-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4ADE80;
  animation: moxie-pulse 2.5s ease-in-out infinite;
}

.moxie-telemetry-dot--warning {
  background: #FBBF24;
}

.moxie-telemetry-dot--offline {
  background: #F87171;
  animation: none;
}

@keyframes moxie-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(0.85); }
}

/* ---------- SECTION TITLES ---------- */
.moxie-section-label {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(212, 175, 55, 0.5);
}

.moxie-section-title {
  font-family: var(--font-display);
  font-weight: 300;
  line-height: 1.1;
  color: #ffffff;
}

.moxie-section-divider {
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    rgba(212, 175, 55, 0.35),
    transparent
  );
  border: none;
  margin: 0;
}

/* ---------- PROGRESS / BARS ---------- */
.moxie-bar-track {
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 2px;
  overflow: hidden;
}

.moxie-bar-fill {
  height: 100%;
  background: linear-gradient(to right, var(--ecology-green), var(--gold));
  border-radius: 2px;
  transition: width 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

/* ---------- SANCTUARY STATUS PANEL ---------- */
.sanctuary-status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.sanctuary-metric-card {
  background: var(--obsidian-surface);
  border: 1px solid rgba(212, 175, 55, 0.07);
  border-radius: 14px;
  padding: 20px;
  transition: border-color 0.3s ease;
}

.sanctuary-metric-card:hover {
  border-color: rgba(212, 175, 55, 0.2);
}

.sanctuary-metric-value {
  font-family: var(--font-mono);
  font-size: 1.6rem;
  font-weight: 300;
  color: var(--gold);
  line-height: 1;
}

.sanctuary-metric-label {
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.3);
  margin-top: 6px;
  font-family: var(--font-mono);
}

/* ---------- DAILY RHYTHM ---------- */
.rhythm-timeline {
  position: relative;
  padding-left: 24px;
}

.rhythm-timeline::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 8px;
  bottom: 8px;
  width: 1px;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(212, 175, 55, 0.3) 20%,
    rgba(212, 175, 55, 0.3) 80%,
    transparent
  );
}

.rhythm-item {
  position: relative;
  padding: 12px 0 12px 20px;
  cursor: pointer;
}

.rhythm-item::before {
  content: '';
  position: absolute;
  left: -17px;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(212, 175, 55, 0.3);
  border: 1px solid rgba(212, 175, 55, 0.5);
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.rhythm-item:hover::before,
.rhythm-item--active::before {
  background: var(--gold);
  box-shadow: 0 0 12px rgba(212, 175, 55, 0.5);
}

/* ---------- AMBIENT GLOW SYSTEM ---------- */
.moxie-glow-subtle {
  box-shadow: 0 0 40px rgba(212, 175, 55, 0.08);
}

.moxie-glow-medium {
  box-shadow: var(--glow-gold);
}

.moxie-glow-strong {
  box-shadow: var(--glow-gold-strong);
}

/* ---------- SCROLLBAR ---------- */
.moxie-page ::-webkit-scrollbar {
  width: 4px;
  background: var(--obsidian);
}

.moxie-page ::-webkit-scrollbar-thumb {
  background: rgba(212, 175, 55, 0.2);
  border-radius: 4px;
}

.moxie-page ::-webkit-scrollbar-thumb:hover {
  background: rgba(212, 175, 55, 0.4);
}

/* ---------- TYPOGRAPHY UTILITIES ---------- */
.font-display  { font-family: var(--font-display); }
.font-mono     { font-family: var(--font-mono); }
.text-gold     { color: var(--gold); }
.text-gold-dim { color: rgba(212, 175, 55, 0.5); }
.border-gold   { border-color: var(--gold); }
.bg-gold       { background-color: var(--gold); }
.text-obsidian { color: var(--obsidian); }

/* ---------- CHAT COMPONENT ---------- */
.moxie-chat-bubble {
  background: var(--obsidian-raised);
  border: 1px solid rgba(212, 175, 55, 0.08);
  border-radius: 18px 18px 18px 4px;
  padding: 16px 20px;
  max-width: 85%;
}

.moxie-chat-bubble--user {
  background: rgba(212, 175, 55, 0.07);
  border-color: rgba(212, 175, 55, 0.15);
  border-radius: 18px 18px 4px 18px;
}

/* ---------- RESPONSIVE ---------- */
@media (max-width: 640px) {
  .moxie-hero-title {
    font-size: clamp(3rem, 18vw, 5rem);
  }

  .sanctuary-status-grid {
    grid-template-columns: 1fr 1fr;
  }
}

`

// ─────────────────────────────────────────────────────────────────────────────
// Sanctuary Status Data Types
// Used by the admin dashboard and Moxie telemetry panel
// ─────────────────────────────────────────────────────────────────────────────

export type TelemetryStatus = 'live' | 'synced' | 'warning' | 'offline'

export interface SanctuaryMetric {
  id:       string
  label:    string
  value:    string | number
  unit?:    string
  status:   TelemetryStatus
  trend?:   'up' | 'down' | 'stable'
  detail?:  string
}

export interface SanctuaryStatusPayload {
  farm:       SanctuaryMetric[]
  restaurant: SanctuaryMetric[]
  spa:        SanctuaryMetric[]
  rooms:      SanctuaryMetric[]
  events:     SanctuaryMetric[]
  lastSync:   string  // ISO timestamp
}

// ─────────────────────────────────────────────────────────────────────────────
// Default telemetry snapshot
// Replace with live Supabase reads in production
// ─────────────────────────────────────────────────────────────────────────────

export const defaultSanctuaryStatus: SanctuaryStatusPayload = {
  farm: [
    { id: 'animals',   label: 'Animals tracked',    value: 24,       unit: 'live',    status: 'live',   trend: 'stable' },
    { id: 'soil',      label: 'Soil moisture',       value: '68%',                     status: 'live',   detail: 'Field A — optimal' },
    { id: 'harvest',   label: 'Next harvest',        value: 'Kale',   unit: '3 days',  status: 'synced', trend: 'stable' },
    { id: 'apiary',    label: 'Apiary',              value: 'Active',                  status: 'live',   detail: 'Extraction due' },
  ],
  restaurant: [
    { id: 'covers',    label: 'Covers tonight',      value: 8,        unit: 'tables',  status: 'live' },
    { id: 'special',   label: "Tonight's special",   value: 'Boma goat stew',          status: 'live',   detail: 'Animal #UKV-047' },
    { id: 'kitchen',   label: 'Kitchen status',      value: 'Open',                    status: 'live',   detail: 'Opens 7:00 PM' },
  ],
  spa: [
    { id: 'slots',     label: 'Slots open today',    value: 3,        unit: 'rituals', status: 'live' },
    { id: 'mud',       label: 'Volcanic Mud Ritual',  value: '2:00 PM',                status: 'live',   detail: '1 slot remaining' },
    { id: 'forest',    label: 'Forest Massage',       value: '4:00 PM',                status: 'live',   detail: '1 slot remaining' },
    { id: 'couples',   label: 'Couples Ritual',       value: 'Saturday',               status: 'synced' },
  ],
  rooms: [
    { id: 'available', label: 'Sanctuaries available', value: 6,      unit: 'rooms',   status: 'synced' },
    { id: 'checkins',  label: 'Check-ins today',       value: 2,                       status: 'live' },
    { id: 'checkouts', label: 'Check-outs today',      value: 1,                       status: 'live' },
  ],
  events: [
    { id: 'upcoming',  label: 'Events this month',   value: 4,                         status: 'synced' },
    { id: 'next',      label: 'Next event',          value: 'Fire Dinner',             status: 'synced', detail: 'Last Saturday monthly' },
    { id: 'moon',      label: 'New Moon Circle',     value: 'Monthly',                 status: 'synced' },
  ],
  lastSync: new Date().toISOString(),
}

// ─────────────────────────────────────────────────────────────────────────────
// CSS Injector Component helper string
// Use this to render the styles once in a Client Component or layout
// ─────────────────────────────────────────────────────────────────────────────

export function getSanctuaryStyleTag(): string {
  return `<style id="sanctuary-design-system">${sanctuaryStyles}</style>`
}