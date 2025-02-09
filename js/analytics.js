// Analytics utility for tracking game events
const Analytics = {
    // Game Start
    trackGameStart: (gameMode, playerCount, deckTypes) => {
        gtag('event', 'game_start', {
            'game_mode': gameMode,
            'player_count': playerCount,
            'deck_types': deckTypes.join(',')
        });
    },

    // Answer Submitted
    trackAnswer: (clueId, isCorrect, timeSpent) => {
        gtag('event', 'answer_submitted', {
            'clue_id': clueId,
            'is_correct': isCorrect,
            'time_spent': timeSpent
        });
    },

    // Game Completed
    trackGameComplete: (score, totalTime, gameMode) => {
        gtag('event', 'game_complete', {
            'score': score,
            'total_time': totalTime,
            'game_mode': gameMode
        });
    },

    // Deck Selection
    trackDeckSelection: (deckType) => {
        gtag('event', 'deck_selected', {
            'deck_type': deckType
        });
    },

    // Player Count Change (for multiplayer)
    trackPlayerCountChange: (count) => {
        gtag('event', 'player_count_changed', {
            'count': count
        });
    }
};

export default Analytics;
