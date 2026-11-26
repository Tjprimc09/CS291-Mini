export default function Features() {
    return (
                <section className="features" aria-label="Graph features">
          <article className="feature">
            <h3>Explore the network</h3>
            <p>Select airports and discover their connections.</p>
          </article>

          <article className="feature">
            <h3>Find shortest paths</h3>
            <p>Calculate paths using Dijkstra’s algorithm.</p>
          </article>

          <article className="feature">
            <h3>Filter by state</h3>
            <p>Focus on airports within a selected state.</p>
          </article>
        </section>
    )
}