"use client";

import React from "react";
import { config } from "@/lib/config";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from "lucide-react";

interface FooterProps {
  businessName?: string;
  phone?: string;
  email?: string;
  suburb?: string;
  services?: string[];
}

export default function Footer({
  businessName = config.businessName,
  phone = config.phone,
  email = config.email,
  suburb = config.suburb,
  services = config.services,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleCall = () => {
    window.location.href = "tel:" + phone.replace(/\s/g, "");
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold mb-4">{businessName}</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Professional services in {suburb}. Licensed, insured, and available 24/7 for all your needs.
            </p>
            <div className="flex gap-4">
              {config.social?.facebook && (
                <a
                  href={config.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {config.social?.instagram && (
                <a
                  href={config.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Services column */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Services</h4>
            <ul className="space-y-3">
              {services.slice(0, 5).map((service) => (
                <li key={service}>
                  <a
                    href="#services"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li>
                <button
                  onClick={handleCall}
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                >
                  <Phone className="w-5 h-5" style={{ color: config.primaryColor }} />
                  {phone}
                </button>
              </li>
              {email && (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                  >
                    <Mail className="w-5 h-5" style={{ color: config.primaryColor }} />
                    {email}
                  </a>
                </li>
              )}
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-5 h-5 mt-0.5" style={{ color: config.primaryColor }} />
                <span>{suburb}</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <Clock className="w-5 h-5 mt-0.5" style={{ color: config.primaryColor }} />
                <span>24/7 Emergency Available</span>
              </li>
            </ul>
          </div>

          {/* Hours column */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Business Hours</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              {config.businessHours ? (
                <>
                  <li className="flex justify-between">
                    <span>Mon - Fri:</span>
                    <span>{config.businessHours.monday}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Saturday:</span>
                    <span>{config.businessHours.saturday}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sunday:</span>
                    <span>{config.businessHours.sunday}</span>
                  </li>
                </>
              ) : (
                <li>24/7 Emergency Services Available</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© {currentYear} {businessName}. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
