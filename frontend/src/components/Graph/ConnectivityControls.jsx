export default function ConnectivityControls({
    metric,
    setMetric,
    order,
    setOrder,
    numAirports,
    setNumAirports,
    rankConnectivity,
    busy,
    network
}) {
    return (
        <div className="connectivity-controls">
            <h3>Rank connectivity</h3>

            <label htmlFor="connectivity-metric">
                Degree metric
            </label>

            <select
                id="connectivity-metric"
                value={metric}
                onChange={e => setMetric(e.target.value)}
            >
                <option value="total_degree">Total degree</option>
                <option value="in_degree">In-degree</option>
                <option value="out_degree">Out-degree</option>
            </select>

            <label htmlFor="ranking-order">
                Ranking order
            </label>

            <select
                id="ranking-order"
                value={order}
                onChange={e => setOrder(e.target.value)}
            >
                <option value="descending">Highest connectivity</option>
                <option value="ascending">Lowest connectivity</option>
            </select>

            <label htmlFor="num-airports">
                Number of airports
            </label>
            <div className="airport-count-controls">
                <input
                    type="range"
                    min={1}
                    max={network?.nodes.length || 1}
                    value={numAirports || 1}
                    onChange={e => setNumAirports(Number(e.target.value))}
                />

                <input
                    id="num-airports"
                    type="number"
                    min={1}
                    max={network?.nodes.length || 1}
                    value={numAirports}
                    onChange={e => setNumAirports(e.target.value)}
                    onBlur={() => {
                    if (numAirports === '' || numAirports < 1) {
                        setNumAirports(1)
                    } else if (numAirports > network.nodes.length) {
                        setNumAirports(network.nodes.length)
                    }
                    }}
                    disabled={!network || busy || !Number.isInteger(Number(numAirports)) || numAirports < 1 || numAirports > network.nodes.length}
                />
            </div>
            <button
                type="button"
                className="button primary"
                disabled={!network || busy}
                onClick={rankConnectivity}
            >
                Rank airports <span aria-hidden="true">→</span>
            </button>
        </div>

    )
}