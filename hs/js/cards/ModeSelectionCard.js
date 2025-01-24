import { BaseCard } from '../BaseCard.js';
import { ModeCardHelp } from './modecardhelp.js';

export class ModeSelectionCard extends BaseCard {
    constructor(container) {
        super(container);
        this.init();
    }

    init() {
        this.createCardStructure();
        
        // Add mode-selection-card class to the card element
        const cardElement = this.container.querySelector('.card');
        cardElement.classList.add('mode-selection-card');
        
        // Clear header
        this.updateHeader('', '');
        
        // Add small logo to sub-header
        this.updateSubHeader(`
            <img src="./images/doubleactlogo.png" alt="Double Act Logo" class="logo-small">
        `);
        
        // Add type selection to body
        this.updateBody(`
            <div class="type-options">
                <div class="type-option" data-type="1">
                    <img src="./images/type1.png" alt="Movie & Movie" class="type-icon">
                    <div class="type-info">
                        <h3>Movie & Movie</h3>
                        <p>Actors who have played the same character in different movies</p>
                    </div>
                    <div class="type-toggle"></div>
                </div>
                <div class="type-option" data-type="2">
                    <div class="type-icon-pair">
                        <img src="./images/type1.png" alt="Movie" class="type-icon">
                        <img src="./images/type3.png" alt="TV" class="type-icon">
                    </div>
                    <div class="type-info">
                        <h3>Movie & TV</h3>
                        <p>Actors who have played the same character in movies and TV shows</p>
                    </div>
                    <div class="type-toggle"></div>
                </div>
                <div class="type-option" data-type="3">
                    <div class="type-icon-pair">
                        <img src="./images/type3.png" alt="TV" class="type-icon">
                        <img src="./images/type3.png" alt="TV" class="type-icon">
                    </div>
                    <div class="type-info">
                        <h3>TV & TV</h3>
                        <p>Actors who have played the same character in different TV shows</p>
                    </div>
                    <div class="type-toggle"></div>
                </div>
                <div class="type-option" data-type="4">
                    <img src="./images/type4.png" alt="Real Life Characters" class="type-icon">
                    <div class="type-info">
                        <h3>Real Life Characters</h3>
                        <p>Actors who have played the same real life person</p>
                    </div>
                    <div class="type-toggle"></div>
                </div>
                <div class="type-option" data-type="5">
                    <img src="./images/type5.png" alt="Comicbook Characters" class="type-icon">
                    <div class="type-info">
                        <h3>Comicbook Characters</h3>
                        <p>Actors who have played the same character in comicbook characters</p>
                    </div>
                    <div class="type-toggle"></div>
                </div>
            </div>
        `);

        // Add mode selection buttons to sub-footer
        this.updateSubFooter(`
            <div class="mode-buttons">
                <button class="mode-button single-player">Single Player</button>
                <button class="mode-button multiplayer">Multiplayer</button>
            </div>
        `);

        // Add help button to footer
        this.updateFooter(`
            <div class="footer-container">
                <button class="help-button">?</button>
            </div>
        `);

        // Reset game selections when entering mode selection
        window.game.selectedTypes.clear();
        
        // Restore previous selections if they exist
        if (window.game.previousSelections && window.game.previousSelections.size > 0) {
            window.game.previousSelections.forEach(type => {
                window.game.selectedTypes.add(type);
            });
            this.restorePreviousSelections();
        }
        
        this.attachEventListeners();
    }

    restorePreviousSelections() {
        const typeOptions = this.container.querySelectorAll('.type-option');
        typeOptions.forEach(option => {
            const type = option.dataset.type;
            if (window.game.selectedTypes.has(type)) {
                option.classList.add('selected');
            }
        });
    }

    attachEventListeners() {
        // Type selection
        const typeOptions = this.container.querySelectorAll('.type-option');
        typeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const type = option.dataset.type;
                this.toggleType(type, option);
            });
        });

        // Single player button
        const singlePlayerButton = this.container.querySelector('.single-player');
        if (singlePlayerButton) {
            singlePlayerButton.addEventListener('click', () => {
                this.onSinglePlayer();
            });
        }

        // Multiplayer button
        const multiplayerButton = this.container.querySelector('.multiplayer');
        if (multiplayerButton) {
            multiplayerButton.addEventListener('click', () => {
                this.onMultiplayer();
            });
        }

        // Help button
        const helpButton = this.container.querySelector('.help-button');
        if (helpButton) {
            helpButton.addEventListener('click', () => {
                this.onHelp();
            });
        }
    }

    toggleType(type, optionElement) {
        if (window.game.selectedTypes.has(type)) {
            window.game.selectedTypes.delete(type);
            optionElement.classList.remove('selected');
        } else {
            window.game.selectedTypes.add(type);
            optionElement.classList.add('selected');
        }
        
        console.log('Selected types:', Array.from(window.game.selectedTypes));
    }

    onSinglePlayer() {
        // If no types are selected, select all types
        if (window.game.selectedTypes.size === 0) {
            const typeOptions = this.container.querySelectorAll('.type-option');
            typeOptions.forEach(option => {
                const type = option.dataset.type;
                window.game.selectedTypes.add(type);
                option.classList.add('selected');
            });
        }
        
        // Store selections for later
        window.game.previousSelections = new Set(window.game.selectedTypes);
        
        // Clean up current card
        this.cleanup();
        
        // Redirect to Card-01-Clue.html
        window.location.href = 'cards/Card-01-Clue.html';
    }

    onMultiplayer() {
        // Store current selections
        window.game.previousSelections = new Set(window.game.selectedTypes);
        
        // If no types are selected, select all types internally
        if (window.game.selectedTypes.size === 0) {
            const typeOptions = this.container.querySelectorAll('.type-option');
            typeOptions.forEach(option => {
                const type = option.dataset.type;
                window.game.selectedTypes.add(type);
            });
        }
        
        // Clean up current card
        this.cleanup();
        
        // Redirect to Card-01-Clue.html
        window.location.href = 'cards/Card-01-Clue.html';
    }

    onHelp() {
        // Clean up current card
        this.cleanup();
        
        // Show help card
        new ModeCardHelp(this.container);
    }
}
