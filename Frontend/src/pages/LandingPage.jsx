import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
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
} from "lucide-react";
import LibraryLogoIcon from "../components/Icons/LibraryLogoIcon";

const navLinks = [
  { label: "Home", section: "hero" },
  { label: "Benefits", section: "overview" },
  { label: "Modules", section: "modules" },
  { label: "Contact", section: "cta" },
];

const heroStats = [
  { icon: Users, value: "1k", label: "Active students" },
  { icon: BookOpenText, value: "4", label: "features" },
  { icon: LayoutGrid, value: "1", label: "Landing Page" },
];

const heroGalleryCards = [
  {
    title: "View 01",
    hint: "Library study zone",
    bgClass: "bg-[#c9ecff]",
    image: "/6.webp",
    wide: false,
  },
  {
    title: "View 02",
    hint: "Main reading hall",
    bgClass: "bg-[#ddd1ff]",
    image: "/18.webp",
    wide: false,
  },
  {
    title: "View 03",
    hint: "Workstation view",
    bgClass: "bg-[#d8e8bf]",
    image: "/insights-library.jpg",
    wide: false,
  },
  {
    title: "View 04",
    hint: "Focused study area",
    bgClass: "bg-[#f1e8ff]",
    image: "/6.webp",
    wide: false,
  },
];

const benefits = [
  "Seat wise layout with quick add, edit and renewal actions.",
  "User profiles, attendance and booking history stay together.",
  "Payment notes, reminder flow and proofs remain easy to track.",
  "Built for local study libraries that need fast daily desk work.",
];

const featureStrip = [
  {
    icon: LayoutGrid,
    title: "Seat Matrix",
    description: "Manage seats, shifts and availability from one live view.",
  },
  {
    icon: WalletCards,
    title: "Bookings",
    description: "Track renewals, dues and payment proof without confusion.",
  },
  {
    icon: BellRing,
    title: "Reminders",
    description: "Follow up on pending renewals and fresh enquiries quickly.",
  },
  {
    icon: Headphones,
    title: "Desk Support",
    description: "Designed for real front-desk workflow during busy hours.",
  },
];

const moduleCards = [
  {
    title: "Members",
    icon: Users,
    description: "Manage profiles & registrations",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Seats",
    icon: LayoutGrid,
    description: "Smart allocation & tracking",
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Revenue",
    icon: CreditCard,
    description: "Financial reports & payments",
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Attendance",
    icon: CalendarClock,
    description: "Automated check-in system",
    color: "from-green-500 to-emerald-500",
  },
];

const ctaPoints = [
  { icon: MapPin, text: "Made for local libraries and study hall operations" },
  {
    icon: ShieldCheck,
    text: "Clean structure for admin work, members and payments",
  },
  {
    icon: CalendarClock,
    text: "Fast enough for daily desk use from morning to night",
  },
];

const footerLinks = ["Home", "Benefits", "Modules", "Admin Login"];

const scrollTo = (sectionId) => {
  const target = document.getElementById(sectionId);

  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const StatItem = ({ icon: Icon, value, label }) => (
  <div className="flex items-center gap-2.5 rounded-[18px] bg-white px-3.5 py-2.5 shadow-[0_12px_24px_rgba(137,167,117,0.06)] ring-1 ring-[#edf3e3]">
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f2ecff] text-[#a896ef]">
      <Icon className="h-4.5 w-4.5" />
    </span>
    <div>
      <p className="font-display text-lg font-bold text-slate-900 sm:text-xl">
        {value}
      </p>
      <p className="text-[11px] text-slate-500 sm:text-xs">{label}</p>
    </div>
  </div>
);

const ImageBox = ({
  title,
  hint,
  bgClass,
  image,
  wide = false,
  className = "",
}) => (
  <div
    className={`group relative overflow-hidden rounded-[34px] ${bgClass} shadow-[0_22px_50px_rgba(137,167,117,0.12)] ${className} ${
      wide ? "min-h-[108px]" : "min-h-[150px]"
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
          alt={title || hint || "Library gallery"}
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
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">
            Ready for your image
          </p>
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
          ? "translate-y-[-4px] shadow-[0_28px_70px_rgba(174,155,243,0.18)] ring-[#ddd1ff]"
          : "shadow-[0_16px_38px_rgba(137,167,117,0.08)] ring-[#edf3e3]"
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
        <h3 className="font-display text-2xl font-bold text-slate-900">
          {module.title}
        </h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          {module.description}
        </p>

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
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#8eb46d]">
            Live
          </span>
        </div>
      </div>
    </article>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [galleryShift, setGalleryShift] = useState(0);

  const libraryName = import.meta.env.VITE_LIBRARY_NAME || "Nearest Library";
  const libraryLogo = import.meta.env.VITE_LIBRARY_LOGO_URL || "/parikshaLibrarylogo.jpg";

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (heroGalleryCards.length < 2) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setGalleryShift(
        (currentShift) => (currentShift + 1) % heroGalleryCards.length,
      );
    }, 2600);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen overflow-x-clip bg-[#eef6e7] text-slate-900">
      <div className="relative pt-[72px]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[960px] bg-[linear-gradient(180deg,#eef6e7_0%,#f8fbf4_42%,#ffffff_100%)]" />
        <div className="landing-grid pointer-events-none absolute inset-x-0 top-0 h-[960px] opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="landing-pulse pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-[#dbe9c8] blur-3xl opacity-90" />
        <div className="landing-drift pointer-events-none absolute right-0 top-10 h-96 w-96 rounded-full bg-[#eee7ff] blur-3xl opacity-90" />

        <header className="fixed inset-x-0 top-0 z-50 border-b border-white/60 bg-white/95 backdrop-blur-xl shadow-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => scrollTo("hero")}
              className="flex items-center gap-3 text-left"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f2ecff] shadow-sm overflow-hidden">
                <img src={libraryLogo} alt={libraryName} className="h-full w-full object-cover" />
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
              onClick={() => window.open(`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`, '_blank')}
              className="landing-shiny-outline inline-flex items-center justify-center gap-2 rounded-full border border-[#d9dde3] bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-[#25D366] hover:text-[#25D366]"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
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
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <div className="relative z-10">
                <h1 className="mt-4 max-w-2xl font-display text-[2.7rem] font-bold leading-[0.98] text-slate-900 sm:text-[3.15rem] lg:max-w-[640px] lg:text-[2.95rem]">
                  Manage your library desk smarter
                </h1>

                <p className="mt-3 max-w-xl text-[15px] leading-6 text-slate-600 sm:text-base lg:max-w-[560px]">
                  {libraryName} keeps seats, records, attendance and payment
                  work organized in one calm workspace designed for fast daily
                  operations.
                </p>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => scrollTo("modules")}
                    className="landing-shiny-btn inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#b8a0ff_0%,#92d9f8_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_44px_rgba(167,160,255,0.34)] transition hover:-translate-y-0.5 hover:brightness-105 sm:px-6 sm:text-base"
                  >
                    Join the System
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollTo("modules")}
                    className="landing-shiny-outline inline-flex items-center justify-center gap-2 rounded-full border border-[#dfd7f6] bg-white/95 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-[#c8b8ff] hover:text-[#8d7ad9] sm:px-6 sm:text-base"
                  >
                    Learn more
                    <Sparkles className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-6 grid gap-2.5 sm:grid-cols-3">
                  {heroStats.map((stat) => (
                    <StatItem
                      key={stat.label}
                      icon={stat.icon}
                      value={stat.value}
                      label={stat.label}
                    />
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
                      image={
                        heroGalleryCards[
                          (index + galleryShift) % heroGalleryCards.length
                        ].image
                      }
                      className={`${index < 2 ? "h-[136px] sm:h-[150px] lg:h-[160px]" : "h-[102px] sm:h-[112px] lg:h-[118px]"} ${
                        index % 2 === 0
                          ? "landing-float"
                          : "landing-float-delay"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="modules" className="py-12 sm:py-16 px-4 sm:px-6 relative bg-gradient-to-b from-white to-[#f8fbf4]">
            <div className="max-w-7xl mx-auto">
              
              {/* Section Header */}
              <div className="text-center mb-10 sm:mb-12">
                <p className="text-brand-teal font-semibold text-xs sm:text-sm uppercase tracking-widest mb-2 sm:mb-3">
                  Popular Modules
                </p>
                <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-slate-900 mb-3 sm:mb-4">
                  Everything You Need
                </h2>
                <p className="text-slate-600 text-sm sm:text-lg max-w-2xl mx-auto">
                  Powerful tools designed for modern library management
                </p>
              </div>

              {/* Grid Layout with Images */}
              <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-12">
                
                {/* Left: Image */}
                <div className="relative order-2 lg:order-1">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                    <img 
                      src="/section1.png" 
                      alt="Library Management Dashboard" 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  {/* Floating Badge */}
                  <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl px-4 py-3 border border-slate-200">
                    <p className="text-2xl font-bold text-[#9d8ee8]">100+</p>
                    <p className="text-xs text-slate-600">Seats Managed</p>
                  </div>
                </div>

                {/* Right: Module Cards */}
                <div className="space-y-4 order-1 lg:order-2">
                  {moduleCards.slice(0, 2).map((module) => {
                    const Icon = module.icon;
                    return (
                      <div
                        key={module.title}
                        className="group bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 hover:border-[#9d8ee8] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-12 sm:w-14 h-12 sm:h-14 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
                          >
                            <Icon className="w-6 sm:w-7 h-6 sm:h-7 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 mb-1">
                              {module.title}
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                              {module.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Second Row - Reversed */}
              <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                
                {/* Left: Module Cards */}
                <div className="space-y-4">
                  {moduleCards.slice(2, 4).map((module) => {
                    const Icon = module.icon;
                    return (
                      <div
                        key={module.title}
                        className="group bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 hover:border-[#9d8ee8] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-12 sm:w-14 h-12 sm:h-14 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
                          >
                            <Icon className="w-6 sm:w-7 h-6 sm:h-7 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 mb-1">
                              {module.title}
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                              {module.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right: Image */}
                <div className="relative">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                    <img 
                      src="/section2.png" 
                      alt="Library Attendance System" 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  {/* Floating Badge */}
                  <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl px-4 py-3 border border-slate-200">
                    <p className="text-2xl font-bold text-[#9d8ee8]">99.9%</p>
                    <p className="text-xs text-slate-600">Uptime</p>
                  </div>
                </div>
              </div>

            </div>
          </section>

          <section
            id="cta"
            className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8"
          >
            <div className="relative overflow-hidden rounded-[28px] sm:rounded-[38px] bg-gradient-to-br from-[#b8a0ff] via-[#a896ef] to-[#92d9f8] px-6 py-10 sm:px-12 sm:py-16 shadow-[0_30px_80px_rgba(137,167,117,0.22)]">
              
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10" 
                style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              
              {/* Floating Elements */}
              <div className="absolute top-4 right-4 w-20 h-20 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute bottom-4 left-4 w-24 h-24 sm:w-40 sm:h-40 bg-white/10 rounded-full blur-2xl" />

              <div className="relative z-10 text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4 sm:mb-6">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="text-xs sm:text-sm font-semibold text-white">All-in-One Solution</span>
                </div>

                <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                  Everything Your Library Needs in One Place
                </h2>

                <p className="text-white/90 text-sm sm:text-lg mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto">
                  Streamline your operations with our comprehensive platform. Manage members, seats, attendance, and payments effortlessly.
                </p>

                {/* Feature Pills */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                  {[
                    { icon: Users, text: 'Members' },
                    { icon: LayoutGrid, text: 'Seats' },
                    { icon: CalendarClock, text: 'Attendance' },
                    { icon: CreditCard, text: 'Payments' }
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                      <Icon className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-white" />
                      <span className="text-xs sm:text-sm font-medium text-white">{text}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => scrollTo("modules")}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#9d8ee8] rounded-full font-bold text-sm sm:text-base shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
                  >
                    Access Admin Panel
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => scrollTo("modules")}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold text-sm sm:text-base border-2 border-white/30 hover:bg-white/20 transition-all"
                  >
                    View Features
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>

                {/* Trust Indicators */}
                <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-white/80">
                  {[
                    { icon: ShieldCheck, text: 'Secure & Reliable' },
                    { icon: MapPin, text: 'Local Support' },
                    { icon: CheckCircle2, text: 'Easy Setup' }
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span className="text-xs sm:text-sm font-medium">{text}</span>
                    </div>
                  ))}
                </div>

                {/* WhatsApp Contact */}
                <div className="mt-6 sm:mt-8">
                  <button
                    type="button"
                    onClick={() => window.open(`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`, '_blank')}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-full font-semibold text-sm hover:bg-[#20BA5A] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Chat on WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="relative z-10 bg-white border-t border-slate-200">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#f2ecff] shadow-[0_16px_32px_rgba(174,155,243,0.16)] overflow-hidden">
                  <img src={libraryLogo} alt={libraryName} className="h-full w-full object-cover" />
                </span>
                <div>
                  <p className="font-display text-2xl font-bold text-[#9d8ee8]">
                    {libraryName}
                  </p>
                  <p className="text-sm text-slate-500">
                    Library admin interface for seats, users, bookings and
                    attendance.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-500">
                {footerLinks.map((link) => (
                  <span key={link} className="transition hover:text-[#9d8ee8] cursor-pointer">
                    {link}
                  </span>
                ))}
              </div>
            </div>

            {/* Developer Credit */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-500">
                &copy; {new Date().getFullYear()} {libraryName}. All rights reserved.
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span>Made with ❤️ by</span>
                <a 
                  href="https://www.linkedin.com/in/shivam-kumar108/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-semibold text-[#9d8ee8] hover:text-[#8d7ad9] transition-colors inline-flex items-center gap-1"
                >
                  Shivam Kumar
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <span className="text-slate-400">• Software Engineer</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
