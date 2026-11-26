export default function graphStyles(directed) {
    return [
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
                            'target-arrow-shape': directed ? 'triangle' : 'none',
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
                ]
}