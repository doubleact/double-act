import { BaseCard } from '../BaseCard.js';
import { SinglePlayerAnswerCard } from './SinglePlayerAnswerCard.js';
import { DynamicClueHelpCard } from './DynamicClueHelpCard.js';
import { analytics } from '../analytics/Analytics.js';

export class SinglePlayerClueCard extends BaseCard {
    constructor(container, cardData, currentCard = 1, totalCards = 10) {
        super(container);
        this.cardData = cardData;
        this.currentCard = currentCard;
        this.totalCards = totalCards;
        this.hintsUsed = 0;
        this.startTime = new Date();
        
        // Initialize game scores if not already set
        if (typeof window.game.correctAnswers === 'undefined') {
            window.game.correctAnswers = 0;
            window.game.wrongAnswers = 0;
            window.game.totalCards = totalCards;
            window.game.totalPossiblePoints = totalCards;
            window.game.startTime = this.startTime;
            window.game.cardHistory = [];
            
            // Track game start
            analytics.track('game_start', {
                totalCards,
                gameMode: 'single_player',
                selectedTypes: window.game.selectedTypes || []
            });
        }
        
        // Track card entry
        analytics.track('card_enter', {
            cardType: 'ClueCard',
            number: currentCard,
            character: cardData.character
        });
        
        // Track card view
        analytics.track('clue_card_view', {
            currentCard,
            totalCards,
            cardData: this.cardData,
            timeViewed: new Date().toISOString()
        });
        
        this.init();
    }

    init() {
        // Validate card data
        if (!this.cardData || !Array.isArray(this.cardData.actors) || this.cardData.actors.length !== 2) {
            console.error('Invalid card data:', this.cardData);
            throw new Error('Invalid card data: actors array must contain exactly 2 actors');
        }

        this.createCardStructure();
        
        // Add clue-card class to the card element
        const cardElement = this.container.querySelector('.card');
        cardElement.classList.add('singleplayer-clue-card');
        cardElement.style.background = `url("./images/background/type${this.cardData.type}background.png") center center/cover no-repeat`;
        
        // Format score as 3-digit number with leading zeros
        const formattedScore = `Score: ${String(window.game.correctAnswers || 0).padStart(3, '0')}`;
        
        // Add counters to header
        this.updateHeader(
            `<div class="counter">Card ${this.currentCard}/${this.totalCards}</div>`,
            `<div class="counter score-counter" style="cursor: pointer">${formattedScore}</div>`
        );
        
        // Add small logo to sub-header
        this.updateSubHeader(`
            <img src="images/doubleactlogo.png" alt="Double Act Logo" class="logo-small">
        `);
        
        // Add actor names to body
        this.updateBody(`
            <div class="actors-container">
                <div class="actor-name">${this.cardData.actors[0]}</div>
                <div class="ampersand">&</div>
                <div class="actor-name">${this.cardData.actors[1]}</div>
            </div>
        `);

        // Add answer button to sub-footer
        this.updateSubFooter(`
            <button class="answer-button">Answer</button>
        `);

        // Add help button to footer
        this.updateFooter(`
            <div class="footer-container">
                <button class="help-button">?</button>
            </div>
        `);

        this.attachEventListeners();
    }

    attachEventListeners() {
        // Answer button
        const answerButton = this.container.querySelector('.answer-button');
        if (answerButton) {
            answerButton.addEventListener('click', () => {
                new SinglePlayerAnswerCard(
                    this.container,
                    this.cardData,
                    this.currentCard,
                    this.totalCards
                );
            });
        }

        // Score counter
        const scoreCounter = this.container.querySelector('.score-counter');
        if (scoreCounter) {
            scoreCounter.addEventListener('click', () => {
                this.showScoreCard();
            });
        }

        // Help button
        const helpButton = this.container.querySelector('.help-button');
        if (helpButton) {
            helpButton.addEventListener('click', () => {
                this.handleHintClick();
            });
        }

        // Listen for return from help card
        this.container.addEventListener('returnToGame', () => {
            new SinglePlayerClueCard(
                this.container,
                this.cardData,
                this.currentCard,
                this.totalCards
            );
        });
    }

    async quickCapture() {
        const cardElement = this.container.querySelector('.card');
        if (!cardElement) return;

        // Store original styles
        const originalStyles = {
            width: cardElement.style.width,
            height: cardElement.style.height,
            transform: cardElement.style.transform
        };

        // Set capture dimensions
        cardElement.style.width = '897px';
        cardElement.style.height = '1487px';
        cardElement.style.transform = 'none';

        // Center content vertically
        const content = cardElement.querySelector('.card-content');
        if (content) {
            content.style.display = 'flex';
            content.style.flexDirection = 'column';
            content.style.justifyContent = 'center';
            content.style.height = '100%';
        }

        // Hide UI elements
        const elementsToHide = [
            '.counter', '.score-counter', '.card-counter', '.score',
            '.help-button', '.answer-button', '.button-container',
            '.button', '#card-counter', '#score', '.controls',
            '.control-button', '.header', '.debug-info',
            '.viewport-debug-info', '.button-debug-info'
        ];
            
        const hiddenElements = [];
        cardElement.querySelectorAll(elementsToHide.join(',')).forEach(el => {
            if (el.style.display !== 'none') {
                hiddenElements.push({ element: el, display: el.style.display });
                el.style.display = 'none';
            }
        });

        // Capture the card
        const canvas = await html2canvas(cardElement, {
            width: 897,
            height: 1487,
            scale: 1,
            backgroundColor: null
        });

        // Create download link
        const link = document.createElement('a');
        const cardNumber = String(this.currentCard).padStart(3, '0');
        link.download = `DoubleAct-Type1-${cardNumber}-A-Clue.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        // Restore original styles
        cardElement.style.width = originalStyles.width;
        cardElement.style.height = originalStyles.height;
        cardElement.style.transform = originalStyles.transform;

        // Restore content styles
        if (content) {
            content.style.display = '';
            content.style.flexDirection = '';
            content.style.justifyContent = '';
            content.style.height = '';
        }

        // Restore hidden elements
        hiddenElements.forEach(({ element, display }) => {
            element.style.display = display;
        });
    }

    togglePrintMode() {
        const cardElement = this.container.querySelector('.card');
        if (!cardElement) return;

        if (cardElement.classList.contains('print-mode')) {
            // Restore original styles
            cardElement.classList.remove('print-mode');
            cardElement.style.width = '';
            cardElement.style.height = '';
            cardElement.style.transform = '';

            // Restore content styles
            const content = cardElement.querySelector('.card-content');
            if (content) {
                content.style.display = '';
                content.style.flexDirection = '';
                content.style.justifyContent = 'flex-start';
                content.style.height = '';
            }

            // Show all elements
            cardElement.querySelectorAll('.hidden-for-print').forEach(el => {
                el.classList.remove('hidden-for-print');
                el.style.display = '';
            });
        } else {
            // Enter print mode
            cardElement.classList.add('print-mode');
            cardElement.style.width = '897px';
            cardElement.style.height = '1487px';
            cardElement.style.transform = 'none';

            // Center content vertically
            const content = cardElement.querySelector('.card-content');
            if (content) {
                content.style.display = 'flex';
                content.style.flexDirection = 'column';
                content.style.justifyContent = 'center';
                content.style.height = '100%';
            }

            // Hide UI elements
            const elementsToHide = [
                '.counter', '.score-counter', '.card-counter', '.score',
                '.help-button', '.answer-button', '.button-container',
                '.button', '#card-counter', '#score', '.controls',
                '.control-button', '.header', '.debug-info',
                '.viewport-debug-info', '.button-debug-info'
            ];
                
            cardElement.querySelectorAll(elementsToHide.join(',')).forEach(el => {
                el.classList.add('hidden-for-print');
                el.style.display = 'none';
            });
        }
    }

    onAnswer() {
        const answerCard = new SinglePlayerAnswerCard(
            this.container,
            this.cardData,
            this.currentCard,
            this.totalCards
        );
    }

    handleHintClick() {
        this.hintsUsed++;
        
        // Track hint usage
        analytics.track('hint_used', {
            cardType: 'ClueCard',
            number: this.currentCard,
            character: this.cardData.character,
            totalHints: this.hintsUsed
        });
        
        new DynamicClueHelpCard(this.container);
    }

    handleAnswer(userAnswer) {
        const endTime = new Date();
        const timeSpent = endTime - this.startTime;
        const isCorrect = this.checkAnswer(userAnswer);

        // Track answer attempt
        analytics.track('answer_attempt', {
            currentCard: this.currentCard,
            totalCards: this.totalCards,
            cardData: this.cardData,
            userAnswer,
            isCorrect,
            timeSpent,
            hintsUsed: this.hintsUsed
        });

        // Track card exit
        analytics.track('card_exit', {
            cardType: 'ClueCard',
            number: this.currentCard,
            character: this.cardData.character
        });

        // Update card history
        window.game.cardHistory.push({
            cardNumber: this.currentCard,
            cardData: this.cardData,
            timeSpent,
            hintsUsed: this.hintsUsed,
            userAnswer,
            isCorrect
        });

        // If this was the last card, track game completion
        if (this.currentCard === this.totalCards) {
            analytics.track('game_complete', {
                cardHistory: window.game.cardHistory,
                finalScore: window.game.correctAnswers,
                totalTime: new Date() - window.game.startTime
            });
        }

        new SinglePlayerAnswerCard(this.container, this.cardData, userAnswer, isCorrect, this.currentCard, this.totalCards);
    }

    showHelpCard() {
        new DynamicClueHelpCard(
            this.container,
            this.cardData.type
        );
    }

    onCorrect() {
        window.game.correctAnswers += 1;
        this.showNextCard();
    }

    onWrong() {
        window.game.wrongAnswers += 1;
        this.showNextCard();
    }

    showScoreCard() {
        import('./SinglePlayerScoreCard.js').then(module => {
            new module.SinglePlayerScoreCard(
                this.container,
                window.game.correctAnswers,
                window.game.correctAnswers,
                window.game.wrongAnswers,
                window.game.totalCards,
                window.game.totalPossiblePoints
            );
        });
    }

    cleanup() {
        if (super.cleanup) {
            super.cleanup();
        }
    }
}
