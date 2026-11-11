import { useEffect, useState } from 'react';
import {
  ArrowRight, ArrowUpRight, Menu, X, Mail, Phone, MapPin,
  ShieldCheck, LockKeyhole, Sparkles, Heart, Plus, Trash2,
  Upload, Gamepad2, Music, Trophy
} from 'lucide-react';
import { supabase, supabaseReady, adminEmail, type Apartment } from './supabase';

const wa = 'https://wa.me/message/B5ZSNSGTP46UP1';
const whatsappNumber = 'https://wa.me/2349119791995';
const phoneNumber = '09119791995';

const mapUrl = 'https://maps.app.goo.gl/tFdX3pNfdJoAuCaa6?g_st=iw';
const tiktok = 'https://www.tiktok.com/@boujeelux.service?_r=1&_t=ZS-9Avy5JcdRyB';

const email = 'Boujeelux24@gmail.com';
const bookingEmail = 'Boujeeluxserviceapartment@gmail.com';

const motto = 'Boujee Living Made Simple.';

const defaults: Apartment[] = [
  {
    id: 'block-1',
    title: 'Grandeur',
    detail: 'Three-bedroom luxury apartment • bedroom • living room • sitting area • hallway',
    nightly: 150000,
    sort_order: 1,
    photos: [
      { src: '/resources/block-1-bedroom.jpg', label: 'Bedroom', alt: 'Grandeur bedroom' },
      { src: '/resources/block-1-living-room.jpg', label: 'Living Room', alt: 'Grandeur living room' },
      { src: '/resources/block-1-sitting-room.jpg', label: 'Sitting Area', alt: 'Grandeur sitting area' },
      { src: '/resources/IMG-20261028-WA0032(1).jpg', label: 'Grandeur Bathroom', alt: 'Grandeur bathroom and shower' },
      { src: '/resources/IMG-20261028-WA0036(2).jpg', label: 'Grandeur Lounge', alt: 'Grandeur lounge seating area' },
      { src: '/resources/IMG-20261028-WA0037(2).jpg', label: 'Grandeur Living Room', alt: 'Grandeur main living room' },
      { src: '/resources/IMG-20261028-WA0038.jpg', label: 'Grandeur Living Room View', alt: 'Grandeur living room from another angle' },
      { src: '/resources/IMG-20261028-WA0042(2).jpg', label: 'Grandeur Kitchen', alt: 'Grandeur fitted kitchen' },
      { src: '/resources/IMG-20261028-WA0045(1).jpg', label: 'Grandeur Bedroom Lounge', alt: 'Grandeur bedroom and lounge' },
      { src: '/resources/IMG-20261028-WA0049(1).jpg', label: 'Grandeur Bedroom', alt: 'Grandeur bedroom' },
      { src: '/resources/IMG-20261028-WA0053.jpg', label: 'Grandeur Bedroom with TV', alt: 'Grandeur bedroom with television' },
      { src: '/resources/IMG-20261028-WA0057(2).jpg', label: 'Grandeur Bedroom View', alt: 'Grandeur bedroom from another angle' },
      { src: '/resources/IMG-20261028-WA0058(1).jpg', label: 'Grandeur Outdoor Area', alt: 'Grandeur outdoor relaxation area' }
    ]
  },
  {
    id: 'block-2',
    title: 'Prestige',
    detail: 'Three-bedroom luxury apartment • bedrooms • parlour • kitchen • bathroom • outdoor area',
    nightly: 230000,
    sort_order: 2,
    photos: [
      { src: '/resources/block-2-bedroom.jpg', label: 'Bedroom', alt: 'Prestige bedroom' },
      { src: '/resources/block-2-bedroom-parlour.jpg', label: 'Bedroom & Parlour', alt: 'Prestige bedroom and parlour' },
      { src: '/resources/block-2-parlour.jpg', label: 'Parlour', alt: 'Prestige parlour' },
      { src: '/resources/block-2-bathroom.jpg', label: 'Bathroom', alt: 'Prestige bathroom' },
      { src: '/resources/block-2-outdoor.jpg', label: 'Outdoor Area', alt: 'Prestige outdoor area' }
    ]
  },
  {
    id: 'studio',
    title: 'Studio Apartment',
    detail: 'A stylish, fully furnished studio apartment featuring a comfortable sleeping area, fitted kitchen, entertainment space and modern bathroom.',
    nightly: 0,
    sort_order: 3,
    photos: [
      { src: '/resources/IMG-20261027-WA0557(1).jpg', label: 'Studio Apartment', alt: 'Studio apartment with sleeping area and fitted kitchen' },
      { src: '/resources/IMG-20261027-WA0558(1).jpg', label: 'Studio Kitchen', alt: 'Studio fitted kitchen' },
      { src: '/resources/IMG-20261027-WA0559(1).jpg', label: 'Studio Bedroom & Entertainment', alt: 'Studio bedroom and television area' },
      { src: '/resources/IMG-20261027-WA0560(1).jpg', label: 'Studio Shower', alt: 'Studio bathroom shower and sink' },
      { src: '/resources/IMG-20261027-WA0561(1).jpg', label: 'Studio Bathroom', alt: 'Studio bathroom interior' },
      { src: '/resources/IMG-20261027-WA0562(1).jpg', label: 'Studio Toilet & Shower', alt: 'Studio toilet and shower area' }
    ]
  }
];

type Page = 'home' | 'about' | 'apartments' | 'contact' | 'login';

const money = (n: number) =>
  n > 0 ? '₦' + Number(n).toLocaleString('en-NG') : 'Price on request';

const entertainment = [
  'PS5',
  'AO',
  'Ayo Lo Pon',
  'Karaoke',
  'Snooker Board',
  'Table Tennis Board'
];

function App() {
  const [page, setPage] = useState<Page>(() =>
    (['home', 'about', 'apartments', 'contact', 'login'].includes(location.hash.slice(1))
      ? location.hash.slice(1) as Page : 'home')
  );

  const [menu, setMenu] = useState(false);
  const [notice, setNotice] = useState('');
  const [apartments, setApartments] = useState<Apartment[]>(defaults);
  const [guest, setGuest] = useState('');
  const [count, setCount] = useState('2');
  const [choice, setChoice] = useState('Grandeur');
  const [user, setUser] = useState<any>(null);
  const [allowed, setAllowed] = useState(false);
  const [busy, setBusy] = useState(false);

  const go = (p: Page) => {
    setPage(p);
    setMenu(false);
    setNotice('');
    location.hash = p;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const refresh = async () => {
    if (!supabase) return;

    const { data: rows, error } = await supabase
      .from('apartments')
      .select('*')
      .order('sort_order');

    if (error) throw error;

    const { data: photos, error: photoError } = await supabase
      .from('apartment_photos')
      .select('*')
      .order('sort_order');

    if (photoError) throw photoError;

    if (rows?.length) {
      const loaded = rows.map((a: any) => ({
        ...a,
        title: a.id === 'block-1' ? 'Grandeur' : a.id === 'block-2' ? 'Prestige' : a.title,
        photos: [
          ...(defaults.find(d => d.id === a.id)?.photos || []),
          ...(photos || []).filter((p: any) => p.apartment_id === a.id)
        ].filter((p: any, i: number, arr: any[]) =>
          arr.findIndex((x: any) => x.src === p.src) === i
        )
      }));

      if (!loaded.some((a: any) => a.id === 'studio')) {
        loaded.push(defaults[2]);
      }

      setApartments(loaded);
    }
  };

  useEffect(() => {
    const listener = () => {
      const p = location.hash.slice(1) as Page;
      if (['home', 'about', 'apartments', 'contact', 'login'].includes(p)) {
        setPage(p);
      }
    };

    addEventListener('hashchange', listener);

    if (supabase) {
      refresh().catch(() =>
        setNotice('Showing the saved starting listings. Database setup may still be required.')
      );

      supabase.auth.getSession().then(({ data }) => {
        const u = data.session?.user || null;
        setUser(u);
        setAllowed((u?.email || '').toLowerCase() === adminEmail);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        const u = session?.user || null;
        setUser(u);
        setAllowed((u?.email || '').toLowerCase() === adminEmail);
      });

      return () => {
        removeEventListener('hashchange', listener);
        subscription.unsubscribe();
      };
    }

    return () => removeEventListener('hashchange', listener);
  }, []);

  const book = () => {
    const a = apartments.find(x => x.title === choice) || apartments[0];

    const msg = `Hello BOUJEELUX, I would like to enquire about booking. Name: ${guest || 'Not provided'}. Apartment: ${a?.title || choice}. Number of guests: ${count}. Nightly rate: ${money(a?.nightly || 0)}. Please confirm dates and availability.`;

    window.open(whatsappNumber + '?text=' + encodeURIComponent(msg), '_blank', 'noopener,noreferrer');
  };

  const login = async () => {
    if (!supabase) return;
    setBusy(true);

    const { error } = await supabase.auth.signInWithOtp({
      email: adminEmail,
      options: { emailRedirectTo: location.origin }
    });

    setNotice(error ? error.message : 'A secure sign-in link has been sent to the authorised admin email.');
    setBusy(false);
  };

  const save = async () => {
    if (!supabase || !allowed) return;

    setBusy(true);
    setNotice('');

    try {
      for (let i = 0; i < apartments.length; i++) {
        const a = apartments[i];

        const { error } = await supabase.from('apartments').upsert({
          id: a.id,
          title: a.title,
          detail: a.detail,
          nightly: Number(a.nightly),
          sort_order: i + 1
        });

        if (error) throw error;

        const { error: delError } = await supabase
          .from('apartment_photos')
          .delete()
          .eq('apartment_id', a.id);

        if (delError) throw delError;

        if (a.photos.length) {
          const { error: insError } = await supabase
            .from('apartment_photos')
            .insert(
              a.photos.map((p, j) => ({
                apartment_id: a.id,
                src: p.src,
                label: p.label,
                alt: p.alt,
                sort_order: j + 1
              }))
            );

          if (insError) throw insError;
        }
      }

      await refresh();
      setNotice('Apartment names, details, prices and photos saved.');
    } catch (e: any) {
      setNotice(e.message || 'Could not save. Check the database setup and admin access.');
    } finally {
      setBusy(false);
    }
  };

  const addPhoto = async (id: string, file: File) => {
    if (!supabase || !allowed) return;

    const ext = file.name.split('.').pop() || 'jpg';
    const path = `${id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from('apartment-photos')
      .upload(path, file, { upsert: false });

    if (error) {
      setNotice(error.message);
      return;
    }

    const { data } = supabase.storage.from('apartment-photos').getPublicUrl(path);

    setApartments(cur => cur.map(a => a.id === id ? {
      ...a,
      photos: [...a.photos, {
        src: data.publicUrl,
        label: file.name.replace(/\.[^.]+$/, ''),
        alt: a.title + ' ' + file.name
      }]
    } : a));
  };

  const nav: [Page, string][] = [
    ['home', 'Home'],
    ['about', 'About Us'],
    ['apartments', 'Apartments'],
    ['contact', 'Contact Us'],
    ['login', 'Admin Login']
  ];

  const allPhotos = apartments.flatMap(a => a.photos);

  return (
    <div className={`shell page-${page}`}>
      <div className="topline">
        {motto.toUpperCase()}
        <span>Luxury serviced apartments</span>
      </div>

      <header>
        <button className="logo" onClick={() => go('home')}>
          <img src="/resources/boujeelux-logo.png" alt="BOUJEE Luxury Apartments" />
        </button>

        <button className="hamb" onClick={() => setMenu(!menu)}>
          {menu ? <X /> : <Menu />}
        </button>

        <nav className={menu ? 'open' : ''}>
          {nav.map(([p, l]) =>
            <button className={page === p ? 'active' : ''} key={p} onClick={() => go(p)}>
              {l}
            </button>
          )}
          <a href={wa} target="_blank" rel="noreferrer">
            Book a stay <ArrowUpRight size={15} />
          </a>
        </nav>
      </header>

      {page === 'home' && <main>
        <section className="hero">
          <img
            className="hero-image"
            src="/resources/block-1-living-room.jpg"
            alt="BOUJEELUX luxury apartment living room"
          />
          <div className="shade" />

          <div className="heroText">
            <small>{motto.toUpperCase()}</small>
            <h1>Luxury. Comfort.<br />Privacy.</h1>
            <p>Your perfect home away from home.</p>
            <button className="gold" onClick={() => go('apartments')}>
              Explore Apartments <ArrowRight size={17} />
            </button>
          </div>

          <div className="stamp">
            BOUJEE<br />
            <b>LIVING</b><br />
            MADE SIMPLE
          </div>
        </section>

        <section className="intro">
          <div>
            <small>THE BOUJEELUX EXPERIENCE</small>
            <h2>More than a place to sleep.</h2>
          </div>
          <p>Choose from our three serviced apartment options: Grandeur, Prestige and our stylish Studio Apartment. Enjoy comfort, privacy and thoughtful hospitality.</p>
        </section>

        <section className="home-gallery">
          <div className="gallery-heading">
            <small>{motto.toUpperCase()}</small>
            <h2>Spaces made for <em>living beautifully.</em></h2>
            <p>A glimpse of the comfort, style and welcoming spaces waiting for you.</p>
          </div>

          <div className="home-gallery-grid">
            {apartments.flatMap(a => a.photos.slice(0, 3)).slice(0, 8).map((p, i) =>
              <figure className={i === 0 ? 'gallery-large' : ''} key={p.id || p.src + i}>
                <img src={p.src} alt={p.alt} />
                <figcaption>{p.label}</figcaption>
              </figure>
            )}
          </div>
        </section>

        <section className="features">
          <img src="/resources/block-1-bedroom.jpg" alt="Grandeur bedroom" />
          <div>
            <small>YOUR PRIVATE RETREAT</small>
            <h2>Space to relax.<br /><em>Room to enjoy.</em></h2>
            <p>From inviting bedrooms to welcoming lounges, explore the real spaces waiting for you at BOUJEELUX.</p>
            <button onClick={() => go('apartments')}>
              View our apartments <ArrowRight size={17} />
            </button>
          </div>
          <img src="/resources/block-2-parlour.jpg" alt="Prestige parlour" />
        </section>

        <section className="home-experience">
          <div className="gallery-heading">
            <small>MORE TO LOOK FORWARD TO</small>
            <h2>Entertainment & <em>recreation.</em></h2>
            <p>More ways to relax, play and enjoy your time with us.</p>
          </div>

          <div className="coming-soon">
            {entertainment.map((item, i) =>
              <div className="coming-card" key={item}>
                <div className="coming-icon">
                  {i === 3 ? <Music /> : i === 4 || i === 5 ? <Trophy /> : i === 2 ? <Sparkles /> : i === 1 ? <Heart /> : <Gamepad2 />}
                </div>
                <h3>{item}</h3>
                <span>COMING SOON</span>
              </div>
            )}
          </div>
        </section>

        <section className="callout">
          <h2>Find your kind<br />of <em>comfort.</em></h2>
          <button onClick={() => go('apartments')}>
            See apartments & rates <ArrowRight size={17} />
          </button>
        </section>
      </main>}

      {page === 'about' && <main>
        <section className="pagehead">
          <small>A LITTLE ABOUT US</small>
          <h1>Welcome to<br /><em>your happy place.</em></h1>
          <p>Comfort-led serviced apartments for stays worth remembering.</p>
        </section>

        <section className="story">
          <h2>Hospitality, with<br /><em>a personal touch.</em></h2>
          <p>BOUJEELUX Luxury Apartments is built around a simple idea: a stay should feel welcoming from the moment you arrive. We offer thoughtfully presented apartment spaces where guests can unwind, spend time together and enjoy the freedom of a home away from home.</p>
        </section>

        <section className="about-gallery">
          <div className="gallery-heading">
            <small>INSIDE BOUJEELUX</small>
            <h2>Comfort in every <em>detail.</em></h2>
          </div>
          <div className="about-gallery-grid">
            {apartments.flatMap(a => a.photos.slice(3, 5)).slice(0, 6).map((p, i) =>
              <figure key={p.id || p.src + i}>
                <img src={p.src} alt={p.alt} />
                <figcaption>{p.label}</figcaption>
              </figure>
            )}
          </div>
        </section>

        <section className="values">
          <div><Sparkles /><h3>Thoughtful comfort</h3><p>Spaces prepared to help you settle in and feel at ease.</p></div>
          <div><ShieldCheck /><h3>Privacy & peace</h3><p>A welcoming setting for your own time and together time.</p></div>
          <div><Heart /><h3>Warm hospitality</h3><p>Friendly support from enquiry through your stay.</p></div>
        </section>
      </main>}

      {page === 'apartments' && <main>
        <section className="pagehead">
          <small>STAY YOUR WAY</small>
          <h1>Our <em>apartments.</em></h1>
          <p>Explore all three BOUJEELUX serviced apartments: Grandeur, Prestige and our Studio Apartment.</p>
          <div className="discount">✨ Stay 7 nights or more and enjoy 10% off</div>
        </section>

        <section className="list">
          {apartments.map(a => <article key={a.id}>
            <div className="details">
              <small>BOUJEELUX • {a.title.toUpperCase()}</small>
              <h2>{a.title}</h2>
              <p>{a.detail}</p>
              <div className="price">{money(a.nightly)} {a.nightly > 0 && <small>/ night</small>}</div>
              {a.nightly > 0 && <p>Weekly rate after 10% discount: <b>{money(Math.round(a.nightly * .9))} / night</b></p>}
              <button onClick={() => { setChoice(a.title); go('contact'); }}>
                Enquire about this apartment <ArrowRight size={16} />
              </button>
            </div>

            <div className="photos">
              {a.photos.map((p, j) => <figure className={j === 0 ? 'main' : ''} key={p.id || p.src + j}>
                <img src={p.src} alt={p.alt} />
                <figcaption>{p.label}</figcaption>
              </figure>)}
            </div>
          </article>)}
        </section>
      </main>}

      {page === 'contact' && <main>
        <section className="pagehead">
          <small>WE WOULD LOVE TO HEAR FROM YOU</small>
          <h1>Let's plan your<br /><em>next stay.</em></h1>
          <p>Ask about availability, apartment options, rates or anything you need before booking.</p>
        </section>

        <section className="contact">
          <div>
            <a href={`mailto:${bookingEmail}`}><Mail /> {bookingEmail}</a>
            <a href={`mailto:${email}`}><Mail /> {email}</a>
            <a href={wa} target="_blank" rel="noreferrer"><Phone /> WhatsApp bookings</a>
            <a href={whatsappNumber} target="_blank" rel="noreferrer"><Phone /> WhatsApp: {phoneNumber}</a>
            <a href={tiktok} target="_blank" rel="noreferrer">♪ @boujeelux.service</a>
            <a href={mapUrl} target="_blank" rel="noreferrer"><MapPin /> View our location</a>

            <div className="bank">
              <small>BANK TRANSFER DETAILS</small>
              <h3>Boujeelux Apartment</h3>
              Baobab Microfinance Bank<br />
              Account number: <b>1002485658</b>
              <p>Please confirm your reservation and payment instructions with our team before transferring.</p>
            </div>
          </div>

          <div className="enquiry">
            <small>SEND A BOOKING ENQUIRY</small>
            <h2>Tell us about<br /><em>your stay.</em></h2>

            <label>Your name
              <input value={guest} onChange={e => setGuest(e.target.value)} placeholder="Full name" />
            </label>

            <label>Apartment
              <select value={choice} onChange={e => setChoice(e.target.value)}>
                {apartments.map(a => <option key={a.id}>{a.title}</option>)}
              </select>
            </label>

            <label>Number of guests
              <input type="number" min="1" max="30" value={count} onChange={e => setCount(e.target.value)} />
            </label>

            <button onClick={book}>Continue on WhatsApp <ArrowUpRight /></button>
            <small>Your enquiry opens our WhatsApp booking conversation at {phoneNumber}.</small>
          </div>
        </section>

        <section className="contact-gallery">
          <div className="gallery-heading">
            <small>YOUR BOUJEELUX STAY</small>
            <h2>A little look at <em>your next stay.</em></h2>
          </div>
          <div className="contact-gallery-grid">
            {apartments.flatMap(a => a.photos.slice(5, 6)).slice(0, 3).map((p, i) =>
              <figure key={p.id || p.src + i}>
                <img src={p.src} alt={p.alt} />
              </figure>
            )}
          </div>
        </section>
      </main>}

      {page === 'login' && <main className="admin">
        <section className="pagehead">
          <small>BOUJEELUX MANAGEMENT</small>
          <h1>Apartment <em>admin.</em></h1>
          <p>Only the authorised BOUJEELUX admin account can manage apartment listings and photos.</p>
        </section>

        <section className="adminbox">
          {!supabaseReady && <p>Supabase settings are not configured yet. Add the project URL and publishable key before deploying.</p>}

          {!user && <div>
            <LockKeyhole />
            <h2>Admin sign in</h2>
            <p>A secure sign-in link will be sent to {adminEmail}.</p>
            <button disabled={!supabase || busy} onClick={login}>
              {busy ? 'Sending…' : 'Send admin sign-in link'}
            </button>
          </div>}

          {user && !allowed && <p>This account is not authorised. Sign out and use the BOUJEELUX admin email.</p>}

          {allowed && <>
            <div className="adminTop">
              <h2>Manage apartments & photos</h2>
              <button className="plain" onClick={() => supabase?.auth.signOut()}>Sign out</button>
            </div>

            <p>Add or edit all three apartment listings, prices, photos and labels. Changes appear on the public Apartments page.</p>

            {apartments.map(a => <div className="edit" key={a.id}>
              <label>Apartment name
                <input value={a.title} onChange={e => setApartments(cur => cur.map(x => x.id === a.id ? { ...x, title: e.target.value } : x))} />
              </label>

              <label>Description
                <input value={a.detail} onChange={e => setApartments(cur => cur.map(x => x.id === a.id ? { ...x, detail: e.target.value } : x))} />
              </label>

              <label>Nightly price (₦)
                <input type="number" min="0" value={a.nightly} onChange={e => setApartments(cur => cur.map(x => x.id === a.id ? { ...x, nightly: Number(e.target.value) } : x))} />
              </label>

              <strong>Photos and labels</strong>

              {a.photos.map((p, j) => <div className="photoEdit" key={p.id || p.src + j}>
                <img src={p.src} alt={p.label} />
                <input value={p.label} aria-label="Photo label" onChange={e => setApartments(cur => cur.map(x => x.id === a.id ? { ...x, photos: x.photos.map((z, k) => k === j ? { ...z, label: e.target.value, alt: a.title + ' ' + e.target.value } : z) } : x))} />
                <button className="plain" onClick={() => setApartments(cur => cur.map(x => x.id === a.id ? { ...x, photos: x.photos.filter((_, k) => k !== j) } : x))}>
                  <Trash2 size={16} /> Remove
                </button>
              </div>)}

              <label className="upload">
                <Upload size={16} /> Upload photo
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) addPhoto(a.id, f);
                  e.currentTarget.value = '';
                }} />
              </label>
            </div>)}

            <button onClick={() => setApartments(cur => [...cur, {
              id: 'apt-' + Date.now(),
              title: 'New Apartment',
              detail: 'Add apartment details',
              nightly: 1,
              photos: []
            }])}>
              <Plus size={16} /> Add apartment
            </button>

            <button disabled={busy} onClick={save}>
              {busy ? 'Saving…' : 'Save all apartment changes'}
            </button>
          </>}

        </section>

        {notice && <p className="notice">{notice}</p>}
      </main>}

      <footer>
        <div>
          <img src="/resources/boujeelux-logo.png" alt="BOUJEELUX logo" />
          <p>{motto} Luxury serviced apartments for comfort, connection and memorable stays.</p>
        </div>

        <div>
          <b>EXPLORE</b>
          {nav.map(([p, l]) => <button key={p} onClick={() => go(p)}>{l}</button>)}
        </div>

        <div>
          <b>GET IN TOUCH</b>
          <a href={`mailto:${bookingEmail}`}>{bookingEmail}</a>
          <a href={`mailto:${email}`}>{email}</a>
          <a href={wa}>Existing WhatsApp booking link</a>
          <a href={whatsappNumber}>WhatsApp: {phoneNumber}</a>
          <a href={mapUrl}>Our location</a>
          <a href={tiktok}>@boujeelux.service</a>
        </div>

        <small>© {new Date().getFullYear()} BOUJEELUX Luxury Apartments</small>
      </footer>
    </div>
  );
}

export default App;
