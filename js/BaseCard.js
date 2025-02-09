export class BaseCard {
    constructor(container) {
        this.container = container;
        this.debugMode = true;  // Set to true by default
        this.buttonDebugMode = false;
        this.enterTime = new Date().toISOString();
        this.trackCardEnter();
        
        // Initialize debug mode immediately
        this.toggleDebugMode();

        // Add keyboard event listener for debug mode
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                this.toggleDebugMode();
            } else if (e.ctrlKey && e.key === 'b') {
                e.preventDefault();
                this.toggleButtonDebugMode();
            }
        });
    }

    initializeDebugMode() {
        // No longer needed, as the keyboard event listener is now in the constructor
    }

    toggleDebugMode() {
        this.debugMode = !this.debugMode;
        const cardElement = this.container.querySelector('.card');
        if (cardElement) {
            cardElement.classList.toggle('debug-mode', this.debugMode);
            
            // Remove any existing debug info
            cardElement.querySelectorAll('.debug-info').forEach(el => el.remove());
            
            if (this.debugMode) {
                // Add viewport info at the top of the card
                const viewportInfo = document.createElement('div');
                viewportInfo.className = 'viewport-debug-info';
                viewportInfo.textContent = `Viewport: ${window.innerWidth}×${window.innerHeight}`;
                cardElement.appendChild(viewportInfo);

                // Add measurements for each section
                const sections = [
                    { selector: '.card-header', row: 1 },
                    { selector: '.card-subheader', row: 2 },
                    { selector: '.card-body', row: 3 },
                    { selector: '.card-subfooter', row: 4 },
                    { selector: '.card-footer', row: 5 }
                ];
                
                sections.forEach(({ selector, row }) => {
                    const element = cardElement.querySelector(selector);
                    if (element) {
                        const height = element.offsetHeight;
                        const topDistance = element.offsetTop;
                        const debugInfo = document.createElement('div');
                        debugInfo.className = 'debug-info';
                        debugInfo.textContent = `Row ${row} | H: ${height}px | Top: ${topDistance}px`;
                        element.appendChild(debugInfo);
                        
                        // Add hover measurements for buttons and counters within this section
                        const elementsToMeasure = element.querySelectorAll('.help-button, .counter, .score-counter, .answer-button, .player-turn');
                        elementsToMeasure.forEach(el => {
                            const rect = el.getBoundingClientRect();
                            const elHeight = Math.round(rect.height);
                            const elWidth = Math.round(rect.width);
                            const tooltip = document.createElement('div');
                            tooltip.className = 'debug-info';
                            tooltip.style.display = 'none';
                            tooltip.textContent = `H: ${elHeight}px | W: ${elWidth}px`;
                            el.appendChild(tooltip);
                            
                            el.addEventListener('mouseenter', () => tooltip.style.display = 'block');
                            el.addEventListener('mouseleave', () => tooltip.style.display = 'none');
                        });
                    }
                });

                // Update viewport info on resize
                const updateViewportInfo = () => {
                    viewportInfo.textContent = `Viewport: ${window.innerWidth}×${window.innerHeight}`;
                };
                window.addEventListener('resize', updateViewportInfo);
                // Store the listener so we can remove it later
                cardElement.viewportListener = updateViewportInfo;
            } else {
                // Remove resize listener if it exists
                if (cardElement.viewportListener) {
                    window.removeEventListener('resize', cardElement.viewportListener);
                    cardElement.viewportListener = null;
                }
            }
        }
    }

    toggleButtonDebugMode() {
        this.buttonDebugMode = !this.buttonDebugMode;
        const cardElement = this.container.querySelector('.card');
        if (cardElement) {
            cardElement.classList.toggle('button-debug-mode', this.buttonDebugMode);
            
            // Remove any existing button debug info
            cardElement.querySelectorAll('.button-debug-info').forEach(el => el.remove());
            
            if (this.buttonDebugMode) {
                const buttonSelectors = [
                    '.help-button',
                    '.counter',
                    '.score-counter',
                    '.answer-button',
                    '.player-turn',
                    '.next-button',
                    '.back-button',
                    '.continue-button',
                    '.end-game-button',
                    '.correct-button',
                    '.wrong-button',
                    '.start-button',
                    '.play-again-button',
                    '.home-button',
                    '.mode-button',
                    '.number-button',
                    '.footer-button',
                    '.red-button'
                ];
                
                const selector = buttonSelectors.join(', ');
                const elementsToMeasure = cardElement.querySelectorAll(selector);
                
                elementsToMeasure.forEach(el => {
                    const rect = el.getBoundingClientRect();
                    const height = Math.round(rect.height);
                    const width = Math.round(rect.width);
                    const debugInfo = document.createElement('div');
                    debugInfo.className = 'button-debug-info';
                    debugInfo.textContent = `${width}×${height}`;
                    el.appendChild(debugInfo);
                });
            }
        }
    }

    trackCardEnter() {
        import('./simple-stats.js').then(module => {
            const cardType = this.constructor.name.toLowerCase().replace('card', '');
            module.Stats.trackCardInteraction(cardType, {
                enterTime: this.enterTime,
                cardData: this.cardData || null,
                currentCard: this.currentCard || null,
                totalCards: this.totalCards || null
            });
        });
    }

    trackCardExit() {
        import('./simple-stats.js').then(module => {
            const cardType = this.constructor.name.toLowerCase().replace('card', '');
            module.Stats.trackCardInteraction(cardType, {
                exitTime: new Date().toISOString(),
                enterTime: this.enterTime,
                timeSpent: (new Date() - new Date(this.enterTime)) / 1000,
                cardData: this.cardData || null,
                currentCard: this.currentCard || null,
                totalCards: this.totalCards || null
            });
        });
    }

    createCardStructure() {
        // Create new card
        const newCard = document.createElement('div');
        newCard.id = 'currentCard';
        newCard.className = 'card';
        newCard.innerHTML = `
            <div class="card-header"></div>
            <div class="card-subheader"></div>
            <div class="card-body"></div>
            <div class="card-subfooter"></div>
            <div class="card-footer"></div>
        `;

        // Remove any existing cards
        const existingCard = this.container.querySelector('.card');
        if (existingCard) {
            existingCard.remove();
        }
        
        // Add the new card
        this.container.appendChild(newCard);

        // Only initialize Hammer if we're not in export mode
        if (!this.container.classList.contains('temp-export-container')) {
            this.initializeSwipeGestures();
        }
    }

    initializeSwipeGestures() {
        if (typeof Hammer !== 'undefined') {
            this.hammer = new Hammer(this.container.querySelector('.card'));
            this.hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
        }
    }

    formatMoviesList(movies) {
        if (!Array.isArray(movies)) return [];
        
        // Process each movie string and split by commas
        const allMovies = movies.reduce((acc, movie) => {
            if (typeof movie === 'string') {
                // Split by comma and clean up whitespace
                const splitMovies = movie.split(',').map(m => m.trim());
                // Filter out empty strings
                const validMovies = splitMovies.filter(m => m.length > 0);
                acc.push(...validMovies);
            }
            return acc;
        }, []);

        // Remove duplicates while preserving order
        return [...new Set(allMovies)];
    }

    updateMoviesList(movies, container) {
        const formattedMovies = this.formatMoviesList(movies);
        
        if (formattedMovies.length === 0) return;

        // Create a container for vertical stacking
        const movieListContainer = document.createElement('div');
        movieListContainer.className = 'movie-list';
        
        formattedMovies.forEach(movie => {
            const movieDiv = document.createElement('div');
            movieDiv.className = 'movie-name';
            movieDiv.textContent = movie;
            movieListContainer.appendChild(movieDiv);
        });

        container.innerHTML = '';
        container.appendChild(movieListContainer);
    }

    cleanup() {
        this.trackCardExit();
        // Clean up Hammer.js
        if (this.hammer) {
            this.hammer.destroy();
            this.hammer = null;
        }
        // Remove any event listeners or cleanup tasks
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    }

    updateHeader(leftContent = '', rightContent = '') {
        const header = this.container.querySelector('.card-header');
        if (header) {
            header.innerHTML = `
                <div class="header-left">${leftContent}</div>
                <div class="header-right">${rightContent}</div>
            `;
        }
    }

    updateSubHeader(content = '') {
        const subHeader = this.container.querySelector('.card-subheader');
        if (subHeader) {
            subHeader.innerHTML = content;
        }
    }

    updateBody(content = '') {
        const body = this.container.querySelector('.card-body');
        if (body) {
            body.innerHTML = content;
        }
    }

    updateSubFooter(content = '') {
        const subFooter = this.container.querySelector('.card-subfooter');
        if (subFooter) {
            subFooter.innerHTML = content;
        }
    }

    updateFooter(content = '') {
        const footer = this.container.querySelector('.card-footer');
        if (footer) {
            footer.innerHTML = content;
        }
    }
}
