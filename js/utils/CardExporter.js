import { SinglePlayerClueCard } from '../cards/SinglePlayerClueCard.js';
import { SinglePlayerAnswerCard } from '../cards/SinglePlayerAnswerCard.js';
import { cardDataType1 } from '../../carddatatype1.js';
import { cardDataType2 } from '../../carddatatype2.js';
import { cardDataType3 } from '../../carddatatype3.js';
import { cardDataType4 } from '../../carddatatype4.js';
import { cardDataType5 } from '../../carddatatype5.js';

export class CardExporter {
    constructor() {
        this.CARD_WIDTH = 897;
        this.CARD_HEIGHT = 1487;
        
        // Create export container
        this.exportContainer = document.createElement('div');
        this.exportContainer.className = 'temp-export-container';
        this.exportContainer.style.cssText = `
            position: fixed !important;
            left: -9999px !important;
            top: 0 !important;
            width: ${this.CARD_WIDTH}px !important;
            height: ${this.CARD_HEIGHT}px !important;
            overflow: hidden !important;
            transform-origin: top left !important;
        `;
        document.body.appendChild(this.exportContainer);

        this.cardData = {
            1: cardDataType1,
            2: cardDataType2,
            3: cardDataType3,
            4: cardDataType4,
            5: cardDataType5
        };

        this.loadHtml2Canvas();
        this.setupKeyboardShortcut();
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

    generateFilename(type, cardNumber, variant) {
        const paddedNumber = String(cardNumber).padStart(3, '0');
        const cardType = variant === 'clue' ? 'A-Clue' : 'B-Answer';
        return `DoubleAct-Type${type}-${paddedNumber}-${cardType}.png`;
    }

    async exportBetaCards() {
        try {
            // Export first Type5 card
            const type5Data = this.cardData[5];
            if (!type5Data || !type5Data.length) {
                console.warn('No data found for Type5');
                return;
            }

            console.log('Starting Type5 export (1 card)...');
            
            // Export first card pair only
            const cardNumber = 1;
            console.log(`Exporting Type5 card ${cardNumber}...`);
            await this.exportCardPair(cardNumber, 5, type5Data[0]);
            
            console.log('Type5 export complete!');
        } catch (error) {
            console.error('Error during export:', error);
        }
    }

    async exportCardPair(cardNumber, type, cardData) {
        await this.prepareAndExportCard(cardNumber, type, 'clue', 'Clue', cardData);
        await this.prepareAndExportCard(cardNumber, type, 'answer', 'Answer', cardData);
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

            // Set container styles immediately
            if (cardType === 'Clue') {
                const cardContent = cardElement.querySelector('.card-content');
                if (cardContent) {
                    cardContent.style.cssText = `
                        width: calc(100% - 80px) !important;
                        height: 800px !important;
                        margin: 400px 40px 0 40px !important;
                        padding: 0 !important;
                        display: flex !important;
                        flex-direction: column !important;
                        justify-content: flex-start !important;
                    `;
                }
                const actorsContainer = cardElement.querySelector('.actors-container');
                if (actorsContainer) {
                    actorsContainer.style.marginTop = '0px';
                }
            } else {
                const cardContent = cardElement.querySelector('.card-content');
                if (cardContent) {
                    cardContent.style.cssText = `
                        width: calc(100% - 80px) !important;
                        height: 800px !important;
                        margin: 400px 40px 0 40px !important;
                        padding: 0 !important;
                        display: flex !important;
                        flex-direction: column !important;
                        justify-content: flex-start !important;
                    `;
                }
                const answerContainer = cardElement.querySelector('.answer-container');
                if (answerContainer) {
                    answerContainer.style.cssText = `
                        width: 100% !important;
                        height: 100% !important;
                        position: relative !important;
                        padding: 0 !important;
                        display: flex !important;
                        flex-direction: column !important;
                        justify-content: flex-start !important;
                    `;
                }
            }

            // Log the final structure
            console.log(`Final ${cardType} card structure:`, cardElement.innerHTML);

            // Debug: Log the HTML structure
            console.log(`Exporting ${cardType} card structure:`, cardElement.innerHTML);

            // Set initial styles for the export container
            this.exportContainer.style.cssText = `
                position: fixed !important;
                left: -9999px !important;
                top: 0 !important;
                width: ${this.CARD_WIDTH}px !important;
                height: ${this.CARD_HEIGHT}px !important;
                overflow: hidden !important;
                transform-origin: top left !important;
            `;

            // Set background image
            const backgroundImage = cardType === 'Answer' 
                ? '/images/background/answercardbackground.png'
                : `/images/background/type${type}background.png`;

            // First set base styles without dimensions
            cardElement.style.cssText = `
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                transform-origin: top left !important;
                border-radius: 15px !important;
                box-shadow: none !important;
                -webkit-box-shadow: none !important;
                -moz-box-shadow: none !important;
                background-image: url('${backgroundImage}') !important;
                background-size: cover !important;
                background-position: center !important;
                background-repeat: no-repeat !important;
                display: block !important;
                overflow: visible !important;
            `;

            // Get natural dimensions
            const naturalWidth = cardElement.offsetWidth;
            const naturalHeight = cardElement.offsetHeight;

            // Calculate scale to fit the canvas
            const scaleX = this.CARD_WIDTH / naturalWidth;
            const scaleY = this.CARD_HEIGHT / naturalHeight;
            const scale = Math.max(scaleX, scaleY);  // Use max to ensure it fills the canvas

            // Apply the scale transform
            cardElement.style.transform = `scale(${scale})`;
            cardElement.style.width = `${this.CARD_WIDTH / scale}px`;
            cardElement.style.height = `${this.CARD_HEIGHT / scale}px`;

            // Remove any effects that might affect rendering
            cardElement.querySelectorAll('*').forEach(el => {
                el.style.boxShadow = 'none';
                el.style.webkitBoxShadow = 'none';
                el.style.mozBoxShadow = 'none';
                el.style.textShadow = 'none';
            });

            // Hide UI elements
            const elementsToHide = [
                '.counter', '.score-counter', '.card-counter', '.score',
                '.help-button', '.answer-button', '.button-container',
                '.button', '#card-counter', '#score', '.controls',
                '.control-button', '.header', '.debug-info',
                '.viewport-debug-info', '.button-debug-info',
                '.correct-button', '.wrong-button'
            ];
            
            cardElement.querySelectorAll(elementsToHide.join(',')).forEach(el => {
                el.style.display = 'none';
            });

            // Export to PNG with optimized settings
            const canvas = await html2canvas(cardElement, {
                width: this.CARD_WIDTH,
                height: this.CARD_HEIGHT,
                scale: 1,
                useCORS: true,
                backgroundColor: null,
                logging: false,
                removeContainer: true,
                imageTimeout: 0,
                windowWidth: this.CARD_WIDTH,
                windowHeight: this.CARD_HEIGHT,
                x: 0,
                y: 0,
                scrollX: 0,
                scrollY: 0,
                allowTaint: true,
                onclone: (clonedDoc) => {
                    const clonedCard = clonedDoc.querySelector('.card');
                    if (clonedCard) {
                        // Copy all styles from original card
                        clonedCard.style.cssText = cardElement.style.cssText;
                        
                        // Apply styles to the appropriate container in clone
                        if (cardType === 'Clue') {
                            const clonedCardContent = clonedCard.querySelector('.card-content');
                            if (clonedCardContent) {
                                clonedCardContent.style.cssText = `
                                    width: calc(100% - 80px) !important;
                                    height: 800px !important;
                                    margin: 400px 40px 0 40px !important;
                                    padding: 0 !important;
                                    display: flex !important;
                                    flex-direction: column !important;
                                    justify-content: flex-start !important;
                                `;
                            }
                            const clonedActorsContainer = clonedCard.querySelector('.actors-container');
                            if (clonedActorsContainer) {
                                clonedActorsContainer.style.marginTop = '0px';
                            }
                        } else {
                            const clonedCardContent = clonedCard.querySelector('.card-content');
                            const clonedAnswerContainer = clonedCard.querySelector('.answer-container');
                            if (clonedCardContent && clonedAnswerContainer) {
                                clonedCardContent.style.cssText = `
                                    width: calc(100% - 80px) !important;
                                    height: 800px !important;
                                    margin: 400px 40px 0 40px !important;
                                    padding: 0 !important;
                                    display: flex !important;
                                    flex-direction: column !important;
                                    justify-content: flex-start !important;
                                `;
                                clonedAnswerContainer.style.cssText = `
                                    width: 100% !important;
                                    height: 100% !important;
                                    position: relative !important;
                                    padding: 0 !important;
                                    display: flex !important;
                                    flex-direction: column !important;
                                    justify-content: flex-start !important;
                                `;
                            }
                        }

                        // Remove any effects that might affect rendering
                        clonedCard.querySelectorAll('*').forEach(el => {
                            el.style.boxShadow = 'none';
                            el.style.webkitBoxShadow = 'none';
                            el.style.mozBoxShadow = 'none';
                            el.style.textShadow = 'none';
                        });

                        // Hide UI elements in clone
                        const elementsToHide = [
                            '.counter', '.score-counter', '.card-counter', '.score',
                            '.help-button', '.answer-button', '.button-container',
                            '.button', '#card-counter', '#score', '.controls',
                            '.control-button', '.header', '.debug-info',
                            '.viewport-debug-info', '.button-debug-info',
                            '.correct-button', '.wrong-button'
                        ];
                        
                        clonedCard.querySelectorAll(elementsToHide.join(',')).forEach(el => {
                            el.style.display = 'none';
                        });
                    }
                }
            });

            // Create download link
            const link = document.createElement('a');
            link.download = this.generateFilename(type, cardNumber, variant);
            link.href = canvas.toDataURL('image/png');
            link.click();

            console.log(`Exported ${link.download}`);
        } catch (error) {
            console.error('Error preparing and exporting card:', error);
            throw error;
        }
    }
}

// Initialize the exporter when the module loads
window.cardExporter = new CardExporter();