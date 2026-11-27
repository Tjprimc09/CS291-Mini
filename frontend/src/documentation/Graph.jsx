import CollapsibleProjectSection from '../components/CollapsibleProjectSection'

export default function Graph() {
    return (
        <CollapsibleProjectSection id="graph-development" number="03" title="The Graph">
        
            <h4>Mathematical Modeling</h4>
        
            <p>
                Our objective was to construct a graph that modeled the
                connectivity of America's international airport network
                while preserving its geographic structure.
            </p>
        
            <p>
                Using the NetworkX Python library, we constructed a weighted
                directed graph, mathematically represented as G = (V, E)
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
                An important characteristic of the graph is its ability to accommodate both one-way and
                bidirectional connections.Of the 6,879 directed edges in the resulting graph,
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
        
        </CollapsibleProjectSection>
    )
}