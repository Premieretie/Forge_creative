"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  FolderOpen,
  ExternalLink,
  Trash2,
  Clock,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface Site {
  name: string;
  createdAt: string;
  path: string;
}

export default function SitesPage() {
  const [sites, setSites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const response = await fetch("/api/sites");
      if (!response.ok) throw new Error("Failed to fetch sites");
      const data = await response.json();
      setSites(data.sites || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const formatPath = (siteName: string) => {
    return `generated-sites/${siteName}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Dashboard</span>
              </Link>
            </div>
            <h1 className="text-xl font-bold text-slate-900">Generated Sites</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse text-slate-500">Loading...</div>
          </div>
        ) : error ? (
          <div className="card p-6 bg-red-50 border-red-200">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </div>
        ) : sites.length === 0 ? (
          <div className="card p-12 text-center">
            <FolderOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              No Sites Generated Yet
            </h2>
            <p className="text-slate-500 mb-6">
              Create your first website using the dashboard
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {sites.map((site) => (
              <div
                key={site}
                className="card p-6 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FolderOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 capitalize">
                      {site.replace(/-/g, " ")}
                    </h3>
                    <p className="text-sm text-slate-500 font-mono">
                      {formatPath(site)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`file:///${formatPath(site)}`}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
