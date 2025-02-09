import mongoose from 'mongoose';

const gameSessionSchema = new mongoose.Schema({
    sessionId: { type: String, required: true, unique: true },
    gameMode: { type: String, enum: ['single_player', 'multiplayer'], required: true },
    playerCount: { type: Number, required: true },
    deckTypes: [{ type: String }],
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    ipAddress: String,
    score: Number,
    totalTime: Number,
    playerActions: [{
        clueId: String,
        correct: Boolean,
        timeSpent: Number,
        timestamp: { type: Date, default: Date.now }
    }],
    events: [{
        name: { 
            type: String, 
            enum: [
                'game_start',
                'answer_submitted',
                'game_complete',
                'deck_selected',
                'player_count_changed',
                'admin_access_attempt',
                'admin_login_success',
                'admin_login_failed'
            ]
        },
        data: mongoose.Schema.Types.Mixed,
        timestamp: { type: Date, default: Date.now }
    }]
});

// Indexes for faster queries
gameSessionSchema.index({ startTime: 1 });
gameSessionSchema.index({ gameMode: 1 });
gameSessionSchema.index({ 'playerActions.timestamp': 1 });

const GameSession = mongoose.model('GameSession', gameSessionSchema);
export default GameSession;
