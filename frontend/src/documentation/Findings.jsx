import CollapsibleProjectSection from "../components/CollapsibleProjectSection";

export default function Findings() {
    return (
    <CollapsibleProjectSection id="findings" number="06" title="Findings and Observations">
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

   <p>We measured connectivity in two ways:</p>

        <ul>
            <li>
                <strong>In-degree:</strong> Number of incoming edges.
            </li>
            <li>
                <strong>Out-degree:</strong> Number of outgoing edges.
            </li>
        </ul>

        <div className="infrastructure-table">
            <table>
                <thead>
                    <tr>
                        <th>Airport</th>
                        <th>In-degree</th>
                        <th>Out-degree</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>ORD</td>
                        <td>111</td>
                        <td>113</td>
                    </tr>
                    <tr>
                        <td>DEN</td>
                        <td>111</td>
                        <td>109</td>
                    </tr>
                    <tr>
                        <td>DFW</td>
                        <td>107</td>
                        <td>109</td>
                    </tr>
                    <tr>
                        <td>MCI</td>
                        <td>76</td>
                        <td>73</td>
                    </tr>
                    <tr>
                        <td>ITO</td>
                        <td>5</td>
                        <td>3</td>
                    </tr>
                    <tr>
                        <td>KTN</td>
                        <td>4</td>
                        <td>3</td>
                    </tr>
                    <tr>
                        <td>ART</td>
                        <td>3</td>
                        <td>3</td>
                    </tr>
                    <tr>
                        <td>INL</td>
                        <td>2</td>
                        <td>4</td>
                    </tr>
                    <tr>
                        <td>SBD</td>
                        <td>1</td>
                        <td>1</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <p>
            ORD is the most connected airport in our graph, with
            111 incoming and 113 outgoing edges. SBD is the least
            connected airport, with one incoming and one outgoing edge.
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

        <h4>Euler Circuits</h4>

        <p>
        In Assignment 6, we identified that a connected undirected
        graph contains an Euler circuit if <strong>every vertex has
        an even degree.</strong>
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

</CollapsibleProjectSection>
    )
}