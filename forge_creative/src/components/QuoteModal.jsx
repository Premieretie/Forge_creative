import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, ChevronRight, ChevronLeft, Send } from 'lucide-react'

const QuoteModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    services: [],
    deliverables: '',
    budget: '',
    timeline: '',
    name: '',
    company: '',
    email: '',
    phone: '',
    description: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const services = [
    'Corporate Video',
    'Social Media Content',
    'Photography',
    'Podcast Production',
    'Event Coverage',
    'Drone Footage',
    'Real Estate Content',
    'Testimonial Videos',
    'Commercial Ads',
    'Editing Only'
  ]

  const deliverables = ['1-3', '4-10', '10+']
  const budgets = ['Under $1,000', '$1,000–$3,000', '$3,000–$10,000', '$10,000+']
  const timelines = ['ASAP', 'Within 2 weeks', 'Within 1 month', 'Flexible']

  const toggleService = (service) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }))
  }

  const handleNext = () => {
    if (step < 5) setStep(step + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitted(true)
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData)
  }

  const handleClose = () => {
    onClose()
    // Reset after animation
    setTimeout(() => {
      setStep(1)
      setIsSubmitted(false)
      setFormData({
        services: [],
        deliverables: '',
        budget: '',
        timeline: '',
        name: '',
        company: '',
        email: '',
        phone: '',
        description: ''
      })
    }, 300)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          onClick={handleClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative bg-forge-charcoal border border-forge-gray w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>

          {/* Content */}
          <div className="p-8 md:p-12">
            {isSubmitted ? (
              // Success Screen
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-forge-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={40} className="text-forge-black" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Thanks for reaching out!
                </h2>
                <p className="text-gray-400 text-lg">
                  Forge Creative will contact you shortly.
                </p>
              </motion.div>
            ) : (
              <>
                {/* Step Indicators */}
                <div className="flex items-center justify-center gap-2 mb-8">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div
                      key={s}
                      className={`step-indicator ${s === step ? 'active' : ''}`}
                    />
                  ))}
                </div>

                {/* Step Content */}
                <form onSubmit={step === 5 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <h2 className="text-2xl font-bold text-white mb-2">
                        What services do you need?
                      </h2>
                      <p className="text-gray-400 mb-8">Select all that apply</p>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {services.map((service) => (
                          <button
                            key={service}
                            type="button"
                            onClick={() => toggleService(service)}
                            className={`p-4 text-left border transition-all ${
                              formData.services.includes(service)
                                ? 'border-forge-accent bg-forge-accent/10 text-white'
                                : 'border-forge-gray text-gray-400 hover:border-forge-light'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm">{service}</span>
                              {formData.services.includes(service) && (
                                <Check size={16} className="text-forge-accent" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <h2 className="text-2xl font-bold text-white mb-2">
                        How many deliverables do you need?
                      </h2>
                      <p className="text-gray-400 mb-8">Choose one option</p>
                      
                      <div className="space-y-3">
                        {deliverables.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setFormData({ ...formData, deliverables: option })}
                            className={`w-full p-4 text-left border transition-all ${
                              formData.deliverables === option
                                ? 'border-forge-accent bg-forge-accent/10 text-white'
                                : 'border-forge-gray text-gray-400 hover:border-forge-light'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option}</span>
                              {formData.deliverables === option && (
                                <Check size={20} className="text-forge-accent" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <h2 className="text-2xl font-bold text-white mb-2">
                        What is your estimated budget?
                      </h2>
                      <p className="text-gray-400 mb-8">Choose one option</p>
                      
                      <div className="space-y-3">
                        {budgets.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setFormData({ ...formData, budget: option })}
                            className={`w-full p-4 text-left border transition-all ${
                              formData.budget === option
                                ? 'border-forge-accent bg-forge-accent/10 text-white'
                                : 'border-forge-gray text-gray-400 hover:border-forge-light'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option}</span>
                              {formData.budget === option && (
                                <Check size={20} className="text-forge-accent" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <h2 className="text-2xl font-bold text-white mb-2">
                        What is your timeline?
                      </h2>
                      <p className="text-gray-400 mb-8">Choose one option</p>
                      
                      <div className="space-y-3">
                        {timelines.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setFormData({ ...formData, timeline: option })}
                            className={`w-full p-4 text-left border transition-all ${
                              formData.timeline === option
                                ? 'border-forge-accent bg-forge-accent/10 text-white'
                                : 'border-forge-gray text-gray-400 hover:border-forge-light'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option}</span>
                              {formData.timeline === option && (
                                <Check size={20} className="text-forge-accent" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === 5 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <h2 className="text-2xl font-bold text-white mb-2">
                        Tell us about your project
                      </h2>
                      <p className="text-gray-400 mb-8">Fill in your details</p>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Your Name *"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                          <input
                            type="text"
                            placeholder="Company Name"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          />
                        </div>
                        <input
                          type="email"
                          placeholder="Email Address *"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <input
                          type="tel"
                          placeholder="Phone Number"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                        <textarea
                          placeholder="Tell us about your project..."
                          rows={4}
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between mt-8 pt-8 border-t border-forge-gray">
                    <button
                      type="button"
                      onClick={handlePrev}
                      disabled={step === 1}
                      className={`flex items-center gap-2 text-sm font-medium ${
                        step === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <ChevronLeft size={18} />
                      Back
                    </button>

                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      {step === 5 ? (
                        <>
                          Submit Request
                          <Send size={18} />
                        </>
                      ) : (
                        <>
                          Next Step
                          <ChevronRight size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default QuoteModal
