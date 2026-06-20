// ─── Content schema & defaults ────────────────────────────────────────────────

export interface SiteContent {
  hero: {
    label: string;
    headline: string;
    headlineAccent: string;
    body: string;
    cta1: string;
    cta2: string;
    statSites: string;
    statRevenue: string;
  };
  painPoints: {
    sectionLabel: string;
    heading: string;
    items: { title: string; body: string }[];
  };
  services: {
    sectionLabel: string;
    heading: string;
    items: { title: string; body: string }[];
  };
  work: {
    sectionLabel: string;
    heading: string;
    projects: { business: string; trade: string; location: string; metric: string; metricLabel: string }[];
  };
  testimonials: {
    sectionLabel: string;
    heading: string;
    items: { name: string; trade: string; text: string }[];
  };
  about: {
    sectionLabel: string;
    heading: string;
    body1: string;
    body2: string;
    values: string[];
    statSites: string;
    statRevenue: string;
    quote: string;
  };
  contact: {
    location: string;
    email: string;
    phone: string;
    footerTagline: string;
  };
}

export const defaultContent: SiteContent = {
  hero: {
    label: 'Web Design for the Trades',
    headline: 'Your Website Is Losing You Jobs',
    headlineAccent: 'Every Single Day.',
    body: "Most trade businesses lose 5+ leads a week to a website that looks outdated, loads slow, or doesn't rank on Google. We build high-performance booking engines that look incredible.",
    cta1: 'See Our Work',
    cta2: 'Get Free Audit',
    statSites: '127',
    statRevenue: '£2.4M',
  },
  painPoints: {
    sectionLabel: 'The Problem',
    heading: "You built a great business. Your website doesn't show it.",
    items: [
      {
        title: "You're Invisible on Google",
        body: "Customers in your city are searching right now. They're clicking your competitors because you're not showing up.",
      },
      {
        title: 'Your Site Kills Trust in Seconds',
        body: 'Visitors judge your business in 0.05 seconds. An outdated site tells them to look elsewhere before you say a word.',
      },
      {
        title: "You're Leaking Leads Daily",
        body: "No clear call to action. Not mobile optimised. Every visitor who leaves without calling is money you'll never see.",
      },
    ],
  },
  services: {
    sectionLabel: 'What We Do',
    heading: 'Websites That Work As Hard As You Do.',
    items: [
      { title: 'Web Design & Build', body: 'Custom sites built from scratch. Fast, mobile-first, designed to turn visitors into phone calls.' },
      { title: 'Local SEO', body: 'Rank in your city and the towns around it. Be the first business customers find, not the fifth.' },
      { title: 'Google Business Profile', body: 'Your most powerful free tool, fully optimised so you dominate the local map pack.' },
      { title: 'Website Audits', body: "We tell you exactly what's broken and why you're losing leads — free, with no sales pressure." },
    ],
  },
  work: {
    sectionLabel: 'Our Work',
    heading: 'Built for Tradespeople, Loved by Google.',
    projects: [
      { business: 'Patel Plumbing', trade: 'Plumbing', location: 'Birmingham', metric: '+312%', metricLabel: 'Google Leads' },
      { business: 'SharkElec', trade: 'Electrical', location: 'Manchester', metric: '#1', metricLabel: 'Local Rank' },
      { business: 'BuildRight', trade: 'Building', location: 'London', metric: '£180k', metricLabel: 'New Revenue' },
      { business: 'Cool Climate', trade: 'HVAC', location: 'Bristol', metric: '4.9★', metricLabel: 'Google Rating' },
    ],
  },
  testimonials: {
    sectionLabel: 'What Clients Say',
    heading: "Real Results. Real Tradespeople.",
    items: [
      { name: 'Mike P.', trade: 'Plumber, Birmingham', text: "Got 3 new leads in the first week. The ROI is unreal — best money I've spent on marketing." },
      { name: 'Sarah K.', trade: 'Electrician, Manchester', text: "First page of Google in 6 weeks. I'm now turning away work because we're too busy." },
      { name: 'James T.', trade: 'Builder, London', text: "Finally a web agency that actually understands trades. Professional, fast, and they deliver." },
    ],
  },
  about: {
    sectionLabel: 'About Us',
    heading: 'Built by Tradespeople, for Tradespeople.',
    body1: "Most web agencies don't understand the trades. They build pretty sites that don't convert. We specialise exclusively in trade businesses — plumbers, electricians, builders, and more.",
    body2: "Founded in 2025, Trade Kings Agency is UK-based and obsessed with one metric: how many phone calls does your website generate. That's it.",
    values: [
      'No long-term contracts — pay month to month',
      'UK-based team, zero outsourcing',
      'Dedicated account manager from day one',
      'Results guaranteed or we work for free until we deliver',
    ],
    statSites: '127',
    statRevenue: '£2.4M',
    quote: "We only work with trade businesses. It's all we do, and it's why we're better at it than anyone else.",
  },
  contact: {
    location: 'United Kingdom',
    email: 'hello@tradekings.agency',
    phone: '+44 1234 567890',
    footerTagline: 'Web design and local SEO for UK trade businesses. We build sites that get calls.',
  },
};

const STORAGE_KEY = 'tk_content_v1';

export function loadContent(): SiteContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as SiteContent;
  } catch {}
  return defaultContent;
}

export function saveContent(c: SiteContent): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
}
