export default function GraphCanvas({
    graphContainer,
    graph,
    network,
    loading,
    inspectedNode,
    neighbors
}) {
    return (
        <>
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
        </>
    )
}