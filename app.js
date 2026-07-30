// ========== THEME TOGGLE ==========
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;
const iconMoon = themeToggle.querySelector('.icon-moon');
const iconSun = themeToggle.querySelector('.icon-sun');

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  iconMoon.style.display = theme === 'dark' ? 'block' : 'none';
  iconSun.style.display = theme === 'light' ? 'block' : 'none';
}

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// Init theme from localStorage or system preference
const saved = localStorage.getItem('theme');
if (saved) { setTheme(saved); }
else if (window.matchMedia('(prefers-color-scheme: light)').matches) { setTheme('light'); }

// ========== READING PROGRESS BAR ==========
const progressBar = document.getElementById('progress-bar');
function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = progress + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });

// ========== SCROLL REVEAL ANIMATIONS ==========
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(el => revealObserver.observe(el));

// ========== ACTIVE SECTION TRACKING ==========
const sections = document.querySelectorAll('section[id]');
const sidebarLinks = document.querySelectorAll('.sidebar-link[data-section]');
const tocLinks = document.querySelectorAll('.toc-link[data-toc]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      sidebarLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === id);
      });
      tocLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.toc === id);
      });
    }
  });
}, { threshold: 0.2, rootMargin: '-80px 0px -50% 0px' });
sections.forEach(sec => sectionObserver.observe(sec));

// ========== MOBILE MENU ==========
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const sidebarLeft = document.getElementById('sidebar-left');
const sidebarOverlay = document.getElementById('sidebar-overlay');

function toggleMobileMenu() {
  sidebarLeft.classList.toggle('open');
  sidebarOverlay.classList.toggle('active');
  document.body.style.overflow = sidebarLeft.classList.contains('open') ? 'hidden' : '';
}
mobileMenuBtn.addEventListener('click', toggleMobileMenu);
sidebarOverlay.addEventListener('click', toggleMobileMenu);

// Close mobile menu on nav click
sidebarLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (sidebarLeft.classList.contains('open')) toggleMobileMenu();
  });
});

// ========== SEARCH MODAL ==========
const searchModal = document.getElementById('search-modal');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const searchTrigger = document.getElementById('search-trigger');
const resultItems = searchResults.querySelectorAll('.search-result-item');

function openSearch() {
  searchModal.classList.add('active');
  setTimeout(() => searchInput.focus(), 100);
  document.body.style.overflow = 'hidden';
}
function closeSearch() {
  searchModal.classList.remove('active');
  searchInput.value = '';
  filterSearch('');
  document.body.style.overflow = '';
}

searchTrigger.addEventListener('click', openSearch);
searchModal.addEventListener('click', (e) => {
  if (e.target === searchModal) closeSearch();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    searchModal.classList.contains('active') ? closeSearch() : openSearch();
  }
  if (e.key === 'Escape' && searchModal.classList.contains('active')) {
    closeSearch();
  }
});

// Search filtering
function filterSearch(query) {
  const q = query.toLowerCase().trim();
  resultItems.forEach(item => {
    const text = item.dataset.search || '';
    item.style.display = !q || text.includes(q) ? 'flex' : 'none';
  });
}
searchInput.addEventListener('input', (e) => filterSearch(e.target.value));

// Navigate on result click
resultItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    closeSearch();
    const href = item.getAttribute('href');
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ========== SMOOTH SCROLL FOR ALL ANCHOR LINKS ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ========== NAVBAR BORDER ON SCROLL ==========
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.borderBottomColor = window.scrollY > 10
    ? 'var(--border-hover)' : 'var(--border)';
}, { passive: true });

// ========== COPY TO CLIPBOARD ==========
document.querySelectorAll('.code-block').forEach(block => {
  const header = block.querySelector('.code-block-header');
  if (!header) return;
  
  const copyBtn = document.createElement('button');
  copyBtn.className = 'copy-btn';
  copyBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
    Copy
  `;
  
  copyBtn.addEventListener('click', async () => {
    const code = block.querySelector('code');
    if (!code) return;
    
    try {
      await navigator.clipboard.writeText(code.innerText);
      copyBtn.classList.add('copied');
      copyBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        Copied!
      `;
      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          Copy
        `;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  });
  
  header.appendChild(copyBtn);
});
