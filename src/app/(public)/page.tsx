import Image from "next/image";
import Link from "next/link";
import {
  Snowflake,
  Wrench,
  Zap,
  Sparkles,
  ShieldCheck,
  Clock,
  Star,
  ArrowRight,
  Phone,
  CheckCircle2,
  MapPin,
  Award,
  CalendarCheck,
  Gauge,
  Check,
  Flame,
  ThumbsUp,
  Headphones,
  Mail,
  Shield,
  Building2,
  ChevronRight,
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { formatMoneyCents } from "@/lib/domain/format";
import { Button } from "@/components/ui/button";

const HERO_IMAGE_URL = "/images/hero.jpg";
const CTA_BAND_IMAGE_URL = "/images/service-bg.jpg";

const SERVICE_IMAGES: Record<string, string> = {
  "svc-ac-repair": "/images/svc-ac-repair.jpg",
  "svc-ac-tuneup": "/images/svc-ac-tuneup.jpg",
  "svc-thermostat-install": "/images/svc-thermostat-install.jpg",
  "svc-duct-cleaning": "/images/svc-duct-cleaning.jpg",
  "svc-refrigerant-recharge": "/images/svc-refrigerant-recharge.jpg",
};

function getServiceIcon(category: string, id: string) {
  const lower = `${category} ${id}`.toLowerCase();
  if (lower.includes("thermostat") || lower.includes("control") || lower.includes("elec")) return Zap;
  if (lower.includes("duct") || lower.includes("air") || lower.includes("clean")) return Sparkles;
  if (lower.includes("recharge") || lower.includes("refrigerant")) return Gauge;
  if (lower.includes("cool") || lower.includes("hvac") || lower.includes("ac")) return Snowflake;
  return Wrench;
}

export default function LandingPage() {
  const cleanPhoneHref = `tel:${businessConfig.phone.replace(/\D/g, "")}`;

  // Trust Statistics Counters
  const stats = [
    { value: "60 Min", label: "Guaranteed Arrival Window", sub: "Live GPS Tracking" },
    { value: "4.9 ★", label: "Average Rating", sub: "500+ Verified Reviews" },
    { value: "12,000+", label: "Completed Repairs", sub: "Across South Florida" },
    { value: "$0", label: "Hidden Dispatch Fees", sub: "100% Upfront Pricing" },
  ];

  // Brand Certifications & Industry Badges
  const certifications = [
    { name: "NATE Certified", tag: "Excellence in HVAC" },
    { name: "EPA 608 Universal", tag: "Licensed Refrigerant" },
    { name: "BBB A+ Accredited", tag: "Highest Trust Score" },
    { name: `State Lic #${businessConfig.licenseNumber}`, tag: "Fully Bonded & Insured" },
    { name: "Authorized Dealer", tag: "Carrier • Trane • Lennox" },
  ];

  // 6 Glassmorphism Feature Cards
  const features = [
    {
      icon: Clock,
      title: "60-Minute Arrival",
      desc: "Guaranteed on-time arrival windows with live GPS technician tracking direct to your phone.",
      glow: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: ShieldCheck,
      title: "Licensed & Insured",
      desc: `State mechanical contractor license #${businessConfig.licenseNumber} with $2M liability coverage for complete peace of mind.`,
      glow: "from-cyan-500/20 to-blue-500/20",
    },
    {
      icon: Sparkles,
      title: "Upfront Pricing",
      desc: "Transparent flat rates before any work starts. No hidden travel fees, surprise surcharges, or pressure sales.",
      glow: "from-blue-600/20 to-indigo-500/20",
    },
    {
      icon: Award,
      title: "1-Year Labor Warranty",
      desc: "All replacement parts and repair work are backed by our 100% money-back satisfaction guarantee.",
      glow: "from-cyan-400/20 to-teal-500/20",
    },
    {
      icon: Zap,
      title: "Stocked Mobile Warehouses",
      desc: "Our vans carry 95% of OEM replacement parts (capacitors, contactors, motors, fan blades) for 1-trip fixes.",
      glow: "from-blue-500/20 to-cyan-400/20",
    },
    {
      icon: Headphones,
      title: "24/7 Priority Dispatch",
      desc: "Live dispatch team ready round-the-clock for emergency breakdowns and summer heat waves.",
      glow: "from-indigo-500/20 to-blue-500/20",
    },
  ];

  // 3-Step Process Timeline
  const steps = [
    {
      number: "01",
      stepBadge: "Step 1",
      title: "Book",
      subtitle: "Instant Online Scheduling",
      desc: "Select your service, choose a guaranteed 60-minute arrival slot, and lock in your appointment in under 60 seconds.",
    },
    {
      number: "02",
      stepBadge: "Step 2",
      title: "Technician Arrives",
      subtitle: "Live GPS & Photo ETA",
      desc: "Get an automated SMS with your technician's photo, vehicle details, and live GPS map when they are on their way.",
    },
    {
      number: "03",
      stepBadge: "Step 3",
      title: "Repair Completed",
      subtitle: "Transparent Digital Checkout",
      desc: "Technician diagnoses the issue, explains solutions upfront, completes the repair, and sends digital invoice & photos.",
    },
  ];

  // Verified Customer Reviews
  const testimonials = [
    {
      name: "Carlos & Elena M.",
      neighborhood: "Downtown Miami",
      service: "AC Repair & Diagnostic",
      quote:
        "Our AC failed on a 92° afternoon. Booked online in 45 seconds, tech arrived in 40 minutes with the exact capacitor replacement. Ice cold air within an hour!",
      stars: 5,
    },
    {
      name: "David R.",
      neighborhood: "Brickell",
      service: "Smart Thermostat Install",
      quote:
        "Transparent upfront pricing. The $20 deposit credited straight to our final invoice, and the tech configured the app on both our phones before leaving.",
      stars: 5,
    },
    {
      name: "Amanda K.",
      neighborhood: "Coral Gables",
      service: "Seasonal Tune-Up",
      quote:
        "Hands down the cleanest, most professional service company I've hired. Shoe covers indoors, before-and-after coil photos, and an instant receipt.",
      stars: 5,
    },
  ];

  // Coverage preview zip codes
  const previewZips = businessConfig.zipCodes.slice(0, 14);

  return (
    <div className="min-h-screen flex flex-col bg-white text-navy-900 font-sans selection:bg-blue-600 selection:text-white pb-20 sm:pb-0">
      <main className="flex-1">
        {/* ========================================================
            HERO SECTION: Full-Screen Split Layout with Floating Cards
            ======================================================== */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50 pt-8 pb-16 sm:pt-14 sm:pb-24 lg:pt-20 lg:pb-32 px-4 sm:px-6">
          {/* Subtle Ambient Grid Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
          >
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-tr from-blue-500/10 via-cyan-400/10 to-transparent blur-3xl" />
          </div>

          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* LEFT COLUMN: High-Converting Headline & CTAs */}
              <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
                {/* Trust Pill */}
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/70 px-4 py-1.5 text-xs font-bold text-blue-700 shadow-sm backdrop-blur-sm">
                  <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                  <span>Available Today in {businessConfig.city} • 60-Min Arrival</span>
                </div>

                {/* Primary Hero Heading */}
                <h1 className="font-heading text-4xl sm:text-5xl lg:text-[58px] font-extrabold tracking-tight text-navy-900 leading-[1.08]">
                  AC Repair Within <span className="text-blue-600">60 Minutes</span>
                </h1>

                {/* Supporting Copy */}
                <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Expert HVAC technicians available same day with upfront pricing. 
                  Book online in 60 seconds or call our 24/7 priority dispatch desk.
                </p>

                {/* Primary CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-1">
                  <Button
                    asChild
                    size="lg"
                    className="w-full sm:w-auto min-w-[210px] rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all h-14"
                  >
                    <Link href="/book" data-testid="hero-book-cta">
                      <span>Book Service</span>
                      <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                    </Link>
                  </Button>

                  <a
                    href={cleanPhoneHref}
                    className="inline-flex h-14 w-full sm:w-auto min-w-[190px] items-center justify-center gap-2.5 rounded-2xl border-2 border-slate-200 bg-white px-7 text-base font-bold text-navy-900 shadow-sm hover:border-blue-500 hover:bg-blue-50/50 hover:text-blue-700 transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-blue-500"
                  >
                    <Phone className="h-5 w-5 text-blue-600" aria-hidden="true" />
                    <span>Call Now</span>
                  </a>
                </div>

                {/* Trust Badges Bar */}
                <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-5 sm:gap-8 text-xs sm:text-sm font-semibold text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-navy-900">4.9 / 5.0</span>
                    <span className="text-slate-400">(500+ Reviews)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="font-bold text-navy-900">12k+</span>
                    <span>Jobs Completed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    <span>100% Guaranteed</span>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Photorealistic Hero with Floating Glassmorphic Metric Badges */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Decorative Glow Ring */}
                  <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-tr from-blue-600/30 to-cyan-400/30 blur-2xl -z-10 opacity-70" />

                  {/* Main Technician Image Container */}
                  <div className="relative h-[380px] sm:h-[460px] lg:h-[500px] w-full rounded-[28px] overflow-hidden border border-slate-200/80 shadow-2xl bg-navy-900">
                    <Image
                      src={HERO_IMAGE_URL}
                      alt="TechWork certified HVAC technician repairing AC"
                      fill
                      priority
                      quality={85}
                      sizes="(max-width: 1024px) 100vw, 550px"
                      className="object-cover object-center"
                    />
                    {/* Contrast Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-transparent" />
                  </div>

                  {/* Floating Metric Card 1: 4.9 Rating */}
                  <div className="absolute -top-4 -left-4 sm:-left-6 rounded-2xl border border-white/80 bg-white/95 p-3.5 sm:p-4 shadow-xl backdrop-blur-md flex items-center gap-3 animate-float">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                      <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
                    </div>
                    <div>
                      <div className="font-heading text-lg font-extrabold text-navy-900 leading-tight">4.9 ★★★★★</div>
                      <div className="text-xs font-semibold text-slate-500">Top Rated Service</div>
                    </div>
                  </div>

                  {/* Floating Metric Card 2: 12k+ Jobs */}
                  <div className="absolute -bottom-5 -right-4 sm:-right-6 rounded-2xl border border-white/80 bg-white/95 p-3.5 sm:p-4 shadow-xl backdrop-blur-md flex items-center gap-3 animate-float [animation-delay:1.5s]">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-heading text-lg font-extrabold text-navy-900 leading-tight">12,000+</div>
                      <div className="text-xs font-semibold text-slate-500">Jobs Done</div>
                    </div>
                  </div>

                  {/* Floating Metric Card 3: 15+ Years */}
                  <div className="absolute bottom-16 -left-4 sm:-left-6 rounded-2xl border border-white/80 bg-white/95 px-4 py-2.5 shadow-xl backdrop-blur-md hidden sm:flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
                      <Award className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-navy-900 block leading-tight">15+ Years</span>
                      <span className="text-[10px] text-slate-500 font-medium">Experience</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            TRUST SECTION: Statistics Counters & Certifications
            ======================================================== */}
        <section className="bg-navy-900 text-white py-14 border-y border-slate-800 px-4 sm:px-6">
          <div className="mx-auto max-w-7xl">
            {/* Statistics Counters Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-800 text-center">
              {stats.map((s, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                    <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-200 bg-clip-text text-transparent">
                      {s.value}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-200">{s.label}</div>
                  <div className="text-xs text-slate-400">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Industry Certifications & Brand Authority */}
            <div className="pt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-center">
              {certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2 backdrop-blur-sm"
                >
                  <ShieldCheck className="h-4 w-4 text-cyan-400" />
                  <div className="text-left">
                    <div className="text-xs font-bold text-white">{cert.name}</div>
                    <div className="text-[10px] text-slate-400">{cert.tag}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            FEATURES SECTION: 6 Premium Glass Cards
            ======================================================== */}
        <section id="why-us" className="py-20 sm:py-28 bg-slate-50/60 border-b border-slate-200/80 px-4 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                The TechWork Advantage
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
                Built for Speed, Trust, and Reliability
              </h2>
              <p className="text-base text-slate-600 mt-3">
                Experience field service designed around your time with modern transparent technology.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={idx}
                    className="group relative rounded-[20px] border border-slate-200/80 bg-white/90 p-8 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-blue-500/50"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/20 mb-5 group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-navy-900 mb-2.5">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================
            SERVICES & PRICING SECTION: 3-Column Layout
            ======================================================== */}
        <section id="services" className="py-20 sm:py-28 bg-white px-4 sm:px-6">
          {/* Also anchor pricing here */}
          <div id="pricing" className="scroll-mt-24" />
          <div className="mx-auto max-w-7xl">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 mb-3">
                <CalendarCheck className="h-3.5 w-3.5" />
                Upfront Pricing
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
                Transparent Pricing on Every Service
              </h2>
              <p className="text-base text-slate-600 mt-3">
                Pick your service and book an arrival window with a 20% deposit credited to your invoice.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {businessConfig.services.map((service) => {
                const Icon = getServiceIcon(service.category, service.id);
                const imageUrl = SERVICE_IMAGES[service.id] ?? HERO_IMAGE_URL;
                const priceBadge =
                  service.pricing === "hourly"
                    ? `From ${formatMoneyCents(service.price, { omitZeroCents: true })}/hr`
                    : `From ${formatMoneyCents(service.price, { omitZeroCents: true })}`;

                return (
                  <div
                    key={service.id}
                    className="group rounded-[20px] border border-slate-200/80 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-500/60 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Service Photo with Badges */}
                      <div className="relative h-56 w-full overflow-hidden bg-navy-900">
                        <Image
                          src={imageUrl}
                          alt={service.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent" />

                        {/* Price Badge */}
                        <div className="absolute top-3.5 right-3.5 rounded-full bg-navy-900/90 border border-white/20 px-3.5 py-1 text-xs font-extrabold text-white backdrop-blur-md">
                          {priceBadge}
                        </div>

                        {/* Category & Icon */}
                        <div className="absolute bottom-3.5 left-4 flex items-center gap-2">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="text-xs font-bold text-white bg-navy-900/70 px-2.5 py-1 rounded-full backdrop-blur-sm">
                            {service.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-2.5">
                        <h3 className="font-heading text-xl font-bold text-navy-900 group-hover:text-blue-600 transition-colors">
                          {service.name}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span>~{service.durationMinutes} min</span>
                      </div>
                      <Link
                        href={`/book?serviceId=${service.id}`}
                        className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 group-hover:translate-x-1 transition-all"
                      >
                        <span>Book Service</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================
            PROCESS SECTION: Horizontal Timeline
            ======================================================== */}
        <section id="how-it-works" className="py-20 sm:py-28 bg-slate-50/70 border-y border-slate-200/80 px-4 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 mb-3">
                <Check className="h-3.5 w-3.5" />
                Simple 3-Step Process
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
                How Online Booking Works
              </h2>
              <p className="text-base text-slate-600 mt-3">
                No phone tag or 4-hour waiting windows. Lock in your arrival slot in under a minute.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {steps.map((st, i) => (
                <div
                  key={i}
                  className="rounded-[20px] border border-slate-200/80 bg-white p-8 shadow-sm relative space-y-4 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-3xl font-extrabold text-blue-600">
                      {st.number}
                    </span>
                    <span className="flex h-8 px-3 items-center justify-center rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                      {st.stepBadge}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-navy-900">
                      {st.title}
                    </h3>
                    <div className="text-xs font-semibold text-blue-600 mt-0.5">
                      {st.subtitle}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                asChild
                size="lg"
                className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base px-8 shadow-lg shadow-blue-500/20 h-13"
              >
                <Link href="/book">
                  <span>Schedule Service in 60 Seconds →</span>
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ========================================================
            TESTIMONIALS SECTION: Customer Reviews
            ======================================================== */}
        <section id="reviews" className="py-20 sm:py-28 bg-white px-4 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-700 mb-3">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                Verified Reviews
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
                Trusted by Homeowners Across Miami
              </h2>
              <p className="text-base text-slate-600 mt-3">
                Read what real neighbors say after booking with TechWork online.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((rev, idx) => (
                <div
                  key={idx}
                  className="rounded-[20px] border border-slate-200/80 bg-slate-50/50 p-7 shadow-sm flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(rev.stars)].map((_, s) => (
                        <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed italic">
                      &ldquo;{rev.quote}&rdquo;
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
                    <div>
                      <div className="font-heading font-bold text-sm text-navy-900">
                        {rev.name}
                      </div>
                      <div className="text-xs text-slate-500">{rev.neighborhood}</div>
                    </div>
                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                      {rev.service}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            CONTACT SECTION: Interactive Booking Launcher, Map & Service Area
            ======================================================== */}
        <section id="contact" className="py-20 sm:py-28 bg-slate-50/70 border-t border-slate-200/80 px-4 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 mb-3">
                <MapPin className="h-3.5 w-3.5" />
                Service Area & Contact
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
                Rapid Coverage Across Greater {businessConfig.city}
              </h2>
              <p className="text-base text-slate-600 mt-3">
                Fully stocked mobile dispatch vans stationed throughout Miami-Dade County for 60-minute emergency arrival.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Interactive Booking Launcher Card */}
              <div className="lg:col-span-6 rounded-[24px] border border-slate-200/90 bg-white p-7 sm:p-9 shadow-lg">
                <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
                    <CalendarCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-navy-900">
                      Check Live Availability
                    </h3>
                    <p className="text-xs text-slate-500">
                      Instant appointment confirmation in 60 seconds
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                      Select Required Service
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {businessConfig.services.slice(0, 4).map((s) => (
                        <Link
                          key={s.id}
                          href={`/book?serviceId=${s.id}`}
                          className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 text-left transition-all group"
                        >
                          <span className="text-xs font-bold text-navy-900 group-hover:text-blue-700">
                            {s.name}
                          </span>
                          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      asChild
                      size="lg"
                      className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base h-13 shadow-md"
                    >
                      <Link href="/book">
                        <span>Launch Online Booking Wizard</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>

                  <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                    <div className="flex items-start gap-2.5">
                      <Phone className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-bold text-navy-900">Direct Dispatch</div>
                        <a href={cleanPhoneHref} className="text-blue-600 hover:underline">
                          {businessConfig.phone}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Mail className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-bold text-navy-900">Email Support</div>
                        <a href={`mailto:${businessConfig.email}`} className="text-blue-600 hover:underline">
                          {businessConfig.email}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <MapPin className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-bold text-navy-900">Headquarters</div>
                        <div>{businessConfig.address}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Building2 className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-bold text-navy-900">License</div>
                        <div>Florida #{businessConfig.licenseNumber}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map & Service Area Coverage Card */}
              <div className="lg:col-span-6 rounded-[24px] border border-slate-200/90 bg-white p-7 sm:p-9 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-bold text-sm text-navy-900">Dispatch Radar Active</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">60-Min Zone</span>
                  </div>

                  {/* Stylized Modern Vector Map Preview Card */}
                  <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 p-4 flex flex-col justify-between text-white">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-md border border-cyan-800/60">
                        ZONE: {businessConfig.city.toUpperCase()}-METRO
                      </span>
                      <span className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-cyan-400" />
                        Avg ETA: 38 Mins
                      </span>
                    </div>

                    <div className="relative z-10 text-center py-3">
                      <div className="inline-flex items-center gap-2 bg-navy-900/90 border border-cyan-400/40 px-4 py-2 rounded-xl backdrop-blur-md shadow-lg">
                        <MapPin className="h-4 w-4 text-cyan-400 animate-bounce" />
                        <span className="text-xs font-bold text-white">
                          Central Dispatch: Brickell & Downtown Miami
                        </span>
                      </div>
                    </div>

                    <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Coverage Radius: 25 Miles</span>
                      <span className="text-emerald-400 font-semibold">● 8 Technicians Available Today</span>
                    </div>
                  </div>

                  {/* Postal Zip Code Coverage Pills */}
                  <div className="mt-6">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5 flex items-center justify-between">
                      <span>Covered Postal Codes ({businessConfig.zipCodes.length} Locations)</span>
                      <span className="text-[11px] text-blue-600 font-bold">100% Guaranteed</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {previewZips.map((zip) => (
                        <span
                          key={zip}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-xs font-mono font-semibold text-slate-700 border border-slate-200 transition-colors"
                        >
                          {zip}
                        </span>
                      ))}
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-xs font-bold text-blue-700 border border-blue-200">
                        +{businessConfig.zipCodes.length - previewZips.length} more
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    Outside our primary area? We service extended zones upon request.
                  </span>
                  <a
                    href={cleanPhoneHref}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 shrink-0"
                  >
                    <span>Inquire</span>
                    <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            BOTTOM HIGH-CONVERTING CTA BAND
            ======================================================== */}
        <section className="relative overflow-hidden bg-navy-900 text-white py-20 sm:py-28 px-4 sm:px-6">
          <div className="absolute inset-0 -z-10">
            <Image
              src={CTA_BAND_IMAGE_URL}
              alt="TechWork service trucks"
              fill
              quality={75}
              sizes="100vw"
              className="object-cover object-center opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/90 to-navy-900/80" />
          </div>

          <div className="mx-auto max-w-4xl text-center space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-600/30 border border-blue-400/30 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-300">
              <Clock className="h-3.5 w-3.5" />
              Emergency & Same-Day Service
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Ready for Ice-Cold Air Today?
            </h2>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Book your guaranteed 60-minute arrival window online right now. 
              Certified technicians ready with fully stocked trucks.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto min-w-[240px] rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-xl h-14"
              >
                <Link href="/book">
                  <span>Book Online Now</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <a
                href={cleanPhoneHref}
                className="inline-flex h-14 w-full sm:w-auto min-w-[200px] items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md px-7 text-base font-bold text-white hover:bg-white hover:text-navy-900 transition-all"
              >
                <Phone className="h-5 w-5 text-cyan-400" />
                <span>Call {businessConfig.phone}</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================
          STICKY MOBILE BOOKING BAR
          ======================================================== */}
      <aside
        aria-label="Mobile quick booking"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 p-3 sm:hidden shadow-2xl flex items-center justify-between gap-3"
      >
        <a
          href={cleanPhoneHref}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-3 text-xs font-bold text-navy-900 shadow-sm"
        >
          <Phone className="h-4 w-4 text-blue-600" />
          <span>Call Desk</span>
        </a>
        <Button
          asChild
          size="md"
          className="flex-[2] rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md h-11"
        >
          <Link href="/book">
            <span>Book Online Now</span>
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </Button>
      </aside>
    </div>
  );
}
