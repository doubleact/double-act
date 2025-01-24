// Debug mode utility class
export class DebugMode {
    static #isDebugMode = false;
    static #isLinkDebugMode = false;
    static #debugStylesheet = null;
    static #debugTooltip = null;

    static initialize() {
        // Add keyboard event listeners
        document.addEventListener('keydown', (event) => {
            // Check for Ctrl+L
            if (event.ctrlKey && event.key.toLowerCase() === 'l') {
                event.preventDefault();
                this.toggleLinkDebugMode();
            }
        });

        // Create debug stylesheet
        this.#debugStylesheet = document.createElement('style');
        this.#debugStylesheet.textContent = `
            .debug-mode * {
                outline: 1px solid rgba(255, 0, 0, 0.2) !important;
            }
            .debug-mode [style] {
                outline: 2px solid rgba(0, 255, 0, 0.3) !important;
            }
            .debug-tooltip {
                position: fixed;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px;
                border-radius: 4px;
                font-size: 12px;
                pointer-events: none;
                z-index: 9999;
                max-width: 500px;
                white-space: pre-wrap;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
            .link-debug-mode button::after,
            .link-debug-mode .help-button::after,
            .link-debug-mode .back-button::after,
            .link-debug-mode .mode-button::after,
            .link-debug-mode .answer-button::after {
                content: attr(data-debug-info);
                position: absolute;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 10px;
                white-space: pre;
                pointer-events: none;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                margin-bottom: 4px;
                z-index: 1000;
                display: block;
            }
        `;

        // Create tooltip element
        this.#debugTooltip = document.createElement('div');
        this.#debugTooltip.className = 'debug-tooltip';
        this.#debugTooltip.style.display = 'none';
    }

    static #findLinkedFiles(button) {
        // Get the onclick or event handler source code
        const eventHandlers = button.getAttribute('onclick') || '';
        const buttonText = button.textContent.toLowerCase();
        
        // Find the card element
        const card = button.closest('.card');
        if (!card) return null;

        // Get card class
        const cardClass = Array.from(card.classList).find(c => c.includes('card'));
        if (!cardClass) return null;

        // Based on the button and card, determine the linked files
        let linkedFiles = {
            from: '',
            to: [],
            css: ''
        };

        // Set current card's files
        linkedFiles.from = `${cardClass.replace(/-/g, '')}.js`;
        linkedFiles.css = `${cardClass}.css`;

        // Determine target files based on button type and card
        if (buttonText.includes('back')) {
            linkedFiles.to.push('ModeSelectionCard.js');
        } else if (cardClass === 'mode-selection-card') {
            if (buttonText.includes('single')) linkedFiles.to.push('SinglePlayerClueCard.js');
            else if (buttonText.includes('multi')) linkedFiles.to.push('NumberOfPlayersCard.js');
            else if (buttonText.includes('?')) linkedFiles.to.push('ModeCardHelp.js');
        } else if (cardClass === 'mode-card-help') {
            linkedFiles.to.push('ModeSelectionCard.js');
        } else if (cardClass === 'number-of-players-card') {
            linkedFiles.to.push('MultiplayerClueCard.js');
        } else if (cardClass === 'singleplayer-clue-card') {
            if (buttonText.includes('?')) linkedFiles.to.push('DynamicClueHelpCard.js');
            else linkedFiles.to.push('SinglePlayerAnswerCard.js');
        } else if (cardClass === 'multiplayer-clue-card') {
            if (buttonText.includes('?')) linkedFiles.to.push('DynamicClueHelpCard.js');
            else linkedFiles.to.push('MultiplayerAnswerCard.js');
        }

        return linkedFiles;
    }

    static #handleMouseMove(event) {
        if (!this.#isDebugMode && !this.#isLinkDebugMode) return;

        const element = event.target;
        let tooltipContent = '';

        if (this.#isDebugMode) {
            const computedStyle = window.getComputedStyle(element);
            tooltipContent = `
                <div><strong>Classes:</strong> ${element.className || 'no-class'}</div>
                <div><strong>Font Size:</strong> ${computedStyle.fontSize}</div>
                <div><strong>Font Family:</strong> ${computedStyle.fontFamily.split(',')[0].replace(/['"]/g, '')}</div>
                <div><strong>Font Weight:</strong> ${computedStyle.fontWeight}</div>
            `;
        }

        if (this.#isLinkDebugMode) {
            // Get the closest button or interactive element
            const button = element.closest('button, .help-button, .back-button, .mode-button, .answer-button');
            if (button) {
                const links = this.#findLinkedFiles(button);
                if (links) {
                    const debugInfo = `From: ${links.from}\nTo: ${links.to.join(', ') || 'none'}\nCSS: ${links.css}`;
                    button.setAttribute('data-debug-info', debugInfo);
                    tooltipContent = debugInfo;
                }
            }
        }

        if (tooltipContent) {
            this.#debugTooltip.innerHTML = tooltipContent;
            this.#debugTooltip.style.display = 'block';

            // Position tooltip
            const tooltipWidth = this.#debugTooltip.offsetWidth;
            const tooltipHeight = this.#debugTooltip.offsetHeight;
            
            let left = event.pageX + 15;
            let top = event.pageY + 15;
            
            if (left + tooltipWidth > window.innerWidth) {
                left = event.pageX - tooltipWidth - 15;
            }
            
            if (top + tooltipHeight > window.innerHeight) {
                top = event.pageY - tooltipHeight - 15;
            }

            this.#debugTooltip.style.left = left + 'px';
            this.#debugTooltip.style.top = top + 'px';
        } else {
            this.#debugTooltip.style.display = 'none';
        }
    }

    static toggleDebugMode() {
        this.#isDebugMode = !this.#isDebugMode;
        
        if (this.#isDebugMode) {
            document.body.classList.add('debug-mode');
            document.head.appendChild(this.#debugStylesheet);
            document.body.appendChild(this.#debugTooltip);
            document.addEventListener('mousemove', this.#handleMouseMove.bind(this));
            console.log('Debug mode enabled');
        } else {
            document.body.classList.remove('debug-mode');
            if (!this.#isLinkDebugMode) {
                this.#debugStylesheet.remove();
                this.#debugTooltip.remove();
                document.removeEventListener('mousemove', this.#handleMouseMove.bind(this));
            }
            console.log('Debug mode disabled');
        }
    }

    static toggleLinkDebugMode() {
        this.#isLinkDebugMode = !this.#isLinkDebugMode;
        
        if (this.#isLinkDebugMode) {
            document.body.classList.add('link-debug-mode');
            if (!document.head.contains(this.#debugStylesheet)) {
                document.head.appendChild(this.#debugStylesheet);
                document.body.appendChild(this.#debugTooltip);
                document.addEventListener('mousemove', this.#handleMouseMove.bind(this));
            }
            console.log('Link debug mode enabled - Press Ctrl+L to disable');
        } else {
            document.body.classList.remove('link-debug-mode');
            if (!this.#isDebugMode) {
                this.#debugStylesheet.remove();
                this.#debugTooltip.remove();
                document.removeEventListener('mousemove', this.#handleMouseMove.bind(this));
            }
            console.log('Link debug mode disabled');
        }
    }
}
