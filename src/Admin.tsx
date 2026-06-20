import { useState } from 'react';
import {
  ArrowLeft, Save, LogOut, Eye, Plus, Trash2, Check,
  Type, Star, Briefcase, Phone, Info, LayoutGrid, Crown,
} from 'lucide-react';
import { SiteContent, saveContent } from './content';

const ADMIN_PASSWORD = 'tradekings2025';

type Section = 'home' | 'hero' | 'services' | 'work' | 'testimonials' | 'about' | 'contact';

interface Props {
  content: SiteContent;
  onSave: (c: SiteContent) => void;
  onExit: () => void;
}

// ─── Shared styles ──────────────────────────────────────────────────────────

const inputCls =
  'w-full border-2 border-gray-200 bg-white text-gray-900 rounded-xl px-4 py-3 text-base focus:border-blue-500 focus:outline-none transition-colors';

const textareaCls = inputCls + ' resize-none';

// ─── Reusable field components ───────────────────────────────────────────────

function Field({
  label, hint, value, onChange, multiline = false, rows = 3,
}: {
  label: string; hint?: string; value: string;
  onChange: (v: string) => void; multiline?: boolean; rows?: number;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      {hint && <p className="text-sm text-gray-400">{hint}</p>}
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} className={textareaCls} />
        : <input value={value} onChange={e => onChange(e.target.value)} className={inputCls} />}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 space-y-5 shadow-sm">
      {children}
    </div>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-3 mb-1">{children}</h3>;
}

function DeleteButton({ onClick, label = 'Remove' }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 transition-colors cursor-pointer font-medium"
    >
      <Trash2 className="w-4 h-4" />
      {label}
    </button>
  );
}

function AddCard({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full border-2 border-dashed border-blue-200 rounded-2xl py-5 text-blue-500 hover:bg-blue-50 hover:border-blue-400 transition-all text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
    >
      <Plus className="w-5 h-5" />
      {label}
    </button>
  );
}

// ─── Save bar ────────────────────────────────────────────────────────────────

function SaveBar({
  dirty, saved, onSave, onBack,
}: {
  dirty: boolean; saved: boolean; onSave: () => void; onBack: () => void;
}) {
  return (
    <div className="sticky top-0 z-10 bg-white border-b-2 border-gray-100 px-4 py-3 flex items-center gap-3">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer font-medium text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="flex-1" />

      {dirty && (
        <span className="text-sm text-orange-500 font-medium hidden sm:block">Unsaved changes</span>
      )}

      <button
        onClick={onSave}
        className={`flex items-center gap-2 font-bold text-sm px-5 py-2.5 rounded-xl transition-all cursor-pointer ${
          saved
            ? 'bg-green-500 text-white'
            : dirty
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
              : 'bg-gray-100 text-gray-400'
        }`}
      >
        {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
      </button>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export function Admin({ content: initial, onSave, onExit }: Props) {
  const [authed, setAuthed]   = useState(false);
  const [pw, setPw]           = useState('');
  const [pwError, setPwError] = useState('');
  const [content, setContent] = useState<SiteContent>(initial);
  const [section, setSection] = useState<Section>('home');
  const [saved, setSaved]     = useState(false);
  const [dirty, setDirty]     = useState(false);

  const mutate = (updater: (prev: SiteContent) => SiteContent) => {
    setContent(updater);
    setDirty(true);
    setSaved(false);
  };

  const set = <K extends keyof SiteContent>(
    sec: K, key: keyof SiteContent[K], value: SiteContent[K][keyof SiteContent[K]]
  ) => mutate(prev => ({ ...prev, [sec]: { ...(prev[sec] as object), [key]: value } }));

  const handleSave = () => {
    saveContent(content);
    onSave(content);
    setSaved(true);
    setDirty(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const goBack = () => setSection('home');

  // ── Login ──────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-2xl mb-4 shadow-lg">
              <Crown className="w-8 h-8 text-white fill-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Trade Kings</h1>
            <p className="text-gray-500 mt-1">Website Editor</p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 shadow-sm">
            <form
              onSubmit={e => {
                e.preventDefault();
                if (pw === ADMIN_PASSWORD) setAuthed(true);
                else { setPwError('Wrong password. Please try again.'); setPw(''); }
              }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                <input
                  type="password"
                  value={pw}
                  onChange={e => { setPw(e.target.value); setPwError(''); }}
                  placeholder="Enter your password"
                  autoFocus
                  className={inputCls}
                />
                {pwError && (
                  <p className="text-sm text-red-500 font-medium">{pwError}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors text-base cursor-pointer shadow-md"
              >
                Log In
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-400 mt-6">
            Trade Kings Agency · Owner Portal
          </p>
        </div>
      </div>
    );
  }

  // ── Top navigation bar (always visible) ───────────────────────────────────
  const TopBar = () => (
    <header className="bg-white border-b-2 border-gray-100 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center">
          <Crown className="w-4 h-4 text-white fill-white" />
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm leading-tight">Trade Kings</p>
          <p className="text-xs text-gray-400 leading-tight">Website Editor</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-100"
        >
          <Eye className="w-4 h-4" />
          <span className="hidden sm:inline">View Site</span>
        </button>
        <button
          onClick={() => setAuthed(false)}
          title="Log out"
          className="text-sm text-gray-400 hover:text-gray-700 font-medium transition-colors cursor-pointer p-2 rounded-lg hover:bg-gray-100"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );

  // ── Home screen — pick what to edit ───────────────────────────────────────
  if (section === 'home') {
    const tiles: { id: Section; icon: React.ReactNode; title: string; desc: string; color: string }[] = [
      {
        id: 'hero',
        icon: <Type className="w-6 h-6" />,
        title: 'Main Headline',
        desc: 'Edit the big text visitors see first — headline, description, and buttons.',
        color: 'bg-blue-50 text-blue-600 border-blue-100',
      },
      {
        id: 'services',
        icon: <Briefcase className="w-6 h-6" />,
        title: 'Services',
        desc: 'Edit the services you offer — names and descriptions.',
        color: 'bg-purple-50 text-purple-600 border-purple-100',
      },
      {
        id: 'work',
        icon: <LayoutGrid className="w-6 h-6" />,
        title: 'Portfolio / Work',
        desc: 'Add, edit or remove your client result cards.',
        color: 'bg-orange-50 text-orange-600 border-orange-100',
      },
      {
        id: 'testimonials',
        icon: <Star className="w-6 h-6" />,
        title: 'Reviews',
        desc: 'Add, edit or remove customer reviews.',
        color: 'bg-yellow-50 text-yellow-600 border-yellow-100',
      },
      {
        id: 'about',
        icon: <Info className="w-6 h-6" />,
        title: 'About Us',
        desc: 'Edit your story, values, and statistics.',
        color: 'bg-green-50 text-green-600 border-green-100',
      },
      {
        id: 'contact',
        icon: <Phone className="w-6 h-6" />,
        title: 'Contact Details',
        desc: 'Update your phone number, email, and location.',
        color: 'bg-red-50 text-red-600 border-red-100',
      },
    ];

    return (
      <div className="min-h-screen bg-gray-50">
        <TopBar />

        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">What would you like to edit?</h1>
            <p className="text-gray-500 mt-1">Tap a section below, make your changes, then press Save.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tiles.map(t => (
              <button
                key={t.id}
                onClick={() => setSection(t.id)}
                className="text-left bg-white rounded-2xl border-2 border-gray-100 p-5 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl border-2 mb-4 ${t.color}`}>
                  {t.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-base group-hover:text-blue-600 transition-colors">
                  {t.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">{t.desc}</p>
              </button>
            ))}
          </div>

          {dirty && (
            <div className="mt-6 bg-orange-50 border-2 border-orange-200 rounded-2xl p-4 flex items-center justify-between gap-4">
              <p className="text-sm text-orange-700 font-medium">You have unsaved changes.</p>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors cursor-pointer shadow-sm flex-shrink-0"
              >
                {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Now</>}
              </button>
            </div>
          )}

          {saved && !dirty && (
            <div className="mt-6 bg-green-50 border-2 border-green-200 rounded-2xl p-4 flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-700 font-medium">Changes saved successfully!</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Section editors ────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <SaveBar dirty={dirty} saved={saved} onSave={handleSave} onBack={goBack} />

      <div className="max-w-xl mx-auto px-4 py-6 space-y-4 pb-20">

        {/* ── HERO ── */}
        {section === 'hero' && <>
          <h2 className="text-xl font-bold text-gray-900">Main Headline</h2>
          <p className="text-gray-500 text-sm">This is the first thing visitors see at the top of your website.</p>

          <Card>
            <CardTitle>Headline Text</CardTitle>
            <Field
              label="Small label (above headline)"
              hint='The red small text. E.g. "Web Design for the Trades"'
              value={content.hero.label}
              onChange={v => set('hero', 'label', v)}
            />
            <Field
              label="Main headline"
              hint="The big bold black text."
              value={content.hero.headline}
              onChange={v => set('hero', 'headline', v)}
            />
            <Field
              label="Red accent line"
              hint='The red line at the end. E.g. "Every Single Day."'
              value={content.hero.headlineAccent}
              onChange={v => set('hero', 'headlineAccent', v)}
            />
            <Field
              label="Description paragraph"
              hint="The smaller text below the headline."
              value={content.hero.body}
              onChange={v => set('hero', 'body', v)}
              multiline
            />
          </Card>

          <Card>
            <CardTitle>Buttons</CardTitle>
            <Field
              label="Red button text"
              value={content.hero.cta1}
              onChange={v => set('hero', 'cta1', v)}
            />
            <Field
              label="Outline button text"
              value={content.hero.cta2}
              onChange={v => set('hero', 'cta2', v)}
            />
          </Card>

          <Card>
            <CardTitle>Statistics (shown below buttons)</CardTitle>
            <Field
              label="Number of sites built"
              hint='E.g. "127"'
              value={content.hero.statSites}
              onChange={v => set('hero', 'statSites', v)}
            />
            <Field
              label="Revenue generated"
              hint='E.g. "£2.4M"'
              value={content.hero.statRevenue}
              onChange={v => set('hero', 'statRevenue', v)}
            />
          </Card>
        </>}

        {/* ── SERVICES ── */}
        {section === 'services' && <>
          <h2 className="text-xl font-bold text-gray-900">Services</h2>
          <p className="text-gray-500 text-sm">The services you offer, shown as cards on your website.</p>

          <Card>
            <CardTitle>Section Heading</CardTitle>
            <Field label="Section label" value={content.services.sectionLabel} onChange={v => set('services', 'sectionLabel', v)} />
            <Field label="Main heading" value={content.services.heading} onChange={v => set('services', 'heading', v)} />
          </Card>

          {content.services.items.map((item, i) => (
            <Card key={i}>
              <CardTitle>Service {i + 1}</CardTitle>
              <Field
                label="Service name"
                value={item.title}
                onChange={v => {
                  const items = [...content.services.items];
                  items[i] = { ...items[i], title: v };
                  set('services', 'items', items);
                }}
              />
              <Field
                label="Description"
                value={item.body}
                onChange={v => {
                  const items = [...content.services.items];
                  items[i] = { ...items[i], body: v };
                  set('services', 'items', items);
                }}
                multiline
              />
            </Card>
          ))}
        </>}

        {/* ── PORTFOLIO ── */}
        {section === 'work' && <>
          <h2 className="text-xl font-bold text-gray-900">Portfolio / Work</h2>
          <p className="text-gray-500 text-sm">Your client result cards. Add new ones, edit existing, or remove them.</p>

          <Card>
            <CardTitle>Section Heading</CardTitle>
            <Field label="Section label" value={content.work.sectionLabel} onChange={v => set('work', 'sectionLabel', v)} />
            <Field label="Main heading" value={content.work.heading} onChange={v => set('work', 'heading', v)} />
          </Card>

          {content.work.projects.map((p, i) => (
            <Card key={i}>
              <div className="flex items-center justify-between mb-1">
                <CardTitle>Project {i + 1}{p.business ? ` — ${p.business}` : ''}</CardTitle>
              </div>
              <Field
                label="Business name"
                value={p.business}
                onChange={v => {
                  const arr = [...content.work.projects]; arr[i] = { ...arr[i], business: v };
                  set('work', 'projects', arr);
                }}
              />
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Trade type"
                  hint='E.g. "Plumbing"'
                  value={p.trade}
                  onChange={v => {
                    const arr = [...content.work.projects]; arr[i] = { ...arr[i], trade: v };
                    set('work', 'projects', arr);
                  }}
                />
                <Field
                  label="Location"
                  hint='E.g. "Birmingham"'
                  value={p.location}
                  onChange={v => {
                    const arr = [...content.work.projects]; arr[i] = { ...arr[i], location: v };
                    set('work', 'projects', arr);
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Result number"
                  hint='E.g. "+312%" or "#1"'
                  value={p.metric}
                  onChange={v => {
                    const arr = [...content.work.projects]; arr[i] = { ...arr[i], metric: v };
                    set('work', 'projects', arr);
                  }}
                />
                <Field
                  label="Result label"
                  hint='E.g. "Google Leads"'
                  value={p.metricLabel}
                  onChange={v => {
                    const arr = [...content.work.projects]; arr[i] = { ...arr[i], metricLabel: v };
                    set('work', 'projects', arr);
                  }}
                />
              </div>
              {content.work.projects.length > 1 && (
                <DeleteButton
                  label="Remove this project"
                  onClick={() => set('work', 'projects', content.work.projects.filter((_, idx) => idx !== i))}
                />
              )}
            </Card>
          ))}

          <AddCard
            label="Add a new project"
            onClick={() => set('work', 'projects', [...content.work.projects, { business: '', trade: '', location: '', metric: '', metricLabel: '' }])}
          />
        </>}

        {/* ── TESTIMONIALS ── */}
        {section === 'testimonials' && <>
          <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>
          <p className="text-gray-500 text-sm">Add, edit, or remove customer reviews shown on your website.</p>

          <Card>
            <CardTitle>Section Heading</CardTitle>
            <Field label="Section label" value={content.testimonials.sectionLabel} onChange={v => set('testimonials', 'sectionLabel', v)} />
            <Field label="Main heading" value={content.testimonials.heading} onChange={v => set('testimonials', 'heading', v)} />
          </Card>

          {content.testimonials.items.map((item, i) => (
            <Card key={i}>
              <CardTitle>Review {i + 1}{item.name ? ` — ${item.name}` : ''}</CardTitle>
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Customer name"
                  hint='E.g. "Mike P."'
                  value={item.name}
                  onChange={v => {
                    const arr = [...content.testimonials.items]; arr[i] = { ...arr[i], name: v };
                    set('testimonials', 'items', arr);
                  }}
                />
                <Field
                  label="Trade & location"
                  hint='E.g. "Plumber, Birmingham"'
                  value={item.trade}
                  onChange={v => {
                    const arr = [...content.testimonials.items]; arr[i] = { ...arr[i], trade: v };
                    set('testimonials', 'items', arr);
                  }}
                />
              </div>
              <Field
                label="Review text"
                hint="What the customer said."
                value={item.text}
                onChange={v => {
                  const arr = [...content.testimonials.items]; arr[i] = { ...arr[i], text: v };
                  set('testimonials', 'items', arr);
                }}
                multiline
                rows={4}
              />
              {content.testimonials.items.length > 1 && (
                <DeleteButton
                  label="Remove this review"
                  onClick={() => set('testimonials', 'items', content.testimonials.items.filter((_, idx) => idx !== i))}
                />
              )}
            </Card>
          ))}

          <AddCard
            label="Add a new review"
            onClick={() => set('testimonials', 'items', [...content.testimonials.items, { name: '', trade: '', text: '' }])}
          />
        </>}

        {/* ── ABOUT ── */}
        {section === 'about' && <>
          <h2 className="text-xl font-bold text-gray-900">About Us</h2>
          <p className="text-gray-500 text-sm">Your agency story and values section.</p>

          <Card>
            <CardTitle>Heading</CardTitle>
            <Field label="Section label" value={content.about.sectionLabel} onChange={v => set('about', 'sectionLabel', v)} />
            <Field label="Main heading" value={content.about.heading} onChange={v => set('about', 'heading', v)} />
          </Card>

          <Card>
            <CardTitle>Your Story</CardTitle>
            <Field
              label="First paragraph"
              value={content.about.body1}
              onChange={v => set('about', 'body1', v)}
              multiline
              rows={4}
            />
            <Field
              label="Second paragraph"
              value={content.about.body2}
              onChange={v => set('about', 'body2', v)}
              multiline
              rows={4}
            />
            <Field
              label="Pull quote"
              hint="The italic quote shown in the statistics card."
              value={content.about.quote}
              onChange={v => set('about', 'quote', v)}
              multiline
              rows={2}
            />
          </Card>

          <Card>
            <CardTitle>Your Values (tick list)</CardTitle>
            <div className="space-y-3">
              {content.about.values.map((val, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <span className="text-sm font-bold text-gray-400 w-5 flex-shrink-0">{i + 1}.</span>
                  <input
                    value={val}
                    onChange={e => {
                      const values = [...content.about.values];
                      values[i] = e.target.value;
                      set('about', 'values', values);
                    }}
                    className={inputCls + ' flex-1'}
                    placeholder={`Value ${i + 1}`}
                  />
                  {content.about.values.length > 1 && (
                    <button
                      type="button"
                      onClick={() => set('about', 'values', content.about.values.filter((_, idx) => idx !== i))}
                      className="w-10 h-10 flex items-center justify-center text-red-400 hover:text-red-600 transition-colors border-2 border-gray-100 rounded-xl cursor-pointer flex-shrink-0 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => set('about', 'values', [...content.about.values, ''])}
              className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-700 font-medium transition-colors cursor-pointer mt-1"
            >
              <Plus className="w-4 h-4" /> Add another value
            </button>
          </Card>

          <Card>
            <CardTitle>Statistics</CardTitle>
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Sites built"
                hint='E.g. "127"'
                value={content.about.statSites}
                onChange={v => set('about', 'statSites', v)}
              />
              <Field
                label="Revenue generated"
                hint='E.g. "£2.4M"'
                value={content.about.statRevenue}
                onChange={v => set('about', 'statRevenue', v)}
              />
            </div>
          </Card>
        </>}

        {/* ── CONTACT ── */}
        {section === 'contact' && <>
          <h2 className="text-xl font-bold text-gray-900">Contact Details</h2>
          <p className="text-gray-500 text-sm">Your contact information shown in the footer.</p>

          <Card>
            <Field
              label="Location"
              hint='E.g. "United Kingdom"'
              value={content.contact.location}
              onChange={v => set('contact', 'location', v)}
            />
            <Field
              label="Email address"
              value={content.contact.email}
              onChange={v => set('contact', 'email', v)}
            />
            <Field
              label="Phone number"
              value={content.contact.phone}
              onChange={v => set('contact', 'phone', v)}
            />
            <Field
              label="Footer tagline"
              hint="Short description shown at the bottom of the site."
              value={content.contact.footerTagline}
              onChange={v => set('contact', 'footerTagline', v)}
              multiline
              rows={2}
            />
          </Card>
        </>}

        {/* Bottom save button */}
        <button
          onClick={handleSave}
          className={`w-full flex items-center justify-center gap-2 font-bold text-base py-4 rounded-2xl transition-all cursor-pointer shadow-md ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {saved ? <><Check className="w-5 h-5" /> Saved!</> : <><Save className="w-5 h-5" /> Save Changes</>}
        </button>

      </div>
    </div>
  );
}
