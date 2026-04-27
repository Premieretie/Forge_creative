"use client";

import React from "react";
import { config } from "@/lib/config";
import { Star, Quote } from "lucide-react";
import { Testimonial as TestimonialType } from "@/lib/types";

interface TestimonialProps {
  testimonial?: TestimonialType;
}

export default function Testimonial({
  testimonial = config.testimonial,
}: TestimonialProps) {
  if (!testimonial) return null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 sm:p-12 text-white overflow-hidden">
            {/* Quote icon background */}
            <Quote className="absolute top-8 right-8 w-24 h-24 text-white/5" />

            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {renderStars(testimonial.rating || 5)}
            </div>

            {/* Quote text */}
            <blockquote className="text-xl sm:text-2xl md:text-3xl font-medium leading-relaxed mb-8">
              "{testimonial.text}"
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold"
                style={{ backgroundColor: config.primaryColor }}
              >
                {testimonial.name.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-lg">{testimonial.name}</div>
                <div className="text-white/70">
                  {testimonial.location || config.suburb}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
