import { BaseCard } from '../BaseCard.js';
import { adjustAllTextElements } from '../utils/dynamicFontSize.js';

export class SinglePlayerAnswerCard extends BaseCard {
    constructor(container, cardData, currentCard, totalCards, score) {
        super(container);
        this.cardData = cardData;
        this.currentCard = currentCard;
        this.totalCards = totalCards;
        this.score = score;
        this.init();
    }

    init() {
        this.createCardStructure();
        
        // Set background based on card type
        const cardElement = this.container.querySelector('.card');
        cardElement.classList.add('singleplayer-answer-card');
        cardElement.style.backgroundImage = `url("./images/background/answercardbackground.png")`;
        cardElement.style.backgroundPosition = 'center center';
        cardElement.style.backgroundSize = 'cover';
        
        // Clear header
        this.updateHeader('', '');
        
        // Add small logo to sub-header
        this.updateSubHeader(`
            <img src="./images/doubleactlogo.png" alt="Double Act Logo" class="logo-small">
        `);
        
        // Add answer content to body
        const bodyContent = document.createElement('div');
        bodyContent.className = 'answer-container';
        
        const characterName = document.createElement('div');
        characterName.className = 'character-name';
        // Replace "/" with line break
        characterName.innerHTML = this.cardData.character.replace(/\s*\/\s*/g, '<br>');
        
        const movieContainer = document.createElement('div');
        movieContainer.className = 'movie-container';
        
        bodyContent.appendChild(characterName);
        bodyContent.appendChild(movieContainer);
        
        this.updateBody(bodyContent.outerHTML);
        
        // Now update the movies list in the container
        const movieContainerElement = this.container.querySelector('.movie-container');
        this.updateMoviesList(this.cardData.movies, movieContainerElement);
        
        // Add buttons to sub-footer
        this.updateSubFooter(`
            <div class="button-container">
                <button class="correct-button">Correct</button>
                <button class="wrong-button">Wrong</button>
            </div>
        `);
        
        // Clear footer
        this.updateFooter('');
        
        // Adjust font sizes after content is created
        setTimeout(() => adjustAllTextElements(), 0);
        
        // Add resize listener for this specific card
        this.resizeObserver = new ResizeObserver(() => {
            adjustAllTextElements();
        });
        this.resizeObserver.observe(cardElement);
        
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Correct button
        const correctButton = this.container.querySelector('.correct-button');
        if (correctButton) {
            correctButton.addEventListener('click', () => {
                // Add 10 points to score and increment correct answers
                window.game.score = (window.game.score || 0) + 10;
                window.game.correctAnswers = (window.game.correctAnswers || 0) + 1;
                window.game.currentCardIndex = (window.game.currentCardIndex || 0) + 1;

                // Track the answer result
                import('../simple-stats.js').then(module => {
                    module.Stats.trackCardInteraction('answer', {
                        cardId: this.currentCard,
                        question: this.cardData.character,
                        answer: this.cardData.actors.join(' & '),
                        result: 'correct',
                        timeSpent: (new Date() - new Date(this.enterTime)) / 1000,
                        deckName: window.game.currentDeck || 'Unknown Deck',
                        totalCards: this.totalCards
                    });
                });

                this.goToNextCard();
            });
        }

        // Pass button
        const passButton = this.container.querySelector('.wrong-button');
        if (passButton) {
            passButton.addEventListener('click', () => {
                // Increment wrong answers counter
                window.game.wrongAnswers = (window.game.wrongAnswers || 0) + 1;
                window.game.currentCardIndex = (window.game.currentCardIndex || 0) + 1;

                // Track the answer result
                import('../simple-stats.js').then(module => {
                    module.Stats.trackCardInteraction('answer', {
                        cardId: this.currentCard,
                        question: this.cardData.character,
                        answer: this.cardData.actors.join(' & '),
                        result: 'wrong',
                        timeSpent: (new Date() - new Date(this.enterTime)) / 1000,
                        deckName: window.game.currentDeck || 'Unknown Deck',
                        totalCards: this.totalCards
                    });
                });

                this.goToNextCard();
            });
        }
    }

    async quickCapture() {
        const cardElement = this.container.querySelector('.card');
        if (!cardElement) return;

        // Store original styles
        const originalStyles = {
            width: cardElement.style.width,
            height: cardElement.style.height,
            transform: cardElement.style.transform
        };

        // Set capture dimensions
        cardElement.style.width = '897px';
        cardElement.style.height = '1487px';
        cardElement.style.transform = 'none';

        // Center content vertically
        const content = cardElement.querySelector('.answer-container');
        if (content) {
            content.style.display = 'flex';
            content.style.flexDirection = 'column';
            content.style.justifyContent = 'center';
            content.style.height = '100%';
        }

        // Hide UI elements
        const elementsToHide = [
            '.counter', '.score-counter', '.card-counter', '.score',
            '.help-button', '.answer-button', '.button-container',
            '.button', '#card-counter', '#score', '.controls',
            '.control-button', '.header', '.debug-info',
            '.viewport-debug-info', '.button-debug-info',
            '.correct-button', '.wrong-button'
        ];
            
        const hiddenElements = [];
        cardElement.querySelectorAll(elementsToHide.join(',')).forEach(el => {
            if (el.style.display !== 'none') {
                hiddenElements.push({ element: el, display: el.style.display });
                el.style.display = 'none';
            }
        });

        // Capture the card
        const canvas = await html2canvas(cardElement, {
            width: 897,
            height: 1487,
            scale: 1,
            backgroundColor: null
        });

        // Create download link
        const link = document.createElement('a');
        const cardNumber = String(this.currentCard).padStart(3, '0');
        link.download = `DoubleAct-Type1-${cardNumber}-B-Answer.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        // Restore original styles
        cardElement.style.width = originalStyles.width;
        cardElement.style.height = originalStyles.height;
        cardElement.style.transform = originalStyles.transform;

        // Restore content styles
        if (content) {
            content.style.display = '';
            content.style.flexDirection = '';
            content.style.justifyContent = '';
            content.style.height = '';
        }

        // Restore hidden elements
        hiddenElements.forEach(({ element, display }) => {
            element.style.display = display;
        });
    }

    togglePrintMode() {
        const cardElement = this.container.querySelector('.card');
        if (!cardElement) return;

        if (cardElement.classList.contains('print-mode')) {
            // Restore original styles
            cardElement.classList.remove('print-mode');
            cardElement.style.width = '';
            cardElement.style.height = '';
            cardElement.style.transform = '';

            // Restore content styles
            const content = cardElement.querySelector('.answer-container');
            if (content) {
                content.style.display = '';
                content.style.flexDirection = '';
                content.style.justifyContent = '';
                content.style.height = '';
                content.style.padding = '';
            }

            // Show all elements
            cardElement.querySelectorAll('.hidden-for-print').forEach(el => {
                el.classList.remove('hidden-for-print');
                el.style.display = '';
            });
        } else {
            // Enter print mode
            cardElement.classList.add('print-mode');
            cardElement.style.width = '897px';
            cardElement.style.height = '1487px';
            cardElement.style.transform = 'none';

            // Center content vertically
            const content = cardElement.querySelector('.answer-container');
            if (content) {
                content.style.display = 'flex';
                content.style.flexDirection = 'column';
                content.style.justifyContent = 'center';
                content.style.height = '100%';
            }

            // Hide UI elements
            const elementsToHide = [
                '.counter', '.score-counter', '.card-counter', '.score',
                '.help-button', '.answer-button', '.button-container',
                '.button', '#card-counter', '#score', '.controls',
                '.control-button', '.header', '.debug-info',
                '.viewport-debug-info', '.button-debug-info',
                '.correct-button', '.wrong-button'
            ];
                
            cardElement.querySelectorAll(elementsToHide.join(',')).forEach(el => {
                el.classList.add('hidden-for-print');
                el.style.display = 'none';
            });
        }
    }

    destroy() {
        // Clean up resize observer when card is destroyed
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        super.destroy();
    }

    updateMoviesList(movies, container) {
        if (!Array.isArray(movies) || movies.length === 0) return;

        // Process Movie1 and Movie2 separately
        const processMovieString = (movieStr) => {
            if (!movieStr) return [];
            return movieStr.split(',').map(m => m.trim()).filter(m => m.length > 0);
        };

        const movie1List = processMovieString(movies[0]);
        const movie2List = movies.length > 1 ? processMovieString(movies[1]) : [];

        // Create the HTML structure
        let html = '<div class="movie-group">';
        
        // Add Movie1 list
        movie1List.forEach(movie => {
            html += `<div class="movie-name">${movie}</div>`;
        });

        // Add ampersand if there's a second movie list
        if (movie2List.length > 0) {
            html += '<div class="ampersand">&</div>';
        }

        // Add Movie2 list
        movie2List.forEach(movie => {
            html += `<div class="movie-name">${movie}</div>`;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    goToNextCard() {
        // Check if this was the last card
        if (this.currentCard >= this.totalCards) {
            import('./SinglePlayerScoreCard.js').then(module => {
                new module.SinglePlayerScoreCard(
                    this.container,
                    window.game.score || 0,
                    window.game.correctAnswers || 0,
                    window.game.wrongAnswers || 0,
                    this.totalCards,
                    this.totalCards * 10
                );
            }).catch(error => {
                console.error('Error loading score card:', error);
            });
            return;
        }

        // If not the last card, continue to next clue card
        const nextCardNumber = this.currentCard + 1;
        import('./SinglePlayerClueCard.js').then(module => {
            new module.SinglePlayerClueCard(
                this.container,
                window.game.cards[nextCardNumber - 1],
                nextCardNumber,
                this.totalCards,
                window.game.score || 0
            );
        }).catch(error => {
            console.error('Error loading next card:', error);
        });
    }
}
