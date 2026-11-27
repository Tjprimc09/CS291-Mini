import Problem from './Problem'
import Data from './Data'
import Graph from './Graph'
import Code from './Code'
import Infrastructure from './Infrastructure'
import Findings from './Findings'
import AI from './AI'
import Future from './Future'
import References from './References'

export default function ProjectDocumentation() {
    return (
    <section id="project" className="project-section">
        <p className="eyebrow"><span /> THE PROJECT</p>
        
        <h2>Behind Sky<span>Mesh</span></h2>
        
        <p>
        A graph theory project exploring airport connectivity 
        Built with Python, NetworkX, MatPlotLib, Flask, React, and Cytoscape.js.
        </p>

        <Problem />
        <Data /> 
        <Graph />
        <Code />
        <Infrastructure />
        <Findings />
        <AI /> 
        <Future />
        <References />
    </section>
    )
}