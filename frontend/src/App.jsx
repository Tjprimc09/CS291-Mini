
import { useEffect, useRef, useState } from 'react'
import cytoscape from 'cytoscape'
import './App.css'

async function getData(url, signal) {
  const response = await fetch(url, { signal })
  const data = await response.json().catch(() => null)

  if (!response.ok || !data) {
    throw new Error(data?.error || `Request failed (${response.status}). Check the Flask server and Vite proxy.`)
  }

  return data
}

function App() {
  const graphContainer = useRef(null)
  const graph = useRef(null)
  const pending = useRef(null)
  const [network, setNetwork] = useState(null)
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [state, setState] = useState('')
  const [hovered, setHovered] = useState(null)
  const [clickedNodes, setClickedNodes] = useState([])
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)

  const selection = useRef({ start: '', end: '' })
  selection.current = { start, end }

  // Load the complete network once from Flask.
  useEffect(() => {
    const controller = new AbortController()

    getData('/graph-data', controller.signal)
      .then(setNetwork)
      .catch(err => {
        if (!controller.signal.aborted) setError(err.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => {
      controller.abort()
      pending.current?.abort()
    }
  }, [])

  // Cytoscape renders the graph using the positions exported from Gephi.
  useEffect(() => {
    if (!network || !graphContainer.current) return

    const elements = [
      ...network.nodes.map(node => ({
        data: {
          id: node.id,
          label: node.label,
          state: node.state || ''
        },
        position: {
          x: Number(node.x) || 0,
          y: Number(node.y) || 0
        },
      })),
      ...network.edges.map((edge, i) => ({
        data: {
          id: `edge-${i}`,
          source: edge.source,
          target: edge.target
        },
      })),
    ]

    const cy = cytoscape({
      container: graphContainer.current,
      elements,
      layout: {
        name: network.nodes.every(n => Number.isFinite(n.x) && Number.isFinite(n.y)) ? 'preset' : 'circle',
        spacingFactor: 200,
        fit: true,
        padding: 45
      },
      minZoom: 0.000001,
      maxZoom: 1000,
      autoungrabify: true,

      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#071B40',
            'border-width': 3,
            'border-color': '#0599d8',
            'underlay-color': '#0599D8',
            'underlay-opacity': 0.25,
            'underlay-padding': 10,
            'underlay-shape': 'ellipse',
            width: 150,
            height: 150,
            label: 'data(label)',
            color: '#fff',
            'font-size': 45,
            'font-weight': 'bold',
            'text-valign': 'center',
            'text-halign': 'center',
            'text-margin-y': 0,
            'text-outline-color': '#000',
            'text-outline-width': 1
          }
        },
        {
          selector: 'edge',
          style: {
            width: 2,
            'line-color': '#071B40',
            opacity: 0.1,
            'curve-style': 'bezier',
            'target-arrow-shape': network.directed ? 'triangle' : 'none',
            'target-arrow-color': '#000000',
            'arrow-scale': 0.65
          }
        },
        {
          selector: 'node.dimmed',
          style: {
            'background-color': '#64748B',
            'border-width': 3,
            'border-color': '#64748B',
            width: 80,
            height: 80,
            opacity: 0.1
          }
        },
        {
          selector: 'edge.dimmed',
          style: {
            'line-color': '#64748B',
            opacity: 0.05
          }
        },
        {
          selector: 'node.highlighted',
          style: {
            'background-color': '#EE0000',
            'border-width': 5,
            'border-color': '#FF1744',
            'underlay-color': '#FF1744',
            'underlay-opacity': 0.4,
            'underlay-padding': 20,
            'underlay-shape': 'ellipse',
            width: 175,
            height: 175,
            label: 'data(label)',
            color: '#fff',
            'font-size': 50,
            'font-weight': 'bold',
            'text-valign': 'center',
            'text-halign': 'center',
            'text-margin-y': 0,
            'text-outline-color': '#000',
            'text-outline-width': 1
          }
        },
        {
          selector: 'edge.highlighted',
          style: {
            'line-color': '#eb0808',
            'target-arrow-color': '#FF1744',
            width: 10,
            opacity: 1
          }
        },
        {
          selector: 'node.start, node.end',
          style: {
            'background-color': '#071B40',
            'border-width': 5,
            'border-color': '#FF003C',
            'underlay-color': '#FF003C',
            'underlay-opacity': 0.4,
            'underlay-padding': 20,
            'underlay-shape': 'ellipse',
            width: 175,
            height: 175,
            label: 'data(label)',
            color: '#fff',
            'font-size': 50,
            'font-weight': 'bold',
            'text-valign': 'center',
            'text-halign': 'center',
            'text-margin-y': 0,
            'text-outline-color': '#000',
            'text-outline-width': 1,
            opacity: 1
          }
        },
      ],
    })

    graph.current = cy

    cy.on('mouseover', 'node', event => {
      setHovered(event.target.id())
    })

    cy.on('mouseout', 'node', () => {
      setHovered(null)
    })

    cy.on('tap', 'node', event => {
      const id = event.target.id()

      setClickedNodes(previous =>
        previous.includes(id)
          ? previous.filter(node => node !== id)
          : [...previous, id]
      )

      pending.current?.abort()

      setBusy(false)
      setError('')
      setResult(null)
      setState('')

      const current = selection.current

      if (!current.start || current.end) {
        setStart(id)
        setEnd('')
      } else if (id !== current.start) {
        setEnd(id)
      }
    })

    const observer = new ResizeObserver(() => cy.resize())

    observer.observe(graphContainer.current)

    return () => {
      observer.disconnect()
      cy.destroy()
      graph.current = null
    }
  }, [network])

  // Highlight selected nodes and edges while keeping the complete network visible.
  useEffect(() => {
    const cy = graph.current

    if (!cy) return

    // Apply all style changes together to avoid intermediate redraws.
    cy.batch(() => {
      cy.elements().removeClass('dimmed highlighted start end')

      if (result) {
        cy.elements().addClass('dimmed')

        const ids = new Set(result.nodes.map(node => node.id))

        const links = new Set(
          result.edges.map(edge =>
            JSON.stringify([edge.source, edge.target])
          )
        )

        cy.nodes()
          .filter(node => ids.has(node.id()))
          .removeClass('dimmed')
          .addClass('highlighted')

        cy.edges()
          .filter(edge =>
            links.has(JSON.stringify([
              edge.source().id(),
              edge.target().id()
            ])) ||
            (!network.directed && links.has(JSON.stringify([
              edge.target().id(),
              edge.source().id()
            ])))
          )
          .removeClass('dimmed')
          .addClass('highlighted')

      } else if (clickedNodes.length > 0 || hovered) {
        cy.elements().addClass('dimmed')

        const activeNodes = new Set(clickedNodes)

        if (hovered) {
          activeNodes.add(hovered)
        }

        for (const id of activeNodes) {
          cy.getElementById(id)
            .closedNeighborhood()
            .removeClass('dimmed')
            .addClass('highlighted')
        }
      }

      if (start) cy.getElementById(start).addClass('start')
      if (end) cy.getElementById(end).addClass('end')
    })

  }, [network, result, hovered, clickedNodes, start, end])

  const airports = [...(network?.nodes || [])].sort(
    (a, b) => a.id.localeCompare(b.id)
  )

  const states = [...new Set(
    airports.map(node => node.state).filter(Boolean)
  )].sort()

  const inspectedNode = hovered || clickedNodes.at(-1)

  const neighbors = inspectedNode && network
    ? [...new Set(network.edges.flatMap(edge =>
        edge.source === inspectedNode ? [edge.target] :
        edge.target === inspectedNode ? [edge.source] : []
      ))].sort()
    : []

  function clearResult() {
    pending.current?.abort()
    setResult(null)
    setBusy(false)
    setError('')
  }

  function resetGraph() {
    clearResult()
    setStart('')
    setEnd('')
    setState('')
    setHovered(null)
    setClickedNodes([])
    graph.current?.fit(undefined, 45)
  }

  async function applyOperation(url) {
    pending.current?.abort()

    const controller = new AbortController()

    pending.current = controller

    setBusy(true)
    setError('')
    setResult(null)

    try {
      const data = await getData(url, controller.signal)

      if (!controller.signal.aborted) setResult(data)

    } catch (err) {
      if (!controller.signal.aborted) setError(err.message)

    } finally {
      if (!controller.signal.aborted) setBusy(false)
    }
  }

  function findPath() {
    setState('')
    applyOperation(`/shortest-path?${new URLSearchParams({ start, end })}`)
  }

  function filterState(value) {
    clearResult()
    setState(value)
    setStart('')
    setEnd('')

    if (value) {
      applyOperation(`/airports-by-state?${new URLSearchParams({ state: value })}`)
    }
  }

  return (
    <div className="skymesh">

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

      <main>

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

        <section id="graph" className="graph-section">

          <div className="section-heading">
            <div>
              <p className="eyebrow">
                <span /> INTERACTIVE NETWORK
              </p>
              <h2>Explore the graph</h2>
              <p>
                Hover to explore connections.
                Select two airports to calculate a path.
              </p>
            </div>

            <span className="network-count">
              {network
                ? `${network.nodes.length} airports · ${network.edges.length} edges`
                : 'Airport network'}
            </span>
          </div>

          <div className="graph-controls">

            <div className="route-controls">
              <h3>Find a route</h3>

              <label htmlFor="start-airport">
                Departure airport
              </label>

              <select
                id="start-airport"
                value={start}
                onChange={e => {
                  clearResult()
                  setState('')
                  setStart(e.target.value)

                  if (e.target.value === end) setEnd('')
                }}
              >
                <option value="">Select airport</option>

                {airports.map(node => (
                  <option key={node.id} value={node.id}>
                    {node.id}
                  </option>
                ))}
              </select>

              <label htmlFor="end-airport">
                Destination airport
              </label>

              <select
                id="end-airport"
                value={end}
                onChange={e => {
                  clearResult()
                  setState('')
                  setEnd(e.target.value)
                }}
              >
                <option value="">Select airport</option>

                {airports.filter(node => node.id !== start).map(node => (
                  <option key={node.id} value={node.id}>
                    {node.id}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="button primary"
                disabled={!start || !end || busy}
                onClick={findPath}
              >
                Find shortest path <span aria-hidden="true">→</span>
              </button>
            </div>

            <div className="filter-controls">
              <h3>Filter by state</h3>

              <label htmlFor="state-filter">State</label>

              <select
                id="state-filter"
                value={state}
                onChange={e => filterState(e.target.value)}
              >
                <option value="">All states</option>

                {states.map(name => (
                  <option key={name}>{name}</option>
                ))}
              </select>

              <button
                type="button"
                className="button secondary"
                disabled={!network}
                onClick={resetGraph}
              >
                Reset graph
              </button>
            </div>

            <div className="results" aria-live="polite">
              {busy && <p>Calculating…</p>}

              {error && (
                <p className="error" role="alert">{error}</p>
              )}

              {result?.state && (
                <>
                  <h3>{result.state}</h3>
                  <p>{result.nodes.length} airports</p>
                  <p>{result.nodes.map(node => node.id).join(', ')}</p>
                </>
              )}
            </div>
          </div>

          {result?.path && (
            <div className="path-display" aria-live="polite">
              <h3>Shortest path</h3>
              <p className="path">{result.path.join(' → ')}</p>
              <p>Total weight: {result.distance}</p>
            </div>
          )}

          <div className="graph-area">

            <div
              className="graph-canvas"
              ref={graphContainer}
              aria-label="Interactive airport network"
            />

            {loading && (
              <p className="graph-message">
                Loading airport network…
              </p>
            )}

            {!loading && !network && (
              <p className="graph-message">
                Graph unavailable. Start the Flask backend and configure the Vite proxy.
              </p>
            )}

            <div className="zoom-controls" aria-label="Graph zoom controls">

              <button
                type="button"
                aria-label="Zoom in"
                disabled={!network}
                onClick={() => {
                  const cy = graph.current

                  if (cy) {
                    cy.zoom({
                      level: cy.zoom() * 1.25,
                      renderedPosition: {
                        x: cy.width() / 2,
                        y: cy.height() / 2
                      }
                    })
                  }
                }}
              >
                +
              </button>

              <button
                type="button"
                aria-label="Zoom out"
                disabled={!network}
                onClick={() => {
                  const cy = graph.current

                  if (cy) {
                    cy.zoom({
                      level: cy.zoom() / 1.25,
                      renderedPosition: {
                        x: cy.width() / 2,
                        y: cy.height() / 2
                      }
                    })
                  }
                }}
              >
                −
              </button>

              <button
                type="button"
                aria-label="Fit graph"
                disabled={!network}
                onClick={() => graph.current?.fit(undefined, 45)}
              >
                Fit
              </button>
            </div>
          </div>

          <div className={`node-info ${inspectedNode ? '' : 'hidden'}`}>
            <strong>{inspectedNode}</strong>
            <span>{neighbors.length} connected airports</span>
            <small>{neighbors.join(', ') || 'No connections'}</small>
          </div>

        </section>

        <section id="project" className="project-section">
          <p className="eyebrow"><span /> THE PROJECT</p>
          <h2>Behind Sky<span>Mesh</span></h2>
          <p>
            A graph theory project exploring airport connectivity 
            Built with Python, NetworkX, MatPlotLib, Flask, React, and Cytoscape.js.
          </p>
          <section id="problem" className="project-subsection">
    <span className="section-number">01</span>
    <h3>The Problem</h3>

    <p>
        SkyMesh is a graph theory project for COMP-SCI 291:
        Discrete Structures II at the University of Missouri-Kansas City.
    </p>

    <p>
        The objective of the assignment is to apply graph theory concepts
        to flight route planning through the construction and analysis of
        a weighted directed graph.
    </p>

    <h4>Project Requirements</h4>

    <ul>
        <li>Create a dataset containing airports, flight connections, and their associated distances or costs.</li>
        <li>Construct a weighted directed graph in which vertices represent airports, directed edges represent flights, and edge weights represent distances or costs.</li>
        <li>Account for one-way flight connections.</li>
        <li>Implement a shortest-path algorithm to determine the optimal route between two airports.</li>
        <li>Identify hub airports based on the number of incoming and outgoing flights.</li>
        <li>Identify airports that are unreachable from a specified starting airport.</li>
    </ul>

    <h4>Deliverables</h4>

    <ul>
        <li>Application source code.</li>
        <li>Documentation explaining the graph representation, algorithms, and application usage.</li>
    </ul>

    <h4>Evaluation Criteria</h4>

    <ul>
        <li>Correct graph representation and shortest-path algorithm implementation.</li>
        <li>Accurate identification of hub and unreachable airports.</li>
        <li>Proper handling of one-way flight connections.</li>
        <li>Clear and concise documentation.</li>
    </ul>

    <p>
        These requirements established the foundation for SkyMesh.
        The project subsequently expanded into an interactive, web-based
        application for exploring and analyzing America's airport network.
    </p>
</section>
          
<section id="data" className="project-subsection">
    <span className="section-number">02</span>
    <h3>The Data</h3>

    <h4>Finding a Real-World Dataset</h4>

    <p>
        Given the assignment requirements, we wanted to find a dataset
        that reflected the structure of America's actual air transportation
        network. Commercial aviation is particularly interesting from a
        graph theory perspective because airports vary considerably in
        their connectivity. Traveling between two airports may require
        passing through one or more intermediate airports, while major
        transportation hubs provide connections to a significantly greater
        number of destinations.
    </p>

    <p>
        Constructing a graph from arbitrary airport connections would
        satisfy the basic requirements of the assignment, but using
        real-world transportation data would allow us to explore the
        characteristics of an existing network.
    </p>

    <p>
        We ultimately selected the Airline Origin and Destination Survey
        (DB1C), published by the Bureau of Transportation Statistics,
        an agency of the United States Department of Transportation.
    </p>

    <p>
        The DB1C dataset represents a 40% sample of airline tickets
        collected monthly from participating air carriers. We used the
        July 2026 dataset, which contains domestic passenger itineraries,
        airport codes, airline information, ticket prices and distances
        between airports.
    </p>

    <h4>Cleaning and Processing the Data</h4>

    <p>
        The original dataset contained considerably more information
        than was necessary for our application. To prepare the data
        for graph construction, we developed a Python script to extract,
        organize and consolidate the relevant information.
    </p>

    <p>Each itinerary was reduced to three components:</p>

    <ul>
        <li>
            <strong>Route:</strong> An ordered sequence of airport
            codes representing a passenger's itinerary.
        </li>
        <li>
            <strong>Leg distances:</strong> The recorded mileage
            between consecutive airports.
        </li>
        <li>
            <strong>Geographic data:</strong> The latitude and
            longitude of each airport along the route.
        </li>
    </ul>

    <p>
        Duplicate itineraries were removed, and records containing
        incomplete distance information were discarded. The resulting
        data was serialized into JSON structures and stored within
        a new CSV file.
    </p>

    <h4>Adding Geographic Coordinates</h4>

    <p>
        We wanted the graph to visually resemble the geographic
        distribution of airports across the United States.
    </p>

    <p>
        Using the <code>airportsdata</code> Python library, we retrieved
        the latitude and longitude of each airport using its
        three-character airport code. Longitude was assigned to the
        horizontal axis and latitude to the vertical axis, allowing
        each vertex to be positioned according to its geographic location.
    </p>

    <p>
        Additional adjustments were made to accommodate airports
        located near the International Date Line.
    </p>

    <h4>Refining the Dataset</h4>

    <p>
        Representing every airport and connection in the original
        dataset would produce an excessively dense visualization
        that would be difficult to navigate and interpret.
    </p>

    <p>
        To make the graph more manageable, we established a curated
        collection of airports, focusing primarily on international
        airports throughout the United States.
    </p>

    <p>
        Itineraries containing airports outside this collection or
        airports with missing geographic information were excluded.
        The remaining itineraries were separated into individual
        directional connections, and duplicate connections were
        consolidated.
    </p>

    <p>The resulting dataset consists of:</p>

    <ul>
        <li><strong>153 unique airports</strong></li>
        <li><strong>6,879 unique directed airport connections</strong></li>
        <li>Distance in miles associated with each connection</li>
        <li>Geographic coordinates for every airport</li>
    </ul>

    <p>
        This processed dataset serves as the foundation of SkyMesh,
        providing a geographically recognizable, weighted directed
        graph derived from real-world transportation data.
    </p>

</section>


    
<section id="graph-development" className="project-subsection">
    <span className="section-number">03</span>
    <h3>The Graph</h3>

    <h4>Mathematical Modeling</h4>

    <p>
        Our objective was to construct a graph that modeled the
        connectivity of America's international airport network
        while preserving its geographic structure.
    </p>

    <p>
        Using the NetworkX Python library, we constructed a weighted
        directed graph, mathematically represented as G = (V, E),
        with an associated weight function w: E → ℝ₊.
    </p>

    <ul>
        <li>
            <strong>Vertices (V):</strong> Airports identified by
            their three-letter IATA codes.
        </li>
        <li>
            <strong>Edges (E):</strong> Directional connections
            between airports.
        </li>
        <li>
            <strong>Weights (w):</strong> The distance in miles
            associated with each edge.
        </li>
    </ul>

    <h5>Constructing the graph</h5>

    <p>
        We first initialize an empty directed graph using NetworkX:
    </p>

    <pre><code>{`graph = nx.DiGraph()`}</code></pre>

    <p>
        Each itinerary in the processed dataset is then traversed
        sequentially to identify its individual connections and
        their associated distances.
    </p>

    <pre><code>{`for i in range(len(route)-1):
    current = route[i]
    next = route[i+1]
    distanceBetween = distances[i]`}</code></pre>

    <p>
        For example, an itinerary containing airports A, B and C
        produces two individual connections: A → B and B → C.
    </p>

    <p>
        Before adding a connection to the graph, we check whether
        the directed edge already exists. This prevents duplicate
        edges between the same ordered pair of airports.
    </p>

    <pre><code>{`if graph.has_edge(current, next):
    continue`}</code></pre>

    <p>
        The edge is then added to the graph, with its weight equal
        to the recorded distance between the two airports.
    </p>

    <pre><code>{`graph.add_edge(current, next, weight=distanceBetween)`}</code></pre>

    <h5>Accommodating one-way connections</h5>

    <p>
        An important characteristic of this implementation is that
        an edge from airport A to airport B does not automatically
        establish an edge from airport B to airport A. A reverse
        connection is created only if it appears independently in
        the processed dataset.
    </p>

    <p>
        This allows SkyMesh to accommodate both one-way and
        bidirectional connections. Consequently, the airports from
        which a particular airport receives flights may differ from
        the airports to which it sends flights.
    </p>

    <p>
        Of the 6,879 directed edges in the resulting graph,
        <strong> 893 exist without a corresponding reverse edge</strong>,
        accounting for approximately 13% of all connections.
    </p>

    <p>
        Because the graph is derived from a historical sample of
        passenger itineraries and is further constrained by our
        airport selection criteria, the absence of a reverse edge
        indicates that the connection was absent from our processed
        dataset. Such a connection may still exist in the actual
        air transportation network.
    </p>

    <h4>Geographic Representation</h4>

    <p>
        We wanted each vertex to occupy a position corresponding
        to its actual geographic location, allowing the graph
        to resemble a recognizable map of the United States.
    </p>

    <p>
        Longitude and latitude were used as the X and Y coordinates,
        respectively. However, this introduced a challenge involving
        the International Date Line, where longitude wraps between
        positive and negative 180 degrees.
    </p>

    <p>
        To maintain geographic continuity along the horizontal axis,
        we implemented the following adjustment:
    </p>

    <pre><code>{`x = airport_geo_data[current]["X"]
y = airport_geo_data[current]["Y"]

if x > 0:
    x -= 360`}</code></pre>

    <p>
        This adjustment can be expressed mathematically as:
    </p>

    <div className="math-expression">
        <span>x(λ) =</span>
        <span className="math-brace">{'{'}</span>
        <div className="math-cases">
            <span>λ − 360, &nbsp; λ &gt; 0</span>
            <span>λ, &nbsp; λ ≤ 0</span>
        </div>
    </div>

    <p>
        Where λ represents the original longitude of an airport.
    </p>

    <p>
        For example, an airport located at a longitude of 175°
        would be repositioned at −185°, preserving its relative
        geographic position alongside airports in western Alaska.
    </p>

    <p>
        Once the coordinates have been adjusted, the vertex is
        added to the graph with its positional attributes:
    </p>

    <pre><code>{`graph.add_node(current, viz={"position": {
    "x": x,
    "y": y,
    "z": 0.0
}})`}</code></pre>

    <p>
        The Z coordinate is set to zero because our visualization
        exists on a two-dimensional plane.
    </p>

    <h4>Visualization and Development</h4>

    <p>
        SkyMesh was originally developed as a terminal-based Python
        application. Once constructed, the graph was exported using
        the Graph Exchange XML Format (GEXF).
    </p>

    <pre><code>{`nx.write_gexf(graph, "airports.gexf")`}</code></pre>

    <p>
        This file format preserves the vertices, directed edges,
        weights and geographic positions of the graph.
    </p>

    <p>
        The exported file could then be opened in Gephi, an open-source
        application for network visualization and analysis. This allowed
        us to examine the structure of the network and evaluate the
        accuracy of its geographic representation.
    </p>

    <p>
        As development progressed, we incorporated Matplotlib into
        the terminal application to provide additional visualization
        capabilities, including displaying the entire network, isolating
        airports by state, examining adjacent vertices and visualizing
        shortest paths.
    </p>

    <p>
        These capabilities eventually formed the foundation of
        SkyMesh's interactive web application.
    </p>

</section>


    
<section id="code" className="project-subsection">
    <span className="section-number">04</span>
    <h3>The Code</h3>

    <h4>Dijkstra's Algorithm</h4>

    <p>
        One of the primary requirements of the assignment was to
        implement a shortest-path algorithm capable of determining
        the most efficient route between two airports.
    </p>

    <p>
        We selected Dijkstra's algorithm, which determines the
        shortest weighted path between vertices in a graph containing
        non-negative edge weights. In the context of SkyMesh, this
        means finding a sequence of airport connections that minimizes
        the total distance traveled.
    </p>

    <p>
        Although NetworkX provides a built-in implementation of
        Dijkstra's algorithm, we implemented the algorithm ourselves
        to demonstrate our understanding of the underlying mathematical
        concepts and computational logic.
    </p>

    <h5>1. Initialization</h5>

    <p>
        We begin by creating a dictionary that stores the shortest
        known distance from the starting vertex to every other
        vertex in the graph.
    </p>

    <p>
        Initially, all distances are set to infinity because no
        paths have been discovered. The distance from the starting
        vertex to itself is set to zero.
    </p>

    <pre><code>{`shortestDistances = {}

for node in graph.nodes():
    shortestDistances[node] = float('inf')

shortestDistances[start_node] = 0`}</code></pre>

    <p>
        We then establish a set of unvisited vertices, initialize
        our current position and create a dictionary to track the
        preceding vertex along each shortest known path.
    </p>

    <pre><code>{`unvisited = set(graph.nodes())
unvisited.remove(start_node)

currentDistance = 0
current_node = start_node
path = {}`}</code></pre>

    <h5>2. Evaluating adjacent vertices</h5>

    <p>
        For each vertex we visit, we examine its adjacent vertices
        and calculate the cumulative distance required to reach
        them through our current vertex.
    </p>

    <pre><code>{`for neighbor in graph.adj[current_node]:
    distance = currentDistance + graph[current_node][neighbor].get('weight', 1)

    if distance < shortestDistances[neighbor]:
        shortestDistances[neighbor] = distance
        path[neighbor] = current_node`}</code></pre>

    <p>
        If the calculated distance is shorter than the previously
        recorded distance, we update both the shortest known
        distance and the preceding vertex.
    </p>

    <p>
        This process is known as <strong>edge relaxation</strong>.
    </p>

    <div className="relaxation-example">

        <div className="relaxation-route">
            <span>A → C</span>
            <strong>700 miles</strong>
        </div>

        <div className="relaxation-route improved-route">
            <span>A → B → C</span>
            <strong>500 miles</strong>
        </div>

    </div>

    <p>
        The shortest known distance to C is updated from 700 to
        500 miles, and B becomes its preceding vertex.
        This is an illustrative example.
    </p>

    <p>
        Because SkyMesh uses a directed graph,
        <code> graph.adj[current_node]</code> provides access
        to outgoing connections. This ensures that the algorithm
        respects the directional restrictions established during
        graph construction.
    </p>

    <h5>3. Selecting the next vertex</h5>

    <p>
        After evaluating the adjacent vertices, we identify the
        unvisited vertex with the shortest cumulative distance
        from the starting vertex.
    </p>

    <pre><code>{`min_distance = min(shortestDistances[node] for node in unvisited)

if min_distance != float('inf'):
    current_node = min(
        unvisited,
        key=lambda node: shortestDistances[node]
    )
    currentDistance = shortestDistances[current_node]
else:
    break`}</code></pre>

    <p>
        The algorithm progresses through the graph by repeatedly
        selecting the closest unvisited vertex based on the total
        distance accumulated from the starting vertex.
    </p>

    <p>
        Once the destination has been reached, the algorithm
        terminates. Otherwise, the current vertex is removed
        from the set of unvisited vertices and the process repeats.
    </p>

    <pre><code>{`if current_node == end_node:
    break

unvisited.remove(current_node)`}</code></pre>

    <h5>4. Handling unreachable vertices</h5>

    <p>
        If the minimum distance among all remaining unvisited
        vertices is infinity, those vertices cannot be reached
        from the starting vertex.
    </p>

    <p>
        We use this property to determine whether a valid path
        exists between the specified airports.
    </p>

    <pre><code>{`if shortestDistances[end_node] == float('inf'):
    return None`}</code></pre>

    <p>
        This prevents the application from returning a route
        where no valid sequence of directional connections exists.
    </p>

    <h5>5. Reconstructing the shortest path</h5>

    <p>
        Throughout the algorithm, the <code>path</code> dictionary
        records the preceding vertex associated with each shortest
        known distance.
    </p>

    <p>
        Once the destination has been reached, we reconstruct the
        shortest path by working backward from the destination
        to the starting vertex.
    </p>

    <pre><code>{`shortestPath = {}
current_node = end_node

while current_node != start_node:
    shortestPath[current_node] = shortestDistances[current_node]
    current_node = path[current_node]

shortestPath[start_node] = 0

return dict(reversed(list(shortestPath.items())))`}</code></pre>

    <p>
        Because the path is reconstructed in reverse order, we
        reverse the resulting dictionary before returning it.
        The result contains the airports in their correct travel
        sequence, along with the cumulative distance at each airport.
    </p>

    <h5>6. Computational complexity</h5>

    <p>
        Our implementation searches the unvisited set to identify
        the next vertex with the shortest known distance. This
        produces a worst-case time complexity of:
    </p>

    <div className="math-expression">
        O(|V|² + |E|)
    </div>

    <p>
        The algorithm also requires auxiliary space proportional
        to the number of vertices:
    </p>

    <div className="math-expression">
        O(|V|)
    </div>

    <p>
        Given the relatively small size of our graph, this
        implementation provides a straightforward and practical
        solution while clearly demonstrating the fundamental
        operations of Dijkstra's algorithm.
    </p>

    <h4>Application Architecture</h4>

    <p>
        Originally developed as a terminal-based Python application,
        SkyMesh evolved into an interactive web application by
        separating its computational logic from its visual interface.
        The Python backend and JavaScript frontend communicate
        through a Flask API.
    </p>

    <h5>The Backend</h5>

    <p>
        The backend loads the previously constructed GEXF graph into
        memory using NetworkX, executes graph operations and returns
        results as JSON through three primary API endpoints.
    </p>

    <div className="api-endpoints">
        <div>
            <code>/graph-data</code>
            <p>Returns the complete airport network.</p>
        </div>

        <div>
            <code>/shortest-path</code>
            <p>Calculates the shortest path between two airports.</p>
        </div>

        <div>
            <code>/airports-by-state</code>
            <p>Returns airports and internal connections within a selected state.</p>
        </div>
    </div>

    <h5>The Frontend</h5>

    <p>
        React manages the interface, airport selections and application
        state, while Cytoscape.js renders the interactive network using
        the geographic coordinates established during graph construction.
    </p>

    <p>
        User requests are transmitted to the backend through the API.
        The returned graph elements are then used to highlight airports,
        directional connections and calculated shortest paths while
        preserving the geographic context of the complete network.
    </p>

    <p>
        This architecture allows the original computational logic
        to operate independently of the web interface.
    </p>

    <h4>Technology Stack</h4>

    <div className="technology-stack">

        <div className="technology">
            <img src="/logos/python.svg" alt="Python logo" />
            <h5>Python</h5>
            <p>
                Data processing, graph construction and
                algorithm implementation.
            </p>
        </div>

        <div className="technology">
            <img src="/logos/networkx.svg" alt="NetworkX logo" />
            <h5>NetworkX</h5>
            <p>
                Graph data structures, vertex and edge management,
                and graph serialization.
            </p>
        </div>

        <div className="technology">
            <img src="/logos/flask.svg" alt="Flask logo" />
            <h5>Flask</h5>
            <p>
                Backend API, request processing and JSON responses.
            </p>
        </div>

        <div className="technology">
            <img src="/logos/react.svg" alt="React logo" />
            <h5>React</h5>
            <p>
                Frontend development, application state
                and user interaction.
            </p>
        </div>

        <div className="technology">
            <img src="/logos/cytoscape.svg" alt="Cytoscape.js logo" />
            <h5>Cytoscape.js</h5>
            <p>
                Interactive graph rendering, styling and navigation.
            </p>
        </div>

        <div className="technology">
            <img src="/logos/vite.svg" alt="Vite logo" />
            <h5>Vite</h5>
            <p>
                Frontend development server, production build
                process and development API proxy.
            </p>
        </div>

        <div className="technology">
            <img src="/logos/matplotlib.svg" alt="Matplotlib logo" />
            <h5>Matplotlib</h5>
            <p>
                Graph visualization within the original
                terminal-based application.
            </p>
        </div>

        <div className="technology">
            <img src="/logos/gephi.svg" alt="Gephi logo" />
            <h5>Gephi</h5>
            <p>
                Graph inspection, visualization and analysis
                during initial development.
            </p>
        </div>

    </div>

</section>


    
<section id="infrastructure" className="project-subsection">
    <span className="section-number">05</span>
    <h3>The Infrastructure</h3>

    <p>
        We wanted SkyMesh to stand out among other implementations
        of the same mini project. Developing an interactive,
        publicly accessible web application allowed us to present
        our work more effectively while exploring technologies
        beyond the scope of the original assignment.
    </p>

    <h4>Cloud Infrastructure</h4>

    <p>
        We selected Amazon Web Services (AWS) to host SkyMesh,
        provisioning an EC2 virtual server with the following
        specifications:
    </p>

    <ul>
        <li><strong>Instance type:</strong> t3.micro</li>
        <li><strong>Operating system:</strong> Amazon Linux 2023</li>
        <li><strong>Region:</strong> US East (Ohio)</li>
        <li><strong>Architecture:</strong> x86-64</li>
    </ul>

    <h4>Server Configuration</h4>

    <p>
        Using SSH, we remotely accessed and configured the EC2
        instance with the software necessary to host SkyMesh.
    </p>

    <div className="infrastructure-table">
        <table>
            <thead>
                <tr>
                    <th>Technology</th>
                    <th>Purpose</th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <td>Python</td>
                    <td>Backend execution</td>
                </tr>

                <tr>
                    <td>Python virtual environment</td>
                    <td>Dependency isolation</td>
                </tr>

                <tr>
                    <td>Node.js and npm</td>
                    <td>Frontend compilation and dependency management</td>
                </tr>

                <tr>
                    <td>Gunicorn</td>
                    <td>Production backend server</td>
                </tr>

                <tr>
                    <td>Nginx</td>
                    <td>Web server and reverse proxy</td>
                </tr>

                <tr>
                    <td>systemd</td>
                    <td>Persistent service management</td>
                </tr>
            </tbody>
        </table>
    </div>

    <h4>Production Architecture</h4>

    <p>
        Nginx serves as the public entry point for SkyMesh.
        The React frontend is compiled using Vite and served
        directly by Nginx.
    </p>

    <p>
        API requests are forwarded to Gunicorn, which runs
        the Flask backend and executes the application's
        graph operations.
    </p>

    <p>
        Gunicorn is managed through systemd, allowing the
        backend to remain operational independently of an
        active SSH session and automatically start when
        the server boots.
    </p>

    <h4>Public Accessibility</h4>

    <p>
        A dedicated domain name provides SkyMesh with a
        recognizable identity and an easily accessible web
        address. DNS connects the domain to our EC2 instance,
        while HTTPS secures communication between the browser
        and server.
    </p>

    <h4>Automated Deployment</h4>

    <p>
        To eliminate the need to manually update the production
        server after every modification, we implemented
        continuous deployment using GitHub Actions.
    </p>

    <p>
        A self-hosted GitHub Actions runner operates directly
        on the EC2 instance as a persistent system service.
        Deployments are automatically triggered whenever changes
        are pushed to the main branch of our repository.
    </p>

    <p>Each deployment performs the following operations:</p>

    <ol>
        <li>Retrieve and synchronize the latest source code.</li>
        <li>Install backend and frontend dependencies.</li>
        <li>Compile the frontend using Vite.</li>
        <li>Restart the necessary application services.</li>
    </ol>

    <p>
        This allows us to develop locally, push changes to
        GitHub and automatically deploy them to production.
    </p>

    <div className="architecture">

        <h4 className="architecture-title">
            SkyMesh Infrastructure
        </h4>

        <p className="architecture-description">
            AWS hosting, production architecture, and automated deployment
        </p>

        {/* APPLICATION FLOW */}

        <div className="architecture-flow">

            <h5 className="flow-heading application-heading">
                Application Flow
            </h5>

            <div className="application-flow">

                <div className="architecture-node browser-node">
                    <svg viewBox="0 0 48 48" className="architecture-icon">
                        <rect x="6" y="6" width="36" height="28" rx="3"
                            fill="none" stroke="currentColor" strokeWidth="3" />
                        <path d="M2 39 H46 L42 34 H6 Z"
                            fill="none" stroke="currentColor" strokeWidth="3" />
                    </svg>
                    <strong>User Browser</strong>
                </div>

                <div className="architecture-arrow blue-arrow">
                    <span>HTTPS</span>
                </div>

                <div className="architecture-node nginx-node">
                    <img src="/logos/nginx.svg" alt="Nginx" />
                    <strong>Nginx</strong>
                </div>

                <div className="application-branches">

                    <div className="architecture-branch">

                        <div className="architecture-arrow blue-arrow">
                            <span>Static assets</span>
                        </div>

                        <div className="architecture-node">
                            <img src="/logos/react.svg" alt="React" />
                            <div>
                                <strong>React Frontend</strong>
                                <small>Vite production build</small>
                            </div>
                        </div>

                    </div>

                    <div className="architecture-branch">

                        <div className="architecture-arrow blue-arrow">
                            <span>API requests</span>
                        </div>

                        <div className="backend-flow">

                            <div className="architecture-node">
                                <img src="/logos/flask.svg" alt="Flask" />
                                <strong>Gunicorn + Flask API</strong>
                            </div>

                            <div className="vertical-arrow"></div>

                            <div className="architecture-node">
                                <img src="/logos/networkx.svg" alt="NetworkX" />
                                <strong>NetworkX</strong>
                            </div>

                            <div className="vertical-arrow"></div>

                            <div className="architecture-node">
                                <svg viewBox="0 0 32 32" className="architecture-icon">
                                    <path d="M7 3 H20 L26 9 V29 H7 Z"
                                        fill="none" stroke="currentColor"
                                        strokeWidth="2" strokeLinejoin="round" />
                                    <path d="M20 3 V9 H26 M11 15 H22 M11 20 H22"
                                        fill="none" stroke="currentColor"
                                        strokeWidth="2" />
                                </svg>
                                <strong>airports.gexf</strong>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

        {/* DEPLOYMENT FLOW */}

        <div className="architecture-flow">

            <h5 className="flow-heading deployment-heading">
                Deployment Flow
            </h5>

            <div className="deployment-flow">

                <div className="deployment-pipeline">

                    <div className="deployment-node">
                        <img src="/logos/vscode.svg" alt="VS Code" />
                        <strong>Development Environment</strong>
                        <small>VS Code</small>
                    </div>

                    <div className="architecture-arrow red-arrow"></div>

                    <div className="deployment-node">
                        <img src="/logos/github.svg" alt="GitHub" />
                        <strong>GitHub Repository</strong>
                        <small>main branch</small>
                    </div>

                    <div className="architecture-arrow red-arrow"></div>

                    <div className="deployment-node">
                        <img src="/logos/githubactions.svg" alt="GitHub Actions" />
                        <strong>GitHub Actions Runner</strong>
                        <small>Self-hosted</small>
                        <small>systemd service</small>
                    </div>

                    <div className="architecture-arrow red-arrow"></div>

                    <div className="deployment-node deployment-server">
                        <img src="/logos/ec2.png" alt="Amazon EC2" />
                        <strong>EC2 Server</strong>

                        <ul>
                            <li>Sync source code</li>
                            <li>Install dependencies</li>
                            <li>Build frontend</li>
                            <li>Restart services</li>
                        </ul>

                    </div>

                </div>

                {/* AWS ENVIRONMENT */}

                <div className="aws-environment">

                    <div className="aws-heading">
                        <img src="/logos/aws.svg" alt="AWS" />
                        <div>
                            <strong>AWS EC2</strong>
                            <small>Amazon Linux 2023</small>
                        </div>
                    </div>

                    <div className="aws-components">

                        <div className="aws-component">
                            <img src="/logos/nginx.svg" alt="Nginx" />
                            <strong>Nginx</strong>
                        </div>

                        <div className="aws-component">
                            <img src="/logos/react.svg" alt="React" />
                            <strong>React Frontend</strong>
                        </div>

                        <div className="aws-component">
                            <img src="/logos/githubactions.svg" alt="GitHub Actions" />
                            <strong>GitHub Actions Runner</strong>
                        </div>

                        <div className="aws-component">
                            <img src="/logos/flask.svg" alt="Flask" />
                            <strong>Gunicorn + Flask API</strong>
                        </div>

                        <div className="aws-component">
                            <img src="/logos/networkx.svg" alt="NetworkX" />
                            <strong>NetworkX</strong>
                        </div>

                        <div className="aws-component">
                            <svg viewBox="0 0 32 32" className="architecture-icon">
                                <path d="M7 3 H20 L26 9 V29 H7 Z"
                                    fill="none" stroke="currentColor"
                                    strokeWidth="2" strokeLinejoin="round" />
                                <path d="M20 3 V9 H26 M11 15 H22 M11 20 H22"
                                    fill="none" stroke="currentColor"
                                    strokeWidth="2" />
                            </svg>
                            <strong>airports.gexf</strong>
                        </div>

                    </div>

                </div>

            </div>

        </div>

        {/* LEGEND */}

        <div className="architecture-legend">
            <div>
                <span className="legend-line application-line"></span>
                Application flow
            </div>
            <div>
                <span className="legend-line deployment-line"></span>
                Deployment flow
            </div>
        </div>

    </div>

    <h4>Beyond the Assignment</h4>

    <p>
        What began as an exercise in graph theory evolved
        into a full-stack software development project
        incorporating cloud infrastructure, Linux server
        administration, production hosting and automated
        deployment.
    </p>

</section>


    <section id="findings" className="project-subsection">
    <span className="section-number">06</span>
    <h3>Findings and Observations</h3>

    <h4>Data Quality and Research</h4>

    <p>
        Although constructing a graph with arbitrary airport connections
        would satisfy the assignment requirements, we wanted to apply what
        we learned in class to a real-world transportation network.
    </p>

    <p>
        Finding suitable data required considerable research. We evaluated
        several datasets before finding one that represented actual
        passenger itineraries, including connections through intermediate
        airports.
    </p>

    <p>
        We learned that the accuracy of a mathematical model depends
        heavily on the quality of the data used to construct it.
    </p>

    <h4>From Mathematical Theory to Code</h4>

    <p>
        Implementing Dijkstra's algorithm required us to consider how
        each step of the algorithm taught in class could be performed
        programmatically.
    </p>

    <p>
        We wanted to remain faithful to the algorithm presented in
        our lectures:
    </p>

    <ul>
        <li>Initialize the distance to every vertex to infinity.</li>
        <li>Set the distance to the starting vertex to zero.</li>
        <li>Relax edges and update the shortest known distances.</li>
        <li>Select and visit the unvisited vertex with the shortest cumulative distance.</li>
        <li>Repeat until the destination is reached or no reachable unvisited vertices remain.</li>
    </ul>

    <p>
        Our implementation required additional variables, dictionaries
        and sets to keep track of distances, unvisited vertices and
        the sequence of vertices forming the shortest path.
    </p>

    <h4>Graph Classification</h4>

    <p>
        Using concepts covered in Assignments 5 and 6, we identified
        the following properties of SkyMesh:
    </p>

    <div className="infrastructure-table">
        <table>
            <thead>
                <tr>
                    <th>Property</th>
                    <th>Classification</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Directed</td>
                    <td>Yes</td>
                </tr>
                <tr>
                    <td>Weighted</td>
                    <td>Yes</td>
                </tr>
                <tr>
                    <td>Complete</td>
                    <td>No</td>
                </tr>
                <tr>
                    <td>Bipartite</td>
                    <td>No</td>
                </tr>
                <tr>
                    <td>Contains loops</td>
                    <td>No</td>
                </tr>
                <tr>
                    <td>Contains isolated vertices</td>
                    <td>No</td>
                </tr>
                <tr>
                    <td>Contains bidirectional connections</td>
                    <td>Yes</td>
                </tr>
                <tr>
                    <td>Contains duplicate edges in the same direction</td>
                    <td>No</td>
                </tr>
            </tbody>
        </table>
    </div>

    <h4>Graph Density</h4>

    <p>
        In Assignment 6, we used the Handshaking Theorem to derive
        a formula for the number of edges in a complete graph:
    </p>

    <div className="math-expression">
        |E| = n(n − 1) / 2
    </div>

    <p>
        Because SkyMesh is directed, a connection from MCI to DEN
        and a connection from DEN to MCI count as two separate
        edges. Therefore, we can double the formula to determine
        the maximum possible number of edges in our graph:
    </p>

    <div className="math-expression">
        <span>|E<sub>max</sub>| = n(n − 1)</span>
    </div>

    <div className="math-expression">
        <span>|E<sub>max</sub>| = 153(152) = 23,256</span>
    </div>

    <p>
        Dividing the actual number of edges by the maximum possible
        number of edges gives us the density of the graph:
    </p>

    <div className="math-expression">
        D = 6,879 / 23,256 ≈ 29.58%
    </div>

    <p>
        Only <strong>29.58%</strong> of all possible directed
        connections exist within SkyMesh, demonstrating the
        importance of intermediate airports when traveling
        between destinations.
    </p>

    <h4>The Handshaking Theorem</h4>

    <p>
        Using the Handshaking Theorem, we can calculate the sum
        of all vertex degrees by multiplying the number of edges
        by two.
    </p>

    <div className="math-expression">
        <span>∑<sub>v ∈ V</sub> deg(v) = 2|E|</span>
    </div>

    <div className="math-expression">
        2(6,879) = 13,758
    </div>

    <p>
        We can calculate the average degree by dividing the sum
        of the degrees by the number of vertices. Since every
        directed edge contributes one incoming and one outgoing
        connection, we can also calculate the average in-degree
        and out-degree.
    </p>

    <div className="infrastructure-table">
        <table>
            <thead>
                <tr>
                    <th>Property</th>
                    <th>Calculation</th>
                    <th>Average</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>In-degree</td>
                    <td>6,879 ÷ 153</td>
                    <td>44.96</td>
                </tr>
                <tr>
                    <td>Out-degree</td>
                    <td>6,879 ÷ 153</td>
                    <td>44.96</td>
                </tr>
                <tr>
                    <td>Total degree</td>
                    <td>13,758 ÷ 153</td>
                    <td>89.92</td>
                </tr>
            </tbody>
        </table>
    </div>

    <h4>Airport Connectivity and Hubs</h4>

    <p>
        Analyzing vertex degrees revealed considerable differences
        in airport connectivity.
    </p>

    <p>
        Airports such as ORD, DEN and DFW serve as major hubs within
        our network, while airports such as KTN, ITO, ART and INL
        have relatively few connections.
    </p>

    <p>We measured connectivity in three ways:</p>

    <ul>
        <li>
            <strong>In-degree:</strong> Number of incoming edges.
        </li>
        <li>
            <strong>Out-degree:</strong> Number of outgoing edges.
        </li>
        <li>
            <strong>Unique neighbors:</strong> Number of distinct
            adjacent vertices.
        </li>
    </ul>

    <div className="infrastructure-table">
        <table>
            <thead>
                <tr>
                    <th>Airport</th>
                    <th>In-degree</th>
                    <th>Out-degree</th>
                    <th>Unique neighbors</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>ORD</td>
                    <td>111</td>
                    <td>113</td>
                    <td>116</td>
                </tr>
                <tr>
                    <td>DEN</td>
                    <td>111</td>
                    <td>109</td>
                    <td>113</td>
                </tr>
                <tr>
                    <td>DFW</td>
                    <td>107</td>
                    <td>109</td>
                    <td>109</td>
                </tr>
                <tr>
                    <td>MCI</td>
                    <td>76</td>
                    <td>73</td>
                    <td>84</td>
                </tr>
                <tr>
                    <td>ITO</td>
                    <td>5</td>
                    <td>3</td>
                    <td>5</td>
                </tr>
                <tr>
                    <td>KTN</td>
                    <td>4</td>
                    <td>3</td>
                    <td>4</td>
                </tr>
                <tr>
                    <td>ART</td>
                    <td>3</td>
                    <td>3</td>
                    <td>4</td>
                </tr>
                <tr>
                    <td>INL</td>
                    <td>2</td>
                    <td>4</td>
                    <td>4</td>
                </tr>
                <tr>
                    <td>SBD</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                </tr>
            </tbody>
        </table>
    </div>

    <p>
        ORD is the most connected airport in our graph, with
        <strong> 116 adjacent airports</strong>. SBD is the
        least connected, with only one adjacent airport.
    </p>

    <h4>One-Way and Bidirectional Connections</h4>

    <p>
        We found that many airport connections exist in both
        directions, while others exist in only one direction.
    </p>

    <div className="infrastructure-table">
        <table>
            <thead>
                <tr>
                    <th>Connection type</th>
                    <th>Count</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Bidirectional airport pairs</td>
                    <td>2,993</td>
                </tr>
                <tr>
                    <td>One-way airport pairs</td>
                    <td>893</td>
                </tr>
                <tr>
                    <td>Total directed edges</td>
                    <td>6,879</td>
                </tr>
            </tbody>
        </table>
    </div>

    <p>
        Approximately 13% of the edges in SkyMesh have no
        corresponding reverse edge. If we represented the airport
        network as an undirected graph, our shortest-path algorithm
        could travel along these 893 connections in a direction
        unsupported by our dataset.
    </p>

    <h4>Connectivity and Reachability</h4>

    <p>
        One of our more interesting findings was that every airport
        in SkyMesh is reachable from every other airport.
    </p>

    <p>
        SBD, for example, has only one adjacent airport. Despite
        this, all 152 other airports can be reached from SBD
        by traveling through intermediate airports.
    </p>

    <p>
        This demonstrates the difference between adjacency and
        reachability. An airport can have very few direct
        connections while still having access to the entire network.
    </p>

    <h4>Euler Paths and Circuits</h4>

    <p>
        In Assignment 6, we learned that a connected undirected
        graph contains an Euler circuit if every vertex has
        an even degree.
    </p>

    <p>
        We examined the total degree of vertices within SkyMesh
        to determine whether every edge could be traversed exactly
        once while returning to the starting vertex.
    </p>

    <p>
        MCI has 76 incoming edges and 73 outgoing edges,
        giving it a total degree of 149.
    </p>

    <p>
        Because MCI has an odd degree, SkyMesh cannot contain
        an Euler circuit.
    </p>

    <p>
        SkyMesh also contains no Euler path that traverses every
        directed edge exactly once. MCI has three more incoming
        edges than outgoing edges, making such a traversal
        impossible.
    </p>

    <h4>Geographic Modeling</h4>

    <p>
        We learned how to use latitude and longitude as X and Y
        coordinates and adjust longitude values to maintain
        continuity across the International Date Line.
    </p>

    <p>
        Because our edge weights are taken directly from the
        original dataset, the geographic representation of the
        graph does not affect our shortest-path calculations.
    </p>

    <h4>Software Development and Code Reusability</h4>

    <p>
        Throughout the project, we learned how to work with
        NetworkX, Matplotlib, Gephi, Flask, React and Cytoscape.js.
    </p>

    <p>
        Working with Flask was considerably simpler than we
        anticipated. Much of our original Python code could be
        reused by modifying how functions received input and
        returned results.
    </p>

    <div className="infrastructure-table">
        <table>
            <thead>
                <tr>
                    <th>Terminal application</th>
                    <th>Web application</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>input()</code></td>
                    <td>HTTP request parameters</td>
                </tr>
                <tr>
                    <td><code>print()</code></td>
                    <td>JSON responses</td>
                </tr>
                <tr>
                    <td>Matplotlib</td>
                    <td>Cytoscape.js</td>
                </tr>
                <tr>
                    <td>Terminal menus</td>
                    <td>Interactive interface</td>
                </tr>
                <tr>
                    <td>Dijkstra's algorithm</td>
                    <td>Existing implementation retained</td>
                </tr>
            </tbody>
        </table>
    </div>

    <p>
        Functions responsible for terminal menus and other
        interface-related operations were replaced by frontend
        functionality. This demonstrated the benefits of writing
        reusable functions and separating computational logic
        from the user interface.
    </p>

    <h4>Conclusion</h4>

    <p>
        SkyMesh gave us an opportunity to apply the concepts
        learned in Discrete Structures II to a real-world
        transportation network.
    </p>

    <p>
        We were able to examine graph properties, apply
        mathematical theorems, implement Dijkstra's algorithm
        and analyze relationships between airports while gaining
        practical experience in full-stack software development.
    </p>

</section>
<section id="contributions" className="project-subsection">
    <span className="section-number">07</span>
    <h3>Key Members &amp; Contributions</h3>

    <p>
        SkyMesh was developed collaboratively by Tyler Prince and
        Aisha Tahlil, with both members contributing equally
        throughout the project.
    </p>

    <p>
        Aisha selected the mini project, and together we developed
        the initial concept, conducted research, processed the data,
        wrote the code, performed the mathematical analysis, and
        authored the project documentation presented on this website.
    </p>
</section>
   <section id="ai" className="project-subsection">
    <span className="section-number">08</span>
    <h3>The Role of AI</h3>

    <p>
        AI was used as a learning and development resource throughout
        the project. It provided guidance in configuring our cloud
        infrastructure and developed the frontend under our close
        direction. Tyler's familiarity with React and CSS allowed
        him to review, modify and refine the generated frontend
        code as needed.
    </p>

    <p>
        AI was also used to review our Python code, identify
        potential errors and verify our implementation.
    </p>

</section>

    <section id="future" className="project-subsection">
        <span className="section-number">09</span>
        <h3>Future Development</h3>
        <p>Potential applications, improvements, and expansion.</p>

        {/* Content */}
    </section>

    <section id="references" className="project-subsection">
    <span className="section-number">10</span>
    <h3>References and Resources</h3>

    <h4>Data References</h4>

    <p>
        [1] U.S. Department of Transportation, Bureau of
        Transportation Statistics, “Origin and Destination Survey
        Data (Coupon), DB1C,” July 2026 dataset.
        Accessed: Nov. 25, 2026. [Online]. Available:{' '}
        <a
            href="https://www.bts.gov/topics/airlines-and-airports/origin-and-destination-survey-data-coupon"
            target="_blank"
            rel="noopener noreferrer"
        >
            Origin and Destination Survey Data (Coupon)
        </a>
    </p>

    <p>
        [2] U.S. Department of Transportation, Bureau of
        Transportation Statistics, Office of Airline Information,
        “Data Bank 1C: Public Coupon Version, File and Record
        Descriptions.” Accessed: Nov. 25, 2026. [Online].
        Available:{' '}
        <a
            href="https://www.bts.gov/sites/bts.dot.gov/files/DB1C_Description_for_Coupon_3.pdf"
            target="_blank"
            rel="noopener noreferrer"
        >
            DB1C File and Record Descriptions
        </a>
    </p>

    <h4>Academic References</h4>

    <ul>
        <li>Course lecture notes</li>
        <li>Assignments 5 and 6</li>
        <li>Graph Theory Mini Project assignment</li>
    </ul>

    <h4>Development Resources</h4>

    <div className="infrastructure-table">
        <table>
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Resources</th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <td>Development tools</td>
                    <td>Visual Studio Code, Git, GitHub</td>
                </tr>

                <tr>
                    <td>Programming languages</td>
                    <td>Python, JavaScript, CSS</td>
                </tr>

                <tr>
                    <td>Libraries and frameworks</td>
                    <td>
                        NetworkX, airportsdata, Matplotlib,
                        Flask, React, Cytoscape.js
                    </td>
                </tr>

                <tr>
                    <td>Graph visualization</td>
                    <td>Gephi</td>
                </tr>

                <tr>
                    <td>Frontend development</td>
                    <td>Node.js, npm, Vite</td>
                </tr>

                <tr>
                    <td>Cloud infrastructure</td>
                    <td>AWS, Amazon EC2, Amazon Linux 2023</td>
                </tr>

                <tr>
                    <td>Production hosting</td>
                    <td>Gunicorn, Nginx, systemd</td>
                </tr>

                <tr>
                    <td>Automated deployment</td>
                    <td>GitHub Actions</td>
                </tr>

                <tr>
                    <td>Artificial intelligence</td>
                    <td>ChatGPT, GitHub Copilot</td>
                </tr>
            </tbody>
        </table>
    </div>

    <h4>Project Repository</h4>

    <p>
        <a
            href="https://github.com/Tjprimc09/CS291-Mini"
            target="_blank"
            rel="noopener noreferrer"
        >
            SkyMesh Source Code and Documentation
        </a>
    </p>

</section>

</section>

      </main>

      <footer className="site-footer">
        <span>SkyMesh · Graph theory × aviation</span>
        <a href="#home">Back to top ↑</a>
      </footer>

    </div>
  )
}

export default App
