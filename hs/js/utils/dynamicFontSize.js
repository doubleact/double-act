// Function to adjust font size to fit container
function adjustFontSize(element) {
    const container = element.closest('.answer-container');
    if (!container) return;

    const originalFontSize = parseFloat(window.getComputedStyle(element).fontSize);
    let fontSize = originalFontSize;
    
    // Reset to original size first
    element.style.fontSize = originalFontSize + 'px';
    
    const containerHeight = container.clientHeight;
    const totalContentHeight = Array.from(container.children)
        .reduce((sum, el) => sum + el.offsetHeight, 0);
    
    // Calculate available height ratio
    const heightRatio = containerHeight / totalContentHeight;
    
    if (element.classList.contains('character-name')) {
        // Character name should be larger and scale based on container
        const containerWidth = container.clientWidth - 60; // 30px padding each side
        const textWidth = element.scrollWidth;
        const textHeight = element.scrollHeight;
        const maxHeight = containerHeight * 0.2; // 20% of container height
        
        if (textWidth > containerWidth || textHeight > maxHeight) {
            const widthRatio = containerWidth / textWidth;
            const heightRatio = maxHeight / textHeight;
            const scaleFactor = Math.min(widthRatio, heightRatio) * 0.95;
            
            fontSize = Math.max(12, Math.floor(originalFontSize * scaleFactor));
            element.style.fontSize = fontSize + 'px';
        }
    } else if (element.classList.contains('movie-name')) {
        // Movie names should be smaller and scale more aggressively
        const containerWidth = element.parentElement.clientWidth;
        const textWidth = element.scrollWidth;
        const maxHeight = containerHeight * 0.1; // 10% of container height per movie
        
        if (textWidth > containerWidth || element.offsetHeight > maxHeight) {
            const widthRatio = containerWidth / textWidth;
            const heightRatio = maxHeight / element.offsetHeight;
            const scaleFactor = Math.min(widthRatio, heightRatio) * 0.9; // More aggressive scaling
            
            fontSize = Math.max(8, Math.floor(originalFontSize * scaleFactor));
            element.style.fontSize = fontSize + 'px';
            
            // Fine-tune if still needed
            while ((element.scrollWidth > containerWidth || element.offsetHeight > maxHeight) && fontSize > 8) {
                fontSize *= 0.95;
                element.style.fontSize = fontSize + 'px';
            }
        }
    }

    // Ensure text overflow is handled properly
    if (element.scrollWidth > element.clientWidth) {
        element.style.textOverflow = 'ellipsis';
        element.style.overflow = 'hidden';
    }
}

// Function to adjust all text elements in answer cards
function adjustAllTextElements() {
    requestAnimationFrame(() => {
        const answerCards = document.querySelectorAll('.singleplayer-answer-card, .multiplayer-answer-card');
        
        answerCards.forEach(card => {
            const container = card.querySelector('.answer-container');
            if (!container) return;

            // First adjust character name as it should be largest
            const characterName = card.querySelector('.character-name');
            if (characterName) {
                adjustFontSize(characterName);
            }

            // Then adjust movie names
            const movieNames = card.querySelectorAll('.movie-name');
            movieNames.forEach(element => {
                adjustFontSize(element);
                // Double-check after initial adjustment
                requestAnimationFrame(() => adjustFontSize(element));
            });
        });
    });
}

// Create a ResizeObserver to watch for container size changes
const resizeObserver = new ResizeObserver(entries => {
    entries.forEach(entry => {
        if (entry.target.classList.contains('answer-container')) {
            adjustAllTextElements();
        }
    });
});

// Function to observe answer containers
function observeAnswerContainers() {
    const containers = document.querySelectorAll('.answer-container');
    containers.forEach(container => {
        resizeObserver.observe(container);
    });
}

// Run on load and window resize
window.addEventListener('load', () => {
    adjustAllTextElements();
    observeAnswerContainers();
});

window.addEventListener('resize', () => {
    requestAnimationFrame(adjustAllTextElements);
});

// Export for use in other modules
export { adjustAllTextElements, adjustFontSize };
