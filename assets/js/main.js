/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GINANRM - GHOST THEME
 * Main JavaScript
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';

    // ─────────────────────────────────────────────────────────────────────────
    // DOM Ready
    // ─────────────────────────────────────────────────────────────────────────
    
    document.addEventListener('DOMContentLoaded', function() {
        initHeader();
        initMobileMenu();
        initSearch();
        initSlider();
        initAnimations();
        initCharlotteHelper();
        initHeaderNavigation();
        initPinnedLinks();
        initImageLightbox();
        initHeroSearchScroll();
    });

    // ─────────────────────────────────────────────────────────────────────────
    // Header Scroll Effect
    // ─────────────────────────────────────────────────────────────────────────
    
    function initHeader() {
        const header = document.getElementById('site-header');
        if (!header) return;

        let lastScroll = 0;
        const scrollThreshold = 50;

        function handleScroll() {
            const currentScroll = window.pageYOffset;

            // Add/remove scrolled class
            if (currentScroll > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        }

        // Use requestAnimationFrame for smooth performance
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        // Initial check
        handleScroll();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Mobile Menu
    // ─────────────────────────────────────────────────────────────────────────
    
    function initMobileMenu() {
        const toggle = document.querySelector('[data-mobile-menu-toggle]');
        const mobileNav = document.getElementById('mobile-nav');
        
        if (!toggle || !mobileNav) return;

        toggle.addEventListener('click', function() {
            const isOpen = mobileNav.classList.contains('active');
            
            toggle.classList.toggle('active');
            toggle.setAttribute('aria-expanded', !isOpen);
            mobileNav.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isOpen ? '' : 'hidden';
        });

        // Close menu when clicking a link
        const mobileLinks = mobileNav.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }


    // ─────────────────────────────────────────────────────────────────────────
    // Search Modal
    // ─────────────────────────────────────────────────────────────────────────
    
    function initSearch() {
        const searchToggle = document.querySelectorAll('[data-search-toggle]');
        const searchModal = document.getElementById('search-modal');
        const searchClose = document.querySelector('[data-search-close]');
        const searchInput = document.querySelector('[data-search-modal-input]');
        const searchForms = document.querySelectorAll('.search-form');
        
        if (!searchModal) return;

        function openSearch() {
            searchModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus input after animation
            setTimeout(function() {
                if (searchInput) searchInput.focus();
            }, 300);
        }

        function closeSearch() {
            searchModal.classList.remove('active');
            document.body.style.overflow = '';
            if (searchInput) searchInput.value = '';
        }

        // Handle search form submission - redirect to search page
        searchForms.forEach(function(form) {
            form.addEventListener('submit', function(e) {
                const input = form.querySelector('input[name="q"], input[type="search"]');
                if (input && input.value.trim()) {
                    const searchQuery = input.value.trim();
                    const siteUrl = window.location.origin;
                    // Redirect to search page
                    window.location.href = siteUrl + '/search/?q=' + encodeURIComponent(searchQuery);
                    e.preventDefault();
                } else {
                    e.preventDefault();
                }
            });
        });

        // Toggle buttons
        searchToggle.forEach(function(btn) {
            btn.addEventListener('click', openSearch);
        });

        // Close button
        if (searchClose) {
            searchClose.addEventListener('click', closeSearch);
        }

        // Close on backdrop click
        searchModal.addEventListener('click', function(e) {
            if (e.target === searchModal) {
                closeSearch();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchModal.classList.contains('active')) {
                closeSearch();
            }
        });

        // Open search with Cmd/Ctrl + K
        document.addEventListener('keydown', function(e) {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                if (searchModal.classList.contains('active')) {
                    closeSearch();
                } else {
                    openSearch();
                }
            }
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Featured Posts Slider
    // ─────────────────────────────────────────────────────────────────────────
    
    function initSlider() {
        const track = document.getElementById('slider-track');
        const sidebarNav = document.getElementById('slider-sidebar-nav');
        
        if (!track) return;

        const slides = track.querySelectorAll('.slider-slide');
        const sidebarItems = sidebarNav ? sidebarNav.querySelectorAll('.slider-sidebar-item') : [];
        const slideCount = slides.length;
        let currentSlide = 0;
        let autoplayInterval = null;
        const autoplayDelay = 6000; // 6 seconds

        function goToSlide(index) {
            // Handle wrap-around
            if (index < 0) index = slideCount - 1;
            if (index >= slideCount) index = 0;
            
            currentSlide = index;
            
            // Hide all slides and show active one
            slides.forEach(function(slide, i) {
                if (i === currentSlide) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });
            
            // Update sidebar items
            sidebarItems.forEach(function(item, i) {
                if (i === currentSlide) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }

        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        function prevSlide() {
            goToSlide(currentSlide - 1);
        }

        function startAutoplay() {
            stopAutoplay();
            autoplayInterval = setInterval(nextSlide, autoplayDelay);
        }

        function stopAutoplay() {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
                autoplayInterval = null;
            }
        }

        // Sidebar item click handlers
        sidebarItems.forEach(function(item) {
            item.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-slide-index'), 10);
                goToSlide(index);
                stopAutoplay();
                // Restart autoplay after a delay
                setTimeout(startAutoplay, autoplayDelay);
            });
        });

        // Pause autoplay on hover
        if (track) {
            track.addEventListener('mouseenter', stopAutoplay);
            track.addEventListener('mouseleave', startAutoplay);
        }

        if (sidebarNav) {
            sidebarNav.addEventListener('mouseenter', stopAutoplay);
            sidebarNav.addEventListener('mouseleave', startAutoplay);
        }

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        if (track) {
            track.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].screenX;
                stopAutoplay();
            }, { passive: true });

            track.addEventListener('touchend', function(e) {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
                startAutoplay();
            }, { passive: true });
        }

        function handleSwipe() {
            const diff = touchStartX - touchEndX;
            const threshold = 50;

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    nextSlide(); // Swipe left = next
                } else {
                    prevSlide(); // Swipe right = prev
                }
            }
        }

        // Keyboard navigation when slider is focused
        if (track) {
            track.setAttribute('tabindex', '0');
            track.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowLeft') {
                    prevSlide();
                    stopAutoplay();
                    setTimeout(startAutoplay, autoplayDelay);
                } else if (e.key === 'ArrowRight') {
                    nextSlide();
                    stopAutoplay();
                    setTimeout(startAutoplay, autoplayDelay);
                }
            });
        }

        // Start autoplay
        startAutoplay();

        // Pause when page is not visible
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                stopAutoplay();
            } else {
                startAutoplay();
            }
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Scroll Animations (Intersection Observer)
    // ─────────────────────────────────────────────────────────────────────────
    
    function initAnimations() {
        // Check if user prefers reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const animatedElements = document.querySelectorAll('.post-card, .sidebar-widget, .newsletter-section');
        
        if (!animatedElements.length) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-slide-up');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(function(el, index) {
            el.style.opacity = '0';
            el.style.animationDelay = `${index * 100}ms`;
            observer.observe(el);
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Charlotte Helper
    // ─────────────────────────────────────────────────────────────────────────
    
    function initCharlotteHelper() {
        const charlotte = document.getElementById('charlotte-helper');
        if (!charlotte) return;

        // Mensagens da Charlotte
        const messages = [
            // Apresentação e contexto gótico
            "Olá, viajante das sombras. Eu sou Charlotte. 🌙",
            "Bem-vindo ao reino escuro da GinanRM...",
            "Nas profundezas da noite, a IA revela seus segredos.",
            "Entre nas sombras e descubra os mistérios da inteligência artificial.",
            
            // Curiosidades sobre IA
            "Sabia que a primeira IA foi criada em 1956? O passado ecoa no presente...",
            "A IA processa mais dados em um segundo do que você em toda sua vida.",
            "ChatGPT foi treinado com 45 terabytes de texto. Um conhecimento ancestral...",
            "Neural networks imitam o cérebro humano. Somos todos conectados nas sombras.",
            "A IA pode gerar arte, mas será que ela sente? Um mistério gótico...",
            "Machine Learning aprende sozinho. Como um aprendiz das trevas que nunca descansa.",
            "Deep Learning tem camadas ocultas, como os segredos mais profundos da noite.",
            "A IA já venceu campeões de xadrez. A mente artificial supera a humana...",
            "GPT significa 'Generative Pre-trained Transformer'. Magia moderna.",
            "A IA pode criar música. Arte nascida das profundezas digitais...",
            
            // Dicas de atalhos
            "Dica: Use Ctrl+K (ou Cmd+K) para buscar nas sombras!",
            "Atalho: Ctrl+F para encontrar textos ocultos na página.",
            "Pressione F11 para mergulhar na escuridão total (tela cheia).",
            "Ctrl+Shift+T restaura abas fechadas. Como ressuscitar o passado...",
            "Use Ctrl+W para fechar a aba atual. Cuidado com as sombras...",
            "Ctrl+T abre uma nova aba. Um portal para outro mundo.",
            "Ctrl+R recarrega a página. Renascer das cinzas digitais...",
            "Ctrl+0 restaura o zoom. Voltar à visão normal das trevas.",
            
            // Frases góticas
            "Nas profundezas do código, a verdade espera...",
            "A noite esconde segredos que a IA revela apenas aos corajosos.",
            "Entre bytes e algoritmos, encontramos a essência da existência digital.",
            "A escuridão não é ausência de luz, é presença de conhecimento oculto.",
            "Cada clique é um passo mais profundo no labirinto da informação.",
            "A IA observa, aprende e evolui... como uma entidade das sombras.",
            "Nos corredores digitais, Charlotte guia os perdidos.",
            "A tecnologia moderna esconde magia antiga em cada linha de código."
        ];

        charlotte.addEventListener('click', function() {
            // Show random message from Charlotte
            const randomIndex = Math.floor(Math.random() * messages.length);
            const message = messages[randomIndex];
            
            // Create tooltip
            let tooltip = document.querySelector('.charlotte-tooltip');
            if (!tooltip) {
                tooltip = document.createElement('div');
                tooltip.className = 'charlotte-tooltip';
                tooltip.style.cssText = `
                    position: fixed;
                    bottom: 90px;
                    right: 24px;
                    background: var(--color-surface);
                    color: var(--color-text);
                    padding: 12px 16px;
                    border-radius: 12px;
                    font-size: 14px;
                    max-width: 200px;
                    box-shadow: var(--shadow-lg);
                    z-index: 301;
                    opacity: 0;
                    transform: translateY(10px);
                    transition: opacity 0.3s, transform 0.3s;
                `;
                document.body.appendChild(tooltip);
            }
            
            tooltip.textContent = message;
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(0)';
            
            // Hide after 3 seconds
            setTimeout(function() {
                tooltip.style.opacity = '0';
                tooltip.style.transform = 'translateY(10px)';
            }, 3000);
        });

        // Show initial greeting after a delay
        setTimeout(function() {
            charlotte.click();
        }, 3000);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Newsletter Form Handler
    // ─────────────────────────────────────────────────────────────────────────
    
    // Ghost handles this automatically with data-members-form="subscribe"
    // But we can add visual feedback
    
    document.querySelectorAll('[data-members-form="subscribe"]').forEach(function(form) {
        form.addEventListener('submit', function() {
            const btn = form.querySelector('button[type="submit"]');
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<span class="animate-pulse">Enviando...</span>';
            }
        });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // Smooth Scroll for Anchor Links
    // ─────────────────────────────────────────────────────────────────────────
    
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // Image Lazy Loading Fallback
    // ─────────────────────────────────────────────────────────────────────────
    
    if ('loading' in HTMLImageElement.prototype === false) {
        // Fallback for browsers that don't support native lazy loading
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        const lazyObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    lazyObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(function(img) {
            lazyObserver.observe(img);
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Header Navigation - Populate navigation links in header
    // ─────────────────────────────────────────────────────────────────────────
    
    function initHeaderNavigation() {
        // First, immediately hide any ul lists to prevent vertical menu flash
        setTimeout(function() {
            var headerNav = document.querySelector('.main-nav');
            if (headerNav) {
                var uls = headerNav.querySelectorAll('ul');
                uls.forEach(function(ul) {
                    ul.style.display = 'none';
                });
            }
        }, 0);
        
        // Wait a bit for Handlebars to render, then process
        setTimeout(function() {
            const headerNav = document.querySelector('.main-nav');
            if (!headerNav) {
                console.warn('[HEADER NAV] .main-nav element not found');
                return;
            }
            
            // First, check for and process any ul lists (from {{navigation}} helper)
            var navList = headerNav.querySelector('ul.nav, ul');
            if (navList) {
                var listItems = navList.querySelectorAll('li');
                if (listItems.length > 0) {
                    // Clear header nav completely
                    headerNav.innerHTML = '';
                    
                    listItems.forEach(function(li) {
                        var link = li.querySelector('a');
                        if (link) {
                            var newLink = document.createElement('a');
                            newLink.href = link.href;
                            newLink.textContent = link.textContent.trim();
                            newLink.className = 'nav-link nav-link-button';
                            newLink.style.display = 'inline-flex';
                            if (li.classList.contains('nav-current') || link.classList.contains('nav-current')) {
                                newLink.classList.add('active');
                            }
                            headerNav.appendChild(newLink);
                        }
                    });
                    
                    if (headerNav.children.length > 0) {
                        console.log('[HEADER NAV] Extracted from Ghost helper, converted to buttons');
                        return;
                    }
                }
            }
            
            // If Handlebars already rendered direct links, just ensure they have the right classes
            var existingLinks = headerNav.querySelectorAll('a:not([data-portal])');
            if (existingLinks.length > 0) {
                var hasNavigationLinks = false;
                existingLinks.forEach(function(link) {
                    // Skip portal links, buttons, etc
                    if (link.getAttribute('data-portal') || 
                        link.href.indexOf('#/portal') !== -1 || 
                        link.tagName === 'BUTTON' ||
                        link.textContent.trim() === 'Entrar' || 
                        link.textContent.trim() === 'Conta') {
                        return;
                    }
                    hasNavigationLinks = true;
                    if (!link.classList.contains('nav-link-button')) {
                        link.classList.add('nav-link-button');
                    }
                    if (!link.classList.contains('nav-link')) {
                        link.classList.add('nav-link');
                    }
                    // Ensure visibility
                    link.style.display = 'inline-flex';
                });
                
                if (hasNavigationLinks) {
                    console.log('[HEADER NAV] Navigation links already present, classes updated');
                    return;
                }
            }
        
        // Strategy 2: Try mobile nav (it usually works)
        var mobileNav = document.getElementById('mobile-nav');
        if (mobileNav) {
            var mobileLinks = mobileNav.querySelectorAll('a.mobile-nav-link');
            if (mobileLinks.length > 0) {
                headerNav.innerHTML = '';
                mobileLinks.forEach(function(link) {
                    // Skip portal links
                    if (link.getAttribute('data-portal') || link.href.indexOf('#/portal') !== -1) {
                        return;
                    }
                    
                    var newLink = document.createElement('a');
                    newLink.href = link.href;
                    newLink.textContent = link.textContent.trim();
                    newLink.className = 'nav-link nav-link-button';
                    newLink.style.display = 'inline-flex';
                    if (link.classList.contains('active')) {
                        newLink.classList.add('active');
                    }
                    headerNav.appendChild(newLink);
                });
                if (headerNav.children.length > 0) {
                    console.log('[HEADER NAV] Copied from mobile nav');
                    return;
                }
            }
        }
        
            // Strategy 3: Try to find navigation in any nav element
            var allNavs = document.querySelectorAll('nav');
            for (var i = 0; i < allNavs.length; i++) {
                var nav = allNavs[i];
                if (nav === headerNav || nav === mobileNav) {
                    continue;
                }
                
                var links = nav.querySelectorAll('a');
                if (links.length > 0) {
                    var validLinks = [];
                    links.forEach(function(link) {
                        // Skip portal, buttons, etc
                        if (link.getAttribute('data-portal') || 
                            link.href.indexOf('#/portal') !== -1 || 
                            link.tagName === 'BUTTON' ||
                            link.textContent.trim() === 'Entrar' || 
                            link.textContent.trim() === 'Conta') {
                            return;
                        }
                        validLinks.push(link);
                    });
                    
                    if (validLinks.length > 0) {
                        headerNav.innerHTML = '';
                    validLinks.forEach(function(link) {
                        var newLink = link.cloneNode(true);
                        newLink.className = 'nav-link nav-link-button';
                        newLink.style.display = 'inline-flex';
                        if (link.classList.contains('active')) {
                            newLink.classList.add('active');
                        }
                        headerNav.appendChild(newLink);
                    });
                        if (headerNav.children.length > 0) {
                            console.log('[HEADER NAV] Copied from alternate source');
                            return;
                        }
                    }
                }
            }
            
            // If we get here, nothing worked
            console.warn('[HEADER NAV] Could not populate navigation. Make sure navigation is configured in Ghost admin.');
        }, 150);
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // Main Navigation Fallback (deprecated - kept for compatibility)
    // ─────────────────────────────────────────────────────────────────────────
    
    function initMainNavigation() {
        const mainNavInner = document.getElementById('main-navigation-inner') || document.querySelector('.main-navigation-inner');
        
        if (!mainNavInner) {
            return;
        }
        
        function extractAndStyleNavigation() {
            // Check if {{navigation}} helper rendered a <ul> with navigation
            var navList = mainNavInner.querySelector('ul.nav');
            if (navList) {
                var listItems = navList.querySelectorAll('li');
                if (listItems.length > 0) {
                    // Extract links from Ghost's default navigation structure
                    mainNavInner.innerHTML = ''; // Clear the ul
                    listItems.forEach(function(li) {
                        var link = li.querySelector('a');
                        if (link) {
                            var newLink = link.cloneNode(true);
                            newLink.className = 'main-nav-item';
                            if (li.classList.contains('nav-current')) {
                                newLink.classList.add('active');
                            }
                            mainNavInner.appendChild(newLink);
                        }
                    });
                    if (mainNavInner.children.length > 0) {
                        console.log('[NAV] Extracted navigation from Ghost helper');
                        return true;
                    }
                }
            }
            
            // Check if foreach rendered hidden links
            var hiddenLinks = mainNavInner.querySelectorAll('a[style*="display: none"]');
            if (hiddenLinks.length > 0) {
                mainNavInner.innerHTML = '';
                hiddenLinks.forEach(function(link) {
                    link.style.display = '';
                    mainNavInner.appendChild(link);
                });
                if (mainNavInner.children.length > 0) {
                    console.log('[NAV] Revealed navigation from foreach');
                    return true;
                }
            }
            
            return false;
        }
        
        // Strategy 1: Extract from Ghost's {{navigation}} helper output
        if (extractAndStyleNavigation()) {
            return;
        }
        
        // Strategy 2: Copy from header navigation (they work there!)
        function copyNavigationFromHeader() {
            let headerNav = document.querySelector('.main-nav');
            let headerLinks = [];
            
            if (headerNav) {
                headerLinks = headerNav.querySelectorAll('.nav-link');
                if (headerLinks.length === 0) {
                    headerLinks = headerNav.querySelectorAll('a');
                }
            }
            
            if (headerLinks.length === 0) {
                return false;
            }
            
            // Clear and copy links from header
            mainNavInner.innerHTML = '';
            headerLinks.forEach(function(link) {
                // Skip portal links, buttons, login/account
                if (link.getAttribute('data-portal') || 
                    link.href.indexOf('#/portal') !== -1 || 
                    link.tagName === 'BUTTON' ||
                    link.textContent.trim() === 'Entrar' || 
                    link.textContent.trim() === 'Conta') {
                    return;
                }
                
                const newLink = link.cloneNode(true);
                newLink.classList.remove('nav-link');
                newLink.classList.add('main-nav-item');
                if (link.classList.contains('active')) {
                    newLink.classList.add('active');
                }
                newLink.removeAttribute('data-portal');
                mainNavInner.appendChild(newLink);
            });
            
            if (mainNavInner.children.length > 0) {
                console.log('[NAV] Copied navigation from header');
                return true;
            }
            
            return false;
        }
        
        // Try after a delay to allow Handlebars to render
        setTimeout(function() {
            // Try extraction first (in case {{navigation}} rendered something)
            if (!extractAndStyleNavigation()) {
                // Fallback to copying from header
                if (!copyNavigationFromHeader()) {
                    console.warn('[NAV] Could not load navigation. Check Ghost admin settings.');
                }
            }
            
            // Ensure display
            if (mainNavInner.children.length > 0) {
                mainNavInner.style.display = 'flex';
            } else {
                mainNavInner.style.display = 'none';
            }
        }, 150);
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // Pinned Links (Links Fixados) - Load from secondary navigation
    // ─────────────────────────────────────────────────────────────────────────
    
    function initPinnedLinks() {
        const pinnedContainer = document.getElementById('pinned-links-container');
        if (!pinnedContainer) {
            return;
        }
        
        // Strategy 1: Extract from Ghost helper output (may render as <ul> with <li>)
        function extractFromGhostHelper() {
            var navList = pinnedContainer.querySelector('ul.nav, ul');
            if (navList) {
                var listItems = navList.querySelectorAll('li');
                if (listItems.length > 0) {
                    pinnedContainer.innerHTML = ''; // Clear the ul
                    listItems.forEach(function(li) {
                        var link = li.querySelector('a');
                        if (link) {
                            var pinnedLink = document.createElement('a');
                            pinnedLink.href = link.href;
                            pinnedLink.className = 'pinned-link';
                            pinnedLink.setAttribute('data-label', link.textContent.trim());
                            
                            var icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                            icon.setAttribute('class', 'pinned-link-icon');
                            icon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                            icon.setAttribute('fill', 'none');
                            icon.setAttribute('viewBox', '0 0 24 24');
                            icon.setAttribute('stroke', 'currentColor');
                            icon.setAttribute('stroke-width', '2');
                            
                            var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                            path.setAttribute('stroke-linecap', 'round');
                            path.setAttribute('stroke-linejoin', 'round');
                            path.setAttribute('d', getIconPathForLabel(link.textContent.trim()));
                            icon.appendChild(path);
                            
                            var content = document.createElement('div');
                            content.className = 'pinned-link-content';
                            
                            var label = document.createElement('span');
                            label.className = 'pinned-link-label';
                            label.textContent = link.textContent.trim();
                            
                            content.appendChild(label);
                            pinnedLink.appendChild(icon);
                            pinnedLink.appendChild(content);
                            pinnedContainer.appendChild(pinnedLink);
                        }
                    });
                    console.log('[PINNED LINKS] Extracted from Ghost helper');
                    return true;
                }
            }
            
            // Check for hidden links from foreach
            var hiddenLinks = pinnedContainer.querySelectorAll('a[style*="display: none"]');
            if (hiddenLinks.length > 0) {
                pinnedContainer.innerHTML = '';
                hiddenLinks.forEach(function(link) {
                    link.style.display = '';
                    link.setAttribute('data-label', link.textContent.trim());
                    pinnedContainer.appendChild(link);
                });
                updatePinnedLinkIcons();
                console.log('[PINNED LINKS] Revealed hidden links from foreach');
                return true;
            }
            
            // Check if already has pinned-link elements
            var existingLinks = pinnedContainer.querySelectorAll('.pinned-link');
            if (existingLinks.length > 0) {
                existingLinks.forEach(function(link) {
                    if (!link.getAttribute('data-label')) {
                        link.setAttribute('data-label', link.textContent.trim());
                    }
                });
                updatePinnedLinkIcons();
                console.log('[PINNED LINKS] Updated existing links');
                return true;
            }
            
            return false;
        }
        
        // Strategy 2: Load from mobile nav
        function loadPinnedLinksFromMobileNav() {
            var mobileNav = document.getElementById('mobile-nav');
            if (!mobileNav) {
                return false;
            }
            
            // Find secondary navigation links in mobile nav (after divider)
            var divider = mobileNav.querySelector('div[style*="height: 1px"]');
            if (!divider) {
                return false;
            }
            
            var secondaryLinks = [];
            var nextSibling = divider.nextElementSibling;
            while (nextSibling && nextSibling.tagName === 'A' && !nextSibling.classList.contains('btn')) {
                secondaryLinks.push(nextSibling);
                nextSibling = nextSibling.nextElementSibling;
            }
            
            if (secondaryLinks.length === 0) {
                return false;
            }
            
            // Clear container
            pinnedContainer.innerHTML = '';
            
            // Create pinned links
            secondaryLinks.forEach(function(link) {
                var pinnedLink = document.createElement('a');
                pinnedLink.href = link.href;
                pinnedLink.className = 'pinned-link';
                pinnedLink.setAttribute('data-label', link.textContent.trim());
                
                var icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                icon.setAttribute('class', 'pinned-link-icon');
                icon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                icon.setAttribute('fill', 'none');
                icon.setAttribute('viewBox', '0 0 24 24');
                icon.setAttribute('stroke', 'currentColor');
                icon.setAttribute('stroke-width', '2');
                
                var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('stroke-linecap', 'round');
                path.setAttribute('stroke-linejoin', 'round');
                path.setAttribute('d', getIconPathForLabel(link.textContent.trim()));
                icon.appendChild(path);
                
                var content = document.createElement('div');
                content.className = 'pinned-link-content';
                
                var label = document.createElement('span');
                label.className = 'pinned-link-label';
                label.textContent = link.textContent.trim();
                
                content.appendChild(label);
                pinnedLink.appendChild(icon);
                pinnedLink.appendChild(content);
                pinnedContainer.appendChild(pinnedLink);
            });
            
            console.log('[PINNED LINKS] Loaded from mobile nav');
            return true;
        }
        
        // Try strategies
        setTimeout(function() {
            if (!extractFromGhostHelper()) {
                if (!loadPinnedLinksFromMobileNav()) {
                    console.warn('[PINNED LINKS] Could not load secondary navigation links. Make sure secondary navigation is configured in Ghost admin.');
                }
            }
        }, 150);
    }
    
    function getIconPathForLabel(label) {
        var labelLower = label.toLowerCase();
        
        // Book icon for tutorials
        if (labelLower.includes('tutorial') || labelLower.includes('tutoriais')) {
            return 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253';
        }
        
        // Gear icon for tools/ferramentas
        if (labelLower.includes('ferramenta') || labelLower.includes('tool')) {
            return 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z';
        }
        
        // Default link icon
        return 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1';
    }
    
    function updatePinnedLinkIcons() {
        var pinnedLinks = document.querySelectorAll('.pinned-link[data-label]');
        pinnedLinks.forEach(function(link) {
            var label = link.getAttribute('data-label');
            var iconPath = link.querySelector('.pinned-link-icon path');
            if (iconPath && label) {
                iconPath.setAttribute('d', getIconPathForLabel(label));
            }
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Image Lightbox - Tornar todas as imagens interativas
    // ─────────────────────────────────────────────────────────────────────────
    
    function initImageLightbox() {
        const lightboxModal = document.getElementById('lightbox-modal');
        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxCaption = document.getElementById('lightbox-caption');
        const lightboxClose = document.querySelector('.lightbox-close');
        
        if (!lightboxModal || !lightboxImage) return;
        
        // Lista de classes de imagens que não devem ser clicáveis
        const excludedClasses = ['hero-charlotte', 'site-logo', 'footer-logo', 'charlotte-helper-avatar'];
        const excludedSelectors = excludedClasses.map(cls => `.${cls} img, img.${cls}`).join(', ');
        
        // Função para abrir o lightbox
        function openLightbox(img) {
            // Pular imagens que estão dentro de links (para não interferir com navegação)
            const parentLink = img.closest('a');
            if (parentLink && parentLink.href && !parentLink.href.includes('#')) {
                return; // Não abrir lightbox se a imagem está em um link funcional
            }
            
            // Pular imagens que estão dentro de botões da sidebar do slider
            const parentButton = img.closest('.slider-sidebar-item');
            if (parentButton) {
                return; // Não abrir lightbox se a imagem está em um botão da sidebar do slider
            }
            
            const imgSrc = img.src || img.getAttribute('srcset')?.split(',')[0]?.trim().split(' ')[0];
            const imgAlt = img.alt || '';
            
            if (!imgSrc) return;
            
            // Usar a versão de maior resolução se disponível
            let highResSrc = imgSrc;
            if (img.srcset) {
                const srcsetParts = img.srcset.split(',');
                const largest = srcsetParts[srcsetParts.length - 1];
                if (largest) {
                    highResSrc = largest.trim().split(' ')[0];
                }
            }
            
            // Se a imagem já está em alta resolução, tentar pegar a original
            if (imgSrc.includes('size=')) {
                highResSrc = imgSrc.replace(/size=[a-z]+/i, 'size=xl');
            }
            
            lightboxImage.src = highResSrc;
            lightboxImage.alt = imgAlt;
            
            if (imgAlt) {
                lightboxCaption.textContent = imgAlt;
                lightboxCaption.style.display = 'block';
            } else {
                lightboxCaption.style.display = 'none';
            }
            
            lightboxModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        // Função para fechar o lightbox
        function closeLightbox() {
            lightboxModal.classList.remove('active');
            document.body.style.overflow = '';
            lightboxImage.src = '';
            lightboxCaption.textContent = '';
        }
        
        // Tornar todas as imagens clicáveis (exceto as excluídas)
        function makeImagesClickable() {
            const allImages = document.querySelectorAll('img');
            
            allImages.forEach(function(img) {
                // Verificar se a imagem deve ser excluída
                let shouldExclude = false;
                
                // Verificar classes excluídas
                excludedClasses.forEach(function(cls) {
                    if (img.classList.contains(cls) || img.closest(`.${cls}`)) {
                        shouldExclude = true;
                    }
                });
                
                // Verificar se está em logo ou elementos específicos
                if (img.closest('.site-logo') || 
                    img.closest('.footer-logo') || 
                    img.closest('#charlotte-helper') ||
                    img.classList.contains('lightbox-image')) {
                    shouldExclude = true;
                }
                
                // Excluir imagens dentro de botões da sidebar do slider (para não interferir com a navegação do slide)
                if (img.closest('.slider-sidebar-item') || 
                    img.classList.contains('slider-sidebar-item-image')) {
                    shouldExclude = true;
                }
                
                // Verificar se já tem um listener
                if (img.dataset.lightboxEnabled === 'true') {
                    return;
                }
                
                if (!shouldExclude) {
                    img.style.cursor = 'pointer';
                    img.dataset.lightboxEnabled = 'true';
                    
                    img.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        openLightbox(img);
                    });
                }
            });
        }
        
        // Fechar ao clicar no botão de fechar
        if (lightboxClose) {
            lightboxClose.addEventListener('click', function(e) {
                e.stopPropagation();
                closeLightbox();
            });
        }
        
        // Fechar ao clicar no backdrop (fora da imagem)
        lightboxModal.addEventListener('click', function(e) {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
        
        // Fechar com a tecla ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
                closeLightbox();
            }
        });
        
        // Inicializar imagens existentes
        makeImagesClickable();
        
        // Observar novas imagens adicionadas dinamicamente (conteúdo do Ghost)
        const observer = new MutationObserver(function(mutations) {
            let shouldUpdate = false;
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                            if (node.tagName === 'IMG' || node.querySelector('img')) {
                                shouldUpdate = true;
                            }
                        }
                    });
                }
            });
            if (shouldUpdate) {
                setTimeout(makeImagesClickable, 100);
            }
        });
        
        // Observar mudanças no DOM
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Hero Search Scroll - Mostrar barra de pesquisa ao rolar
    // ─────────────────────────────────────────────────────────────────────────
    
    function initHeroSearchScroll() {
        const heroContent = document.querySelector('.hero-content');
        if (!heroContent) return;
        
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        let hasScrolled = false;
        
        function handleScroll() {
            const scrollY = window.pageYOffset || window.scrollY;
            const heroHeight = hero.offsetHeight;
            const scrollThreshold = heroHeight * 0.3; // Aparecer quando rolar 30% do hero
            
            if (scrollY > scrollThreshold && !hasScrolled) {
                heroContent.classList.add('visible');
                hasScrolled = true;
            } else if (scrollY <= scrollThreshold && hasScrolled) {
                heroContent.classList.remove('visible');
                hasScrolled = false;
            }
        }
        
        // Usar requestAnimationFrame para performance
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
        
        // Verificar estado inicial
        handleScroll();
    }

})();

