import { BaseCard } from '../BaseCard.js';

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
        cardElement.style.backgroundImage = `url("./double-act/images/background/answercardbackground.png")`;
        cardElement.style.backgroundPosition = 'center center';
        cardElement.style.backgroundSize = 'cover';
        cardElement.style.backgroundRepeat = 'no-repeat';
        
        // Clear header
        this.updateHeader('', '');
        
        // Add small logo to sub-header
        this.updateSubHeader(`
            <img src="./double-act/images/doubleactlogo.png" alt="Double Act Logo" class="logo-small">
        `);
        
        // Add answer content to body
        const bodyContent = document.createElement('div');
        bodyContent.className = 'answer-container';
        
        const characterName = document.createElement('div');
        characterName.className = 'character-name';
        characterName.textContent = this.cardData.character;
        
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
        
        this.attachEventListeners();
        this.setupDynamicTextSizing();
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
                this.goToNextCard();
            });
        }
    }

    setupDynamicTextSizing() {
        // Function to adjust text size
        const adjustTextSize = (element) => {
            const maxWidth = element.offsetWidth;
            let fontSize = parseInt(window.getComputedStyle(element).fontSize);
            element.style.whiteSpace = 'nowrap';
            
            while (element.scrollWidth > maxWidth && fontSize > 12) {
                fontSize--;
                element.style.fontSize = fontSize + 'px';
            }
        };

        // Adjust character name
        const characterElement = this.container.querySelector('.character-name');
        if (characterElement) {
            adjustTextSize(characterElement);
        }

        // Adjust movie titles
        const movieElements = this.container.querySelectorAll('.movie-name');
        movieElements.forEach(element => {
            adjustTextSize(element);
        });

        // Add resize listener
        window.addEventListener('resize', () => {
            if (characterElement) {
                characterElement.style.fontSize = '';
                adjustTextSize(characterElement);
            }
            movieElements.forEach(element => {
                element.style.fontSize = '';
                adjustTextSize(element);
            });
        });
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
                    this.totalCards
                );
            });
            return;
        }

        // Go to next card
        import('./SinglePlayerClueCard.js').then(module => {
            new module.SinglePlayerClueCard(
                this.container,
                window.game.cards[window.game.currentCardIndex],
                this.currentCard + 1,
                this.totalCards
            );
        });
    }
}
