export default function Header() {
    return (
    <header className="site-header">
        <a className="brand" href="#home" aria-label="SkyMesh home">
          <span className="brand-symbol" aria-hidden="true">✈</span>
          Sky<span>Mesh</span>
        </a>

        <nav aria-label="Main navigation">
          <a href="#home">Home</a>
          <a href="#graph">Graph</a>
          <a href="#project">Project</a>
        </nav>
    </header>
    )
}