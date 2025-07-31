/* BurgerRoom Nashville - JavaScript */

// Configuration globale
const CONFIG = {
    DISCORD_URL: 'https://discord.gg/tqu9Pky6yE',
    ANIMATION_DURATION: 300,
    SCROLL_THRESHOLD: 50,
    FLOATING_ELEMENTS_INTERVAL: 3000,
    OBSERVER_OPTIONS: {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    }
};

// Classe principale pour gérer l'application
class BurgerRoomApp {
    constructor() {
        this.currentPage = 'home';
        this.isMenuOpen = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAnimations();
        this.initializeNavbar();
        this.initializeGreeting();
        this.setupTouchGestures();
        this.setupKeyboardNavigation();
        this.startFloatingElements();
        this.initializeMenuSearch();
        this.displayWelcomeMessage();
        this.setupPerformanceMonitoring();
    }

    // Gestion de la navigation entre pages
    showPage(pageId) {
        // Masquer toutes les pages
        document.querySelectorAll('.page-container').forEach(page => {
            page.classList.remove('active');
        });
        
        // Afficher la page sélectionnée
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;
        }
        
        // Masquer les détails des services si on n'est pas sur la page services
        const serviceDetails = document.getElementById('service-details');
        if (serviceDetails && pageId !== 'services') {
            serviceDetails.style.display = 'none';
        }
        
        // Fermer le menu mobile s'il est ouvert
        this.closeMobileMenu();
        
        // Retour en haut de page
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Mettre à jour l'URL sans recharger la page
        this.updateURL(pageId);
    }

    // Gestion des détails de service (redirection Discord simplifiée)
    showServiceDetail(serviceId) {
        this.showPage('services');
        
        const serviceDetails = document.getElementById('service-details');
        if (serviceDetails) {
            serviceDetails.style.display = 'block';
            
            setTimeout(() => {
                serviceDetails.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }

    // Mise à jour de l'URL
    updateURL(pageId) {
        if (history.pushState) {
            const newURL = pageId === 'home' ? '/' : `/#${pageId}`;
            history.pushState({ page: pageId }, '', newURL);
        }
    }

    // Configuration des écouteurs d'événements
    setupEventListeners() {
        // Navigation
        document.addEventListener('click', (e) => {
            if (e.target.hasAttribute('onclick')) {
                e.preventDefault();
                const onclickValue = e.target.getAttribute('onclick');
                if (onclickValue.includes('showPage')) {
                    const pageId = onclickValue.match(/showPage\('(\w+)'\)/)?.[1];
                    if (pageId) this.showPage(pageId);
                } else if (onclickValue.includes('showServiceDetail')) {
                    const serviceId = onclickValue.match(/showServiceDetail\('(\w+)'\)/)?.[1];
                    if (serviceId) this.showServiceDetail(serviceId);
                }
            }
        });

        // Menu burger
        const burgerMenu = document.querySelector('.burger-menu');
        if (burgerMenu) {
            burgerMenu.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Liens Discord
        document.querySelectorAll('a[href*="discord"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.trackContactClick(e.target);
            });
        });

        // Formulaires
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        });

        // Gestion du scroll
        window.addEventListener('scroll', () => this.handleScroll());

        // Gestion du redimensionnement
        window.addEventListener('resize', () => this.handleResize());

        // Navigation avec l'historique du navigateur
        window.addEventListener('popstate', (e) => {
            const page = e.state?.page || 'home';
            this.showPage(page);
        });
    }

    // Gestion du menu mobile
    toggleMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const burgerMenu = document.querySelector('.burger-menu');
        
        if (navMenu && burgerMenu) {
            this.isMenuOpen = !this.isMenuOpen;
            
            if (this.isMenuOpen) {
                navMenu.classList.add('active');
                burgerMenu.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                navMenu.classList.remove('active');
                burgerMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    }

    closeMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const burgerMenu = document.querySelector('.burger-menu');
        
        if (navMenu && burgerMenu) {
            navMenu.classList.remove('active');
            burgerMenu.classList.remove('active');
            document.body.style.overflow = '';
            this.isMenuOpen = false;
        }
    }

    // Gestion du scroll de la navbar
    handleScroll() {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > CONFIG.SCROLL_THRESHOLD) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }

    // Gestion du redimensionnement
    handleResize() {
        // Fermer le menu mobile sur redimensionnement
        if (window.innerWidth > 768 && this.isMenuOpen) {
            this.closeMobileMenu();
        }

        // Réajuster les éléments flottants
        this.adjustFloatingElements();
    }

    // Initialisation des animations
    initializeAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, CONFIG.OBSERVER_OPTIONS);

        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
    }

    // Initialisation de la navbar
    initializeNavbar() {
        // État initial de la navbar
        this.handleScroll();
    }

    // Effets hover pour les éléments de menu
    initializeMenuEffects() {
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('mouseenter', function() {
                if (window.innerWidth > 768) {
                    this.style.transform = 'translateY(-10px) scale(1.02)';
                }
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                if (window.innerWidth > 768) {
                    this.style.transform = 'translateY(-8px)';
                    this.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'var(--shadow)';
            });
        });
    }

    // Salutation dynamique basée sur l'heure
    initializeGreeting() {
        const currentHour = new Date().getHours();
        let greeting = '';
        
        if (currentHour < 12) {
            greeting = 'Bon petit-déjeuner chez BurgerRoom Nashville ! 🌅';
        } else if (currentHour < 17) {
            greeting = 'Bon déjeuner chez BurgerRoom ! 🍔';
        } else {
            greeting = 'Bonne soirée chez BurgerRoom Nashville ! 🌙';
        }

        this.currentGreeting = greeting;
    }

    // Éléments flottants pour l'effet visuel
    startFloatingElements() {
        const createFloatingElement = () => {
            if (window.innerWidth <= 768) return; // Désactiver sur mobile pour les performances

            const element = document.createElement('div');
            element.style.cssText = `
                position: fixed;
                pointer-events: none;
                font-size: 2rem;
                z-index: -1;
                opacity: 0.1;
                animation: float-random 15s linear infinite;
                left: ${Math.random() * 100}vw;
                animation-delay: ${Math.random() * 15}s;
            `;
            
            const emojis = ['🍔', '🍟', '🥤', '🧀', '🥓', '🎵'];
            element.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            
            document.body.appendChild(element);
            
            setTimeout(() => {
                if (element.parentNode) {
                    element.remove();
                }
            }, 15000);
        };

        // Créer des éléments flottants périodiquement
        setInterval(createFloatingElement, CONFIG.FLOATING_ELEMENTS_INTERVAL);
    }

    adjustFloatingElements() {
        // Nettoyer les éléments flottants existants sur mobile
        if (window.innerWidth <= 768) {
            document.querySelectorAll('[style*="float-random"]').forEach(el => {
                el.remove();
            });
        }
    }

    // Gestion des gestes tactiles
    setupTouchGestures() {
        document.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        });

        document.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });
    }

    handleSwipe() {
        const swipeThreshold = 100;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                console.log('👈 Navigation tactile - Swipe gauche');
            } else {
                console.log('👉 Navigation tactile - Swipe droite');
            }
        }
    }

    // Navigation au clavier
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Échap pour retourner à l'accueil
            if (e.key === 'Escape') {
                this.showPage('home');
            }
            
            // Ctrl+C pour ouvrir Discord
            if (e.key === 'c' && e.ctrlKey) {
                e.preventDefault();
                window.open(CONFIG.DISCORD_URL, '_blank');
                this.showNotification('Ouverture de notre plateforme de contact... 🚀');
            }

            // Navigation avec les flèches (pages principales)
            if (e.key === 'ArrowRight' && e.altKey) {
                this.navigateToNextPage();
            } else if (e.key === 'ArrowLeft' && e.altKey) {
                this.navigateToPrevPage();
            }
        });
    }

    navigateToNextPage() {
        const pages = ['home', 'about', 'menu', 'services', 'location', 'contact'];
        const currentIndex = pages.indexOf(this.currentPage);
        const nextIndex = (currentIndex + 1) % pages.length;
        this.showPage(pages[nextIndex]);
    }

    navigateToPrevPage() {
        const pages = ['home', 'about', 'menu', 'services', 'location', 'contact'];
        const currentIndex = pages.indexOf(this.currentPage);
        const prevIndex = (currentIndex - 1 + pages.length) % pages.length;
        this.showPage(pages[prevIndex]);
    }

    // Recherche dans le menu
    initializeMenuSearch() {
        const addMenuSearch = () => {
            const menuPage = document.getElementById('menu');
            if (!menuPage) return;

            const searchContainer = document.createElement('div');
            searchContainer.innerHTML = `
                <div style="text-align: center; margin: 2rem 0;">
                    <input type="text" placeholder="Rechercher un burger..." style="
                        padding: 1rem 2rem;
                        border: 2px solid #eee;
                        border-radius: 50px;
                        font-size: 1.1rem;
                        width: 100%;
                        max-width: 400px;
                        transition: border-color 0.3s ease;
                    " id="menuSearch">
                </div>
            `;
            
            const firstSection = menuPage.querySelector('.section');
            if (firstSection && !document.getElementById('menuSearch')) {
                firstSection.insertBefore(searchContainer, firstSection.firstChild);
                
                const searchInput = document.getElementById('menuSearch');
                searchInput.addEventListener('input', (e) => this.handleMenuSearch(e.target.value));
                searchInput.addEventListener('focus', function() {
                    this.style.borderColor = 'var(--primary-purple)';
                });
                searchInput.addEventListener('blur', function() {
                    this.style.borderColor = '#eee';
                });
            }
        };

        // Ajouter la recherche quand on navigue vers le menu
        setTimeout(addMenuSearch, 100);
    }

    handleMenuSearch(searchTerm) {
        const term = searchTerm.toLowerCase();
        document.querySelectorAll('.menu-item').forEach(item => {
            const title = item.querySelector('h3')?.textContent.toLowerCase() || '';
            const description = item.querySelector('p')?.textContent.toLowerCase() || '';
            
            if (title.includes(term) || description.includes(term) || term === '') {
                item.style.display = 'block';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            } else {
                item.style.display = 'none';
            }
        });

        // Afficher un message si aucun résultat
        const visibleItems = Array.from(document.querySelectorAll('.menu-item')).filter(item => 
            item.style.display !== 'none'
        );

        this.toggleNoResultsMessage(visibleItems.length === 0 && searchTerm.length > 0);
    }

    toggleNoResultsMessage(show) {
        let noResultsDiv = document.getElementById('no-results-message');
        
        if (show && !noResultsDiv) {
            noResultsDiv = document.createElement('div');
            noResultsDiv.id = 'no-results-message';
            noResultsDiv.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--neutral-gray);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
                    <h3>Aucun résultat trouvé</h3>
                    <p>Essayez avec d'autres mots-clés ou <a href="${CONFIG.DISCORD_URL}" target="_blank" style="color: var(--primary-purple);">contactez-nous</a> pour des suggestions !</p>
                </div>
            `;
            document.querySelector('#menu .container').appendChild(noResultsDiv);
        } else if (!show && noResultsDiv) {
            noResultsDiv.remove();
        }
    }

    // Gestion des soumissions de formulaire
    handleFormSubmit(e) {
        e.preventDefault();
        this.showNotification('Contactez-nous sur notre plateforme pour toutes vos demandes ! 🍔');
        window.open(CONFIG.DISCORD_URL, '_blank');
    }

    // Suivi des clics sur les liens de contact
    trackContactClick(element) {
        const text = element.textContent.trim();
        console.log('🚀 Contact client via:', text);
        
        // Optionnel: Analytics ou suivi des conversions
        if (typeof gtag !== 'undefined') {
            gtag('event', 'contact_click', {
                'event_category': 'engagement',
                'event_label': text
            });
        }
    }

    // Notifications toast
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 120px;
            right: 20px;
            background: linear-gradient(135deg, var(--primary-purple), var(--primary-pink));
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
            font-weight: 600;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Message de bienvenue dans la console
    displayWelcomeMessage() {
        console.log(`
🍔 Bienvenue sur BurgerRoom Nashville ! 🍔
=============================================
Site développé avec ❤️ pour les amoureux des burgers
${this.currentGreeting}

📞 Contactez-nous : ${CONFIG.DISCORD_URL}
🎵 Vivez l'expérience Nashville !
🍟 Commandez nos délicieux burgers !

Raccourcis clavier :
- Échap : Retour à l'accueil
- Ctrl+C : Ouvrir Discord
- Alt + Flèches : Navigation entre pages

=============================================
        `);
    }

    // Monitoring des performances
    setupPerformanceMonitoring() {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`🚀 Site BurgerRoom chargé en ${loadTime.toFixed(2)}ms`);
            
            // Mesurer les métriques Web Vitals si disponible
            if ('PerformanceObserver' in window) {
                this.measureWebVitals();
            }
        });
    }

    measureWebVitals() {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                console.log('FID:', entry.processingStart - entry.startTime);
            }
        }).observe({ entryTypes: ['first-input'] });
    }

    // Méthodes utilitaires
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Fonctions globales pour compatibilité avec le HTML existant
function showPage(pageId) {
    if (window.burgerApp) {
        window.burgerApp.showPage(pageId);
    }
}

function showServiceDetail(serviceId) {
    if (window.burgerApp) {
        window.burgerApp.showServiceDetail(serviceId);
    }
}

// Styles CSS supplémentaires pour les animations
const additionalStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    @keyframes slideInUp {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    @keyframes float-random {
        0% {
            transform: translateY(100vh) rotate(0deg);
        }
        100% {
            transform: translateY(-100px) rotate(360deg);
        }
    }

    /* Amélioration de l'accessibilité */
    .nav-menu.active {
        animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    // Ajouter les styles supplémentaires
    const style = document.createElement('style');
    style.textContent = additionalStyles;
    document.head.appendChild(style);

    // Initialiser l'application
    window.burgerApp = new BurgerRoomApp();
    
    // Gérer la page initiale basée sur l'URL
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        window.burgerApp.showPage(hash);
    }
});

// Gestion des erreurs globales
window.addEventListener('error', (e) => {
    console.error('Erreur JavaScript:', e.error);
    // Optionnel: Envoyer les erreurs à un service de monitoring
});

// Support pour les Service Workers (PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Prêt pour PWA si nécessaire
        console.log('🔧 Service Worker ready for PWA implementation');
    });
}

// Export pour les modules si nécessaire
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BurgerRoomApp, CONFIG };
}