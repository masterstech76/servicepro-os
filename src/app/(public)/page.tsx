"use client";

import { useState } from "react";
import {
  AirVent,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Facebook,
  Instagram,
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
      "Installation de climatiseurs adaptés à votre espace, avec une pose soignée et des conseils personnalisés.",
    tag: "Installation",
  },
  {
    number: "02",
    icon: Snowflake,
    title: "Entretien & nettoyage",
    description:
      "Nettoyage des filtres, entretien des unités et vérification du fonctionnement pour un air plus sain.",
    tag: "Entretien",
  },
  {
    number: "03",
    icon: Wrench,
    title: "Dépannage rapide",
    description:
      "Diagnostic des pannes, recherche de solutions et réparation de vos équipements de climatisation.",
    tag: "Réparation",
  },
  {
    number: "04",
    icon: Zap,
    title: "Diagnostic technique",
    description:
      "Une analyse précise de votre installation pour identifier les problèmes et vous orienter vers la bonne solution.",
    tag: "Expertise",
  },
];

const projects = [
  {
    title: "Installation résidentielle",
    category: "Maison individuelle",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "Confort intérieur",
    category: "Appartement",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "Espace professionnel",
    category: "Local commercial",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85",
  },
];

const reviews = [
  {
    name: "Client particulier",
    location: "La Réunion",
    text: "Une intervention sérieuse, des explications claires et un travail propre. Je recommande pour l'installation de climatisation.",
  },
  {
    name: "Client résidentiel",
    location: "La Réunion",
    text: "Prise de contact simple et conseils utiles pour choisir une solution adaptée à notre logement.",
  },
  {
    name: "Client professionnel",
    location: "La Réunion",
    text: "Une approche professionnelle et un bon accompagnement pour notre besoin en climatisation.",
  },
];

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [formSent, setFormSent] = useState(false);

  const whatsappUrl =
    "https://wa.me/262262598703?text=Bonjour%2C%20je%20souhaite%20un%20renseignement%20pour%20la%20climatisation.";

  function closeMenu() {
    setMobileOpen(false);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "");
    const phone = String(form.get("phone") || "");
    const service = String(form.get("service") || "");
    const message = String(form.get("message") || "");

    const text = [
      "Bonjour CLIM TECH 01,",
      "",
      `Nom : ${name}`,
      `Téléphone : ${phone}`,
      `Service : ${service}`,
      `Demande : ${message}`,
    ].join("\n");

    window.open(
      `https://wa.me/262262598703?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );

    setFormSent(true);
  }

  return (
    <>
      <main className="site-shell">
        {/* NAVBAR */}
        <header className="navbar">
          <div className="nav-inner">
            <a className="brand" href="#accueil" aria-label="CLIM TECH 01, accueil">
              <span className="brand-line">
                CLIM TECH<span className="brand-snow">❄</span>
                <span className="brand-number">01</span>
              </span>
              <span className="brand-caption">CONFORT • CLIMATISATION • SERVICE</span>
            </a>

            <nav className="desktop-nav" aria-label="Navigation principale">
              <a className="nav-link active" href="#accueil">Accueil</a>
              <a className="nav-link" href="#services">Services</a>
              <a className="nav-link" href="#realisations">Galerie</a>
              <a className="nav-link" href="#contact">Contact</a>
            </nav>

            <div className="nav-actions">
              <a className="nav-contact-pill" href={whatsappUrl} target="_blank" rel="noreferrer">
                <span className="whatsapp-symbol"><MessageCircle size={16} /></span>
                <span>WhatsApp</span>
                <span className="nav-pill-divider" />
                <span className="phone-circle"><Phone size={16} /></span>
                <span className="nav-phone">+262 262 59 87 03</span>
              </a>
              <a className="nav-write" href="#contact">Nous écrire <ArrowUpRight size={15} /></a>
            </div>

            <button
              className="mobile-menu-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X /> : <Menu />}
            </button>
          </div>

          {mobileOpen && (
            <nav className="mobile-nav" aria-label="Navigation mobile">
              <a href="#accueil" onClick={closeMenu}>Accueil</a>
              <a href="#services" onClick={closeMenu}>Services</a>
              <a href="#realisations" onClick={closeMenu}>Galerie</a>
              <a href="#apropos" onClick={closeMenu}>À propos</a>
              <a href="#contact" onClick={closeMenu}>Contact</a>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" onClick={closeMenu}>
                <MessageCircle size={17} /> Contacter sur WhatsApp
              </a>
            </nav>
          )}
        </header>

        {/* HERO */}
        <section className="hero" id="accueil">
          <div className="hero-photo" />
          <div className="hero-shade" />
          <div className="hero-grain" />

          <div className="hero-content page-container">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              POSE DE CLIM, RÉPARATION ET MAINTENANCE SUR TOUTE L’ÎLE
              <span className="eyebrow-live"> • INTERVENTION RAPIDE</span>
            </div>

            <h1>
              Climatisation à La Réunion :
              <span> installation, entretien &</span>
              <span> dépannage rapide</span>
            </h1>

            <p className="hero-description">
              Besoin d’installer ou de réparer une climatisation ? Nous vous
              accompagnons à La Réunion pour la pose, l’entretien et le
              dépannage de vos équipements.
            </p>

            <div className="hero-buttons">
              <a className="btn btn-primary" href="#contact">
                Nous contacter <ArrowUpRight size={17} />
              </a>
              <a className="btn btn-glass" href="#services">
                Installation climatisation
              </a>
              <a className="btn btn-glass" href="#services">
                Dépannage climatisation
              </a>
            </div>

            <div className="hero-tags">
              <span><Snowflake size={14} /> Climatisation 974</span>
              <span><Zap size={14} /> Dépannage rapide</span>
              <span><MapPin size={14} /> Toute La Réunion</span>
            </div>

            <div className="rating-pill">
              <div className="google-wordmark">
                <span className="google-g">G</span><span className="google-o1">o</span><span className="google-o2">o</span><span className="google-g">g</span><span className="google-l">l</span><span className="google-e">e</span>
                <small>AVIS CLIENTS</small>
              </div>
              <div className="rating-stars" aria-label="Cinq étoiles">
                ★★★★★
              </div>
              <span className="rating-score">4.8/5</span>
            </div>

            <div className="hero-bottom-note">
              <span className="hero-bottom-line" />
              UN CONFORT DURABLE, TOUTE L’ANNÉE
            </div>
          </div>

          <div className="hero-image-label">
            <span className="hero-image-label-icon"><Snowflake size={18} /></span>
            <span>
              <strong>Votre confort, notre priorité</strong>
              <small>Solutions de climatisation</small>
            </span>
          </div>

          <a className="scroll-indicator" href="#services" aria-label="Découvrir les services">
            <span>SCROLL POUR DÉCOUVRIR</span>
            <ArrowDownRight size={18} />
          </a>
        </section>

        {/* TRUST STRIP */}
        <section className="trust-strip" aria-label="Nos engagements">
          <div className="trust-inner page-container">
            <div className="trust-item">
              <span className="trust-icon"><ShieldCheck size={22} /></span>
              <span><strong>Service professionnel</strong><small>Une approche soignée</small></span>
            </div>
            <div className="trust-item">
              <span className="trust-icon"><Clock3 size={22} /></span>
              <span><strong>Réactivité</strong><small>Une prise de contact simple</small></span>
            </div>
            <div className="trust-item">
              <span className="trust-icon"><MapPin size={22} /></span>
              <span><strong>La Réunion (974)</strong><small>Selon votre secteur</small></span>
            </div>
            <div className="trust-item">
              <span className="trust-icon"><CheckCircle2 size={22} /></span>
              <span><strong>Conseils personnalisés</strong><small>Une solution adaptée</small></span>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="section services-section" id="services">
          <div className="page-container">
            <div className="section-heading">
              <div>
                <div className="section-eyebrow"><span /> NOS EXPERTISES</div>
                <h2>La bonne température.<br /><span>Le bon service.</span></h2>
              </div>
              <div className="section-heading-right">
                <p>
                  Des solutions pour installer, entretenir et dépanner vos
                  équipements de climatisation, avec un accompagnement adapté
                  à vos besoins.
                </p>
                <a className="text-link" href="#contact">Parlons de votre projet <ArrowRight size={17} /></a>
              </div>
            </div>

            <div className="services-grid">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <article className="service-card" key={service.number}>
                    <div className="service-card-top">
                      <span className="service-icon"><Icon size={25} strokeWidth={1.7} /></span>
                      <span className="service-number">{service.number}</span>
                    </div>
                    <span className="service-tag">{service.tag}</span>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <a href="#contact" className="service-link" aria-label={`Demander un devis : ${service.title}`}>
                      <span>Demander un renseignement</span>
                      <span className="service-arrow"><ArrowUpRight size={17} /></span>
                    </a>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="about-section" id="apropos">
          <div className="about-layout page-container">
            <div className="about-visual">
              <div className="about-main-image" />
              <div className="about-image-overlay" />
              <div className="about-photo-caption">
                <span className="caption-icon"><Snowflake size={21} /></span>
                <span><strong>CLIM TECH 01</strong><small>Votre confort au quotidien</small></span>
              </div>
              <div className="about-floating-card">
                <span className="floating-card-icon"><Check size={19} /></span>
                <span><strong>Un accompagnement clair</strong><small>Du premier contact à l’intervention</small></span>
              </div>
            </div>

            <div className="about-content">
              <div className="section-eyebrow"><span /> QUI SOMMES-NOUS ?</div>
              <h2>Le confort commence<br />par <span>un travail bien fait.</span></h2>
              <p className="about-lead">
                Une climatisation adaptée change votre quotidien. Notre priorité :
                vous aider à trouver la solution qui correspond à votre espace,
                à votre usage et à vos attentes.
              </p>
              <p className="about-copy">
                De l’installation à l’entretien, en passant par le dépannage,
                CLIM TECH 01 met l’accent sur l’écoute, la clarté des échanges
                et la qualité de l’intervention.
              </p>

              <div className="about-checks">
                <div><CheckCircle2 size={18} /><span>Conseils selon votre installation</span></div>
                <div><CheckCircle2 size={18} /><span>Explications claires et transparentes</span></div>
                <div><CheckCircle2 size={18} /><span>Solutions pour particuliers et professionnels</span></div>
              </div>

              <a href="#contact" className="btn btn-dark">
                Échanger sur votre projet <ArrowUpRight size={17} />
              </a>
              <p className="about-small-note">Disponibilité et délais confirmés lors de la prise de contact.</p>
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className="section process-section">
          <div className="page-container">
            <div className="center-heading">
              <div className="section-eyebrow"><span /> COMMENT ÇA MARCHE ?</div>
              <h2>Simple, clair, <span>efficace.</span></h2>
              <p>De votre demande à la solution, chaque étape est pensée pour vous simplifier la vie.</p>
            </div>

            <div className="process-grid">
              <div className="process-step">
                <span className="process-number">01</span>
                <span className="process-icon"><MessageCircle size={24} /></span>
                <h3>Vous nous contactez</h3>
                <p>Décrivez votre besoin par téléphone ou via WhatsApp.</p>
              </div>
              <div className="process-connector"><ArrowRight size={20} /></div>
              <div className="process-step">
                <span className="process-number">02</span>
                <span className="process-icon"><Wrench size={24} /></span>
                <h3>Nous étudions votre besoin</h3>
                <p>Nous échangeons sur votre équipement, votre situation et les prochaines étapes.</p>
              </div>
              <div className="process-connector"><ArrowRight size={20} /></div>
              <div className="process-step">
                <span className="process-number">03</span>
                <span className="process-icon"><CheckCircle2 size={24} /></span>
                <h3>Place à la solution</h3>
                <p>Les modalités et la disponibilité sont confirmées avant l’intervention.</p>
              </div>
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section className="section gallery-section" id="realisations">
          <div className="page-container">
            <div className="section-heading">
              <div>
                <div className="section-eyebrow"><span /> NOS RÉALISATIONS</div>
                <h2>Le confort se voit<br /><span>dans les détails.</span></h2>
              </div>
              <div className="section-heading-right">
                <p>
                  Découvrez des inspirations d’espaces où le confort,
                  la fonctionnalité et l’intégration de la climatisation
                  comptent autant que la performance.
                </p>
                <a className="text-link" href="#contact">Votre projet ensuite ? <ArrowRight size={17} /></a>
              </div>
            </div>

            <div className="gallery-grid">
              {projects.map((project, index) => (
                <article className={`gallery-card gallery-card-${index + 1}`} key={project.title}>
                  <div className="gallery-image" style={{ backgroundImage: `url("${project.image}")` }} />
                  <div className="gallery-image-shade" />
                  <span className="gallery-index">0{index + 1} / 03</span>
                  <div className="gallery-card-content">
                    <span>{project.category}</span>
                    <h3>{project.title}</h3>
                    <a href="#contact" aria-label={`Parler d'un projet : ${project.title}`}><ArrowUpRight size={19} /></a>
                  </div>
                </article>
              ))}
            </div>
            <p className="gallery-disclaimer">
              Visuels d’illustration. Remplacez-les par les photos réelles des interventions de CLIM TECH 01.
            </p>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="cta-section">
          <div className="cta-glow" />
          <div className="page-container cta-inner">
            <div className="cta-icon"><Snowflake size={29} /></div>
            <div className="cta-copy">
              <div className="section-eyebrow"><span /> UN PROJET DE CLIMATISATION ?</div>
              <h2>Parlons de votre<br /><span>confort intérieur.</span></h2>
              <p>Installation, entretien ou dépannage : expliquez-nous votre besoin.</p>
            </div>
            <div className="cta-actions">
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
                <MessageCircle size={18} /> Écrire sur WhatsApp
              </a>
              <a href="tel:+262262598703" className="btn btn-outline-light">
                <Phone size={17} /> +262 262 59 87 03
              </a>
              <small>Nous vous répondrons pour convenir des prochaines étapes.</small>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section className="section reviews-section">
          <div className="page-container">
            <div className="center-heading">
              <div className="section-eyebrow"><span /> LA RELATION AVANT TOUT</div>
              <h2>Votre confiance, <span>notre priorité.</span></h2>
              <p>La qualité du service commence par une écoute attentive et une communication transparente.</p>
            </div>

            <div className="reviews-grid">
              {reviews.map((review, index) => (
                <article className="review-card" key={review.name}>
                  <div className="review-top">
                    <div className="review-stars" aria-label="Avis illustratif">
                      {Array.from({ length: 5 }).map((_, i) => <Star size={15} key={i} fill="currentColor" />)}
                    </div>
                    <span className="review-number">0{index + 1}</span>
                  </div>
                  <p>“{review.text}”</p>
                  <div className="review-person">
                    <span className="review-avatar">{review.name.charAt(0)}</span>
                    <span><strong>{review.name}</strong><small><MapPin size={12} /> {review.location}</small></span>
                  </div>
                </article>
              ))}
            </div>
            <p className="review-disclaimer">
              Les textes ci-dessus sont des exemples de présentation, pas des avis clients vérifiés.
            </p>
          </div>
        </section>

        {/* CONTACT */}
        <section className="section contact-section" id="contact">
          <div className="page-container contact-layout">
            <div className="contact-info">
              <div className="section-eyebrow"><span /> CONTACTEZ-NOUS</div>
              <h2>Votre demande<br /><span>commence ici.</span></h2>
              <p className="contact-lead">
                Besoin d’une installation, d’un entretien ou d’un dépannage ?
                Envoyez-nous quelques informations. Votre demande pourra être
                préparée dans WhatsApp pour faciliter le premier échange.
              </p>

              <a className="contact-method" href="tel:+262262598703">
                <span className="contact-method-icon"><Phone size={20} /></span>
                <span><small>APPELEZ-NOUS</small><strong>+262 262 59 87 03</strong></span>
                <ArrowUpRight className="contact-method-arrow" size={18} />
              </a>
              <a className="contact-method" href={whatsappUrl} target="_blank" rel="noreferrer">
                <span className="contact-method-icon"><MessageCircle size={20} /></span>
                <span><small>ÉCRIVEZ-NOUS</small><strong>WhatsApp</strong></span>
                <ArrowUpRight className="contact-method-arrow" size={18} />
              </a>
              <div className="contact-method">
                <span className="contact-method-icon"><MapPin size={20} /></span>
                <span><small>ZONE D’INTERVENTION</small><strong>La Réunion · 974</strong></span>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-heading">
                <span className="form-kicker">PARLONS DE VOTRE PROJET</span>
                <h3>Décrivez-nous votre besoin.</h3>
                <p>Les champs marqués d’un * sont obligatoires.</p>
              </div>

              <div className="form-row">
                <label>
                  Votre nom *
                  <input name="name" placeholder="Ex. : Jean Dupont" required />
                </label>
                <label>
                  Votre téléphone *
                  <input name="phone" type="tel" placeholder="Ex. : 0692 ..." required />
                </label>
              </div>

              <label>
                Le service souhaité *
                <span className="select-wrap">
                  <select name="service" defaultValue="" required>
                    <option value="" disabled>Choisissez un service</option>
                    <option>Installation climatisation</option>
                    <option>Entretien et nettoyage</option>
                    <option>Dépannage climatisation</option>
                    <option>Diagnostic technique</option>
                    <option>Autre demande</option>
                  </select>
                  <ChevronDown size={17} />
                </span>
              </label>

              <label>
                Votre message *
                <textarea
                  name="message"
                  placeholder="Expliquez-nous votre besoin, votre équipement ou le problème rencontré..."
                  rows={4}
                  required
                />
              </label>

              <button className="btn btn-primary form-submit" type="submit">
                Préparer mon message <ArrowUpRight size={17} />
              </button>

              {formSent && (
                <p className="form-success">
                  <CheckCircle2 size={17} /> Votre message WhatsApp a été préparé. Envoyez-le dans WhatsApp pour finaliser votre demande.
                </p>
              )}

              <p className="form-privacy">
                <ShieldCheck size={14} /> Vos informations servent à préparer votre demande de contact.
              </p>
            </form>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="page-container">
            <div className="footer-main">
              <div className="footer-brand-column">
                <a className="brand footer-brand" href="#accueil">
                  <span className="brand-line">
                    CLIM TECH<span className="brand-snow">❄</span>
                    <span className="brand-number">01</span>
                  </span>
                  <span className="brand-caption">CONFORT • CLIMATISATION • SERVICE</span>
                </a>
                <p>
                  Des solutions de climatisation pour vous accompagner vers
                  un confort adapté à votre quotidien, à La Réunion.
                </p>
                <div className="footer-socials">
                  <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={17} /></a>
                  <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={17} /></a>
                  <a href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={17} /></a>
                </div>
              </div>

              <div className="footer-column">
                <h4>Navigation</h4>
                <a href="#accueil">Accueil</a>
                <a href="#services">Nos services</a>
                <a href="#apropos">À propos</a>
                <a href="#realisations">Galerie</a>
                <a href="#contact">Contact</a>
              </div>

              <div className="footer-column">
                <h4>Nos services</h4>
                <a href="#services">Installation</a>
                <a href="#services">Entretien</a>
                <a href="#services">Dépannage</a>
                <a href="#services">Diagnostic technique</a>
              </div>

              <div className="footer-column footer-contact-column">
                <h4>Nous contacter</h4>
                <a href="tel:+262262598703"><Phone size={15} /> +262 262 59 87 03</a>
                <a href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={15} /> WhatsApp</a>
                <span><MapPin size={15} /> La Réunion, 974</span>
                <a href="#contact" className="footer-contact-link">Parler de mon projet <ArrowUpRight size={15} /></a>
              </div>
            </div>

            <div className="footer-bottom">
              <span>© {new Date().getFullYear()} CLIM TECH 01. Tous droits réservés.</span>
              <a href="#accueil">Retour en haut ↑</a>
              <span className="footer-made">LE CONFORT, AVEC PROFESSIONNALISME.</span>
            </div>
          </div>
        </footer>
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');

        :root {
          --navy: #1d293b;
          --navy-deep: #101d2a;
          --navy-dark: #0b1724;
          --cyan: #25c4ed;
          --cyan-bright: #35cdf2;
          --text: #18283a;
          --muted: #718096;
          --line: #e5ebf1;
          --pale: #f5f8fb;
        }

        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; scroll-padding-top: 90px; }
        body {
          margin: 0;
          font-family: 'DM Sans', sans-serif;
          color: var(--text);
          background: #fff;
          -webkit-font-smoothing: antialiased;
        }
        a { color: inherit; text-decoration: none; }
        button, input, textarea, select { font: inherit; }
        button, a { -webkit-tap-highlight-color: transparent; }
        .site-shell { width: 100%; overflow: hidden; }
        .page-container { width: min(1120px, calc(100% - 64px)); margin-inline: auto; }

        /* Navbar */
        .navbar {
          height: 102px;
          position: relative;
          z-index: 50;
          color: #f4f7fb;
          background: #1d293b;
          border-bottom: 1px solid rgba(255,255,255,.055);
        }
        .nav-inner {
          width: min(1120px, calc(100% - 64px));
          height: 100%;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 26px;
        }
        .brand { display: inline-flex; flex-direction: column; flex-shrink: 0; }
        .brand-line {
          color: #28bde8;
          font-family: 'Manrope', sans-serif;
          font-weight: 800;
          font-size: 24px;
          line-height: 1;
          letter-spacing: -1.15px;
          white-space: nowrap;
        }
        .brand-snow { color: #27c8ef; font-size: 20px; margin-left: 1px; }
        .brand-number { color: #ef3547; font-size: 26px; letter-spacing: -2px; margin-left: 1px; }
        .brand-caption {
          color: #8c9cae;
          font-size: 6.5px;
          letter-spacing: 1.3px;
          margin-top: 7px;
          white-space: nowrap;
        }
        .desktop-nav { display: flex; align-items: center; gap: 36px; margin-left: auto; }
        .nav-link {
          color: #d4dce7;
          font-size: 13px;
          font-weight: 500;
          position: relative;
          padding: 12px 0;
          transition: color .2s;
        }
        .nav-link:hover, .nav-link.active { color: #ff5362; }
        .nav-link::after {
          content: '';
          position: absolute;
          height: 2px;
          background: #ff5362;
          left: 0; right: 100%; bottom: 4px;
          transition: right .2s;
        }
        .nav-link:hover::after, .nav-link.active::after { right: 0; }
        .nav-actions { display: flex; align-items: center; gap: 22px; }
        .nav-contact-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(255,255,255,.09);
          background: rgba(255,255,255,.055);
          padding: 7px 9px 7px 13px;
          border-radius: 50px;
          white-space: nowrap;
          font-size: 10px;
          font-weight: 700;
          color: #f0f4fa;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.025);
        }
        .whatsapp-symbol, .phone-circle {
          width: 25px; height: 25px; display: grid; place-items: center;
          border-radius: 50%; background: rgba(255,255,255,.075);
        }
        .nav-pill-divider { height: 24px; width: 1px; background: rgba(255,255,255,.18); }
        .phone-circle { border: 1px solid rgba(255,255,255,.35); width: 32px; height: 32px; }
        .nav-phone {
          border: 1px solid rgba(255,255,255,.42);
          border-radius: 50px;
          padding: 11px 12px;
          margin-left: -8px;
        }
        .nav-write {
          display: flex; align-items: center; gap: 4px;
          font-size: 11px; color: #35c7ee; font-weight: 700; white-space: nowrap;
        }
        .nav-write:hover { color: white; }
        .mobile-menu-toggle, .mobile-nav { display: none; }

        /* Hero */
        .hero {
          min-height: 678px;
          position: relative;
          color: #f8fafc;
          background: #0c1c29;
          isolation: isolate;
          display: flex;
          align-items: center;
        }
        .hero-photo {
          position: absolute; inset: 0; z-index: -3;
          background-image: url('/images/climtech-hero-hd.png');
          background-position: center 40%;
          background-size: cover;
          background-color: #253c4b;
        }
        .hero-shade {
          position: absolute; inset: 0; z-index: -2;
          background:
            linear-gradient(90deg, rgba(8,23,35,.99) 0%, rgba(9,26,39,.96) 28%, rgba(10,28,40,.84) 48%, rgba(9,23,32,.35) 68%, rgba(9,20,28,.03) 100%),
            linear-gradient(0deg, rgba(7,18,28,.32), transparent 36%, rgba(7,18,28,.06));
        }
        .hero-grain {
          position: absolute; inset: 0; z-index: -1; pointer-events: none;
          background-image: radial-gradient(rgba(255,255,255,.13) .5px, transparent .5px);
          background-size: 5px 5px; opacity: .09;
        }
        .hero-content { padding-top: 26px; padding-bottom: 62px; position: relative; }
        .eyebrow, .section-eyebrow {
          display: flex; align-items: center; flex-wrap: wrap; gap: 8px;
          color: #2dc5ed; font-size: 9px; font-weight: 800;
          letter-spacing: 2px; line-height: 1.8;
        }
        .eyebrow-dot, .section-eyebrow > span {
          width: 6px; height: 6px; border-radius: 50%; background: var(--cyan);
          box-shadow: 0 0 12px rgba(37,196,237,.65);
        }
        .eyebrow-live { color: #7bdcf5; }
        .hero h1 {
          max-width: 680px;
          font-family: 'Manrope', sans-serif;
          font-size: clamp(35px, 4.1vw, 52px);
          line-height: 1.11;
          letter-spacing: -2px;
          font-weight: 800;
          margin: 19px 0 23px;
          color: #f2f5f8;
        }
        .hero h1 span { display: block; }
        .hero h1 span:last-child {
          background: linear-gradient(90deg, #f1f4f7 4%, #39c8ee 76%);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .hero-description {
          color: #d0d9e2; font-size: 15px; line-height: 1.7;
          max-width: 580px; margin: 0 0 19px;
        }
        .hero-buttons { display: flex; flex-wrap: wrap; gap: 9px; }
        .btn {
          min-height: 47px; display: inline-flex; align-items: center; justify-content: center;
          gap: 10px; border-radius: 50px; padding: 0 25px;
          font-size: 12px; font-weight: 700; border: 1px solid transparent;
          cursor: pointer; transition: transform .2s, background .2s, border-color .2s;
        }
        .btn:hover { transform: translateY(-2px); }
        .btn-primary {
          color: #082333; background: #2cc5ed;
          box-shadow: 0 7px 22px rgba(28,190,231,.13);
        }
        .btn-primary:hover { background: #69d9f5; }
        .hero-buttons .btn-primary { min-width: 159px; }
        .btn-glass {
          color: #e2e9ef; background: rgba(255,255,255,.065);
          border-color: rgba(255,255,255,.08); padding-inline: 24px;
        }
        .btn-glass:hover { background: rgba(255,255,255,.13); border-color: rgba(255,255,255,.22); }
        .hero-tags { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; }
        .hero-tags span {
          display: inline-flex; align-items: center; gap: 6px; padding: 9px 13px;
          border-radius: 50px; color: #d0dce6; background: rgba(255,255,255,.08);
          font-size: 11px; border: 1px solid rgba(255,255,255,.025);
        }
        .hero-tags span svg { color: #55d3f2; }
        .rating-pill {
          margin-top: 19px; display: inline-flex; align-items: center; gap: 13px;
          padding: 7px 14px; border-radius: 50px;
          background: rgba(255,255,255,.10); border: 1px solid rgba(255,255,255,.035);
        }
        .google-wordmark { display: flex; flex-wrap: wrap; width: 51px; font-family: Arial,sans-serif; font-size: 16px; font-weight: 700; line-height: 1; }
        .google-wordmark small { width: 100%; color: #b8c4cf; font-size: 6px; letter-spacing: .4px; margin-top: 4px; }
        .google-g { color: #4285f4; }.google-o1 { color: #ea4335; }.google-o2 { color: #fbbc05; }.google-l { color: #34a853; }.google-e { color: #ea4335; }
        .rating-stars { color: #ffca28; letter-spacing: 2px; font-size: 17px; white-space: nowrap; }
        .rating-score { color: #f2f5f8; font-size: 10px; font-weight: 700; white-space: nowrap; }
        .hero-bottom-note {
          display: flex; align-items: center; gap: 11px; margin-top: 38px;
          font-size: 8px; letter-spacing: 2px; font-weight: 700; color: #93a8b7;
        }
        .hero-bottom-line { width: 32px; height: 1px; background: var(--cyan); }
        .hero-image-label {
          position: absolute; right: max(5%, calc((100% - 1120px) / 2));
          bottom: 45px; display: flex; align-items: center; gap: 11px;
          padding: 13px 17px; border: 1px solid rgba(255,255,255,.24);
          background: rgba(16,31,44,.65); backdrop-filter: blur(14px); border-radius: 12px;
        }
        .hero-image-label-icon { color: var(--cyan); }
        .hero-image-label strong, .hero-image-label small { display: block; }
        .hero-image-label strong { font-size: 11px; }
        .hero-image-label small { font-size: 9px; color: #bdcbd7; margin-top: 4px; }
        .scroll-indicator {
          position: absolute; right: 31px; top: 50%; transform: translateY(-50%);
          display: flex; align-items: center; gap: 8px; writing-mode: vertical-rl;
          color: rgba(255,255,255,.66); font-size: 8px; letter-spacing: 2px;
        }
        .scroll-indicator svg { color: var(--cyan); }

        /* Trust */
        .trust-strip { background: #fff; border-bottom: 1px solid #edf1f5; }
        .trust-inner { display: grid; grid-template-columns: repeat(4,1fr); padding-block: 24px; }
        .trust-item { display: flex; align-items: center; gap: 13px; padding: 4px 18px; border-right: 1px solid #e7edf2; }
        .trust-item:first-child { padding-left: 0; }
        .trust-item:last-child { border-right: 0; }
        .trust-icon {
          width: 43px; height: 43px; flex-shrink: 0; display: grid; place-items: center;
          border-radius: 12px; background: #eafaff; color: #119fc5;
        }
        .trust-item strong, .trust-item small { display: block; }
        .trust-item strong { font-size: 11px; font-weight: 800; }
        .trust-item small { color: #8391a0; font-size: 10px; margin-top: 5px; }

        /* Shared sections */
        .section { padding: 100px 0; }
        .section-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 48px; margin-bottom: 45px; }
        .section-eyebrow { font-size: 9px; letter-spacing: 1.8px; color: #159fc6; }
        .section-heading h2, .about-content h2, .center-heading h2, .contact-info h2, .cta-copy h2 {
          margin: 17px 0 0; font-family: 'Manrope', sans-serif;
          font-size: clamp(32px, 3.6vw, 43px); line-height: 1.18;
          letter-spacing: -1.65px; font-weight: 800; color: #182a3d;
        }
        .section-heading h2 span, .about-content h2 span, .center-heading h2 span, .contact-info h2 span {
          color: #1aaed6;
        }
        .section-heading-right { max-width: 400px; padding-bottom: 5px; }
        .section-heading-right p { margin: 0 0 17px; color: #778596; font-size: 13px; line-height: 1.9; }
        .text-link { display: inline-flex; align-items: center; gap: 8px; color: #109dc3; font-size: 12px; font-weight: 800; }
        .text-link:hover { gap: 13px; }

        /* Service cards */
        .services-section { background: #fff; }
        .services-grid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 17px; }
        .service-card {
          min-height: 320px; display: flex; flex-direction: column; padding: 25px 21px 20px;
          border: 1px solid #e8edf2; border-radius: 15px; background: white;
          transition: transform .25s, border-color .25s, box-shadow .25s;
        }
        .service-card:hover { transform: translateY(-6px); border-color: #a8e9f7; box-shadow: 0 18px 45px rgba(15,55,75,.07); }
        .service-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 25px; }
        .service-icon {
          display: grid; place-items: center; width: 53px; height: 53px;
          border-radius: 14px; background: #eafaff; color: #12a8cf;
        }
        .service-number { color: #d5dee7; font-size: 25px; font-family: 'Manrope', sans-serif; font-weight: 800; }
        .service-tag { color: #159ec3; text-transform: uppercase; font-size: 8px; letter-spacing: 1.5px; font-weight: 800; }
        .service-card h3 { margin: 10px 0 10px; font-family: 'Manrope', sans-serif; font-size: 16px; line-height: 1.4; letter-spacing: -.4px; }
        .service-card p { color: #7d8b9a; font-size: 11px; line-height: 1.85; margin: 0 0 22px; }
        .service-link {
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
          border-top: 1px solid #edf1f5; padding-top: 15px; margin-top: auto;
          font-size: 10px; color: #526275; font-weight: 700;
        }
        .service-arrow { display: grid; place-items: center; width: 29px; height: 29px; border-radius: 50%; background: #e9faff; color: #109fc5; flex-shrink: 0; }

        /* About */
        .about-section { background: #f5f8fb; padding: 100px 0; }
        .about-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 85px; align-items: center; }
        .about-visual { height: 490px; position: relative; }
        .about-main-image {
          position: absolute; inset: 0 32px 25px 0; border-radius: 17px;
          background-image: url('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=85');
          background-size: cover; background-position: center; background-color: #c5d7df;
        }
        .about-image-overlay { position: absolute; inset: 0 32px 25px 0; border-radius: 17px; background: linear-gradient(0deg, rgba(6,22,34,.65), transparent 55%); }
        .about-photo-caption { position: absolute; left: 25px; bottom: 51px; display: flex; gap: 12px; align-items: center; color: white; }
        .caption-icon { display: grid; place-items: center; width: 42px; height: 42px; background: var(--cyan); color: #0b2533; border-radius: 12px; }
        .about-photo-caption strong, .about-photo-caption small { display: block; }
        .about-photo-caption strong { font-size: 13px; }
        .about-photo-caption small { font-size: 10px; margin-top: 5px; color: #d4e1e8; }
        .about-floating-card {
          position: absolute; right: 0; top: 44px; display: flex; align-items: center; gap: 11px;
          padding: 17px; background: #fff; border-radius: 13px; box-shadow: 0 15px 40px rgba(13,33,52,.13);
        }
        .floating-card-icon { width: 35px; height: 35px; display: grid; place-items: center; border-radius: 50%; background: #e5fbf5; color: #159c7c; }
        .about-floating-card strong, .about-floating-card small { display: block; }
        .about-floating-card strong { font-size: 10px; }
        .about-floating-card small { color: #8390a0; font-size: 9px; margin-top: 5px; }
        .about-content h2 { margin-bottom: 20px; }
        .about-lead { color: #536477; font-size: 14px; line-height: 1.9; font-weight: 600; }
        .about-copy { color: #7a8998; font-size: 12px; line-height: 1.95; margin-top: 15px; }
        .about-checks { display: grid; gap: 13px; margin: 25px 0 28px; }
        .about-checks div { display: flex; align-items: center; gap: 10px; font-size: 11px; font-weight: 700; color: #44566a; }
        .about-checks svg { color: #12accf; flex-shrink: 0; }
        .btn-dark { background: #17283a; color: #fff; }
        .btn-dark:hover { background: #243b52; }
        .about-small-note { font-size: 9px; color: #8996a4; margin-top: 13px; }

        /* Process */
        .process-section { background: #fff; }
        .center-heading { max-width: 670px; text-align: center; margin: 0 auto 48px; }
        .center-heading .section-eyebrow { justify-content: center; }
        .center-heading h2 { margin-top: 14px; }
        .center-heading p { color: #8190a0; font-size: 12px; line-height: 1.9; margin: 14px auto 0; max-width: 560px; }
        .process-grid { display: grid; grid-template-columns: 1fr 34px 1fr 34px 1fr; align-items: center; gap: 20px; }
        .process-step { position: relative; text-align: center; padding: 28px 22px 27px; border: 1px solid #e8eef3; border-radius: 15px; }
        .process-number { position: absolute; top: 14px; right: 17px; color: #dce4eb; font-size: 23px; font-weight: 800; font-family: 'Manrope', sans-serif; }
        .process-icon { display: grid; place-items: center; width: 59px; height: 59px; margin: 0 auto 19px; border-radius: 17px; background: #eafaff; color: #0fa8ce; }
        .process-step h3 { font-family: 'Manrope', sans-serif; font-size: 14px; margin: 0 0 10px; }
        .process-step p { color: #8190a0; font-size: 11px; line-height: 1.8; margin: 0; }
        .process-connector { display: grid; place-items: center; color: #19b4d9; }

        /* Gallery */
        .gallery-section { background: #f5f8fb; }
        .gallery-grid { display: grid; grid-template-columns: 1.12fr 1fr 1fr; gap: 18px; }
        .gallery-card { position: relative; height: 350px; border-radius: 15px; overflow: hidden; background: #d7e0e7; isolation: isolate; }
        .gallery-image { position: absolute; inset: 0; z-index: -2; background-size: cover; background-position: center; transition: transform .5s; }
        .gallery-card:hover .gallery-image { transform: scale(1.05); }
        .gallery-image-shade { position: absolute; inset: 0; z-index: -1; background: linear-gradient(0deg, rgba(5,19,30,.88), transparent 60%); }
        .gallery-index { position: absolute; right: 18px; top: 18px; color: white; font-size: 9px; letter-spacing: 1.4px; background: rgba(10,25,38,.35); padding: 8px 10px; border-radius: 50px; }
        .gallery-card-content { position: absolute; left: 22px; right: 18px; bottom: 23px; color: white; }
        .gallery-card-content > span { color: #76def5; font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; }
        .gallery-card-content h3 { font-family: 'Manrope', sans-serif; font-size: 18px; margin: 8px 0 0; max-width: 220px; }
        .gallery-card-content a { position: absolute; right: 0; bottom: 0; display: grid; place-items: center; width: 37px; height: 37px; border-radius: 50%; background: var(--cyan); color: #092331; }
        .gallery-disclaimer, .review-disclaimer { font-size: 9px; color: #94a0ac; margin-top: 17px; }

        /* CTA */
        .cta-section { position: relative; overflow: hidden; background: #142739; color: #fff; padding: 65px 0; }
        .cta-glow { position: absolute; width: 500px; height: 500px; border-radius: 50%; right: -130px; top: -260px; background: rgba(39,197,236,.12); filter: blur(10px); }
        .cta-inner { display: flex; align-items: center; gap: 27px; position: relative; }
        .cta-icon { width: 70px; height: 70px; display: grid; place-items: center; border-radius: 19px; color: #062432; background: var(--cyan); flex-shrink: 0; }
        .cta-copy { flex: 1; }
        .cta-copy .section-eyebrow { color: #54d3f1; }
        .cta-copy h2 { color: #fff; font-size: 33px; margin-top: 11px; }
        .cta-copy h2 span { color: #36c8ed; }
        .cta-copy p { color: #b9c7d4; font-size: 11px; line-height: 1.8; margin: 12px 0 0; }
        .cta-actions { display: flex; flex-direction: column; gap: 10px; min-width: 230px; }
        .btn-outline-light { border-color: rgba(255,255,255,.24); color: white; background: rgba(255,255,255,.04); }
        .btn-outline-light:hover { background: rgba(255,255,255,.1); }
        .cta-actions small { font-size: 9px; color: #93a6b8; line-height: 1.6; }

        /* Reviews */
        .reviews-section { background: #fff; }
        .reviews-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
        .review-card { border: 1px solid #e7edf2; border-radius: 15px; padding: 23px; }
        .review-top { display: flex; align-items: center; justify-content: space-between; }
        .review-stars { display: flex; gap: 3px; color: #f6b923; }
        .review-number { color: #d6dfe8; font-size: 13px; font-weight: 800; }
        .review-card > p { min-height: 98px; color: #617285; font-size: 12px; line-height: 1.9; margin: 21px 0; }
        .review-person { display: flex; align-items: center; gap: 11px; border-top: 1px solid #edf1f5; padding-top: 17px; }
        .review-avatar { display: grid; place-items: center; width: 39px; height: 39px; border-radius: 50%; background: #eafaff; color: #129fc3; font-size: 13px; font-weight: 800; }
        .review-person strong, .review-person small { display: flex; align-items: center; gap: 4px; }
        .review-person strong { font-size: 10px; }
        .review-person small { color: #8895a3; font-size: 9px; margin-top: 5px; }

        /* Contact */
        .contact-section { background: #f5f8fb; }
        .contact-layout { display: grid; grid-template-columns: .88fr 1.12fr; gap: 80px; align-items: start; }
        .contact-info h2 { margin-bottom: 22px; }
        .contact-lead { color: #778696; font-size: 12px; line-height: 1.95; margin-bottom: 27px; }
        .contact-method {
          display: flex; align-items: center; gap: 13px; padding: 16px 0;
          border-bottom: 1px solid #e0e8ef;
        }
        .contact-method-icon { width: 43px; height: 43px; display: grid; place-items: center; border-radius: 12px; background: #e6faff; color: #0fa6cd; flex-shrink: 0; }
        .contact-method > span:nth-child(2) { flex: 1; }
        .contact-method small, .contact-method strong { display: block; }
        .contact-method small { color: #8a98a6; font-size: 8px; letter-spacing: 1.2px; font-weight: 800; }
        .contact-method strong { font-size: 12px; margin-top: 6px; }
        .contact-method-arrow { color: #16a6cc; }
        .contact-form { background: #fff; padding: 34px; border: 1px solid #e8edf2; border-radius: 17px; box-shadow: 0 15px 50px rgba(24,51,74,.045); }
        .form-kicker { color: #13a3c9; font-size: 8px; letter-spacing: 1.7px; font-weight: 800; }
        .form-heading h3 { font-family: 'Manrope', sans-serif; font-size: 23px; letter-spacing: -.8px; margin: 10px 0 7px; }
        .form-heading p { color: #8b97a5; font-size: 10px; margin: 0 0 24px; }
        .contact-form label { display: flex; flex-direction: column; gap: 9px; color: #405164; font-size: 10px; font-weight: 800; margin-bottom: 17px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .contact-form input, .contact-form textarea, .contact-form select {
          width: 100%; min-width: 0; border: 1px solid #e0e7ee; border-radius: 9px;
          background: #fbfcfd; padding: 13px 14px; color: #1e3042; outline: none;
          font-size: 11px; font-weight: 400; transition: border-color .2s, box-shadow .2s;
        }
        .contact-form input:focus, .contact-form textarea:focus, .contact-form select:focus { border-color: #2bc4e9; box-shadow: 0 0 0 3px rgba(43,196,233,.1); }
        .contact-form input::placeholder, .contact-form textarea::placeholder { color: #a6b0bb; }
        .contact-form textarea { resize: vertical; min-height: 100px; line-height: 1.7; }
        .select-wrap { position: relative; }
        .select-wrap select { appearance: none; padding-right: 38px; }
        .select-wrap > svg { position: absolute; right: 13px; top: 50%; transform: translateY(-50%); pointer-events: none; color: #8493a2; }
        .form-submit { width: 100%; border: 0; margin-top: 2px; }
        .form-success { display: flex; align-items: flex-start; gap: 8px; color: #128260; background: #eafaf3; padding: 12px; border-radius: 9px; font-size: 10px; line-height: 1.7; }
        .form-success svg { flex-shrink: 0; }
        .form-privacy { display: flex; justify-content: center; align-items: center; gap: 6px; color: #98a4b0; font-size: 9px; margin: 16px 0 0; }

        /* Footer */
        .footer { color: #d5dee8; background: #101d2b; padding-top: 65px; }
        .footer-main { display: grid; grid-template-columns: 1.6fr .8fr .95fr 1fr; gap: 55px; padding-bottom: 48px; }
        .footer-brand .brand-caption { color: #8496a8; }
        .footer-brand-column > p { max-width: 270px; color: #9aabba; font-size: 11px; line-height: 1.9; margin: 20px 0; }
        .footer-socials { display: flex; gap: 9px; }
        .footer-socials a { display: grid; place-items: center; width: 34px; height: 34px; border: 1px solid #344456; border-radius: 50%; color: #b6c4d1; transition: all .2s; }
        .footer-socials a:hover { background: var(--cyan); color: #0b1c29; border-color: var(--cyan); }
        .footer-column { display: flex; flex-direction: column; align-items: flex-start; gap: 15px; }
        .footer-column h4 { margin: 5px 0 9px; color: white; font-size: 12px; font-weight: 800; }
        .footer-column > a, .footer-column > span { display: flex; align-items: center; gap: 8px; color: #9aabba; font-size: 10px; transition: color .2s; }
        .footer-column > a:hover { color: #4dd2f0; }
        .footer-contact-column svg { color: #35c5e9; flex-shrink: 0; }
        .footer-contact-link { margin-top: 6px; color: #38c9ed !important; font-weight: 800; }
        .footer-bottom {
          display: flex; align-items: center; justify-content: space-between; gap: 20px;
          padding: 21px 0; border-top: 1px solid #29394a; color: #8192a3; font-size: 9px;
        }
        .footer-bottom a { color: #b9c7d3; }
        .footer-bottom a:hover { color: var(--cyan); }
        .footer-made { letter-spacing: 1.3px; font-size: 8px; }

        /* Responsive */
        @media (min-width: 1500px) {
          .hero { min-height: 720px; }
        }
        @media (max-width: 1150px) {
          .nav-inner, .page-container { width: calc(100% - 48px); }
          .desktop-nav { gap: 23px; }
          .nav-actions { gap: 13px; }
          .nav-write { display: none; }
          .nav-contact-pill { gap: 7px; }
          .nav-phone { padding-inline: 9px; }
          .about-layout { gap: 55px; }
          .footer-main { gap: 30px; }
          .services-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
          .service-card { min-height: 285px; }
        }
        @media (max-width: 850px) {
          .navbar { height: 82px; }
          .nav-inner, .page-container { width: calc(100% - 40px); }
          .desktop-nav, .nav-actions { display: none; }
          .mobile-menu-toggle {
            display: grid; place-items: center; width: 42px; height: 42px;
            color: white; background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.12);
            border-radius: 11px; cursor: pointer;
          }
          .mobile-nav {
            display: flex; flex-direction: column; gap: 0; position: absolute;
            top: 81px; left: 0; right: 0; padding: 10px 20px 20px;
            background: #1d293b; border-top: 1px solid rgba(255,255,255,.08);
            box-shadow: 0 20px 30px rgba(4,16,28,.2);
          }
          .mobile-nav a { display: flex; align-items: center; gap: 10px; padding: 14px 4px; border-bottom: 1px solid rgba(255,255,255,.07); color: #e1e8ef; font-size: 13px; }
          .mobile-nav a:last-child { color: var(--cyan); border-bottom: 0; }
          .hero { min-height: 680px; align-items: flex-end; }
          .hero-photo { background-position: 60% center; }
          .hero-shade { background: linear-gradient(90deg, rgba(7,21,33,.97), rgba(7,21,33,.82) 60%, rgba(7,21,33,.35)), linear-gradient(0deg, rgba(7,20,31,.25), transparent); }
          .hero-content { padding-top: 80px; padding-bottom: 45px; }
          .hero h1 { max-width: 650px; font-size: clamp(37px, 6vw, 51px); }
          .hero-description { max-width: 560px; }
          .hero-image-label, .scroll-indicator { display: none; }
          .trust-inner { grid-template-columns: repeat(2,1fr); row-gap: 22px; }
          .trust-item:nth-child(2) { border-right: 0; }
          .trust-item:nth-child(3) { padding-left: 0; }
          .section, .about-section { padding: 75px 0; }
          .section-heading { gap: 25px; }
          .about-layout { grid-template-columns: 1fr 1fr; gap: 35px; }
          .about-visual { height: 420px; }
          .about-floating-card { right: -5px; padding: 12px; }
          .about-floating-card strong { font-size: 9px; }
          .about-floating-card small { font-size: 8px; }
          .process-grid { gap: 10px; }
          .process-step { padding: 26px 13px; }
          .process-connector svg { width: 16px; }
          .gallery-grid { grid-template-columns: repeat(2,1fr); }
          .gallery-card:first-child { grid-row: span 2; height: 100%; min-height: 400px; }
          .gallery-card { height: 190px; }
          .cta-inner { flex-wrap: wrap; }
          .cta-copy { min-width: calc(100% - 110px); }
          .cta-actions { width: 100%; flex-direction: row; flex-wrap: wrap; margin-left: 97px; }
          .cta-actions small { width: 100%; }
          .contact-layout { gap: 35px; }
          .contact-form { padding: 25px; }
          .footer-main { grid-template-columns: 1.3fr 1fr 1fr; gap: 35px; }
          .footer-brand-column { grid-column: 1 / -1; }
          .footer-brand-column > p { max-width: 440px; }
        }
        @media (max-width: 580px) {
          .nav-inner, .page-container { width: calc(100% - 36px); }
          .brand-line { font-size: 22px; }
          .brand-number { font-size: 24px; }
          .hero { min-height: 690px; }
          .hero-photo { background-position: 64% center; }
          .hero-shade {
            background:
              linear-gradient(90deg, rgba(7,20,31,.95), rgba(7,20,31,.78)),
              linear-gradient(0deg, rgba(7,20,31,.3), transparent);
          }
          .hero-content { padding-top: 65px; padding-bottom: 38px; }
          .eyebrow { font-size: 8px; letter-spacing: 1.2px; gap: 6px; }
          .hero h1 { font-size: clamp(34px, 9.3vw, 46px); letter-spacing: -1.5px; line-height: 1.14; margin: 18px 0; }
          .hero-description { font-size: 13px; line-height: 1.8; }
          .hero-buttons { display: grid; grid-template-columns: 1fr; gap: 9px; }
          .hero-buttons .btn { width: 100%; min-height: 46px; }
          .hero-buttons .btn-primary { min-width: 0; }
          .hero-tags { gap: 7px; margin-top: 16px; }
          .hero-tags span { padding: 8px 10px; font-size: 9px; }
          .rating-pill { margin-top: 16px; }
          .hero-bottom-note { margin-top: 25px; font-size: 7px; }
          .trust-inner { padding-block: 20px; column-gap: 10px; row-gap: 20px; }
          .trust-item { padding: 0 6px 0 0; gap: 9px; border: 0; }
          .trust-icon { width: 35px; height: 35px; border-radius: 10px; }
          .trust-icon svg { width: 18px; }
          .trust-item strong { font-size: 9px; }
          .trust-item small { font-size: 8px; line-height: 1.5; }
          .section, .about-section { padding: 65px 0; }
          .section-heading { flex-direction: column; align-items: flex-start; gap: 17px; margin-bottom: 29px; }
          .section-heading h2, .about-content h2, .center-heading h2, .contact-info h2 { font-size: 34px; letter-spacing: -1.3px; }
          .section-heading-right { max-width: none; }
          .section-heading-right p { font-size: 12px; }
          .services-grid { grid-template-columns: 1fr; gap: 12px; }
          .service-card { min-height: 0; padding: 22px; }
          .service-card-top { margin-bottom: 18px; }
          .service-card p { font-size: 12px; }
          .about-layout { grid-template-columns: 1fr; gap: 40px; }
          .about-visual { height: 370px; }
          .about-main-image, .about-image-overlay { right: 18px; bottom: 18px; }
          .about-photo-caption { left: 18px; bottom: 40px; }
          .about-floating-card { top: 22px; right: 0; }
          .about-content h2 { font-size: 36px; }
          .about-lead { font-size: 13px; }
          .about-copy { font-size: 12px; }
          .center-heading { margin-bottom: 32px; }
          .center-heading h2 { font-size: 33px; }
          .process-grid { grid-template-columns: 1fr; gap: 11px; }
          .process-step { text-align: left; padding: 23px 20px 23px 88px; min-height: 120px; }
          .process-icon { position: absolute; left: 18px; top: 29px; width: 51px; height: 51px; margin: 0; }
          .process-number { font-size: 19px; }
          .process-step h3 { padding-top: 5px; }
          .process-step p { font-size: 11px; }
          .process-connector { transform: rotate(90deg); height: 10px; }
          .gallery-grid { grid-template-columns: 1fr; }
          .gallery-card:first-child, .gallery-card { height: 280px; min-height: 0; grid-row: auto; }
          .gallery-card-content h3 { font-size: 17px; }
          .cta-section { padding: 50px 0; }
          .cta-inner { gap: 17px; }
          .cta-icon { width: 54px; height: 54px; border-radius: 15px; }
          .cta-icon svg { width: 23px; }
          .cta-copy { min-width: 0; width: calc(100% - 72px); }
          .cta-copy h2 { font-size: 28px; }
          .cta-copy p { font-size: 10px; }
          .cta-actions { margin-left: 0; width: 100%; flex-direction: column; }
          .cta-actions .btn { width: 100%; }
          .reviews-grid { grid-template-columns: 1fr; }
          .review-card > p { min-height: auto; }
          .contact-layout { grid-template-columns: 1fr; gap: 32px; }
          .contact-lead { font-size: 12px; }
          .contact-form { padding: 22px 17px; }
          .form-heading h3 { font-size: 21px; }
          .form-row { grid-template-columns: 1fr; gap: 0; }
          .footer { padding-top: 48px; }
          .footer-main { grid-template-columns: 1fr 1fr; gap: 32px 22px; padding-bottom: 35px; }
          .footer-brand-column { grid-column: 1 / -1; }
          .footer-brand-column > p { font-size: 11px; }
          .footer-column { gap: 13px; }
          .footer-column h4 { font-size: 11px; }
          .footer-column > a, .footer-column > span { font-size: 9px; }
          .footer-contact-column { grid-column: 1 / -1; }
          .footer-bottom { flex-direction: column; align-items: flex-start; gap: 12px; line-height: 1.7; }
          .footer-made { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
            animation-duration: .01ms !important;
          }
        }
      `}</style>
    </>
  );
}