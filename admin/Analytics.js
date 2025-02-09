class Analytics {
    constructor(baseUrl = 'http://localhost:3001/api/analytics') {
        this.baseUrl = baseUrl;
    }

    async getVisitorStats() {
        try {
            const response = await fetch(`${this.baseUrl}/visitor/stats`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to fetch visitor stats:', error);
            return { totalVisitors: 0, activeVisitors: 0 };
        }
    }

    async getVisitorJourneys() {
        try {
            const response = await fetch(`${this.baseUrl}/visitor/journeys`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to fetch visitor journeys:', error);
            return [];
        }
    }

    async getAnswerStats(deckType = 'all') {
        try {
            const response = await fetch(`${this.baseUrl}/answer/stats?deckType=${deckType}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to fetch answer stats:', error);
            return { mostCorrect: [], mostWrong: [] };
        }
    }

    async addTestData() {
        try {
            const response = await fetch(`${this.baseUrl}/test-data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to add test data:', error);
            throw error;
        }
    }
}

// Create a singleton instance
const analytics = new Analytics();
export { analytics };
