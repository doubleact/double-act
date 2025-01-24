import { BaseCard } from '../BaseCard.js';
import { adjustAllTextElements } from '../utils/dynamicFontSize.js';

export class MultiplayerAnswerCard extends BaseCard {
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
        cardElement.classList.add('multiplayer-answer-card');
        cardElement.style.backgroundImage = `url("./images/background/answercardbackground.png")`;
        cardElement.style.backgroundPosition = 'center center';
        cardElement.style.backgroundSize = 'cover';
        
        // Empty header
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

    destroy() {
        // Clean up resize observer when card is destroyed
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        super.destroy();
    }

    attachEventListeners() {
        // Correct button
        const correctButton = this.container.querySelector('.correct-button');
        if (correctButton) {
            correctButton.addEventListener('click', () => {
                // Add correct answer for current player
                window.game.playerScores[window.game.currentPlayer - 1] += 10;
                window.game.playerCorrectAnswers[window.game.currentPlayer - 1]++;
                this.moveToNextPlayer();
            });
        }

        // Wrong button
        const wrongButton = this.container.querySelector('.wrong-button');
        if (wrongButton) {
            wrongButton.addEventListener('click', () => {
                // Add wrong answer for current player
                window.game.playerWrongAnswers[window.game.currentPlayer - 1]++;
                this.moveToNextPlayer();
            });
        }
    }

    moveToNextPlayer() {
        // Move to next player
        window.game.currentPlayer = (window.game.currentPlayer % window.game.numberOfPlayers) + 1;
        
        // Move to next card
        window.game.currentCardIndex++;
        
        // Check if game is over
        if (window.game.currentCardIndex >= window.game.cards.length) {
            this.showFinalScores();
        } else {
            // Show next clue card
            import('./MultiplayerClueCard.js').then(module => {
                new module.MultiplayerClueCard(
                    this.container,
                    window.game.cards[window.game.currentCardIndex],
                    window.game.currentCardIndex + 1,
                    window.game.cards.length
                );
            });
        }
    }

    showFinalScores() {
        import('./MultiplayerScoreCard.js').then(module => {
            new module.MultiplayerScoreCard(
                this.container,
                window.game.playerScores,
                window.game.numberOfPlayers,
                this.currentCard,
                this.totalCards,
                window.game.currentPlayer,
                null
            );
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
}
