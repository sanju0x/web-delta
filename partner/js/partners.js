// Partners Page - Dynamic Card Loader

/**
 * Fetch and render partners from JSON configuration
 */
async function loadPartners() {
    const partnersGrid = document.getElementById('partners-grid');
    
    // Show loading state
    partnersGrid.innerHTML = '<div class="partners-loading">Loading partners</div>';
    
    try {
        // Fetch partners configuration
        const response = await fetch('./partners.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Update page meta if provided
        if (data.meta) {
            updatePageMeta(data.meta);
        }
        
        // Render partner cards
        if (data.partners && data.partners.length > 0) {
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
                <p>Please try refreshing the page.</p>
            </div>
        `;
    }
}

/**
 * Update page metadata from configuration
 */
function updatePageMeta(meta) {
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
}

/**
 * Render partner cards to the grid
 */
function renderPartners(partners) {
    const partnersGrid = document.getElementById('partners-grid');
    partnersGrid.innerHTML = '';
    
    partners.forEach((partner, index) => {
        const card = createPartnerCard(partner, index);
        partnersGrid.appendChild(card);
    });
}

/**
 * Create a single partner card element
 */
function createPartnerCard(partner, index) {
    const card = document.createElement('article');
    card.className = 'partner-card';
    card.style.animationDelay = `${index * 0.1}s`;
    card.setAttribute('data-partner-id', partner.id);
    
    // Build banner section (if enabled)
    let bannerHTML = '';
    if (partner.enableBanner && partner.banner) {
        bannerHTML = `
            <div class="partner-banner">
                <img src="${partner.banner}" 
                     alt="${partner.name} banner" 
                     onerror="this.parentElement.style.display='none'">
            </div>
        `;
    }
    
    // Build icon section (if enabled)
    let iconHTML = '';
    if (partner.enableIcon !== false && partner.icon) {
        iconHTML = `
            <img src="${partner.icon}" 
                 alt="${partner.name} icon" 
                 class="partner-icon"
                 onerror="this.style.display='none'">
        `;
    }
    
    // Build tags section
    const tagsHTML = partner.tags && partner.tags.length > 0
        ? `<div class="partner-tags">
            ${partner.tags.map(tag => `<span class="partner-tag">${tag}</span>`).join('')}
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
                    <p class="partner-category">${partner.category}</p>
                    <h3 class="partner-title">${partner.name}</h3>
                </div>
            </div>
            <p class="partner-description">${partner.description}</p>
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
    if (!links || Object.keys(links).length === 0) {
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
        if (url && linkTypes[key]) {
            const type = linkTypes[key];
            const buttonClass = type.primary ? 'partner-link-primary' : 'partner-link-secondary';
            
            linkButtons.push(`
                <a href="${url}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="partner-link ${buttonClass}">
                    <span>${type.label}</span>
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
 * Initialize partners page
 */
document.addEventListener('DOMContentLoaded', () => {
    loadPartners();
    
    // Add smooth scroll behavior for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

/**
 * Utility: Filter partners by category (for future enhancement)
 */
function filterPartnersByCategory(category) {
    const cards = document.querySelectorAll('.partner-card');
    cards.forEach(card => {
        const cardCategory = card.querySelector('.partner-category').textContent;
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Utility: Search partners by name or description (for future enhancement)
 */
function searchPartners(searchTerm) {
    const cards = document.querySelectorAll('.partner-card');
    const term = searchTerm.toLowerCase();
    
    cards.forEach(card => {
        const title = card.querySelector('.partner-title').textContent.toLowerCase();
        const description = card.querySelector('.partner-description').textContent.toLowerCase();
        
        if (title.includes(term) || description.includes(term)) {
            card.style.display = 'block';
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
