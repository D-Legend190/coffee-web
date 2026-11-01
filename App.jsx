import { useState, useEffect } from "react";

const img = (id, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const PHOTOS = {
  hero: "photo-1495474472287-4d71bcdd2085",
  latte: "photo-1514432324607-a09d9b4aefdd",
  beans: "photo-1447933601403-0c6688de566e",
  pour: "photo-1509042239860-f550ce710b93",
  shop: "photo-1501339847302-ac426a4a7cbb",
  cafe: "photo-1521017432531-fbd92d768814",
  cup: "photo-1497935586351-b67a49e012bf",
  brew: "photo-1442512595331-e89e73853f31",
  bar: "photo-1559496417-e7f25cb247f3",
};

const MENU = [
  { id: 1, name: "Flat White", cat: "Espresso", price: 4.5, photo: PHOTOS.latte, note: "Double ristretto, silky steamed milk." },
  { id: 2, name: "Espresso", cat: "Espresso", price: 3, photo: PHOTOS.cup, note: "Dark chocolate, orange peel, long finish." },
  { id: 3, name: "Cappuccino", cat: "Espresso", price: 4.25, photo: PHOTOS.hero, note: "Equal parts espresso, milk and foam." },
  { id: 4, name: "V60 Pour Over", cat: "Filter", price: 5.5, photo: PHOTOS.pour, note: "Single origin, brewed to order." },
  { id: 5, name: "Batch Brew", cat: "Filter", price: 3.5, photo: PHOTOS.brew, note: "Today's house filter, refills half price." },
  { id: 6, name: "Cold Brew", cat: "Cold", price: 5, photo: PHOTOS.bar, note: "Steeped 18 hours, served over ice." },
  { id: 7, name: "Iced Latte", cat: "Cold", price: 4.75, photo: PHOTOS.cafe, note: "Espresso poured over cold milk and ice." },
  { id: 8, name: "Whole Bean 250g", cat: "Beans", price: 14, photo: PHOTOS.beans, note: "Roasted this week. Ask us how to brew it." },
];

const CATS = ["All", "Espresso", "Filter", "Cold", "Beans"];
const money = (n) => `$${n.toFixed(2)}`;

function Photo({ id, w, alt, className }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className={`photo-fallback ${className || ""}`} role="img" aria-label={alt} />;
  return <img className={className} src={img(id, w)} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
}

export default function App() {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cat, setCat] = useState("All");
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const add = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const change = (id, d) =>
    setCart((c) => {
      const q = (c[id] || 0) + d;
      const next = { ...c };
      if (q <= 0) delete next[id];
      else next[id] = q;
      return next;
    });

  const lines = Object.entries(cart).map(([id, qty]) => ({ item: MENU.find((m) => m.id === +id), qty }));
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const total = lines.reduce((s, l) => s + l.qty * l.item.price, 0);
  const shown = cat === "All" ? MENU : MENU.filter((m) => m.cat === cat);
  const go = () => setNavOpen(false);

  return (
    <>
      <header className={`nav ${scrolled ? "nav--solid" : ""}`}>
        <a href="#top" className="logo">Ember &amp; Bean</a>
        <nav className={`links ${navOpen ? "links--open" : ""}`}>
          <a href="#menu" onClick={go}>Menu</a>
          <a href="#story" onClick={go}>Our story</a>
          <a href="#gallery" onClick={go}>Gallery</a>
          <a href="#visit" onClick={go}>Visit</a>
        </nav>
        <div className="nav-actions">
          <button className="cart-btn" onClick={() => setCartOpen(true)} aria-label={`Open cart, ${count} items`}>
            Cart <span className="badge">{count}</span>
          </button>
          <button className="burger" onClick={() => setNavOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={navOpen}>
            <span /><span /><span />
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <Photo id={PHOTOS.hero} w={1800} alt="A cappuccino with latte art on a wooden table" className="hero-img" />
          <div className="hero-shade" />
          <div className="hero-copy">
            <h1>Roasted small. Poured slow.</h1>
            <p>Single-origin coffee roasted every Tuesday and Friday, served in the same building.</p>
            <div className="hero-cta">
              <a className="btn btn--primary" href="#menu">Order a coffee</a>
              <a className="btn btn--ghost" href="#story">Meet the roasters</a>
            </div>
          </div>
        </section>

        <section id="menu" className="section">
          <div className="section-head">
            <h2>What we're pouring</h2>
            <div className="tabs" role="tablist">
              {CATS.map((c) => (
                <button key={c} role="tab" aria-selected={cat === c} className={`tab ${cat === c ? "tab--on" : ""}`} onClick={() => setCat(c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="grid">
            {shown.map((m) => (
              <article className="card" key={m.id}>
                <div className="card-img"><Photo id={m.photo} w={700} alt={m.name} /></div>
                <div className="card-body">
                  <div className="card-top">
                    <h3>{m.name}</h3>
                    <span className="price">{money(m.price)}</span>
                  </div>
                  <p>{m.note}</p>
                  <button className="btn btn--small" onClick={() => { add(m.id); }}>
                    {cart[m.id] ? `Add another (${cart[m.id]})` : "Add to cart"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="story" className="story">
          <Photo id={PHOTOS.beans} w={1000} alt="Freshly roasted coffee beans" className="story-img" />
          <div className="story-copy">
            <h2>We buy directly from farms we've visited.</h2>
            <p>
              Ember &amp; Bean started with one second-hand roaster and a rule: if we can't name the farmer, we don't
              buy the coffee. Today we work with nine producers in Ethiopia, Colombia and Guatemala, and pay above
              Fairtrade minimums.
            </p>
            <p>Every bag shows the roast date, the farm and the altitude, so you know exactly what's in your cup.</p>
            <dl className="facts">
              <div><dt>9</dt><dd>partner farms</dd></div>
              <div><dt>2×</dt><dd>roasts a week</dd></div>
              <div><dt>48h</dt><dd>from roast to shelf</dd></div>
            </dl>
          </div>
        </section>

        <section id="gallery" className="section">
          <h2>Inside the shop</h2>
          <div className="gallery">
            {[PHOTOS.shop, PHOTOS.pour, PHOTOS.cafe, PHOTOS.bar, PHOTOS.latte].map((p, i) => (
              <Photo key={p} id={p} w={800} alt={`Ember & Bean photo ${i + 1}`} className={`g g${i + 1}`} />
            ))}
          </div>
        </section>

        <section id="visit" className="visit">
          <div className="visit-info">
            <h2>Come say hello</h2>
            <p>14 Mill Lane, Old Market<br />Monday to Friday 7:00 – 18:00<br />Saturday and Sunday 8:00 – 17:00</p>
            <p>hello@emberandbean.example</p>
          </div>
          <form className="form" onSubmit={(e) => { e.preventDefault(); setSent(true); e.target.reset(); }}>
            <label>Name<input required name="name" autoComplete="name" /></label>
            <label>Email<input required type="email" name="email" autoComplete="email" /></label>
            <label>Message<textarea required name="msg" rows="4" /></label>
            <button className="btn btn--primary" type="submit">Send message</button>
            {sent && <p className="sent" role="status">Message sent. We'll reply within a day.</p>}
          </form>
        </section>
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Ember &amp; Bean Coffee Roasters</span>
        <a href="#top">Back to top</a>
      </footer>

      <div className={`overlay ${cartOpen ? "overlay--on" : ""}`} onClick={() => setCartOpen(false)} />
      <aside className={`drawer ${cartOpen ? "drawer--open" : ""}`} aria-hidden={!cartOpen}>
        <div className="drawer-head">
          <h3>Your order</h3>
          <button onClick={() => setCartOpen(false)} aria-label="Close cart">✕</button>
        </div>
        {lines.length === 0 ? (
          <p className="empty">Your cart is empty. Pick something from the menu.</p>
        ) : (
          <>
            <ul className="lines">
              {lines.map(({ item, qty }) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{money(item.price)}</span>
                  </div>
                  <div className="qty">
                    <button onClick={() => change(item.id, -1)} aria-label={`Remove one ${item.name}`}>−</button>
                    <span>{qty}</span>
                    <button onClick={() => change(item.id, 1)} aria-label={`Add one ${item.name}`}>+</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="total"><span>Total</span><strong>{money(total)}</strong></div>
            <button className="btn btn--primary btn--full" onClick={() => { setCart({}); setCartOpen(false); }}>
              Place order
            </button>
          </>
        )}
      </aside>
    </>
  );
}