'use client'

import { useState, useEffect } from 'react'
import {
  CloudIcon,
  DatabaseIcon,
  CodeIcon,
  GitBranchIcon,
  ShieldIcon,
  BellIcon,
  MessageSquareIcon,
  ImageIcon,
  Link2Icon,
  ArrowRightIcon,
  ArrowLeftIcon,
  GithubIcon,
  LinkedinIcon,
  MailIcon,
  PhoneIcon,
  CheckCircleIcon,
  ZapIcon,
  TerminalIcon,
  MenuIcon,
  XIcon,
  ExternalLinkIcon,
  CalendarIcon,
  BriefcaseIcon,
  SparklesIcon,
} from 'lucide-react'

// ─── Crystal Blue palette (matches PDF case study cover) ──────────────────
const COLORS = {
  bgDark:      '#0a1628',
  bgDarkSoft:  '#0e1c33',
  glow:        '#2d7ab3',
  accent:      '#4da8da',
  textCool:    '#e8f0f8',
  textMuted:   '#7a9bb8',
  bgLight:     '#f5f8fc',
  bgLightCard: '#e4ecf5',
  border:      '#c0d0e2',
  textDark:    '#142840',
  textDarkMuted: '#5a7a96',
  headerFill:  '#1a4a7a',
  accentDark:  '#2d7ab3',
}

// ═══════════════════════════════════════════════════════════════════════════
// PROJECT DATA — add new projects here
// ═══════════════════════════════════════════════════════════════════════════
type Project = {
  slug: string
  title: string
  year: string
  role: string
  client: string
  tagline: string
  summary: string
  techBadges: string[]
  stats: { num: string; label: string }[]
  liveUrl?: string
  repoUrl?: string
  pdfUrl?: string
}

const PROJECTS: Project[] = [
  {
    slug: 'jalaram-feeds-erp',
    title: 'Jalaram Feeds ERP',
    year: '2025 — 2026',
    role: 'Full-stack Engineer',
    client: 'Jalaram Feeds (manufacturing)',
    tagline: 'Cloudflare Workers + D1 ERP for an animal-feed manufacturer',
    summary:
      'A complete ERP covering sales, dispatch, purchase, production, labour payroll, and lab reports — migrated from Google Apps Script to the Cloudflare edge with zero downtime. Six Workers, eight D1 databases, twenty-two thousand lines of vanilla JavaScript.',
    techBadges: ['Cloudflare Workers', 'D1', 'R2', 'Service Bindings', 'Workers AI', 'Browser Rendering', 'WhatsApp API', 'PBKDF2'],
    stats: [
      { num: '6', label: 'Workers' },
      { num: '8', label: 'D1 DBs' },
      { num: '22k', label: 'LOC' },
      { num: '39', label: 'Tests' },
    ],
    pdfUrl: '/Jalaram_Feeds_ERP_Case_Study.pdf',
  },
  // ─── Future projects: just add another object below ───
  // {
  //   slug: 'next-project',
  //   title: 'Next Project',
  //   ...
  // }
]

// ═══════════════════════════════════════════════════════════════════════════
// CASE STUDY CONTENT — Jalaram Feeds ERP
// ═══════════════════════════════════════════════════════════════════════════
const JALARAM_WORKERS = [
  { name: 'jalaram-gate',       role: 'Entry · Auth · Dashboard', desc: 'Login, admin panel, dashboard aggregator, CRM, accounts, day-end report, low-stock PDF.', lines: '9,766', cron: '*/15 · 9pm · 9am · 10am IST', dbs: 8, public: true },
  { name: 'jalaram-feeds',      role: 'Sales · Dispatch · WhatsApp', desc: 'Sales orders, dispatch challans, FG stock, WhatsApp confirmations with PDF fallback.', lines: '5,120', cron: 'hourly', dbs: 2, public: false },
  { name: 'jalaram-purchase',   role: 'Sauda · Arrival · GRN', desc: 'Purchase deals, material arrivals, GRN, freight. Lab test results block on GRN slip.', lines: '3,226', cron: 'hourly', dbs: 4, public: false },
  { name: 'jalaram-production', role: 'FG Batches · Formula', desc: 'Finished-goods batches, formula book, production analysis with search.', lines: '1,794', cron: 'hourly', dbs: 1, public: false },
  { name: 'jalaram-labour',     role: 'Attendance · Payroll', desc: 'Contractor attendance, advances, bank payments, mash rates. Audit log feeds Day End.', lines: '1,073', cron: 'hourly', dbs: 2, public: false },
  { name: 'jalaram-lab',        role: 'Lab Reports · Mobile Link', desc: 'Login-less lab test reports via Mobile Link (B110). Syncs results back to Purchase.', lines: '544', cron: 'half-hourly', dbs: 4, public: false },
]

const JALARAM_FEATURES = [
  { icon: MessageSquareIcon, title: 'WhatsApp with PDF fallback', tag: 'B166', desc: 'When text message delivery fails (a non-trivial fraction), generate a PDF of the same content in-memory and send as a media message. No R2 round-trip, no external PDF library — pure JavaScript bytes.' },
  { icon: TerminalIcon,     title: 'Sahayak AI chat',             tag: 'Workers AI', desc: 'A scoped natural-language assistant for super-admins. Maps free-text questions to a fixed set of supported query templates, runs the RPC, formats the result. Deliberately narrow: no free-form SQL, no tool use, no escape hatches.' },
  { icon: ImageIcon,        title: 'Day End screenshot report',  tag: 'B128 · Browser Rendering', desc: 'Every 9 PM IST, a Gate cron uses Cloudflare Browser Rendering to launch headless Chromium, screenshot an internal report URL, and send the image to the owner\'s WhatsApp. Owner gets a single image summarising the day without opening the app.' },
  { icon: Link2Icon,        title: 'Mobile Link for lab',        tag: 'B110', desc: 'Long-lived HMAC-signed link for the lab technician\'s phone. Session is scoped to "lab" only — even a stolen phone cannot reach payroll, sales, or admin. Revocable in one click from the admin panel.' },
]

const JALARAM_MIGRATION = [
  { aspect: 'Compute',         before: 'Apps Script (6-min limit)',  after: 'Workers (no hard limit)' },
  { aspect: 'Data store',      before: 'Google Sheets',               after: '8 D1 SQLite databases' },
  { aspect: 'Frontend RPC',    before: 'google.script.run',           after: '/rpc/* over HTTPS' },
  { aspect: 'Auth',            before: 'Per-file Google SSO',         after: 'PBKDF2 + D1 sessions' },
  { aspect: 'Public exposure', before: 'All apps public',              after: 'Only Gate public; 5 modules private' },
  { aspect: 'Cron',            before: 'Time-driven triggers',         after: 'Cloudflare Cron Triggers' },
  { aspect: 'Version control', before: 'Per-file awkward',            after: 'Git monorepo, single main branch' },
  { aspect: 'Tests',           before: 'None',                        after: '39 plain-node test files' },
]

const JALARAM_TECH_STACK = [
  'Cloudflare Workers', 'Cloudflare D1', 'Cloudflare R2', 'Cloudflare Cron Triggers',
  'Workers AI', 'Browser Rendering', 'Service Bindings', 'PBKDF2-SHA256',
  'WhatsApp Business API', 'Vanilla JS (no TypeScript)', 'Bootstrap 5', 'Select2',
  'SweetAlert2', 'Chart.js', 'SheetJS (xlsx)', 'node:sqlite (tests)',
]

const JALARAM_CODE_SNIPPET = `// 1-gate/index.js — password hashing (PBKDF2-SHA256)
async function pbkdf2(password, saltHex, iters) {
  const salt = Uint8Array.from(saltHex.match(/../g).map(h => parseInt(h, 16)));
  const key  = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(password),
    "PBKDF2", false, ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: iters, hash: "SHA-256" },
    key, 256
  );
  return [...new Uint8Array(bits)]
    .map(b => b.toString(16).padStart(2, "0")).join("");
}

const ITERS = 1e5; // 100,000 iterations
async function hashPassword(password) {
  const salt = toHex(crypto.getRandomValues(new Uint8Array(16)));
  return \`\${salt}\$\${ITERS}\$\${await pbkdf2(password, salt, ITERS)}\`;
}`

const JALARAM_DB_TABLE = [
  ['jalaram-auth',       'jalaram-gate',       'users, sessions, device_links, access_log, daily_audit'],
  ['jalaram-feeds',      'jalaram-feeds',      'orders, dispatches, wa_settings, wa_numbers, audit_log'],
  ['jalaram-purchase',   'jalaram-purchase',   'saudas, arrivals, grn, freights, parties, materials'],
  ['jalaram-production', 'jalaram-production', 'batches, items, formula'],
  ['jalaram-master',      'jalaram-gate (admin)', 'item_master, stock_opening, stock_transfer, stock_adjustment'],
  ['jalaram-crm',        'jalaram-gate',       'crm_leads, crm_notes, crm_payments, crm_settings'],
  ['jalaram-labour',     'jalaram-labour',     'contractors, rates, labour, advances, bank_payments'],
  ['jalaram-lab',        'jalaram-lab',        'lab_reports, sessions'],
]

// ═══════════════════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════
function Nav({ onBack }: { onBack?: () => void }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [open])

  const navLinks = [
    { href: '#about',    label: 'About' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact',  label: 'Contact' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
         style={{ background: 'rgba(10, 22, 40, 0.7)', borderBottom: '1px solid rgba(77, 168, 218, 0.15)' }}>
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <button
          onClick={() => { if (onBack) onBack(); else window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-2 h-2 rounded-full" style={{ background: COLORS.accent, boxShadow: `0 0 8px ${COLORS.accent}` }} />
          <span className="font-mono text-sm" style={{ color: COLORS.textCool }}>
            {onBack ? (
              <><ArrowLeftIcon className="w-3 h-3 inline mr-1" /> back to portfolio</>
            ) : (
              <>abhinav<span style={{ color: COLORS.textMuted }}> · randai</span></>
            )}
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-white transition-colors" style={{ color: COLORS.textMuted }}>
              {l.label}
            </a>
          ))}
          <a href="#contact" className="text-xs font-mono px-3 py-1.5 rounded transition-all hover:scale-105"
             style={{ background: COLORS.accent, color: COLORS.bgDark }}>
            Get in touch →
          </a>
        </div>

        {/* Mobile CTA + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <a href="#contact" className="text-xs font-mono px-3 py-1.5 rounded"
             style={{ background: COLORS.accent, color: COLORS.bgDark }}>
            Contact →
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="p-2 rounded transition-colors hover:bg-white/5"
            style={{ color: COLORS.textCool }}
          >
            {open ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t" style={{ borderColor: 'rgba(77, 168, 218, 0.15)', background: 'rgba(10, 22, 40, 0.97)' }}>
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                 className="block px-3 py-2.5 rounded text-sm transition-colors hover:bg-white/5"
                 style={{ color: COLORS.textMuted }}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

function Footer() {
  return (
    <footer className="py-8 px-6" style={{ background: COLORS.bgDark, borderTop: '1px solid rgba(77,168,218,0.15)' }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: COLORS.accent }} />
          <span className="font-mono text-xs" style={{ color: COLORS.textMuted }}>
            Abhinav Randai · Portfolio · v2.0 · September 2026
          </span>
        </div>
        <div className="font-mono text-xs" style={{ color: COLORS.textMuted }}>
          Built with Next.js · Tailwind CSS · Crystal Blue theme
        </div>
      </div>
    </footer>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// PORTFOLIO VIEW (default landing)
// ═══════════════════════════════════════════════════════════════════════════
function PortfolioHero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden"
             style={{ background: COLORS.bgDark }}>
      <div className="absolute top-0 left-0 w-[500px] h-[500px] pointer-events-none"
           style={{ background: `radial-gradient(circle at 0% 0%, ${COLORS.glow}33 0%, transparent 60%)` }} />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none"
           style={{ background: `radial-gradient(circle at 100% 100%, ${COLORS.accent}24 0%, transparent 60%)` }} />

      <div className="relative max-w-6xl mx-auto px-6 py-32 w-full">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-px w-12" style={{ background: COLORS.accent }} />
          <span className="font-mono text-xs tracking-[0.3em] uppercase" style={{ color: COLORS.accent }}>
            Full-stack Engineer · Edge Computing · ERP Systems
          </span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black leading-[0.95] tracking-tight mb-8"
            style={{ color: COLORS.textCool, textShadow: `0 0 40px ${COLORS.accent}44` }}>
          Abhinav<br/>
          <span style={{ fontFamily: 'var(--font-geist-sans)' }}>Randai</span>
        </h1>

        <p className="text-lg md:text-xl max-w-2xl mb-4 leading-relaxed" style={{ color: COLORS.textMuted }}>
          I build full-stack systems for small and mid-sized businesses — work that needs to run
          in production for years, where the user is not a developer and should never think about the stack.
        </p>

        <p className="text-base max-w-xl mb-12 leading-relaxed" style={{ color: `${COLORS.textMuted}cc` }}>
          Currently shipping a Cloudflare Workers + D1 ERP for an animal-feed manufacturer.
          Past lives in Google Apps Script, vanilla JS, and Sheet-based systems that grew up.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <a href="#projects"
             className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-medium transition-all hover:scale-105"
             style={{ background: COLORS.accent, color: COLORS.bgDark }}>
            View projects <ArrowRightIcon className="w-4 h-4" />
          </a>
          <a href="#contact"
             className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-mono transition-all hover:bg-white/5"
             style={{ border: `1px solid ${COLORS.accent}55`, color: COLORS.textCool }}>
            Get in touch
          </a>
        </div>
      </div>
    </section>
  )
}

function AboutSection() {
  const skills = [
    { icon: CloudIcon,       title: 'Cloudflare Workers', desc: 'Edge compute, service bindings, D1, R2, Workers AI, Browser Rendering' },
    { icon: DatabaseIcon,    title: 'Database Design',    desc: 'SQLite/D1, schema design, multi-DB topology, migration patterns' },
    { icon: ShieldIcon,      title: 'Authentication',     desc: 'PBKDF2, session management, RBAC, HMAC-signed service calls' },
    { icon: CodeIcon,         title: 'Vanilla JS',         desc: 'No-framework frontends, gas-shim proxies, /rpc/* patterns' },
    { icon: GitBranchIcon,   title: 'Engineering Rigor',  desc: 'TDD, B-number changelogs, AGENTS.md-style engineering culture' },
    { icon: MessageSquareIcon, title: 'Integrations',     desc: 'WhatsApp Business API, Google Sheets Apps Script, PDF generation' },
  ]

  return (
    <section id="about" className="py-24 px-6" style={{ background: COLORS.bgLight }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-12" style={{ background: COLORS.accentDark }} />
            <span className="font-mono text-xs tracking-[0.3em] uppercase" style={{ color: COLORS.accentDark }}>
              01 · About
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: COLORS.textDark }}>
            Boring code that ships.
          </h2>
          <p className="text-lg max-w-3xl" style={{ color: COLORS.textDarkMuted }}>
            My work tends to live at the intersection of "this needs to actually run in production
            for years" and "the user is not a developer and should never have to think about the stack".
            I keep architectures as boring as the requirements allow, and I prefer deletion over addition.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.title}
                   className="rounded-lg p-5 transition-all hover:scale-[1.02]"
                   style={{ background: 'white', border: `1px solid ${COLORS.border}` }}>
                <div className="w-10 h-10 rounded flex items-center justify-center mb-3"
                     style={{ background: COLORS.bgLightCard }}>
                  <Icon className="w-5 h-5" style={{ color: COLORS.accentDark }} />
                </div>
                <h3 className="font-bold mb-1" style={{ color: COLORS.textDark }}>{s.title}</h3>
                <p className="text-sm" style={{ color: COLORS.textDarkMuted }}>{s.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function ProjectsGrid({ projects, onSelect }: { projects: Project[]; onSelect: (p: Project) => void }) {
  return (
    <section id="projects" className="py-24 px-6" style={{ background: COLORS.bgDark }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-12" style={{ background: COLORS.accent }} />
            <span className="font-mono text-xs tracking-[0.3em] uppercase" style={{ color: COLORS.accent }}>
              02 · Selected projects
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: COLORS.textCool }}>
            Things I&apos;ve built
          </h2>
          <p className="text-lg max-w-3xl" style={{ color: COLORS.textMuted }}>
            A curated set of full-stack systems shipped to production. Click any project to read
            its full case study.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p) => (
            <button
              key={p.slug}
              onClick={() => onSelect(p)}
              className="group text-left rounded-lg p-7 transition-all hover:scale-[1.02] focus:outline-none focus:ring-2"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(77, 168, 218, 0.2)',
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-mono text-xs mb-1" style={{ color: COLORS.accent }}>
                    {p.year}
                  </div>
                  <h3 className="text-2xl font-bold mb-1" style={{ color: COLORS.textCool }}>
                    {p.title}
                  </h3>
                  <div className="text-sm" style={{ color: COLORS.textMuted }}>
                    {p.role} · {p.client}
                  </div>
                </div>
                <ArrowRightIcon className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                                style={{ color: COLORS.accent }} />
              </div>

              <p className="text-sm leading-relaxed mb-5" style={{ color: COLORS.textMuted }}>
                {p.summary}
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-4 gap-2 mb-5">
                {p.stats.map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-xl font-black" style={{ color: COLORS.accent, fontFamily: 'Georgia, serif' }}>
                      {s.num}
                    </div>
                    <div className="text-[10px] tracking-wider uppercase mt-1" style={{ color: COLORS.textMuted }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tech badges */}
              <div className="flex flex-wrap gap-1.5">
                {p.techBadges.slice(0, 5).map((t) => (
                  <span key={t}
                        className="px-2 py-1 rounded text-[10px] font-mono"
                        style={{ background: COLORS.glow + '22', color: COLORS.accent }}>
                    {t}
                  </span>
                ))}
                {p.techBadges.length > 5 && (
                  <span className="px-2 py-1 rounded text-[10px] font-mono"
                        style={{ color: COLORS.textMuted }}>
                    +{p.techBadges.length - 5} more
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  return (
    <section id="contact" className="py-24 px-6 relative overflow-hidden" style={{ background: COLORS.bgDark }}>
      <div className="absolute top-0 left-0 w-[500px] h-[500px] pointer-events-none"
           style={{ background: `radial-gradient(circle at 0% 0%, ${COLORS.glow}33 0%, transparent 60%)` }} />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none"
           style={{ background: `radial-gradient(circle at 100% 100%, ${COLORS.accent}24 0%, transparent 60%)` }} />

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-12" style={{ background: COLORS.accent }} />
          <span className="font-mono text-xs tracking-[0.3em] uppercase" style={{ color: COLORS.accent }}>
            03 · Get in touch
          </span>
          <div className="h-px w-12" style={{ background: COLORS.accent }} />
        </div>

        <h2 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: COLORS.textCool }}>
          Let&apos;s talk
        </h2>
        <p className="text-lg max-w-2xl mx-auto mb-4 leading-relaxed" style={{ color: COLORS.textMuted }}>
          Open to opportunities in product engineering, platform engineering, and full-stack roles —
          especially teams working on edge computing, developer tooling, and line-of-business systems
          where engineering decisions have measurable business impact.
        </p>
        <p className="text-base max-w-xl mx-auto mb-10" style={{ color: `${COLORS.textMuted}aa` }}>
          Also happy to consult on Cloudflare Workers migrations, Apps Script → modern stack transitions,
          and ERP/line-of-business system design.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
          <a href="https://github.com/Abhinavrandai" target="_blank" rel="noopener noreferrer"
             className="flex flex-col items-center gap-2 p-4 rounded transition-all hover:scale-105"
             style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(77,168,218,0.2)' }}>
            <GithubIcon className="w-5 h-5" style={{ color: COLORS.accent }} />
            <span className="font-mono text-xs" style={{ color: COLORS.textCool }}>GitHub</span>
            <span className="text-xs" style={{ color: COLORS.textMuted }}>Abhinavrandai</span>
          </a>
          <a href="https://linkedin.com/in/abhinavrandai" target="_blank" rel="noopener noreferrer"
             className="flex flex-col items-center gap-2 p-4 rounded transition-all hover:scale-105"
             style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(77,168,218,0.2)' }}>
            <LinkedinIcon className="w-5 h-5" style={{ color: COLORS.accent }} />
            <span className="font-mono text-xs" style={{ color: COLORS.textCool }}>LinkedIn</span>
            <span className="text-xs" style={{ color: COLORS.textMuted }}>abhinavrandai</span>
          </a>
          <a href="mailto:abhinavrandai@gmail.com"
             className="flex flex-col items-center gap-2 p-4 rounded transition-all hover:scale-105"
             style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(77,168,218,0.2)' }}>
            <MailIcon className="w-5 h-5" style={{ color: COLORS.accent }} />
            <span className="font-mono text-xs" style={{ color: COLORS.textCool }}>Email</span>
            <span className="text-xs" style={{ color: COLORS.textMuted }}>gmail.com</span>
          </a>
          <a href="tel:+917058317661"
             className="flex flex-col items-center gap-2 p-4 rounded transition-all hover:scale-105"
             style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(77,168,218,0.2)' }}>
            <PhoneIcon className="w-5 h-5" style={{ color: COLORS.accent }} />
            <span className="font-mono text-xs" style={{ color: COLORS.textCool }}>Phone</span>
            <span className="text-xs" style={{ color: COLORS.textMuted }}>+91 70583 17661</span>
          </a>
        </div>
      </div>
    </section>
  )
}

function PortfolioView({ projects, onSelect }: { projects: Project[]; onSelect: (p: Project) => void }) {
  return (
    <main className="min-h-screen">
      <Nav />
      <PortfolioHero />
      <AboutSection />
      <ProjectsGrid projects={projects} onSelect={onSelect} />
      <ContactSection />
      <Footer />
    </main>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// CASE STUDY VIEW (renders when a project is selected)
// ═══════════════════════════════════════════════════════════════════════════
function CaseStudyHero({ project }: { project: Project }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16"
             style={{ background: COLORS.bgDark }}>
      <div className="absolute top-0 left-0 w-[500px] h-[500px] pointer-events-none"
           style={{ background: `radial-gradient(circle at 0% 0%, ${COLORS.glow}33 0%, transparent 60%)` }} />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none"
           style={{ background: `radial-gradient(circle at 100% 100%, ${COLORS.accent}24 0%, transparent 60%)` }} />

      <div className="relative max-w-6xl mx-auto px-6 py-20 w-full">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-px w-12" style={{ background: COLORS.accent }} />
          <span className="font-mono text-xs tracking-[0.3em] uppercase" style={{ color: COLORS.accent }}>
            Case Study · {project.year}
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tight mb-6"
            style={{ color: COLORS.textCool, textShadow: `0 0 40px ${COLORS.accent}44` }}>
          {project.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm" style={{ color: COLORS.textMuted }}>
          <span className="flex items-center gap-2">
            <BriefcaseIcon className="w-4 h-4" /> {project.role}
          </span>
          <span className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" /> {project.year}
          </span>
          <span>·</span>
          <span>{project.client}</span>
        </div>

        <p className="text-lg md:text-xl max-w-3xl mb-10 leading-relaxed" style={{ color: COLORS.textMuted }}>
          {project.summary}
        </p>

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mb-12">
          {project.stats.map((s) => (
            <div key={s.label}>
              <div className="text-4xl md:text-5xl font-black tracking-tight"
                   style={{ color: COLORS.accent, fontFamily: 'Georgia, serif' }}>
                {s.num}
              </div>
              <div className="text-xs mt-2 tracking-widest uppercase" style={{ color: COLORS.textMuted }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <a href="#case-content"
             className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-medium transition-all hover:scale-105"
             style={{ background: COLORS.accent, color: COLORS.bgDark }}>
            Read the case study <ArrowRightIcon className="w-4 h-4" />
          </a>
          {project.pdfUrl && (
            <a href={project.pdfUrl} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-mono transition-all hover:bg-white/5"
               style={{ border: `1px solid ${COLORS.accent}55`, color: COLORS.textCool }}>
              <ExternalLinkIcon className="w-4 h-4" /> Download full PDF
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

function CaseStudySection({ id, num, title, dark = false, children }: {
  id: string; num: string; title: string; dark?: boolean; children: React.ReactNode
}) {
  const bg = dark ? COLORS.bgDark : COLORS.bgLight
  const fg = dark ? COLORS.textCool : COLORS.textDark
  const muted = dark ? COLORS.textMuted : COLORS.textDarkMuted
  const accentColor = dark ? COLORS.accent : COLORS.accentDark
  return (
    <section id={id} className="py-24 px-6" style={{ background: bg }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-12" style={{ background: accentColor }} />
            <span className="font-mono text-xs tracking-[0.3em] uppercase" style={{ color: accentColor }}>
              {num}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: fg }}>{title}</h2>
        </div>
        <div style={{ color: muted }}>{children}</div>
      </div>
    </section>
  )
}

function CaseStudyContent({ project }: { project: Project }) {
  if (project.slug !== 'jalaram-feeds-erp') {
    // Future projects: implement their case study content here
    return (
      <CaseStudySection id="case-content" num="01" title="Case study coming soon">
        <p>Detailed case study for {project.title} will be added soon.</p>
      </CaseStudySection>
    )
  }

  return (
    <>
      {/* Architecture */}
      <CaseStudySection id="case-content" num="01 · Architecture" title="The Gate Pattern" dark={false}>
        <p className="text-lg mb-8" style={{ color: COLORS.textDarkMuted }}>
          One public Worker handles login, routing, and dashboard aggregation. Five private Workers
          are reachable only through Cloudflare service bindings — they have no public URL at all.
        </p>

        <div className="mb-10">
          <div className="rounded-lg p-6 text-center"
               style={{ background: COLORS.headerFill, color: 'white', border: `1px solid ${COLORS.accent}` }}>
            <div className="font-mono text-sm tracking-widest uppercase opacity-80 mb-2">Public URL</div>
            <div className="text-2xl font-bold mb-2">jalaram-gate.workers.dev</div>
            <div className="text-sm opacity-90">
              Login · Auth · Dashboard · Admin · Day End · CRM · Accounts · 8 D1 DBs (read)
            </div>
            <div className="mt-3 font-mono text-xs opacity-75">cron: */15 · 9pm · 9am · 10am IST</div>
          </div>

          <div className="text-center py-4">
            <div className="font-mono text-xs tracking-widest uppercase" style={{ color: COLORS.accentDark }}>
              ↓ service bindings (HMAC-signed · GATE_SECRET)
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {JALARAM_WORKERS.slice(1).map((w) => (
              <div key={w.name}
                   className="rounded p-4 border"
                   style={{ background: COLORS.bgLightCard, borderColor: COLORS.border }}>
                <div className="font-mono text-xs font-bold mb-1" style={{ color: COLORS.headerFill }}>
                  {w.name.replace('jalaram-', '')}
                </div>
                <div className="text-xs leading-snug" style={{ color: COLORS.textDarkMuted }}>
                  {w.role}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Worker inventory table */}
        <div className="rounded-lg overflow-hidden border" style={{ borderColor: COLORS.border }}>
          <table className="w-full text-sm">
            <thead style={{ background: COLORS.headerFill, color: 'white' }}>
              <tr>
                <th className="text-left p-3 font-semibold">Worker</th>
                <th className="text-left p-3 font-semibold hidden md:table-cell">Role</th>
                <th className="text-left p-3 font-semibold">Cron</th>
                <th className="text-right p-3 font-semibold">Lines</th>
                <th className="text-right p-3 font-semibold hidden md:table-cell">DBs</th>
              </tr>
            </thead>
            <tbody>
              {JALARAM_WORKERS.map((w, i) => (
                <tr key={w.name} style={{ background: i % 2 === 0 ? 'white' : '#eef3fa' }}>
                  <td className="p-3">
                    <div className="font-mono text-xs font-bold" style={{ color: COLORS.textDark }}>{w.name}</div>
                    <div className="text-xs" style={{ color: COLORS.textDarkMuted }}>
                      {w.public ? '🌐 public' : '🔒 private'}
                    </div>
                  </td>
                  <td className="p-3 hidden md:table-cell text-xs" style={{ color: COLORS.textDarkMuted }}>{w.desc}</td>
                  <td className="p-3 font-mono text-xs" style={{ color: COLORS.textDark }}>{w.cron}</td>
                  <td className="p-3 text-right font-mono font-bold" style={{ color: COLORS.accentDark }}>{w.lines}</td>
                  <td className="p-3 text-right font-mono hidden md:table-cell" style={{ color: COLORS.textDark }}>{w.dbs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CaseStudySection>

      {/* Features */}
      <CaseStudySection id="features" num="02 · Real-world features" title="Four features that prove the edge pays off" dark={true}>
        <p className="text-lg mb-8" style={{ color: COLORS.textMuted }}>
          Each one solves a real operational problem and would have been dramatically more expensive
          (or impossible) on the previous Apps Script stack.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {JALARAM_FEATURES.map((f) => {
            const Icon = f.icon
            return (
              <div key={f.title}
                   className="rounded-lg p-6 transition-all hover:scale-[1.02]"
                   style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(77, 168, 218, 0.2)' }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded flex items-center justify-center"
                       style={{ background: COLORS.glow + '33' }}>
                    <Icon className="w-5 h-5" style={{ color: COLORS.accent }} />
                  </div>
                  <span className="font-mono text-xs px-2 py-1 rounded"
                        style={{ background: COLORS.accent + '22', color: COLORS.accent }}>
                    {f.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.textCool }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: COLORS.textMuted }}>{f.desc}</p>
              </div>
            )
          })}
        </div>
      </CaseStudySection>

      {/* Migration */}
      <CaseStudySection id="migration" num="03 · Migration story" title="Apps Script → Workers, with zero downtime" dark={false}>
        <p className="text-lg mb-8" style={{ color: COLORS.textDarkMuted }}>
          The mandate was uncompromising: zero data loss, zero downtime, and no retraining for end users.
          The trick was a 200-line proxy shim called <code className="font-mono text-base" style={{ color: COLORS.accentDark }}>gas-shim.js</code>.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="rounded-lg p-6" style={{ background: 'white', border: `1px solid ${COLORS.border}` }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: COLORS.textDark }}>The gas-shim.js trick</h3>
            <p className="text-sm leading-relaxed mb-3" style={{ color: COLORS.textDarkMuted }}>
              The legacy frontends spoke <code className="font-mono text-xs">google.script.run</code> — a
              positional-argument RPC contract. We re-implemented that surface in a 200-line browser
              shim that transparently proxied every call to a Worker&apos;s
              <code className="font-mono text-xs"> /rpc/*</code> endpoint.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: COLORS.textDarkMuted }}>
              From the frontend&apos;s perspective, nothing changed. The migration proceeded module by
              module — Sales first, then Purchase, then Production — without ever flag-daying the
              whole application.
            </p>
          </div>
          <div className="rounded-lg p-6" style={{ background: 'white', border: `1px solid ${COLORS.border}` }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: COLORS.textDark }}>Service bindings, not public URLs</h3>
            <p className="text-sm leading-relaxed mb-3" style={{ color: COLORS.textDarkMuted }}>
              Five of six Workers have <code className="font-mono text-xs">workers_dev: false</code>.
              They are reachable only via Cloudflare service bindings — server-to-server calls
              authenticated by a shared HMAC secret that never leaves Cloudflare&apos;s network.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: COLORS.textDarkMuted }}>
              Attack surface is one worker wide instead of six. Module workers do not need their own
              auth layer — they trust the Gate&apos;s signed handoff.
            </p>
          </div>
        </div>

        <div className="rounded-lg overflow-hidden border" style={{ borderColor: COLORS.border }}>
          <table className="w-full text-sm">
            <thead style={{ background: COLORS.headerFill, color: 'white' }}>
              <tr>
                <th className="text-left p-3 font-semibold">Aspect</th>
                <th className="text-left p-3 font-semibold">Before (Apps Script)</th>
                <th className="text-left p-3 font-semibold">After (Cloudflare Workers)</th>
              </tr>
            </thead>
            <tbody>
              {JALARAM_MIGRATION.map((row, i) => (
                <tr key={row.aspect} style={{ background: i % 2 === 0 ? 'white' : '#eef3fa' }}>
                  <td className="p-3 font-semibold" style={{ color: COLORS.textDark }}>{row.aspect}</td>
                  <td className="p-3" style={{ color: COLORS.textDarkMuted }}>
                    <span className="font-mono text-xs">{row.before}</span>
                  </td>
                  <td className="p-3" style={{ color: COLORS.textDark }}>
                    <span className="font-mono text-xs">{row.after}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CaseStudySection>

      {/* Engineering */}
      <CaseStudySection id="engineering" num="04 · Engineering rigor" title="Lazy senior dev, TDD, B-number changelog" dark={false}>
        <p className="text-lg mb-8" style={{ color: COLORS.textDarkMuted }}>
          The codebase ships with 39 plain-node test files, a &quot;lazy senior dev&quot; philosophy
          (AGENTS.md), and a sequential B-number tag on every change since B1.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="rounded-lg p-6" style={{ background: 'white', border: `1px solid ${COLORS.border}` }}>
            <div className="flex items-center gap-3 mb-3">
              <CheckCircleIcon className="w-5 h-5" style={{ color: COLORS.accentDark }} />
              <h3 className="font-bold" style={{ color: COLORS.textDark }}>39 test files</h3>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: COLORS.textDarkMuted }}>
              Plain Node.js, no Jest/Mocha. <code className="font-mono text-xs">node:sqlite</code> as in-memory
              D1 fake, mocked <code className="font-mono text-xs">fetch</code>. Tests run in milliseconds,
              never touch live data.
            </p>
          </div>
          <div className="rounded-lg p-6" style={{ background: 'white', border: `1px solid ${COLORS.border}` }}>
            <div className="flex items-center gap-3 mb-3">
              <ZapIcon className="w-5 h-5" style={{ color: COLORS.accentDark }} />
              <h3 className="font-bold" style={{ color: COLORS.textDark }}>Lazy senior dev</h3>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: COLORS.textDarkMuted }}>
              <em>AGENTS.md</em> opens with: &quot;The best code is the code never written.&quot; Seven-rung
              ladder: YAGNI → existing helper → stdlib → platform → dependency → one-liner → minimum code.
            </p>
          </div>
          <div className="rounded-lg p-6" style={{ background: 'white', border: `1px solid ${COLORS.border}` }}>
            <div className="flex items-center gap-3 mb-3">
              <GitBranchIcon className="w-5 h-5" style={{ color: COLORS.accentDark }} />
              <h3 className="font-bold" style={{ color: COLORS.textDark }}>B-number changelog</h3>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: COLORS.textDarkMuted }}>
              Every change gets a sequential <code className="font-mono text-xs">B&lt;n&gt;</code> tag in three
              places: commit message, code comment, README changelog. Current highest is <strong>B167</strong>.
            </p>
          </div>
        </div>

        {/* Code snippet */}
        <div className="rounded-lg overflow-hidden" style={{ background: COLORS.bgDark }}>
          <div className="flex items-center justify-between px-4 py-2"
               style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(77,168,218,0.2)' }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <div className="w-2 h-2 rounded-full bg-green-400" />
            </div>
            <span className="font-mono text-xs" style={{ color: COLORS.textMuted }}>
              workers/1-gate/index.js — password hashing
            </span>
          </div>
          <pre className="p-6 text-xs md:text-sm overflow-x-auto leading-relaxed"
               style={{ color: COLORS.textCool, fontFamily: 'var(--font-geist-mono), monospace' }}>
            <code>{JALARAM_CODE_SNIPPET}</code>
          </pre>
        </div>
      </CaseStudySection>

      {/* Tech stack */}
      <CaseStudySection id="tech-stack" num="05 · Tech stack" title="What&apos;s under the hood" dark={false}>
        <div className="flex flex-wrap gap-2">
          {JALARAM_TECH_STACK.map((tech) => (
            <span key={tech}
                  className="px-3 py-1.5 rounded text-sm font-mono transition-all hover:scale-105"
                  style={{ background: 'white', border: `1px solid ${COLORS.border}`, color: COLORS.textDark }}>
              {tech}
            </span>
          ))}
        </div>
      </CaseStudySection>
    </>
  )
}

function CaseStudyView({ project, onBack }: { project: Project; onBack: () => void }) {
  // Scroll to top on case study open
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [project.slug])

  return (
    <main className="min-h-screen">
      <Nav onBack={onBack} />
      <CaseStudyHero project={project} />
      <CaseStudyContent project={project} />
      <ContactSection />
      <Footer />
    </main>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════
export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  if (selectedProject) {
    return <CaseStudyView project={selectedProject} onBack={() => setSelectedProject(null)} />
  }
  return <PortfolioView projects={PROJECTS} onSelect={setSelectedProject} />
}
