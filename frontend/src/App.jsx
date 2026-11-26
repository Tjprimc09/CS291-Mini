import './App.css'
import Problem from './documentation/Problem'
import Data from './documentation/Data'
import Graph from './documentation/Graph'
import Code from './documentation/Code'
import Infrastructure from './documentation/Infrastructure'
import Findings from './documentation/Findings'
import Members from './documentation/Members'
import AI from './documentation/AI'
import Future from './documentation/Future'
import References from './documentation/References'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import AirportGraph from './components/AirportGraph'
import Footer from './components/Footer'

function App() {
  return (
    <div className="skymesh">
      <Header />

      <main>
        <Hero />
        <Features />
        <AirportGraph />

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
        <Members />
        <AI /> 
        <Future />
        <References />
        </section>

    </main>

    <Footer />

</div>
  )
}

export default App
