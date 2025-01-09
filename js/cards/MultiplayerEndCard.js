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
        
        // Add title to header
        this.updateHeader('Game Over!');
        
        // Add logo to sub-header
        this.updateSubHeader(`
            <img src="images/doubleactlogo.png" alt="Double Act Logo" class="logo-small">
        `);
        
        // Add score grid to body
        this.updateBody(`
            <div class="score-grid">
                ${this.createScoreBoxes()}
            </div>
        `);

        // Add play again button to sub-footer
        this.updateSubFooter(`
            <button class="play-again-button">Play Again</button>
        `);
        
        // Add home button to footer
        this.updateFooter(`
            <button class="home-button">Home</button>
        `);

        this.attachEventListeners();
    }

    createScoreBoxes() {
        if (!window.game || !window.game.playerCorrectAnswers || !window.game.playerWrongAnswers) {
            console.error('Game state is invalid');
            return '<div class="error">Error: Game state is invalid</div>';
        }

        let boxes = '';
        for (let i = 0; i < this.numberOfPlayers; i++) {
            const correct = window.game.playerCorrectAnswers[i] || 0;
            const wrong = window.game.playerWrongAnswers[i] || 0;
            const total = window.game.totalCards || 0;
            const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

            boxes += `
                <div class="score-box">
                    <div class="player-name">Player ${i + 1}</div>
                    <div class="score-details">
                        <div class="correct">Correct: ${correct}</div>
                        <div class="wrong">Wrong: ${wrong}</div>
                        <div class="percentage">Success Rate: ${percentage}%</div>
                    </div>
                </div>
            `;
        }
        return boxes;
    }

    attachEventListeners() {
        // Play Again button
        const playAgainButton = this.container.querySelector('.play-again-button');
        if (playAgainButton) {
            playAgainButton.addEventListener('click', async () => {
                try {
                    const module = await import('./NumberOfPlayersCard.js');
                    new module.NumberOfPlayersCard(this.container);
                } catch (error) {
                    console.error('Failed to load NumberOfPlayersCard:', error);
                    alert('Failed to start new game. Please refresh the page.');
                }
            });
        }

        // Home button
        const homeButton = this.container.querySelector('.home-button');
        if (homeButton) {
            homeButton.addEventListener('click', async () => {
                try {
                    const module = await import('./StartCard.js');
                    new module.StartCard(this.container);
                } catch (error) {
                    console.error('Failed to load StartCard:', error);
                    alert('Failed to return to home. Please refresh the page.');
                }
            });
        }
    }
}
