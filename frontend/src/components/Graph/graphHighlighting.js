export default function graphHighlighting(
    cy,
    network,
    result,
    hovered,
    clickedNodes,
    start,
    end
) {
    if (!cy) return

    // Apply all style changes together to avoid intermediate redraws.
    cy.batch(() => {

        // Remove custom colors from previously ranked nodes.
        cy.nodes('.ranked').removeStyle()

        // Clear previous highlighting classes.
        cy.elements().removeClass('dimmed highlighted start end ranked')

        // Connectivity ranking
        if (result?.rankings) {

            // Dim all nodes and edges.
            cy.elements().addClass('dimmed')

            // Determine the network-wide degree range.
            const minDegree = Math.min(...result.rankings.map(airport => airport.degree))
            const maxDegree = Math.max(...result.rankings.map(airport => airport.degree))
            const range = maxDegree - minDegree

            for (const airport of result.rankings) {

                // Determine the airport's relative connectivity from 0 to 1.
                const ratio = range === 0
                    ? 0.5
                    : (airport.degree - minDegree) / range

            
                // Interpolate between light green and dark green.
                // Maintain a consistent green hue and saturation.
                const lightness = 44 - (24 * ratio)
                const color = `hsl(145, 61%, ${lightness}%)`

                // Highlight the airport using its calculated color.
                cy.getElementById(airport.id)
                    .removeClass('dimmed')
                    .addClass('highlighted ranked')
                    .style({
                        'background-color': color,
                        'border-color': color,
                        'underlay-color': color,
                        'z-index': 10
                    })
            }

        // Shortest path and state filtering
        } else if (result) {
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
            if (result.path) {
                cy.edges().filter(edge =>
                    links.has(JSON.stringify([
                        edge.source().id(),
                        edge.target().id()
                    ])) ||
                    (!network.directed && links.has(JSON.stringify([
                        edge.target().id(),
                        edge.source().id()
                    ])))
                ).removeClass('dimmed').addClass('highlighted')
            }

        // Hovering and individual airport selection
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
}