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
  GithubIcon,
  LinkedinIcon,
  MailIcon,
  PhoneIcon,
  CheckCircleIcon,
  ZapIcon,
  TerminalIcon,
  MenuIcon,
  XIcon,
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

// ─── Data ─────────────────────────────────────────────────────────────────
const STATS = [
  { num: '6',   label: 'Cloudflare Workers', sub: '1 public, 5 private' },
  { num: '8',   label: 'D1 Databases',      sub: 'SQLite at the edge' },
  { num: '22k', label: 'Lines of Code',     sub: 'Vanilla JS, no TS' },
  { num: '39',  label: 'Test Files',        sub: 'Plain node, no framework' },
  { num: '9',   label: 'Cron Jobs',          sub: 'Across all workers' },
  { num: '~150', label: 'RPC Endpoints',     sub: 'Single /rpc/* surface' },
]

const WORKERS = [
  {
    name: 'jalaram-gate',
    role: 'Entry · Auth · Dashboard',
    desc: 'Login, admin panel, dashboard aggregator, CRM, accounts, day-end report, low-stock PDF.',
    lines: '9,766',
    cron: '*/15 · 9pm · 9am · 10am IST',
    dbs: 8,
    public: true,
  },
  {
    name: 'jalaram-feeds',
    role: 'Sales · Dispatch · WhatsApp',
    desc: 'Sales orders, dispatch challans, FG stock, WhatsApp confirmations with PDF fallback.',
    lines: '5,120',
    cron: 'hourly',
    dbs: 2,
    public: false,
  },
  {
    name: 'jalaram-purchase',
    role: 'Sauda · Arrival · GRN',
    desc: 'Purchase deals, material arrivals, GRN, freight. Lab test results block on GRN slip.',
    lines: '3,226',
    cron: 'hourly',
    dbs: 4,
    public: false,
  },
  {
    name: 'jalaram-production',
    role: 'FG Batches · Formula',
    desc: 'Finished-goods batches, formula book, production analysis with search.',
    lines: '1,794',
    cron: 'hourly',
    dbs: 1,
    public: false,
  },
  {
    name: 'jalaram-labour',
    role: 'Attendance · Payroll',
    desc: 'Contractor attendance, advances, bank payments, mash rates. Audit log feeds Day End.',
    lines: '1,073',
    cron: 'hourly',
    dbs: 2,
    public: false,
  },
  {
    name: 'jalaram-lab',
    role: 'Lab Reports · Mobile Link',
    desc: 'Login-less lab test reports via Mobile Link (B110). Syncs results back to Purchase.',
    lines: '544',
    cron: 'half-hourly',
    dbs: 4,
    public: false,
  },
]

const FEATURES = [
  {
    icon: MessageSquareIcon,
    title: 'WhatsApp with PDF fallback',
    tag: 'B166',
    desc: 'When text message delivery fails (a non-trivial fraction), generate a PDF of the same content in-memory and send as a media message. No R2 round-trip, no external PDF library — pure JavaScript bytes.',
  },
  {
    icon: TerminalIcon,
    title: 'Sahayak AI chat',
    tag: 'Workers AI',
    desc: 'A scoped natural-language assistant for super-admins. Maps free-text questions to a fixed set of supported query templates, runs the RPC, formats the result. Deliberately narrow: no free-form SQL, no tool use, no escape hatches.',
  },
  {
    icon: ImageIcon,
    title: 'Day End screenshot report',
    tag: 'B128 · Browser Rendering',
    desc: 'Every 9 PM IST, a Gate cron uses Cloudflare Browser Rendering to launch headless Chromium, screenshot an internal report URL, and send the image to the owner\'s WhatsApp. Owner gets a single image summarising the day without opening the app.',
  },
  {
    icon: Link2Icon,
    title: 'Mobile Link for lab',
    tag: 'B110',
    desc: 'Long-lived HMAC-signed link for the lab technician\'s phone. Session is scoped to "lab" only — even a stolen phone cannot reach payroll, sales, or admin. Revocable in one click from the admin panel.',
  },
]

const TECH_STACK = [
  'Cloudflare Workers',
  'Cloudflare D1',
  'Cloudflare R2',
  'Cloudflare Cron Triggers',
  'Workers AI',
  'Browser Rendering',
  'Service Bindings',
  'PBKDF2-SHA256',
  'WhatsApp Business API',
  'Vanilla JS (no TypeScript)',
  'Bootstrap 5',
  'Select2',
  'SweetAlert2',
  'Chart.js',
  'SheetJS (xlsx)',
  'node:sqlite (tests)',
]

const MIGRATION = [
  { aspect: 'Compute',         before: 'Apps Script (6-min limit)',  after: 'Workers (no hard limit)' },
  { aspect: 'Data store',      before: 'Google Sheets',               after: '8 D1 SQLite databases' },
  { aspect: 'Frontend RPC',    before: 'google.script.run',           after: '/rpc/* over HTTPS' },
  { aspect: 'Auth',            before: 'Per-file Google SSO',         after: 'PBKDF2 + D1 sessions' },
  { aspect: 'Public exposure', before: 'All apps public',              after: 'Only Gate public; 5 modules private' },
  { aspect: 'Cron',            before: 'Time-driven triggers',         after: 'Cloudflare Cron Triggers' },
  { aspect: 'Version control', before: 'Per-file awkward',            after: 'Git monorepo, single main branch' },
  { aspect: 'Tests',           before: 'None',                        after: '39 plain-node test files' },
]

const CODE_SNIPPET = `// 1-gate/index.js — password hashing (PBKDF2-SHA256)
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

// ─── Sub-components ────────────────────────────────────────────────────────
function Nav() {
  const [open, setOpen] = useState(false)

  // Close the menu whenever a link is clicked or the viewport grows past md
  useEffect(() => {
    if (!open) return
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [open])

  const navLinks = [
    { href: '#architecture', label: 'Architecture' },
    { href: '#features',     label: 'Features' },
    { href: '#migration',    label: 'Migration' },
    { href: '#engineering',   label: 'Engineering' },
    { href: '#contact',      label: 'Contact' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
         style={{ background: 'rgba(10, 22, 40, 0.7)', borderBottom: '1px solid rgba(77, 168, 218, 0.15)' }}>
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: COLORS.accent, boxShadow: `0 0 8px ${COLORS.accent}` }} />
          <span className="font-mono text-sm" style={{ color: COLORS.textCool }}>
            jf-erp<span style={{ color: COLORS.textMuted }}> · case study</span>
          </span>
        </div>

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
          <a href="#contact" className="text-xs font-mono px-3 py-1.5 rounded transition-all"
             style={{ background: COLORS.accent, color: COLORS.bgDark }}>
            Get in touch →
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

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t" style={{ borderColor: 'rgba(77, 168, 218, 0.15)', background: 'rgba(10, 22, 40, 0.97)' }}>
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 rounded text-sm transition-colors hover:bg-white/5"
                style={{ color: COLORS.textMuted }}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden"
             style={{ background: COLORS.bgDark }}>
      {/* Background glow circles */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] pointer-events-none"
           style={{ background: `radial-gradient(circle at 0% 0%, ${COLORS.glow}33 0%, transparent 60%)` }} />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none"
           style={{ background: `radial-gradient(circle at 100% 100%, ${COLORS.accent}24 0%, transparent 60%)` }} />

      {/* Rectangular frame */}
      <div className="absolute pointer-events-none"
           style={{
             top: '5rem', left: '3rem', right: '3rem', bottom: '5rem',
             border: `2px solid ${COLORS.accent}`,
           }} />

      <div className="relative max-w-6xl mx-auto px-12 py-32">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-px w-12" style={{ background: COLORS.accent }} />
          <span className="font-mono text-xs tracking-[0.3em] uppercase" style={{ color: COLORS.accent }}>
            Case Study · Cloudflare Workers + D1
          </span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black leading-[0.95] tracking-tight mb-8"
            style={{ color: COLORS.textCool, textShadow: `0 0 40px ${COLORS.accent}44` }}>
          Jalaram Feeds<br/>
          <span style={{ fontFamily: 'var(--font-geist-sans)' }}>ERP</span>
        </h1>

        <p className="text-lg md:text-xl max-w-2xl mb-4 leading-relaxed" style={{ color: COLORS.textMuted }}>
          A full-scale ERP for an animal-feed manufacturer, migrated from Google Apps Script
          to the Cloudflare edge — with zero downtime and near-zero UI change.
        </p>

        <p className="text-base max-w-xl mb-12 leading-relaxed" style={{ color: `${COLORS.textMuted}cc` }}>
          Six Workers. Eight D1 databases. Twenty-two thousand lines of vanilla JavaScript.
          A single-login "Gate" pattern. This is how it was designed, built, and shipped.
        </p>

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mb-12">
          {STATS.slice(0, 4).map((s) => (
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
          <a href="#architecture"
             className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-medium transition-all hover:scale-105"
             style={{ background: COLORS.accent, color: COLORS.bgDark }}>
            Read the architecture <ArrowRightIcon className="w-4 h-4" />
          </a>
          <a href="/Jalaram_Feeds_ERP_Case_Study.pdf"
             target="_blank"
             rel="noopener noreferrer"
             className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-mono transition-all hover:bg-white/5"
             style={{ border: `1px solid ${COLORS.accent}55`, color: COLORS.textCool }}>
            📄 Download full PDF (17 pages)
          </a>
        </div>
      </div>
    </section>
  )
}

function ArchitectureSection() {
  return (
    <section id="architecture" className="py-24 px-6" style={{ background: COLORS.bgLight }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-12" style={{ background: COLORS.accentDark }} />
            <span className="font-mono text-xs tracking-[0.3em] uppercase" style={{ color: COLORS.accentDark }}>
              01 · Architecture
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: COLORS.textDark }}>
            The Gate Pattern
          </h2>
          <p className="text-lg max-w-3xl" style={{ color: COLORS.textDarkMuted }}>
            One public Worker handles login, routing, and dashboard aggregation. Five private Workers
            are reachable only through Cloudflare service bindings — they have no public URL at all.
          </p>
        </div>

        {/* Gate diagram */}
        <div className="mb-10">
          <div className="rounded-lg p-6 text-center"
               style={{ background: COLORS.headerFill, color: 'white', border: `1px solid ${COLORS.accent}` }}>
            <div className="font-mono text-sm tracking-widest uppercase opacity-80 mb-2">Public URL</div>
            <div className="text-2xl font-bold mb-2">jalaram-gate.workers.dev</div>
            <div className="text-sm opacity-90">
              Login · Auth · Dashboard · Admin · Day End · CRM · Accounts · 8 D1 DBs (read)
            </div>
            <div className="mt-3 font-mono text-xs opacity-75">
              cron: */15 · 9pm · 9am · 10am IST
            </div>
          </div>

          <div className="text-center py-4">
            <div className="font-mono text-xs tracking-widest uppercase" style={{ color: COLORS.accentDark }}>
              ↓ service bindings (HMAC-signed · GATE_SECRET)
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {WORKERS.slice(1).map((w) => (
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
              {WORKERS.map((w, i) => (
                <tr key={w.name} style={{
                  background: i % 2 === 0 ? 'white' : '#eef3fa',
                }}>
                  <td className="p-3">
                    <div className="font-mono text-xs font-bold" style={{ color: COLORS.textDark }}>
                      {w.name}
                    </div>
                    <div className="text-xs" style={{ color: COLORS.textDarkMuted }}>
                      {w.public ? '🌐 public' : '🔒 private'}
                    </div>
                  </td>
                  <td className="p-3 hidden md:table-cell text-xs" style={{ color: COLORS.textDarkMuted }}>
                    {w.desc}
                  </td>
                  <td className="p-3 font-mono text-xs" style={{ color: COLORS.textDark }}>
                    {w.cron}
                  </td>
                  <td className="p-3 text-right font-mono font-bold" style={{ color: COLORS.accentDark }}>
                    {w.lines}
                  </td>
                  <td className="p-3 text-right font-mono hidden md:table-cell" style={{ color: COLORS.textDark }}>
                    {w.dbs}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6" style={{ background: COLORS.bgDark }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-12" style={{ background: COLORS.accent }} />
            <span className="font-mono text-xs tracking-[0.3em] uppercase" style={{ color: COLORS.accent }}>
              02 · Real-world features
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: COLORS.textCool }}>
            Four features that prove the edge pays off
          </h2>
          <p className="text-lg max-w-3xl" style={{ color: COLORS.textMuted }}>
            Each one solves a real operational problem and would have been dramatically
            more expensive (or impossible) on the previous Apps Script stack.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {FEATURES.map((f) => {
            const Icon = f.icon
            return (
              <div key={f.title}
                   className="rounded-lg p-6 transition-all hover:scale-[1.02]"
                   style={{
                     background: 'rgba(255, 255, 255, 0.03)',
                     border: '1px solid rgba(77, 168, 218, 0.2)',
                   }}>
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
                <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.textCool }}>
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: COLORS.textMuted }}>
                  {f.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function MigrationSection() {
  return (
    <section id="migration" className="py-24 px-6" style={{ background: COLORS.bgLight }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-12" style={{ background: COLORS.accentDark }} />
            <span className="font-mono text-xs tracking-[0.3em] uppercase" style={{ color: COLORS.accentDark }}>
              03 · Migration story
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: COLORS.textDark }}>
            Apps Script → Workers, with zero downtime
          </h2>
          <p className="text-lg max-w-3xl" style={{ color: COLORS.textDarkMuted }}>
            The mandate was uncompromising: zero data loss, zero downtime, and no retraining
            for end users. The trick was a 200-line proxy shim called <code className="font-mono text-base" style={{ color: COLORS.accentDark }}>gas-shim.js</code>.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="rounded-lg p-6" style={{ background: 'white', border: `1px solid ${COLORS.border}` }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: COLORS.textDark }}>
              The gas-shim.js trick
            </h3>
            <p className="text-sm leading-relaxed mb-3" style={{ color: COLORS.textDarkMuted }}>
              The legacy frontends spoke <code className="font-mono text-xs">google.script.run</code> —
              a positional-argument RPC contract. We re-implemented that surface in a 200-line
              browser shim that transparently proxied every call to a Worker's
              <code className="font-mono text-xs"> /rpc/*</code> endpoint.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: COLORS.textDarkMuted }}>
              From the frontend's perspective, nothing changed. The migration proceeded module by
              module — Sales first, then Purchase, then Production — without ever flag-daying the
              whole application.
            </p>
          </div>
          <div className="rounded-lg p-6" style={{ background: 'white', border: `1px solid ${COLORS.border}` }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: COLORS.textDark }}>
              Service bindings, not public URLs
            </h3>
            <p className="text-sm leading-relaxed mb-3" style={{ color: COLORS.textDarkMuted }}>
              Five of six Workers have <code className="font-mono text-xs">workers_dev: false</code>.
              They are reachable only via Cloudflare service bindings — server-to-server calls
              authenticated by a shared HMAC secret that never leaves Cloudflare's network.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: COLORS.textDarkMuted }}>
              Attack surface is one worker wide instead of six. Module workers do not need their own
              auth layer — they trust the Gate's signed handoff.
            </p>
          </div>
        </div>

        {/* Before/After table */}
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
              {MIGRATION.map((row, i) => (
                <tr key={row.aspect} style={{ background: i % 2 === 0 ? 'white' : '#eef3fa' }}>
                  <td className="p-3 font-semibold" style={{ color: COLORS.textDark }}>
                    {row.aspect}
                  </td>
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
      </div>
    </section>
  )
}

function EngineeringSection() {
  return (
    <section id="engineering" className="py-24 px-6" style={{ background: COLORS.bgLightCard }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-12" style={{ background: COLORS.accentDark }} />
            <span className="font-mono text-xs tracking-[0.3em] uppercase" style={{ color: COLORS.accentDark }}>
              04 · Engineering rigor
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: COLORS.textDark }}>
            Lazy senior dev, TDD, B-number changelog
          </h2>
          <p className="text-lg max-w-3xl" style={{ color: COLORS.textDarkMuted }}>
            The codebase ships with 39 plain-node test files, a "lazy senior dev" philosophy
            (AGENTS.md), and a sequential B-number tag on every change since B1.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="rounded-lg p-6" style={{ background: 'white', border: `1px solid ${COLORS.border}` }}>
            <div className="flex items-center gap-3 mb-3">
              <CheckCircleIcon className="w-5 h-5" style={{ color: COLORS.accentDark }} />
              <h3 className="font-bold" style={{ color: COLORS.textDark }}>39 test files</h3>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: COLORS.textDarkMuted }}>
              Plain Node.js, no Jest/Mocha. <code className="font-mono text-xs">node:sqlite</code> as in-memory
              D1 fake, mocked <code className="font-mono text-xs">fetch</code>. Tests run in milliseconds,
              never touch live data. <code className="font-mono text-xs">node workers/1-gate/print-stamps.test.mjs</code>.
            </p>
          </div>
          <div className="rounded-lg p-6" style={{ background: 'white', border: `1px solid ${COLORS.border}` }}>
            <div className="flex items-center gap-3 mb-3">
              <ZapIcon className="w-5 h-5" style={{ color: COLORS.accentDark }} />
              <h3 className="font-bold" style={{ color: COLORS.textDark }}>Lazy senior dev</h3>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: COLORS.textDarkMuted }}>
              <em>AGENTS.md</em> opens with: "The best code is the code never written." Seven-rung
              ladder: YAGNI → existing helper → stdlib → platform → dependency → one-liner → minimum code.
              Deletion over addition. Boring over clever.
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
              Numbers never reused, even if reverted.
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
            <code>{CODE_SNIPPET}</code>
          </pre>
        </div>
      </div>
    </section>
  )
}

function TechStackSection() {
  return (
    <section className="py-20 px-6" style={{ background: COLORS.bgLight }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-12" style={{ background: COLORS.accentDark }} />
            <span className="font-mono text-xs tracking-[0.3em] uppercase" style={{ color: COLORS.accentDark }}>
              05 · Tech stack
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: COLORS.textDark }}>
            What's under the hood
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {TECH_STACK.map((tech) => (
            <span key={tech}
                  className="px-3 py-1.5 rounded text-sm font-mono transition-all hover:scale-105"
                  style={{
                    background: 'white',
                    border: `1px solid ${COLORS.border}`,
                    color: COLORS.textDark,
                  }}>
              {tech}
            </span>
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
            06 · About the author
          </span>
          <div className="h-px w-12" style={{ background: COLORS.accent }} />
        </div>

        <h2 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: COLORS.textCool }}>
          Abhinav Randai
        </h2>
        <p className="text-lg max-w-2xl mx-auto mb-4 leading-relaxed" style={{ color: COLORS.textMuted }}>
          Software engineer building full-stack systems for small and mid-sized businesses.
          Work lives at the intersection of "this needs to run in production for years" and
          "the user is not a developer and should never think about the stack".
        </p>
        <p className="text-base max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: `${COLORS.textMuted}cc` }}>
          Open to opportunities in product engineering, platform engineering, and full-stack roles —
          especially teams working on edge computing, developer tooling, and line-of-business systems
          where engineering decisions have measurable business impact.
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
          <div className="flex flex-col items-center gap-2 p-4 rounded"
               style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(77,168,218,0.2)' }}>
            <PhoneIcon className="w-5 h-5" style={{ color: COLORS.accent }} />
            <span className="font-mono text-xs" style={{ color: COLORS.textCool }}>Phone</span>
            <span className="text-xs" style={{ color: COLORS.textMuted }}>+91-XXXXXXXXXX</span>
          </div>
        </div>

        <p className="mt-10 text-xs italic" style={{ color: `${COLORS.textMuted}88` }}>
          The full 17-page case study PDF is available at the top of this page. The Jalaram Feeds ERP
          codebase itself is private; a public mirror with sensitive configuration redacted may be
          made available on request.
        </p>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="py-8 px-6" style={{ background: COLORS.bgDark, borderTop: '1px solid rgba(77,168,218,0.15)' }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: COLORS.accent }} />
          <span className="font-mono text-xs" style={{ color: COLORS.textMuted }}>
            JF ERP · Case Study · v1.0 · September 2026
          </span>
        </div>
        <div className="font-mono text-xs" style={{ color: COLORS.textMuted }}>
          Built with Next.js · Tailwind CSS · Crystal Blue theme
        </div>
      </div>
    </footer>
  )
}

// ─── Main page ──────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <main className="min-h-screen">
      <Nav />
      <Hero />
      <ArchitectureSection />
      <FeaturesSection />
      <MigrationSection />
      <EngineeringSection />
      <TechStackSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
