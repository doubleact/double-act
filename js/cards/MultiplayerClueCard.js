import { BaseCard } from '../BaseCard.js';
import { MultiplayerAnswerCard } from './MultiplayerAnswerCard.js';
import { DynamicClueHelpCard } from './DynamicClueHelpCard.js';

export class MultiplayerClueCard extends BaseCard {
    constructor(container, cardData, currentCard = 1, totalCards = 10) {
        super(container);
        this.cardData = cardData;
        this.currentCard = currentCard;
        this.totalCards = totalCards;
        this.init();
    }

    init() {
        this.createCardStructure();
        
        // Add clue-card class to the card element
        const cardElement = this.container.querySelector('.card');
        cardElement.classList.add('multiplayer-clue-card');
        cardElement.style.background = `url("/images/background/type${this.cardData.type}background.png") center center/cover no-repeat`;
        
        // Add player turn and score button to header
        this.updateHeader(
            `<div class="counter player-turn">Player ${window.game.currentPlayer}'s Turn</div>`,
            `<div class="counter score-counter">Score</div>`
        );
        
        // Add small logo to sub-header
        this.updateSubHeader(`
            <img src="images/doubleactlogo.png" alt="Double Act Logo" class="logo-small">
        `);
        
        // Add clue content to body
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
        
        // Add help button and card counter to footer
        this.updateFooter(`
            <div class="footer-container">
                <div class="counter">${this.currentCard}/${this.totalCards}</div>
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
                this.showAnswerCard();
            });
        }

        // Help button
        const helpButton = this.container.querySelector('.help-button');
        if (helpButton) {
            helpButton.addEventListener('click', () => {
                this.showHelpCard();
            });
        }

        // Score button
        const scoreButton = this.container.querySelector('.score-counter');
        if (scoreButton) {
            scoreButton.addEventListener('click', () => {
                this.showScoreCard();
            });
        }

        // Listen for return from help card
        this.container.addEventListener('returnToGame', () => {
            new MultiplayerClueCard(
                this.container,
                this.cardData,
                this.currentCard,
                this.totalCards
            );
        });
    }

    showAnswerCard() {
        new MultiplayerAnswerCard(
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

    showScoreCard() {
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
}
