"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// ── Types ──────────────────────────────────────────────────────────────────────
export interface JourneyItem {
  id: string;
  name: string;
  sub: string;
  price: number;
  icon: string;
}

interface MegaCol { title: string; items: string[]; }
interface SectionData {
  section: string; page: string;
  cols: MegaCol[]; quick: string[];
}

// ── Data ───────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Our Cottages", href: "/cottages",   key: "cottages"   },
  { label: "Restaurant",   href: "/restaurant", key: "restaurant" },
  { label: "Spa",          href: "/spa",        key: "spa"        },
  { label: "Farm",         href: "/farm",       key: "farm"       },
  { label: "Events",       href: "/events",     key: "events"     },
  { label: "Gallery",      href: "/gallery",    key: "gallery"    },
];

const MEGA: Record<string, SectionData> = {
  cottages: {
    section: "STAY", page: "Pokomo Cottages & The Farmhouse",
    cols: [
      { title: "Cottages",  items: ["Pokomo Cottage", "The Farmhouse", "Family Suite"] },
      { title: "Rates",     items: ["Availability", "Weekend Packages", "Long Stay"] },
      { title: "Includes",  items: ["Farm Breakfast", "Village Access", "Wi-Fi & More"] },
      { title: "Book",      items: ["Reserve Now →", "Enquire First", "Gift a Stay"] },
    ],
    quick: ["Pokomo Cottages", "The Farmhouse", "Rates & Availability", "Book Now"],
  },
  restaurant: {
    section: "DINING", page: "Farm-to-Fork Dining Experience",
    cols: [
      { title: "Meals",      items: ["Farm Breakfast", "Lunch on the Lawn", "Sundowner Dinner"] },
      { title: "Specials",   items: ["Full Moon Dinner", "Private Dining", "Chef's Table"] },
      { title: "Philosophy", items: ["Farm-to-Fork", "Seasonal Menu", "Zero Waste"] },
      { title: "Reserve",    items: ["Book a Table →", "Private Dinner", "Enquire"] },
    ],
    quick: ["Today's Menu", "Private Dining", "Farm-to-Fork", "Book a Table"],
  },
  spa: {
    section: "WELLNESS", page: "Arohamai Spa & Healing Rituals",
    cols: [
      { title: "Rituals",  items: ["Body Rituals", "Forest Therapy", "Sound Healing"] },
      { title: "Packages", items: ["Couples Escape", "Day Retreat", "Full Moon Soak"] },
      { title: "Wellness", items: ["Yoga at Dawn", "Meditation", "Breathwork"] },
      { title: "Book",     items: ["Reserve Session →", "Couples Package", "Gift Ritual"] },
    ],
    quick: ["Arohamai Spa", "Body Rituals", "Couples Escape", "Book Session"],
  },
  farm: {
    section: "FARM", page: "Living Farm & Harvest Experiences",
    cols: [
      { title: "Experiences", items: ["Dawn Farm Walk", "Apiary Tour", "Harvest Day"] },
      { title: "Learn",       items: ["Beekeeping", "Composting", "Seed Saving"] },
      { title: "Taste",       items: ["Farm Breakfast", "Honey Tasting", "Cook with Us"] },
      { title: "Visit",       items: ["Book Farm Walk →", "School Groups", "Private Tour"] },
    ],
    quick: ["Living Farm", "Farm Walk", "Apiary", "Harvest Experience"],
  },
  events: {
    section: "EVENTS", page: "Private & Village Gatherings",
    cols: [
      { title: "Celebrate", items: ["Weddings", "Anniversaries", "Birthdays"] },
      { title: "Corporate", items: ["Team Retreats", "Strategy Days", "Workshops"] },
      { title: "Village",   items: ["Full Moon Dinner", "Seasonal Festival", "Art Night"] },
      { title: "Plan",      items: ["Enquire Now →", "View Calendar", "Download Deck"] },
    ],
    quick: ["Upcoming Events", "Weddings", "Corporate Retreats", "Private Hire"],
  },
  gallery: {
    section: "GALLERY", page: "Visual Stories from the Village",
    cols: [
      { title: "Photos",  items: ["The Lodge", "Farm Life", "Spa & Wellness"] },
      { title: "Stories", items: ["Guest Journals", "Harvest Diary", "Event Moments"] },
      { title: "Media",   items: ["Press Kit", "Virtual Tour", "Brand Assets"] },
      { title: "Share",   items: ["Instagram →", "Download Photos", "Contact Press"] },
    ],
    quick: ["Photos", "Videos", "Virtual Tour", "Press Kit"],
  },
};

// ── Props ─────────────────────────────────────────────────────────────────────
interface UbuntuNavProps {
  journeyItems?: JourneyItem[];
  onRemoveItem?: (id: string) => void;
  harvestCount?: number;
  readyCrops?: string[];
  availability?: { cottages: number; spa: number };
  suggestion?: { title: string; description: string } | null;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function UbuntuNav({
  journeyItems = [],
  onRemoveItem,
  harvestCount = 18,
  readyCrops = [],
  availability = { cottages: 2, spa: 5 },
  suggestion = null,
}: UbuntuNavProps) {
  const pathname   = usePathname();
  const router     = useRouter();
  const navRef     = useRef<HTMLElement>(null);
  const journeyRef = useRef<HTMLDivElement>(null);

  const [scrolled,      setScrolled]      = useState(false);
  const [journeyOpen,   setJourneyOpen]   = useState(false);
  const [megaOpen,      setMegaOpen]      = useState(false);
  const [megaKey,       setMegaKey]       = useState("cottages");
  const [modalOpen,     setModalOpen]     = useState(false);
  const [frameLoaded,   setFrameLoaded]   = useState(false);
  const [iconBounce,    setIconBounce]    = useState(false);

  const activeLink = NAV_LINKS.find((l) => pathname.startsWith(l.href));
  const activeKey  = activeLink?.key ?? "cottages";
  const sectionData = MEGA[megaKey] ?? MEGA[activeKey];
  const total = journeyItems.reduce((s, i) => s + i.price, 0);

  // Scroll compression
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modalOpen]);

  // Close journey on outside click
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (journeyOpen && journeyRef.current && !journeyRef.current.contains(e.target as Node)) {
        setJourneyOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && journeyOpen) {
        setJourneyOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [journeyOpen]);

  const openReserve = useCallback(() => {
    setJourneyOpen(false);
    setMegaOpen(false);
    setFrameLoaded(true);
    setModalOpen(true);
  }, []);

  const handleMegaItemClick = useCallback((item: string, sectionKey: string) => {
    setMegaOpen(false);
    
    // Items with arrows open reserve modal
    if (item.endsWith("→")) {
      openReserve();
      return;
    }

    // Navigation based on section and item
    switch (sectionKey) {
      case 'cottages':
        // Navigate to cottages page and scroll to relevant section
        router.push('/cottages');
        break;
      case 'restaurant':
        router.push('/restaurant');
        break;
      case 'spa':
        router.push('/spa');
        break;
      case 'farm':
        router.push('/farm');
        break;
      case 'events':
        router.push('/events');
        break;
      case 'gallery':
        router.push('/gallery');
        break;
      default:
        router.push('/');
    }
  }, [router, openReserve]);

  function handleJourneyClick() {
    setIconBounce(true);
    setTimeout(() => setIconBounce(false), 550);
    setJourneyOpen((o) => !o);
  }

  const piData = MEGA[activeKey];

  return (
    <>
      <style>{CSS}</style>

      <header className="ukv-nav">

        {/* ── Ribbon ── */}
        <div className="ukv-ribbon">
          <div className="ukv-ribbon-left">
            <span className="ukv-pill">
              <span className="ukv-rdot" /> Village Open
            </span>
            <span className="ukv-rdiv">·</span>
            <span className="ukv-rq">"I am because we are" — Ubuntu</span>
          </div>
          <span className="ukv-pill">Kenya · Eco Lodge · Est. 2024</span>
          <div className="ukv-shim" />
        </div>

        {/* ── Main row ── */}
        <div className={`ukv-main${scrolled ? " ukv-main--scrolled" : ""}`}>

          {/* Logo */}
          <Link href="/" className="ukv-logo">
            <img 
              src="/branding/ubuntu-mark2.png" 
              alt="Ubuntu Kreative Village Logo"
              className="ukv-logo-img"
              style={{ 
                height: scrolled ? "32px" : "40px",
                width: "auto",
                transition: "height 0.4s ease"
              }}
            />
            <div className="ukv-lt">
              <span className={`ukv-ln${scrolled ? " ukv-ln--scrolled" : ""}`}>Ubuntu</span>
              <span className="ukv-ls">Kreative Village · Kenya</span>
            </div>
          </Link>

          <div className="ukv-vsep" />

          {/* Village metric */}
          <div className="ukv-metric">
            <span className="ukv-metric-label">Today's Harvest</span>
            <span className="ukv-metric-val">
              {harvestCount} Ready
              {readyCrops.length > 0 && (
                <span className="ukv-metric-detail">
                  ({readyCrops.slice(0, 2).join(', ')})
                </span>
              )}
            </span>
          </div>

          <div className="ukv-vsep" />

          {/* Status */}
          <div className="ukv-status">
            <span className="ukv-sdot" />
            <span className="ukv-slabel">Guests Welcome</span>
          </div>

          <div className="ukv-vsep" />

          {/* Nav + mega */}
          <nav
            ref={navRef}
            className="ukv-nav-links"
            onMouseLeave={() => setMegaOpen(false)}
          >
            {NAV_LINKS.map(({ label, href, key }) => (
              <Link
                key={href}
                href={href}
                className={`ukv-nl${pathname.startsWith(href) ? " ukv-nl--act" : ""}`}
                onMouseEnter={() => { setMegaKey(key); setMegaOpen(true); }}
              >
                {label}
              </Link>
            ))}

            {/* Mega menu */}
            <div className={`ukv-mega-wrap${megaOpen ? " ukv-mega-wrap--open" : ""}`}>
              <div className="ukv-mega-arrow" />
              <div className="ukv-mega">
                {sectionData.cols.map((col) => (
                  <div key={col.title}>
                    <div className="ukv-mega-col-title">
                      {col.title}
                      {col.title === "Cottages" && availability.cottages > 0 && (
                        <span className="ukv-availability ukv-availability--good">
                          {availability.cottages} available tonight
                        </span>
                      )}
                      {col.title === "Rituals" && availability.spa > 0 && (
                        <span className="ukv-availability ukv-availability--good">
                          {availability.spa} sessions today
                        </span>
                      )}
                    </div>
                    {col.items.map((item) => (
                      <button
                        key={item}
                        className={`ukv-mega-item${item.endsWith("→") ? " ukv-mega-item--featured" : ""}`}
                        onClick={() => handleMegaItemClick(item, megaKey)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </nav>

          <div className="ukv-vsep" />

          {/* Actions */}
          <div className="ukv-actions">

            {/* My Journey */}
            <div className="ukv-jw" ref={journeyRef}>
              <button
                className="ukv-jbtn"
                onClick={handleJourneyClick}
                onMouseEnter={() => setIconBounce(true)}
                onMouseLeave={() => setIconBounce(false)}
                aria-label="My Journey"
                aria-expanded={journeyOpen}
              >
                <JourneyIcon bounce={iconBounce} />
                <span>My Journey</span>
                <span className="ukv-jbadge">{journeyItems.length}</span>
              </button>

              <div className={`ukv-jp${journeyOpen ? " ukv-jp--open" : ""}`} onClick={(e) => e.stopPropagation()}>
                <div className="ukv-jp-h">
                  <div>
                    <div className="ukv-jp-title">My Journey</div>
                    <div className="ukv-jp-sub">Your experience plan</div>
                  </div>
                  <button className="ukv-jp-x" onClick={(e) => { e.stopPropagation(); setJourneyOpen(false); }}>✕</button>
                </div>

                <div className="ukv-jp-items">
                  {journeyItems.length === 0 && (
                    <p className="ukv-jp-empty">Your journey awaits…</p>
                  )}
                  {suggestion && journeyItems.length > 0 && (
                    <div className="ukv-jp-suggestion">
                      <div className="ukv-jp-suggestion-title">✨ {suggestion.title}</div>
                      <div className="ukv-jp-suggestion-desc">{suggestion.description}</div>
                    </div>
                  )}
                  {journeyItems.map((item) => (
                    <div key={item.id} className="ukv-jp-item">
                      <div className="ukv-jp-icon">{item.icon}</div>
                      <div className="ukv-jp-info">
                        <div className="ukv-jp-iname">{item.name}</div>
                        <div className="ukv-jp-isub">{item.sub}</div>
                      </div>
                      <div className="ukv-jp-iprice">KES {item.price.toLocaleString()}</div>
                      {onRemoveItem && (
                        <button
                          className="ukv-jp-irm"
                          onClick={() => onRemoveItem(item.id)}
                          aria-label={`Remove ${item.name}`}
                        >✕</button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="ukv-jp-div" />

                <div className="ukv-jp-foot">
                  <div className="ukv-jp-tot">
                    <span className="ukv-jp-tl">Journey Total</span>
                    <span className="ukv-jp-tv">KES {total.toLocaleString()}</span>
                  </div>
                  <button className="ukv-jp-go" onClick={openReserve}>
                    Plan Your Stay →
                  </button>
                </div>
              </div>
            </div>

            {/* Reserve → /contact */}
            <Link
              href="/contact"
              className={`ukv-rbtn${scrolled ? " ukv-rbtn--sm" : ""}`}
            >
              <CalendarIcon />
              Reserve
            </Link>
          </div>
        </div>

        {/* ── Page indicator sub bar ── */}
        <div className="ukv-sub">
          <div className="ukv-pi">
            <span className="ukv-pi-section">{piData.section}</span>
            <span className="ukv-pi-sep">·</span>
            <span className="ukv-pi-page">{piData.page}</span>
          </div>
          <div className="ukv-qi">
            {piData.quick.map((q) => (
              <Link key={q} href={activeLink?.href ?? "/"} className="ukv-qib">{q}</Link>
            ))}
          </div>
        </div>
      </header>

      {/* ── Reserve modal (embeds /contact calendar page) ── */}
      {modalOpen && (
        <div
          className="ukv-modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div className="ukv-modal">
            <div className="ukv-modal-head">
              <div>
                <div className="ukv-modal-title">Plan Your Ubuntu Experience</div>
                <div className="ukv-modal-sub">Village Calendar · Reservations · Enquiries</div>
              </div>
              <button className="ukv-modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <div className="ukv-modal-body">
              {frameLoaded && (
                <iframe
                  src="https://www.ubuntuecolodge.com/contact"
                  title="Ubuntu Kreative Village — Contact & Calendar"
                  allow="payment"
                  style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                />
              )}
            </div>
            <div className="ukv-modal-foot">
              <span className="ukv-modal-note">
                Secure booking · M-Pesa accepted · &lt;24h response
              </span>
              <a
                href="https://www.ubuntuecolodge.com/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="ukv-modal-open"
              >
                Open full page ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── SVG icons ─────────────────────────────────────────────────────────────────
function JourneyIcon({ bounce }: { bounce: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ animation: bounce ? "ukv-bounce .55s ease" : "none" }}
      aria-hidden="true">
      <path d="M3 12h18M3 6h18M3 18h18"/>
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --ukv-charcoal: #101511;
    --ukv-forest:   #172018;
    --ukv-moss:     #263027;
    --ukv-sage:     #7A9672;
    --ukv-gold:     #C4A45A;
    --ukv-bronze:   #9E7B3F;
    --ukv-ivory:    #F5F0E8;
    --ukv-clay:     #A67C52;
    --ukv-glass:    rgba(15,18,14,.94);
  }

  @keyframes ukv-pulse  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.55)} }
  @keyframes ukv-shim   { 0%{left:-35%} 100%{left:110%} }
  @keyframes ukv-bounce { 0%,100%{transform:translateY(0)} 25%{transform:translateY(-5px)} 55%{transform:translateY(-2px)} 75%{transform:translateY(-3.5px)} }
  @keyframes ukv-megaIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ukv-slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

  @media (max-width: 768px) {
    .ukv-ribbon { display:none }
    .ukv-main { padding:10px 16px }
    .ukv-main--scrolled { padding:6px 16px }
    .ukv-logo { display:none }
    .ukv-logo svg { display:none }
    .ukv-lt { border-left:none;padding-left:0 }
    .ukv-ln { font-size:22px }
    .ukv-ln--scrolled { font-size:18px }
    .ukv-ls { font-size:7px }
    .ukv-vsep { display:none }
    .ukv-metric { display:none }
    .ukv-status { display:none }
    .ukv-nav-links { gap:8px }
    .ukv-nl { font-size:9px;padding:4px 8px }
    .ukv-mega-wrap { position:fixed;inset:0;transform:none;left:0;top:auto;bottom:0;background:rgba(18,23,17,.98);opacity:0;pointer-events:none;transition:opacity .3s }
    .ukv-mega-wrap--open { opacity:1;pointer-events:auto;animation:ukv-slideUp .3s ease }
    .ukv-mega-arrow { display:none }
    .ukv-mega { display:flex;flex-direction:column;min-width:100%;height:100%;border-radius:0;padding:20px;gap:24px }
    .ukv-mega-col-title { font-size:8.5px }
    .ukv-mega-item { font-size:12px;padding:8px 0 }
    .ukv-actions { gap:6px }
    .ukv-jp { position:fixed;inset:0;inset:0;background:rgba(16,21,17,.98);border-radius:0;max-width:none;width:100%;height:100%;transform:none;opacity:0;pointer-events:none;transition:opacity .3s }
    .ukv-jp--open { opacity:1;pointer-events:auto;animation:ukv-slideUp .3s ease }
    .ukv-jp-h { padding:16px 20px }
    .ukv-jp-title { font-size:18px }
    .ukv-jp-sub { font-size:8px }
    .ukv-jp-items { padding:16px 20px;gap:16px }
    .ukv-jp-item { gap:12px }
    .ukv-jp-icon { width:36px;height:36px;font-size:16px }
    .ukv-jp-iname { font-size:14px }
    .ukv-jp-isub { font-size:10px }
    .ukv-jp-iprice { font-size:14px }
    .ukv-jp-foot { padding:16px 20px 20px }
    .ukv-jp-tv { font-size:20px }
    .ukv-jp-go { padding:14px;font-size:10px }
    .ukv-rbtn { padding:0 16px;height:30px;font-size:8px }
    .ukv-rbtn--sm { height:28px;font-size:7.5px;padding:0 12px }
    .ukv-sub { display:none }
  }

  .ukv-nav {
    width:100%; font-family:'DM Sans',sans-serif;
    background: var(--ukv-glass);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    position:sticky; top:0; z-index:100;
    border-bottom:.5px solid rgba(196,164,90,.15);
    box-shadow: 0 1px 0 0 rgba(196,164,90,.04), 0 4px 12px 0 rgba(0,0,0,.15);
  }

  /* Ribbon */
  .ukv-ribbon { display:flex;align-items:center;justify-content:space-between;padding:5px 24px;border-bottom:.5px solid rgba(196,164,90,.12);position:relative;overflow:hidden;background:linear-gradient(180deg, rgba(196,164,90,.02) 0%, transparent 100%) }
  .ukv-ribbon-left { display:flex;align-items:center;gap:12px }
  .ukv-pill { display:flex;align-items:center;gap:5px;font-size:8.5px;letter-spacing:.2em;text-transform:uppercase;color:rgba(196,164,90,.65);font-weight:300;padding:2px 0;position:relative }
  .ukv-pill::after { content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(196,164,90,.4),transparent);opacity:0;transition:opacity .3s }
  .ukv-pill:hover::after { opacity:1 }
  .ukv-rdot { width:4px;height:4px;border-radius:50%;background:#7DB87D;display:inline-block;animation:ukv-pulse 2.5s ease-in-out infinite;box-shadow:0 0 6px rgba(125,184,125,.4) }
  .ukv-rdiv { color:rgba(196,164,90,.2);font-size:12px }
  .ukv-rq { font-family:'Cormorant Garamond',serif;font-style:italic;font-size:12px;color:rgba(245,240,232,.42);letter-spacing:.06em }
  .ukv-shim { position:absolute;bottom:0;left:0;height:1px;width:30%;background:linear-gradient(90deg,transparent,rgba(196,164,90,.6),transparent);animation:ukv-shim 4s ease-in-out infinite }

  /* Main */
  .ukv-main { display:flex;align-items:center;padding:12px 24px;gap:14px;transition:padding .4s ease }
  .ukv-main--scrolled { padding:8px 24px }

  /* Logo */
  .ukv-logo { display:flex;align-items:center;gap:12px;flex-shrink:0;text-decoration:none;position:relative }
  .ukv-logo::before { content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);width:1px;height:0;background:linear-gradient(180deg, transparent, rgba(196,164,90,.3), transparent);transition:height .4s ease }
  .ukv-logo:hover::before { height:100% }
  .ukv-lt { display:flex;flex-direction:column;padding-left:12px;border-left:.5px solid rgba(196,164,90,.28);position:relative }
  .ukv-lt::before { content:'';position:absolute;left:0;top:0;bottom:0;width:1px;background:linear-gradient(180deg, rgba(196,164,90,.4), rgba(196,164,90,.1), rgba(196,164,90,.4));opacity:0;transition:opacity .3s }
  .ukv-logo:hover .ukv-lt::before { opacity:1 }
  .ukv-ln { font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:300;letter-spacing:.2em;color:var(--ukv-ivory);text-transform:uppercase;line-height:1;text-shadow:0 0 28px rgba(196,164,90,.15), 0 0 8px rgba(196,164,90,.08);transition:font-size .4s ease,letter-spacing .4s ease,text-shadow .4s ease }
  .ukv-ln--scrolled { font-size:20px;letter-spacing:.18em;text-shadow:0 0 20px rgba(196,164,90,.12), 0 0 6px rgba(196,164,90,.06) }
  .ukv-ls { font-size:8px;letter-spacing:.28em;text-transform:uppercase;color:var(--ukv-gold);margin-top:4px;font-weight:300;text-shadow:0 0 12px rgba(196,164,90,.2);transition:letter-spacing .4s ease }

  .ukv-vsep { width:.5px;height:26px;background:rgba(196,164,90,.14);flex-shrink:0 }

  /* Metric */
  .ukv-metric { display:flex;flex-direction:column;flex-shrink:0;gap:1px;transition:transform .3s ease,opacity .3s ease;cursor:default }
  .ukv-metric:hover { transform:translateY(-2px);opacity:1 }
  .ukv-metric-label { font-size:7px;letter-spacing:.22em;text-transform:uppercase;color:rgba(196,164,90,.48);transition:color .3s ease }
  .ukv-metric:hover .ukv-metric-label { color:rgba(196,164,90,.7) }
  .ukv-metric-val { font-size:15px;font-weight:300;color:var(--ukv-ivory);letter-spacing:.04em;line-height:1;display:flex;align-items:center;gap:6px;transition:text-shadow .3s ease }
  .ukv-metric:hover .ukv-metric-val { text-shadow:0 0 12px rgba(196,164,90,.2) }
  .ukv-metric-detail { font-size:10px;color:rgba(245,240,232,.35);font-style:italic;font-family:'Cormorant Garamond',serif;transition:color .3s ease }
  .ukv-metric:hover .ukv-metric-detail { color:rgba(245,240,232,.5) }

  /* Status */
  .ukv-status { display:flex;align-items:center;gap:5px;flex-shrink:0 }
  .ukv-sdot { width:5px;height:5px;border-radius:50%;background:#7DB87D;display:inline-block;animation:ukv-pulse 2s ease-in-out infinite }
  .ukv-slabel { font-size:8.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--ukv-sage) }

  /* Nav links */
  .ukv-nav-links { display:flex;align-items:center;flex:1;justify-content:center;position:relative }
  .ukv-nl { font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:rgba(245,240,232,.48);padding:6px 12px;cursor:pointer;position:relative;white-space:nowrap;transition:color .25s,transform .25s,letter-spacing .25s;text-decoration:none;display:inline-block;font-weight:400 }
  .ukv-nl::before { content:'';position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:0;height:1px;background:linear-gradient(90deg, transparent, var(--ukv-gold), transparent);transition:width .3s ease }
  .ukv-nl:hover { color:rgba(245,240,232,.92);transform:translateY(-1px);letter-spacing:.19em }
  .ukv-nl:hover::before { width:calc(100% - 24px) }
  .ukv-nl--act { color:var(--ukv-gold);text-shadow:0 0 16px rgba(196,164,90,.25), 0 0 6px rgba(196,164,90,.12);font-weight:500;letter-spacing:.17em }
  .ukv-nl--act::before { width:calc(100% - 24px);opacity:1 }
  .ukv-nl--act::after { content:'';position:absolute;bottom:-2px;left:12px;right:12px;height:1px;background:linear-gradient(90deg,transparent,var(--ukv-gold),transparent);box-shadow:0 0 8px rgba(196,164,90,.4) }

  /* Mega menu */
  .ukv-mega-wrap { position:absolute;top:calc(100% + 1px);left:50%;transform:translateX(-50%) translateY(-6px);z-index:500;opacity:0;pointer-events:none;transition:opacity .22s,transform .22s }
  .ukv-mega-wrap--open { opacity:1;pointer-events:auto;transform:translateX(-50%) translateY(0);animation:ukv-megaIn .22s ease }
  .ukv-mega-arrow { position:absolute;top:-5px;left:50%;transform:translateX(-50%);width:10px;height:6px;overflow:hidden }
  .ukv-mega-arrow::after { content:'';position:absolute;top:0;left:50%;transform:translateX(-50%) rotate(45deg);width:8px;height:8px;background:rgba(18,23,17,.97);border:.5px solid rgba(196,164,90,.25);box-shadow:0 -1px 4px rgba(196,164,90,.15) }
  .ukv-mega { background:rgba(18,23,17,.97);border:.5px solid rgba(196,164,90,.25);border-radius:6px;padding:24px 28px;display:grid;grid-template-columns:repeat(4,1fr);gap:28px;min-width:560px;box-shadow:0 8px 32px rgba(0,0,0,.3), 0 0 0 1px rgba(196,164,90,.05), inset 0 1px 0 rgba(255,255,255,.02) }
  .ukv-mega-col-title { font-size:7.5px;letter-spacing:.24em;text-transform:uppercase;color:rgba(196,164,90,.55);margin-bottom:12px;padding-bottom:8px;border-bottom:.5px solid rgba(196,164,90,.12);display:flex;align-items:center;gap:8px;font-weight:500 }
  .ukv-availability { font-size:6.5px;letter-spacing:.12em;text-transform:uppercase;color:rgba(0,255,65,.65);background:rgba(0,255,65,.08);padding:2px 6px;border-radius:10px;border:.5px solid rgba(0,255,65,.22);transition:all .3s;box-shadow:0 0 8px rgba(0,255,65,.15) }
  .ukv-availability--good { color:rgba(0,255,65,.85);background:rgba(0,255,65,.12);border-color:rgba(0,255,65,.32);box-shadow:0 0 12px rgba(0,255,65,.2) }
  .ukv-mega-item { display:block;font-size:11px;color:rgba(245,240,232,.5);letter-spacing:.05em;padding:5px 0;cursor:pointer;transition:color .2s,transform .2s,padding-left .2s;border:none;background:none;font-family:'DM Sans',sans-serif;text-align:left;width:100%;position:relative }
  .ukv-mega-item::before { content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);width:0;height:1px;background:linear-gradient(90deg, var(--ukv-gold), transparent);transition:width .3s }
  .ukv-mega-item:hover { color:var(--ukv-ivory);transform:translateX(4px);padding-left:4px }
  .ukv-mega-item:hover::before { width:8px }
  .ukv-mega-item--featured { color:var(--ukv-gold);font-style:italic;font-weight:400 }

  /* Actions */
  .ukv-actions { display:flex;align-items:center;gap:8px;flex-shrink:0 }

  /* My Journey */
  .ukv-jw { position:relative }
  .ukv-jbtn { display:flex;align-items:center;gap:6px;padding:0 14px;height:34px;border:.5px solid rgba(196,164,90,.32);border-radius:3px;background:transparent;color:rgba(245,240,232,.65);cursor:pointer;font-size:9px;letter-spacing:.15em;text-transform:uppercase;font-family:'DM Sans',sans-serif;transition:all .3s cubic-bezier(.4,0,.2,1);position:relative;overflow:hidden }
  .ukv-jbtn::before { content:'';position:absolute;inset:0;background:linear-gradient(135deg, transparent, rgba(196,164,90,.1), transparent);opacity:0;transition:opacity .3s }
  .ukv-jbtn::after { content:'';position:absolute;inset:0;background:radial-gradient(circle at center, rgba(196,164,90,.15), transparent 70%);opacity:0;transition:opacity .3s }
  .ukv-jbtn:hover { border-color:rgba(196,164,90,.7);color:var(--ukv-ivory);background:rgba(196,164,90,.1);box-shadow:0 0 20px rgba(196,164,90,.2), inset 0 0 0 1px rgba(196,164,90,.15);transform:translateY(-1px) }
  .ukv-jbtn:hover::before { opacity:1 }
  .ukv-jbtn:hover::after { opacity:1 }
  .ukv-jbtn:hover .ukv-jbadge { animation:ukv-pulse 1s ease-in-out infinite;box-shadow:0 0 12px rgba(196,164,90,.5);transform:scale(1.1) }
  .ukv-jbadge { width:16px;height:16px;border-radius:50%;background:rgba(196,164,90,.12);border:.5px solid rgba(196,164,90,.48);color:var(--ukv-gold);font-size:8px;font-weight:500;display:flex;align-items:center;justify-content:center;min-width:16px;position:relative;z-index:1;transition:all .3s ease }

  /* Journey panel */
  .ukv-jp { position:absolute;top:calc(100% + 10px);right:0;width:300px;background:rgba(16,21,17,.98);border:.5px solid rgba(196,164,90,.28);border-radius:5px;z-index:300;transform-origin:top right;transform:scale(.93) translateY(-8px);opacity:0;pointer-events:none;transition:opacity .22s,transform .22s;box-shadow:0 12px 40px rgba(0,0,0,.4), 0 0 0 1px rgba(196,164,90,.06), inset 0 1px 0 rgba(255,255,255,.02) }
  .ukv-jp--open { opacity:1;transform:scale(1) translateY(0);pointer-events:auto }
  .ukv-jp-h { padding:14px 16px 11px;border-bottom:.5px solid rgba(196,164,90,.14);display:flex;align-items:flex-start;justify-content:space-between;background:linear-gradient(180deg, rgba(196,164,90,.03), transparent) }
  .ukv-jp-title { font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:300;color:var(--ukv-ivory);letter-spacing:.07em;text-shadow:0 0 12px rgba(196,164,90,.1) }
  .ukv-jp-sub { font-size:7.5px;letter-spacing:.18em;text-transform:uppercase;color:rgba(196,164,90,.5);margin-top:2px;font-weight:500 }
  .ukv-jp-x { background:none;border:none;cursor:pointer;color:rgba(245,240,232,.28);font-size:14px;padding:0;transition:color .2s;flex-shrink:0;margin-left:8px;margin-top:2px }
  .ukv-jp-x:hover { color:var(--ukv-gold);text-shadow:0 0 8px rgba(196,164,90,.3) }
  .ukv-jp-items { padding:12px 16px;display:flex;flex-direction:column;gap:12px }
  .ukv-jp-empty { font-size:12px;color:rgba(245,240,232,.28);text-align:center;padding:10px 0;font-style:italic;font-family:'Cormorant Garamond',serif }
  .ukv-jp-suggestion { padding:12px 16px;background:rgba(196,164,90,.06);border:.5px solid rgba(196,164,90,.18);border-radius:8px;margin-bottom:12px }
  .ukv-jp-suggestion-title { font-size:8px;letter-spacing:.15em;text-transform:uppercase;color:var(--ukv-gold);margin-bottom:4px }
  .ukv-jp-suggestion-desc { font-size:10px;color:rgba(245,240,232,.5);line-height:1.5;font-style:italic;font-family:'Cormorant Garamond',serif }
  .ukv-jp-item { display:flex;align-items:flex-start;gap:10px;padding:8px;border-radius:6px;transition:background .3s ease,transform .3s ease }
  .ukv-jp-item:hover { background:rgba(196,164,90,.06);transform:translateX(2px) }
  .ukv-jp-icon { width:28px;height:28px;border-radius:3px;background:rgba(196,164,90,.08);border:.5px solid rgba(196,164,90,.18);display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;margin-top:1px;transition:all .3s ease }
  .ukv-jp-item:hover .ukv-jp-icon { background:rgba(196,164,90,.12);border-color:rgba(196,164,90,.3);transform:scale(1.05) }
  .ukv-jp-info { flex:1 }
  .ukv-jp-iname { font-size:11.5px;color:rgba(245,240,232,.82);line-height:1.3;transition:color .3s ease }
  .ukv-jp-item:hover .ukv-jp-iname { color:var(--ukv-ivory) }
  .ukv-jp-isub { font-size:8.5px;color:rgba(245,240,232,.3);margin-top:2px;letter-spacing:.04em;transition:color .3s ease }
  .ukv-jp-item:hover .ukv-jp-isub { color:rgba(245,240,232,.5) }
  .ukv-jp-iprice { font-size:11.5px;color:var(--ukv-gold);white-space:nowrap;flex-shrink:0;margin-top:1px;transition:text-shadow .3s ease }
  .ukv-jp-item:hover .ukv-jp-iprice { text-shadow:0 0 8px rgba(196,164,90,.3) }
  .ukv-jp-irm { background:none;border:none;cursor:pointer;color:rgba(245,240,232,.15);font-size:11px;padding:0;transition:color .2s,transform .2s;flex-shrink:0;margin-top:3px }
  .ukv-jp-irm:hover { color:rgba(196,164,90,.8);transform:scale(1.2) }
  .ukv-jp-div { height:.5px;background:rgba(196,164,90,.08);margin:0 16px }
  .ukv-jp-foot { padding:12px 16px 16px;display:flex;flex-direction:column;gap:10px }
  .ukv-jp-tot { display:flex;justify-content:space-between;align-items:baseline }
  .ukv-jp-tl { font-size:8px;letter-spacing:.14em;text-transform:uppercase;color:rgba(245,240,232,.28) }
  .ukv-jp-tv { font-size:17px;color:var(--ukv-ivory);font-weight:300;font-family:'Cormorant Garamond',serif }
  .ukv-jp-go { width:100%;padding:11px;background:var(--ukv-gold);border:none;border-radius:3px;color:#101511;font-size:9px;letter-spacing:.18em;text-transform:uppercase;font-family:'DM Sans',sans-serif;font-weight:500;cursor:pointer;transition:opacity .2s }
  .ukv-jp-go:hover { opacity:.86 }

  /* Reserve */
  .ukv-rbtn { display:inline-flex;align-items:center;gap:6px;padding:0 20px;height:34px;border:1px solid rgba(196,164,90,.75);border-radius:3px;background:transparent;color:var(--ukv-gold);font-size:9.5px;letter-spacing:.21em;text-transform:uppercase;font-family:'DM Sans',sans-serif;cursor:pointer;position:relative;overflow:hidden;transition:color .3s,height .4s,padding .4s,font-size .4s,border-color .3s,box-shadow .3s;white-space:nowrap;text-decoration:none;font-weight:500 }
  .ukv-rbtn::before { content:'';position:absolute;inset:0;background:linear-gradient(135deg, var(--ukv-gold), var(--ukv-bronze));transform:scaleX(0);transform-origin:left;transition:transform .32s cubic-bezier(.4,0,.2,1) }
  .ukv-rbtn::after { content:'';position:absolute;inset:0;background:linear-gradient(135deg, transparent, rgba(255,255,255,.1), transparent);opacity:0;transition:opacity .3s }
  .ukv-rbtn:hover::before { transform:scaleX(1) }
  .ukv-rbtn:hover::after { opacity:1 }
  .ukv-rbtn:hover { color:#101511;border-color:var(--ukv-gold);box-shadow:0 0 16px rgba(196,164,90,.4), 0 0 0 1px rgba(196,164,90,.2) }
  .ukv-rbtn > * { position:relative;z-index:1;display:flex;align-items:center;gap:5px }
  .ukv-rbtn--sm { height:30px;font-size:8.5px;padding:0 16px;letter-spacing:.19em }

  /* Sub bar */
  .ukv-sub { display:flex;align-items:center;justify-content:space-between;padding:6px 24px;background:linear-gradient(180deg, rgba(196,164,90,.04), rgba(196,164,90,.02));border-top:.5px solid rgba(196,164,90,.08) }
  .ukv-pi { display:flex;align-items:center;gap:10px }
  .ukv-pi-section { font-size:7.5px;letter-spacing:.24em;text-transform:uppercase;color:rgba(196,164,90,.5);font-weight:500 }
  .ukv-pi-sep { color:rgba(196,164,90,.22);font-size:10px }
  .ukv-pi-page { font-family:'Cormorant Garamond',serif;font-size:12px;font-style:italic;color:rgba(245,240,232,.46);letter-spacing:.04em }
  .ukv-qi { display:flex;gap:16px }
  .ukv-qib { font-size:8.5px;letter-spacing:.11em;text-transform:uppercase;color:rgba(245,240,232,.28);cursor:pointer;transition:color .2s,transform .2s,text-decoration:none;display:inline-block;font-weight:400 }
  .ukv-qib:hover { color:var(--ukv-sage);transform:translateY(-1px);text-shadow:0 0 8px rgba(122,150,114,.3) }

  /* Modal */
  .ukv-modal-overlay { position:fixed;inset:0;background:rgba(5,8,5,.92);z-index:1000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px) }
  .ukv-modal { background:var(--ukv-forest);border:.5px solid rgba(196,164,90,.32);border-radius:6px;width:min(480px,92vw);max-height:90vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.5), 0 0 0 1px rgba(196,164,90,.08), inset 0 1px 0 rgba(255,255,255,.02) }
  .ukv-modal-head { padding:16px 20px 13px;border-bottom:.5px solid rgba(196,164,90,.14);display:flex;align-items:flex-start;justify-content:space-between;flex-shrink:0;background:linear-gradient(180deg, rgba(196,164,90,.04), transparent) }
  .ukv-modal-title { font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:300;color:var(--ukv-ivory);letter-spacing:.08em;text-shadow:0 0 16px rgba(196,164,90,.12) }
  .ukv-modal-sub { font-size:8px;letter-spacing:.18em;text-transform:uppercase;color:rgba(196,164,90,.5);margin-top:3px;font-weight:500 }
  .ukv-modal-close { background:none;border:none;cursor:pointer;color:rgba(245,240,232,.28);font-size:16px;padding:0;transition:color .2s;flex-shrink:0 }
  .ukv-modal-close:hover { color:var(--ukv-gold);text-shadow:0 0 8px rgba(196,164,90,.4) }
  .ukv-modal-body { flex:1;overflow:hidden;min-height:400px;background:#0d1508 }
  .ukv-modal-foot { padding:10px 20px;border-top:.5px solid rgba(196,164,90,.12);display:flex;justify-content:space-between;align-items:center;flex-shrink:0 }
  .ukv-modal-note { font-size:8px;color:rgba(245,240,232,.28);letter-spacing:.06em }
  .ukv-modal-open { font-size:8px;letter-spacing:.14em;text-transform:uppercase;color:var(--ukv-gold);text-decoration:none;transition:opacity .2s;text-shadow:0 0 8px rgba(196,164,90,.2) }
  .ukv-modal-open:hover { opacity:.8;text-shadow:0 0 12px rgba(196,164,90,.35) }
`;
