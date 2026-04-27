import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Testimonial from "@/components/Testimonial";
import CTA from "@/components/CTA";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import StickyCallButton from "@/components/StickyCallButton";
import { config } from "@/lib/config";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Services Section */}
      <Services />

      {/* About Section */}
      <About />

      {/* Testimonial Section */}
      <Testimonial />

      {/* CTA Banner */}
      <CTA />

      {/* Contact Section */}
      <section id="contact" className="py-20 sm:py-28 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Info */}
            <div>
              <span
                className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
                style={{ backgroundColor: "var(--primary-light)", color: config.primaryColor }}
              >
                Get In Touch
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Request a Free Quote
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Fill out the form and our team will get back to you within 24 hours. 
                For emergencies, please call directly.
              </p>

              {/* Quick contact details */}
              <div className="space-y-4">
                <a
                  href={`tel:${config.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "var(--primary-light)" }}
                  >
                    <svg
                      className="w-6 h-6"
                      style={{ color: config.primaryColor }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Phone</div>
                    <div className="text-lg font-semibold text-gray-900">{config.phone}</div>
                  </div>
                </a>

                {config.email && (
                  <a
                    href={`mailto:${config.email}`}
                    className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "var(--primary-light)" }}
                    >
                      <svg
                        className="w-6 h-6"
                        style={{ color: config.primaryColor }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="text-lg font-semibold text-gray-900">{config.email}</div>
                    </div>
                  </a>
                )}

                <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "var(--primary-light)" }}
                  >
                    <svg
                      className="w-6 h-6"
                      style={{ color: config.primaryColor }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Service Area</div>
                    <div className="text-lg font-semibold text-gray-900">{config.suburb}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Sticky Call Button (Mobile Only) */}
      <StickyCallButton />
    </main>
  );
}
