import { useEffect, useRef, useState } from 'react'
import cytoscape from 'cytoscape'
import GraphControls from './GraphControls'
import { getData } from '../../services/api'
import graphStyles from './graphStyles'
import graphEvents from './graphEvents'
import graphHighlighting from './graphHighlighting'
import GraphCanvas from './GraphCanvas'


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

            style: graphStyles(network.directed)
        })

        graph.current = cy

        graphEvents(
            cy,
            pending,
            selection,
            setHovered,
            setClickedNodes,
            setBusy,
            setError,
            setResult,
            setState,
            setStart,
            setEnd
        )

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
        graphHighlighting(
            graph.current,
            network,
            result,
            hovered,
            clickedNodes,
            start,
            end
        )
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

            <GraphControls
                start={start}
                end={end}
                state={state}
                airports={airports}
                states={states}
                busy={busy}
                error={error}
                result={result}
                network={network}
                setStart={setStart}
                setEnd={setEnd}
                setState={setState}
                findPath={findPath}
                filterState={filterState}
                resetGraph={resetGraph}
                clearResult={clearResult}
            />

            {result?.path && (
                <div className="path-display" aria-live="polite">
                    <h3>Shortest path</h3>
                    <p className="path">{result.path.join(' → ')}</p>
                    <p>Total weight: {result.distance}</p>
                </div>
            )}

            <GraphCanvas
                graphContainer={graphContainer}
                graph={graph}
                network={network}
                loading={loading}
                inspectedNode={inspectedNode}
                neighbors={neighbors}
            />
        </section>
    )
}