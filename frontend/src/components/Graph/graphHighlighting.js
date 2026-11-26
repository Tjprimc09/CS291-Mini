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

    }