// Debug mode utility class
export class DebugMode {
    static #isDebugMode = false;
    static #debugStylesheet = null;
    static #debugTooltip = null;

    static initialize() {
        // Add keyboard event listener
        document.addEventListener('keydown', (event) => {
            // Check for Ctrl+M
            if (event.ctrlKey && event.key.toLowerCase() === 'm') {
                event.preventDefault();
                this.toggleDebugMode();
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
                max-width: 300px;
                white-space: nowrap;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
        `;

        // Create tooltip element
        this.#debugTooltip = document.createElement('div');
        this.#debugTooltip.className = 'debug-tooltip';
        this.#debugTooltip.style.display = 'none';
    }

    static #handleMouseMove(event) {
        if (!this.#isDebugMode) return;

        const element = event.target;
        const computedStyle = window.getComputedStyle(element);
        
        // Get element information
        const fontSize = computedStyle.fontSize;
        const fontFamily = computedStyle.fontFamily.split(',')[0].replace(/['"]/g, '');
        const fontWeight = computedStyle.fontWeight;
        const classes = element.className || 'no-class';
        
        // Update tooltip content
        this.#debugTooltip.innerHTML = `
            <div><strong>Classes:</strong> ${classes}</div>
            <div><strong>Font Size:</strong> ${fontSize}</div>
            <div><strong>Font Family:</strong> ${fontFamily}</div>
            <div><strong>Font Weight:</strong> ${fontWeight}</div>
        `;

        // Position tooltip
        const tooltipWidth = this.#debugTooltip.offsetWidth;
        const tooltipHeight = this.#debugTooltip.offsetHeight;
        
        // Keep tooltip within viewport
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
        this.#debugTooltip.style.display = 'block';
    }

    static toggleDebugMode() {
        this.#isDebugMode = !this.#isDebugMode;
        
        if (this.#isDebugMode) {
            document.body.classList.add('debug-mode');
            document.head.appendChild(this.#debugStylesheet);
            document.body.appendChild(this.#debugTooltip);
            
            // Add mousemove listener
            document.addEventListener('mousemove', this.#handleMouseMove.bind(this));
            
            console.log('Debug mode enabled - Press Ctrl+M to disable');
        } else {
            document.body.classList.remove('debug-mode');
            this.#debugStylesheet.remove();
            this.#debugTooltip.remove();
            
            // Remove mousemove listener
            document.removeEventListener('mousemove', this.#handleMouseMove.bind(this));
            
            console.log('Debug mode disabled - Press Ctrl+M to enable');
        }
    }

    static isEnabled() {
        return this.#isDebugMode;
    }
}
