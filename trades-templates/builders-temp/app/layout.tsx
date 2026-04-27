import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { config, getCssVariables } from "@/lib/config";

export const metadata: Metadata = {
  title: config.seo?.title || (config.businessName + " | " + config.suburb),
  description: config.seo?.description || ("Professional " + config.services.join(", ") + " services in " + config.suburb + ". Call " + config.phone + " for fast, reliable service."),
  keywords: config.seo?.keywords || (config.businessName + ", " + config.services.join(", ") + ", " + config.suburb),
  openGraph: {
    title: config.seo?.title || (config.businessName + " | " + config.suburb),
    description: config.seo?.description || ("Professional " + config.services.join(", ") + " services in " + config.suburb + "."),
    type: "website",
    locale: "en_AU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cssVars = getCssVariables();

  return (
    <html lang="en-AU">
      <head>
        <style>{`
          :root {
            ${Object.entries(cssVars).map(([key, value]) => `${key}: ${value};`).join("\n            ")}
          }
        `}</style>
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
