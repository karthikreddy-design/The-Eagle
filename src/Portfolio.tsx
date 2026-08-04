import { useEffect, useState } from "react";

const BrandMark = ({ size = 26 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
    <path d="M12 2c-1 2-3 3-5 3 1 2 1 4 0 6 2-1 4-1 5 1 1-2 3-2 5-1-1-2-1-4 0-6-2 0-4-1-5-3z" />
  </svg>
);

const NAV_LINKS = [
  { href: "#overview", label: "Overview" },
  { href: "#anatomy", label: "Anatomy" },
  { href: "#species", label: "Species" },
  { href: "#lifecycle", label: "Life Cycle" },
  { href: "#diet", label: "Diet" },
  { href: "#conservation", label: "Conservation" },
  { href: "#gallery", label: "In Motion" },
] as const;

export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="portfolio">
      <div className="noise" aria-hidden="true" />

      <nav>
        <a href="#top" className="brand" onClick={closeMenu}>
          <BrandMark />
          HALIAEETUS
        </a>
        <button
          type="button"
          className={`nav-toggle${menuOpen ? " is-open" : ""}`}
          aria-expanded={menuOpen}
          aria-controls="site-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
        <div
          id="site-nav"
          className={`nav-links${menuOpen ? " is-open" : ""}`}
        >
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={closeMenu}>
              {link.label}
            </a>
          ))}
        </div>
      </nav>
      {menuOpen ? (
        <button
          type="button"
          className="nav-backdrop"
          aria-label="Close menu"
          onClick={closeMenu}
        />
      ) : null}

      <section className="hero" id="top">
        <div className="hero-content">
          <span className="eyebrow">Kingdom Animalia · Family Accipitridae</span>
          <h1>
            Ruler of the
            <br />
            <em>Open Sky</em>
          </h1>
          <p className="hero-sub">
            A field portfolio on the eagle — the sharpest-eyed, highest-flying,
            and most fiercely territorial hunter in the bird world.
          </p>
          <div className="hero-tags">
            <div className="tag">
              <b>60+</b>species worldwide
            </div>
            <div className="tag">
              <b>7,000 ft</b>typical hunting altitude
            </div>
            <div className="tag">
              <b>4-8x</b>sharper eyesight than humans
            </div>
          </div>
        </div>
        <div className="scroll-cue">
          <div className="line" />
          Scroll
        </div>
      </section>

      <section id="overview">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">01 — Overview</span>
            <h2>What exactly is an eagle?</h2>
            <p>
              Eagles are large birds of prey defined by powerful builds, broad
              wings, and hooked beaks built for tearing flesh. They occupy the
              very top of the food chain in nearly every habitat they inhabit —
              forests, mountains, wetlands, and coastlines alike.
            </p>
          </div>
          <div className="tax-grid">
            <div className="glass tax-card">
              <span className="k">Scientific Family</span>
              <span className="v">Accipitridae</span>
            </div>
            <div className="glass tax-card">
              <span className="k">Lifespan (wild)</span>
              <span className="v">20 – 30 years</span>
            </div>
            <div className="glass tax-card">
              <span className="k">Wingspan</span>
              <span className="v">1.8 – 2.3 metres</span>
            </div>
            <div className="glass tax-card">
              <span className="k">Weight</span>
              <span className="v">3 – 6.5 kilograms</span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap tight">
          <div className="stat-grid">
            <div className="glass stat-card">
              <div className="num">160 km/h</div>
              <div className="label">
                Maximum diving speed during a hunting strike
              </div>
            </div>
            <div className="glass stat-card">
              <div className="num">3.2 km</div>
              <div className="label">
                Distance an eagle can spot a rabbit-sized animal
              </div>
            </div>
            <div className="glass stat-card">
              <div className="num">10,000+</div>
              <div className="label">
                Feathers covering an adult eagle&apos;s body
              </div>
            </div>
            <div className="glass stat-card">
              <div className="num">15 kg</div>
              <div className="label">
                Approximate carrying capacity in flight
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="anatomy">
        <div className="wrap">
          <div className="prose">
            <span className="eyebrow">02 — Anatomy</span>
            <h2>Built like a living weapon</h2>
            <p>
              Every part of an eagle&apos;s body is refined for aerial
              dominance. <b>Talons</b> can clamp down with roughly ten times the
              grip force of a human hand, locking onto prey mid-strike without a
              second thought.
            </p>
            <p>
              The <b>hooked beak</b> is not used to kill — it&apos;s a precision
              tool for tearing meat, feathers, and hide once prey has already
              been subdued by the feet.
            </p>
            <p>
              Beneath the plumage, a <b>keel-shaped breastbone</b> anchors flight
              muscles that make up nearly a third of total body weight, giving
              eagles the power to carry prey heavier than themselves.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap tight">
          <div className="prose">
            <span className="eyebrow">03 — The Eye</span>
            <h2>Vision sharper than any lens</h2>
            <p>
              An eagle&apos;s eye is nearly the same size as a human&apos;s, yet
              it delivers <b>four to eight times</b> the visual acuity. A dense
              concentration of light-sensitive cells and a deep central fovea let
              it resolve fine detail across immense distances.
            </p>
            <p>
              A <b>nictitating membrane</b> — a translucent third eyelid —
              sweeps across the eye to clear debris mid-flight without ever
              losing sight of the target below.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">04 — Signature Traits</span>
            <h2>Five things that define an eagle</h2>
          </div>
          <div className="feature-grid">
            <div className="glass feature-card">
              <div className="icon">
                <svg viewBox="0 0 24 24">
                  <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h3>Telescopic Eyesight</h3>
              <p>
                Can spot a moving hare from over three kilometres away while
                circling on a thermal current.
              </p>
            </div>
            <div className="glass feature-card">
              <div className="icon">
                <svg viewBox="0 0 24 24">
                  <path d="M4 16l6-10 6 6 4-8" />
                </svg>
              </div>
              <h3>Broad Soaring Wings</h3>
              <p>
                Long, deeply fingered flight feathers reduce drag, letting
                eagles glide for hours on rising air with barely a wingbeat.
              </p>
            </div>
            <div className="glass feature-card">
              <div className="icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2v20M5 9l7-7 7 7M5 15l7 7 7-7" />
                </svg>
              </div>
              <h3>Vice-Grip Talons</h3>
              <p>
                Four curved talons per foot lock into a fixed grip strong enough
                to crush bone on impact.
              </p>
            </div>
            <div className="glass feature-card">
              <div className="icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 21s-7-4.35-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.65-9 9-9 9z" />
                </svg>
              </div>
              <h3>Lifelong Pair Bonds</h3>
              <p>
                Most species mate for life, returning to the same nesting
                territory year after year.
              </p>
            </div>
            <div className="glass feature-card">
              <div className="icon">
                <svg viewBox="0 0 24 24">
                  <path d="M3 21l6-6M3 21v-6h6M21 3l-6 6M21 3h-6v6" />
                </svg>
              </div>
              <h3>Fortress Nests</h3>
              <p>
                Eyries built from branches are reused and expanded annually,
                some growing to over a tonne in weight.
              </p>
            </div>
            <div className="glass feature-card">
              <div className="icon">
                <svg viewBox="0 0 24 24">
                  <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
                </svg>
              </div>
              <h3>Explosive Dives</h3>
              <p>
                Species like the golden eagle exceed 240 km/h in a full hunting
                dive — among the fastest animals alive.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="species">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">05 — Species Spotlight</span>
            <h2>Three eagles, three continents</h2>
            <p>
              Of the roughly 60 recognised species, these three are the most
              iconic representatives of the family — each shaped by a very
              different home range.
            </p>
          </div>
          <div className="species-grid">
            <div className="glass species-card">
              <div className="body">
                <span className="region">North America</span>
                <h3>Bald Eagle</h3>
                <p>
                  Haliaeetus leucocephalus. A fish-hunting specialist and the
                  national bird of the United States, recognised instantly by
                  its white head and tail.
                </p>
              </div>
            </div>
            <div className="glass species-card">
              <div className="body">
                <span className="region">Coastal Alaska</span>
                <h3>Sea Eagle</h3>
                <p>
                  Haliaeetus species thrive along coastlines and river deltas,
                  snatching salmon straight from the water&apos;s surface in a
                  low, fast pass.
                </p>
              </div>
            </div>
            <div className="glass species-card">
              <div className="body">
                <span className="region">Northern Wetlands</span>
                <h3>Golden Eagle Kin</h3>
                <p>
                  Found across Eurasia and North America&apos;s mountains, this
                  highland hunter takes prey as large as young deer in open,
                  treeless terrain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="lifecycle">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">06 — Life Cycle</span>
            <h2>From hatchling to apex hunter</h2>
          </div>
          <div className="timeline">
            <div className="glass tl-card">
              <div className="stage">I</div>
              <h4>Egg &amp; Incubation</h4>
              <p>
                1–3 eggs laid per clutch, incubated for roughly 35 days by both
                parents in shifts.
              </p>
            </div>
            <div className="glass tl-card">
              <div className="stage">II</div>
              <h4>Nestling</h4>
              <p>
                Chicks are fed torn scraps of meat by parents and grow flight
                feathers over 10–12 weeks.
              </p>
            </div>
            <div className="glass tl-card">
              <div className="stage">III</div>
              <h4>Fledgling</h4>
              <p>
                First flights are clumsy and short-range; young eagles practise
                landings for several weeks nearby.
              </p>
            </div>
            <div className="glass tl-card">
              <div className="stage">IV</div>
              <h4>Maturity</h4>
              <p>
                Full adult plumage and breeding readiness typically arrive
                between four and six years of age.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="diet">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">07 — Diet &amp; Hunting</span>
            <h2>An opportunistic apex hunter</h2>
            <p>
              Diet varies heavily by species and season, but most eagles favour
              live prey over carrion when it&apos;s available.
            </p>
          </div>
          <div className="diet-grid">
            <div className="glass diet-row">
              <span className="name">Fish</span>
              <div className="pct-wrap">
                <div className="pct" style={{ width: "70%" }} />
              </div>
              <span className="num">70%</span>
            </div>
            <div className="glass diet-row">
              <span className="name">Small Mammals</span>
              <div className="pct-wrap">
                <div className="pct" style={{ width: "55%" }} />
              </div>
              <span className="num">55%</span>
            </div>
            <div className="glass diet-row">
              <span className="name">Waterfowl &amp; Birds</span>
              <div className="pct-wrap">
                <div className="pct" style={{ width: "40%" }} />
              </div>
              <span className="num">40%</span>
            </div>
            <div className="glass diet-row">
              <span className="name">Carrion (scavenged)</span>
              <div className="pct-wrap">
                <div className="pct" style={{ width: "25%" }} />
              </div>
              <span className="num">25%</span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap tight quote-block">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 17h3l2-4V7H6v6h3l-2 4zm8 0h3l2-4V7h-6v6h3l-2 4z" />
          </svg>
          <blockquote>
            &ldquo;The eagle does not fly with the flock — it is always alone in
            the vastness of its own domain, watching from a height nothing else
            dares to reach.&rdquo;
          </blockquote>
          <cite>Field Notes on Raptor Behaviour</cite>
        </div>
      </section>

      <section id="conservation">
        <div className="wrap tight">
          <div className="glass conservation">
            <span className="status-badge">
              ● Recovering — Least Concern (most species)
            </span>
            <h2>Once endangered, now a conservation success story</h2>
            <p>
              Pesticide contamination and habitat loss pushed several eagle
              species to the brink in the 20th century. Legal protection,
              breeding programmes, and banning harmful pesticides brought many
              populations, including the bald eagle, back from near-extinction
              over the following decades.
            </p>
          </div>
        </div>
      </section>

      <section id="gallery">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">08 — In Motion</span>
            <h2>Watch the hunt unfold</h2>
            <p>
              The full-bleed sequence behind this page is the gallery — scroll
              to move through the strike, frame by frame, until the final dive
              meets the last line of the portfolio.
            </p>
          </div>
        </div>
      </section>

      <footer>
        <div className="brand">
          <BrandMark size={20} />
          HALIAEETUS
        </div>
        <div className="fnote">
          A field portfolio on the eagle · Images courtesy of Wikimedia Commons
          contributors
        </div>
      </footer>
    </div>
  );
}
