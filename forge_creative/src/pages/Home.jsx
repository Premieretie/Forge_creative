import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Play, ArrowRight, Camera, Film, Video, Mic, 
  Home, Star, Clock, MapPin, Target, Quote as QuoteIcon,
  ChevronLeft, ChevronRight
} from 'lucide-react'
import SEO from '../components/SEO'
import QuoteModal from '../components/QuoteModal'

const Home = () => {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false)
  const [testimonialIndex, setTestimonialIndex] = useState(0)

  // Scroll reveal animation hook
  const useScrollReveal = () => {
    const ref = useRef(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(entry.target)
          }
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      )

      if (ref.current) {
        observer.observe(ref.current)
      }

      return () => observer.disconnect()
    }, [])

    return [ref, isVisible]
  }

  const services = [
    {
      icon: Film,
      title: 'Corporate Videos',
      description: 'Professional corporate video production for Brisbane businesses. Training videos, company overviews, and internal communications.'
    },
    {
      icon: Video,
      title: 'Social Media Content',
      description: 'Engaging short-form content optimised for Instagram, TikTok, LinkedIn and all major social platforms.'
    },
    {
      icon: Camera,
      title: 'Brand Films',
      description: 'Cinematic brand storytelling that captures your company essence and connects with your audience emotionally.'
    },
    {
      icon: Star,
      title: 'Event Coverage',
      description: 'Complete event videography for corporate events, conferences, launches, and special occasions in Brisbane.'
    },
    {
      icon: Home,
      title: 'Real Estate Content',
      description: 'Stunning property videos and virtual tours that help Brisbane real estate agents sell faster.'
    },
    {
      icon: Mic,
      title: 'Podcast Production',
      description: 'Full-service podcast production including recording, editing, and video podcast creation.'
    },
    {
      icon: QuoteIcon,
      title: 'Testimonial Videos',
      description: 'Authentic customer testimonial videos that build trust and convert prospects into customers.'
    },
    {
      icon: Play,
      title: 'Commercial Ads',
      description: 'High-impact commercial video production for TV, YouTube pre-roll, and digital advertising campaigns.'
    }
  ]

  const whyChooseUs = [
    { icon: Clock, title: 'Fast Turnaround', value: '48-72hr', description: 'Quick delivery without compromising quality' },
    { icon: Star, title: 'Commercial Quality', value: '4K+', description: 'Broadcast-ready production standards' },
    { icon: Target, title: 'Social Optimised', value: 'Multi-Format', description: 'Content sized for every platform' },
    { icon: MapPin, title: 'Brisbane Based', value: 'Local', description: 'Understanding of Brisbane market' },
    { icon: Target, title: 'Strategy Focused', value: 'Results', description: 'Content designed to drive outcomes' }
  ]

  const testimonials = [
    {
      quote: "Forge Creative transformed our brand presence with stunning video content. The team understood our vision perfectly.",
      author: "Sarah Mitchell",
      role: "Marketing Director",
      company: "Brisbane Tech Solutions"
    },
    {
      quote: "The best video production company we've worked with in Brisbane. Professional, creative, and delivered on time.",
      author: "James Chen",
      role: "CEO",
      company: "Pacific Realty Group"
    },
    {
      quote: "Our social media engagement increased 300% after working with Forge. Highly recommend for any Brisbane business.",
      author: "Emma Thompson",
      role: "Brand Manager",
      company: "Coastal Lifestyle Brands"
    }
  ]

  const nextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  // Section refs for scroll animations
  const [servicesRef, servicesVisible] = useScrollReveal()
  const [aboutRef, aboutVisible] = useScrollReveal()
  const [whyRef, whyVisible] = useScrollReveal()
  const [testimonialsRef, testimonialsVisible] = useScrollReveal()
  const [ctaRef, ctaVisible] = useScrollReveal()

  return (
    <>
      <SEO 
        pathname="/"
        title="Forge Creative | Brisbane Video Production Company"
        description="Premium video production services in Brisbane. Corporate videos, social media content, brand films, event coverage & more. Professional videographers creating cinematic content that builds brands."
      />

      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
            }}
          />
          <div className="absolute inset-0 bg-forge-black/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-forge-black via-transparent to-forge-black/50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-forge-accent text-sm tracking-[0.3em] uppercase mb-6 block">
              Brisbane Video Production
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
          >
            Brisbane Video Production
            <br />
            <span className="text-forge-accent">That Builds Brands</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10"
          >
            Corporate video production and social media content designed to help 
            Brisbane businesses grow. Cinematic quality, strategic focus, proven results.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={() => setIsQuoteOpen(true)}
              className="btn-primary"
            >
              Get a Quote
              <ArrowRight size={20} />
            </button>
            <a 
              href="#showcase" 
              className="btn-outline"
            >
              <Play size={20} />
              View Showcase Reel
            </a>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-forge-accent rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* VIDEO SHOWCASE SECTION */}
      <section id="showcase" className="py-24 bg-forge-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-forge-accent text-sm tracking-[0.3em] uppercase mb-4 block">
              Our Work
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Featured Production
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative aspect-video bg-forge-charcoal rounded-lg overflow-hidden"
          >
            {/* Placeholder for video - replace with actual embed */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-forge-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-forge-accent/40 transition-colors">
                  <Play size={32} className="text-forge-accent ml-1" />
                </div>
                <p className="text-gray-400">Showcase Reel Coming Soon</p>
              </div>
            </div>
            {/* Uncomment for actual video embed:
            <iframe 
              src="https://www.youtube.com/embed/VIDEO_ID?autoplay=1&mute=1&loop=1&playlist=VIDEO_ID" 
              title="Forge Creative Showreel"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
            */}
          </motion.div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-24 bg-forge-charcoal" ref={servicesRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={servicesVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-forge-accent text-sm tracking-[0.3em] uppercase mb-4 block">
              What We Do
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Video Production Services
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Full-service video production for Brisbane businesses. From concept to delivery, 
              we create content that drives results.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                animate={servicesVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="service-card p-8 group"
              >
                <service.icon 
                  size={40} 
                  className="text-forge-accent mb-6 group-hover:scale-110 transition-transform duration-300" 
                />
                <h3 className="text-xl font-semibold text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>
                <button 
                  onClick={() => setIsQuoteOpen(true)}
                  className="text-forge-accent text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all"
                >
                  Learn More
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-24 bg-forge-black" ref={aboutRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={aboutVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <span className="text-forge-accent text-sm tracking-[0.3em] uppercase mb-4 block">
                About Us
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Brisbane Video Production Experts
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                Forge Creative is a Brisbane-based video production company helping businesses 
                create cinematic content that drives engagement, builds trust, and grows brands. 
                We combine technical excellence with strategic thinking to deliver videos that 
                actually perform.
              </p>
              <p className="text-gray-400 leading-relaxed mb-8">
                From corporate video production to social media content creation, we work with 
                businesses across Brisbane and Queensland. Our team of experienced videographers, 
                editors, and creative strategists are dedicated to bringing your vision to life 
                with professional-grade equipment and proven workflows.
              </p>
              <button 
                onClick={() => setIsQuoteOpen(true)}
                className="btn-primary"
              >
                Start Your Project
                <ArrowRight size={20} />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={aboutVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[4/5] bg-forge-charcoal relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Professional videographer filming corporate content in Brisbane"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forge-black/60 to-transparent" />
              </div>
              {/* Floating stats */}
              <div className="absolute -bottom-6 -left-6 bg-forge-accent text-forge-black p-6">
                <span className="text-3xl font-bold block">50+</span>
                <span className="text-sm">Projects Delivered</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="py-24 bg-forge-charcoal" ref={whyRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={whyVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-forge-accent text-sm tracking-[0.3em] uppercase mb-4 block">
              Why Forge Creative
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              The Forge Difference
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              What sets us apart from other Brisbane video production companies
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={whyVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-forge-dark border border-forge-gray p-8 text-center group hover:border-forge-accent transition-all duration-300"
              >
                <div className="w-16 h-16 bg-forge-charcoal flex items-center justify-center mx-auto mb-6 group-hover:bg-forge-accent/20 transition-colors">
                  <item.icon size={28} className="text-forge-accent" />
                </div>
                <span className="text-2xl font-bold text-forge-accent block mb-2">
                  {item.value}
                </span>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-24 bg-forge-black" ref={testimonialsRef}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={testimonialsVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-forge-accent text-sm tracking-[0.3em] uppercase mb-4 block">
              Client Stories
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              What Our Clients Say
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={testimonialsVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative bg-forge-charcoal border border-forge-gray p-8 md:p-12">
              <QuoteIcon size={48} className="text-forge-accent/30 mb-6" />
              
              <blockquote className="text-xl md:text-2xl text-white leading-relaxed mb-8">
                "{testimonials[testimonialIndex].quote}"
              </blockquote>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">
                    {testimonials[testimonialIndex].author}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {testimonials[testimonialIndex].role}, {testimonials[testimonialIndex].company}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevTestimonial}
                    className="w-10 h-10 border border-forge-gray flex items-center justify-center text-gray-400 hover:text-white hover:border-forge-accent transition-all"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="w-10 h-10 border border-forge-gray flex items-center justify-center text-gray-400 hover:text-white hover:border-forge-accent transition-all"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Indicators */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setTestimonialIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === testimonialIndex ? 'bg-forge-accent w-6' : 'bg-forge-gray'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* QUOTE CTA SECTION */}
      <section className="py-24 bg-forge-charcoal relative overflow-hidden" ref={ctaRef}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={ctaVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
              Need Content That Actually Performs?
            </h2>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Let's create video content that drives engagement, builds trust, 
              and grows your Brisbane business.
            </p>
            <button 
              onClick={() => setIsQuoteOpen(true)}
              className="btn-primary text-lg px-12 py-5"
            >
              Request a Quote
              <ArrowRight size={24} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Quote Modal */}
      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </>
  )
}

export default Home
