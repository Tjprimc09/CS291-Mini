import CollapsibleProjectSection from '../components/CollapsibleProjectSection'

export default function Problem() {
    return (
                  <CollapsibleProjectSection
                   id="problem" number="01" title="The Problem">
        
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
                  </CollapsibleProjectSection>
    )
}