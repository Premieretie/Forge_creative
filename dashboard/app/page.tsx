"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Building2,
  Phone,
  MapPin,
  Briefcase,
  Palette,
  Type,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  FolderOpen,
  ArrowRight,
  Copy,
  ExternalLink,
} from "lucide-react";

interface FormData {
  businessName: string;
  phone: string;
  suburb: string;
  services: string;
  primaryColor: string;
  heroTitle: string;
  heroSubtitle: string;
  email: string;
  state: string;
}

interface GeneratedSite {
  name: string;
  slug: string;
  path: string;
  configPath: string;
}

const initialFormData: FormData = {
  businessName: "",
  phone: "",
  suburb: "",
  services: "",
  primaryColor: "#0A84FF",
  heroTitle: "",
  heroSubtitle: "",
  email: "",
  state: "QLD",
};

export default function Dashboard() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedSite, setGeneratedSite] = useState<GeneratedSite | null>(null);
  const [nextSteps, setNextSteps] = useState<string[]>([]);
  const [generatedSites, setGeneratedSites] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // Load previously generated sites on mount
  useEffect(() => {
    fetchGeneratedSites();
  }, []);

  const fetchGeneratedSites = async () => {
    try {
      const response = await fetch("/api/sites");
      if (response.ok) {
        const data = await response.json();
        setGeneratedSites(data.sites || []);
      }
    } catch {
      // Silently fail - optional endpoint
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);
    setGeneratedSite(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to generate site");
      }

      setGeneratedSite(data.project);
      setNextSteps(data.nextSteps || []);
      setFormData(initialFormData);
      fetchGeneratedSites();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Site Generator</h1>
              <p className="text-sm text-slate-500">Create tradie websites in seconds</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="card p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Client Details
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Business Name */}
                <div>
                  <label
                    htmlFor="businessName"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="ABC Plumbing"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Phone & Suburb */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="0400 000 000"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="suburb"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Suburb <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        id="suburb"
                        name="suburb"
                        value={formData.suburb}
                        onChange={handleChange}
                        placeholder="Brisbane"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div>
                  <label
                    htmlFor="services"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Services <span className="text-red-500">*</span>
                    <span className="text-slate-400 font-normal ml-1">(comma-separated)</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <textarea
                      id="services"
                      name="services"
                      value={formData.services}
                      onChange={handleChange}
                      placeholder="Blocked Drains, Hot Water Systems, Emergency Plumbing, Leak Detection"
                      rows={2}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      required
                    />
                  </div>
                </div>

                {/* Primary Color */}
                <div>
                  <label
                    htmlFor="primaryColor"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Primary Color <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      id="primaryColor"
                      name="primaryColor"
                      value={formData.primaryColor}
                      onChange={handleChange}
                      className="w-16 h-12 rounded-lg cursor-pointer border border-slate-200"
                    />
                    <div className="flex-1 relative">
                      <Palette className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        name="primaryColor"
                        value={formData.primaryColor}
                        onChange={handleChange}
                        placeholder="#0A84FF"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Hero Title */}
                <div>
                  <label
                    htmlFor="heroTitle"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Hero Title <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      id="heroTitle"
                      name="heroTitle"
                      value={formData.heroTitle}
                      onChange={handleChange}
                      placeholder="Reliable Plumbing Services in Brisbane"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Hero Subtitle */}
                <div>
                  <label
                    htmlFor="heroSubtitle"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Hero Subtitle <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <textarea
                      id="heroSubtitle"
                      name="heroSubtitle"
                      value={formData.heroSubtitle}
                      onChange={handleChange}
                      placeholder="Fast, affordable and trusted local plumbers available 24/7"
                      rows={2}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      required
                    />
                  </div>
                </div>

                {/* Optional Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-500 mb-2"
                    >
                      Email (optional)
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="info@company.com"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-slate-500 mb-2"
                    >
                      State
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="QLD">QLD</option>
                      <option value="NSW">NSW</option>
                      <option value="VIC">VIC</option>
                      <option value="SA">SA</option>
                      <option value="WA">WA</option>
                      <option value="TAS">TAS</option>
                      <option value="ACT">ACT</option>
                      <option value="NT">NT</option>
                    </select>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 animate-fade-in">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating Website...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Website
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Success Message */}
            {generatedSite && (
              <div className="card p-6 mt-6 border-green-200 bg-green-50/50 animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900">Site Generated Successfully!</h3>
                    <p className="text-sm text-green-700">{generatedSite.name}</p>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-green-400 text-sm">{generatedSite.path}</code>
                    <button
                      onClick={() => copyToClipboard(generatedSite.path)}
                      className="p-1.5 hover:bg-white/10 rounded transition-colors"
                    >
                      <Copy className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                  {copied && (
                    <p className="text-xs text-green-400">Copied to clipboard!</p>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">Next Steps:</p>
                  <ol className="space-y-2">
                    {nextSteps.map((step, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-slate-600"
                      >
                        <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </span>
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded">{step}</code>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="flex gap-3 mt-6">
                  <a
                    href={`file:///${generatedSite.path}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <FolderOpen className="w-4 h-4" />
                    Open Folder
                  </a>
                  <button
                    onClick={() => copyToClipboard(generatedSite.path)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Path
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="card p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Generated Sites</h3>
              {generatedSites.length > 0 ? (
                <ul className="space-y-2">
                  {generatedSites.map((site) => (
                    <li
                      key={site}
                      className="flex items-center gap-2 text-sm text-slate-600 p-2 bg-slate-50 rounded-lg"
                    >
                      <FolderOpen className="w-4 h-4 text-slate-400" />
                      {site}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500">No sites generated yet</p>
              )}
            </div>

            {/* Instructions */}
            <div className="card p-6">
              <h3 className="font-semibold text-slate-900 mb-4">How It Works</h3>
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                    1
                  </span>
                  <p className="text-sm text-slate-600">
                    Fill in the client details form with business information
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                    2
                  </span>
                  <p className="text-sm text-slate-600">
                    Click "Generate Website" to create the project
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                    3
                  </span>
                  <p className="text-sm text-slate-600">
                    Navigate to the generated folder and run npm install
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                    4
                  </span>
                  <p className="text-sm text-slate-600">
                    Build and deploy the dist folder to your hosting provider
                  </p>
                </li>
              </ol>
            </div>

            {/* Template Info */}
            <div className="card p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Template Features</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Responsive design
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  SEO optimized
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Contact form included
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Mobile sticky CTA
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Dynamic colors
                </li>
              </ul>
            </div>

            {/* Quick Link */}
            <a
              href="/sites"
              className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <span className="font-medium">View All Sites</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
