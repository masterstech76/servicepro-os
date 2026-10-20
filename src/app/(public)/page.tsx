/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Image from "next/image";
import {
  AirVent,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  ShieldCheck,
  Snowflake,
  Star,
  Wrench,
  X,
  Zap,
} from "lucide-react";

const services = [
  {
    number: "01",
    icon: AirVent,
    title: "Installation climatisation",
    description:
      "Pose soignée de climatiseurs split, multi-split et gainables adaptés à votre espace et à votre budget.",
    tag: "Installation",
  },
  {
    number: "02",
    icon: Snowflake,
    title: "Entretien & nettoyage",
    description:
      "Nettoyage complet des filtres, désinfection antibactérienne et contrôle du fluide frigorigène pour un air sain.",
    tag: "Entretien",
  },
  {
    number: "03",
    icon: Wrench,
    title: "Dépannage rapide",
    description:
      "Diagnostic précis, recherche de fuites et réparation express de vos équipements en panne 7j/7.",
    tag: "Réparation 7j/7",
  },
  {
    number: "04",
    icon: Zap,
    title: "Chambres froides +/-",
    description:
      "Installation, maintenance et dépannage de chambres froides positives et négatives pour professionnels.",
    tag: "Froid commercial",
  },
  {
    number: "05",
    icon: ShieldCheck,
    title: "Matériel aéraulique",
    description:
      "Solutions de ventilation, caissons d&apos;extraction, CTA et VMC professionnelle pour locaux et commerces.",
    tag: "Ventilation",
  },
  {
    number: "06",
    icon: Clock3,
    title: "Diagnostic technique & devis",
    description:
      "Analyse complète de vos installations existantes avec conseils d&apos;optimisation énergétique.",
    tag: "Devis gratuit",
  },
];

const projects = [
  {
    title: "Installation split résidentiel",
    category: "Maison individuelle • Saint-Gilles",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "Rénovation climatisation intégrale",
    category: "Appartement • Saint-Denis",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "Climatisation espace tertiaire",
    category: "Commerce & Bureaux • Saint-Pierre",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85",
  },
];

const reviews = [
  {
    name: "M. Hoarau",
    location: "Saint-Pierre (974)",
    date: "Il y a 2 semaines",
    text: "Depuis plusieurs années, un service rapide et efficace, une prestation de qualité et une équipe toujours aussi sympathique. Clim Tech OI a toute ma confiance !",
  },
  {
    name: "Sébastien D.",
    location: "Saint-Leu (974)",
    date: "Il y a 1 mois",
    text: "Intervention en urgence suite à une panne totale en pleine chaleur. Diagnostiqué et réparé en moins de 2 heures. Travail très propre et prix transparent.",
  },
  {
    name: "Valérie G.",
    location: "L'Étang-Salé (974)",
    date: "Il y a 2 mois",
    text: "Pose de 2 climatiseurs réversibles. Conseils avisés pour le choix des appareils, pose impeccable et sans dégâts. Je recommande les yeux fermés.",
  },
];

const faqs = [
  {
    q: "Intervenez-vous rapidement à La Réunion ?",
    a: "Oui, nous intervenons rapidement sur toute l&apos;île de La Réunion, en particulier dans le sud et l'ouest (Saint-Pierre, Saint-Leu, Saint-Paul, Le Tampon, etc.). En cas d&apos;urgence, nous faisons notre maximum pour intervenir sous 24h à 48h.",
  },
  {
    q: "Quels types de climatiseurs installez-vous ?",
    a: "Nous installons tous types de systèmes : monosplit, multisplit, cassettes encastrées et systèmes gainables parmi les plus grandes marques (Daikin, Mitsubishi, Toshiba, Gree, Panasonic).",
  },
  {
    q: "Pourquoi faire entretenir sa clim régulièrement ?",
    a: "Un entretien régulier élimine les moisissures et bactéries dans l&apos;air, réduit votre consommation électrique de 15% à 25% et prolonge la durée de vie du compresseur.",
  },
  {
    q: "Vos devis sont-ils gratuits ?",
    a: "Oui, nous établissons un devis clair, gratuit et sans engagement pour tous vos projets d&apos;installation ou de remplacement de climatisation.",
  },
];

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [formSent, setFormSent] = useState(false);

  const phoneDisplay = "+262 262 59 87 03";
  const phoneCall = "+262262598703";
  const whatsappUrl =
    "https://wa.me/262262598703?text=Bonjour%20CLIM%20TECH%20OI%2C%20je%20souhaite%20un%20renseignement%20climatisation.";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "");
    const phone = String(form.get("phone") || "");
    const city = String(form.get("city") || "");
    const service = String(form.get("service") || "");
    const message = String(form.get("message") || "");

    const text = [
      "Bonjour CLIM TECH OI,",
      "",
      `Nom : ${name}`,
      `Téléphone : ${phone}`,
      `Commune : ${city}`,
      `Besoin : ${service}`,
      `Message : ${message}`,
    ].join("\n");

    window.open(
      `https://wa.me/262262598703?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );

    setFormSent(true);
  }

  return (
    <div className="min-h-screen bg-[#07121C] text-slate-100 font-sans selection:bg-[#28CAF2] selection:text-[#091926]">
      {/* 1. EXACT NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#1E293B] border-b border-white/5 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[68px] flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#accueil"
            className="flex items-center gap-1.5 font-bold tracking-tight text-xl sm:text-2xl select-none"
            aria-label="CLIM TECH OI Accueil"
          >
            <span className="text-[#28CAF2]">CLIM TECH</span>
            <span className="text-[#28CAF2] text-xl">❄</span>
            <span className="text-[#FF3908]">OI</span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm" aria-label="Navigation">
            <a
              href="#accueil"
              className="text-[#FF3908] font-semibold transition-colors relative py-1"
            >
              Accueil
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF3908] rounded-full" />
            </a>
            <a
              href="#services"
              className="text-slate-300 hover:text-white font-medium transition-colors"
            >
              Services
            </a>
            <a
              href="#realisations"
              className="text-slate-300 hover:text-white font-medium transition-colors"
            >
              Galerie
            </a>
            <a
              href="#contact"
              className="text-slate-300 hover:text-white font-medium transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Right Action Pill */}
          <div className="hidden lg:flex items-center gap-5">
            <div className="flex items-center rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur-md shadow-sm">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white hover:text-[#28CAF2] transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#28CAF2]" />
                <span>WhatsApp</span>
              </a>
              <div className="w-[1px] h-4 bg-white/15" />
              <a
                href={`tel:${phoneCall}`}
                className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white hover:text-[#28CAF2] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-white/80" />
                <span>{phoneDisplay}</span>
              </a>
            </div>

            <a
              href="#contact"
              className="text-[#28CAF2] hover:text-white font-semibold text-xs sm:text-sm transition-colors flex items-center gap-1"
            >
              Nous écrire <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white p-2 rounded-lg bg-white/5 hover:bg-white/10"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileOpen && (
          <div className="md:hidden bg-[#1E293B] border-b border-white/10 px-4 py-5 space-y-3">
            <a
              href="#accueil"
              onClick={() => setMobileOpen(false)}
              className="block text-[#FF3908] font-semibold text-base py-1"
            >
              Accueil
            </a>
            <a
              href="#services"
              onClick={() => setMobileOpen(false)}
              className="block text-slate-300 hover:text-white text-base py-1"
            >
              Services
            </a>
            <a
              href="#realisations"
              onClick={() => setMobileOpen(false)}
              className="block text-slate-300 hover:text-white text-base py-1"
            >
              Galerie
            </a>
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="block text-slate-300 hover:text-white text-base py-1"
            >
              Contact
            </a>
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-[#28CAF2] text-[#091926] font-bold py-2.5 rounded-full text-sm"
              >
                <MessageCircle className="w-4 h-4" /> Discuter sur WhatsApp
              </a>
              <a
                href={`tel:${phoneCall}`}
                className="flex items-center justify-center gap-2 border border-white/20 text-white font-semibold py-2.5 rounded-full text-sm"
              >
                <Phone className="w-4 h-4" /> Appeler le {phoneDisplay}
              </a>
            </div>
          </div>
        )}
      </header>

      {/* 2. EXACT HERO SECTION MATCHING SCREENSHOT */}
      <section
        id="accueil"
        className="relative min-h-[580px] lg:min-h-[640px] bg-[#091926] overflow-hidden flex items-center border-b-[3px] border-[#28CAF2]"
      >
        {/* Full Bleed Right Image (Technician + Split AC Unit) */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-no-repeat bg-[center_right]"
          style={{
            backgroundImage: `url('/images/climtech-hero-hd.png')`,
          }}
        />

        {/* Seamless Navy Fade on Left Side to Guarantee Contrast on Text */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#091926] via-[#091926]/95 to-transparent lg:w-[62%]" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#091926] via-transparent to-transparent h-16 bottom-0" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 w-full">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-3.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#28CAF2] shadow-[0_0_8px_#28CAF2]" />
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] text-[#28CAF2]">
                POSE DE CLIM, RÉPARATION ET MAINTENANCE SUR TOUTE L’ÎLE — INTERVENTION RAPIDE 7J/7
              </p>
            </div>

            {/* Alternating White & Cyan Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold leading-[1.12] tracking-tight mb-4">
              <span className="text-white block">
                Climatisation à <span className="text-[#28CAF2]">La Réunion :</span>
              </span>
              <span className="text-white block">
                installation, <span className="text-[#28CAF2]">entretien &amp;</span>
              </span>
              <span className="text-white block">
                dépannage <span className="text-[#28CAF2]">rapide</span>
              </span>
            </h1>

            {/* Description */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
              Besoin d&apos;installer ou réparer une climatisation ? Nous intervenons rapidement à La Réunion pour la pose, l&apos;entretien et le dépannage de vos équipements.
            </p>

            {/* 3 Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#28CAF2] hover:bg-[#38d4fc] text-[#091926] font-bold text-xs sm:text-sm transition-all shadow-lg shadow-[#28CAF2]/25"
              >
                Nous contacter
              </a>
              <a
                href="#services"
                className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/10 font-semibold text-xs sm:text-sm transition-all backdrop-blur-sm"
              >
                Installation climatisation
              </a>
              <a
                href="#services"
                className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/10 font-semibold text-xs sm:text-sm transition-all backdrop-blur-sm"
              >
                Dépannage climatisation
              </a>
            </div>

            {/* Feature Badges Row */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.05] text-xs text-slate-200 backdrop-blur-sm">
                <Snowflake className="w-3.5 h-3.5 text-[#28CAF2]" />
                <span>Climatisation 974</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.05] text-xs text-slate-200 backdrop-blur-sm">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Dépannage rapide</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.05] text-xs text-slate-200 backdrop-blur-sm">
                <MapPin className="w-3.5 h-3.5 text-[#28CAF2]" />
                <span>Toute La Réunion</span>
              </div>
            </div>

            {/* Google Review Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/[0.05] backdrop-blur-md">
              <div className="flex items-center font-bold text-xs tracking-tight">
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#EA4335]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#4285F4]">g</span>
                <span className="text-[#34A853]">l</span>
                <span className="text-[#EA4335]">e</span>
              </div>
              <div className="flex text-amber-400 text-xs tracking-widest">
                ★★★★★
              </div>
              <span className="text-white font-bold text-xs">4.8/5</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRUST STRIP */}
      <section className="bg-[#0b1724] border-b border-white/5 py-5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-white/[0.02]">
            <ShieldCheck className="w-5 h-5 text-[#28CAF2]" />
            <div className="text-left">
              <p className="text-xs font-bold text-white">Garantie 3 ans</p>
              <p className="text-[11px] text-slate-400">Équipements éligibles</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-white/[0.02]">
            <Clock3 className="w-5 h-5 text-[#28CAF2]" />
            <div className="text-left">
              <p className="text-xs font-bold text-white">Intervention rapide</p>
              <p className="text-[11px] text-slate-400">7j/7 sur toute l&apos;île</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-white/[0.02]">
            <CheckCircle2 className="w-5 h-5 text-[#28CAF2]" />
            <div className="text-left">
              <p className="text-xs font-bold text-white">Certifié &amp; Conforme</p>
              <p className="text-[11px] text-slate-400">Attestation fluides</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-white/[0.02]">
            <MapPin className="w-5 h-5 text-[#28CAF2]" />
            <div className="text-left">
              <p className="text-xs font-bold text-white">La Réunion (974)</p>
              <p className="text-[11px] text-slate-400">Particuliers &amp; Pros</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SERVICES SECTION */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-[#28CAF2] mb-2">
            Nos Expertises Climatisation &amp; Froid
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            La bonne température. <span className="text-[#28CAF2]">Le bon service.</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            Des prestations fiables et garanties pour assurer votre confort thermique au quotidien.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.number}
                className="group relative p-7 rounded-2xl bg-[#0b1724] border border-white/5 hover:border-[#28CAF2]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#28CAF2]/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-[#28CAF2]/10 border border-[#28CAF2]/20 flex items-center justify-center text-[#28CAF2] group-hover:bg-[#28CAF2] group-hover:text-[#091926] transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-slate-500 group-hover:text-[#28CAF2] transition-colors">
                      {svc.number}
                    </span>
                  </div>
                  <span className="inline-block text-[11px] font-semibold text-[#28CAF2] bg-[#28CAF2]/10 px-2.5 py-1 rounded-full mb-3">
                    {svc.tag}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#28CAF2] transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {svc.description}
                  </p>
                </div>

                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#28CAF2] hover:text-white transition-colors pt-4 border-t border-white/5"
                >
                  <span>Demander un renseignement</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. ABOUT US / EXPERTISE */}
      <section className="py-16 bg-[#0b1724] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src="/images/climtech-method.webp"
                alt="Techniciens Clim Tech OI sur chantier de climatisation à La Réunion"
                className="w-full h-[360px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#091926]/90 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#28CAF2] uppercase tracking-wider">
                    Équipe qualifiée 974
                  </p>
                  <p className="text-white font-bold text-sm">
                    Intervention sur tout le sud &amp; ouest
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#28CAF2] flex items-center justify-center text-[#091926]">
                  <Snowflake className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <p className="text-xs font-bold uppercase tracking-widest text-[#28CAF2]">
              Qui Sommes-Nous ?
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Le confort thermique commence par <span className="text-[#28CAF2]">un travail bien fait.</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Basée à La Réunion, la société <strong>CLIM TECH OI</strong> met son savoir-faire au service des particuliers et des entreprises pour tous travaux de pose, d&apos;entretien et de dépannage de climatisation et froid commercial.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-sm text-slate-200">
                <Check className="w-4 h-4 text-[#28CAF2] shrink-0" />
                <span>Devis rapide et transparent</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-200">
                <Check className="w-4 h-4 text-[#28CAF2] shrink-0" />
                <span>Attestation de capacité fluides</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-200">
                <Check className="w-4 h-4 text-[#28CAF2] shrink-0" />
                <span>Conseils dimensionnement précis</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-200">
                <Check className="w-4 h-4 text-[#28CAF2] shrink-0" />
                <span>Suivi et maintenance après pose</span>
              </div>
            </div>
            <div className="pt-4 flex flex-wrap gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#28CAF2] text-[#091926] font-bold text-sm hover:bg-[#38d4fc] transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> Échanger sur WhatsApp
              </a>
              <a
                href={`tel:${phoneCall}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white font-semibold text-sm hover:bg-white/5 transition-colors"
              >
                <Phone className="w-4 h-4" /> {phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. GALERIE RÉALISATIONS */}
      <section id="realisations" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#28CAF2] mb-2">
              Galerie Photos
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Nos dernières <span className="text-[#28CAF2]">réalisations</span>
            </h2>
          </div>
          <a
            href="#contact"
            className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-semibold text-[#28CAF2] hover:text-white"
          >
            <span>Confier votre projet</span> <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((proj, idx) => (
            <div
              key={idx}
              className="group rounded-2xl overflow-hidden bg-[#0b1724] border border-white/5 hover:border-[#28CAF2]/30 transition-all duration-300"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1724] via-transparent to-transparent" />
              </div>
              <div className="p-5">
                <p className="text-[11px] font-semibold text-[#28CAF2] uppercase tracking-wider mb-1">
                  {proj.category}
                </p>
                <h3 className="text-base font-bold text-white group-hover:text-[#28CAF2] transition-colors">
                  {proj.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. AVIS CLIENTS */}
      <section className="py-20 bg-[#0b1724] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 mb-4">
              <span className="text-amber-400 font-bold text-xs">★★★★★</span>
              <span className="text-white font-bold text-xs">4.8 / 5 Avis vérifiés</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Ils nous font confiance <span className="text-[#28CAF2]">pour leur climatisation</span>
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              Découvrez les retours de nos clients particuliers et professionnels à La Réunion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#07121C] border border-white/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex text-amber-400 text-xs mb-3">★★★★★</div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">
                    &ldquo;{rev.text}&rdquo;
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-white font-bold text-sm">{rev.name}</p>
                    <p className="text-xs text-slate-400">{rev.location}</p>
                  </div>
                  <span className="text-[11px] text-[#28CAF2] font-semibold">
                    Avis vérifié
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#28CAF2] mb-2">
            Questions Fréquentes
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Tout savoir sur nos services à <span className="text-[#28CAF2]">La Réunion</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-white/10 bg-[#0b1724] overflow-hidden transition-colors"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4"
              >
                <span className="font-semibold text-white text-sm sm:text-base">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#28CAF2] transition-transform ${
                    activeFaq === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-slate-300 text-sm leading-relaxed border-t border-white/5">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 9. CONTACT / DEVIS FORM */}
      <section id="contact" className="py-20 bg-[#091926] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[#28CAF2]">
              Contact Direct
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Parlons de votre projet <span className="text-[#28CAF2]">en direct.</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Remplissez le formulaire ci-contre pour nous transmettre votre demande. Vous serez automatiquement redirigé vers WhatsApp avec votre message pré-rempli pour une réponse ultra rapide !
            </p>

            <div className="space-y-4 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.04] border border-white/10 hover:border-[#28CAF2]/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-[#28CAF2]/10 flex items-center justify-center text-[#28CAF2]">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">WhatsApp Réunion</p>
                  <p className="text-sm font-bold text-white">{phoneDisplay}</p>
                </div>
              </a>

              <a
                href={`tel:${phoneCall}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.04] border border-white/10 hover:border-[#28CAF2]/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-[#28CAF2]/10 flex items-center justify-center text-[#28CAF2]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Téléphone Direct</p>
                  <p className="text-sm font-bold text-white">{phoneDisplay}</p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="w-10 h-10 rounded-full bg-[#28CAF2]/10 flex items-center justify-center text-[#28CAF2]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Secteur d&apos;intervention</p>
                  <p className="text-sm font-bold text-white">Toute La Réunion (974)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0b1724] border border-white/10 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-2">
                Demande de devis &amp; renseignement
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mb-6">
                Réponse sous 24h ouvrées — Devis gratuit et sans engagement
              </p>

              {formSent && (
                <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Votre demande a été envoyée ! Nous vous répondrons très rapidement.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Nom complet *
                    </label>
                    <input
                      name="name"
                      required
                      placeholder="Ex: Jean Payet"
                      className="w-full bg-[#07121C] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#28CAF2]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Numéro de téléphone *
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      required
                      placeholder="0692 XX XX XX"
                      className="w-full bg-[#07121C] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#28CAF2]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Commune / Secteur
                    </label>
                    <input
                      name="city"
                      placeholder="Ex: Saint-Pierre, Saint-Leu..."
                      className="w-full bg-[#07121C] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#28CAF2]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Type de prestation
                    </label>
                    <select
                      name="service"
                      className="w-full bg-[#07121C] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#28CAF2]"
                    >
                      <option value="Installation">Installation de climatiseur</option>
                      <option value="Dépannage">Dépannage d&apos;urgence</option>
                      <option value="Entretien">Entretien &amp; Nettoyage</option>
                      <option value="Chambre froide">Chambres froides &amp; Froid commercial</option>
                      <option value="Autre">Autre renseignement</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Votre message / Description du besoin
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Précisez votre demande (nombre de pièces, marque, panne constatée...)"
                    className="w-full bg-[#07121C] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#28CAF2] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-full bg-[#28CAF2] hover:bg-[#38d4fc] text-[#091926] font-bold text-sm transition-all shadow-lg shadow-[#28CAF2]/25 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" /> Envoyer ma demande via WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="bg-[#050D14] border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-xl">
            <span className="text-[#28CAF2]">CLIM TECH</span>
            <span className="text-[#28CAF2] text-xl">❄</span>
            <span className="text-[#FF3908]">OI</span>
          </div>

          <p className="text-slate-400 text-xs">
            © {new Date().getFullYear()} CLIM TECH OI. Spécialiste Climatisation &amp; Froid à La Réunion (974). Tous droits réservés.
          </p>

          <a
            href="#accueil"
            className="text-xs text-[#28CAF2] hover:text-white transition-colors"
          >
            Retour en haut ↑
          </a>
        </div>
      </footer>
    </div>
  );
}
