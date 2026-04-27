"use client";

import React from "react";
import { config } from "@/lib/config";
import { CheckCircle2 } from "lucide-react";

interface AboutProps {
  title?: string;
  text?: string;
  features?: string[];
}

export default function About({
  title = config.aboutTitle || "About Us",
  text = config.aboutText || "We are a trusted local business serving the community with professional services and exceptional customer care.",
  features = config.aboutFeatures || ["Licensed & Insured", "Years of Experience", "Quality Guaranteed", "Local Service"],
}: AboutProps) {
  return (
    <section id="about" className="py-20 sm:py-28 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image side */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
              {/* Placeholder image - replace with actual image in production */}
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center p-8">
                  <div
                    className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: "var(--primary-light)" }}
                  >
                    <svg
                      className="w-12 h-12"
                      style={{ color: config.primaryColor }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500">
                    Add your team photo to <code className="bg-gray-200 px-2 py-1 rounded text-sm">site-config.json</code>
                  </p>
                </div>
              </div>
            </div>
            {/* Experience badge */}
            <div
              className="absolute -bottom-6 -right-6 w-32 h-32 rounded-2xl flex flex-col items-center justify-center text-white shadow-xl"
              style={{ backgroundColor: config.primaryColor }}
            >
              <span className="text-4xl font-bold">15+</span>
              <span className="text-sm opacity-90">Years Exp.</span>
            </div>
          </div>

          {/* Content side */}
          <div>
            <span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
              style={{ backgroundColor: "var(--primary-light)", color: config.primaryColor }}
            >
              Who We Are
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              {title}
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {text}
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <CheckCircle2
                    className="w-6 h-6 flex-shrink-0"
                    style={{ color: config.primaryColor }}
                  />
                  <span className="font-medium text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
