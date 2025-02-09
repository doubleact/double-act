import { BaseCard } from '../BaseCard.js';
import { ModeSelectionCard } from './ModeSelectionCard.js';
import { analytics } from '../analytics/Analytics.js';

export class IntroductionCard extends BaseCard {
    constructor(container) {
        super(container);
        this.startTime = new Date();
        
        // Track card entry
        analytics.track('card_enter', {
            cardType: 'IntroductionCard'
        });
        
        this.init();
    }

    init() {
        this.createCardStructure();
        
        // Add introduction-card class to the card element
        const cardElement = this.container.querySelector('.card');
        cardElement.classList.add('introduction-card');
        
        // Clear header (row 1)
        this.updateHeader('', '');
        
        // Add logo to sub-header
        this.updateSubHeader(`
            <img src="./images/doubleactlogo.png" alt="Double Act Logo" class="logo-small">
        `);
        
        // Add introduction container to row 3 (body)
        this.updateBody(`
            <div class="introduction-container">
                <div class="introduction-content">
                    <div class="title">Welcome to the Double Act! A game all about Reboots, Remakes, Sequels, Prequels, and Recasting!</div>
                    
                    <p>Think you're a pop culture expert? Put your knowledge to the test! In this game, you'll be presented with the names of two actors—both of whom have played the same character.</p>
                    
                    <p>Your mission?</p>
                    
                    <p>Name the character they've both brought to life!</p>
                    
                    <p>Can't think of the character name?, No worries—just name the movie, TV show, or franchise they starred in.</p>
                    
                    <p>For example:</p>
                    <div class="example">
                        <div class="example-layout">
                            <div class="example-clue">
                                <div class="example-title">Clue</div>
                                <div class="example-content">
                                    Tom Cruise<br>
                                    &<br>
                                    Stuart Townsend
                                </div>
                            </div>
                            <div class="example-answer">
                                <div class="example-title">Answer</div>
                                <div class="example-content">
                                    <strong>Lestat de Lioncourt</strong><br>
                                    Interview with the Vampire<br>
                                    &<br>
                                    The Queen of the Damned
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <p>Get ready to dive into a world of swapped faces, reimagined classics, and unforgettable characters. Sharpen your memory and let the games begin!</p>
                </div>
            </div>
        `);

        // Add next button to row 4
        this.updateSubFooter(`
            <div class="button-container">
                <button class="next-button">Next</button>
            </div>
        `);

        // Add event listeners
        this.addEventListeners();
    }

    addEventListeners() {
        const nextButton = this.container.querySelector('.next-button');
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                this.handleNext();
            });
        }
    }

    handleNext() {
        // Track card exit
        analytics.track('card_exit', {
            cardType: 'IntroductionCard',
            duration: new Date() - this.startTime
        });
        
        this.cleanup();
        new ModeSelectionCard(this.container);
    }
}
