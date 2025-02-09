// Simple stats tracking
export const Stats = {
    // Store chart instances
    charts: {
        performance: null,
        cardPerformance: null,
        timePerCard: null
    },

    init() {
        if (!localStorage.getItem('pageStats')) {
            localStorage.setItem('pageStats', JSON.stringify({
                ispStats: {},
                cardStats: {
                    totalGames: 0,
                    averageScore: 0,
                    timePlayed: 0,
                    performance: [],
                    cardHistory: []
                }
            }));
        }
        // Track page visit
        this.trackPage(window.location.pathname);
    },

    destroyCharts() {
        // Destroy existing charts
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
        // Reset chart instances
        this.charts = {
            performance: null,
            cardPerformance: null,
            timePerCard: null
        };
    },

    async trackPage(page) {
        try {
            const stats = JSON.parse(localStorage.getItem('pageStats')) || { ispStats: {} };
            const currentTime = new Date().toISOString();
            
            // Initialize current session if not exists
            if (!stats.currentSession) {
                stats.currentSession = {
                    id: Date.now(),
                    startTime: currentTime,
                    pageVisits: [],
                    cardInteractions: [],
                    games: []
                };
            }

            // Add page visit
            const pageVisit = {
                page: page,
                enterTime: currentTime,
                exitTime: null
            };
            stats.currentSession.pageVisits.push(pageVisit);

            localStorage.setItem('pageStats', JSON.stringify(stats));
        } catch (error) {
            console.error('Failed to track page:', error);
        }
    },

    loadMockData() {
        const currentTime = new Date();
        const mockData = {
            ispStats: {},
            currentSession: {
                id: Date.now(),
                startTime: currentTime.toISOString(),
                pageVisits: [
                    {
                        page: '/stats.html',
                        enterTime: currentTime.toISOString(),
                        exitTime: null
                    }
                ],
                cardInteractions: [],
                games: []
            },
            cardStats: {
                totalGames: 25,
                averageScore: 85,
                timePlayed: 180,
                performance: [
                    { date: new Date(currentTime - 6 * 24 * 60 * 60 * 1000).toISOString(), score: 75 },
                    { date: new Date(currentTime - 5 * 24 * 60 * 60 * 1000).toISOString(), score: 80 },
                    { date: new Date(currentTime - 4 * 24 * 60 * 60 * 1000).toISOString(), score: 85 },
                    { date: new Date(currentTime - 3 * 24 * 60 * 60 * 1000).toISOString(), score: 90 },
                    { date: new Date(currentTime - 2 * 24 * 60 * 60 * 1000).toISOString(), score: 85 },
                    { date: new Date(currentTime - 1 * 24 * 60 * 60 * 1000).toISOString(), score: 95 }
                ],
                cardHistory: [
                    {
                        time: new Date(currentTime - 30 * 60 * 1000).toISOString(),
                        type: 'answer',
                        details: 'James Bond',
                        result: 'correct',
                        timeSpent: 15
                    },
                    {
                        time: new Date(currentTime - 25 * 60 * 1000).toISOString(),
                        type: 'clue',
                        details: 'Batman Hint',
                        result: 'viewed',
                        timeSpent: 10
                    },
                    {
                        time: new Date(currentTime - 20 * 60 * 1000).toISOString(),
                        type: 'answer',
                        details: 'Batman',
                        result: 'incorrect',
                        timeSpent: 12
                    }
                ],
                cardPerformance: {
                    correct: 85,
                    incorrect: 15
                },
                timePerCardType: {
                    clue: 250,
                    answer: 450,
                    help: 100
                }
            }
        };

        localStorage.setItem('pageStats', JSON.stringify(mockData));
        return this.displayStats();
    },

    displayStats() {
        // First destroy any existing charts
        this.destroyCharts();

        const stats = JSON.parse(localStorage.getItem('pageStats'));
        if (!stats || !stats.cardStats) return Promise.resolve();

        const { cardStats } = stats;

        // Update overview stats
        const totalGamesEl = document.getElementById('totalGames');
        const averageScoreEl = document.getElementById('averageScore');
        const timePlayedEl = document.getElementById('timePlayed');

        if (totalGamesEl) totalGamesEl.textContent = cardStats.totalGames;
        if (averageScoreEl) averageScoreEl.textContent = `${cardStats.averageScore}%`;
        if (timePlayedEl) timePlayedEl.textContent = `${Math.round(cardStats.timePlayed / 60)} minutes`;

        // Performance Chart
        const performanceCanvas = document.getElementById('performanceChart');
        if (performanceCanvas) {
            const ctx = performanceCanvas.getContext('2d');
            this.charts.performance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: cardStats.performance.map(p => new Date(p.date).toLocaleDateString()),
                    datasets: [{
                        label: 'Score Progress',
                        data: cardStats.performance.map(p => p.score),
                        borderColor: '#4a90e2',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Performance Over Time'
                        }
                    }
                }
            });
        }

        // Card Performance Chart
        const cardPerfCanvas = document.getElementById('cardPerformanceChart');
        if (cardPerfCanvas) {
            const cardPerfCtx = cardPerfCanvas.getContext('2d');
            this.charts.cardPerformance = new Chart(cardPerfCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Correct', 'Incorrect'],
                    datasets: [{
                        data: [cardStats.cardPerformance.correct, cardStats.cardPerformance.incorrect],
                        backgroundColor: ['#28a745', '#dc3545']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }

        // Time per Card Type Chart
        const timePerCardCanvas = document.getElementById('timePerCardChart');
        if (timePerCardCanvas) {
            const timePerCardCtx = timePerCardCanvas.getContext('2d');
            this.charts.timePerCard = new Chart(timePerCardCtx, {
                type: 'bar',
                data: {
                    labels: Object.keys(cardStats.timePerCardType),
                    datasets: [{
                        label: 'Minutes Spent',
                        data: Object.values(cardStats.timePerCardType).map(t => Math.round(t / 60)),
                        backgroundColor: '#4a90e2'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }

        // Card History Table
        const tableBody = document.querySelector('#cardHistoryTable tbody');
        if (tableBody && cardStats.cardHistory) {
            tableBody.innerHTML = cardStats.cardHistory.map(card => `
                <tr>
                    <td>${new Date(card.time).toLocaleString()}</td>
                    <td>${card.type}</td>
                    <td>${card.details}</td>
                    <td class="${card.result === 'correct' ? 'correct' : card.result === 'incorrect' ? 'incorrect' : ''}">${card.result}</td>
                </tr>
            `).join('');
        }

        return Promise.resolve();
    },

    trackCardInteraction(type, data) {
        const stats = JSON.parse(localStorage.getItem('pageStats'));
        if (!stats.cardStats) stats.cardStats = {};
        if (!stats.cardStats.cardHistory) stats.cardStats.cardHistory = [];

        stats.cardStats.cardHistory.unshift({
            time: new Date().toISOString(),
            type,
            details: data.details || '',
            result: data.result || 'viewed',
            timeSpent: data.timeSpent || 0
        });

        // Keep only last 50 interactions
        stats.cardStats.cardHistory = stats.cardStats.cardHistory.slice(0, 50);

        localStorage.setItem('pageStats', JSON.stringify(stats));
    },

    showLoginModal() {
        // Create modal elements
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            width: 300px;
        `;

        const title = document.createElement('h2');
        title.textContent = 'Admin Login';
        title.style.cssText = `
            margin: 0 0 20px 0;
            color: #333;
            text-align: center;
            font-size: 20px;
        `;

        const errorMessage = document.createElement('div');
        errorMessage.style.cssText = `
            color: #dc3545;
            margin: 10px 0;
            text-align: center;
            display: none;
            font-size: 14px;
        `;
        errorMessage.textContent = 'Invalid username or password';

        const emailInput = document.createElement('input');
        emailInput.type = 'email';
        emailInput.placeholder = 'Enter your email';
        emailInput.style.cssText = `
            width: 100%;
            padding: 8px;
            margin: 10px 0;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
            font-size: 14px;
        `;

        const passwordContainer = document.createElement('div');
        passwordContainer.style.cssText = `
            position: relative;
            width: 100%;
            margin: 10px 0;
        `;

        const passwordInput = document.createElement('input');
        passwordInput.type = 'password';
        passwordInput.placeholder = 'Enter your password';
        passwordInput.style.cssText = `
            width: 100%;
            padding: 8px;
            padding-right: 35px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
            font-size: 14px;
        `;

        const eyeIcon = document.createElement('div');
        eyeIcon.innerHTML = '&#128065;';
        eyeIcon.style.cssText = `
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            user-select: none;
            opacity: 0.5;
            transition: opacity 0.3s;
        `;
        eyeIcon.onmouseover = () => eyeIcon.style.opacity = '1';
        eyeIcon.onmouseout = () => eyeIcon.style.opacity = '0.5';
        
        let passwordVisible = false;
        eyeIcon.onclick = () => {
            passwordVisible = !passwordVisible;
            passwordInput.type = passwordVisible ? 'text' : 'password';
            eyeIcon.innerHTML = passwordVisible ? '&#128064;' : '&#128065;';
            eyeIcon.style.opacity = passwordVisible ? '1' : '0.5';
        };

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        `;

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Login';
        submitButton.style.cssText = `
            padding: 8px 16px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            flex: 1;
            margin-right: 10px;
            transition: background 0.3s;
        `;

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.style.cssText = `
            padding: 8px 16px;
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            flex: 1;
            transition: background 0.3s;
        `;

        modalContent.appendChild(title);
        modalContent.appendChild(errorMessage);
        modalContent.appendChild(emailInput);
        passwordContainer.appendChild(passwordInput);
        passwordContainer.appendChild(eyeIcon);
        modalContent.appendChild(passwordContainer);
        buttonContainer.appendChild(submitButton);
        buttonContainer.appendChild(cancelButton);
        modalContent.appendChild(buttonContainer);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Focus the email input
        emailInput.focus();

        const cleanup = () => {
            document.body.removeChild(modal);
        };

        const handleLogin = () => {
            // For testing purposes, use a simple credential check
            // In production, this should be replaced with proper authentication
            if (emailInput.value === 'admin@doubleact.com.au' && passwordInput.value === 'admin123') {
                cleanup();
                // Store login state in localStorage
                localStorage.setItem('statsLoggedIn', 'true');
                localStorage.setItem('statsUsername', emailInput.value);
                // Open stats page in new tab
                window.open('/stats.html', '_blank');
            } else {
                errorMessage.style.display = 'block';
                emailInput.focus();
            }
        };

        // Event listeners
        submitButton.onclick = handleLogin;
        cancelButton.onclick = cleanup;

        const handleKeyPress = (e) => {
            if (e.key === 'Enter') {
                handleLogin();
            } else if (e.key === 'Escape') {
                cleanup();
            }
        };
        emailInput.onkeyup = handleKeyPress;
        passwordInput.onkeyup = handleKeyPress;

        // Close if clicking outside
        modal.onclick = (e) => {
            if (e.target === modal) {
                cleanup();
            }
        };

        // Hover effects
        submitButton.onmouseover = () => submitButton.style.background = '#0056b3';
        submitButton.onmouseout = () => submitButton.style.background = '#007bff';
        cancelButton.onmouseover = () => cancelButton.style.background = '#5a6268';
        cancelButton.onmouseout = () => cancelButton.style.background = '#6c757d';
    }
};

// Initialize stats
Stats.init();

// Track current page view
Stats.trackPage(window.location.pathname);

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 's') {
        Stats.showLoginModal();
    }
});
