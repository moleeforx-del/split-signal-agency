import InteractiveLines from "./InteractiveLines";

const Arrow = () => <span aria-hidden="true">↗</span>;

export default function Home() {
  return (
    <main>
      <section className="hero" id="top">
        <InteractiveLines />
        <nav className="nav" aria-label="Main navigation">
          <a className="brand" href="#top" aria-label="Split Signal home">
            SPLIT<span>/</span>SIGNAL
          </a>
          <div className="nav-links">
            <a href="#work">Work</a>
            <a href="#studio">Studio</a>
          </div>
          <a className="nav-cta" href="mailto:hello@splitsignal.agency">
            Start a project <Arrow />
          </a>
        </nav>

        <div className="hero-copy">
          <p className="eyebrow"><span>01</span> Independent creative agency</p>
          <h1>WE MAKE<br />BRANDS <em>MOVE.</em></h1>
          <div className="hero-bottom">
            <p className="intro">
              Strategy, identity, and digital experiences for ambitious teams
              ready to become impossible to ignore.
            </p>
            <a className="round-link" href="#work" aria-label="Explore selected work">
              <Arrow />
            </a>
          </div>
        </div>

        <div className="edge-note">Scroll to see the shift <span>↓</span></div>
      </section>

      <section className="proof" id="work">
        <p>Trusted by teams building what’s next</p>
        <div className="logos" aria-label="Selected clients">
          <span>ARC'TERYX</span><span>NOTION</span><span>VANS</span><span>airbnb</span><span>SONOS</span>
        </div>
      </section>

    </main>
  );
}
