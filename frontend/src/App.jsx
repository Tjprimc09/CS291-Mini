import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import AirportGraph from './components/Graph/AirportGraph'
import Footer from './components/Footer'
import ProjectDocumentation from './documentation/ProjectDocumentation'

function App() {
  return (
    <div className="skymesh">
        <Header />
        <main>
            <Hero />
            <AirportGraph />
            <ProjectDocumentation />
        </main>
        <Footer />
    </div>
  )
}

export default App
