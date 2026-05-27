import fs from "fs";
import path from "path";

/**
 * Convert business name to URL-friendly slug
 * "ABC Plumbing" -> "abc-plumbing"
 */
export function slugify(businessName: string): string {
  return businessName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Remove consecutive hyphens
}

/**
 * Parse comma-separated services string into array
 * "Drain Cleaning, Leak Detection, Installation" -> ["Drain Cleaning", "Leak Detection", "Installation"]
 */
export function parseServices(input: string): string[] {
  return input
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Copy entire directory recursively
 */
export function copyDirectorySync(source: string, destination: string): void {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  const entries = fs.readdirSync(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      copyDirectorySync(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}

/**
 * Copy template from source to destination
 */
export async function copyTemplate(
  source: string,
  destination: string
): Promise<void> {
  try {
    copyDirectorySync(source, destination);
  } catch (error) {
    throw new Error(
      `Failed to copy template: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Write site config file
 */
export async function writeConfigFile(
  filePath: string,
  data: Record<string, unknown>
): Promise<void> {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    throw new Error(
      `Failed to write config: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Check if directory exists
 */
export function directoryExists(dirPath: string): boolean {
  return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
}

/**
 * Generate site configuration object from form data
 */
export function generateSiteConfig(formData: {
  businessName: string;
  phone: string;
  suburb: string;
  services: string[];
  primaryColor: string;
  heroTitle: string;
  heroSubtitle: string;
  email?: string;
  state?: string;
}): Record<string, unknown> {
  const {
    businessName,
    phone,
    suburb,
    services,
    primaryColor,
    heroTitle,
    heroSubtitle,
    email = `info@${slugify(businessName)}.com`,
    state = "QLD",
  } = formData;

  return {
    businessName,
    phone,
    email,
    services,
    suburb,
    state,
    primaryColor,
    ctaText: "Call Now",
    heroTitle,
    heroSubtitle,
    aboutTitle: "About Us",
    aboutText: `With years of experience serving the ${suburb} community, we pride ourselves on delivering quality workmanship and exceptional customer service. Our licensed team is available around the clock to handle any emergency.`,
    aboutFeatures: ["Licensed & Insured", "24/7 Emergency Service", "Upfront Pricing", "Lifetime Guarantee"],
    testimonial: {
      name: "John Smith",
      text: "Fast service and great price. The team arrived within an hour and fixed everything professionally. Highly recommend!",
      location: suburb,
      rating: 5,
    },
    seo: {
      title: `${businessName} | Professional Services in ${suburb}`,
      description: `Expert services in ${suburb}. ${services.slice(0, 3).join(", ")} and more. Call ${phone} for fast, reliable service.`,
      keywords: `${businessName}, ${services.join(", ")}, ${suburb}`,
    },
    social: {
      facebook: "",
      instagram: "",
      google: "",
    },
    images: {
      hero: "/images/hero.jpg",
      about: "/images/about.jpg",
      logo: "/images/logo.png",
      favicon: "/favicon.ico",
    },
    businessHours: {
      monday: "7:00 AM - 6:00 PM",
      tuesday: "7:00 AM - 6:00 PM",
      wednesday: "7:00 AM - 6:00 PM",
      thursday: "7:00 AM - 6:00 PM",
      friday: "7:00 AM - 6:00 PM",
      saturday: "8:00 AM - 4:00 PM",
      sunday: "Emergency Only",
    },
  };
}

// Deployment stubs for future automation

/**
 * Deploy to Vercel (placeholder)
 */
export async function deployToVercel(projectPath: string): Promise<{ success: boolean; url?: string; error?: string }> {
  console.log(`[Vercel Deploy] Preparing deployment for: ${projectPath}`);
  // TODO: Implement Vercel API integration
  // 1. Install Vercel CLI or use REST API
  // 2. Create new project or link existing
  // 3. Deploy with 'vercel --prod'
  return {
    success: true,
    url: `https://${path.basename(projectPath)}-placeholder.vercel.app`,
  };
}

/**
 * Deploy to Render (placeholder)
 */
export async function deployToRender(projectPath: string): Promise<{ success: boolean; url?: string; error?: string }> {
  console.log(`[Render Deploy] Preparing deployment for: ${projectPath}`);
  // TODO: Implement Render API integration
  // 1. Use Render REST API to create static site
  // 2. Set build command: 'npm run build'
  // 3. Set publish directory: 'dist'
  return {
    success: true,
    url: `https://${path.basename(projectPath)}-placeholder.onrender.com`,
  };
}

/**
 * Connect custom domain (placeholder)
 */
export async function connectDomain(
  projectPath: string,
  domainName: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  console.log(`[Domain Connect] Linking ${domainName} to ${projectPath}`);
  // TODO: Implement domain connection via Vercel/Render API
  // 1. Add custom domain to project
  // 2. Return DNS configuration instructions
  return {
    success: true,
    message: `Domain ${domainName} queued for connection. DNS records will be provided.`,
  };
}
