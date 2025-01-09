import { BaseCard } from '../BaseCard.js';

export class MultiplayerScoreCard extends BaseCard {
    constructor(container, playerScores, numberOfPlayers, currentCard, totalCards, currentPlayer, wasCorrect) {
        super(container);
        this.playerScores = playerScores;
        this.numberOfPlayers = numberOfPlayers;
        this.currentCard = currentCard;
        this.totalCards = totalCards;
        this.currentPlayer = currentPlayer;
        this.wasCorrect = wasCorrect;
        this.init();
    }

    init() {
        this.createCardStructure();
        
        // Add multiplayer-score-card class to the card element
        const cardElement = this.container.querySelector('.card');
        cardElement.classList.add('multiplayer-score-card');
        
        // Clear header - no text
        this.updateHeader('', '');
        
        // Add small logo to sub-header
        this.updateSubHeader(`
            <img src="./images/doubleactlogo.png" alt="Double Act Logo" class="logo-small">
        `);
        
        // Add scores grid to body
        this.updateBody(`
            <div class="scores-container">
                <div class="scores-grid">
                    ${this.createScoresGrid()}
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

        // Clear footer - no card count
        this.updateFooter('');

        this.attachEventListeners();
    }

    createScoresGrid() {
        let grid = '';
        for (let i = 0; i < this.numberOfPlayers; i++) {
            const correctAnswers = window.game.playerCorrectAnswers[i] || 0;
            const wrongAnswers = window.game.playerWrongAnswers[i] || 0;
            
            grid += `
                <div class="score-item ${i + 1 === this.currentPlayer ? 'current' : ''}">
                    <div class="player-label">Player ${i + 1}</div>
                    <div class="player-score">
                        <div>Correct: ${correctAnswers}</div>
                        <div>Wrong: ${wrongAnswers}</div>
                    </div>
                </div>
            `;
        }
        return grid;
    }

    attachEventListeners() {
        // Continue button
        const continueButton = this.container.querySelector('.continue-button');
        if (continueButton) {
            continueButton.addEventListener('click', () => {
                this.onContinue();
            });
        }

        // End Game button
        const endGameButton = this.container.querySelector('.end-game-button');
        if (endGameButton) {
            endGameButton.addEventListener('click', () => {
                this.onEndGame();
            });
        }
    }

    onContinue() {
        // Show clue card for current player (don't advance to next player)
        import('./MultiplayerClueCard.js').then(module => {
            new module.MultiplayerClueCard(
                this.container,
                window.game.cards[window.game.currentCardIndex],
                window.game.currentCardIndex + 1,
                window.game.cards.length
            );
        });
    }

    onEndGame() {
        // Reset game state
        window.game.currentCardIndex = 0;
        window.game.currentPlayer = 1;
        window.game.playerScores = [];
        window.game.playerCorrectAnswers = [];
        window.game.playerWrongAnswers = [];
        window.game.selectedTypes = new Set(); // Clear selected types
        window.game.previousSelections = new Set(); // Clear previous selections
        
        // Return to start card
        import('./StartCard.js').then(module => {
            new module.StartCard(this.container);
        });
    }

    showFinalScores() {
        import('./MultiplayerEndCard.js').then(module => {
            new module.MultiplayerEndCard(
                this.container,
                window.game.playerScores,
                this.numberOfPlayers
            );
        });
    }
}
