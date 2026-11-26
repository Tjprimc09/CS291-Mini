import { useEffect, useRef, useState } from 'react'
import cytoscape from 'cytoscape'

async function getData(url, signal) {
    const response = await fetch(url, { signal })
    const data = await response.json().catch(() => null)

    if (!response.ok || !data) {
        throw new Error(data?.error || `Request failed (${response.status}). Check the Flask server and Vite proxy.`)
    }

    return data
}

export default function AirportGraph() {

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
    )
}