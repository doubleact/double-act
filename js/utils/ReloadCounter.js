// ReloadCounter.js
class ReloadCounter {
    constructor() {
        this.initializeCounter();
        this.displayCounter();
    }

    initializeCounter() {
        // Get the current count from localStorage or initialize to 0
        let count = parseInt(localStorage.getItem('pageReloadCount')) || 0;
        count++;
        localStorage.setItem('pageReloadCount', count);
        this.count = count;
    }

    displayCounter() {
        // Create or get the counter element
        let counterElement = document.getElementById('reloadCounter');
        if (!counterElement) {
            counterElement = document.createElement('div');
            counterElement.id = 'reloadCounter';
            counterElement.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 5px 10px;
                border-radius: 5px;
                font-family: Arial, sans-serif;
                z-index: 9999;
            `;
            document.body.appendChild(counterElement);
        }
        counterElement.textContent = `Page Reloads: ${this.count}`;
    }

    // Method to reset counter
    resetCounter() {
        localStorage.setItem('pageReloadCount', 0);
        this.count = 0;
        this.displayCounter();
    }
}

// Initialize counter when page loads
window.addEventListener('load', () => {
    window.reloadCounter = new ReloadCounter();
});
