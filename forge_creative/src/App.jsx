import { Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Contact from './pages/Contact'
import './index.css'

function App() {
  return (
    <div className="relative min-h-screen bg-forge-black">
      {/* Cinematic grain overlay */}
      <div className="grain-overlay" aria-hidden="true" />
      
      <Navbar />
      
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </AnimatePresence>
      
      <Footer />
    </div>
  )
}

export default App
