"use client";

import React from "react";
import { config } from "@/lib/config";
import { Phone } from "lucide-react";

interface StickyCallButtonProps {
  phone?: string;
  ctaText?: string;
}

export default function StickyCallButton({
  phone = config.phone,
  ctaText = config.ctaText,
}: StickyCallButtonProps) {
  const handleCall = () => {
    window.location.href = "tel:" + phone.replace(/\s/g, "");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden">
      <button
        onClick={handleCall}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 text-lg font-semibold text-white shadow-lg active:scale-[0.98] transition-transform"
        style={{ backgroundColor: config.primaryColor }}
      >
        <Phone className="w-6 h-6" />
        <span>{ctaText}</span>
        <span className="font-bold">{phone}</span>
      </button>
    </div>
  );
}
