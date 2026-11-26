export default function Hero() {
    return (
        <section id="home" className="hero">
          <div className="hero-content">
            <p className="eyebrow">
              <span /> GRAPH THEORY × AVIATION
            </p>

            <h1>Sky<span>Mesh</span></h1>

            <h2>
              Explore America’s airport network through graph theory.
            </h2>

            <p className="hero-description">
              Visualize airport connections, discover efficient paths,
              and explore the structure of a connected network.
            </p>

            <div className="hero-actions">
              <a className="button primary" href="#graph">
                Interact with Graph <span aria-hidden="true">→</span>
              </a>

              <a className="button secondary" href="#project">
                Explore the Project <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          <div className="hero-space" aria-hidden="true" />
        </section>
    )
}