export default function ConnectivityResults({ result }) {

    // Only display results when connectivity ranking is active.
    if (!result?.rankings?.length) return null

    const rankings = result.rankings

    // Determine the degree range of the selected airports.
    const minDegree = Math.min(...rankings.map(airport => airport.degree))
    const maxDegree = Math.max(...rankings.map(airport => airport.degree))
    const range = maxDegree - minDegree

    // Calculate the same color used in graphHighlighting.js.
    function getColor(degree) {
        const ratio = range === 0 ? 0.5 : (degree - minDegree) / range
        const lightness = 44 - (24 * ratio)

        return `hsl(145, 61%, ${lightness}%)`
    }

    const metricNames = {
        in_degree: 'In-degree',
        out_degree: 'Out-degree',
        total_degree: 'Total degree'
    }

    return (
        <>
            <div className="connectivity-legend">

                <div
                    className="connectivity-gradient"
                    style={{
                        background: `linear-gradient(to right,
                            ${getColor(minDegree)},
                            ${getColor(maxDegree)})`
                    }}
                />

                <div className="connectivity-legend-labels">
                    <span>Lowest degree: {minDegree}</span>
                    <span>Highest degree: {maxDegree}</span>
                </div>

            </div>

            <div className="connectivity-results">
                <h3>Connectivity rankings</h3>

                <p>
                    {rankings.length} airports ranked by{' '}
                    {metricNames[result.metric].toLowerCase()}
                    {' · '}
                    {result.order === 'descending'
                        ? 'Highest connectivity'
                        : 'Lowest connectivity'}
                </p>

                <div className="connectivity-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Airport</th>
                                <th>In-degree</th>
                                <th>Out-degree</th>
                                <th>Total degree</th>
                            </tr>
                        </thead>

                        <tbody>
                            {rankings.map((airport, index) => (
                                <tr key={airport.id}>
                                    <td>{index + 1}</td>

                                    <td>
                                        <span
                                            className="connectivity-indicator"
                                            style={{
                                                backgroundColor: getColor(airport.degree)
                                            }}
                                        />
                                        {airport.id}
                                    </td>

                                    <td>{airport.in_degree}</td>
                                    <td>{airport.out_degree}</td>
                                    <td>{airport.total_degree}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}