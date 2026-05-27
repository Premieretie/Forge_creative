import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Instagram, Linkedin, Youtube, ArrowUpRight } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  const services = [
    'Corporate Videos',
    'Social Media Content',
    'Brand Films',
    'Event Coverage',
    'Real Estate Videos',
    'Podcast Production',
    'Testimonial Videos',
    'Commercial Ads'
  ]

  return (
    <footer className="bg-forge-charcoal border-t border-forge-gray">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-forge-accent flex items-center justify-center">
                <span className="text-forge-black font-bold text-lg">F</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-semibold text-lg">Forge Creative</span>
              </div>
            </Link>
            
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Brisbane's premier video production company creating cinematic content 
              that builds brands and drives engagement.
            </p>
            
            <div className="flex items-center gap-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-forge-dark flex items-center justify-center text-gray-400 hover:text-forge-accent hover:bg-forge-gray transition-all"
                aria-label="Follow us on Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-forge-dark flex items-center justify-center text-gray-400 hover:text-forge-accent hover:bg-forge-gray transition-all"
                aria-label="Connect on LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-forge-dark flex items-center justify-center text-gray-400 hover:text-forge-accent hover:bg-forge-gray transition-all"
                aria-label="Subscribe on YouTube"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-sm tracking-widest uppercase">
              Services
            </h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <Link 
                    to="/#services" 
                    className="text-gray-400 text-sm hover:text-forge-accent transition-colors"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-sm tracking-widest uppercase">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 text-sm hover:text-forge-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 text-sm hover:text-forge-accent transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/#services" className="text-gray-400 text-sm hover:text-forge-accent transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-400 text-sm hover:text-forge-accent transition-colors"
                >
                  Portfolio (Coming Soon)
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-sm tracking-widest uppercase">
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-forge-accent mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  Brisbane, Queensland, Australia
                </span>
              </li>
              <li>
                <a 
                  href="mailto:hello@forgecreative.com.au"
                  className="flex items-center gap-3 text-gray-400 text-sm hover:text-forge-accent transition-colors"
                >
                  <Mail size={18} className="text-forge-accent flex-shrink-0" />
                  hello@forgecreative.com.au
                </a>
              </li>
              <li>
                <a 
                  href="tel:+61-XXX-XXX-XXX"
                  className="flex items-center gap-3 text-gray-400 text-sm hover:text-forge-accent transition-colors"
                >
                  <Phone size={18} className="text-forge-accent flex-shrink-0" />
                  +61 XXX XXX XXX
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-forge-gray">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {currentYear} Forge Creative. All rights reserved. Brisbane Video Production.
            </p>
            
            <div className="flex items-center gap-6">
              <span className="text-gray-500 text-xs">
                Brisbane Video Production | Corporate Videographer Brisbane
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
