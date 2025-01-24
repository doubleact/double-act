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
        
        // Add score-card class to the card element
        const cardElement = this.container.querySelector('.card');
        cardElement.classList.add('multiplayer-score-card');
        cardElement.style.backgroundImage = `url("./images/background/startcardbackground.png")`;
        cardElement.style.backgroundPosition = 'center center';
        cardElement.style.backgroundSize = 'cover';
        cardElement.style.backgroundRepeat = 'no-repeat';
        
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
        const isLastCard = window.game.currentCardIndex >= window.game.cards.length;
        this.updateSubFooter(`
            <div class="buttons-container ${isLastCard ? 'end-game-only' : ''}">
                ${!isLastCard ? '<button class="continue-button">Back</button>' : ''}
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
        // If we're at the end of the game, clicking back should end the game
        if (window.game.currentCardIndex >= window.game.cards.length) {
            this.onEndGame();
            return;
        }

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
        // Show final scores
        import('./MultiplayerEndCard.js').then(module => {
            new module.MultiplayerEndCard(
                this.container,
                window.game.playerCorrectAnswers,
                this.numberOfPlayers
            );
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
