import { BaseCard } from '../BaseCard.js';

export class SinglePlayerScoreCard extends BaseCard {
    constructor(container, score, correctAnswers, wrongAnswers, totalCards, totalPossiblePoints) {
        super(container);
        // Validate inputs
        if (correctAnswers < 0 || wrongAnswers < 0 || totalCards <= 0 || totalPossiblePoints <= 0) {
            throw new Error('Invalid score parameters: values must be positive numbers');
        }
        if (correctAnswers + wrongAnswers > totalCards) {
            throw new Error('Invalid score parameters: sum of correct and wrong answers exceeds total cards');
        }

        this.score = score;
        this.correctAnswers = correctAnswers;
        this.wrongAnswers = wrongAnswers;
        this.totalCards = totalCards;
        this.totalPossiblePoints = totalPossiblePoints;
        this.percentage = Math.round((correctAnswers / totalPossiblePoints) * 100);
        this.init();
    }

    init() {
        this.createCardStructure();
        
        // Add score-card class to the card element
        const cardElement = this.container.querySelector('.card');
        cardElement.classList.add('singleplayer-score-card');
        
        // Clear header
        this.updateHeader('', '');
        
        // Add logo to sub-header
        this.updateSubHeader(`
            <img src="./images/doubleactlogo.png" alt="Double Act Logo" class="logo-small">
        `);
        
        // Add score card title and score display to body
        this.updateBody(`
            <h1 class="score-title">Score Card</h1>
            <div class="score-spacer"></div>
            <div class="score-container">
                <div class="player-title">Player 1</div>
                <div class="score-details">
                    <div class="score-row">Correct: ${this.correctAnswers}</div>
                    <div class="score-row">Wrong: ${this.wrongAnswers}</div>
                    <div class="score-row">Total: ${this.correctAnswers}/${this.totalPossiblePoints}</div>
                </div>
            </div>
        `);

        // Add buttons to sub-footer
        this.updateSubFooter(`
            <div class="buttons-container">
                <button class="continue-button">Back</button>
                <button class="end-game-button">End Game</button>
            </div>
        `);

        // Clear footer
        this.updateFooter('');

        this.attachEventListeners();
    }

    attachEventListeners() {
        // Continue button
        const continueButton = this.container.querySelector('.continue-button');
        if (continueButton) {
            continueButton.addEventListener('click', () => {
                this.onContinue();
            });
        }

        // End game button
        const endButton = this.container.querySelector('.end-game-button');
        if (endButton) {
            endButton.addEventListener('click', () => {
                this.onEndGame();
            });
        }
    }

    onContinue() {
        // Return to the current game state
        window.game.showCurrentCard();
    }

    onEndGame() {
        // Reset game state
        window.game.currentCardIndex = 0;
        window.game.score = 0;
        window.game.correctAnswers = 0;
        window.game.wrongAnswers = 0;
        window.game.selectedTypes = new Set(); // Clear selected types
        window.game.previousSelections = new Set(); // Clear previous selections
        
        // Return to start card
        import('./StartCard.js').then(module => {
            new module.StartCard(this.container);
        });
    }
}
