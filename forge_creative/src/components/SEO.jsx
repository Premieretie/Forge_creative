import { Helmet } from 'react-helmet-async'

const SEO = ({ 
  title = 'Forge Creative | Brisbane Video Production Company',
  description = 'Premium video production services in Brisbane. Corporate videos, social media content, brand films, event coverage & more. Professional videographers creating cinematic content that builds brands.',
  keywords = 'Brisbane Video Production, Corporate Video Production Brisbane, Brisbane Videographer, Social Media Content Brisbane, Brisbane Content Creation, Corporate Videographer Brisbane',
  pathname = '',
  image = '/forge-og-image.jpg'
}) => {
  const canonicalUrl = `https://forgecreative.com.au${pathname}`
  const ogImageUrl = `https://forgecreative.com.au${image}`
  
  // Local Business Schema
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoProductionService',
    name: 'Forge Creative',
    description: 'Brisbane-based video production company specializing in corporate videos, social media content, brand storytelling, and commercial content.',
    url: 'https://forgecreative.com.au',
    telephone: '+61-XXX-XXX-XXX',
    email: 'hello@forgecreative.com.au',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Brisbane',
      addressRegion: 'QLD',
      addressCountry: 'AU'
    },
    areaServed: {
      '@type': 'City',
      name: 'Brisbane'
    },
    serviceType: [
      'Corporate Video Production',
      'Social Media Content Creation',
      'Brand Storytelling',
      'Commercial Content',
      'Event Coverage',
      'Real Estate Videos',
      'Podcast Production',
      'Testimonial Videos'
    ],
    priceRange: '$$$'
  }

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      {/* Language & Region */}
      <html lang="en-AU" />
      <meta property="og:locale" content="en_AU" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Forge Creative" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />
      
      {/* Mobile & PWA */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#0a0a0a" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
    </Helmet>
  )
}

export default SEO
