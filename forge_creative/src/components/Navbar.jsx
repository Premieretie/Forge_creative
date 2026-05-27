import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/contact', label: 'Contact' }
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-forge-black/95 backdrop-blur-md py-4' 
          : 'bg-transparent py-6'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between" aria-label="Main navigation">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-3 group"
          aria-label="Forge Creative - Return to homepage"
        >
          <div className="w-10 h-10 bg-forge-accent flex items-center justify-center">
            <span className="text-forge-black font-bold text-lg">F</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-semibold text-lg tracking-tight group-hover:text-forge-accent transition-colors">
              Forge Creative
            </span>
            <span className="text-gray-400 text-xs tracking-widest uppercase">
              Brisbane Video Production
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link text-sm font-medium tracking-wide uppercase transition-colors ${
                location.pathname === link.path 
                  ? 'text-forge-accent' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          <Link
            to="/contact"
            className="btn-primary text-sm"
            aria-label="Get a quote for video production services"
          >
            Get a Quote
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 right-0 bg-forge-charcoal border-t border-forge-gray"
          >
            <div className="px-6 py-8 space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block text-lg font-medium ${
                    location.pathname === link.path 
                      ? 'text-forge-accent' 
                      : 'text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              <Link
                to="/contact"
                className="btn-primary w-full justify-center"
              >
                Get a Quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
