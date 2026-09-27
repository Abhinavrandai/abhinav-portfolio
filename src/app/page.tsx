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
  SendIcon,
  LoaderIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
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
    role: 'Full-Stack Developer',
    client: 'Manufacturing & Feed Operations',
    tagline: 'Production ERP & Business Operations Platform',
    summary:
      'A production-oriented ERP connecting Purchase, Inventory, Production, Quality, Sales and Dispatch through a centralized Cloudflare-based architecture.',
    techBadges: ['Cloudflare Workers', 'D1', 'R2', 'Service Bindings', 'WhatsApp API', 'RBAC', 'Workers AI', 'Browser Rendering'],
    stats: [
      { num: '6', label: 'Workers' },
      { num: '8', label: 'D1 DBs' },
      { num: '22K', label: 'JS LOC' },
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
              className="group text-left rounded-lg p-7 transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 w-full"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(77, 168, 218, 0.2)',
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="font-mono text-xs mb-1" style={{ color: COLORS.accent }}>
                    {p.year}
                  </div>
                  <h3 className="text-2xl font-bold mb-1" style={{ color: COLORS.textCool }}>
                    {p.title}
                  </h3>
                  <div className="text-sm font-medium mb-2" style={{ color: COLORS.accent }}>
                    {p.tagline}
                  </div>
                  <div className="text-xs" style={{ color: COLORS.textMuted }}>
                    {p.role} · {p.client}
                  </div>
                </div>
                <ArrowRightIcon className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0 ml-3"
                                style={{ color: COLORS.accent }} />
              </div>

              <p className="text-sm leading-relaxed mb-5" style={{ color: COLORS.textMuted }}>
                {p.summary}
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-4 gap-2 mb-5 py-3 px-2 rounded"
                   style={{ background: 'rgba(77, 168, 218, 0.05)' }}>
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
              <div className="flex flex-wrap gap-1.5 mb-5">
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

              {/* CTA */}
              <div className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: 'rgba(77, 168, 218, 0.15)' }}>
                <span className="text-sm font-medium" style={{ color: COLORS.accent }}>
                  View Case Study
                </span>
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-all"
                                style={{ color: COLORS.accent }} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

// ━━━ Contact Form (Web3Forms integration) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Get your free access key from https://web3forms.com (enter your email,
// receive key via email). Replace the placeholder below.
const WEB3FORMS_ACCESS_KEY = 'YOUR_ACCESS_KEY_HERE'

function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string>('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    const form = e.currentTarget
    const formData = new FormData(form)
    formData.append('access_key', WEB3FORMS_ACCESS_KEY)
    formData.append('from_name', 'Abhinav Portfolio')
    formData.append('subject', `New message from ${formData.get('name') || 'Portfolio visitor'}`)

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()

      if (data.success) {
        setStatus('success')
        form.reset()
        // Reset success message after 6 seconds
        setTimeout(() => setStatus('idle'), 6000)
      } else {
        setStatus('error')
        setErrorMsg(data.message || 'Submission failed. Please try again.')
      }
    } catch (err) {
      setStatus('error')
      setErrorMsg('Network error. Please check your connection and try again.')
    }
  }

  // Show placeholder notice if access key not configured
  const isKeyConfigured = WEB3FORMS_ACCESS_KEY !== 'YOUR_ACCESS_KEY_HERE' &&
                          WEB3FORMS_ACCESS_KEY.length > 10

  if (!isKeyConfigured) {
    return (
      <div className="max-w-xl mx-auto mt-12 rounded-lg p-5 text-center"
           style={{ background: 'rgba(255,255,255,0.03)', border: `1px dashed ${COLORS.accent}66` }}>
        <AlertCircleIcon className="w-5 h-5 mx-auto mb-2" style={{ color: COLORS.accent }} />
        <p className="text-sm" style={{ color: COLORS.textMuted }}>
          Contact form is being configured. Until then, please reach out via the channels above.
        </p>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="max-w-xl mx-auto mt-12 rounded-lg p-8 text-center"
           style={{ background: 'rgba(77,168,218,0.08)', border: `1px solid ${COLORS.accent}` }}>
        <CheckCircle2Icon className="w-10 h-10 mx-auto mb-3" style={{ color: COLORS.accent }} />
        <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.textCool }}>
          Message sent!
        </h3>
        <p className="text-sm" style={{ color: COLORS.textMuted }}>
          Thanks for reaching out. I&apos;ll get back to you within 24 hours.
        </p>
      </div>
    )
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(77,168,218,0.25)',
    borderRadius: '6px',
    padding: '10px 14px',
    color: COLORS.textCool,
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 500,
    color: COLORS.textMuted,
    marginBottom: '6px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto mt-12 space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" style={labelStyle}>Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Your name"
            style={inputStyle}
            onFocus={(e) => e.currentTarget.style.borderColor = COLORS.accent}
            onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(77,168,218,0.25)'}
          />
        </div>
        <div>
          <label htmlFor="email" style={labelStyle}>Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            style={inputStyle}
            onFocus={(e) => e.currentTarget.style.borderColor = COLORS.accent}
            onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(77,168,218,0.25)'}
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" style={labelStyle}>Subject</label>
        <input
          id="subject"
          name="subject"
          type="text"
          placeholder="What's this about?"
          style={inputStyle}
          onFocus={(e) => e.currentTarget.style.borderColor = COLORS.accent}
          onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(77,168,218,0.25)'}
        />
      </div>

      <div>
        <label htmlFor="message" style={labelStyle}>Message *</label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tell me about the role, project, or just say hi..."
          style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
          onFocus={(e) => e.currentTarget.style.borderColor = COLORS.accent}
          onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(77,168,218,0.25)'}
        />
      </div>

      {/* Honeypot anti-spam field (hidden from users) */}
      <input
        type="checkbox"
        name="botcheck"
        style={{ display: 'none' }}
        tabIndex={-1}
        defaultChecked={false}
      />

      {status === 'error' && (
        <div className="rounded p-3 flex items-start gap-2"
             style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.4)' }}>
          <AlertCircleIcon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#ff6b6b' }} />
          <p className="text-sm" style={{ color: '#ff9999' }}>{errorMsg}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded font-medium transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ background: COLORS.accent, color: COLORS.bgDark }}
      >
        {status === 'submitting' ? (
          <>
            <LoaderIcon className="w-4 h-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Send message
            <SendIcon className="w-4 h-4" />
          </>
        )}
      </button>

      <p className="text-center text-xs" style={{ color: `${COLORS.textMuted}88` }}>
        Form submissions are delivered to abhinavrandai403@gmail.com via Web3Forms.
      </p>
    </form>
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
          <a href="https://www.linkedin.com/in/abhinav-randai-6980b9234/" target="_blank" rel="noopener noreferrer"
             className="flex flex-col items-center gap-2 p-4 rounded transition-all hover:scale-105"
             style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(77,168,218,0.2)' }}>
            <LinkedinIcon className="w-5 h-5" style={{ color: COLORS.accent }} />
            <span className="font-mono text-xs" style={{ color: COLORS.textCool }}>LinkedIn</span>
            <span className="text-xs" style={{ color: COLORS.textMuted }}>abhinav-randai</span>
          </a>
          <a href="mailto:abhinavrandai403@gmail.com"
             className="flex flex-col items-center gap-2 p-4 rounded transition-all hover:scale-105"
             style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(77,168,218,0.2)' }}>
            <MailIcon className="w-5 h-5" style={{ color: COLORS.accent }} />
            <span className="font-mono text-xs" style={{ color: COLORS.textCool }}>Email</span>
            <span className="text-xs" style={{ color: COLORS.textMuted }}>abhinavrandai403</span>
          </a>
          <a href="tel:+917058317661"
             className="flex flex-col items-center gap-2 p-4 rounded transition-all hover:scale-105"
             style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(77,168,218,0.2)' }}>
            <PhoneIcon className="w-5 h-5" style={{ color: COLORS.accent }} />
            <span className="font-mono text-xs" style={{ color: COLORS.textCool }}>Phone</span>
            <span className="text-xs" style={{ color: COLORS.textMuted }}>+91 70583 17661</span>
          </a>
        </div>

        {/* Contact Form */}
        <ContactForm />
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

        <h1 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tight mb-3"
            style={{ color: COLORS.textCool, textShadow: `0 0 40px ${COLORS.accent}44` }}>
          {project.title}
        </h1>

        <p className="text-xl md:text-2xl font-medium mb-6" style={{ color: COLORS.accent }}>
          {project.tagline}
        </p>

        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm" style={{ color: COLORS.textMuted }}>
          <span className="flex items-center gap-2">
            <BriefcaseIcon className="w-4 h-4" /> {project.role}
          </span>
          <span className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" /> {project.year}
          </span>
          <span>·</span>
          <span>{project.client}</span>
          <span>·</span>
          <span>Production System</span>
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
    return (
      <CaseStudySection id="case-content" num="01" title="Case study coming soon">
        <p>Detailed case study for {project.title} will be added soon.</p>
      </CaseStudySection>
    )
  }

  return (
    <>
      {/* 01 — The Business Problem */}
      <CaseStudySection id="case-content" num="01 — The Business Problem" title="Before the ERP" dark={false}>
        <p className="text-lg mb-6" style={{ color: COLORS.textDarkMuted }}>
          Jalaram Feeds operates multiple interconnected business processes including procurement,
          inventory, production, sales, dispatch, laboratory operations and reporting. Previously,
          several operational activities depended heavily on spreadsheets, manual data entry and
          disconnected workflows.
        </p>
        <p className="text-base mb-6" style={{ color: COLORS.textDarkMuted }}>
          This created challenges such as:
        </p>
        <ul className="grid md:grid-cols-2 gap-2 mb-6">
          {[
            'Repetitive data entry',
            'Difficulty maintaining consistent master data',
            'Manual stock calculations',
            'Delayed management reporting',
            'Higher risk of data-entry errors',
            'Limited traceability between transactions',
            'Difficulty maintaining role-based access',
            'Increasing complexity as operational data grew',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm" style={{ color: COLORS.textDark }}>
              <span style={{ color: COLORS.accentDark }}>•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-base" style={{ color: COLORS.textDark }}>
          The objective was to build a centralized ERP platform that could bring these processes
          into one connected system.
        </p>
      </CaseStudySection>

      {/* 02 — The Solution */}
      <CaseStudySection id="solution" num="02 — The Solution" title="A centralized ERP platform" dark={true}>
        <p className="text-lg mb-6" style={{ color: COLORS.textMuted }}>
          I designed and developed a centralized ERP platform that connects core business operations
          through a common data and workflow architecture.
        </p>
        <p className="text-base mb-6" style={{ color: COLORS.textMuted }}>The system brings together:</p>
        <div className="rounded-lg p-5 mb-6 font-mono text-sm md:text-base"
             style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${COLORS.accent}33` }}>
          <div className="text-center" style={{ color: COLORS.accent }}>
            Purchase → Inventory → Production → Quality → Sales → Dispatch → Reporting
          </div>
        </div>
        <p className="text-base" style={{ color: COLORS.textMuted }}>
          Instead of maintaining isolated spreadsheets and manual calculations, transactions are
          connected so that operational activities can update downstream records and reports.
        </p>
      </CaseStudySection>

      {/* 03 — System Architecture */}
      <CaseStudySection id="architecture" num="03 — System Architecture" title="Cloudflare Edge + D1 + R2" dark={false}>
        <p className="text-lg mb-6" style={{ color: COLORS.textDarkMuted }}>
          The architecture was designed around modular business domains rather than keeping the
          entire application dependent on a single monolithic data structure.
        </p>
        <div className="rounded-lg overflow-hidden border mb-6" style={{ borderColor: COLORS.border }}>
          <pre className="p-5 text-xs md:text-sm overflow-x-auto leading-relaxed"
               style={{ background: COLORS.bgDark, color: COLORS.textCool, fontFamily: 'var(--font-geist-mono), monospace' }}>
{`                         USERS
                           │
                           ▼
                 ┌──────────────────┐
                 │ Authentication & │
                 │      RBAC        │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │ Cloudflare Edge  │
                 │     Workers      │
                 └────────┬─────────┘
                          │
          ┌───────────────┼────────────────┐
          │               │                │
          ▼               ▼                ▼
      Purchase        Production        Sales
          │               │                │
          └───────────────┼────────────────┘
                          ▼
                    D1 Databases
                          │
             ┌────────────┴────────────┐
             ▼                         ▼
        Transaction Data          Reporting
             │                         │
             └────────────┬────────────┘
                          ▼
                    Management
                    Intelligence

                  R2 — File Storage`}
          </pre>
        </div>
      </CaseStudySection>

      {/* 04 — Core ERP Modules */}
      <CaseStudySection id="modules" num="04 — Core ERP Modules" title="What the system manages" dark={true}>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            { title: 'Purchase Management', items: ['Purchase entry', 'Supplier management', 'Item master integration', 'Rate management', 'Quantity tracking', 'Purchase history', 'Transaction validation'] },
            { title: 'Inventory Management', items: ['Movement of raw materials, finished goods', 'Transaction-level tracking (not just balances)', 'Opening + Purchase + Production + Transfer', '− Consumption − Dispatch ± Adjustment = Closing Stock'] },
            { title: 'Production Management', items: ['Production records for different stages', 'Input materials tracked', 'Output quantities tracked', 'Batch records', 'Consumption + variance', 'Stock impact'] },
            { title: 'Sales & Dispatch', items: ['Sales entry', 'Dispatch management', 'Product/quantity tracking', 'Customer information', 'Stock impact', 'Transaction history'] },
            { title: 'Quality / Laboratory', items: ['Quality info as part of operational workflow', 'Production & quality remain connected', 'No isolated records', 'Linked to purchase arrivals'] },
            { title: 'Reporting & MIS', items: ['Stock reports', 'Purchase / production / sales / dispatch', 'Transaction analysis', 'User/activity information', 'Management-level dashboards'] },
          ].map((m) => (
            <div key={m.title}
                 className="rounded-lg p-5"
                 style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(77,168,218,0.2)' }}>
              <h3 className="text-base font-bold mb-3" style={{ color: COLORS.accent }}>{m.title}</h3>
              <ul className="space-y-1">
                {m.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs" style={{ color: COLORS.textMuted }}>
                    <span style={{ color: COLORS.accent }}>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CaseStudySection>

      {/* 05 — Authentication & RBAC */}
      <CaseStudySection id="rbac" num="05 — Authentication & RBAC" title="Role-based access control" dark={false}>
        <p className="text-lg mb-6" style={{ color: COLORS.textDarkMuted }}>
          Instead of allowing every user to access every operation, permissions are structured around
          responsibilities.
        </p>
        <div className="rounded-lg overflow-hidden border mb-6" style={{ borderColor: COLORS.border }}>
          <pre className="p-5 text-xs md:text-sm overflow-x-auto leading-relaxed"
               style={{ background: COLORS.bgDark, color: COLORS.textCool, fontFamily: 'var(--font-geist-mono), monospace' }}>
{`                    USER
                     │
                     ▼
               AUTHENTICATION
                     │
                     ▼
                    ROLE
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
     Purchase    Production      Sales
     Access        Access        Access`}
          </pre>
        </div>
        <p className="text-base" style={{ color: COLORS.textDark }}>
          This provides a controlled environment for operational data — a salesperson&apos;s session
          cannot, by construction, open the labour payroll module.
        </p>
      </CaseStudySection>

      {/* 06 — Data Architecture */}
      <CaseStudySection id="data" num="06 — Data Architecture" title="Modular business domains" dark={true}>
        <p className="text-lg mb-6" style={{ color: COLORS.textMuted }}>
          The system uses Cloudflare D1 databases for transactional data and R2 for file/object
          storage. The architecture was designed around modular business domains rather than keeping
          the entire application dependent on a single monolithic data structure.
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            { label: 'Workers', value: '6' },
            { label: 'D1 Databases', value: '8' },
            { label: 'Service Bindings', value: '5' },
            { label: 'Object Storage (R2)', value: '1 bucket' },
            { label: 'API Communication', value: 'REST-style /rpc/*' },
            { label: 'Authentication + RBAC', value: 'Yes' },
          ].map((row) => (
            <div key={row.label}
                 className="flex items-center justify-between rounded p-3"
                 style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(77,168,218,0.2)' }}>
              <span className="text-sm" style={{ color: COLORS.textMuted }}>{row.label}</span>
              <span className="font-mono text-sm font-bold" style={{ color: COLORS.accent }}>{row.value}</span>
            </div>
          ))}
        </div>
      </CaseStudySection>

      {/* 07 — Engineering Approach */}
      <CaseStudySection id="engineering" num="07 — Engineering Approach" title="How it was built" dark={false}>
        <p className="text-lg mb-6" style={{ color: COLORS.textDarkMuted }}>
          One of the major goals was to move from spreadsheet-oriented processes toward a structured
          application architecture.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: 'Modular architecture', desc: 'Business functions are separated into logical modules so that individual workflows can evolve independently.' },
            { title: 'Validation', desc: 'Important transactions are validated before affecting downstream records.' },
            { title: 'Traceability', desc: 'Transactions are recorded so that operational changes can be traced back to their source.' },
            { title: 'Reusable components', desc: 'Common functionality is designed to be reused across ERP modules rather than duplicated.' },
            { title: 'Testing', desc: 'The system includes automated tests covering important application behavior.' },
          ].map((e) => (
            <div key={e.title} className="rounded-lg p-5" style={{ background: 'white', border: `1px solid ${COLORS.border}` }}>
              <div className="flex items-center gap-3 mb-2">
                <CheckCircleIcon className="w-4 h-4" style={{ color: COLORS.accentDark }} />
                <h3 className="font-bold" style={{ color: COLORS.textDark }}>{e.title}</h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: COLORS.textDarkMuted }}>{e.desc}</p>
            </div>
          ))}
        </div>
      </CaseStudySection>

      {/* 08 — Spreadsheet → ERP */}
      <CaseStudySection id="transformation" num="08 — Spreadsheet → ERP" title="The transformation" dark={true}>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-lg p-5"
               style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${COLORS.textMuted}55` }}>
            <div className="font-mono text-xs mb-3" style={{ color: COLORS.textMuted }}>BEFORE</div>
            <pre className="text-xs md:text-sm leading-relaxed" style={{ color: COLORS.textMuted, fontFamily: 'var(--font-geist-mono), monospace' }}>
{`Spreadsheet
    ↓
Manual Entry
    ↓
Manual Calculation
    ↓
Separate Reports
    ↓
Management Review`}
            </pre>
          </div>
          <div className="rounded-lg p-5"
               style={{ background: 'rgba(77,168,218,0.05)', border: `1px solid ${COLORS.accent}` }}>
            <div className="font-mono text-xs mb-3" style={{ color: COLORS.accent }}>AFTER</div>
            <pre className="text-xs md:text-sm leading-relaxed" style={{ color: COLORS.textCool, fontFamily: 'var(--font-geist-mono), monospace' }}>
{`ERP Transaction
       ↓
Validation
       ↓
Centralized Database
       ↓
Automatic Stock / Business Logic
       ↓
Reports & Dashboards
       ↓
Management Information`}
            </pre>
          </div>
        </div>
      </CaseStudySection>

      {/* 09 — Technical Stack */}
      <CaseStudySection id="tech-stack" num="09 — Technical Stack" title="What it&apos;s built with" dark={false}>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {[
            { title: 'Frontend', items: ['HTML', 'CSS', 'JavaScript', 'Responsive UI', 'Reusable interface components'] },
            { title: 'Backend', items: ['Cloudflare Workers', 'REST-style APIs', 'Service bindings', 'Server-side business logic'] },
            { title: 'Database', items: ['Cloudflare D1', 'Relational data modelling', 'Transaction-oriented architecture'] },
            { title: 'Storage', items: ['Cloudflare R2'] },
            { title: 'Security', items: ['Authentication', 'Role-based access control', 'Permission-based workflows', 'Input validation'] },
            { title: 'Development', items: ['JavaScript', 'Git', 'Automated testing', 'Cloudflare deployment'] },
          ].map((s) => (
            <div key={s.title} className="rounded-lg p-5" style={{ background: 'white', border: `1px solid ${COLORS.border}` }}>
              <h3 className="font-bold text-sm mb-3" style={{ color: COLORS.headerFill }}>{s.title}</h3>
              <ul className="space-y-1">
                {s.items.map((i) => (
                  <li key={i} className="text-xs flex items-start gap-2" style={{ color: COLORS.textDarkMuted }}>
                    <span style={{ color: COLORS.accentDark }}>•</span>
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CaseStudySection>

      {/* 10 — System Scale */}
      <CaseStudySection id="scale" num="10 — System Scale" title="Production-oriented engineering" dark={true}>
        <p className="text-lg mb-6" style={{ color: COLORS.textMuted }}>
          The current implementation demonstrates production-oriented engineering rather than a
          tutorial application.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { num: '6', label: 'Workers' },
            { num: '8', label: 'D1 Databases' },
            { num: '~22K', label: 'JS LOC' },
            { num: '39', label: 'Tests' },
          ].map((s) => (
            <div key={s.label} className="rounded p-5 text-center"
                 style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(77,168,218,0.2)' }}>
              <div className="text-3xl md:text-4xl font-black mb-1" style={{ color: COLORS.accent, fontFamily: 'Georgia, serif' }}>
                {s.num}
              </div>
              <div className="text-xs tracking-wider uppercase" style={{ color: COLORS.textMuted }}>{s.label}</div>
            </div>
          ))}
        </div>
        <p className="text-sm" style={{ color: COLORS.textMuted }}>
          The numbers describe the current implementation and may evolve as the system continues to develop.
        </p>
      </CaseStudySection>

      {/* 11 — Key Engineering Challenges */}
      <CaseStudySection id="challenges" num="11 — Key Engineering Challenges" title="Hard problems solved" dark={false}>
        <div className="space-y-5">
          {[
            { num: '01', title: 'Connecting independent business processes', desc: 'Purchase, inventory, production, sales and dispatch cannot be treated as isolated modules. A transaction in one module can affect another module. The system therefore needed consistent transaction flows.' },
            { num: '02', title: 'Maintaining stock accuracy', desc: 'Inventory is affected by several transaction types — Purchase, Consumption, Production, Transfer, Adjustment, Dispatch. The stock calculation logic needs to remain consistent across modules.' },
            { num: '03', title: 'Data validation', desc: 'Incorrect master data, units of measurement, quantities or rates can propagate errors into downstream reports. Validation rules were introduced at transaction boundaries to reduce these issues.' },
            { num: '04', title: 'Scaling beyond spreadsheet workflows', desc: 'As operational data grows, spreadsheet-based workflows become increasingly difficult to maintain. The architecture was therefore moved toward structured application → API → database-backed ERP.' },
          ].map((c) => (
            <div key={c.num} className="rounded-lg p-5" style={{ background: 'white', border: `1px solid ${COLORS.border}` }}>
              <div className="flex items-start gap-4">
                <div className="font-mono text-2xl font-black flex-shrink-0"
                     style={{ color: COLORS.accentDark, fontFamily: 'Georgia, serif' }}>
                  {c.num}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold mb-2" style={{ color: COLORS.textDark }}>{c.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: COLORS.textDarkMuted }}>{c.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CaseStudySection>

      {/* 12 — What I Built */}
      <CaseStudySection id="responsibilities" num="12 — What I Built" title="My responsibilities" dark={true}>
        <p className="text-lg mb-6" style={{ color: COLORS.textMuted }}>
          My responsibilities included designing and implementing:
        </p>
        <div className="grid md:grid-cols-2 gap-2">
          {[
            'ERP module architecture',
            'Database structures',
            'Business workflows',
            'APIs',
            'Authentication & RBAC',
            'Inventory logic',
            'Production workflows',
            'Purchase workflows',
            'Sales/dispatch workflows',
            'Reporting logic',
            'Cloudflare infrastructure',
            'Data validation',
            'Testing',
            'Deployment',
          ].map((item) => (
            <div key={item}
                 className="flex items-center gap-2 rounded p-2.5"
                 style={{ background: 'rgba(255,255,255,0.03)' }}>
              <CheckCircleIcon className="w-4 h-4 flex-shrink-0" style={{ color: COLORS.accent }} />
              <span className="text-sm" style={{ color: COLORS.textCool }}>{item}</span>
            </div>
          ))}
        </div>
      </CaseStudySection>

      {/* 13 — Business Impact */}
      <CaseStudySection id="impact" num="13 — Business Impact" title="What changed for the business" dark={false}>
        <div className="grid md:grid-cols-2 gap-5 mb-6">
          {[
            { title: 'One system', desc: 'for multiple business functions.' },
            { title: 'One source of operational data', desc: 'instead of disconnected records.' },
            { title: 'Connected transactions', desc: 'between purchase, inventory, production and sales.' },
            { title: 'Structured access control', desc: 'for different operational roles.' },
            { title: 'Faster access to management information', desc: 'through centralized reporting.' },
          ].map((b) => (
            <div key={b.title} className="rounded-lg p-5" style={{ background: 'white', border: `1px solid ${COLORS.border}` }}>
              <h3 className="font-bold mb-1" style={{ color: COLORS.textDark }}>{b.title}</h3>
              <p className="text-sm" style={{ color: COLORS.textDarkMuted }}>{b.desc}</p>
            </div>
          ))}
        </div>
        <div className="rounded p-4 text-sm italic"
             style={{ background: COLORS.bgLightCard, color: COLORS.textDarkMuted, borderLeft: `3px solid ${COLORS.accentDark}` }}>
          Note: Quantitative ROI or percentage improvements should only be added when they are
          supported by actual measured company data.
        </div>
      </CaseStudySection>

      {/* 14 — What I Learned */}
      <CaseStudySection id="learnings" num="14 — What I Learned" title="Lessons from the build" dark={true}>
        <p className="text-lg mb-6" style={{ color: COLORS.textMuted }}>
          Building this system changed my understanding of software development from simply writing
          features to designing systems around real business processes.
        </p>
        <ul className="grid md:grid-cols-2 gap-2">
          {[
            'Translating business processes into software workflows',
            'Designing relational data structures',
            'Managing dependencies between modules',
            'Building validation into transactional systems',
            'Designing role-based access',
            'Working with cloud infrastructure',
            'Debugging production workflows',
            'Testing business-critical logic',
            'Designing software for real users rather than demo scenarios',
          ].map((l) => (
            <li key={l} className="flex items-start gap-2 text-sm" style={{ color: COLORS.textCool }}>
              <span style={{ color: COLORS.accent }}>•</span>
              <span>{l}</span>
            </li>
          ))}
        </ul>
      </CaseStudySection>

      {/* 15 — Future Roadmap */}
      <CaseStudySection id="roadmap" num="15 — Future Roadmap" title="Where it goes next" dark={false}>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            { title: 'Advanced Analytics', items: ['Executive dashboards', 'Production analytics', 'Inventory forecasting', 'Sales analytics'] },
            { title: 'Automation', items: ['Automated management reports', 'Alerts & notifications', 'Scheduled workflows'] },
            { title: 'AI', items: ['Natural-language business queries', 'Operational anomaly detection', 'AI-assisted reporting', 'Management insights'] },
            { title: 'Integrations', items: ['WhatsApp', 'External APIs', 'Document generation', 'Additional business systems'] },
          ].map((r) => (
            <div key={r.title} className="rounded-lg p-5" style={{ background: 'white', border: `1px solid ${COLORS.border}` }}>
              <h3 className="font-bold mb-3" style={{ color: COLORS.headerFill }}>{r.title}</h3>
              <ul className="space-y-1">
                {r.items.map((i) => (
                  <li key={i} className="text-xs flex items-start gap-2" style={{ color: COLORS.textDarkMuted }}>
                    <span style={{ color: COLORS.accentDark }}>→</span>
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CaseStudySection>

      {/* Final Architecture */}
      <CaseStudySection id="final-architecture" num="Final Architecture" title="The complete picture" dark={true}>
        <div className="rounded-lg overflow-hidden border" style={{ borderColor: COLORS.accent + '33' }}>
          <pre className="p-5 text-xs md:text-sm overflow-x-auto leading-relaxed"
               style={{ background: COLORS.bgDark, color: COLORS.textCool, fontFamily: 'var(--font-geist-mono), monospace' }}>
{`                         JALARAM FEEDS ERP
                                │
          ┌─────────────────────┼─────────────────────┐
          │                     │                     │
       PURCHASE             PRODUCTION             SALES
          │                     │                     │
          └─────────────────────┼─────────────────────┘
                                │
                           INVENTORY
                                │
                    ┌───────────┴───────────┐
                    │                       │
                 QUALITY                DISPATCH
                    │                       │
                    └───────────┬───────────┘
                                │
                         CENTRAL DATA
                                │
                 ┌──────────────┼──────────────┐
                 ▼              ▼              ▼
              REPORTS       DASHBOARDS      AUTOMATION
                 │              │              │
                 └──────────────┼──────────────┘
                                ▼
                           MANAGEMENT`}
          </pre>
        </div>
        <div className="mt-6 rounded p-5 text-center"
             style={{ background: 'rgba(77,168,218,0.05)', border: `1px solid ${COLORS.accent}33` }}>
          <p className="text-base md:text-lg font-medium mb-2" style={{ color: COLORS.textCool }}>
            Jalaram Feeds ERP is a production-oriented business management platform designed to
            connect procurement, inventory, production, quality, sales and dispatch into a
            centralized, role-controlled system.
          </p>
          <p className="text-sm" style={{ color: COLORS.textMuted }}>
            It represents the transition from spreadsheet-driven operational processes toward a
            structured, cloud-based ERP architecture.
          </p>
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
