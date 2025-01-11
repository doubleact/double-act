import { BaseCard } from '../BaseCard.js';

export class SinglePlayerClueHelpCard extends BaseCard {
    constructor(container, cardType) {
        super(container);
        this.cardType = cardType;
        this.init();
    }

    init() {
        this.createCardStructure();
        
        // Add clue-help-card class to the card element
        const cardElement = this.container.querySelector('.card');
        cardElement.classList.add('singleplayer-clue-help-card');
        
        // Clear header
        this.updateHeader('', '');
        
        // Add logo to sub-header
        this.updateSubHeader(`
            <img src="/images/doubleactlogo.png" alt="Double Act Logo" class="logo-small">
        `);
        
        // Add explanation to body based on card type
        this.updateBody(`
            <div class="help-content">
                ${this.getTypeExplanation()}
            </div>
        `);

        // Add back button to sub-footer
        this.updateSubFooter(`
            <button class="next-button">Back</button>
        `);
        
        // Clear footer
        this.updateFooter('');

        this.attachEventListeners();
    }

    getTypeExplanation() {
        switch(this.cardType) {
            case '1':
                return `
                    <h2>Movie & Movie</h2>
                    <p>These cards feature actors who have played the same character in different movies.</p>
                    <p>For example, different actors playing Spider-Man in separate movie franchises.</p>
                `;
            case '2':
                return `
                    <h2>Movie & TV</h2>
                    <p>These cards feature actors who have played the same character across movies and TV shows.</p>
                    <p>For example, an actor playing a character in a movie, and another actor playing the same character in a TV adaptation.</p>
                `;
            case '3':
                return `
                    <h2>TV & TV</h2>
                    <p>These cards feature actors who have played the same character in different TV shows.</p>
                    <p>For example, different actors playing the same character in a TV show and its reboot.</p>
                `;
            case '4':
                return `
                    <h2>Real Life Characters</h2>
                    <p>These cards feature actors who have portrayed the same real-life person in different productions.</p>
                    <p>For example, different actors playing historical figures or celebrities in biopics.</p>
                `;
            case '5':
                return `
                    <h2>Comic Book Characters</h2>
                    <p>These cards feature actors who have played the same comic book character in different productions.</p>
                    <p>For example, different actors playing Batman across various movies.</p>
                `;
            default:
                return `
                    <h2>Card Type Help</h2>
                    <p>This card type is not recognized.</p>
                `;
        }
    }

    attachEventListeners() {
        // Back button
        const backButton = this.container.querySelector('.next-button');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.onBack();
            });
        }
    }

    onBack() {
        // Return to the clue card
        window.game.returnToClueCard();
    }
}
