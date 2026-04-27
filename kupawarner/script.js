const assetBase = './assets/';
const asset = (file) => `${assetBase}${file}`;

const projects = [
  {
    title: 'Get Real : Conor McGregor',
    category: 'commercial',
    image: 'commercial_connor1.png',
    link: 'https://vimeo.com/1169744303'
  },
  {
    title: 'From Life',
    category: 'narative',
    image: 'narrative_fromlife1.png',
    link: 'https://vimeo.com/323057898'
  },
  {
    title: 'Kupa Warner Showreel',
    category: 'narative',
    image: 'narrative_showreel1.png',
    link: 'https://vimeo.com/350780589'
  },
  {
    title: 'D&D But Real',
    category: 'Social Conte3nt',
    image: 'socia_dnd1.png',
    link: 'https://www.youtube.com/watch?v=ftAvFcuVAEg'
  },
  {
    title: 'D&D But Real',
    category: 'Social Conte3nt',
    image: 'socia_dnd2.png',
    link: 'https://www.youtube.com/watch?v=bXigDEC9SkQ'
  },
  {
    title: 'Maori Cultural Center',
    category: 'commercial',
    image: 'commercial_mcc.png',
    link: 'https://vimeo.com/1005315630?fl=pl&fe=sh'
  },
  {
    title: 'Features of a Parramatta Light Rail vehicle',
    category: 'commercial',
    image: 'commercial_parramatta-light-rail.png',
    link: 'https://vimeo.com/925606504?fl=pl&fe=sh'
  },
  {
    title: 'Swipe Up',
    category: 'Social Conte3nt',
    image: 'socia_swipe-up.png',
    link: 'https://www.youtube.com/watch?v=o-YBDTqX_ZU'
  }
];

const latest = [
  {
    title: 'Golden Hour',
    category: 'commercial',
    image: 'commercial_golden-hour.png',
    link: 'https://vimeo.com/90509568'
  },
  {
    title: 'Pulse',
    category: 'music video',
    image: 'musicvideo_pulse.png',
    link: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ'
  },
  {
    title: 'Short Form Magic',
    category: 'Social Conte3nt',
    image: 'socia_short-form-magic.png',
    link: 'https://www.youtube.com/watch?v=jNQXAC9IVRw'
  }
];

const grid = document.getElementById('portfolioGrid');
const latestGrid = document.getElementById('latestGrid');
const filterTabs = document.querySelectorAll('.filter-tab');
const modal = document.getElementById('videoModal');
const modalFrame = document.getElementById('videoFrame');

function toEmbedUrl(url) {
  try {
    const u = new URL(url);
    const host = u.hostname;

    const isYouTube = host.includes('youtube.com') || host.includes('youtu.be');
    if (isYouTube) {
      const id = u.searchParams.get('v') || u.pathname.split('/').filter(Boolean).pop();
      if (id) {
        const params = new URLSearchParams({ autoplay: '1', rel: '0', vq: 'hd2160' });
        return `https://www.youtube.com/embed/${id}?${params.toString()}`;
      }
      return url;
    }

    const isVimeo = host.includes('vimeo.com');
    if (isVimeo) {
      const id = u.pathname.split('/').filter(Boolean).pop();
      if (id) {
        const params = new URLSearchParams({ autoplay: '1', quality: '4k' });
        return `https://player.vimeo.com/video/${id}?${params.toString()}`;
      }
      return url;
    }

    return url;
  } catch (e) {
    return url;
  }
}

function openModal(link) {
  modalFrame.src = toEmbedUrl(link);
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.hidden = true;
  modalFrame.src = '';
  document.body.style.overflow = '';
}

modal?.addEventListener('click', (e) => {
  if (e.target.dataset.close) {
    closeModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.hidden) {
    closeModal();
  }
});

function renderCards(target, data) {
  target.innerHTML = data
    .map(
      (item) => `
      <article class="card" data-category="${item.category}" data-link="${item.link}" aria-label="${item.title} - ${item.category}">
        <img src="${asset(item.image)}" alt="${item.title}" loading="lazy" />
        <div class="overlay">
          <span class="tag">${item.category}</span>
          <span class="title">${item.title}</span>
        </div>
      </article>
    `
    )
    .join('');
}

renderCards(grid, projects);
renderCards(latestGrid, latest);

function applyFilter(category) {
  const cards = grid.querySelectorAll('.card');
  cards.forEach((card) => {
    const match = category === 'all' || card.dataset.category === category;
    card.style.display = match ? 'block' : 'none';
  });
}

filterTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    filterTabs.forEach((t) => t.classList.remove('active'));
    tab.isActive = true;
    tab.classList.add('active');
    applyFilter(tab.dataset.filter);
  });
});

function openOnClick(target) {
  target.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;
    const link = card.dataset.link;
    if (link) openModal(link);
  });
}

openOnClick(grid);
openOnClick(latestGrid);
