"use client";

import React from "react";
import { config } from "@/lib/config";
import { Wrench, Droplets, Flame, AlertCircle, Search } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  "Blocked Drains": <Droplets className="w-8 h-8" />,
  "Hot Water": <Flame className="w-8 h-8" />,
  "Hot Water Systems": <Flame className="w-8 h-8" />,
  "Emergency Plumbing": <AlertCircle className="w-8 h-8" />,
  "Leak Detection": <Search className="w-8 h-8" />,
  "Gas Fitting": <Flame className="w-8 h-8" />,
  default: <Wrench className="w-8 h-8" />,
};

interface ServiceCardProps {
  service: string;
  index: number;
}

function ServiceCard({ service, index }: ServiceCardProps) {
  const icon = iconMap[service] || iconMap.default;

  return (
    <div
      className="group relative p-6 sm:p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary/20 transition-all duration-300"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Icon */}
      <div
        className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6 transition-colors duration-300"
        style={{ backgroundColor: "var(--primary-light)", color: config.primaryColor }}
      >
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-3">{service}</h3>

      {/* Description */}
      <p className="text-gray-600 leading-relaxed">
        Professional {service.toLowerCase()} services for residential and commercial properties in {config.suburb}.
      </p>

      {/* Arrow link */}
      <div className="mt-6 flex items-center gap-2 font-semibold transition-colors duration-200" style={{ color: config.primaryColor }}>
        <span>Learn more</span>
        <svg
          className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </div>
  );
}

interface ServicesProps {
  services?: string[];
}

export default function Services({ services = config.services }: ServicesProps) {
  return (
    <section id="services" className="py-20 sm:py-28 bg-gray-50">
      <div className="container-custom">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ backgroundColor: "var(--primary-light)", color: config.primaryColor }}
          >
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Expert {config.businessName} Services in {config.suburb}
          </h2>
          <p className="text-lg text-gray-600">
            We provide a comprehensive range of professional services to meet all your needs
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
