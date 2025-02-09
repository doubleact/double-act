import { BaseCard } from '../BaseCard.js';

export class TypeSelectionCard extends BaseCard {
    constructor(container) {
        super(container);
        this.selectedTypes = new Set(); // Track selected types
        this.init();
    }

    init() {
        this.createCardStructure();
        
        // Add type-selection-card class to the card element
        const cardElement = this.container.querySelector('.card');
        cardElement.classList.add('type-selection-card');
        
        // Clear header
        this.updateHeader('', '');
        
        // Add medium logo to sub-header
        this.updateSubHeader(`
            <img src="/images/doubleactlogo.png" alt="Double Act Logo" class="logo-small">
            <h2>Select Card Types</h2>
        `);
        
        // Add type selection options to body
        this.updateBody(`
            <div class="type-options">
                <div class="type-option" data-type="1">
                    <img src="/images/type1.png" alt="Movie to Movie" class="type-icon">
                    <div class="type-info">
                        <h3>Movie to Movie</h3>
                        <p>Actors who have played the same character in different movies</p>
                    </div>
                    <div class="type-toggle"></div>
                </div>
                <div class="type-option" data-type="2">
                    <img src="/images/type2.png" alt="Movie to TV" class="type-icon">
                    <div class="type-info">
                        <h3>Movie to TV</h3>
                        <p>Actors who have played the same character in movies and TV shows</p>
                    </div>
                    <div class="type-toggle"></div>
                </div>
                <div class="type-option" data-type="3">
                    <img src="/images/type3.png" alt="TV to TV" class="type-icon">
                    <div class="type-info">
                        <h3>TV to TV</h3>
                        <p>Actors who have played the same character in different TV shows</p>
                    </div>
                    <div class="type-toggle"></div>
                </div>
                <div class="type-option" data-type="4">
                    <img src="/images/type4.png" alt="Reboot" class="type-icon">
                    <div class="type-info">
                        <h3>Reboot</h3>
                        <p>Actors who have played the same character in reboots</p>
                    </div>
                    <div class="type-toggle"></div>
                </div>
                <div class="type-option" data-type="5">
                    <img src="/images/type5.png" alt="Spinoff" class="type-icon">
                    <div class="type-info">
                        <h3>Spinoff</h3>
                        <p>Actors who have played the same character in spinoffs</p>
                    </div>
                    <div class="type-toggle"></div>
                </div>
            </div>
        `);

        // Add start button to sub-footer
        this.updateSubFooter(`
            <button class="start-button" disabled>Start Game</button>
        `);

        // Add back button to footer
        this.updateFooter(`
            <button class="back-button">Back</button>
        `);

        this.attachEventListeners();
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

        // Back button
        const backButton = this.container.querySelector('.back-button');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.onBack();
            });
        }

        // Start button
        const startButton = this.container.querySelector('.start-button');
        if (startButton) {
            startButton.addEventListener('click', () => {
                this.onStart();
            });
        }
    }

    toggleType(type, optionElement) {
        if (this.selectedTypes.has(type)) {
            this.selectedTypes.delete(type);
            optionElement.classList.remove('selected');
        } else {
            this.selectedTypes.add(type);
            optionElement.classList.add('selected');
        }

        // Enable/disable start button based on selection
        const startButton = this.container.querySelector('.start-button');
        startButton.disabled = this.selectedTypes.size === 0;
    }

    onBack() {
        // Create and show mode selection card
        const modeSelectionCard = new ModeSelectionCard(this.container);
    }

    onStart() {
        if (this.selectedTypes.size > 0) {
            // Pass selected types to the game
            window.game.selectedTypes = this.selectedTypes;
            window.game.startSinglePlayer();
        }
    }
}
