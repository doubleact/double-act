import { BaseCard } from '../BaseCard.js';

export class NumberOfPlayersCard extends BaseCard {
    constructor(container) {
        super(container);
        this.init();
    }

    init() {
        this.createCardStructure();
        
        // Add number-of-players-card class to the card element
        const cardElement = this.container.querySelector('.card');
        cardElement.classList.add('number-of-players-card');
        cardElement.style.backgroundImage = `url("./images/background/numberofplayersbackground.png")`;
        cardElement.style.backgroundPosition = 'center center';
        cardElement.style.backgroundSize = 'cover';
        cardElement.style.backgroundRepeat = 'no-repeat';
        
        // Clear header
        this.updateHeader('');
        
        // Add logo to sub-header
        this.updateSubHeader(`
            <img src="./images/doubleactlogo.png" alt="Double Act Logo" class="logo-small">
        `);
        
        // Add title and number grid to body
        this.updateBody(`
            <h2 class="player-select-title">Select Number of Players</h2>
            <div class="number-grid">
                ${this.createNumberButtons()}
            </div>
        `);

        // Add back button to sub-footer
        this.updateSubFooter(`
            <button class="back-button">Back</button>
        `);
        
        // Clear footer
        this.updateFooter('');

        this.attachEventListeners();
    }

    createNumberButtons() {
        let buttons = '';
        for (let i = 2; i <= 10; i++) {
            buttons += `<button class="number-button">${i}</button>`;
        }
        return buttons;
    }

    attachEventListeners() {
        // Number buttons
        const numberButtons = this.container.querySelectorAll('.number-button');
        numberButtons.forEach(button => {
            button.addEventListener('click', () => {
                const numberOfPlayers = parseInt(button.textContent);
                window.game.numberOfPlayers = numberOfPlayers;
                window.game.playerScores = new Array(numberOfPlayers).fill(0);
                window.game.playerCorrectAnswers = new Array(numberOfPlayers).fill(0);
                window.game.playerWrongAnswers = new Array(numberOfPlayers).fill(0);
                window.game.currentPlayer = 1;
                this.startMultiplayerGame();
            });
        });

        // Back button
        const backButton = this.container.querySelector('.back-button');
        if (backButton) {
            backButton.addEventListener('click', () => {
                // Restore previous selections when going back
                if (window.game.previousSelections) {
                    window.game.selectedTypes = new Set(window.game.previousSelections);
                    delete window.game.previousSelections;
                }
                
                import('./ModeSelectionCard.js').then(module => {
                    new module.ModeSelectionCard(this.container);
                });
            });
        }
    }

    startMultiplayerGame() {
        // Start the multiplayer game using the game's built-in method
        window.game.startMultiplayerGame();
    }
}
