class Analytics {
    constructor() {
        this.currentSession = null;
        this.baseUrl = 'http://localhost:3001'; // Update port
    }

    async startSession(gameMode, playerCount, deckTypes) {
        const sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
        try {
            const response = await fetch(`${this.baseUrl}/api/analytics/session/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sessionId,
                    gameMode,
                    playerCount,
                    deckTypes
                })
            });
            const data = await response.json();
            if (data.success) {
                this.currentSession = sessionId;
            }
        } catch (error) {
            console.error('Failed to start analytics session:', error);
        }
    }

    async recordAction(clueId, correct, timeSpent, usedInfo) {
        if (!this.currentSession) return;

        try {
            await fetch(`${this.baseUrl}/api/analytics/session/${this.currentSession}/action`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    clueId,
                    correct,
                    timeSpent,
                    usedInfo
                })
            });
        } catch (error) {
            console.error('Failed to record action:', error);
        }
    }

    async endSession() {
        if (!this.currentSession) return;

        try {
            await fetch(`${this.baseUrl}/api/analytics/session/${this.currentSession}/end`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            this.currentSession = null;
        } catch (error) {
            console.error('Failed to end session:', error);
        }
    }

    async getGameStats(period = 'daily') {
        try {
            const response = await fetch(`${this.baseUrl}/api/analytics/stats?period=${period}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch game stats:', error);
            return {
                singlePlayer: { type1: 0, type2: 0, type3: 0, type4: 0, type5: 0, all: 0 },
                multiplayer: { type1: 0, type2: 0, type3: 0, type4: 0, type5: 0, all: 0 },
                playerCount: {
                    two: 0, three: 0, four: 0, five: 0, six: 0,
                    seven: 0, eight: 0, nine: 0, ten: 0
                }
            };
        }
    }

    async getVisitorStats() {
        try {
            const response = await fetch(`${this.baseUrl}/api/analytics/visitor/stats`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch visitor stats:', error);
            return {
                totalVisitors: 0,
                activeVisitors: 0
            };
        }
    }

    async getVisitorJourneys() {
        try {
            const response = await fetch(`${this.baseUrl}/api/analytics/visitor/journeys`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const visitors = await response.json();
            return visitors.map(visitor => ({
                id: visitor.id,
                label: visitor.label,
                ipAddress: visitor.ipAddress,
                timestamp: visitor.timestamp,
                gameMode: visitor.gameMode,
                playerCount: visitor.playerCount,
                deckTypes: visitor.deckTypes,
                journey: visitor.journey,
                formattedTime: new Date(visitor.timestamp).toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                })
            }));
        } catch (error) {
            console.error('Failed to fetch visitor journeys:', error);
            return [];
        }
    }

    async track(event, data = {}) {
        const timestamp = new Date().toISOString();
        const visitorId = this.getVisitorId();
        const sessionId = this.getSessionId();

        try {
            await fetch(`${this.baseUrl}/api/analytics/event`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    event,
                    data,
                    timestamp,
                    visitorId,
                    sessionId
                })
            });
        } catch (error) {
            console.error('Failed to track event:', error);
        }
    }

    getSessionId() {
        let sessionId = localStorage.getItem('sessionId');
        if (!sessionId) {
            sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
            localStorage.setItem('sessionId', sessionId);
        }
        return sessionId;
    }

    getVisitorId() {
        let visitorId = localStorage.getItem('visitorId');
        if (!visitorId) {
            visitorId = Date.now().toString(36) + Math.random().toString(36).substr(2);
            localStorage.setItem('visitorId', visitorId);
        }
        return visitorId;
    }

    async getAnswerStats(deckType = 'all') {
        try {
            const response = await fetch(`${this.baseUrl}/api/analytics/answer/stats?deckType=${deckType}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch answer stats:', error);
            return {
                mostCorrect: [],
                mostWrong: []
            };
        }
    }
}

// Export the Analytics class
export { Analytics };

// Export a default instance
export const analytics = new Analytics();
