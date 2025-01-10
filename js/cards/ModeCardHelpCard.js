import { BaseCard } from '../BaseCard.js';
import { ModeSelectionCard } from './ModeSelectionCard.js';

export class ModeCardHelpCard extends BaseCard {
    constructor(container) {
        super(container);
        this.init();
    }

    init() {
        this.createCardStructure();
        
        // Add mode-card-help class to the card element
        const cardElement = this.container.querySelector('.card');
        cardElement.classList.add('mode-card-help');
        
        // Clear header
        this.updateHeader('', '');
        
        // Add small logo to sub-header
        this.updateSubHeader(`
            <img src="./images/doubleactlogo.png" alt="Double Act Logo" class="logo-small">
        `);
        
        // Add help content to body
        this.updateBody(`
            <div class="help-content">
                <div class="help-section">
                    <h2 class="help-title game-modes-title">Game Modes</h2>
                    <div class="deck-types deck-types-small">
                        <div class="deck-type">
                            <img src="./images/type1.png" alt="Movie & Movie">
                            <span>Movie & Movie</span>
                        </div>
                        <div class="deck-type">
                            <div class="type-icon-pair">
                                <img src="./images/type1.png" alt="Movie">
                                <img src="./images/type3.png" alt="TV">
                            </div>
                            <span>Movie & TV</span>
                        </div>
                        <div class="deck-type">
                            <div class="type-icon-pair">
                                <img src="./images/type3.png" alt="TV">
                                <img src="./images/type3.png" alt="TV">
                            </div>
                            <span>TV & TV</span>
                        </div>
                        <div class="deck-type">
                            <img src="./images/type4.png" alt="Real Life">
                            <span>Real Life</span>
                        </div>
                        <div class="deck-type">
                            <img src="./images/type5.png" alt="Comicbook">
                            <span>Comicbook</span>
                        </div>
                    </div>
                    <p>Click to select/deselect deck types.</p>
                    <p>No selection = all decks used.</p>
                </div>

                <div class="help-section">
                    <h2>Game Modes</h2>
                    <p>Single Player: Score points by guessing which actors played the same character.</p>
                    <p>Multiplayer: 2-10 players take turns guessing. Most points wins!</p>
                </div>
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

    attachEventListeners() {
        const backButton = this.container.querySelector('.back-button');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.onBack();
            });
        }

        // Add keyboard navigation
        const cardElement = this.container.querySelector('.card');
        cardElement.addEventListener('keydown', (event) => {
            if (event.code === 'Enter' || event.code === 'Space' || event.code === 'NumpadEnter') {
                event.preventDefault();
                this.onBack();
            }
        });
        cardElement.setAttribute('tabindex', '0'); // Make card focusable
        cardElement.focus(); // Focus the card
    }

    onBack() {
        // Clean up current card
        this.cleanup();
        
        // Return to mode selection
        new ModeSelectionCard(this.container);
    }
}
