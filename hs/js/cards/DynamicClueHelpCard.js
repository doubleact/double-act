import { BaseCard } from '../BaseCard.js';

export class DynamicClueHelpCard extends BaseCard {
    constructor(container, cardType) {
        super(container);
        this.cardType = cardType;
        this.init();
    }

    init() {
        this.createCardStructure();
        
        // Add dynamic-clue-help-card class to the card element
        const cardElement = this.container.querySelector('.card');
        cardElement.classList.add('dynamic-clue-help-card');
        cardElement.style.background = `url("./images/background/type${this.cardType}background.png") center center/cover no-repeat`;
        
        // Clear header
        this.updateHeader('', '');
        
        // Add logo to sub-header
        this.updateSubHeader(`
            <img src="./images/doubleactlogo.png" alt="Double Act Logo" class="logo-small">
        `);
        
        // Add help content based on card type
        this.updateBody(`
            <div class="help-content">
                ${this.getTypeExplanation()}
            </div>
        `);
        
        // Add back button to sub-footer
        this.updateSubFooter(`
            <div class="buttons-container">
                <button class="back-button">Back</button>
            </div>
        `);
        
        // Clear footer
        this.updateFooter('');
        
        this.attachEventListeners();
    }

    getTypeExplanation() {
        const explanations = {
            1: {
                title: "Movies & Movies",
                description: "Actors who have portrayed the same character in different movies.",
                example: "Jodie Foster\n&\nJulianne Moore",
                answer: "Clarice Starling\n\nSilence of the Lambs\n&\nHannibal"
            },
            2: {
                title: "Movies & TV",
                description: "Actors who have portrayed the same character in a movie and TV shows.",
                example: "Kristy Swanson\n&\nSarah Michelle Geller",
                answer: "Buffy Anne Summers\n\nBuffy the Vampire Slayer\n&\nBuffy the Vampire Slayer (TV)"
            },
            3: {
                title: "TV & TV",
                description: "Actors who have portrayed the same character in TV shows.",
                example: "Benedict Cumberbatch\n&\nTommy Lee Miller",
                answer: "Sherlock Holmes\n\nSherlock\n&\nElementary"
            },
            4: {
                title: "Real Life Characters",
                description: "Actors who have portrayed the same real life person in either movies or TV shows.",
                example: "Helen Mirren\n&\nClaire Foy",
                answer: "Queen Elizabeth II\n\nThe Queen\n&\nThe Crown"
            },
            5: {
                title: "Comic Book Characters",
                description: "Actors who have portrayed the same comic book character in either movies or TV shows.",
                example: "Val Kilmer\n&\nGeorge Clooney",
                answer: "Bruce Wayne\nBatman\n\nBatman Forever\n&\nBatman & Robin"
            }
        };

        const helpContent = explanations[this.cardType];
        return `
            <h3>${helpContent.title}</h3>
            <p>${helpContent.description}</p>
            <p>&nbsp;</p>
            <h3>Example</h3>
            <p style="white-space: pre-line">${helpContent.example}</p>
            <p>&nbsp;</p>
            <h3>Answer</h3>
            <p style="white-space: pre-line">${helpContent.answer}</p>
        `;
    }

    attachEventListeners() {
        // Back button
        const backButton = this.container.querySelector('.back-button');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.container.dispatchEvent(new CustomEvent('returnToGame'));
            });
        }
    }
}
