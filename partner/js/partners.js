// Partners Page - Dynamic Card Loader

/**
 * Fetch and render partners from JSON configuration
 */
async function loadPartners() {
    const partnersGrid = document.getElementById('partners-grid');
    
    if (!partnersGrid) {
        console.error('Partners grid element not found!');
        return;
    }
    
    // Show loading state
    partnersGrid.innerHTML = '<div class="partners-loading">Loading partners</div>';
    
    try {
        // Fetch partners configuration
        const response = await fetch('../partners.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Validate data structure
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid JSON data structure');
        }
        
        // Update page meta if provided
        if (data.meta) {
            updatePageMeta(data.meta);
        }
        
        // Render partner cards
        if (data.partners && Array.isArray(data.partners) && data.partners.length > 0) {
            renderPartners(data.partners);
        } else {
            partnersGrid.innerHTML = `
                <div class="partners-empty">
                    <h3>No partners yet</h3>
                    <p>We're working on building amazing partnerships!</p>
                </div>
            `;
        }
        
    } catch (error) {
        console.error('Error loading partners:', error);
        partnersGrid.innerHTML = `
            <div class="partners-empty">
                <h3>Unable to load partners</h3>
                <p>Please try refreshing the page. Error: ${error.message}</p>
            </div>
        `;
    }
}

/**
 * Update page metadata from configuration
 */
function updatePageMeta(meta) {
    try {
        // Update title
        if (meta.title) {
            document.title = meta.title;
            
            // Update meta tags
            const ogTitle = document.querySelector('meta[property="og:title"]');
            if (ogTitle) ogTitle.content = meta.title;
            
            const twitterTitle = document.querySelector('meta[name="twitter:title"]');
            if (twitterTitle) twitterTitle.content = meta.title;
        }
        
        // Update description
        if (meta.description) {
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) metaDesc.content = meta.description;
            
            const twitterDesc = document.querySelector('meta[name="twitter:description"]');
            if (twitterDesc) twitterDesc.content = meta.description;
        }
        
        // Update icon
        if (meta.iconPath) {
            const iconLink = document.querySelector('link[rel="icon"]');
            if (iconLink) iconLink.href = meta.iconPath;
        }
        
        // Update banner
        if (meta.enableBanner && meta.bannerPath) {
            const twitterImage = document.querySelector('meta[name="twitter:image"]');
            if (twitterImage) twitterImage.content = meta.bannerPath;
        }
    } catch (error) {
        console.error('Error updating page meta:', error);
    }
}

/**
 * Render partner cards to the grid
 */
function renderPartners(partners) {
    const partnersGrid = document.getElementById('partners-grid');
    
    if (!partnersGrid) {
        console.error('Partners grid element not found!');
        return;
    }
    
    partnersGrid.innerHTML = '';
    
    if (!Array.isArray(partners)) {
        console.error('Partners data is not an array');
        return;
    }
    
    partners.forEach((partner, index) => {
        try {
            const card = createPartnerCard(partner, index);
            if (card) {
                partnersGrid.appendChild(card);
            }
        } catch (error) {
            console.error(`Error creating card for partner ${partner.id || index}:`, error);
        }
    });
}

/**
 * Create a single partner card element
 */
function createPartnerCard(partner, index) {
    // Validate required fields
    if (!partner || !partner.name || !partner.category || !partner.description) {
        console.warn('Partner missing required fields:', partner);
        return null;
    }
    
    const card = document.createElement('article');
    card.className = 'partner-card';
    card.style.animationDelay = `${index * 0.1}s`;
    card.setAttribute('data-partner-id', partner.id || `partner-${index}`);
    
    // Build banner section (if enabled)
    let bannerHTML = '';
    if (partner.enableBanner && partner.banner) {
        bannerHTML = `
            <div class="partner-banner">
                <img src="${escapeHtml(partner.banner)}" 
                     alt="${escapeHtml(partner.name)} banner" 
                     onerror="this.parentElement.style.display='none'"
                     loading="lazy">
            </div>
        `;
    }
    
    // Build icon section (if enabled)
    let iconHTML = '';
    if (partner.enableIcon !== false && partner.icon) {
        iconHTML = `
            <img src="${escapeHtml(partner.icon)}" 
                 alt="${escapeHtml(partner.name)} icon" 
                 class="partner-icon"
                 onerror="this.style.display='none'"
                 loading="lazy">
        `;
    }
    
    // Build tags section
    const tagsHTML = partner.tags && Array.isArray(partner.tags) && partner.tags.length > 0
        ? `<div class="partner-tags">
            ${partner.tags.map(tag => `<span class="partner-tag">${escapeHtml(tag)}</span>`).join('')}
           </div>`
        : '';
    
    // Build links section
    const linksHTML = buildLinksHTML(partner.links);
    
    // Assemble card HTML
    card.innerHTML = `
        ${bannerHTML}
        <div class="partner-content">
            <div class="partner-header">
                ${iconHTML}
                <div class="partner-title-group">
                    <p class="partner-category">${escapeHtml(partner.category)}</p>
                    <h3 class="partner-title">${escapeHtml(partner.name)}</h3>
                </div>
            </div>
            <p class="partner-description">${escapeHtml(partner.description)}</p>
            ${tagsHTML}
            ${linksHTML}
        </div>
    `;
    
    return card;
}

/**
 * Build links HTML from partner links object
 */
function buildLinksHTML(links) {
    if (!links || typeof links !== 'object' || Object.keys(links).length === 0) {
        return '';
    }
    
    const linkButtons = [];
    
    // Define link types and their properties
    const linkTypes = {
        website: { label: 'Visit Website', icon: 'language', primary: true },
        partnership: { label: 'Partnership', icon: 'handshake', primary: false },
        portfolio: { label: 'Portfolio', icon: 'work', primary: false },
        docs: { label: 'Documentation', icon: 'description', primary: false },
        security: { label: 'Security', icon: 'security', primary: false },
        contact: { label: 'Contact', icon: 'mail', primary: false },
        discord: { label: 'Discord', icon: 'forum', primary: false },
        twitter: { label: 'Twitter', icon: 'public', primary: false },
        github: { label: 'GitHub', icon: 'code', primary: false }
    };
    
    // Build link buttons
    for (const [key, url] of Object.entries(links)) {
        if (url && typeof url === 'string' && linkTypes[key]) {
            const type = linkTypes[key];
            const buttonClass = type.primary ? 'partner-link-primary' : 'partner-link-secondary';
            
            linkButtons.push(`
                <a href="${escapeHtml(url)}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="partner-link ${buttonClass}"
                   aria-label="${escapeHtml(type.label)} for ${escapeHtml(links.website || 'partner')}">
                    <span>${escapeHtml(type.label)}</span>
                    <span class="material-symbols-outlined">${type.icon}</span>
                </a>
            `);
        }
    }
    
    if (linkButtons.length === 0) {
        return '';
    }
    
    return `<div class="partner-links">${linkButtons.join('')}</div>`;
}

/**
 * Escape HTML to prevent XSS attacks
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Initialize partners page
 */
document.addEventListener('DOMContentLoaded', () => {
    // Load partners
    loadPartners();
    
    // Add smooth scroll behavior for anchor links
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Handle navigation overlay
    window.openNav = function() {
        const overlay = document.getElementById('myNav');
        if (overlay) {
            overlay.classList.add('active');
        }
    };
    
    window.closeNav = function() {
        const overlay = document.getElementById('myNav');
        if (overlay) {
            overlay.classList.remove('active');
        }
    };
    
    // Handle invite link function if it exists
    if (typeof window.invitelink !== 'function') {
        window.invitelink = function() {
            window.open('https://discord.com/oauth2/authorize?client_id=1284517036260855901&permissions=8&scope=bot%20applications.commands', '_blank');
        };
    }
});

/**
 * Utility: Filter partners by category (for future enhancement)
 */
function filterPartnersByCategory(category) {
    const cards = document.querySelectorAll('.partner-card');
    cards.forEach(card => {
        const cardCategory = card.querySelector('.partner-category');
        if (!cardCategory) return;
        
        const categoryText = cardCategory.textContent.trim();
        if (category === 'all' || categoryText === category) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Utility: Search partners by name or description (for future enhancement)
 */
function searchPartners(searchTerm) {
    if (!searchTerm || typeof searchTerm !== 'string') {
        // Show all cards if search is empty
        const cards = document.querySelectorAll('.partner-card');
        cards.forEach(card => {
            card.style.display = 'block';
        });
        return;
    }
    
    const cards = document.querySelectorAll('.partner-card');
    const term = searchTerm.toLowerCase().trim();
    
    cards.forEach(card => {
        const title = card.querySelector('.partner-title');
        const description = card.querySelector('.partner-description');
        
        if (!title || !description) return;
        
        const titleText = title.textContent.toLowerCase();
        const descText = description.textContent.toLowerCase();
        
        if (titleText.includes(term) || descText.includes(term)) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });
}

// Export functions for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadPartners,
        filterPartnersByCategory,
        searchPartners
    };
                }
