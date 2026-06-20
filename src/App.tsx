import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import {
  Crown, ArrowRight, Globe, Search, BarChart3, FileSearch,
  Star, X, Check, Phone, MapPin, Mail,
} from 'lucide-react';

// ─── Animation primitives ────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function InView({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-72px' });
  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const painPoints = [
  {
    num: '01',
    title: "You're Invisible on Google",
    body: 'Customers in your city are searching right now. They\'re clicking your competitors because you\'re not showing up.',
  },
  {
    num: '02',
    title: 'Your Site Kills Trust in Seconds',
    body: 'Visitors judge your business in 0.05 seconds. An outdated site tells them to look elsewhere before you say a word.',
  },
  {
    num: '03',
    title: "You're Leaking Leads Daily",
    body: 'No clear call to action. Not mobile optimised. Every visitor who leaves without calling is money you\'ll never see.',
  },
];

const services = [
  {
    icon: Globe,
    title: 'Web Design & Build',
    body: 'Custom sites built from scratch. Fast, mobile-first, designed to turn visitors into phone calls.',
  },
  {
    icon: Search,
    title: 'Local SEO',
    body: 'Rank in your city and the towns around it. Be the first business customers find, not the fifth.',
  },
  {
    icon: BarChart3,
    title: 'Google Business Profile',
    body: 'Your most powerful free tool, fully optimised so you dominate the local map pack.',
  },
  {
    icon: FileSearch,
    title: 'Website Audits',
    body: "We tell you exactly what's broken and why you're losing leads — free, with no sales pressure.",
  },
];

const projects = [
  { business: 'Patel Plumbing', trade: 'Plumbing', location: 'Birmingham', metric: '+312%', label: 'Google Leads' },
  { business: 'SharkElec', trade: 'Electrical', location: 'Manchester', metric: '#1', label: 'Local Rank' },
  { business: 'BuildRight', trade: 'Building', location: 'London', metric: '£180k', label: 'New Revenue' },
  { business: 'Cool Climate', trade: 'HVAC', location: 'Bristol', metric: '4.9★', label: 'Google Rating' },
];

const tradeTypes = [
  'Plumber', 'Electrician', 'Builder', 'Roofer', 'Gas Engineer',
  'HVAC / Air Con', 'Painter & Decorator', 'Landscaper', 'Carpenter', 'Other',
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  name: string;
  phone: string;
  email: string;
  businessName: string;
  businessType: string;
  website: string;
  noWebsite: boolean;
}

const emptyForm: FormData = {
  name: '',
  phone: '',
  email: '',
  businessName: '',
  businessType: 'Plumber',
  website: '',
  noWebsite: false,
};

// ─── Label component ──────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: string }) {
  return (
    <motion.p variants={fadeUp} className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-red mb-4">
      {children}
    </motion.p>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [auditSubmitted, setAuditSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>(emptyForm);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 15);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isModalOpen]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setFormData(prev => ({ ...prev, [name]: checked !== undefined ? checked : value }));
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    setAuditSubmitted(true);
  };

  const openModal = () => {
    setFormData(emptyForm);
    setAuditSubmitted(false);
    setIsModalOpen(true);
  };

  const scrollTo = (selector: string) => {
    setMobileMenuOpen(false);
    const el = document.querySelector(selector);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const navLinks = [
    ['Home', '#home'],
    ['The Problem', '#pain-points'],
    ['Services', '#services'],
    ['Work', '#work'],
    ['About', '#about'],
  ] as const;

  return (
    <div className="bg-white min-h-screen selection:bg-brand-red selection:text-white">

      {/* ══════════════════════════════ NAV ══════════════════════════════ */}
      <nav className={`fixed top-0 left-0 w-full z-40 bg-white transition-all duration-300 ${
        isScrolled ? 'border-b border-brand-dark/10 py-3 md:py-4' : 'py-4 md:py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex justify-between items-center">

          {/* Logo */}
          <a
            href="#home"
            onClick={e => { e.preventDefault(); scrollTo('#home'); }}
            className="flex items-center space-x-2 z-50 group"
          >
            <div className="bg-brand-red p-1.5 rounded-[3px] text-white flex items-center justify-center transition-transform group-hover:scale-105 duration-200">
              <Crown className="w-4 h-4 fill-white" />
            </div>
            <span className="font-display font-black text-brand-dark tracking-tighter text-lg sm:text-xl md:text-2xl flex items-center">
              TRADE KINGS{' '}
              <span
                className="font-sans font-medium tracking-widest text-brand-red ml-1.5 px-1.5 py-0.5 bg-brand-red/5 rounded-sm uppercase"
                style={{ fontSize: '9px' }}
              >
                AGENCY
              </span>
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(([label, href]) => (
              <button
                key={href}
                onClick={() => scrollTo(href)}
                className="text-xs font-bold uppercase tracking-widest text-brand-dark hover:text-brand-red transition-colors duration-200 cursor-pointer"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={openModal}
              className="hidden sm:inline-block bg-brand-red text-white hover:bg-brand-red/90 transition-colors text-xs uppercase tracking-wider font-bold py-3 px-5 md:px-6 rounded-[2px] cursor-pointer"
            >
              Get Free Audit
            </button>
            <button
              onClick={() => setMobileMenuOpen(v => !v)}
              className="md:hidden p-2 z-50 flex flex-col justify-center items-center w-10 h-10 border border-brand-dark/10 rounded-[2px] hover:border-brand-red/40 bg-white transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              <div className="w-5 h-[2px] bg-brand-dark transition-all duration-300" style={{ transform: mobileMenuOpen ? 'rotate(45deg) translate(2px, 3px)' : 'none' }} />
              <div className="w-5 h-[2px] bg-brand-dark mt-[4px] transition-all duration-300" style={{ opacity: mobileMenuOpen ? 0 : 1 }} />
              <div className="w-5 h-[2px] bg-brand-dark mt-[4px] transition-all duration-300" style={{ transform: mobileMenuOpen ? 'rotate(-45deg) translate(2px, -3px)' : 'none' }} />
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.22 }}
              className="absolute top-full left-0 w-full bg-white border-b border-brand-dark/10 z-30 flex flex-col px-6 py-8 space-y-6 md:hidden"
            >
              {navLinks.map(([label, href]) => (
                <button
                  key={href}
                  onClick={() => scrollTo(href)}
                  className="text-left font-display font-black text-xl tracking-tight text-brand-dark uppercase py-1 border-b border-brand-dark/5 hover:text-brand-red transition-colors"
                >
                  {label}
                </button>
              ))}
              <div className="pt-2">
                <button
                  onClick={() => { setMobileMenuOpen(false); openModal(); }}
                  className="w-full bg-brand-red text-white py-4 text-center text-xs uppercase tracking-widest font-black rounded-[2px] cursor-pointer"
                >
                  Get Free Audit
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ══════════════════════════════ HERO ══════════════════════════════ */}
      <header id="home" className="min-h-screen pt-24 sm:pt-28 md:pt-32 pb-16 flex flex-col justify-center px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-14 lg:gap-20 items-center">

            {/* ── Text column ── */}
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.p variants={fadeUp} className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-red mb-6">
                Web Design for the Trades
              </motion.p>

              <motion.h1
                variants={fadeUp}
                className="font-display font-black text-4xl sm:text-5xl lg:text-[3.6rem] xl:text-7xl leading-[1.0] tracking-tight text-brand-dark mb-6"
                style={{ textWrap: 'balance' } as React.CSSProperties}
              >
                Your Website Is Losing You Jobs{' '}
                <span className="text-brand-red">Every Single Day.</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-base sm:text-lg text-brand-dark/65 mb-8 max-w-lg leading-relaxed">
                Most trade businesses lose 5+ leads a week to a website that looks outdated, loads slow, or doesn't rank on Google. We build high-performance booking engines that look incredible.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 mb-10">
                <button
                  onClick={() => scrollTo('#work')}
                  className="bg-brand-red text-white hover:bg-brand-red/90 transition-all font-bold text-xs uppercase tracking-widest py-4 px-7 rounded-[2px] flex items-center justify-center gap-2 group cursor-pointer"
                >
                  See Our Work
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 duration-200" />
                </button>
                <button
                  onClick={openModal}
                  className="border border-brand-dark/18 text-brand-dark hover:border-brand-red hover:text-brand-red transition-all font-bold text-xs uppercase tracking-widest py-4 px-7 rounded-[2px] cursor-pointer"
                >
                  Get Free Audit
                </button>
              </motion.div>

              {/* Stats strip */}
              <motion.div variants={fadeUp} className="flex items-center gap-5 sm:gap-7 pt-6 border-t border-brand-dark/8">
                {[
                  { val: '127', label: 'Sites Built' },
                  { val: '£2.4M', label: 'Revenue Generated' },
                  { val: '5★', label: 'Rated' },
                ].map((s, i) => (
                  <div key={s.label} className={`flex flex-col ${i > 0 ? 'pl-5 sm:pl-7 border-l border-brand-dark/8' : ''}`}>
                    <span className="font-display font-black text-xl text-brand-dark tracking-tight">{s.val}</span>
                    <span className="text-[10px] uppercase tracking-widest text-brand-dark/45 font-bold mt-0.5">{s.label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* ── Logo card column ── */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.18 }}
              className="hidden md:block"
            >
              <div className="border border-brand-dark/10 p-7 lg:p-9 aspect-square flex flex-col max-w-md mx-auto hover:border-brand-red/20 transition-colors duration-500">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/30">EST. 2025</span>
                  <div className="w-2 h-2 bg-brand-red rounded-full" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/30">UNITED KINGDOM</span>
                </div>

                {/* Logo */}
                <div className="flex-1 flex items-center justify-center py-8">
                  <div className="text-center leading-[0.86] select-none">
                    <div
                      className="font-display font-black text-stroke block"
                      style={{ fontSize: 'clamp(3.2rem, 7.5vw, 5.2rem)', letterSpacing: '-0.03em' }}
                    >
                      TRADE
                    </div>
                    <div
                      className="font-display font-black text-brand-red block"
                      style={{ fontSize: 'clamp(3.2rem, 7.5vw, 5.2rem)', letterSpacing: '-0.03em' }}
                    >
                      KINGS
                    </div>
                    <div className="font-sans font-bold text-xs tracking-[0.5em] text-brand-dark mt-4">
                      AGENCY
                    </div>
                  </div>
                </div>

                {/* Footer row */}
                <p className="text-center text-[10px] font-bold uppercase tracking-widest text-brand-dark/30">
                  WEB DESIGN & LOCAL SEO SPECIALISTS
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </header>

      {/* ══════════════════════════ PAIN POINTS ══════════════════════════ */}
      <section id="pain-points" className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 bg-brand-muted">
        <div className="max-w-7xl mx-auto">
          <InView className="text-center mb-12 md:mb-16">
            <SectionLabel>The Problem</SectionLabel>
            <motion.h2
              variants={fadeUp}
              className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-brand-dark tracking-tight max-w-2xl mx-auto"
              style={{ textWrap: 'balance' } as React.CSSProperties}
            >
              You built a great business. Your website doesn't show it.
            </motion.h2>
          </InView>

          <InView className="grid md:grid-cols-3 gap-4 md:gap-5">
            {painPoints.map(point => (
              <motion.div
                key={point.num}
                variants={fadeUp}
                className="bg-white border border-brand-dark/8 p-7 md:p-8 hover:border-brand-red/25 hover:shadow-xl hover:shadow-brand-red/6 transition-all duration-300 group"
              >
                <div className="font-display font-black text-[3.5rem] leading-none text-brand-red mb-5 tracking-tight">
                  {point.num}
                </div>
                <h3 className="font-display font-black text-sm uppercase tracking-tight text-brand-dark mb-3">
                  {point.title}
                </h3>
                <p className="text-sm text-brand-dark/60 leading-relaxed">
                  {point.body}
                </p>
              </motion.div>
            ))}
          </InView>
        </div>
      </section>

      {/* ══════════════════════════ SERVICES ══════════════════════════════ */}
      <section id="services" className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <InView className="mb-12 md:mb-16">
            <SectionLabel>What We Do</SectionLabel>
            <motion.h2
              variants={fadeUp}
              className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] text-brand-dark tracking-tight max-w-xl"
              style={{ textWrap: 'balance' } as React.CSSProperties}
            >
              Websites That Work As Hard As You Do.
            </motion.h2>
          </InView>

          <InView className="grid sm:grid-cols-2 gap-4 md:gap-5">
            {services.map(svc => {
              const Icon = svc.icon;
              return (
                <motion.div
                  key={svc.title}
                  variants={fadeUp}
                  className="border border-brand-dark/8 p-7 md:p-9 group hover:border-brand-red/30 hover:shadow-xl hover:shadow-brand-red/5 transition-all duration-300 cursor-default"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-[3px] bg-brand-red/8 mb-5 group-hover:bg-brand-red transition-colors duration-300">
                    <Icon className="w-5 h-5 text-brand-red group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-display font-black text-sm uppercase tracking-tight text-brand-dark mb-3">
                    {svc.title}
                  </h3>
                  <p className="text-sm text-brand-dark/60 leading-relaxed mb-5">
                    {svc.body}
                  </p>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-red opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span>Learn More</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </motion.div>
              );
            })}
          </InView>

          {/* Services CTA nudge */}
          <InView className="mt-8">
            <motion.div variants={fadeUp} className="border border-brand-dark/8 p-6 sm:p-8 bg-brand-muted flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div>
                <p className="font-display font-black text-lg text-brand-dark tracking-tight">Not sure what you need?</p>
                <p className="text-sm text-brand-dark/55 mt-1">We'll tell you for free. No pitch, no pressure.</p>
              </div>
              <button
                onClick={openModal}
                className="flex-shrink-0 bg-brand-red text-white hover:bg-brand-red/90 transition-colors font-bold text-xs uppercase tracking-widest py-3.5 px-6 rounded-[2px] cursor-pointer inline-flex items-center gap-2 group"
              >
                Get Free Audit
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 duration-200" />
              </button>
            </motion.div>
          </InView>
        </div>
      </section>

      {/* ══════════════════════════ WORK ══════════════════════════════════ */}
      <section id="work" className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 bg-brand-dark">
        <div className="max-w-7xl mx-auto">
          <InView className="mb-12 md:mb-16">
            <motion.p variants={fadeUp} className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-red mb-4">
              Our Work
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] text-white tracking-tight max-w-xl"
              style={{ textWrap: 'balance' } as React.CSSProperties}
            >
              Built for Tradespeople, Loved by Google.
            </motion.h2>
          </InView>

          <InView className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {projects.map(p => (
              <motion.div
                key={p.business}
                variants={fadeUp}
                className="border border-white/8 p-6 hover:border-brand-red/40 transition-all duration-300 group"
              >
                <div className="mb-5">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1.5">
                    {p.trade} · {p.location}
                  </div>
                  <div className="font-display font-black text-lg text-white tracking-tight">{p.business}</div>
                </div>
                <div className="border-t border-white/8 pt-5">
                  <div className="font-display font-black text-4xl text-brand-red tracking-tight">{p.metric}</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-white/40 mt-1">{p.label}</div>
                </div>
                <div className="mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-red opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span>View Case Study</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </motion.div>
            ))}
          </InView>

          <InView className="mt-10 md:mt-14">
            <motion.div
              variants={fadeUp}
              className="border border-white/8 p-8 md:p-10 text-center"
            >
              <p className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-3">Every project, every client</p>
              <p className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight mb-7">
                We don't take on work we can't win.
              </p>
              <button
                onClick={openModal}
                className="bg-brand-red text-white hover:bg-brand-red/90 transition-colors font-bold text-xs uppercase tracking-widest py-4 px-8 rounded-[2px] cursor-pointer inline-flex items-center gap-2 group"
              >
                Get Your Free Website Audit
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 duration-200" />
              </button>
            </motion.div>
          </InView>
        </div>
      </section>

      {/* ══════════════════════════ ABOUT ═════════════════════════════════ */}
      <section id="about" className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-14 lg:gap-20 items-start">

            {/* Text */}
            <InView>
              <SectionLabel>About Us</SectionLabel>
              <motion.h2
                variants={fadeUp}
                className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-brand-dark tracking-tight mb-6"
                style={{ textWrap: 'balance' } as React.CSSProperties}
              >
                Built by Tradespeople, for Tradespeople.
              </motion.h2>
              <motion.p variants={fadeUp} className="text-base text-brand-dark/62 leading-relaxed mb-4 max-w-lg">
                Most web agencies don't understand the trades. They build pretty sites that don't convert. We specialise exclusively in trade businesses — plumbers, electricians, builders, and more.
              </motion.p>
              <motion.p variants={fadeUp} className="text-base text-brand-dark/62 leading-relaxed mb-8 max-w-lg">
                Founded in 2025, Trade Kings Agency is UK-based and obsessed with one metric: how many phone calls does your website generate. That's it.
              </motion.p>
              <motion.div variants={fadeUp} className="space-y-3">
                {[
                  'No long-term contracts — pay month to month',
                  'UK-based team, zero outsourcing',
                  'Dedicated account manager from day one',
                  'Results guaranteed or we work for free until we deliver',
                ].map(v => (
                  <div key={v} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-brand-red/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-brand-red" />
                    </div>
                    <span className="text-sm text-brand-dark/75 font-medium">{v}</span>
                  </div>
                ))}
              </motion.div>
            </InView>

            {/* Stats card */}
            <InView>
              <motion.div variants={fadeUp} className="border border-brand-dark/8 p-8 md:p-10">
                <div className="grid grid-cols-2 gap-7 mb-8">
                  {[
                    { val: '127', label: 'Sites Built', sub: 'And counting' },
                    { val: '£2.4M', label: 'Revenue Generated', sub: 'For our clients' },
                    { val: '100%', label: 'UK Based', sub: 'No outsourcing' },
                    { val: '5★', label: 'Google Rating', sub: 'Every review' },
                  ].map(s => (
                    <div key={s.label} className="border-l-2 border-brand-red pl-4">
                      <div className="font-display font-black text-3xl text-brand-dark tracking-tight">{s.val}</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-brand-dark mt-1">{s.label}</div>
                      <div className="text-xs text-brand-dark/35 mt-0.5">{s.sub}</div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-brand-dark/8 pt-7">
                  <p className="text-sm text-brand-dark/55 italic leading-relaxed">
                    "We only work with trade businesses. It's all we do, and it's why we're better at it than anyone else."
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/35 mt-4">— Trade Kings Agency</p>
                </div>
              </motion.div>
            </InView>

          </div>
        </div>
      </section>

      {/* ══════════════════════════ CTA BANNER ═══════════════════════════ */}
      <section className="py-20 sm:py-24 md:py-28 px-4 sm:px-6 md:px-12 bg-brand-red">
        <div className="max-w-7xl mx-auto">
          <InView className="text-center">
            <motion.h2
              variants={fadeUp}
              className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight mb-5"
              style={{ textWrap: 'balance' } as React.CSSProperties}
            >
              Ready to Stop Losing Jobs to Competitors?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/75 text-base sm:text-lg mb-9 max-w-lg mx-auto leading-relaxed">
              Book a free website audit. We'll show you exactly what's holding your business back — no pitch, no pressure.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={openModal}
                className="bg-white text-brand-red hover:bg-white/92 transition-colors font-black text-xs uppercase tracking-widest py-4 px-8 rounded-[2px] cursor-pointer font-display inline-flex items-center justify-center gap-2 group"
              >
                Get Free Audit Now
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 duration-200" />
              </button>
              <a
                href="tel:+441234567890"
                className="border-2 border-white/35 text-white hover:border-white hover:bg-white/10 transition-colors font-bold text-xs uppercase tracking-widest py-4 px-8 rounded-[2px] inline-flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5" />
                Call Us Direct
              </a>
            </motion.div>
          </InView>
        </div>
      </section>

      {/* ══════════════════════════ FOOTER ════════════════════════════════ */}
      <footer className="py-14 md:py-16 px-4 sm:px-6 md:px-12 bg-brand-dark">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">

            {/* Brand */}
            <div className="sm:col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-brand-red p-1.5 rounded-[3px]">
                  <Crown className="w-4 h-4 fill-white text-white" />
                </div>
                <span className="font-display font-black text-white tracking-tighter text-lg">TRADE KINGS</span>
              </div>
              <p className="text-sm text-white/38 leading-relaxed max-w-xs">
                Web design and local SEO for UK trade businesses. We build sites that get calls.
              </p>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-5">Services</h4>
              <ul className="space-y-2.5">
                {['Web Design & Build', 'Local SEO', 'Google Business Profile', 'Website Audits'].map(item => (
                  <li key={item}>
                    <button
                      onClick={() => scrollTo('#services')}
                      className="text-sm text-white/50 hover:text-white transition-colors cursor-pointer"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-5">Company</h4>
              <ul className="space-y-2.5">
                {([['About', '#about'], ['Our Work', '#work'], ['Get Audit', '#home']] as const).map(([label, href]) => (
                  <li key={label}>
                    <button
                      onClick={() => href === '#home' ? openModal() : scrollTo(href)}
                      className="text-sm text-white/50 hover:text-white transition-colors cursor-pointer"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-5">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-red flex-shrink-0" />
                  <span className="text-sm text-white/50">United Kingdom</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-3.5 h-3.5 text-brand-red flex-shrink-0" />
                  <a href="mailto:hello@tradekings.agency" className="text-sm text-white/50 hover:text-white transition-colors">
                    hello@tradekings.agency
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/6 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/22">© 2025 Trade Kings Agency. All rights reserved.</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className="w-3 h-3 text-brand-red fill-brand-red" />
              ))}
              <span className="text-xs text-white/28 ml-2">5★ Rated on Google</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ══════════════════════════ AUDIT MODAL ══════════════════════════ */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-brand-dark/75 z-50 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />

            {/* Panel */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 36, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 36, scale: 0.97 }}
              transition={{ duration: 0.35, ease }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[2px] relative shadow-2xl">

                {/* Header */}
                <div className="p-6 sm:p-8 border-b border-brand-dark/8 flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-brand-red mb-1">Free Service</p>
                    <h3 className="font-display font-black text-2xl text-brand-dark tracking-tight">
                      {auditSubmitted ? 'Request Received!' : 'Get Your Free Website Audit'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-8 h-8 flex items-center justify-center text-brand-dark/35 hover:text-brand-dark transition-colors -mt-0.5 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body */}
                <div className="p-6 sm:p-8">
                  {auditSubmitted ? (
                    /* Success state */
                    <div className="text-center py-4">
                      <div className="w-14 h-14 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-5">
                        <Check className="w-7 h-7 text-brand-red" />
                      </div>
                      <p className="font-display font-black text-xl text-brand-dark mb-3 tracking-tight">
                        We'll be in touch within 24 hours.
                      </p>
                      <p className="text-sm text-brand-dark/55 mb-7 leading-relaxed max-w-sm mx-auto">
                        Your free audit is on the way. We'll review your site and send you a detailed breakdown of exactly what's costing you leads.
                      </p>
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="bg-brand-red text-white font-bold text-xs uppercase tracking-widest py-3 px-6 rounded-[2px] cursor-pointer hover:bg-brand-red/90 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  ) : (
                    /* Form */
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <p className="text-sm text-brand-dark/55 -mt-2 mb-1 leading-relaxed">
                        No pitch. No pressure. Just an honest breakdown of what's holding your site back.
                      </p>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/45 block mb-1.5">Your Name *</label>
                          <input
                            name="name" value={formData.name} onChange={handleInputChange} required
                            placeholder="John Smith"
                            className="w-full border border-brand-dark/14 px-3 py-2.5 text-sm text-brand-dark placeholder:text-brand-dark/28 focus:border-brand-red focus:outline-none transition-colors rounded-[2px]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/45 block mb-1.5">Phone *</label>
                          <input
                            name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required
                            placeholder="07700 000000"
                            className="w-full border border-brand-dark/14 px-3 py-2.5 text-sm text-brand-dark placeholder:text-brand-dark/28 focus:border-brand-red focus:outline-none transition-colors rounded-[2px]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/45 block mb-1.5">Email *</label>
                        <input
                          name="email" type="email" value={formData.email} onChange={handleInputChange} required
                          placeholder="john@yourplumbing.co.uk"
                          className="w-full border border-brand-dark/14 px-3 py-2.5 text-sm text-brand-dark placeholder:text-brand-dark/28 focus:border-brand-red focus:outline-none transition-colors rounded-[2px]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/45 block mb-1.5">Business Name *</label>
                          <input
                            name="businessName" value={formData.businessName} onChange={handleInputChange} required
                            placeholder="Your Plumbing Ltd"
                            className="w-full border border-brand-dark/14 px-3 py-2.5 text-sm text-brand-dark placeholder:text-brand-dark/28 focus:border-brand-red focus:outline-none transition-colors rounded-[2px]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/45 block mb-1.5">Trade *</label>
                          <select
                            name="businessType" value={formData.businessType} onChange={handleInputChange}
                            className="w-full border border-brand-dark/14 px-3 py-2.5 text-sm text-brand-dark focus:border-brand-red focus:outline-none transition-colors rounded-[2px] bg-white"
                          >
                            {tradeTypes.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/45 block mb-1.5">
                          Website URL{formData.noWebsite ? ' (optional)' : ''}
                        </label>
                        <input
                          name="website" type={formData.noWebsite ? 'text' : 'url'} value={formData.website}
                          onChange={handleInputChange} disabled={formData.noWebsite}
                          placeholder="https://yourplumbing.co.uk"
                          className="w-full border border-brand-dark/14 px-3 py-2.5 text-sm text-brand-dark placeholder:text-brand-dark/28 focus:border-brand-red focus:outline-none transition-colors rounded-[2px] disabled:bg-brand-muted disabled:text-brand-dark/28"
                        />
                        <label className="flex items-center gap-2 mt-2 cursor-pointer">
                          <input
                            type="checkbox" name="noWebsite" checked={formData.noWebsite}
                            onChange={handleInputChange} className="accent-brand-red"
                          />
                          <span className="text-xs text-brand-dark/45">I don't have a website yet</span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-brand-red text-white font-black text-xs uppercase tracking-widest py-4 rounded-[2px] hover:bg-brand-red/90 transition-colors cursor-pointer flex items-center justify-center gap-2 group font-display mt-2"
                      >
                        Send My Free Audit Request
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 duration-200" />
                      </button>
                      <p className="text-xs text-brand-dark/30 text-center">No spam. We'll only contact you about your audit.</p>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
