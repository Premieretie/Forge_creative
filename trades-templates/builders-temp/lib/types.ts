export interface Testimonial {
  name: string;
  text: string;
  location: string;
  rating: number;
}

export interface SEO {
  title: string;
  description: string;
  keywords: string;
}

export interface Social {
  facebook?: string;
  instagram?: string;
  google?: string;
}

export interface Images {
  hero?: string;
  about?: string;
  logo?: string;
  favicon?: string;
}

export interface BusinessHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface SiteConfig {
  businessName: string;
  phone: string;
  email?: string;
  services: string[];
  suburb: string;
  state?: string;
  primaryColor: string;
  ctaText: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle?: string;
  aboutText?: string;
  aboutFeatures?: string[];
  testimonial?: Testimonial;
  seo?: SEO;
  social?: Social;
  images?: Images;
  businessHours?: BusinessHours;
}
