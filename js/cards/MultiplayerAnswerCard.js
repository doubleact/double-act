import { BaseCard } from '../BaseCard.js';

export class MultiplayerAnswerCard extends BaseCard {
    constructor(container, cardData, currentCard, totalCards) {
        super(container);
        this.cardData = cardData;
        this.currentCard = currentCard;
        this.totalCards = totalCards;
        this.init();
    }

    init() {
        this.createCardStructure();
        
        // Add answer-card class to the card element
        const cardElement = this.container.querySelector('.card');
        cardElement.classList.add('multiplayer-answer-card');
        cardElement.style.background = `url("./images/background/answercardbackground.png") center center/cover no-repeat`;
        
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
