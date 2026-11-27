import CollapsibleProjectSection from '../components/CollapsibleProjectSection'

export default function Code() {
    return (
        <CollapsibleProjectSection id="code" number="04" title="The Code">
        
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
        
        </CollapsibleProjectSection>
    )
}