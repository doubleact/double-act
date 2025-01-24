import { SinglePlayerClueCard } from '../cards/SinglePlayerClueCard.js';
import { SinglePlayerAnswerCard } from '../cards/SinglePlayerAnswerCard.js';
import { cardDataType1 } from '../../carddatatype1.js';
import { cardDataType2 } from '../../carddatatype2.js';
import { cardDataType3 } from '../../carddatatype3.js';
import { cardDataType4 } from '../../carddatatype4.js';
import { cardDataType5 } from '../../carddatatype5.js';

export class CardExporter {
    constructor() {
        this.loadHtml2Canvas();
        this.setupKeyboardShortcut();
        this.cardData = {
            1: cardDataType1,
            2: cardDataType2,
            3: cardDataType3,
            4: cardDataType4,
            5: cardDataType5
        };
        this.exportContainer = null;
    }

    async loadHtml2Canvas() {
        if (!window.html2canvas) {
            const script = document.createElement('script');
            script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
            script.async = true;
            document.head.appendChild(script);
            await new Promise(resolve => script.onload = resolve);
        }
    }

    setupKeyboardShortcut() {
        document.addEventListener('keydown', async (e) => {
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                await this.exportBetaCards();
            }
        });
    }

    async exportBetaCards() {
        try {
            console.log('Starting beta card export...');
            
            // Create a container for our export cards if it doesn't exist
            if (!this.exportContainer) {
                this.exportContainer = document.createElement('div');
                this.exportContainer.style.position = 'fixed';
                this.exportContainer.style.left = '-9999px';
                this.exportContainer.style.top = '0';
                document.body.appendChild(this.exportContainer);
            }

            // Export one card from each type
            for (let type = 1; type <= 5; type++) {
                const typeData = this.cardData[type];
                if (!typeData || !typeData.length) {
                    console.warn(`No data found for type ${type}`);
                    continue;
                }
                
                console.log(`Processing type ${type}...`);
                await this.exportCardPair(1, type, typeData[0]);
            }

            // Clean up
            if (this.exportContainer) {
                document.body.removeChild(this.exportContainer);
                this.exportContainer = null;
            }
            
            console.log('Beta card export complete!');
        } catch (error) {
            console.error('Error during export:', error);
            if (this.exportContainer) {
                document.body.removeChild(this.exportContainer);
                this.exportContainer = null;
            }
        }
    }

    async exportCardPair(cardNumber, type, cardData) {
        try {
            console.log(`Exporting Type ${type} card pair...`);
            
            // Export clue card
            await this.prepareAndExportCard(cardNumber, type, 'A', 'Clue', cardData);
            // Export answer card
            await this.prepareAndExportCard(cardNumber, type, 'B', 'Answer', cardData);
        } catch (error) {
            console.error(`Error exporting card pair type ${type}:`, error);
        }
    }

    async prepareAndExportCard(cardNumber, type, variant, cardType, cardData) {
        try {
            // Clear the export container
            this.exportContainer.innerHTML = '';
            
            // Create appropriate card type
            const card = cardType === 'Clue' 
                ? new SinglePlayerClueCard(this.exportContainer, cardData)
                : new SinglePlayerAnswerCard(this.exportContainer, cardData);

            // Wait for card to be fully rendered
            await new Promise(resolve => setTimeout(resolve, 500));

            const cardElement = this.exportContainer.querySelector('.card');
            if (!cardElement) {
                throw new Error('Card element not found');
            }

            // Clean up the card based on type
            if (cardType === 'Clue') {
                this.cleanupClueCard(cardElement);
            } else {
                this.cleanupAnswerCard(cardElement);
            }

            // Hide any UI elements that shouldn't be in the export
            const uiElements = cardElement.querySelectorAll('.counter, .score-counter, .card-counter, .score, .help-button, .answer-button, .button-container, .button, #card-counter, #score, .controls, .control-button, .header');
            uiElements.forEach(el => el?.style.setProperty('display', 'none', 'important'));

            // Get the card type and check if it's a clue card
            const cardClasses = Array.from(cardElement.classList);
            const typeClass = cardClasses.find(cls => cls.startsWith('type-'));
            const type = typeClass ? typeClass.split('-')[1] : '1';
            const isClueCard = !cardElement.classList.contains('answer-card');
            
            console.log('Card type:', type, 'Is clue card:', isClueCard);

            // Define background colors based on type
            const bgColors = {
                '1': '#6bacfe',
                '2': '#fe88b1',
                '3': '#b4fe69',
                '4': '#fec469',
                '5': '#fe6969'
            };

            const bgColor = bgColors[type];

            // Reset any transforms or scaling that might affect capture
            const baseStyle = `
                transform: none !important;
                position: relative !important;
                margin: 0 !important;
                width: 500px !important;
                height: 800px !important;
                max-width: 500px !important;
                left: 0 !important;
                right: 0 !important;
                border-radius: 15px !important;
                box-shadow: 0 0 10px rgba(0,0,0,0.2) !important;
            `;

            // Add background for clue cards
            const backgroundStyle = isClueCard ? `
                background-color: ${bgColor} !important;
                background-image: url('../images/background/type${type}background.png') !important;
                background-size: cover !important;
                background-position: center !important;
            ` : '';

            // Apply styles and log for debugging
            cardElement.style.cssText = baseStyle + backgroundStyle;
            console.log('Applied styles:', baseStyle + backgroundStyle);

            // Force a reflow
            void cardElement.offsetHeight;

            // Set container to match card dimensions exactly
            this.exportContainer.style.cssText = `
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 500px !important;
                height: 800px !important;
                z-index: -9999 !important;
                pointer-events: none !important;
                opacity: 1 !important;
                background: transparent !important;
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                overflow: visible !important;
                padding: 20px !important;
            `;

            // Capture with precise dimensions and viewport settings
            const canvas = await html2canvas(cardElement, {
                backgroundColor: null,
                scale: 2,
                logging: true,  // Enable logging to debug background issues
                useCORS: true,
                allowTaint: true,
                width: 540,
                height: 840,
                x: 0,
                y: 0,
                scrollX: 0,
                scrollY: 0,
                windowWidth: 540,
                windowHeight: 840,
                onclone: (clonedDoc) => {
                    const clonedCard = clonedDoc.querySelector('.card');
                    if (clonedCard) {
                        // Apply same styles to cloned element
                        clonedCard.style.cssText = baseStyle + backgroundStyle;
                        console.log('Cloned card styles:', baseStyle + backgroundStyle);
                        
                        // Hide UI elements in clone
                        const clonedUiElements = clonedCard.querySelectorAll('.counter, .score-counter, .card-counter, .score, .help-button, .answer-button, .button-container, .button, #card-counter, #score, .controls, .control-button, .header');
                        clonedUiElements.forEach(el => el?.style.setProperty('display', 'none', 'important'));
                    }
                }
            });

            // Generate filename
            const filename = this.generateFilename(cardNumber, type, variant, cardType);
            
            // Convert and download
            const link = document.createElement('a');
            link.download = filename;
            link.href = canvas.toDataURL('image/png', 1.0);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            console.log(`Exported: ${filename}`);
        } catch (error) {
            console.error('Error exporting card:', error);
        }
    }

    cleanupClueCard(cardClone) {
        // Remove card count and score count (row 1)
        const row1Elements = cardClone.querySelectorAll('.card-count, .score-count');
        row1Elements.forEach(el => el?.remove());

        // Remove answer button (row 4)
        const answerButton = cardClone.querySelector('.answer-button');
        if (answerButton) answerButton.remove();

        // Remove "?" button (row 5)
        const helpButton = cardClone.querySelector('.help-button');
        if (helpButton) helpButton.remove();
    }

    cleanupAnswerCard(cardClone) {
        // Remove "Correct" and "Wrong" buttons (row 4)
        const buttons = cardClone.querySelectorAll('.correct-button, .wrong-button');
        buttons.forEach(button => button?.remove());
    }

    generateFilename(cardNumber, type, variant, cardType) {
        const paddedNumber = String(cardNumber).padStart(3, '0');
        return `DoubleAct-${paddedNumber}-Type${type}-${variant}-${cardType}.png`;
    }
}

// Initialize the exporter when the module loads
window.cardExporter = new CardExporter();