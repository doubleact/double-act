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
        cardElement.style.background = `url("images/background/answercardbackground.png") center center/cover no-repeat`;
        
        // Clear header
        this.updateHeader('', '');
        
        // Add small logo to sub-header
        this.updateSubHeader(`
            <img src="/images/doubleactlogo.png" alt="Double Act Logo" class="logo-small">
        `);
        
        // Add answer content to body
        this.updateBody(`
            <div class="answer-container">
                <div class="character-name">${this.cardData.character}</div>
                <div class="movie-container">
                    <div class="movie-name">${this.cardData.movies[0]}</div>
                    <div class="ampersand">&</div>
                    <div class="movie-name">${this.cardData.movies[1]}</div>
                </div>
            </div>
        `);

        // Add response buttons to sub-footer
        this.updateSubFooter(`
            <div class="answer-buttons">
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

    updateMoviesList(movies) {
        const moviesContainer = this.container.querySelector('.movies-container');
        if (!moviesContainer) return;

        // Split movies into two groups at the middle
        const midPoint = Math.ceil(movies.length / 2);
        const firstGroup = movies.slice(0, midPoint);
        const secondGroup = movies.slice(midPoint);

        let moviesHTML = '';
        
        // Add first group
        firstGroup.forEach(movie => {
            moviesHTML += `<div class="movie-title">${movie}</div>`;
        });

        // Add ampersand if there are movies in both groups
        if (secondGroup.length > 0) {
            moviesHTML += `<div class="movie-ampersand">&</div>`;
        }

        // Add second group
        secondGroup.forEach(movie => {
            moviesHTML += `<div class="movie-title">${movie}</div>`;
        });

        moviesContainer.innerHTML = moviesHTML;
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
