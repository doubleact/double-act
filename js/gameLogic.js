// Game logic for card selection and deck management

/**
 * Selects a balanced set of cards ensuring no character is overrepresented
 * @param {Array} availableCards - Array of all available cards from selected deck types
 * @param {number} targetCount - Number of cards to select (default 50)
 * @returns {Array} - Selected cards
 */
export function selectBalancedGameCards(availableCards, targetCount = 50) {
    // Group cards by character
    const characterGroups = {};
    availableCards.forEach(card => {
        if (!characterGroups[card.character]) {
            characterGroups[card.character] = [];
        }
        characterGroups[card.character].push(card);
    });
    
    // Create a balanced pool where no character has more than 2 cards
    let balancedPool = [];
    Object.entries(characterGroups).forEach(([character, cards]) => {
        if (cards.length > 2) {
            // Randomly select only 2 cards for this character
            const shuffled = [...cards].sort(() => 0.5 - Math.random());
            balancedPool.push(...shuffled.slice(0, 2));
        } else {
            balancedPool.push(...cards);
        }
    });
    
    // Shuffle the balanced pool
    const shuffledPool = balancedPool.sort(() => 0.5 - Math.random());
    
    // If we don't have enough cards in the balanced pool, return all we have
    if (shuffledPool.length <= targetCount) {
        return shuffledPool;
    }
    
    // Return the requested number of cards
    return shuffledPool.slice(0, targetCount);
}

/**
 * Distributes cards among selected deck types
 * @param {Array} selectedTypes - Array of selected deck type numbers
 * @param {Object} allDecks - Object containing all card deck data
 * @param {number} totalCards - Total number of cards to select (default 50)
 * @returns {Array} - Selected and balanced cards
 */
export function selectCardsFromDecks(selectedTypes, allDecks, totalCards = 50) {
    if (selectedTypes.length === 0) return [];
    
    // Calculate cards per deck
    const cardsPerDeck = Math.floor(totalCards / selectedTypes.length);
    const remainder = totalCards % selectedTypes.length;
    
    let selectedCards = [];
    selectedTypes.forEach((deckType, index) => {
        const deckData = allDecks[`cardDataType${deckType}`];
        const cardsToSelect = cardsPerDeck + (index < remainder ? 1 : 0);
        
        // Get balanced selection from this deck
        const balancedDeckCards = selectBalancedGameCards(deckData, cardsToSelect);
        selectedCards.push(...balancedDeckCards);
    });
    
    // Final shuffle of all selected cards
    return selectedCards.sort(() => 0.5 - Math.random());
}
