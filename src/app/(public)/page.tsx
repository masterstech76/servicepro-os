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
} from "lucide-react";
import { businessConfig } from "@config/business.config";
import { formatMoneyCents } from "@/lib/domain/format";
import { Button } from "@/components/ui/button";
import { PhoneLink } from "@/components/shared/PhoneLink";

const HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1920&auto=format&fit=crop&q=80";

const CTA_BAND_IMAGE_URL =
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&auto=format&fit=crop&q=80";

const SERVICE_IMAGES: string[] = [
  "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1558002038-1055907df827?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=900&auto=format&fit=crop&q=80",
];

function getServiceIcon(category: string, id: string) {
  const lower = `${category} ${id}`.toLowerCase();
  if (lower.includes("thermostat") || lower.includes("control") || lower.includes("elec")) {
    return Zap;
  }
  if (lower.includes("duct") || lower.includes("air") || lower.includes("clean")) {
    return Sparkles;
  }
  if (lower.includes("recharge") || lower.includes("refrigerant")) {
    return Gauge;
  }
  if (lower.includes("cool") || lower.includes("hvac") || lower.includes("ac")) {
    return Snowflake;
  }
  return Wrench;
}

export default function LandingPage() {
  const cleanPhoneHref = `tel:${businessConfig.phone.replace(/\D/g, "")}`;

  const whyChooseUs = [
    {
      icon: ShieldCheck,
      title: "Licensed & Insured Pros",
      description: `State license #${businessConfig.licenseNumber}. Every technician is background-checked, drug-tested, and factory-trained.`,
      badge: "100% Vetted",
    },
    {
      icon: Clock,
      title: "60-Minute Arrival Windows",
      description: `Live GPS dispatch across Greater ${businessConfig.city} with automated SMS tracking before your technician arrives.`,
      badge: "On-Time Guarantee",
    },
    {
      icon: Star,
      title: "Upfront Flat-Rate Pricing",
      description:
        "Approve the exact diagnostic or repair price before any work starts. Zero hidden fees or surprise overtime charges.",
      badge: "No Hidden Fees",
    },
    {
      icon: Wrench,
      title: "Fully Stocked Service Trucks",
      description:
        "Our trucks carry commercial-grade OEM parts and diagnostic tools so 93% of repairs are completed on the very first visit.",
      badge: "First-Visit Fix",
    },
  ];

  const testimonials = [
    {
      name: "Carlos & Elena M.",
      neighborhood: `${businessConfig.city}, ${businessConfig.state}`,
      service: businessConfig.services[0]?.name ?? "AC Repair & Diagnostic",
      quote:
        "Our AC stopped blowing cold air at 2 PM. Booked online in under a minute, got a text when the tech was 15 minutes out, and our house was cooling again before dinner.",
    },
    {
      name: "David R.",
      neighborhood: `${businessConfig.city}, ${businessConfig.state}`,
      service: businessConfig.services[2]?.name ?? "Smart Thermostat Install",
      quote:
        "Transparent pricing right on the website. The deposit went straight toward our invoice and the technician walked us through the new smart schedule step by step.",
    },
    {
      name: "amanda K.",
      neighborhood: `${businessConfig.city}, ${businessConfig.state}`,
      service: businessConfig.services[1]?.name ?? "Seasonal Tune-Up",
      quote:
        "Best field service experience we have had. Photo documentation before and after the service, spotless shoe covers indoors, and instant digital receipt.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-navy-900 selection:bg-orange-500 selection:text-navy-900">
      {/* Sticky Glass Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-3 font-heading font-bold text-lg sm:text-xl text-navy-900 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-orange-500 rounded-xl"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-orange-500 shadow-md">
              <Snowflake className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="leading-tight tracking-tight">{businessConfig.businessName}</span>
              <span className="text-[11px] font-sans font-semibold text-navy-700">
                {businessConfig.city}, {businessConfig.state} • Lic #{businessConfig.licenseNumber}
              </span>
            </div>
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-7 text-sm font-semibold text-navy-700"
          >
            <a href="#services" className="hover:text-navy-900 transition-colors">
              Services & Pricing
            </a>
            <a href="#why-us" className="hover:text-navy-900 transition-colors">
              Why Choose Us
            </a>
            <a href="#how-it-works" className="hover:text-navy-900 transition-colors">
              How It Works
            </a>
            <a href="#reviews" className="hover:text-navy-900 transition-colors">
              Reviews
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <PhoneLink phone={businessConfig.phone} label="Call" />
            <Button
              asChild
              size="sm"
              className="hidden sm:inline-flex rounded-full px-5 font-bold shadow-md hover:shadow-lg transition-all"
            >
              <Link href="/book">
                <span>Book Now</span>
                <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section with Full-Width Unsplash Image & Navy Gradient Overlay */}
        <section className="relative overflow-hidden bg-navy-900 text-white pt-14 pb-24 sm:pt-24 sm:pb-32 px-4 sm:px-6">
          <Image
            src={HERO_IMAGE_URL}
            alt={`${businessConfig.businessName} certified technician servicing HVAC equipment in ${businessConfig.city}`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-navy-900/90 via-navy-900/75 to-navy-900/95"
          />

          <div className="relative z-10 mx-auto max-w-4xl text-center animate-fade-up">
            {/* Floating Trust Pill */}
            <div className="inline-flex items-center gap-2 rounded-full bg-navy-800/90 border border-white/15 backdrop-blur-md px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-xl mb-7 animate-float">
              <ShieldCheck className="h-4 w-4 text-orange-500 shrink-0" aria-hidden="true" />
              <span>
                Licensed & Insured • #{businessConfig.licenseNumber} • Serving Greater{" "}
                {businessConfig.city}
              </span>
            </div>

            <h1 className="font-heading text-[34px] leading-[1.12] sm:text-[48px] lg:text-[56px] font-extrabold tracking-tight text-white mb-5">
              {businessConfig.seo.heroHeadline}
            </h1>

            <p className="mx-auto max-w-2xl text-base sm:text-lg lg:text-xl text-slate-200 leading-relaxed mb-9">
              {businessConfig.seo.heroSubheadline}
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto min-w-[270px] rounded-full text-base font-bold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
              >
                <Link href="/book" data-testid="hero-book-cta">
                  <span>Book online in 60 seconds</span>
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>

              <a
                href={cleanPhoneHref}
                className="inline-flex h-14 w-full sm:w-auto items-center justify-center gap-2.5 rounded-full border border-white/25 bg-navy-800/80 backdrop-blur-md px-7 text-base font-semibold text-white shadow-lg hover:bg-navy-800 transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-orange-500"
              >
                <Phone className="h-5 w-5 text-orange-500" aria-hidden="true" />
                <span>Call {businessConfig.phone}</span>
              </a>
            </div>

            {/* Trust Row with Avatars */}
            <div className="mt-10 pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-7 text-xs sm:text-sm text-slate-200 font-medium">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2" aria-hidden="true">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-navy-900 bg-orange-500 text-xs font-bold text-navy-900">
                    CM
                  </span>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-navy-900 bg-slate-100 text-xs font-bold text-navy-900">
                    DR
                  </span>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-navy-900 bg-orange-50 text-xs font-bold text-navy-900">
                    AK
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center text-orange-500" aria-hidden="true">
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                  <span className="font-bold text-white">4.9</span>
                  <span>(500+ reviews)</span>
                </div>
              </div>

              <span className="hidden sm:inline text-white/30" aria-hidden="true">
                •
              </span>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500 shrink-0" aria-hidden="true" />
                <span>60-min response</span>
              </div>

              <span className="hidden sm:inline text-white/30" aria-hidden="true">
                •
              </span>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-orange-500 shrink-0" aria-hidden="true" />
                <span>Satisfaction guaranteed</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section
          aria-label="Company statistics"
          className="relative z-20 -mt-12 px-4 sm:px-6"
        >
          <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200/80 bg-white/95 backdrop-blur-md p-6 sm:p-8 shadow-xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/70">
              <div className="flex flex-col items-center text-center pt-2 sm:pt-0">
                <span className="font-heading text-2xl sm:text-3xl font-extrabold text-navy-900">
                  15+ Years
                </span>
                <span className="text-xs sm:text-sm font-medium text-navy-700 mt-1">
                  Serving Greater {businessConfig.city}
                </span>
              </div>

              <div className="flex flex-col items-center text-center pt-2 sm:pt-0 sm:pl-6">
                <span className="font-heading text-2xl sm:text-3xl font-extrabold text-navy-900">
                  12k+
                </span>
                <span className="text-xs sm:text-sm font-medium text-navy-700 mt-1">
                  Jobs Completed Safely
                </span>
              </div>

              <div className="flex flex-col items-center text-center pt-4 lg:pt-0 sm:pl-6">
                <div className="flex items-center gap-1.5">
                  <span className="font-heading text-2xl sm:text-3xl font-extrabold text-navy-900">
                    4.9
                  </span>
                  <Star className="h-5 w-5 text-orange-700 fill-current" aria-hidden="true" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-navy-700 mt-1">
                  Verified Customer Rating
                </span>
              </div>

              <div className="flex flex-col items-center text-center pt-4 lg:pt-0 sm:pl-6">
                <span className="font-heading text-2xl sm:text-3xl font-extrabold text-navy-900">
                  24/7
                </span>
                <span className="text-xs sm:text-sm font-medium text-navy-700 mt-1">
                  Emergency Dispatch Support
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section id="services" className="py-16 sm:py-24 px-4 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-500/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-orange-700 mb-3">
                <CalendarCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Transparent Online Booking
              </span>
              <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
                Upfront Pricing on Every Service
              </h2>
              <p className="text-sm sm:text-base text-navy-700 mt-2.5">
                Select a service below to view real-time technician arrival windows in{" "}
                {businessConfig.city} and lock in your appointment online.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businessConfig.services.map((service, index) => {
                const Icon = getServiceIcon(service.category, service.id);
                const imageUrl = SERVICE_IMAGES[index % SERVICE_IMAGES.length];
                const formattedPrice = formatMoneyCents(service.price, { omitZeroCents: true });
                const priceBadgeText =
                  service.pricing === "hourly"
                    ? `From ${formattedPrice}/hr`
                    : `From ${formattedPrice}`;

                return (
                  <Link
                    key={service.id}
                    href={`/book?serviceId=${encodeURIComponent(service.id)}`}
                    className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-orange-500 overflow-hidden focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-orange-500"
                  >
                    <div>
                      {/* Card Image Header */}
                      <div className="relative h-44 w-full overflow-hidden bg-navy-900">
                        <Image
                          src={imageUrl}
                          alt={`${service.name} by ${businessConfig.businessName}`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/35 to-navy-900/20"
                        />

                        {/* Top-Right Price Badge */}
                        <div className="absolute top-3.5 right-3.5 rounded-full bg-navy-900/90 backdrop-blur-md border border-white/15 px-3.5 py-1.5 text-xs font-extrabold tabular-nums text-white shadow-md">
                          {priceBadgeText}
                        </div>

                        {/* Bottom-Left Icon Square */}
                        <div className="absolute bottom-3.5 left-4 flex items-center gap-2.5">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-navy-900 shadow-lg">
                            <Icon className="h-5 w-5" aria-hidden="true" />
                          </div>
                          <span className="rounded-full bg-navy-900/80 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold text-slate-100">
                            {service.category}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-6">
                        <h3 className="font-heading text-lg font-bold text-navy-900 group-hover:text-orange-700 transition-colors">
                          {service.name}
                        </h3>
                        <p className="text-sm text-navy-700 mt-2 leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-navy-700">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-orange-700" aria-hidden="true" />
                        <span>
                          ~{service.durationMinutes} min
                          {service.pricing === "hourly" &&
                            ` • ${Math.round((service.minBillableMinutes ?? 60) / 60)} hr min`}
                        </span>
                      </div>
                      <span className="inline-flex items-center font-bold text-sm text-orange-700 group-hover:translate-x-0.5 transition-transform">
                        <span>Book</span>
                        <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Choose Us (4 Cards) */}
        <section
          id="why-us"
          className="bg-white border-y border-slate-200/80 py-16 sm:py-24 px-4 sm:px-6"
        >
          <div className="mx-auto max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-500/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-orange-700 mb-3">
                <Award className="h-3.5 w-3.5" aria-hidden="true" />
                The {businessConfig.businessName} Standard
              </span>
              <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
                Why Homeowners in {businessConfig.city} Choose Us
              </h2>
              <p className="text-sm sm:text-base text-navy-700 mt-2.5">
                Built for speed, transparency, and white-glove workmanship on every service call.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyChooseUs.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:bg-white"
                  >
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-orange-500 shadow-md">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <span className="rounded-full bg-orange-50 border border-orange-500/30 px-2.5 py-1 text-[11px] font-bold text-orange-700">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="font-heading text-lg font-bold text-navy-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-navy-700 leading-relaxed">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works (3 Numbered Orange Steps) */}
        <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6 bg-slate-50">
          <div className="mx-auto max-w-5xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-500/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-orange-700 mb-3">
                Simple 3-Step Dispatch
              </span>
              <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
                How Online Booking Works
              </h2>
              <p className="text-sm sm:text-base text-navy-700 mt-2.5">
                No phone tag or 4-hour waiting windows. Lock in your certified technician in 60 seconds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-navy-900 font-heading font-extrabold text-lg shadow-md mb-5">
                  1
                </div>
                <h3 className="font-heading text-lg font-bold text-navy-900 mb-2">
                  Pick Your Arrival Window
                </h3>
                <p className="text-sm text-navy-700 leading-relaxed">
                  Enter your {businessConfig.city} ZIP code to see real-time technician availability and choose a morning or afternoon slot.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-navy-900 font-heading font-extrabold text-lg shadow-md mb-5">
                  2
                </div>
                <h3 className="font-heading text-lg font-bold text-navy-900 mb-2">
                  Reserve With a {businessConfig.booking.depositPct}% Deposit
                </h3>
                <p className="text-sm text-navy-700 leading-relaxed">
                  Your deposit holds your slot for {businessConfig.booking.holdMinutes} minutes during checkout and is 100% credited toward your final invoice.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-navy-900 font-heading font-extrabold text-lg shadow-md mb-5">
                  3
                </div>
                <h3 className="font-heading text-lg font-bold text-navy-900 mb-2">
                  Live SMS ETA & Digital Receipt
                </h3>
                <p className="text-sm text-navy-700 leading-relaxed">
                  We text you the moment your technician is en route, document the repair with photos, and send an itemized digital invoice.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="reviews"
          className="bg-white border-t border-slate-200/80 py-16 sm:py-24 px-4 sm:px-6"
        >
          <div className="mx-auto max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-500/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-orange-700 mb-3">
                <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                Verified Local Reviews
              </span>
              <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
                Trusted by Neighbors Across {businessConfig.city}
              </h2>
              <p className="text-sm sm:text-base text-navy-700 mt-2.5">
                Real feedback from homeowners who booked {businessConfig.businessName} online.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((review) => (
                <div
                  key={review.name}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-slate-50/60 p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:bg-white"
                >
                  <div>
                    <div
                      role="img"
                      aria-label="5 out of 5 stars"
                      className="flex items-center gap-1 text-orange-700 mb-4"
                    >
                      <Star className="h-4 w-4 fill-current" aria-hidden="true" />
                      <Star className="h-4 w-4 fill-current" aria-hidden="true" />
                      <Star className="h-4 w-4 fill-current" aria-hidden="true" />
                      <Star className="h-4 w-4 fill-current" aria-hidden="true" />
                      <Star className="h-4 w-4 fill-current" aria-hidden="true" />
                    </div>
                    <p className="text-sm sm:text-base text-navy-900 leading-relaxed">
                      &ldquo;{review.quote}&rdquo;
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between">
                    <div>
                      <div className="font-heading font-bold text-sm text-navy-900">
                        {review.name}
                      </div>
                      <div className="text-xs text-navy-700">{review.neighborhood}</div>
                    </div>
                    <span className="rounded-full bg-orange-50 border border-orange-500/30 px-3 py-1 text-xs font-semibold text-orange-700">
                      {review.service}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Emergency CTA Band */}
        <section className="relative overflow-hidden bg-navy-900 text-white py-16 sm:py-24 px-4 sm:px-6">
          <Image
            src={CTA_BAND_IMAGE_URL}
            alt={`Emergency dispatch team at ${businessConfig.businessName}`}
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-navy-900/90 via-navy-900/80 to-navy-900/95"
          />

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-navy-900 mb-5 shadow-lg">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              Same-Day & Emergency Dispatch
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
              Need emergency service? Call now or book your arrival window online.
            </h2>
            <p className="mx-auto max-w-2xl text-sm sm:text-lg text-slate-200 mb-8">
              Licensed {businessConfig.city} technicians are on standby with fully stocked trucks.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <a
                href={cleanPhoneHref}
                className="inline-flex h-14 w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-orange-500 px-8 text-base font-bold text-navy-900 shadow-xl hover:bg-orange-600 transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-white"
              >
                <Phone className="h-5 w-5" aria-hidden="true" />
                <span>Call {businessConfig.phone}</span>
              </a>
              <Link
                href="/book"
                className="inline-flex h-14 w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/25 bg-navy-800/85 backdrop-blur-md px-8 text-base font-semibold text-white hover:bg-navy-800 transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-orange-500"
              >
                <span>Schedule Online</span>
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-navy-800 bg-navy-900 text-slate-200 py-14 px-4 sm:px-6 text-sm">
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2.5 font-heading font-bold text-white text-lg mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-navy-900">
                <Snowflake className="h-5 w-5" aria-hidden="true" />
              </div>
              <span>{businessConfig.businessName}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">{businessConfig.seo.description}</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-navy-800 px-3.5 py-1.5 text-xs font-semibold text-slate-200">
              <ShieldCheck className="h-4 w-4 text-orange-500" aria-hidden="true" />
              <span>State License #{businessConfig.licenseNumber}</span>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-bold text-white text-base mb-3">
              Dispatch Center & Hours
            </h3>
            <div className="space-y-2 text-slate-300">
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-orange-500 shrink-0 mt-1" aria-hidden="true" />
                <span>{businessConfig.address}</span>
              </p>
              <p className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-orange-500 shrink-0 mt-1" aria-hidden="true" />
                <span>
                  Mon–Fri 7:00 AM – 7:00 PM
                  <br />
                  Sat 8:00 AM – 4:00 PM • Sun Closed
                </span>
              </p>
              <p className="pt-1">
                <a
                  href={cleanPhoneHref}
                  className="inline-flex items-center gap-2 font-bold text-white hover:text-orange-500 transition-colors"
                >
                  <Phone className="h-4 w-4 text-orange-500" aria-hidden="true" />
                  <span>{businessConfig.phone}</span>
                </a>
              </p>
            </div>
          </div>

          <div className="flex flex-col md:items-end justify-between">
            <div className="space-y-2 md:text-right">
              <h3 className="font-heading font-bold text-white text-base mb-3">Quick Links</h3>
              <div className="flex flex-col gap-2 text-sm text-slate-300">
                <Link href="/book" className="hover:text-white underline-offset-4 hover:underline">
                  Book Service Online
                </Link>
                <Link href="/demo" className="hover:text-white underline-offset-4 hover:underline">
                  Interactive Platform Demo (/demo)
                </Link>
                <Link href="/login" className="hover:text-white underline-offset-4 hover:underline">
                  Staff & Technician Login (/login)
                </Link>
              </div>
            </div>

            <p className="text-xs text-slate-300 mt-6">
              © {new Date().getFullYear()} {businessConfig.businessName}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
