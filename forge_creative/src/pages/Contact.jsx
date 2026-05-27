import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, Phone, MapPin, Instagram, Linkedin, Youtube, 
  Send, ArrowRight, Clock, Check
} from 'lucide-react'
import SEO from '../components/SEO'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitted(true)
    // Here you would send the data to your backend
    console.log('Contact form submitted:', formData)
  }

  const services = [
    'Corporate Video',
    'Social Media Content',
    'Brand Film',
    'Event Coverage',
    'Real Estate Video',
    'Podcast Production',
    'Testimonial Video',
    'Commercial Ad',
    'Other'
  ]

  return (
    <>
      <SEO 
        pathname="/contact"
        title="Contact | Forge Creative - Brisbane Video Production"
        description="Get in touch with Forge Creative for professional video production services in Brisbane. Corporate videos, social media content, brand films & more."
        keywords="Contact Brisbane Video Production, Brisbane Videographer Contact, Corporate Video Production Brisbane Quote"
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-forge-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="text-forge-accent text-sm tracking-[0.3em] uppercase mb-4 block">
              Get In Touch
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Let's Create Something Great
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Ready to elevate your brand with professional video content? 
              We'd love to hear about your project.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-forge-charcoal">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-white mb-8">
                Contact Information
              </h2>
              
              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-forge-dark flex items-center justify-center flex-shrink-0">
                    <MapPin size={24} className="text-forge-accent" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Location</h3>
                    <p className="text-gray-400">
                      Brisbane, Queensland, Australia
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Servicing Brisbane, Gold Coast, Sunshine Coast & beyond
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-forge-dark flex items-center justify-center flex-shrink-0">
                    <Mail size={24} className="text-forge-accent" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Email</h3>
                    <a 
                      href="mailto:hello@forgecreative.com.au"
                      className="text-forge-accent hover:text-white transition-colors"
                    >
                      hello@forgecreative.com.au
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-forge-dark flex items-center justify-center flex-shrink-0">
                    <Phone size={24} className="text-forge-accent" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Phone</h3>
                    <a 
                      href="tel:+61-XXX-XXX-XXX"
                      className="text-forge-accent hover:text-white transition-colors"
                    >
                      +61 XXX XXX XXX
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-forge-dark flex items-center justify-center flex-shrink-0">
                    <Clock size={24} className="text-forge-accent" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Business Hours</h3>
                    <p className="text-gray-400">
                      Monday – Friday: 9:00 AM – 6:00 PM AEST
                    </p>
                    <p className="text-gray-500 text-sm">
                      Weekend shoots available by appointment
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-white font-semibold mb-4">Follow Us</h3>
                <div className="flex items-center gap-4">
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-forge-dark flex items-center justify-center text-gray-400 hover:text-forge-accent hover:bg-forge-gray transition-all"
                    aria-label="Follow us on Instagram"
                  >
                    <Instagram size={22} />
                  </a>
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-forge-dark flex items-center justify-center text-gray-400 hover:text-forge-accent hover:bg-forge-gray transition-all"
                    aria-label="Connect on LinkedIn"
                  >
                    <Linkedin size={22} />
                  </a>
                  <a 
                    href="https://youtube.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-forge-dark flex items-center justify-center text-gray-400 hover:text-forge-accent hover:bg-forge-gray transition-all"
                    aria-label="Subscribe on YouTube"
                  >
                    <Youtube size={22} />
                  </a>
                </div>
              </div>

              {/* Quick Response Badge */}
              <div className="mt-12 p-6 bg-forge-dark border-l-4 border-forge-accent">
                <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <Check size={18} className="text-forge-accent" />
                  Quick Response Guarantee
                </h4>
                <p className="text-gray-400 text-sm">
                  We respond to all inquiries within 24 hours. 
                  Urgent project? Call us directly for immediate assistance.
                </p>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-forge-dark border border-forge-gray p-8 md:p-10">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-forge-accent rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check size={40} className="text-forge-black" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Message Sent!
                    </h3>
                    <p className="text-gray-400">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-white mb-6">
                      Send Us a Message
                    </h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-400 text-sm mb-2">
                            Your Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="John Smith"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-sm mb-2">
                            Company Name
                          </label>
                          <input
                            type="text"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            placeholder="Your Company"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-400 text-sm mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="john@company.com"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-sm mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+61 XXX XXX XXX"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-400 text-sm mb-2">
                          Service Interested In
                        </label>
                        <select
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        >
                          <option value="">Select a service...</option>
                          {services.map((service) => (
                            <option key={service} value={service}>
                              {service}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-400 text-sm mb-2">
                          Tell Us About Your Project *
                        </label>
                        <textarea
                          required
                          rows={5}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Describe your project, timeline, and any specific requirements..."
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn-primary w-full justify-center"
                      >
                        Send Message
                        <Send size={18} />
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-96 bg-forge-dark relative">
        {/* Google Maps Embed Placeholder - Replace with actual embed */}
        <div className="absolute inset-0 flex items-center justify-center bg-forge-charcoal">
          <div className="text-center">
            <MapPin size={48} className="text-forge-accent mx-auto mb-4" />
            <p className="text-white text-lg font-semibold mb-2">Brisbane, Queensland</p>
            <p className="text-gray-400">Australia</p>
          </div>
        </div>
        {/* 
        Uncomment for actual Google Maps embed:
        <iframe
          src="https://www.google.com/maps/embed?pb=YOUR_MAP_EMBED_URL"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Forge Creative Brisbane Location"
        />
        */}
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-forge-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            Whether you need a single video or ongoing content production, 
            we're here to help bring your vision to life.
          </p>
          <a 
            href="tel:+61-XXX-XXX-XXX" 
            className="btn-primary text-lg px-10 py-5"
          >
            <Phone size={22} />
            Call Us Now
          </a>
        </div>
      </section>
    </>
  )
}

export default Contact
