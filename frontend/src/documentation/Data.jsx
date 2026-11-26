import CollapsibleProjectSection from '../components/CollapsibleProjectSection'

export default function Data() {
    return (
        <CollapsibleProjectSection id="data" number="02" title="The Data">
        
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
        
        </CollapsibleProjectSection>
    )
}