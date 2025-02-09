// Import analytics
import { analytics } from './Analytics.js';

// Initialize charts and modals
let singlePlayerChart, multiplayerChart, playerCountChart, correctAnswersChart, wrongAnswersChart, gameModeChart, deckSelectionChart, answerPerformanceChart;
let answerDetailsModal;

const chartPeriods = {
    singlePlayer: 'daily',
    multiplayer: 'daily',
    playerCount: 'daily'
};

// Initialize all charts
function initializeCharts() {
    // Initialize single player deck selection chart
    const singlePlayerCtx = document.getElementById('singlePlayerChart').getContext('2d');
    singlePlayerChart = new Chart(singlePlayerCtx, {
        type: 'pie',
        data: {
            labels: ['Movies & Movies', 'Movies & TV', 'TV & TV', 'Real Life Characters', 'Comic Book Characters', 'All'],
            datasets: [{
                data: [0, 0, 0, 0, 0, 0],
                backgroundColor: ['#36A2EB', '#FFA500', '#9966FF', '#4BC0C0', '#FF6384', '#FFCE56']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Initialize multiplayer deck selection chart
    const multiplayerCtx = document.getElementById('multiplayerChart').getContext('2d');
    multiplayerChart = new Chart(multiplayerCtx, {
        type: 'pie',
        data: {
            labels: ['Movies & Movies', 'Movies & TV', 'TV & TV', 'Real Life Characters', 'Comic Book Characters', 'All'],
            datasets: [{
                data: [0, 0, 0, 0, 0, 0],
                backgroundColor: ['#36A2EB', '#FFA500', '#9966FF', '#4BC0C0', '#FF6384', '#FFCE56']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Initialize player count distribution chart
    const playerCountCtx = document.getElementById('playerCountChart').getContext('2d');
    playerCountChart = new Chart(playerCountCtx, {
        type: 'bar',
        data: {
            labels: ['2 Players', '3 Players', '4+ Players'],
            datasets: [{
                label: 'Number of Games',
                data: [0, 0, 0],
                backgroundColor: '#4BC0C0'
            }]
        }
    });

    // Initialize correct answers chart
    const correctAnswersCtx = document.getElementById('correctAnswersChart').getContext('2d');
    correctAnswersChart = new Chart(correctAnswersCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: '#4BC0C0'
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Initialize wrong answers chart
    const wrongAnswersCtx = document.getElementById('wrongAnswersChart').getContext('2d');
    wrongAnswersChart = new Chart(wrongAnswersCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: '#FF6384'
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Game Mode Distribution Chart
    const gameModeCtx = document.getElementById('gameModeChart').getContext('2d');
    gameModeChart = new Chart(gameModeCtx, {
        type: 'pie',
        data: {
            labels: ['Single Player', 'Multiplayer'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#FF6384', '#36A2EB']
            }]
        }
    });

    // Deck Selection Chart
    const deckSelectionCtx = document.getElementById('deckSelectionChart').getContext('2d');
    deckSelectionChart = new Chart(deckSelectionCtx, {
        type: 'bar',
        data: {
            labels: ['Deck 1', 'Deck 2', 'Deck 3', 'Deck 4', 'Deck 5'],
            datasets: [{
                label: 'Times Selected',
                data: [0, 0, 0, 0, 0],
                backgroundColor: '#FFCE56'
            }]
        }
    });

    // Answer Performance Chart
    const answerPerformanceCtx = document.getElementById('answerPerformanceChart').getContext('2d');
    answerPerformanceChart = new Chart(answerPerformanceCtx, {
        type: 'line',
        data: {
            labels: [], // Will be populated with dates
            datasets: [{
                label: 'Correct Answers',
                data: [],
                borderColor: '#36A2EB',
                fill: false
            }, {
                label: 'Wrong Answers',
                data: [],
                borderColor: '#FF6384',
                fill: false
            }]
        }
    });
}

function getDeckTypeColors(deckType) {
    const colors = {
        'all': {
            bg: 'rgba(255, 193, 7, 0.5)',  // Yellow
            border: 'rgb(255, 193, 7)'
        },
        '1': {
            bg: 'rgba(13, 110, 253, 0.5)',  // Blue
            border: 'rgb(13, 110, 253)'
        },
        '2': {
            bg: 'rgba(255, 123, 0, 0.5)',  // Orange
            border: 'rgb(255, 123, 0)'
        },
        '3': {
            bg: 'rgba(111, 66, 193, 0.5)',  // Purple
            border: 'rgb(111, 66, 193)'
        },
        '4': {
            bg: 'rgba(25, 135, 84, 0.5)',  // Green
            border: 'rgb(25, 135, 84)'
        },
        '5': {
            bg: 'rgba(220, 53, 69, 0.5)',  // Red
            border: 'rgb(220, 53, 69)'
        }
    };
    return colors[deckType] || colors['all'];
}

function getVisitorsForAnswer(pair, isCorrect) {
    const visitors = analytics.getVisitorJourneys();
    const matchingVisitors = [];

    visitors.forEach(visitor => {
        visitor.journey.forEach(step => {
            if (step.step === 'clue_card' && 
                step.pair === pair && 
                step.answer.correct === isCorrect) {
                // Only add visitor once
                if (!matchingVisitors.find(v => v.id === visitor.id)) {
                    matchingVisitors.push({
                        id: visitor.id,
                        ipAddress: visitor.ipAddress,
                        timestamp: step.timestamp,
                        step: step
                    });
                }
            }
        });
    });

    return matchingVisitors;
}

function filterVisitorsByDate(visitors, dateFilter) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(today.getMonth() - 1);

    return visitors.filter(visitor => {
        const visitDate = new Date(visitor.timestamp);
        switch(dateFilter) {
            case 'today':
                return visitDate >= today;
            case 'week':
                return visitDate >= weekAgo;
            case 'month':
                return visitDate >= monthAgo;
            default:
                return true;
        }
    });
}

function calculateStats(visitors) {
    let totalTime = 0;
    let infoUsedCount = 0;

    visitors.forEach(visitor => {
        const step = visitor.step;
        if (step.answer) {
            totalTime += step.answer.timeSpent;
            if (step.answer.usedInfo) {
                infoUsedCount++;
            }
        }
    });

    return {
        totalPlayers: visitors.length,
        averageTime: visitors.length ? Math.round(totalTime / visitors.length / 1000) : 0,
        infoUsedPercent: visitors.length ? Math.round((infoUsedCount / visitors.length) * 100) : 0
    };
}

function updateAnswerDetailsModal(visitors) {
    const stats = calculateStats(visitors);
    
    // Update stats
    document.getElementById('totalPlayers').textContent = stats.totalPlayers;
    document.getElementById('averageTime').textContent = `${stats.averageTime}s`;
    document.getElementById('infoUsed').textContent = `${stats.infoUsedPercent}%`;
    
    // Update table
    const tbody = document.getElementById('answerDetailsList');
    const date = new Date(visitors[0].timestamp);
    tbody.innerHTML = visitors.map(visitor => {
        const date = new Date(visitor.timestamp);
        return `
            <tr>
                <td>${visitor.ipAddress}</td>
                <td>${date.toLocaleDateString()}</td>
                <td>${date.toLocaleTimeString()}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="window.showJourney('${visitor.id}')">
                        View Journey
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function showAnswerDetails(pair, isCorrect) {
    const modalTitle = document.querySelector('#answerDetailsModal .modal-title');
    const visitors = getVisitorsForAnswer(pair, isCorrect);
    let currentVisitors = visitors;
    
    modalTitle.textContent = `${pair} - ${isCorrect ? 'Correct' : 'Wrong'} Answers`;
    
    // Add event listeners for date filter buttons
    document.querySelectorAll('#answerDetailsModal .date-filter button').forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            document.querySelectorAll('#answerDetailsModal .date-filter button').forEach(btn => 
                btn.classList.remove('active')
            );
            this.classList.add('active');
            
            // Filter visitors and update display
            currentVisitors = filterVisitorsByDate(visitors, this.dataset.date);
            updateAnswerDetailsModal(currentVisitors);
        });
    });
    
    // Initial display with all visitors
    updateAnswerDetailsModal(currentVisitors);
    answerDetailsModal.show();
}

function setupChartClickEvents() {
    if (correctAnswersChart) {
        document.getElementById('correctAnswersChart').onclick = (evt) => {
            const points = correctAnswersChart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);
            if (points.length) {
                const firstPoint = points[0];
                const label = correctAnswersChart.data.labels[firstPoint.index];
                showAnswerDetails(label, true);
            }
        };
    }

    if (wrongAnswersChart) {
        document.getElementById('wrongAnswersChart').onclick = (evt) => {
            const points = wrongAnswersChart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);
            if (points.length) {
                const firstPoint = points[0];
                const label = wrongAnswersChart.data.labels[firstPoint.index];
                showAnswerDetails(label, false);
            }
        };
    }
}

async function updateAnswerCharts(deckType = 'all') {
    try {
        const data = await analytics.getAnswerStats(deckType);
        
        // Update correct answers chart
        if (correctAnswersChart) {
            correctAnswersChart.data.labels = data.mostCorrect.map(item => item.clueId);
            correctAnswersChart.data.datasets[0].data = data.mostCorrect.map(item => item.count);
            correctAnswersChart.update();
        }
        
        // Update wrong answers chart
        if (wrongAnswersChart) {
            wrongAnswersChart.data.labels = data.mostWrong.map(item => item.clueId);
            wrongAnswersChart.data.datasets[0].data = data.mostWrong.map(item => item.count);
            wrongAnswersChart.update();
        }
    } catch (error) {
        console.error('Error updating answer charts:', error);
    }
}

async function updateVisitorTable() {
    try {
        const journeys = await analytics.getVisitorJourneys();
        if (!Array.isArray(journeys)) {
            console.error('Expected array of journeys but got:', journeys);
            return;
        }
        
        const tbody = document.querySelector('#visitorTable tbody');
        tbody.innerHTML = '';
        
        journeys.forEach(journey => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${journey.ipAddress || 'Unknown'}</td>
                <td>${new Date(journey.timestamp).toLocaleString()}</td>
                <td>${journey.gameMode}</td>
                <td>${Array.isArray(journey.deckTypes) ? journey.deckTypes.join(', ') : 'N/A'}</td>
                <td>
                    <button class="btn btn-sm btn-primary view-journey" data-journey-id="${journey.id}">
                        View Journey
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        // Add event listeners to view journey buttons
        document.querySelectorAll('.view-journey').forEach(button => {
            button.addEventListener('click', () => {
                const journeyId = button.dataset.journeyId;
                const journey = journeys.find(j => j.id === journeyId);
                if (journey) {
                    showJourneyModal(journey);
                }
            });
        });
    } catch (error) {
        console.error('Error updating visitor table:', error);
    }
}

async function updateVisitorStats() {
    try {
        const stats = await analytics.getVisitorStats();
        
        // Update the stats in the UI
        document.getElementById('totalVisitors').textContent = stats.totalVisitors;
        document.getElementById('activeVisitors').textContent = stats.activeVisitors;
    } catch (error) {
        console.error('Error updating visitor stats:', error);
    }
}

// Add event listeners for deck type filters
document.querySelectorAll('.deck-filter').forEach(filter => {
    const chartType = filter.dataset.chart;
    filter.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function() {
            const deckType = this.dataset.deck;
            const buttons = filter.querySelectorAll('button');
            buttons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update only the specific chart
            if (chartType === 'correctAnswers') {
                updateAnswerCharts(deckType);
            } else if (chartType === 'wrongAnswers') {
                updateAnswerCharts(deckType);
            }
        });
    });
});

window.showJourney = function(visitorId) {
    const visitor = analytics.getVisitorJourneys().find(v => v.id === visitorId);
    if (!visitor) return;

    // Get deck type from visitor
    const deckType = visitor.deckTypes[0]?.replace('Type ', '') || 'all';
    const colors = getDeckTypeColors(deckType);

    // Get modal instance
    const modalElement = document.getElementById('journeyModal');
    const journeyModal = new bootstrap.Modal(modalElement);
    const journeyDetails = document.getElementById('journeyDetails');

    // Create journey timeline HTML
    const journeyHtml = `
        <div class="journey-header mb-4">
            <h6 class="mb-2">Visitor from ${visitor.label}</h6>
            <small class="text-muted d-block">IP Address: ${visitor.ipAddress}</small>
            <small class="text-muted d-block">Session started: ${new Date(visitor.timestamp).toLocaleString()}</small>
        </div>
        <div class="journey-timeline">
            ${visitor.journey.map((step, index) => {
                let stepHtml = `
                    <div class="journey-step mb-4">
                        <div class="d-flex align-items-center mb-2">
                            <div class="step-number me-3">
                                <span class="badge rounded-circle" style="background-color: ${colors.border}">${index + 1}</span>
                            </div>
                            <div class="step-content">
                                <h6 class="mb-1" style="color: ${colors.border}">${step.step === 'clue_card' ? `Clue Card #${step.cardNumber}` : step.step.replace('_', ' ').toUpperCase()}</h6>
                                <small class="text-muted">${new Date(step.timestamp).toLocaleTimeString()}</small>
                            </div>
                        </div>
                        <div class="step-details ms-5 ps-2 border-start">`;

                if (step.step === 'clue_card') {
                    const answer = step.answer;
                    stepHtml += `
                        <div class="card">
                            <div class="card-body">
                                <h6 class="card-title">Clue: ${step.pair}</h6>
                                <div class="mt-3">
                                    <span class="status-badge ${answer.correct ? 'correct' : 'wrong'}">
                                        ${answer.correct ? 'Correct' : 'Wrong'}
                                    </span>
                                    ${answer.usedInfo ? `
                                        <span class="status-badge info">Info</span>
                                    ` : ''}
                                </div>
                                <div class="mt-2">
                                    <small class="text-muted">
                                        Player ${answer.player}
                                    </small>
                                </div>
                                <div class="mt-1">
                                    <small class="text-muted">
                                        Time Spent: ${Math.round(answer.timeSpent / 1000)}s
                                    </small>
                                </div>
                            </div>
                        </div>`;
                } else {
                    stepHtml += `<p class="mb-0">${step.details}</p>`;
                }

                stepHtml += `
                        </div>
                    </div>`;
                return stepHtml;
            }).join('')}
        </div>
    `;

    journeyDetails.innerHTML = journeyHtml;
    journeyModal.show();
};

async function testConnection() {
    try {
        // Add test data
        const response = await fetch('http://localhost:3001/api/analytics/test/add-sample-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        
        if (data.success) {
            alert('Test data added successfully! Refreshing charts...');
            // Refresh all charts and tables
            updateCharts('daily');
            updateAnswerCharts();
            updateVisitorTable();
        } else {
            alert('Failed to add test data: ' + data.error);
        }
    } catch (error) {
        alert('Error testing connection: ' + error.message);
    }
}

// Make testConnection available globally
window.testConnection = testConnection;

async function updateCharts(period = 'daily') {
    try {
        const data = await analytics.getGameStats(period);
        
        // Update single player chart
        if (singlePlayerChart) {
            singlePlayerChart.data.datasets[0].data = [
                data.singlePlayer.type1,
                data.singlePlayer.type2,
                data.singlePlayer.type3,
                data.singlePlayer.type4,
                data.singlePlayer.type5,
                data.singlePlayer.all
            ];
            singlePlayerChart.update();
        }
        
        // Update multiplayer chart
        if (multiplayerChart) {
            multiplayerChart.data.datasets[0].data = [
                data.multiplayer.type1,
                data.multiplayer.type2,
                data.multiplayer.type3,
                data.multiplayer.type4,
                data.multiplayer.type5,
                data.multiplayer.all
            ];
            multiplayerChart.update();
        }
        
        // Update player count chart
        if (playerCountChart) {
            playerCountChart.data.datasets[0].data = [
                data.playerCount.two,
                data.playerCount.three,
                data.playerCount.four,
                data.playerCount.five,
                data.playerCount.six,
                data.playerCount.seven,
                data.playerCount.eight,
                data.playerCount.nine,
                data.playerCount.ten
            ];
            playerCountChart.update();
        }
    } catch (error) {
        console.error('Error updating charts:', error);
    }
}

// Add event listeners for time filters
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize answer details modal
        answerDetailsModal = new bootstrap.Modal(document.getElementById('answerDetailsModal'));
        
        // Add test connection button listener
        document.getElementById('testConnectionBtn').addEventListener('click', testConnection);
        
        // Initialize charts first
        initializeCharts();
        
        // Then update all data
        await Promise.all([
            updateVisitorStats(),
            updateAnswerCharts(),
            updateVisitorTable()
        ]);
        
        // Set up refresh interval
        setInterval(async () => {
            await Promise.all([
                updateVisitorStats(),
                updateAnswerCharts(),
                updateVisitorTable()
            ]);
        }, 30000); // Refresh every 30 seconds
    } catch (error) {
        console.error('Error initializing dashboard:', error);
    }
});

// Set up time filter event listeners
document.querySelectorAll('.time-filter').forEach(filter => {
    const chartType = filter.dataset.chart;
    filter.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons in this filter
            filter.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            // Update charts with selected period
            const period = button.dataset.period;
            if (chartType) {
                chartPeriods[chartType] = period;
            }
            updateCharts(period);
        });
    });
});

// Set up deck filter event listeners
document.querySelectorAll('.deck-filter button').forEach(button => {
    button.addEventListener('click', () => {
        const deckType = button.dataset.deck;
        const chartType = button.closest('.deck-filter').dataset.chart;
        
        // Remove active class from all buttons in this filter
        button.closest('.deck-filter').querySelectorAll('button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Update the appropriate chart
        if (chartType === 'correctAnswers') {
            updateAnswerCharts(deckType);
        } else if (chartType === 'wrongAnswers') {
            updateAnswerCharts(deckType);
        }
    });
});

// Set up date filter event listeners for visitor table
document.querySelectorAll('#visitorTable .date-filter button').forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        document.querySelectorAll('#visitorTable .date-filter button').forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        // Update visitor table with selected date filter
        updateVisitorTable(button.dataset.date);
    });
});

// Update dashboard data
async function updateDashboard() {
    try {
        const [gameStats, answerStats, playerStats] = await Promise.all([
            analytics.getGameStats(),
            analytics.getAnswerStats(),
            analytics.getPlayerStats()
        ]);

        // Update overview cards
        document.getElementById('totalGames').textContent = gameStats.totalGames;
        document.getElementById('activeGames').textContent = gameStats.activeGames;
        document.getElementById('totalPlayers').textContent = playerStats.totalPlayers;

        // Update game mode chart
        gameModeChart.data.datasets[0].data = [
            gameStats.singlePlayerGames,
            gameStats.multiplayerGames
        ];
        gameModeChart.update();

        // Update player count chart
        playerCountChart.data.datasets[0].data = [
            playerStats.twoPlayers,
            playerStats.threePlayers,
            playerStats.fourPlusPlayers
        ];
        playerCountChart.update();

        // Update deck selection chart
        deckSelectionChart.data.datasets[0].data = gameStats.deckSelections;
        deckSelectionChart.update();

        // Update answer performance chart
        answerPerformanceChart.data.labels = answerStats.dates;
        answerPerformanceChart.data.datasets[0].data = answerStats.correctAnswers;
        answerPerformanceChart.data.datasets[1].data = answerStats.wrongAnswers;
        answerPerformanceChart.update();

        // Update recent activity table
        updateRecentActivity(gameStats.recentGames);
    } catch (error) {
        console.error('Error updating dashboard:', error);
    }
}

// Update recent activity table
function updateRecentActivity(recentGames) {
    const tbody = document.querySelector('#recentActivityTable tbody');
    tbody.innerHTML = '';

    recentGames.forEach(game => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(game.startTime).toLocaleString()}</td>
            <td>${game.gameMode === 'single_player' ? 'Single Player' : 'Multiplayer'}</td>
            <td>${game.playerCount}</td>
            <td>${game.deckTypes.join(', ')}</td>
            <td>${game.score || 'N/A'}</td>
            <td>${game.totalTime ? Math.round(game.totalTime / 1000) + 's' : 'N/A'}</td>
        `;
        tbody.appendChild(row);
    });
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    updateDashboard();

    // Refresh data every 30 seconds
    setInterval(updateDashboard, 30000);
});
