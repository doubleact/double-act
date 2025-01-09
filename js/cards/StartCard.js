import { BaseCard } from '../BaseCard.js';
import { ModeSelectionCard } from './ModeSelectionCard.js';

export class StartCard extends BaseCard {
    constructor(container) {
        super(container);
        this.init();
    }

    init() {
        this.createCardStructure();
        
        // Add start-card class to the card element
        const cardElement = this.container.querySelector('.card');
        cardElement.classList.add('start-card');
        
        // Clear header (no left/right content)
        this.updateHeader('', '');
        
        // Clear sub-header
        this.updateSubHeader('');
        
        // Add logo to body
        this.updateBody(`
            <img src="images/doubleactlogo.png" alt="Double Act Logo" class="double-act-logo">
        `);

        // Add next button to sub-footer (row 4)
        this.updateSubFooter(`
            <div class="button-container">
                <button class="next-button">Next</button>
            </div>
        `);

        // Clear footer
        this.updateFooter('');

        this.attachEventListeners();
    }

    attachEventListeners() {
        const nextButton = this.container.querySelector('.next-button');
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                this.cleanup();
                new ModeSelectionCard(this.container);
            });
        }
    }
}
