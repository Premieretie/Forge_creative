/**
 * Kupa Warner - Brisbane Videographer Portfolio
 * SEO-Optimized Portfolio Website JavaScript
 */

const assetBase = './assets/';
const asset = (file) => `${assetBase}${file}`;

// Portfolio projects with SEO-optimized metadata
const projects = [
  {
    id: 'conor-mcgregor',
    title: 'Conor McGregor "Get Real" Branded Content',
    category: 'commercial',
    image: 'commercial_connor1.png',
    link: 'https://vimeo.com/1169744303',
    description: 'Commercial cinematography for Conor McGregor branded content campaign. High-end commercial video production showcasing cinematic visuals and professional post-production.',
    client: 'Conor McGregor',
    type: 'Commercial Video Production'
  },
  {
    id: 'from-life',
    title: 'From Life - Narrative Short Film',
    category: 'narrative',
    image: 'narrative_fromlife1.png',
    link: 'https://vimeo.com/323057898',
    description: 'Award-winning narrative short film. Cinematic storytelling with professional cinematography and color grading in DaVinci Resolve.',
    client: 'Independent Production',
    type: 'Narrative Film'
  },
  {
    id: 'showreel',
    title: 'Kupa Warner Cinematography Showreel',
    category: 'narrative',
    image: 'narrative_showreel1.png',
    link: 'https://vimeo.com/350780589',
    description: 'Professional cinematography showreel showcasing commercial, narrative, and social content work. Brisbane videographer and cinematographer portfolio highlights.',
    client: 'Self',
    type: 'Showreel'
  },
  {
    id: 'dnd-real-1',
    title: 'D&D But Real - Social Content Series (Ep 1)',
    category: 'social content',
    image: 'socia_dnd1.png',
    link: 'https://www.youtube.com/watch?v=ftAvFcuVAEg',
    description: 'High-engagement social media content for gaming audience. YouTube content creation with cinematic production values for viral social content.',
    client: 'Gaming Content Creator',
    type: 'Social Media Content'
  },
  {
    id: 'dnd-real-2',
    title: 'D&D But Real - Social Content Series (Ep 2)',
    category: 'social content',
    image: 'socia_dnd2.png',
    link: 'https://www.youtube.com/watch?v=bXigDEC9SkQ',
    description: 'Episode 2 of viral social content series. Professional social media videography with narrative-driven approach for gaming content.',
    client: 'Gaming Content Creator',
    type: 'Social Media Content'
  },
  {
    id: 'maori-cultural',
    title: 'Maori Cultural Centre - Documentary Production',
    category: 'commercial',
    image: 'commercial_mcc.png',
    link: 'https://vimeo.com/1005315630?fl=pl&fe=sh',
    description: 'Cultural documentary production for Maori Cultural Centre. Documentary-style videography with respectful cultural storytelling approach.',
    client: 'Maori Cultural Centre',
    type: 'Cultural Documentary'
  },
  {
    id: 'parramatta-light-rail',
    title: 'Parramatta Light Rail - Government Infrastructure Video',
    category: 'commercial',
    image: 'commercial_parramatta-light-rail.png',
    link: 'https://vimeo.com/925606504?fl=pl&fe=sh',
    description: 'Government project videography for Sydney transport infrastructure. Corporate video production showcasing public initiative documentation.',
    client: 'Transport for NSW',
    type: 'Government/Corporate Video'
  },
  {
    id: 'visit-norwich',
    title: 'Visit Norwich - Tourism Documentary',
    category: 'social content',
    image: 'visit_norwich.png',
    link: 'https://vimeo.com/1198999927/d307bed43c?share=copy&fl=sv&fe=ci',
    description: 'Tourism documentary showcasing Norwich city attractions. Professional videography for promotional content.',
    client: 'Visit Norwich',
    type: 'Tourism Documentary'
  },
  {
    id: 'sydney-metro',
    title: 'Sydney Metro - Major Government Project',
    category: 'commercial',
    image: 'commercial_sydney-metro.png',
    link: 'https://vimeo.com/1005315630',
    description: 'Large-scale government videography project documenting Sydney Metro infrastructure. Corporate video production with technical documentation focus.',
    client: 'Sydney Metro',
    type: 'Government/Corporate Video'
  },
  {
    id: 'pax-australia-2023',
    title: 'PAX Australia 2023 - Lead Videographer',
    category: 'events',
    image: 'events_pax-australia.png',
    link: 'https://www.youtube.com/watch?v=m_vGepIFO7Y',
    description: 'Lead videographer for Australia\'s largest gaming convention. Multi-camera event coverage with highlight reel production for major gaming event.',
    client: 'PAX Australia',
    type: 'Event Videography'
  },
  {
    id: 'sxsw-australia',
    title: 'SXSW Australia - Festival Documentation',
    category: 'events',
    image: 'events_sxsw-australia.png',
    link: 'https://www.youtube.com/watch?v=ni3L_8fce5g',
    description: 'Lead videographer for SXSW Australia festival. Multi-day event coverage capturing keynotes, panels, and festival atmosphere for international audience.',
    client: 'SXSW Australia',
    type: 'Event Videography'
  },
  {
    id: 'motorsport-coverage',
    title: 'Motorsport Event Coverage - Camera Operator',
    category: 'events',
    image: 'events_motorsport.png',
    link: 'https://vimeo.com/example',
    description: 'Camera operator for motorsport productions. High-speed event videography capturing dynamic racing action and broadcast-quality footage.',
    client: 'Motorsport Production',
    type: 'Event Videography'
  },
  {
    id: 'musicvideo-impact',
    title: 'Music Video - Impact',
    category: 'music',
    image: 'music_impact.png',
    link: 'https://vimeo.com/example',
    description: 'Music video production with dynamic camera work and creative storytelling.',
    client: 'Bart Xl and Johnny from the Burbs',
    type: 'Music Video'
  }

];

// Latest/recent work
const latest = [
  {
    id: 'golden-hour',
    title: 'Golden Hour - Cinematic Brand Film',
    category: 'commercial',
    image: 'commercial_golden-hour.png',
    link: 'https://vimeo.com/90509568',
    description: 'Cinematic brand film showcasing golden hour cinematography techniques. High-end commercial video production for premium brand positioning.',
    client: 'Commercial Brand',
    type: 'Brand Film'
  },
  {
    id: 'pulse-music-video',
    title: 'Pulse - Music Video Production',
    category: 'music video',
    image: 'musicvideo_pulse.png',
    link: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    description: 'Cinematic music video production with narrative elements. Brisbane music video production with festival-quality cinematography.',
    client: 'Music Artist',
    type: 'Music Video'
  },
  {
    id: 'short-form-magic',
    title: 'Short Form Magic - Social Content',
    category: 'social content',
    image: 'socia_short-form-magic.png',
    link: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    description: 'Short-form social media content optimized for TikTok, Instagram Reels, and YouTube Shorts. High-engagement video production for social platforms.',
    client: 'Social Media Campaign',
    type: 'Social Media Content'
  },
  {
    id: 'corporate-training',
    title: 'Corporate Training Video Series',
    category: 'commercial',
    image: 'commercial_training.png',
    link: 'https://vimeo.com/example',
    description: 'Professional corporate training video series. Brisbane corporate videography with clear instructional design and professional production values.',
    client: 'Corporate Client',
    type: 'Corporate Video'
  }
];

// DOM Elements
const grid = document.getElementById('portfolioGrid');
const latestGrid = document.getElementById('latestGrid');
const filterTabs = document.querySelectorAll('.filter-tab');
const modal = document.getElementById('videoModal');
const modalFrame = document.getElementById('videoFrame');
const modalCaption = document.getElementById('modalCaption');

// Utility: Convert video URL to embed URL with SEO-friendly parameters
function toEmbedUrl(url) {
  try {
    const u = new URL(url);
    const host = u.hostname;

    // YouTube embedding with optimized parameters
    const isYouTube = host.includes('youtube.com') || host.includes('youtu.be');
    if (isYouTube) {
      const id = u.searchParams.get('v') || u.pathname.split('/').filter(Boolean).pop();
      if (id) {
        const params = new URLSearchParams({ 
          autoplay: '1', 
          rel: '0', 
          vq: 'hd2160',
          modestbranding: '1',
          playsinline: '1'
        });
        return `https://www.youtube.com/embed/${id}?${params.toString()}`;
      }
      return url;
    }

    // Vimeo embedding with optimized parameters
    const isVimeo = host.includes('vimeo.com');
    if (isVimeo) {
      const id = u.pathname.split('/').filter(Boolean).pop();
      if (id && /^\d+$/.test(id)) {
        const params = new URLSearchParams({ 
          autoplay: '1', 
          quality: '1080p',
          dnt: '1'
        });
        return `https://player.vimeo.com/video/${id}?${params.toString()}`;
      }
      return url;
    }

    return url;
  } catch (e) {
    console.error('Error parsing video URL:', e);
    return url;
  }
}

// Modal functions with caption support
function openModal(link, title = '', description = '') {
  modalFrame.src = toEmbedUrl(link);
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  
  // Update caption if elements exist
  if (modalCaption) {
    modalCaption.innerHTML = title ? `<strong>${title}</strong>${description ? `<br>${description}` : ''}` : '';
  }
  
  // Track video open event for analytics (if implemented)
  if (typeof gtag !== 'undefined') {
    gtag('event', 'video_play', {
      'event_category': 'engagement',
      'event_label': title || 'Video'
    });
  }
}

function closeModal() {
  modal.hidden = true;
  modalFrame.src = '';
  document.body.style.overflow = '';
  if (modalCaption) {
    modalCaption.innerHTML = '';
  }
}

// Modal event listeners
if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target.dataset.close) {
      closeModal();
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.hidden) {
    closeModal();
  }
});

// Render portfolio cards with SEO-optimized markup
function renderCards(target, data) {
  if (!target) return;
  
  target.innerHTML = data
    .map((item) => {
      const categoryDisplay = item.category.charAt(0).toUpperCase() + item.category.slice(1);
      return `
      <article class="card" 
               data-category="${item.category}" 
               data-link="${item.link}"
               data-title="${item.title}"
               data-description="${item.description || ''}"
               itemscope 
               itemtype="https://schema.org/VideoObject"
               aria-label="${item.title} - ${categoryDisplay} video production">
        <meta itemprop="name" content="${item.title}">
        <meta itemprop="description" content="${item.description || ''}">
        <meta itemprop="thumbnailUrl" content="${asset(item.image)}">
        <meta itemprop="contentUrl" content="${item.link}">
        <meta itemprop="uploadDate" content="2024">
        <img src="${asset(item.image)}" 
             alt="${item.title} - ${item.type} by Brisbane videographer Kupa Warner" 
             loading="lazy"
             width="640"
             height="360"
             itemprop="thumbnail" />
        <div class="overlay">
          <span class="tag">${categoryDisplay}</span>
          <span class="title" itemprop="name">${item.title}</span>
        </div>
      </article>
    `;
    })
    .join('');
}

// Initial render
renderCards(grid, projects);
renderCards(latestGrid, latest);

// Filter functionality
function applyFilter(category) {
  if (!grid) return;
  const cards = grid.querySelectorAll('.card');
  let visibleCount = 0;
  
  cards.forEach((card) => {
    const match = category === 'all' || card.dataset.category === category;
    card.style.display = match ? 'block' : 'none';
    if (match) visibleCount++;
  });
  
  // Show message if no results
  const existingMessage = grid.querySelector('.no-results');
  if (existingMessage) existingMessage.remove();
  
  if (visibleCount === 0) {
    const noResults = document.createElement('div');
    noResults.className = 'no-results';
    noResults.style.cssText = 'grid-column: 1/-1; text-align: center; padding: 40px; color: var(--muted);';
    noResults.innerHTML = '<p>No projects in this category. <a href="#contact" style="color: var(--accent);">Contact me</a> to discuss your ' + category + ' project!</p>';
    grid.appendChild(noResults);
  }
}

// Filter tab event listeners
filterTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    filterTabs.forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    applyFilter(tab.dataset.filter);
    
    // Update URL hash for shareable filtered views
    const filter = tab.dataset.filter;
    if (filter !== 'all') {
      window.history.replaceState(null, null, `#filter=${filter}`);
    } else {
      window.history.replaceState(null, null, window.location.pathname);
    }
  });
});

// Handle URL hash on load
function handleUrlHash() {
  const hash = window.location.hash;
  if (hash.startsWith('#filter=')) {
    const filter = hash.replace('#filter=', '');
    const tab = document.querySelector(`.filter-tab[data-filter="${filter}"]`);
    if (tab) {
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      applyFilter(filter);
    }
  }
}

handleUrlHash();

// Click handlers for cards
function openOnClick(target) {
  if (!target) return;
  
  target.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;
    
    const link = card.dataset.link;
    const title = card.dataset.title;
    const description = card.dataset.description;
    
    if (link) {
      openModal(link, title, description);
    }
  });
}

openOnClick(grid);
openOnClick(latestGrid);

// Smooth scroll for anchor links with offset for sticky header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const headerOffset = 100;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Intersection Observer for lazy loading animations
const observerOptions = {
  root: null,
  rootMargin: '50px',
  threshold: 0.1
};

const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Apply initial styles for animation and observe cards
document.querySelectorAll('.card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  cardObserver.observe(card);
});

// Performance: Preload critical images
function preloadCriticalImages() {
  const criticalImages = [
    'commercial_connor1.png',
    'narrative_showreel1.png'
  ];
  
  criticalImages.forEach(img => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = asset(img);
    document.head.appendChild(link);
  });
}

// Preload after initial render
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', preloadCriticalImages);
} else {
  preloadCriticalImages();
}

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Uncomment when service-worker.js is created
    // navigator.serviceWorker.register('/service-worker.js');
  });
}

console.log('🎬 Kupa Warner - Brisbane Videographer Portfolio Loaded');
console.log('📍 Services: Commercial, Corporate, Events, Music Videos, Social Content');
console.log('🏆 Award-Winning Cinematography - Vaughan International Film Festival');
