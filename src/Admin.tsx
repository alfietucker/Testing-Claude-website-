import { useState } from 'react';
import { Crown, Save, LogOut, Eye, ChevronDown, ChevronUp, Plus, Trash2, Check } from 'lucide-react';
import { SiteContent, saveContent } from './content';

// ─── Change this to your own password ─────────────────────────────────────────
const ADMIN_PASSWORD = 'tradekings2025';

// ─── Types ─────────────────────────────────────────────────────────────────────

type Tab = 'hero' | 'painPoints' | 'services' | 'work' | 'testimonials' | 'about' | 'contact';

const TABS: { id: Tab; label: string; hint: string }[] = [
  { id: 'hero',         label: 'Hero & Stats',   hint: 'Main headline, body copy, button labels and stats strip' },
  { id: 'painPoints',   label: 'The Problem',    hint: 'The 3 numbered problem cards' },
  { id: 'services',     label: 'Services',       hint: 'The 4 service tiles' },
  { id: 'work',         label: 'Portfolio',      hint: 'Client results cards — add, edit or remove projects' },
  { id: 'testimonials', label: 'Testimonials',   hint: 'Customer reviews — add, edit or remove' },
  { id: 'about',        label: 'About',          hint: 'Agency story, values and statistics card' },
  { id: 'contact',      label: 'Contact',        hint: 'Email, phone, location and footer tagline' },
];

interface Props {
  content: SiteContent;
  onSave: (c: SiteContent) => void;
  onExit: () => void;
}

// ─── Small reusable components ─────────────────────────────────────────────────

function Label({ children }: { children: string }) {
  return (
    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1.5">
      {children}
    </label>
  );
}

function Hint({ children }: { children: string }) {
  return <p className="text-[10px] text-white/22 mt-1 leading-relaxed">{children}</p>;
}

const inputCls =
  'w-full border border-white/10 bg-white/4 text-white placeholder:text-white/20 px-3 py-2.5 text-sm focus:border-brand-red focus:outline-none transition-colors rounded-[2px]';

function TextField({
  label, value, onChange, multiline = false, hint,
}: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean; hint?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} className={inputCls + ' resize-y'} />
        : <input value={value} onChange={e => onChange(e.target.value)} className={inputCls} />}
      {hint && <Hint>{hint}</Hint>}
    </div>
  );
}

function SectionHead({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="mb-7 pb-5 border-b border-white/8">
      <h2 className="font-display font-black text-white text-xl tracking-tight">{title}</h2>
      <p className="text-sm text-white/35 mt-1">{hint}</p>
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="border-t border-white/8 pt-6 mt-2">
      <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4">{label}</p>
    </div>
  );
}

function CollapsibleItem({
  label, children, onDelete,
}: {
  label: string; children: React.ReactNode; onDelete?: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/8 rounded-[2px] overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/4 transition-colors text-left cursor-pointer"
        onClick={() => setOpen(o => !o)}
      >
        <span className="text-sm font-medium text-white/65">{label || '(empty)'}</span>
        <div className="flex items-center gap-2">
          {onDelete && (
            <span
              role="button"
              tabIndex={0}
              onClick={e => { e.stopPropagation(); onDelete(); }}
              onKeyDown={e => e.key === 'Enter' && onDelete()}
              className="w-7 h-7 flex items-center justify-center text-white/25 hover:text-brand-red transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </span>
          )}
          {open
            ? <ChevronUp className="w-4 h-4 text-white/35" />
            : <ChevronDown className="w-4 h-4 text-white/35" />}
        </div>
      </button>
      {open && (
        <div className="px-4 pb-5 pt-4 border-t border-white/8 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full border border-dashed border-white/15 text-white/35 hover:text-white hover:border-white/30 transition-colors py-3 text-sm flex items-center justify-center gap-2 rounded-[2px] cursor-pointer"
    >
      <Plus className="w-4 h-4" /> {label}
    </button>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function Admin({ content: initial, onSave, onExit }: Props) {
  const [authed, setAuthed]     = useState(false);
  const [pw, setPw]             = useState('');
  const [pwError, setPwError]   = useState('');
  const [content, setContent]   = useState<SiteContent>(initial);
  const [tab, setTab]           = useState<Tab>('hero');
  const [saved, setSaved]       = useState(false);
  const [dirty, setDirty]       = useState(false);

  // Helpers
  const mutate = (updater: (prev: SiteContent) => SiteContent) => {
    setContent(updater);
    setDirty(true);
  };

  const setField = <K extends keyof SiteContent>(section: K, key: keyof SiteContent[K], value: SiteContent[K][keyof SiteContent[K]]) => {
    mutate(prev => ({ ...prev, [section]: { ...(prev[section] as object), [key]: value } }));
  };

  const handleSave = () => {
    saveContent(content);
    onSave(content);
    setSaved(true);
    setDirty(false);
    setTimeout(() => setSaved(false), 2500);
  };

  // ── Login screen ──────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="bg-brand-red p-1.5 rounded-[3px]">
              <Crown className="w-4 h-4 fill-white text-white" />
            </div>
            <span className="font-display font-black text-white text-xl tracking-tight">TRADE KINGS</span>
          </div>

          <div className="border border-white/8 p-8">
            <h1 className="font-display font-black text-white text-xl tracking-tight mb-1">Admin Panel</h1>
            <p className="text-sm text-white/38 mb-6">Enter your password to edit the website.</p>

            <form
              onSubmit={e => {
                e.preventDefault();
                if (pw === ADMIN_PASSWORD) { setAuthed(true); }
                else { setPwError('Incorrect password. Try again.'); setPw(''); }
              }}
              className="space-y-4"
            >
              <div>
                <Label>Password</Label>
                <input
                  type="password"
                  value={pw}
                  onChange={e => { setPw(e.target.value); setPwError(''); }}
                  className={inputCls}
                  placeholder="••••••••••••"
                  autoFocus
                />
                {pwError && <p className="text-xs text-brand-red mt-1.5">{pwError}</p>}
              </div>
              <button
                type="submit"
                className="w-full bg-brand-red text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded-[2px] hover:bg-brand-red/90 transition-colors cursor-pointer"
              >
                Login
              </button>
            </form>
          </div>

          <p className="text-center text-[11px] text-white/18 mt-6">
            Trade Kings Agency · Owner Portal
          </p>
        </div>
      </div>
    );
  }

  // ── Admin panel ───────────────────────────────────────────────────────────
  const activeTab = TABS.find(t => t.id === tab)!;

  return (
    <div className="h-screen bg-brand-dark flex flex-col overflow-hidden">

      {/* Top bar */}
      <header className="flex-shrink-0 border-b border-white/8 px-5 py-3 flex items-center justify-between bg-[#0d0d0d]">
        <div className="flex items-center gap-2.5">
          <div className="bg-brand-red p-1.5 rounded-[3px]">
            <Crown className="w-3.5 h-3.5 fill-white text-white" />
          </div>
          <span className="font-display font-black text-white text-base tracking-tight">TRADE KINGS</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/25 ml-1">/ Admin</span>
          {dirty && <span className="text-[10px] text-brand-red ml-2">● Unsaved changes</span>}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 text-xs text-white/45 hover:text-white transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Site</span>
          </button>

          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-[2px] transition-all duration-200 cursor-pointer ${
              saved
                ? 'bg-green-600 text-white'
                : dirty
                  ? 'bg-brand-red text-white hover:bg-brand-red/90 ring-2 ring-brand-red/30'
                  : 'bg-white/8 text-white/60 hover:bg-white/14 hover:text-white'
            }`}
          >
            {saved ? <><Check className="w-3.5 h-3.5" />Saved!</> : <><Save className="w-3.5 h-3.5" />Save Changes</>}
          </button>

          <button
            onClick={() => setAuthed(false)}
            title="Logout"
            className="w-8 h-8 flex items-center justify-center text-white/28 hover:text-white transition-colors border border-white/8 rounded-[2px] cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className="w-48 flex-shrink-0 border-r border-white/8 flex flex-col bg-[#0d0d0d] overflow-y-auto">
          <nav className="flex-1 py-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 px-4 mb-3">Sections</p>
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer border-r-2 ${
                  tab === t.id
                    ? 'text-white bg-white/7 border-brand-red font-semibold'
                    : 'text-white/42 hover:text-white hover:bg-white/4 border-transparent'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
          <div className="px-4 py-4 border-t border-white/8">
            <p className="text-[10px] text-white/20 leading-relaxed">
              Edit then click <strong className="text-white/40">Save Changes</strong>. Changes go live immediately on your site.
            </p>
          </div>
        </aside>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="max-w-xl">

            <SectionHead title={activeTab.label} hint={activeTab.hint} />

            {/* ── HERO ── */}
            {tab === 'hero' && (
              <div className="space-y-5">
                <TextField label="Small Label (above headline)" value={content.hero.label} onChange={v => setField('hero', 'label', v)} hint='Red uppercase text. E.g. "Web Design for the Trades"' />
                <TextField label="Main Headline" value={content.hero.headline} onChange={v => setField('hero', 'headline', v)} hint="The bold black headline text" />
                <TextField label="Red Accent Line" value={content.hero.headlineAccent} onChange={v => setField('hero', 'headlineAccent', v)} hint='The red line at the end, e.g. "Every Single Day."' />
                <TextField label="Body Paragraph" value={content.hero.body} onChange={v => setField('hero', 'body', v)} multiline />
                <div className="grid grid-cols-2 gap-4">
                  <TextField label="Button 1 (Red)" value={content.hero.cta1} onChange={v => setField('hero', 'cta1', v)} />
                  <TextField label="Button 2 (Outline)" value={content.hero.cta2} onChange={v => setField('hero', 'cta2', v)} />
                </div>
                <Divider label="Statistics Strip" />
                <div className="grid grid-cols-2 gap-4">
                  <TextField label="Sites Built" value={content.hero.statSites} onChange={v => setField('hero', 'statSites', v)} />
                  <TextField label="Revenue Generated" value={content.hero.statRevenue} onChange={v => setField('hero', 'statRevenue', v)} />
                </div>
              </div>
            )}

            {/* ── PAIN POINTS ── */}
            {tab === 'painPoints' && (
              <div className="space-y-5">
                <TextField label="Section Label" value={content.painPoints.sectionLabel} onChange={v => setField('painPoints', 'sectionLabel', v)} />
                <TextField label="Section Heading" value={content.painPoints.heading} onChange={v => setField('painPoints', 'heading', v)} multiline />
                <Divider label="Problem Cards" />
                <div className="space-y-3">
                  {content.painPoints.items.map((item, i) => (
                    <CollapsibleItem key={i} label={item.title || `Problem ${String(i + 1).padStart(2, '0')}`}>
                      <TextField label="Title" value={item.title} onChange={v => {
                        const items = [...content.painPoints.items];
                        items[i] = { ...items[i], title: v };
                        setField('painPoints', 'items', items);
                      }} />
                      <TextField label="Description" value={item.body} onChange={v => {
                        const items = [...content.painPoints.items];
                        items[i] = { ...items[i], body: v };
                        setField('painPoints', 'items', items);
                      }} multiline />
                    </CollapsibleItem>
                  ))}
                </div>
              </div>
            )}

            {/* ── SERVICES ── */}
            {tab === 'services' && (
              <div className="space-y-5">
                <TextField label="Section Label" value={content.services.sectionLabel} onChange={v => setField('services', 'sectionLabel', v)} />
                <TextField label="Section Heading" value={content.services.heading} onChange={v => setField('services', 'heading', v)} />
                <Divider label="Service Cards" />
                <div className="space-y-3">
                  {content.services.items.map((item, i) => (
                    <CollapsibleItem key={i} label={item.title}>
                      <TextField label="Service Name" value={item.title} onChange={v => {
                        const items = [...content.services.items];
                        items[i] = { ...items[i], title: v };
                        setField('services', 'items', items);
                      }} />
                      <TextField label="Description" value={item.body} onChange={v => {
                        const items = [...content.services.items];
                        items[i] = { ...items[i], body: v };
                        setField('services', 'items', items);
                      }} multiline />
                    </CollapsibleItem>
                  ))}
                </div>
              </div>
            )}

            {/* ── PORTFOLIO ── */}
            {tab === 'work' && (
              <div className="space-y-5">
                <TextField label="Section Label" value={content.work.sectionLabel} onChange={v => setField('work', 'sectionLabel', v)} />
                <TextField label="Section Heading" value={content.work.heading} onChange={v => setField('work', 'heading', v)} />
                <Divider label="Project Cards" />
                <div className="space-y-3">
                  {content.work.projects.map((p, i) => (
                    <CollapsibleItem
                      key={i}
                      label={p.business || `Project ${i + 1}`}
                      onDelete={content.work.projects.length > 1 ? () => {
                        setField('work', 'projects', content.work.projects.filter((_, idx) => idx !== i));
                      } : undefined}
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <TextField label="Business Name" value={p.business} onChange={v => {
                          const arr = [...content.work.projects]; arr[i] = { ...arr[i], business: v }; setField('work', 'projects', arr);
                        }} />
                        <TextField label="Trade" value={p.trade} onChange={v => {
                          const arr = [...content.work.projects]; arr[i] = { ...arr[i], trade: v }; setField('work', 'projects', arr);
                        }} />
                        <TextField label="Location" value={p.location} onChange={v => {
                          const arr = [...content.work.projects]; arr[i] = { ...arr[i], location: v }; setField('work', 'projects', arr);
                        }} />
                        <TextField label="Result (e.g. +312%)" value={p.metric} onChange={v => {
                          const arr = [...content.work.projects]; arr[i] = { ...arr[i], metric: v }; setField('work', 'projects', arr);
                        }} />
                      </div>
                      <TextField label="Result Label (e.g. Google Leads)" value={p.metricLabel} onChange={v => {
                        const arr = [...content.work.projects]; arr[i] = { ...arr[i], metricLabel: v }; setField('work', 'projects', arr);
                      }} />
                    </CollapsibleItem>
                  ))}
                </div>
                <AddButton
                  label="Add Project"
                  onClick={() => setField('work', 'projects', [...content.work.projects, { business: '', trade: '', location: '', metric: '', metricLabel: '' }])}
                />
              </div>
            )}

            {/* ── TESTIMONIALS ── */}
            {tab === 'testimonials' && (
              <div className="space-y-5">
                <TextField label="Section Label" value={content.testimonials.sectionLabel} onChange={v => setField('testimonials', 'sectionLabel', v)} />
                <TextField label="Section Heading" value={content.testimonials.heading} onChange={v => setField('testimonials', 'heading', v)} />
                <Divider label="Reviews" />
                <div className="space-y-3">
                  {content.testimonials.items.map((item, i) => (
                    <CollapsibleItem
                      key={i}
                      label={item.name ? `${item.name} — ${item.trade}` : `Review ${i + 1}`}
                      onDelete={content.testimonials.items.length > 1 ? () => {
                        setField('testimonials', 'items', content.testimonials.items.filter((_, idx) => idx !== i));
                      } : undefined}
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <TextField label="Customer Name" value={item.name} onChange={v => {
                          const arr = [...content.testimonials.items]; arr[i] = { ...arr[i], name: v }; setField('testimonials', 'items', arr);
                        }} />
                        <TextField label="Trade / Location" value={item.trade} onChange={v => {
                          const arr = [...content.testimonials.items]; arr[i] = { ...arr[i], trade: v }; setField('testimonials', 'items', arr);
                        }} />
                      </div>
                      <TextField label="Review Text" value={item.text} onChange={v => {
                        const arr = [...content.testimonials.items]; arr[i] = { ...arr[i], text: v }; setField('testimonials', 'items', arr);
                      }} multiline />
                    </CollapsibleItem>
                  ))}
                </div>
                <AddButton
                  label="Add Review"
                  onClick={() => setField('testimonials', 'items', [...content.testimonials.items, { name: '', trade: '', text: '' }])}
                />
              </div>
            )}

            {/* ── ABOUT ── */}
            {tab === 'about' && (
              <div className="space-y-5">
                <TextField label="Section Label" value={content.about.sectionLabel} onChange={v => setField('about', 'sectionLabel', v)} />
                <TextField label="Heading" value={content.about.heading} onChange={v => setField('about', 'heading', v)} />
                <TextField label="Paragraph 1" value={content.about.body1} onChange={v => setField('about', 'body1', v)} multiline />
                <TextField label="Paragraph 2" value={content.about.body2} onChange={v => setField('about', 'body2', v)} multiline />
                <TextField label="Pull Quote" value={content.about.quote} onChange={v => setField('about', 'quote', v)} multiline hint="The italic quote shown in the stats card" />

                <Divider label="Value Points (tick list)" />
                <div className="space-y-2">
                  {content.about.values.map((val, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={val}
                        onChange={e => {
                          const values = [...content.about.values];
                          values[i] = e.target.value;
                          setField('about', 'values', values);
                        }}
                        className={inputCls + ' flex-1'}
                      />
                      {content.about.values.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setField('about', 'values', content.about.values.filter((_, idx) => idx !== i))}
                          className="w-9 h-9 flex items-center justify-center text-white/25 hover:text-brand-red transition-colors border border-white/8 rounded-[2px] cursor-pointer flex-shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setField('about', 'values', [...content.about.values, ''])}
                    className="text-xs text-white/35 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 mt-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add point
                  </button>
                </div>

                <Divider label="Stats Card Numbers" />
                <div className="grid grid-cols-2 gap-4">
                  <TextField label="Sites Built" value={content.about.statSites} onChange={v => setField('about', 'statSites', v)} />
                  <TextField label="Revenue Generated" value={content.about.statRevenue} onChange={v => setField('about', 'statRevenue', v)} />
                </div>
              </div>
            )}

            {/* ── CONTACT ── */}
            {tab === 'contact' && (
              <div className="space-y-5">
                <TextField label="Location" value={content.contact.location} onChange={v => setField('contact', 'location', v)} />
                <TextField label="Email Address" value={content.contact.email} onChange={v => setField('contact', 'email', v)} />
                <TextField label="Phone Number" value={content.contact.phone} onChange={v => setField('contact', 'phone', v)} />
                <TextField label="Footer Tagline" value={content.contact.footerTagline} onChange={v => setField('contact', 'footerTagline', v)} multiline />
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
