import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowRight,
  BellRing,
  BookOpenText,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  Headphones,
  Image as ImageIcon,
  LayoutGrid,
  LibraryBig,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards,
} from 'lucide-react';
import LibraryLogoIcon from '../components/Icons/LibraryLogoIcon';

const navLinks = [
  { label: 'Home', section: 'hero' },
  { label: 'Benefits', section: 'overview' },
  { label: 'Modules', section: 'modules' },
  { label: 'Contact', section: 'cta' },
];

const heroStats = [
  { icon: Users, value: '15.2K', label: 'Active students' },
  { icon: BookOpenText, value: '4.5K', label: 'Tutors' },
  { icon: LayoutGrid, value: '280+', label: 'Resources' },
];

const heroGalleryCards = [
  {
    title: 'View 01',
    hint: 'Library study zone',
    bgClass: 'bg-[#c9ecff]',
    image: '/6.webp',
    wide: false,
  },
  {
    title: 'View 02',
    hint: 'Main reading hall',
    bgClass: 'bg-[#ddd1ff]',
    image: '/18.webp',
    wide: false,
  },
  {
    title: 'View 03',
    hint: 'Workstation view',
    bgClass: 'bg-[#d8e8bf]',
    image: '/insights-library.jpg',
    wide: false,
  },
  {
    title: 'View 04',
    hint: 'Focused study area',
    bgClass: 'bg-[#f1e8ff]',
    image: '/6.webp',
    wide: false,
  },
];

const benefits = [
  'Seat wise layout with quick add, edit and renewal actions.',
  'User profiles, attendance and booking history stay together.',
  'Payment notes, reminder flow and proofs remain easy to track.',
  'Built for local study libraries that need fast daily desk work.',
];

const featureStrip = [
  {
    icon: LayoutGrid,
    title: 'Seat Matrix',
    description: 'Manage seats, shifts and availability from one live view.',
  },
  {
    icon: WalletCards,
    title: 'Bookings',
    description: 'Track renewals, dues and payment proof without confusion.',
  },
  {
    icon: BellRing,
    title: 'Reminders',
    description: 'Follow up on pending renewals and fresh enquiries quickly.',
  },
  {
    icon: Headphones,
    title: 'Desk Support',
    description: 'Designed for real front-desk workflow during busy hours.',
  },
];

const moduleCards = [
  {
    title: 'Seat Matrix',
    badge: 'Live layout',
    description: 'Visual seating overview with shift filters and quick assignment flow.',
    icon: LayoutGrid,
    accent: 'from-[#b9e29f] via-[#d7efbe] to-[#f4fbec]',
    meta: ['Realtime', 'Shift wise', 'Fast edit'],
  },
  {
    title: 'Bookings & Payments',
    badge: 'Finance flow',
    description: 'Handle renewals, entries, due reminders and screenshot proof smoothly.',
    icon: CreditCard,
    accent: 'from-[#cbbcff] via-[#ddd1ff] to-[#f5f0ff]',
    meta: ['Receipts', 'Renewals', 'Ledger notes'],
  },
  {
    title: 'Members',
    badge: 'User records',
    description: 'Profiles, seat details and history remain available in one clean place.',
    icon: Users,
    accent: 'from-[#bfe7ff] via-[#d9f0ff] to-[#f2faff]',
    meta: ['Profiles', 'History', 'Contact info'],
  },
  {
    title: 'Attendance',
    badge: 'Daily activity',
    description: 'Check-ins and reports stay visible so the desk always knows what is happening.',
    icon: CalendarClock,
    accent: 'from-[#f4d2c0] via-[#f9e5d9] to-[#fff5ef]',
    meta: ['Check-ins', 'Reports', 'Daily logs'],
  },
];

const ctaPoints = [
  { icon: MapPin, text: 'Made for local libraries and study hall operations' },
  { icon: ShieldCheck, text: 'Clean structure for admin work, members and payments' },
  { icon: CalendarClock, text: 'Fast enough for daily desk use from morning to night' },
];

const footerLinks = ['Home', 'Benefits', 'Modules', 'Admin Login'];

const scrollTo = (sectionId) => {
  const target = document.getElementById(sectionId);

  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const StatItem = ({ icon: Icon, value, label }) => (
  <div className="flex items-center gap-2.5 rounded-[18px] bg-white px-3.5 py-2.5 shadow-[0_12px_24px_rgba(137,167,117,0.06)] ring-1 ring-[#edf3e3]">
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f2ecff] text-[#a896ef]">
      <Icon className="h-4.5 w-4.5" />
    </span>
    <div>
      <p className="font-display text-lg font-bold text-slate-900 sm:text-xl">{value}</p>
      <p className="text-[11px] text-slate-500 sm:text-xs">{label}</p>
    </div>
  </div>
);

const ImageBox = ({ title, hint, bgClass, image, wide = false, className = '' }) => (
  <div
    className={`group relative overflow-hidden rounded-[34px] ${bgClass} shadow-[0_22px_50px_rgba(137,167,117,0.12)] ${className} ${
      wide ? 'min-h-[108px]' : 'min-h-[150px]'
    }`}
  >
    <span className="absolute left-3 top-3 z-10 rounded-full bg-white/85 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500 shadow-sm">
      {title}
    </span>

    {image ? (
      <>
        <img
          key={image}
          src={image}
          alt={title || hint || 'Library gallery'}
          className="landing-image-swap h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_38%,rgba(15,23,42,0.08)_100%)]" />
      </>
    ) : (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-5 text-center text-slate-500">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/80 text-[#a896ef] shadow-sm">
          <ImageIcon className="h-6 w-6" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-700">{hint}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">Ready for your image</p>
        </div>
      </div>
    )}
  </div>
);

 

 

const ModuleCard = ({ module, active, onEnter }) => {
  const Icon = module.icon;

  return (
    <article
      onMouseEnter={onEnter}
      className={`rounded-[30px] bg-white p-4 transition-all duration-300 ring-1 ${
        active
          ? 'translate-y-[-4px] shadow-[0_28px_70px_rgba(174,155,243,0.18)] ring-[#ddd1ff]'
          : 'shadow-[0_16px_38px_rgba(137,167,117,0.08)] ring-[#edf3e3]'
      }`}
    >
      <div className={`rounded-[24px] bg-gradient-to-br ${module.accent} p-5`}>
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-600">
            {module.badge}
          </span>
          <Icon className="h-5 w-5 text-slate-700" />
        </div>

        <div className="mt-12 space-y-3">
          <div className="h-2 rounded-full bg-white/60">
            <div className="h-2 w-[78%] rounded-full bg-white" />
          </div>
          <div className="h-2 rounded-full bg-white/60">
            <div className="h-2 w-[56%] rounded-full bg-white" />
          </div>
          <div className="h-2 rounded-full bg-white/60">
            <div className="h-2 w-[84%] rounded-full bg-white" />
          </div>
        </div>
      </div>

      <div className="px-2 pb-1 pt-5">
        <h3 className="font-display text-2xl font-bold text-slate-900">{module.title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">{module.description}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {module.meta.map((item) => (
            <span
              key={item}
              className="rounded-full bg-[#f2ecff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#9d8ee8]"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-[#eef2e5] pt-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <LibraryBig className="h-4 w-4 text-[#9d8ee8]" />
            Included in admin panel
          </div>
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#8eb46d]">Live</span>
        </div>
      </div>
    </article>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeModule, setActiveModule] = useState(moduleCards[0].title);
  const [galleryShift, setGalleryShift] = useState(0);

  const libraryName = import.meta.env.VITE_LIBRARY_NAME || 'Nearest Library';

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (heroGalleryCards.length < 2) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setGalleryShift((currentShift) => (currentShift + 1) % heroGalleryCards.length);
    }, 2600);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#eef6e7] text-slate-900">
      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[960px] bg-[linear-gradient(180deg,#eef6e7_0%,#f8fbf4_42%,#ffffff_100%)]" />
        <div className="landing-grid pointer-events-none absolute inset-x-0 top-0 h-[960px] opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="landing-pulse pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-[#dbe9c8] blur-3xl opacity-90" />
        <div className="landing-drift pointer-events-none absolute right-0 top-10 h-96 w-96 rounded-full bg-[#eee7ff] blur-3xl opacity-90" />

        <header className="sticky top-0 z-30 border-b border-white/60 bg-white/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => scrollTo('hero')}
              className="flex items-center gap-3 text-left"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f2ecff] text-[#a896ef] shadow-sm">
                <LibraryLogoIcon className="h-5 w-5" />
              </span>
              <span className="font-display text-xl font-bold tracking-tight text-[#9d8ee8] sm:text-2xl">
                {libraryName}
              </span>
            </button>

            <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-500 lg:flex">
              {navLinks.map((link) => (
                <button
                  key={link.section}
                  type="button"
                  onClick={() => scrollTo(link.section)}
                  className="transition hover:text-[#9d8ee8]"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="landing-shiny-outline inline-flex items-center justify-center rounded-full border border-[#d9dde3] bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-[#c8b8ff] hover:text-[#9d8ee8]"
            >
              Contact
            </button>
          </div>
        </header>

        <main className="relative z-10">
          <section
            id="hero"
            className="mx-auto flex min-h-[calc(100svh-72px)] max-w-7xl items-center px-4 py-4 sm:px-6 lg:px-8 lg:py-3"
          >
            <div
              className={`grid w-full items-center gap-5 transition-all duration-1000 lg:grid-cols-[1.1fr_.9fr] ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              <div className="relative z-10">

                <h1 className="mt-4 max-w-2xl font-display text-[2.7rem] font-bold leading-[0.98] text-slate-900 sm:text-[3.15rem] lg:max-w-[640px] lg:text-[2.95rem]">
                  Manage your library desk smarter
                </h1>

                <p className="mt-3 max-w-xl text-[15px] leading-6 text-slate-600 sm:text-base lg:max-w-[560px]">
                  {libraryName} keeps seats, records, attendance and payment work organized in one
                  calm workspace designed for fast daily operations.
                </p>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="landing-shiny-btn inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#b8a0ff_0%,#92d9f8_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_44px_rgba(167,160,255,0.34)] transition hover:-translate-y-0.5 hover:brightness-105 sm:px-6 sm:text-base"
                  >
                    Join the System
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollTo('overview')}
                    className="landing-shiny-outline inline-flex items-center justify-center gap-2 rounded-full border border-[#dfd7f6] bg-white/95 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-[#c8b8ff] hover:text-[#8d7ad9] sm:px-6 sm:text-base"
                  >
                    Learn more
                    <Sparkles className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-6 grid gap-2.5 sm:grid-cols-3">
                  {heroStats.map((stat) => (
                    <StatItem key={stat.label} icon={stat.icon} value={stat.value} label={stat.label} />
                  ))}
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-[460px]">
                <div className="pointer-events-none absolute -left-5 top-10 hidden h-16 w-16 rounded-full border-[10px] border-[#d4f1ea] lg:block" />
                <div className="pointer-events-none absolute right-8 top-6 h-3 w-3 rounded-full bg-[#c8b8ff]" />
                <div className="pointer-events-none absolute bottom-6 right-6 h-4 w-4 rounded-full bg-[#9fd8f8]" />
                <div className="pointer-events-none absolute left-[58%] top-[48%] hidden text-[#94b872] lg:block">
                  <Sparkles className="h-4 w-4" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {heroGalleryCards.map((card, index) => (
                    <ImageBox
                      key={card.title}
                      {...card}
                      image={heroGalleryCards[(index + galleryShift) % heroGalleryCards.length].image}
                      className={`${index < 2 ? 'h-[136px] sm:h-[150px] lg:h-[160px]' : 'h-[102px] sm:h-[112px] lg:h-[118px]'} ${
                        index % 2 === 0 ? 'landing-float' : 'landing-float-delay'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
 

          <section id="modules" className="relative py-10">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,#f7fbf3_0%,#fbf8ff_52%,#ffffff_100%)]" />
            <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#ece5ff] blur-3xl opacity-70" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-3xl text-center">
                <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.28em] text-[#8eb46d]">
                  <span className="h-2 w-2 rounded-full bg-[#8eb46d]" />
                  Popular modules
                </span>

                <h2 className="mt-5 font-display text-4xl font-bold text-slate-900 md:text-5xl">
                  The core modules your library team actually uses every day
                </h2>

                <p className="mt-5 text-lg leading-8 text-slate-600">
                  Designed around the exact workflow of admin desks handling seats, members, finances
                  and attendance.
                </p>
              </div>

              <div className="mt-10 flex flex-wrap justify-center gap-3">
                {moduleCards.map((module) => (
                  <button
                    key={module.title}
                    type="button"
                    onClick={() => setActiveModule(module.title)}
                    className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                      activeModule === module.title
                        ? 'bg-[#0f6efc] text-white shadow-[0_14px_30px_rgba(15,110,252,0.22)]'
                        : 'border border-slate-200 bg-white text-slate-600 hover:border-[#0f6efc] hover:text-[#0f6efc]'
                    }`}
                  >
                    {module.title}
                  </button>
                ))}
              </div>

              <div className="mt-12 grid gap-6 lg:grid-cols-4">
                {moduleCards.map((module) => (
                  <ModuleCard
                    key={module.title}
                    module={module}
                    active={activeModule === module.title}
                    onEnter={() => setActiveModule(module.title)}
                  />
                ))}
              </div>

              <div className="mt-12 text-center">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="landing-shiny-btn inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#b8a0ff_0%,#92d9f8_100%)] px-7 py-4 text-base font-semibold text-white shadow-[0_20px_44px_rgba(167,160,255,0.34)] transition hover:-translate-y-0.5 hover:brightness-105"
                >
                  View All Features
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>

          <section id="cta" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="grid items-center gap-10 rounded-[38px] bg-white px-8 py-12 shadow-[0_30px_80px_rgba(137,167,117,0.12)] ring-1 ring-[#e7efdb] md:px-12 lg:grid-cols-[1.15fr_.85fr]">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#faf7ff] px-4 py-2 text-sm font-semibold text-[#9d8ee8] ring-1 ring-[#ece5ff]">
                  <Sparkles className="h-4 w-4 text-[#9d8ee8]" />
                  Ready for a smoother library desk?
                </span>

                <h2 className="mt-6 max-w-xl font-display text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
                  Bring members, seats, attendance and payments into one polished system.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                  A calm interface outside, a practical admin flow inside. The landing page now stays
                  single and open instead of wrapped inside hard edges.
                </p>
              </div>

              <div className="rounded-[30px] bg-[#fbfdf8] p-6 ring-1 ring-[#edf2e5]">
                <div className="space-y-4">
                  {ctaPoints.map(({ icon: Icon, text }) => (
                    <div
                      key={text}
                      className="flex items-start gap-3 rounded-[20px] bg-white p-4 ring-1 ring-[#edf2e5]"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f2ecff] text-[#9d8ee8]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <p className="text-sm leading-6 text-slate-600">{text}</p>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="landing-shiny-btn mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#b8a0ff_0%,#92d9f8_100%)] px-6 py-4 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-105"
                >
                  Access Admin Panel
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>
        </main>

        <footer className="relative z-10">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#f2ecff] text-[#a896ef] shadow-[0_16px_32px_rgba(174,155,243,0.16)]">
                <LibraryLogoIcon className="h-7 w-7" />
              </span>
              <div>
                <p className="font-display text-2xl font-bold text-[#9d8ee8]">{libraryName}</p>
                <p className="text-sm text-slate-500">
                  Library admin interface for seats, users, bookings and attendance.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-500">
              {footerLinks.map((link) => (
                <span key={link} className="transition hover:text-[#9d8ee8]">
                  {link}
                </span>
              ))}
            </div>

            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} {libraryName}. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
