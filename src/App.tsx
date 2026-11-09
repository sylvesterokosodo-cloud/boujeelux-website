
import { useEffect, useState } from 'react';
import { api, auth } from '@appdeploy/client';
import {
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  MapPin,
  Mail,
  Phone,
  Users,
  BedDouble,
  ShieldCheck,
  LockKeyhole,
  Sparkles,
  Heart,
} from 'lucide-react';

const assets = {
  logo: '/resources/boujeelux-logo-new.png',
  bedroom: '/resources/bedroom.jpg',
  living1: '/resources/living-room-1.jpg',
  living2: '/resources/living-room-2.jpg',
  sitting: '/resources/sitting-room.jpg',
  corridor: '/resources/corridor.jpg',
  block2Bathroom: '/resources/block-2-bathroom.jpg',
  block2Outdoor: '/resources/block-2-outdoor.jpg',
  block2Bedroom: '/resources/block-2-bedroom.jpg',
  block2BedroomParlour: '/resources/block-2-bedroom-parlour.jpg',
  block2Kitchen: '/resources/block-2-kitchen.jpg',
  block2Parlour: '/resources/block-2-parlour.jpg',
  homePatio: '/resources/home-patio.jpg',
  homeGrandeur: '/resources/home-grandeur-lounge.jpg',
  homePrestige: '/resources/home-prestige-lounge.jpg',
  homeGarden: '/resources/home-garden-patio.jpg',
  homeOutdoor: '/resources/home-outdoor-seating.jpg',
  homePrivate: '/resources/home-private-lounge.jpg',
};

const whatsapp = 'https://wa.me/message/B5ZSNSGTP46UPI1';
const mapUrl = 'https://maps.app.goo.gl/tFdX3pNfdJoAuCaa6?g_st=iw';

const email = 'Boujeelux24@gmail.com';
const bookingEmail = 'Boujeeluxserviceapartment@gmail.com';
const phoneNumber = '09119791995';

const tikTok =
  'https://www.tiktok.com/@boujeelux.service?_r=1&_t=ZS-9Avy5JcdRyB';

type ApartmentPhoto = {
  src: string;
  label: string;
  alt: string;
};

type Apartment = {
  id: string;
  title: string;
  detail: string;
  nightly: number;
  photos: ApartmentPhoto[];
};

const defaultApartments: Apartment[] = [
  {
    id: 'block-1',
    title: 'Grandeur Apartment',
    detail:
      'Three-bedroom apartment • bedroom • living room • sitting area • hallway',
    nightly: 150000,
    photos: [
      {
        src: assets.bedroom,
        label: 'Bedroom',
        alt: 'Block 1 bedroom',
      },
      {
        src: assets.living1,
        label: 'Living Room',
        alt: 'Block 1 living room view 1',
      },
      {
        src: assets.living2,
        label: 'Living Room — Second View',
        alt: 'Block 1 living room view 2',
      },
      {
        src: assets.sitting,
        label: 'Sitting Area',
        alt: 'Block 1 sitting area',
      },
      {
        src: assets.corridor,
        label: 'Hallway',
        alt: 'Block 1 hallway',
      },
    ],
  },
  {
    id: 'block-2',
    title: 'Prestige',
    detail:
      'Three bedrooms • parlour • kitchen • bathroom • outdoor area',
    nightly: 230000,
    photos: [
      {
        src: assets.block2Bedroom,
        label: 'Bedroom',
        alt: 'Block 2 bedroom',
      },
      {
        src: assets.block2BedroomParlour,
        label: 'Bedroom & Parlour',
        alt: 'Block 2 bedroom and parlour',
      },
      {
        src: assets.block2Parlour,
        label: 'Parlour',
        alt: 'Block 2 parlour',
      },
      {
        src: assets.block2Kitchen,
        label: 'Kitchen',
        alt: 'Block 2 kitchen',
      },
      {
        src: assets.block2Bathroom,
        label: 'Bathroom',
        alt: 'Block 2 bathroom',
      },
      {
        src: assets.block2Outdoor,
        label: 'Outdoor Area',
        alt: 'Block 2 outdoor area',
      },
    ],
  },
  {
    id: 'studio',
    title: 'Studio Apartment',
    detail:
      'Open-plan bedroom and lounge • kitchenette • private bathroom',
    nightly: 0,
    photos: [
      {
        src: '/resources/studio-overview.jpg',
        label: 'Studio Overview',
        alt: 'Studio apartment overview',
      },
      {
        src: '/resources/studio-bedroom.jpg',
        label: 'Bedroom',
        alt: 'Studio apartment bedroom',
      },
      {
        src: '/resources/studio-lounge.jpg',
        label: 'Lounge & TV',
        alt: 'Studio apartment lounge and television',
      },
      {
        src: '/resources/studio-kitchen.jpg',
        label: 'Kitchenette',
        alt: 'Studio apartment kitchenette',
      },
      {
        src: '/resources/studio-bathroom.jpg',
        label: 'Bathroom',
        alt: 'Studio apartment bathroom',
      },
      {
        src: '/resources/studio-toilet.jpg',
        label: 'Bathroom Facilities',
        alt: 'Studio apartment bathroom facilities',
      },
    ],
  },
];

const money = (n: number) => '₦' + n.toLocaleString('en-NG');

const mergeApartmentData = (rows: any): Apartment[] => {
  if (!Array.isArray(rows)) return defaultApartments;

  const merged = defaultApartments.map((base) => {
    const saved = rows.find((row: any) => row && row.id === base.id);

    return saved
      ? {
          ...base,
          ...saved,
          photos:
            Array.isArray(saved.photos) && saved.photos.length
              ? saved.photos
              : base.photos,
        }
      : base;
  });

  const extras = rows.filter(
    (row: any) =>
      row && !defaultApartments.some((base) => base.id === row.id),
  );

  return [...merged, ...extras];
};

type Page = 'home' | 'about' | 'apartments' | 'contact' | 'login';

function App() {
  const [page, setPage] = useState<Page>(() => {
    const route = window.location.hash.replace('#', '') as Page;

    return ['home', 'about', 'apartments', 'contact', 'login'].includes(
      route,
    )
      ? route
      : 'home';
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [notice, setNotice] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestCount, setGuestCount] = useState('2');
  const [stayChoice, setStayChoice] = useState('Block 1 Apartment');
  const [apartments, setApartments] =
    useState<Apartment[]>(defaultApartments);
  const [adminUser, setAdminUser] = useState<{
    email?: string;
    name?: string;
  } | null>(null);
  const [adminAllowed, setAdminAllowed] = useState(false);
  const [adminChecking, setAdminChecking] = useState(false);
  const [savingPrices, setSavingPrices] = useState(false);

  useEffect(() => {
    const onHash = () => {
      const route = window.location.hash.replace('#', '') as Page;

      if (
        ['home', 'about', 'apartments', 'contact', 'login'].includes(route)
      ) {
        setPage(route);
      }
    };

    window.addEventListener('hashchange', onHash);

    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    let active = true;

    api
      .get('/api/apartments')
      .then(({ data }) => {
        if (active) {
          setApartments(mergeApartmentData(data?.apartments));
        }
      })
      .catch(() => {
        if (active) {
          setNotice(
            'Showing the current apartment rates. Please refresh later if rates have recently changed.',
          );
        }
      });

    auth
      .getUser()
      .then(async (user) => {
        if (!active) return;

        setAdminUser(
          user ? { email: user.email, name: user.name } : null,
        );

        if (user) {
          setAdminChecking(true);

          try {
            const { data } = await api.get('/api/admin/apartments');

            if (active) {
              setAdminAllowed(true);
              setApartments(mergeApartmentData(data?.apartments));
            }
          } catch {
            if (active) setAdminAllowed(false);
          } finally {
            if (active) setAdminChecking(false);
          }
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  const go = (next: Page) => {
    setPage(next);
    setMenuOpen(false);
    setNotice('');
    window.location.hash = next;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const bookMessage = () => {
    const selected =
      apartments.find((item) => item.title === stayChoice) ??
      apartments[0];

    const message = `Hello BOUJEELUX, I would like to enquire about booking. Name: ${
      guestName || 'Not provided'
    }. Apartment: ${selected?.title || stayChoice}. Number of guests: ${guestCount}. Nightly rate: ${
      selected ? money(selected.nightly) : 'Please confirm'
    }.`;

    window.open(
      whatsapp + '?text=' + encodeURIComponent(message),
      '_blank',
      'noopener,noreferrer',
    );

    setNotice(
      'Your booking details are ready in WhatsApp. Please confirm dates and availability with our team.',
    );
  };

  const signInAdmin = async () => {
    setNotice('');

    try {
      await auth.signInWithRedirect({
        scope: 'openid email profile',
      });
    } catch {
      setNotice(
        'Admin sign-in could not be opened. Please try again.',
      );
    }
  };

  const savePrices = async () => {
    setSavingPrices(true);
    setNotice('');

    try {
      const { data } = await api.put('/api/admin/apartments', {
        items: apartments.map((item) => ({
          id: item.id,
          nightly: item.nightly,
        })),
      });

      setApartments(mergeApartmentData(data?.apartments));
      setNotice('Apartment prices saved successfully.');
    } catch {
      setNotice(
        'Prices could not be saved. Please confirm you are signed in with the authorised admin email.',
      );
    } finally {
      setSavingPrices(false);
    }
  };

  const nav = [
    ['home', 'Home'],
    ['about', 'About Us'],
    ['apartments', 'Apartments'],
    ['contact', 'Contact Us'],
    ['login', 'Admin Login'],
  ] as const;

  return (
    <div className="site-shell">
      <div className="topline">
        <span>YOUR COMFORT. YOUR SPACE. YOUR STAY.</span>
        <span>Luxury serviced apartments</span>
      </div>

      <header className="header">
        <button
          className="logo-button"
          onClick={() => go('home')}
          aria-label="BOUJEELUX home"
        >
          <img src={assets.logo} alt="BOUJEE Luxury Apartments" />
        </button>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <nav className={menuOpen ? 'nav open' : 'nav'}>
          {nav.map(([key, label]) => (
            <button
              key={key}
              className={
                page === key ? 'nav-link active' : 'nav-link'
              }
              onClick={() => go(key)}
            >
              {label}
            </button>
          ))}

          <a
            className="nav-book"
            href={whatsapp}
            target="_blank"
            rel="noreferrer"
          >
            Book a stay <ArrowUpRight size={15} />
          </a>
        </nav>
      </header>

      {page === 'home' && (
        <main>
          <section className="hero">
            <img
              className="hero-image"
              src={assets.living1}
              alt="BOUJEELUX apartment living room"
            />

            <div className="hero-overlay" />

            <div className="hero-content">
              <span className="eyebrow light">
                THE BOUJEELUX EXPERIENCE
              </span>

              <h1>Luxury. Comfort. Privacy.</h1>

              <p>Your perfect home away from home.</p>

              <div className="hero-actions">
                <button
                  className="button button-gold"
                  onClick={() => go('apartments')}
                >
                  Explore Apartments <ArrowRight size={17} />
                </button>
              </div>
            </div>

            <div className="hero-stamp">
              <span>BOUJEE</span>
              <strong>LUX</strong>
              <span>MADE SIMPLE</span>
            </div>
          </section>

          <section
            className="home-gallery"
            aria-label="BOUJEELUX apartment and outdoor spaces"
          >
            <div className="home-gallery-heading">
              <span className="eyebrow">
                BOUJEE LIVING, MADE SIMPLE
              </span>

              <h2>Spaces to make yourself at home.</h2>
            </div>

            <div className="home-gallery-grid">
              <img
                src={assets.homePatio}
                alt="Private patio seating"
              />
              <img
                src={assets.homeGrandeur}
                alt="Grandeur lounge"
              />
              <img
                src={assets.homePrestige}
                alt="Prestige lounge"
              />
              <img
                src={assets.homeGarden}
                alt="Garden patio"
              />
              <img
                src={assets.homeOutdoor}
                alt="Outdoor seating"
              />
              <img
                src={assets.homePrivate}
                alt="Private apartment lounge"
              />
            </div>

            <div className="home-gallery-cta">
              <p>Your perfect home away from home.</p>

              <button
                className="button button-dark"
                onClick={() => go('apartments')}
              >
                Explore Apartments <ArrowRight size={17} />
              </button>
            </div>
          </section>

          <section className="coming-soon">
            <span className="eyebrow">
              MORE WAYS TO ENJOY YOUR STAY
            </span>

            <h2>Entertainment</h2>

            <div className="coming-soon-list">
              {[
                'PS5',
                'Snooker board',
                'Table tennis games',
              ].map((item) => (
                <span key={item}>
                  {item}
                  <small>Coming Soon</small>
                </span>
              ))}
            </div>
          </section>
        </main>
      )}

      {page === 'about' && (
        <main>
          <section className="page-hero about-hero">
            <img src={assets.living2} alt="BOUJEELUX lounge" />

            <div className="page-hero-shade" />

            <div className="page-hero-copy">
              <span className="eyebrow light">A LITTLE ABOUT US</span>

              <h1>
                Welcome to
                <br />
                <em>your happy place.</em>
              </h1>

              <p>
                Comfort-led serviced apartments for stays worth
                remembering.
              </p>
            </div>
          </section>

          <section className="story-section">
            <div className="story-heading">
              <span className="eyebrow">OUR STORY</span>

              <h2>
                Hospitality, with
                <br />
                <em>a personal touch.</em>
              </h2>
            </div>

            <div className="story-text">
              <p>
                BOUJEELUX Luxury Apartments is built around a simple
                idea: a stay should feel welcoming from the moment you
                arrive. We offer thoughtfully presented apartment
                spaces where guests can unwind, spend time together
                and enjoy the freedom of a home away from home.
              </p>

              <p>
                Whether your visit is for a short getaway, a family
                occasion or a longer stay, our aim is to make your
                experience comfortable, convenient and memorable.
              </p>

              <a
                className="text-link"
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
              >
                Talk to our team <ArrowUpRight size={16} />
              </a>
            </div>
          </section>

          <section className="about-gallery">
            <img
              src={assets.corridor}
              alt="BOUJEELUX apartment corridor"
            />
            <img
              src={assets.sitting}
              alt="BOUJEELUX apartment seating"
            />
            <img
              src={assets.bedroom}
              alt="BOUJEELUX bedroom"
            />
          </section>

          <section className="values-row">
            <div>
              <Sparkles />
              <h3>Thoughtful comfort</h3>
              <p>
                Spaces prepared to help you settle in and feel at
                ease.
              </p>
            </div>

            <div>
              <ShieldCheck />
              <h3>Privacy & peace</h3>
              <p>
                A welcoming setting for your own time and together
                time.
              </p>
            </div>

            <div>
              <Heart />
              <h3>Warm hospitality</h3>
              <p>
                Friendly support from enquiry through your stay.
              </p>
            </div>
          </section>
        </main>
      )}

      {page === 'apartments' && (
        <main>
          <section className="apartments-heading">
            <span className="eyebrow">STAY YOUR WAY</span>

            <h1>
              Our <em>apartments.</em>
            </h1>

            <p>
              Explore our three apartment options. Each listing keeps
              all its room and facility photos together.
            </p>

            <div className="discount-note">
              <Sparkles size={18} />

              <span>
                <strong>
                  Stay 7 nights or more and enjoy 10% off
                </strong>

                <small>
                  Weekly discount is calculated from the current
                  nightly price.
                </small>
              </span>
            </div>
          </section>

          <section className="block-apartment-list">
            {apartments.map((item, index) => (
              <article
                className={'block-apartment-card block-' + (index + 1)}
                key={item.id}
              >
                <div className="block-apartment-heading">
                  <span className="eyebrow">
                    BOUJEELUX • {item.title.toUpperCase()}
                  </span>

                  <h2>{item.title}</h2>

                  <p>{item.detail}</p>

                  <div className="rate">
                    <strong>
                      {item.nightly > 0
                        ? money(item.nightly)
                        : 'Price on request'}
                    </strong>

                    {item.nightly > 0 && <span>/ night</span>}
                  </div>

                  {item.nightly > 0 && (
                    <div className="weekly-rate">
                      <span>Weekly rate after 10% discount</span>

                      <strong>
                        {money(Math.round(item.nightly * 0.9))} / night
                      </strong>
                    </div>
                  )}

                  <button
                    className="button button-dark"
                    onClick={() => {
                      setStayChoice(item.title);
                      go('contact');
                    }}
                  >
                    Enquire about this apartment{' '}
                    <ArrowRight size={16} />
                  </button>
                </div>

                <div className="block-photo-grid">
                  {item.photos.map((photo, photoIndex) => (
                    <figure
                      key={photo.src}
                      className={
                        photoIndex === 0 ? 'block-photo-main' : ''
                      }
                    >
                      <img src={photo.src} alt={photo.alt} />
                      <figcaption>{photo.label}</figcaption>
                    </figure>
                  ))}
                </div>
              </article>
            ))}
          </section>

          <section className="booking-banner">
            <div>
              <span className="eyebrow light">
                READY WHEN YOU ARE
              </span>

              <h2>
                Your next stay
                <br />
                <em>starts here.</em>
              </h2>
            </div>

            <a
              className="button button-cream"
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
            >
              Ask about availability <ArrowUpRight size={17} />
            </a>
          </section>
        </main>
      )}

      {page === 'contact' && (
        <main>
          <section className="contact-heading">
            <span className="eyebrow">
              WE WOULD LOVE TO HEAR FROM YOU
            </span>

            <h1>
              Let's plan your
              <br />
              <em>next stay.</em>
            </h1>

            <p>
              Ask about availability, apartment options, rates or
              anything you need before booking.
            </p>
          </section>

          <section className="contact-layout">
            <div className="contact-details">
              <a
                href={`mailto:${email}`}
                className="contact-card"
              >
                <span className="contact-icon">
                  <Mail />
                </span>

                <span>
                  <small>GENERAL ENQUIRIES</small>
                  <strong>{email}</strong>
                </span>

                <ArrowUpRight />
              </a>

              <a
                href={`mailto:${bookingEmail}`}
                className="contact-card"
              >
                <span className="contact-icon">
                  <Mail />
                </span>

                <span>
                  <small>BOOKING EMAIL</small>
                  <strong>{bookingEmail}</strong>
                </span>

                <ArrowUpRight />
              </a>

              <a
                href={`tel:${phoneNumber}`}
                className="contact-card"
              >
                <span className="contact-icon">
                  <Phone />
                </span>

                <span>
                  <small>CALL US</small>
                  <strong>{phoneNumber}</strong>
                </span>

                <ArrowUpRight />
              </a>

              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="contact-card"
              >
                <span className="contact-icon">
                  <Phone />
                </span>

                <span>
                  <small>WHATSAPP ENQUIRIES</small>
                  <strong>Chat with BOUJEELUX</strong>
                </span>

                <ArrowUpRight />
              </a>

              <a
                href={tikTok}
                target="_blank"
                rel="noreferrer"
                className="contact-card"
              >
                <span className="contact-icon">
                  <span className="tiktok-mark">♪</span>
                </span>

                <span>
                  <small>FOLLOW OUR TIKTOK</small>
                  <strong>@boujeelux.service</strong>
                </span>

                <ArrowUpRight />
              </a>

              <a
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
                className="contact-card"
              >
                <span className="contact-icon">
                  <MapPin />
                </span>

                <span>
                  <small>FIND OUR LOCATION</small>
                  <strong>View BOUJEELUX on Google Maps</strong>
                </span>

                <ArrowUpRight />
              </a>

              <div className="bank-card">
                <span className="eyebrow">
                  BANK TRANSFER DETAILS
                </span>

                <strong>Boujeelux Apartment</strong>

                <p>Baobab Microfinance Bank</p>

                <div>
                  <span>Account number</span>
                  <b>1002485658</b>
                </div>

                <small>
                  Please confirm your reservation and payment
                  instructions with our team before transferring.
                </small>
              </div>
            </div>

            <div className="enquiry-panel">
              <span className="eyebrow">
                SEND A BOOKING ENQUIRY
              </span>

              <h2>
                Tell us about
                <br />
                <em>your stay.</em>
              </h2>

              <label>
                Your name

                <input
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Full name"
                />
              </label>

              <label>
                Apartment

                <select
                  value={stayChoice}
                  onChange={(e) => setStayChoice(e.target.value)}
                >
                  {apartments.map((item) => (
                    <option key={item.id} value={item.title}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Number of guests

                <input
                  type="number"
                  min="1"
                  max="30"
                  required
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  placeholder="Enter number of guests"
                />
              </label>

              <button
                className="button button-dark full"
                onClick={bookMessage}
              >
                Continue on WhatsApp <ArrowUpRight size={17} />
              </button>

              {notice && <p className="notice">{notice}</p>}

              <small className="form-note">
                Your enquiry opens our official WhatsApp booking
                conversation.
              </small>
            </div>
          </section>
        </main>
      )}

      {page === 'login' && (
        <main className="admin-page">
          <section className="admin-intro">
            <span className="eyebrow">BOUJEELUX MANAGEMENT</span>

            <h1>
              Apartment <em>admin.</em>
            </h1>

            <p>
              Sign in with the authorised BOUJEELUX admin email to
              manage apartment prices and listings.
            </p>
          </section>

          <section className="admin-panel">
            {!adminUser && (
              <div className="admin-signin">
                <LockKeyhole size={28} />

                <h2>Admin sign in</h2>

                <p>
                  Use the BOUJEELUX admin email. A secure sign-in
                  link will be sent to that address.
                </p>

                <button
                  className="button button-dark"
                  onClick={signInAdmin}
                >
                  Continue with admin email{' '}
                  <ArrowUpRight size={16} />
                </button>
              </div>
            )}

            {adminUser && !adminAllowed && (
              <div className="admin-signin">
                <ShieldCheck size={28} />

                <h2>Checking admin access</h2>

                <p>
                  {adminChecking
                    ? 'Verifying your account permissions…'
                    : 'This account is not on the BOUJEELUX admin list. Sign in with the authorised admin email.'}
                </p>

                <button
                  className="button button-dark"
                  onClick={signInAdmin}
                >
                  Try another account
                </button>
              </div>
            )}

            {adminAllowed && (
              <div className="admin-editor">
                <div className="admin-editor-top">
                  <div>
                    <span className="eyebrow">
                      SIGNED IN AS {adminUser.email?.toUpperCase()}
                    </span>

                    <h2>Manage apartments & photos</h2>
                  </div>

                  <button
                    className="admin-signout"
                    onClick={async () => {
                      await auth.signOut();
                      setAdminUser(null);
                      setAdminAllowed(false);
                    }}
                  >
                    Sign out
                  </button>
                </div>

                <p>
                  Add or edit apartment listings, nightly prices,
                  photo uploads and the label shown under each photo.
                  Changes appear on the public Apartments page.
                </p>

                {apartments.map((item) => (
                  <div className="admin-apartment" key={item.id}>
                    <label>
                      Apartment name

                      <input
                        value={item.title}
                        onChange={(e) =>
                          setApartments((current) =>
                            current.map((entry) =>
                              entry.id === item.id
                                ? { ...entry, title: e.target.value }
                                : entry,
                            ),
                          )
                        }
                      />
                    </label>

                    <label>
                      Description

                      <input
                        value={item.detail}
                        onChange={(e) =>
                          setApartments((current) =>
                            current.map((entry) =>
                              entry.id === item.id
                                ? { ...entry, detail: e.target.value }
                                : entry,
                            ),
                          )
                        }
                      />
                    </label>

                    <label>
                      Nightly price (₦) — enter 0 for price on request

                      <input
                        type="number"
                        min="0"
                        value={item.nightly}
                        onChange={(e) =>
                          setApartments((current) =>
                            current.map((entry) =>
                              entry.id === item.id
                                ? {
                                    ...entry,
                                    nightly: Number(e.target.value),
                                  }
                                : entry,
                            ),
                          )
                        }
                      />
                    </label>

                    <div className="admin-photo-list">
                      <strong>Photos and labels</strong>

                      {item.photos.map((photo, idx) => (
                        <div
                          className="admin-photo-row"
                          key={photo.src + idx}
                        >
                          <img src={photo.src} alt={photo.label} />

                          <input
                            aria-label="Photo label"
                            value={photo.label}
                            onChange={(e) =>
                              setApartments((current) =>
                                current.map((entry) =>
                                  entry.id === item.id
                                    ? {
                                        ...entry,
                                        photos: entry.photos.map((p, i) =>
                                          i === idx
                                            ? {
                                                ...p,
                                                label: e.target.value,
                                                alt:
                                                  item.title +
                                                  ' ' +
                                                  e.target.value,
                                              }
                                            : p,
                                        ),
                                      }
                                    : entry,
                                ),
                              )
                            }
                          />

                          <button
                            type="button"
                            className="admin-signout"
                            onClick={() =>
                              setApartments((current) =>
                                current.map((entry) =>
                                  entry.id === item.id
                                    ? {
                                        ...entry,
                                        photos: entry.photos.filter(
                                          (_, i) => i !== idx,
                                        ),
                                      }
                                    : entry,
                                ),
                              )
                            }
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>

                    <label className="admin-upload">
                      Upload photo

                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];

                          if (!file) return;

                          const reader = new FileReader();

                          reader.onload = async () => {
                            const data = String(reader.result).split(',')[1];

                            try {
                              const { data: uploaded } = await api.post(
                                '/api/admin/upload',
                                {
                                  fileName: file.name,
                                  content: data,
                                  contentType: file.type,
                                },
                              );

                              setApartments((current) =>
                                current.map((entry) =>
                                  entry.id === item.id
                                    ? {
                                        ...entry,
                                        photos: [
                                          ...entry.photos,
                                          {
                                            src: uploaded.url,
                                            label: file.name.replace(
                                              /\.[^.]+$/,
                                              '',
                                            ),
                                            alt:
                                              item.title + ' ' + file.name,
                                          },
                                        ],
                                      }
                                    : entry,
                                ),
                              );

                              setNotice(
                                'Photo uploaded. Add a clear label, then save apartment changes.',
                              );
                            } catch {
                              setNotice(
                                'Photo upload failed. Please try a smaller JPG or PNG image.',
                              );
                            }
                          };

                          reader.readAsDataURL(file);
                          e.target.value = '';
                        }}
                      />
                    </label>
                  </div>
                ))}

                <button
                  className="button button-dark"
                  onClick={() =>
                    setApartments((current) => [
                      ...current,
                      {
                        id: 'apt-' + Date.now(),
                        title: 'New Apartment',
                        detail: 'Add apartment details',
                        nightly: 0,
                        photos: [],
                      },
                    ])
                  }
                >
                  Add apartment
                </button>

                <button
                  className="button button-dark"
                  onClick={async () => {
                    setSavingPrices(true);

                    try {
                      const { data } = await api.put(
                        '/api/admin/apartments',
                        { items: apartments },
                      );

                      setApartments(
                        mergeApartmentData(data.apartments),
                      );

                      setNotice(
                        'Apartment listings, prices and photo labels saved.',
                      );
                    } catch {
                      setNotice(
                        'Could not save changes. Check each apartment has a name and valid price.',
                      );
                    } finally {
                      setSavingPrices(false);
                    }
                  }}
                  disabled={savingPrices}
                >
                  {savingPrices
                    ? 'Saving…'
                    : 'Save all apartment changes'}
                </button>
              </div>
            )}

            {notice && <p className="notice">{notice}</p>}
          </section>
        </main>
      )}

      <footer className="footer">
        <div className="footer-main">
          <div className="footer-brand">
            <img
              src={assets.logo}
              alt="BOUJEELUX Luxury Apartments"
            />

            <p>Boujee living, made simple.</p>
          </div>

          <div>
            <span className="footer-title">EXPLORE</span>

            {nav.map(([key, label]) => (
              <button key={key} onClick={() => go(key)}>
                {label}
              </button>
            ))}
          </div>

          <div>
            <span className="footer-title">GET IN TOUCH</span>

            <a href={`mailto:${email}`}>{email}</a>

            <a href={`mailto:${bookingEmail}`}>{bookingEmail}</a>

            <a href={`tel:${phoneNumber}`}>{phoneNumber}</a>

            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp bookings
            </a>

            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
            >
              Our location
            </a>

            <a
              href={tikTok}
              target="_blank"
              rel="noreferrer"
            >
              @boujeelux.service
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} BOUJEELUX Luxury Apartments
          </span>

          <span>Boujee living, made simple.</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
