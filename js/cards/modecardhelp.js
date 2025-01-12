import { BaseCard } from '../BaseCard.js';

export class ModeCardHelp extends BaseCard {
    constructor(container) {
        super(container);
        this.init();
    }

    init() {
        this.createCardStructure();
        
        // Add test-card class to the card element
        const cardElement = this.container.querySelector('.card');
        cardElement.classList.add('test-card');
        
        // Clear header
        this.updateHeader('', '');
        
        // Add logo to sub-header
        this.updateSubHeader(`
            <img src="./images/doubleactlogo.png" alt="Double Act Logo" class="logo-small">
        `);
        
        // Add white box to body with help content
        this.updateBody(`
            <div class="test-row white-box">
                <div class="help-section">
                    <div class="deck-types deck-types-small">
                        <div class="deck-type">
                            <img src="./images/type1.png" alt="Movie & Movie 2">
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
                    <h2>Game modes</h2>
                    <p>Single player: Score points by guessing which actors played the same character.</p>
                    <p>Multiplayer: 2-10 players take turns guessing. Most points wins!</p>
                </div>
            </div>
        `);
        
        // Add back button to card-subfooter
        this.updateSubFooter(`
            <button class="back-button">Back</button>
        `);
        
        this.attachEventListeners();
    }

    attachEventListeners() {
        const backButton = this.container.querySelector('.back-button');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.cleanup();
                import('./ModeSelectionCard.js').then(module => {
                    new module.ModeSelectionCard(this.container);
                });
            });
        }
    }
}
