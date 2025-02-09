// Google Analytics Service
class AnalyticsService {
    constructor() {
        this.initialized = false;
        this.initGA();
    }

    initGA() {
        // Add GA4 tracking code
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-LRQZFBDJJQ';
        
        const script2 = document.createElement('script');
        script2.textContent = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LRQZFBDJJQ');
        `;
        
        document.head.appendChild(script1);
        document.head.appendChild(script2);
        this.initialized = true;
    }

    // Track game start
    trackGameStart(gameMode, playerCount, deckTypes) {
        if (!this.initialized) return;
        gtag('event', 'game_start', {
            game_mode: gameMode,
            player_count: playerCount,
            deck_types: Array.isArray(deckTypes) ? deckTypes.join(',') : deckTypes
        });
    }

    // Track answer submission
    trackAnswer(clueId, isCorrect, timeSpent) {
        if (!this.initialized) return;
        gtag('event', 'answer_submitted', {
            clue_id: clueId,
            is_correct: isCorrect,
            time_spent: timeSpent
        });
    }

    // Track game completion
    trackGameComplete(score, totalTime, gameMode) {
        if (!this.initialized) return;
        gtag('event', 'game_complete', {
            score: score,
            total_time: totalTime,
            game_mode: gameMode
        });
    }

    // Track deck selection
    trackDeckSelection(deckType) {
        if (!this.initialized) return;
        gtag('event', 'deck_selected', {
            deck_type: deckType
        });
    }

    // Track player count change (for multiplayer)
    trackPlayerCountChange(count) {
        if (!this.initialized) return;
        gtag('event', 'player_count_changed', {
            count: count
        });
    }
}

// Create a singleton instance
const analyticsService = new AnalyticsService();
export default analyticsService;
