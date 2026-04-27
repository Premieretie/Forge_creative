"use client";

import React, { useState, FormEvent } from "react";
import { config } from "@/lib/config";
import { Send, User, Phone, MessageSquare, CheckCircle } from "lucide-react";

interface FormData {
  name: string;
  phone: string;
  email: string;
  message: string;
  service: string;
}

interface ContactFormProps {
  services?: string[];
}

export default function ContactForm({ services = config.services }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    message: "",
    service: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // TODO: Replace with your API endpoint (Resend, webhook, etc.)
      // Example API call:
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...formData,
      //     businessName: config.businessName,
      //     to: config.email,
      //   }),
      // });

      // For now, console.log the submission
      console.log("Form submission:", {
        ...formData,
        businessName: config.businessName,
        submittedAt: new Date().toISOString(),
      });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSubmitted(true);
      setFormData({ name: "", phone: "", email: "", message: "", service: "" });
    } catch (err) {
      setError("Something went wrong. Please try again or call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-800 mb-2">Message Sent!</h3>
        <p className="text-green-700 mb-6">
          Thank you for contacting us. We will get back to you within 24 hours.
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
          Full Name *
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{ focusRing: config.primaryColor }}
            placeholder="John Smith"
          />
        </div>
      </div>

      {/* Phone & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all"
              placeholder="0400 000 000"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all"
              placeholder="john@example.com"
            />
          </div>
        </div>
      </div>

      {/* Service */}
      <div>
        <label htmlFor="service" className="block text-sm font-semibold text-gray-700 mb-2">
          Service Required
        </label>
        <select
          id="service"
          name="service"
          value={formData.service}
          onChange={handleChange}
          className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all appearance-none"
        >
          <option value="">Select a service...</option>
          {services.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
          Message *
        </label>
        <div className="relative">
          <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none"
            placeholder="Tell us about your project or emergency..."
          />
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white rounded-xl transition-all duration-200 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
        style={{ backgroundColor: config.primaryColor }}
        onMouseEnter={(e) =>
          !isSubmitting && (e.currentTarget.style.backgroundColor = "var(--primary-dark)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = config.primaryColor)
        }
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Sending...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Send Message
          </>
        )}
      </button>

      <p className="text-center text-sm text-gray-500">
        Or call us directly at{" "}
        <a href={`tel:${config.phone.replace(/\s/g, "")}`} className="font-semibold hover:underline" style={{ color: config.primaryColor }}>
          {config.phone}
        </a>
      </p>
    </form>
  );
}
