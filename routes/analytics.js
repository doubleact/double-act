import express from 'express';
import GameSession from '../models/GameSession.js';

const router = express.Router();

// Record a new game session
router.post('/session/start', async (req, res) => {
    try {
        const session = new GameSession({
            sessionId: req.body.sessionId,
            gameMode: req.body.gameMode,
            playerCount: req.body.playerCount,
            deckTypes: req.body.deckTypes,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });
        await session.save();
        res.json({ success: true, sessionId: session.sessionId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Record player action
router.post('/session/:sessionId/action', async (req, res) => {
    try {
        const session = await GameSession.findOne({ sessionId: req.params.sessionId });
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        
        session.playerActions.push({
            clueId: req.body.clueId,
            correct: req.body.correct,
            timeSpent: req.body.timeSpent,
            usedInfo: req.body.usedInfo
        });
        
        await session.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// End game session
router.post('/session/:sessionId/end', async (req, res) => {
    try {
        const session = await GameSession.findOne({ sessionId: req.params.sessionId });
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        
        session.endTime = new Date();
        await session.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get game statistics
router.get('/stats', async (req, res) => {
    try {
        const { period = 'daily' } = req.query;
        const now = new Date();
        let startDate = new Date();
        
        switch(period) {
            case 'yearly':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            case 'monthly':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case 'weekly':
                startDate.setDate(now.getDate() - 7);
                break;
            default: // daily
                startDate.setHours(0, 0, 0, 0);
        }

        const [singlePlayer, multiplayer, playerCounts] = await Promise.all([
            // Single player deck type stats
            GameSession.aggregate([
                { $match: { 
                    startTime: { $gte: startDate },
                    gameMode: 'single_player'
                }},
                { $unwind: '$deckTypes' },
                { $group: {
                    _id: '$deckTypes',
                    count: { $sum: 1 }
                }}
            ]),
            
            // Multiplayer deck type stats
            GameSession.aggregate([
                { $match: { 
                    startTime: { $gte: startDate },
                    gameMode: 'multiplayer'
                }},
                { $unwind: '$deckTypes' },
                { $group: {
                    _id: '$deckTypes',
                    count: { $sum: 1 }
                }}
            ]),
            
            // Player count distribution
            GameSession.aggregate([
                { $match: { 
                    startTime: { $gte: startDate },
                    gameMode: 'multiplayer'
                }},
                { $group: {
                    _id: '$playerCount',
                    count: { $sum: 1 }
                }}
            ])
        ]);

        // Format the response
        const response = {
            singlePlayer: {
                type1: 0, type2: 0, type3: 0, type4: 0, type5: 0, all: 0
            },
            multiplayer: {
                type1: 0, type2: 0, type3: 0, type4: 0, type5: 0, all: 0
            },
            playerCount: {
                two: 0, three: 0, four: 0, five: 0, six: 0,
                seven: 0, eight: 0, nine: 0, ten: 0
            }
        };

        // Fill in the actual values
        singlePlayer.forEach(item => {
            response.singlePlayer[item._id] = item.count;
        });
        
        multiplayer.forEach(item => {
            response.multiplayer[item._id] = item.count;
        });
        
        playerCounts.forEach(item => {
            const countMap = {
                2: 'two', 3: 'three', 4: 'four', 5: 'five',
                6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten'
            };
            if (countMap[item._id]) {
                response.playerCount[countMap[item._id]] = item.count;
            }
        });

        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Test endpoint to add sample data
router.post('/test/add-sample-data', async (req, res) => {
    try {
        // Create a test game session
        const testSession = new GameSession({
            sessionId: 'test-' + Date.now(),
            gameMode: 'multiplayer',
            playerCount: 4,
            deckTypes: ['type1', 'type2'], // Movies & Movies, Movies & TV
            ipAddress: '192.168.1.1',
            userAgent: 'Test Browser',
            startTime: new Date(),
            playerActions: [
                {
                    timestamp: new Date(),
                    clueId: 'clue1',
                    correct: true,
                    timeSpent: 25000,
                    usedInfo: false
                },
                {
                    timestamp: new Date(Date.now() + 30000),
                    clueId: 'clue2',
                    correct: false,
                    timeSpent: 45000,
                    usedInfo: true
                }
            ]
        });

        await testSession.save();
        res.json({ success: true, message: 'Test data added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add test data
router.post('/test-data', async (req, res) => {
    try {
        // Create some test game sessions
        const testSessions = [
            {
                sessionId: 'test1',
                gameMode: 'single_player',
                playerCount: 1,
                deckTypes: ['1', '2'],
                startTime: new Date(),
                ipAddress: '127.0.0.1',
                playerActions: [
                    { clueId: 'clue1', correct: true },
                    { clueId: 'clue2', correct: false },
                    { clueId: 'clue3', correct: true }
                ],
                events: [
                    { name: 'game_start', data: { mode: 'single_player' }, timestamp: new Date() },
                    { name: 'answer_submitted', data: { correct: true }, timestamp: new Date() },
                    { name: 'game_end', data: { score: 2 }, timestamp: new Date() }
                ]
            },
            {
                sessionId: 'test2',
                gameMode: 'multiplayer',
                playerCount: 2,
                deckTypes: ['3', '4'],
                startTime: new Date(),
                ipAddress: '127.0.0.2',
                playerActions: [
                    { clueId: 'clue1', correct: true },
                    { clueId: 'clue4', correct: true },
                    { clueId: 'clue2', correct: false }
                ],
                events: [
                    { name: 'game_start', data: { mode: 'multiplayer' }, timestamp: new Date() },
                    { name: 'player_joined', data: { count: 2 }, timestamp: new Date() },
                    { name: 'game_end', data: { score: 2 }, timestamp: new Date() }
                ]
            }
        ];

        // Delete existing test data
        await GameSession.deleteMany({ sessionId: { $in: ['test1', 'test2'] } });

        // Insert new test data
        await GameSession.insertMany(testSessions);

        res.json({ message: 'Test data added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Track events
router.post('/event', async (req, res) => {
    try {
        const { event, data, timestamp, visitorId, sessionId } = req.body;
        const session = await GameSession.findOne({ sessionId });
        
        if (!session) {
            // Create a new session if it doesn't exist
            const newSession = new GameSession({
                sessionId,
                startTime: timestamp,
                gameMode: data.gameMode || 'unknown',
                playerCount: data.playerCount || 0,
                deckTypes: data.deckTypes || [],
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                events: [{
                    name: event,
                    data,
                    timestamp
                }]
            });
            await newSession.save();
        } else {
            // Add event to existing session
            session.events = session.events || [];
            session.events.push({
                name: event,
                data,
                timestamp
            });
            await session.save();
        }
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error tracking event:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get answer statistics
router.get('/answer/stats', async (req, res) => {
    try {
        const { deckType = 'all' } = req.query;
        const sessions = await GameSession.find({
            'playerActions.correct': { $exists: true }
        });

        // Group answers by clueId and count correct/wrong
        const answerStats = {};
        sessions.forEach(session => {
            session.playerActions.forEach(action => {
                if (!action.clueId) return;
                
                if (!answerStats[action.clueId]) {
                    answerStats[action.clueId] = { correct: 0, wrong: 0 };
                }
                
                if (action.correct) {
                    answerStats[action.clueId].correct++;
                } else {
                    answerStats[action.clueId].wrong++;
                }
            });
        });

        // Convert to arrays and sort
        const mostCorrect = Object.entries(answerStats)
            .map(([clueId, stats]) => ({ clueId, count: stats.correct }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        const mostWrong = Object.entries(answerStats)
            .map(([clueId, stats]) => ({ clueId, count: stats.wrong }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        res.json({ mostCorrect, mostWrong });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get visitor journeys
router.get('/visitor/journeys', async (req, res) => {
    try {
        const sessions = await GameSession.find()
            .sort({ startTime: -1 })
            .limit(50);

        const journeys = sessions.map(session => ({
            id: session._id,
            label: `${session.gameMode} Game`,
            ipAddress: session.ipAddress,
            timestamp: session.startTime,
            gameMode: session.gameMode,
            playerCount: session.playerCount,
            deckTypes: session.deckTypes,
            journey: session.events?.map(event => ({
                name: event.name,
                data: event.data,
                timestamp: event.timestamp
            })) || []
        }));

        res.json(journeys);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get visitor statistics
router.get('/visitor/stats', async (req, res) => {
    try {
        const now = new Date();
        const fiveMinutesAgo = new Date(now - 5 * 60 * 1000);

        const totalVisitors = await GameSession.countDocuments();
        const activeVisitors = await GameSession.countDocuments({
            startTime: { $gte: fiveMinutesAgo }
        });

        res.json({
            totalVisitors,
            activeVisitors
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
