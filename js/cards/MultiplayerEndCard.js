import { BaseCard } from '../BaseCard.js';

export class MultiplayerEndCard extends BaseCard {
    constructor(container, playerScores, numberOfPlayers) {
        super(container);
        this.playerScores = playerScores;
        this.numberOfPlayers = numberOfPlayers;
        this.init();
    }

    init() {
        this.createCardStructure();
        
        const cardElement = this.container.querySelector('.card');
        cardElement.classList.add('multiplayer-end-card');
        cardElement.style.backgroundImage = `url("./images/background/startcardbackground.png")`;
        cardElement.style.backgroundPosition = 'center center';
        cardElement.style.backgroundSize = 'cover';
        cardElement.style.backgroundRepeat = 'no-repeat';
        
        // Empty header
        this.updateHeader('');
        
        // Add logo to sub-header
        this.updateSubHeader(`
            <img src="./images/doubleactlogo.png" alt="Double Act Logo" class="logo-small">
        `);
        
        // Add score grid and winner text to body
        this.updateBody(`
            <div class="game-over-text">GAME OVER!</div>
            <div class="scores-container">
                <div class="scores-grid">
                    ${this.createScoreBoxes()}
                </div>
            </div>
            <div class="winner-text-container">
                ${this.getWinnerText()}
            </div>
        `);

        // Add start new game button to sub-footer
        this.updateSubFooter(`
            <button class="play-again-button">Start New Game</button>
        `);
        
        // Empty footer
        this.updateFooter('');

        this.attachEventListeners();
    }

    createScoreBoxes() {
        if (!window.game || !window.game.playerCorrectAnswers || !window.game.playerWrongAnswers) {
            console.error('Game state is invalid');
            return '<div class="error">Error: Game state is invalid</div>';
        }

        let grid = '';
        for (let i = 0; i < this.numberOfPlayers; i++) {
            const correct = window.game.playerCorrectAnswers[i] || 0;
            const wrong = window.game.playerWrongAnswers[i] || 0;
            grid += `
                <div class="score-item">
                    <div class="player-label">Player ${i + 1}</div>
                    <div class="player-score">
                        <div>Correct: ${correct}</div>
                        <div>Wrong: ${wrong}</div>
                    </div>
                </div>
            `;
        }
        return grid;
    }

    getWinnerText() {
        // Find the highest score
        const scores = [];
        for (let i = 0; i < this.numberOfPlayers; i++) {
            const correct = window.game.playerCorrectAnswers[i] || 0;
            scores.push({ player: i + 1, score: correct });
        }
        
        // Sort by score in descending order
        scores.sort((a, b) => b.score - a.score);
        
        // Find all players with the highest score
        const highestScore = scores[0].score;
        const winners = scores.filter(s => s.score === highestScore);
        
        // Format the winner text
        if (winners.length === 1) {
            return `Winner! Player ${winners[0].player}`;
        } else {
            const winnerText = winners.map(w => `Player ${w.player}`).join(', ');
            // Replace the last comma with "and"
            const lastComma = winnerText.lastIndexOf(',');
            if (lastComma !== -1) {
                return `Winner! ${winnerText.substring(0, lastComma)} and${winnerText.substring(lastComma + 1)}`;
            }
            return `Winner! ${winnerText}`;
        }
    }

    attachEventListeners() {
        // Play Again button
        const playAgainButton = this.container.querySelector('.play-again-button');
        if (playAgainButton) {
            playAgainButton.addEventListener('click', () => {
                // Reset game state
                window.game.currentCardIndex = 0;
                window.game.score = 0;
                window.game.correctAnswers = 0;
                window.game.wrongAnswers = 0;
                window.game.selectedTypes = new Set(); // Clear selected types
                window.game.previousSelections = new Set(); // Clear previous selections
                window.game.playerCorrectAnswers = [];
                window.game.playerWrongAnswers = [];
                
                // Return to start card
                import('./StartCard.js').then(module => {
                    new module.StartCard(this.container);
                });
            });
        }
    }
}
