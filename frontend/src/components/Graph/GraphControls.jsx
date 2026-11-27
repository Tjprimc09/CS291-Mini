import ConnectivityControls from './ConnectivityControls'

export default function GraphControls({
    start,
    end,
    state,
    airports,
    states,
    busy,
    error,
    result,
    network,
    setStart,
    setEnd,
    setState,
    findPath,
    filterState,
    resetGraph,
    clearResult,
    metric,
    setMetric,
    order,
    setOrder,
    numAirports,
    setNumAirports,
    rankConnectivity
}) {
    return (
            <div className="graph-controls">
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
                </div>
                
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


                <ConnectivityControls
                    metric={metric}
                    setMetric={setMetric}
                    order={order}
                    setOrder={setOrder}
                    numAirports={numAirports}
                    setNumAirports={setNumAirports}
                    rankConnectivity={rankConnectivity}
                    busy={busy}
                    network={network}
                />

                <button
                        type="button"
                        className="button secondary"
                        disabled={!network}
                        onClick={resetGraph}
                    >
                        Reset graph
                </button>

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
    )
}