"use client";

import React from "react";
import { config } from "@/lib/config";
import { Phone, Clock, MapPin } from "lucide-react";

interface CTAProps {
  phone?: string;
  suburb?: string;
  ctaText?: string;
}

export default function CTA({
  phone = config.phone,
  suburb = config.suburb,
  ctaText = config.ctaText,
}: CTAProps) {
  const handleCall = () => {
    window.location.href = "tel:" + phone.replace(/\s/g, "");
  };

  return (
    <section className="py-16 sm:py-20" style={{ backgroundColor: config.primaryColor }}>
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Text content */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Need Emergency Help?
            </h2>
            <p className="text-white/90 text-lg">
              Our team is available 24/7 in {suburb}. Call now for immediate assistance.
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleCall}
            className="group flex items-center gap-4 px-8 py-5 bg-white rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "var(--primary-light)" }}
            >
              <Phone className="w-6 h-6" style={{ color: config.primaryColor }} />
            </div>
            <div className="text-left">
              <div className="text-sm text-gray-600 font-medium">{ctaText}</div>
              <div className="text-2xl font-bold text-gray-900">{phone}</div>
            </div>
          </button>
        </div>

        {/* Trust badges */}
        <div className="mt-12 pt-8 border-t border-white/20 flex flex-wrap justify-center gap-8 text-white/80">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span>24/7 Availability</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <span>Serving {suburb}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Fully Licensed</span>
          </div>
        </div>
      </div>
    </section>
  );
}
