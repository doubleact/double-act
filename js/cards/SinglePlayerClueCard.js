import { BaseCard } from '../BaseCard.js';
import { SinglePlayerAnswerCard } from './SinglePlayerAnswerCard.js';
import { DynamicClueHelpCard } from './DynamicClueHelpCard.js';

export class SinglePlayerClueCard extends BaseCard {
    constructor(container, cardData, currentCard = 1, totalCards = 10) {
        super(container);
        this.cardData = cardData;
        this.currentCard = currentCard;
        this.totalCards = totalCards;
        
        // Initialize game scores if not already set
        if (typeof window.game.correctAnswers === 'undefined') {
            window.game.correctAnswers = 0;
            window.game.wrongAnswers = 0;
            window.game.totalCards = totalCards;
            window.game.totalPossiblePoints = totalCards;
        }
        
        this.init();
    }

    init() {
        // Validate card data
        if (!this.cardData || !Array.isArray(this.cardData.actors) || this.cardData.actors.length !== 2) {
            console.error('Invalid card data:', this.cardData);
            throw new Error('Invalid card data: actors array must contain exactly 2 actors');
        }

        this.createCardStructure();
        
        // Add clue-card class to the card element
        const cardElement = this.container.querySelector('.card');
        cardElement.classList.add('singleplayer-clue-card');
        cardElement.style.background = `url("/images/background/type${this.cardData.type}background.png") center center/cover no-repeat`;
        
        // Format score as 3-digit number with leading zeros
        const formattedScore = `Score: ${String(window.game.correctAnswers || 0).padStart(3, '0')}`;
        
        // Add counters to header
        this.updateHeader(
            `<div class="counter">Card ${this.currentCard}/${this.totalCards}</div>`,
            `<div class="counter score-counter" style="cursor: pointer">${formattedScore}</div>`
        );
        
        // Add small logo to sub-header
        this.updateSubHeader(`
            <img src="images/doubleactlogo.png" alt="Double Act Logo" class="logo-small">
        `);
        
        // Add actor names to body
        this.updateBody(`
            <div class="actors-container">
                <div class="actor-name">${this.cardData.actors[0]}</div>
                <div class="ampersand">&</div>
                <div class="actor-name">${this.cardData.actors[1]}</div>
            </div>
        `);

        // Add answer button to sub-footer
        this.updateSubFooter(`
            <button class="answer-button">Answer</button>
        `);

        // Add help button to footer
        this.updateFooter(`
            <div class="footer-container">
                <button class="help-button">?</button>
            </div>
        `);

        this.attachEventListeners();
    }

    attachEventListeners() {
        // Answer button
        const answerButton = this.container.querySelector('.answer-button');
        if (answerButton) {
            answerButton.addEventListener('click', () => {
                this.onAnswer();
            });
        }

        // Score counter
        const scoreCounter = this.container.querySelector('.score-counter');
        if (scoreCounter) {
            scoreCounter.addEventListener('click', () => {
                this.showScoreCard();
            });
        }

        // Help button
        const helpButton = this.container.querySelector('.help-button');
        if (helpButton) {
            helpButton.addEventListener('click', () => {
                this.showHelpCard();
            });
        }

        // Listen for return from help card
        this.container.addEventListener('returnToGame', () => {
            new SinglePlayerClueCard(
                this.container,
                this.cardData,
                this.currentCard,
                this.totalCards
            );
        });
    }

    onAnswer() {
        const answerCard = new SinglePlayerAnswerCard(
            this.container,
            this.cardData,
            this.currentCard,
            this.totalCards
        );
    }

    showHelpCard() {
        new DynamicClueHelpCard(
            this.container,
            this.cardData.type
        );
    }

    onCorrect() {
        window.game.correctAnswers += 1;
        this.showNextCard();
    }

    onWrong() {
        window.game.wrongAnswers += 1;
        this.showNextCard();
    }

    showScoreCard() {
        import('./SinglePlayerScoreCard.js').then(module => {
            new module.SinglePlayerScoreCard(
                this.container,
                window.game.correctAnswers,
                window.game.correctAnswers,
                window.game.wrongAnswers,
                window.game.totalCards,
                window.game.totalPossiblePoints
            );
        });
    }

    cleanup() {
        if (super.cleanup) {
            super.cleanup();
        }
    }
}
