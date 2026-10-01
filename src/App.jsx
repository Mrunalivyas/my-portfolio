import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Journey from './components/Journey' // <-- Changed import
import Skills from './components/Skills'
import Projects from './components/Projects'
import Publications from './components/Publications'
import Certifications from './components/Certifications'
import Contact from './components/Contact'


function App() {
  return (
    <div className="bg-[#0B0F19] text-white min-h-screen">
      <Navbar />
      <main>
        <section id="hero"><Hero /></section>
        <section id="about"><About /></section>
        <section id="journey"><Journey /></section> {/* <-- Changed ID and component */}
        <section id="skills"><Skills /></section>
        <section id="projects"><Projects /></section>
        <section id="publications"><Publications /></section>
        <section id="certifications"><Certifications /></section>
        <section id="contact"><Contact /></section>
      </main>
    </div>
  )
}

export default App