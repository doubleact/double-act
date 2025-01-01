import { cardDataType1 } from './carddatatype1.js';
import { cardDataType2 } from './carddatatype2.js';
import { cardDataType3 } from './carddatatype3.js';
import { cardDataType4 } from './carddatatype4.js';
import { cardDataType5 } from './carddatatype5.js';

// Debug logging for imported data
console.log('cardDataType1:', cardDataType1);
console.log('cardDataType2:', cardDataType2);
console.log('cardDataType3:', cardDataType3);
console.log('cardDataType4:', cardDataType4);
console.log('cardDataType5:', cardDataType5);

console.log('Imported card types:', {
    type1: cardDataType1.length,
    type2: cardDataType2.length,
    type3: cardDataType3.length,
    type4: cardDataType4.length,
    type5: cardDataType5.length
});

const cardData = [
    ...cardDataType1,
    ...cardDataType2,
    ...cardDataType3,
    ...cardDataType4,
    ...cardDataType5
];

console.log('Total cards:', cardData.length);

class DoubleActGame {
    constructor() {
        console.log('Initializing game...');
        // Initialize cards without duplicates
        const allCards = [...new Set([...cardData, ...cardDataType2, ...cardDataType3, ...cardDataType4, ...cardDataType5])];
        this.cards = allCards;
        this.currentCardIndex = -1;
        this.score = 0;
        this.passedAnswers = 0;
        this.isMultiplayer = false;
        this.numberOfPlayers = 0;
        this.currentPlayer = 1;
        this.playerScores = [];
        this.disableNavigation = false;
        
        console.log('Setting up event listeners...');
        this.setupEventListeners();
        console.log('Showing start card...');
        this.showStartCard();
    }

    shuffleCards() {
        console.log('Shuffling cards...');
        // Fisher-Yates shuffle algorithm
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        // Keyboard controls
        document.addEventListener('keyup', (e) => {
            console.log('Key pressed:', e.key);
            
            // If navigation is disabled (during score card), ignore all inputs
            if (this.disableNavigation) {
                return;
            }

            // Don't allow controls on start screen or mode selection
            if (this.isStartScreen() || this.isModeSelection()) {
                return;
            }

            const card = document.getElementById('currentCard');
            const isShowingAnswer = card.classList.contains('flipped');
            const isShowingRules = card.classList.contains('rules-flipped');

            // Handle player selection screen separately
            if (this.isPlayerSelection()) {
                if (e.key === 'ArrowRight') {
                    this.showModeSelection();
                }
                return;
            }

            if (isShowingAnswer) {
                // Only allow up arrow to toggle back when showing answer
                if (e.key === 'ArrowUp') {
                    this.toggleAnswer();
                }
                return;
            }

            if (isShowingRules) {
                // Only allow down arrow to exit rules
                if (e.key === 'ArrowDown') {
                    this.exitRules();
                }
                return;
            }

            this.handleKeyPress(e);
        });

        // Touch controls using Hammer.js
        const card = document.getElementById('currentCard');
        const hammer = new Hammer(card);
        hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

        hammer.on('swipe', (e) => {
            console.log('Swipe detected:', e.type);
            
            // If navigation is disabled (during score card), ignore all inputs
            if (this.disableNavigation) {
                return;
            }

            // Don't allow controls on start screen or mode selection
            if (this.isStartScreen() || this.isModeSelection()) {
                return;
            }

            // Handle player selection screen separately
            if (this.isPlayerSelection()) {
                if (e.direction === Hammer.DIRECTION_RIGHT) {
                    this.showModeSelection();
                }
                return;
            }

            const isShowingAnswer = card.classList.contains('flipped');
            const isShowingRules = card.classList.contains('rules-flipped');

            if (isShowingAnswer) {
                // Only allow up swipe to toggle back when showing answer
                if (e.direction === Hammer.DIRECTION_UP) {
                    this.toggleAnswer();
                }
                return;
            }

            if (isShowingRules) {
                // Only allow swipe down to exit rules
                if (e.direction === Hammer.DIRECTION_DOWN) {
                    this.exitRules();
                }
                return;
            }

            switch(e.direction) {
                case Hammer.DIRECTION_UP:
                    this.toggleAnswer();
                    break;
                case Hammer.DIRECTION_LEFT:
                    this.nextCard();
                    break;
                case Hammer.DIRECTION_RIGHT:
                    this.previousCard();
                    break;
                case Hammer.DIRECTION_DOWN:
                    this.showRules();
                    break;
            }
        });

        // Double tap to show answer (only during gameplay)
        hammer.on('doubletap', () => {
            console.log('Double tap detected');
            // Ignore double tap if navigation is disabled
            if (this.disableNavigation) {
                return;
            }
            if (!this.isStartScreen() && !this.isModeSelection() && !this.isPlayerSelection()) {
                const isShowingRules = card.classList.contains('rules-flipped');
                if (!isShowingRules) {
                    this.toggleAnswer();
                }
            }
        });
    }

    handleKeyPress(event) {
        if (this.disableNavigation) return;

        switch(event.key) {
            case 'ArrowUp':
                this.toggleAnswer();
                break;
            case 'ArrowLeft':
                if (document.querySelector('.front').classList.contains('start-card')) {
                    this.showModeSelection();
                } else {
                    this.previousCard();
                }
                break;
            case 'ArrowRight':
                this.nextCard();
                break;
            case 'ArrowDown':
                this.showRules();
                break;
        }
    }

    // Helper methods to check current screen
    isStartScreen() {
        return this.currentCardIndex === -1;
    }

    isModeSelection() {
        const front = document.querySelector('.front');
        return front.innerHTML.includes('One Player') && front.innerHTML.includes('Multiplayer');
    }

    isPlayerSelection() {
        const front = document.querySelector('.front');
        return front.innerHTML.includes('Number of Players');
    }

    showStartCard() {
        console.log('Showing start card...');
        const card = document.getElementById('currentCard');
        const front = card.querySelector('.front');
        front.className = 'front start-card';
        front.innerHTML = `
            <div class="card-content">
                <div class="logo-container">
                    <img src="images/doubleactlogo.png" alt="Double Act" class="logo-large">
                </div>
                <div class="button-container">
                    <button onclick="game.showModeSelection()" class="green-button">Next</button>
                </div>
            </div>
        `;
    }

    showModeSelection() {
        console.log('Showing mode selection...');
        const card = document.getElementById('currentCard');
        const front = card.querySelector('.front');
        front.className = 'front start-card';
        front.innerHTML = `
            <div class="card-content">
                <div class="logo-container">
                    <img src="images/doubleactlogo.png" alt="Double Act" class="logo-small">
                </div>
                <div class="main-content">
                    <div class="mode-selection-container">
                        <button onclick="game.startSinglePlayer()" class="green-button">Single Player</button>
                        <button onclick="game.showPlayerSelection()" class="green-button">Multiplayer</button>
                    </div>
                </div>
            </div>
        `;
    }

    showPlayerSelection() {
        console.log('Showing player selection...');
        const card = document.getElementById('currentCard');
        const front = card.querySelector('.front');
        front.className = 'front start-card';
        this.isMultiplayer = true;  // Set multiplayer mode immediately
        
        front.innerHTML = `
            <div class="card-content">
                <div class="logo-container">
                    <img src="images/doubleactlogo.png" alt="Double Act" class="logo-medium">
                </div>
                <div class="number-selection">
                    <h2>Number of Players</h2>
                    <div class="number-grid">
                        <div class="number-row">
                            <button class="number-button" onclick="game.selectPlayerCount(2); game.startGame()">2</button>
                            <button class="number-button" onclick="game.selectPlayerCount(3); game.startGame()">3</button>
                            <button class="number-button" onclick="game.selectPlayerCount(4); game.startGame()">4</button>
                        </div>
                        <div class="number-row">
                            <button class="number-button" onclick="game.selectPlayerCount(5); game.startGame()">5</button>
                            <button class="number-button" onclick="game.selectPlayerCount(6); game.startGame()">6</button>
                            <button class="number-button" onclick="game.selectPlayerCount(7); game.startGame()">7</button>
                        </div>
                        <div class="number-row">
                            <button class="number-button" onclick="game.selectPlayerCount(8); game.startGame()">8</button>
                            <button class="number-button" onclick="game.selectPlayerCount(9); game.startGame()">9</button>
                            <button class="number-button" onclick="game.selectPlayerCount(10); game.startGame()">10</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    selectPlayerCount(count) {
        console.log('Setting player count to:', count);
        this.numberOfPlayers = count;
        this.playerScores = Array(count).fill().map(() => ({ correct: 0, passed: 0 }));
    }

    startSinglePlayer() {
        console.log('Starting single player game...');
        this.isMultiplayer = false;
        this.score = 0;
        this.passedAnswers = 0;
        this.currentCardIndex = 0;
        this.shuffleCards();
        this.disableNavigation = false; // Enable navigation when starting game
        this.showCurrentCard();
    }

    startGame() {
        console.log('Starting game...');
        this.currentCardIndex = 0;
        
        if (this.isMultiplayer) {
            this.currentPlayer = 1;
            this.playerScores = Array(this.numberOfPlayers).fill().map(() => ({
                correct: 0,
                passed: 0
            }));
        } else {
            this.score = 0;
            this.correctAnswers = 0;
            this.passedAnswers = 0;
        }
        
        this.shuffleCards();
        this.disableNavigation = false; // Enable navigation when starting game
        this.showCurrentCard();
    }

    showCurrentCard() {
        console.log('Showing current card...');
        const card = document.getElementById('currentCard');
        card.classList.remove('flipped', 'rules-flipped');
        
        if (this.currentCardIndex >= this.cards.length) {
            this.showEndCard();
            return;
        }

        // Enable navigation when showing a card
        this.disableNavigation = false;

        const currentCard = this.cards[this.currentCardIndex];
        const front = card.querySelector('.front');
        front.className = `front clue-type-${currentCard.type}`;

        // Create the type-specific image HTML
        let typeImages = '';
        switch(currentCard.type) {
            case 1:
                typeImages = '<img src="images/type1.png" class="type-icon" alt="Movie to Movie">';
                break;
            case 2:
                typeImages = '<img src="images/type1.png" class="type-icon" alt="Movie"><img src="images/type3.png" class="type-icon" alt="TV">';
                break;
            case 3:
                typeImages = '<img src="images/type3.png" class="type-icon" alt="TV"><img src="images/type3.png" class="type-icon" alt="TV">';
                break;
            case 4:
                typeImages = '<img src="images/type4.png" class="type-icon" alt="Historical">';
                break;
            case 5:
                typeImages = '<img src="images/type5.png" class="type-icon" alt="Superhero">';
                break;
        }

        const headerContent = this.isMultiplayer ? 
            `<div class="card-info">Player ${this.currentPlayer}'s Turn</div>
             <div class="score" onclick="game.showScoreCard()">Scores</div>` :
            `<div class="card-info">${this.currentCardIndex + 1}/${this.cards.length}</div>
             <div class="score" onclick="game.showSinglePlayerScore()">Score: ${this.score}</div>`;

        front.innerHTML = `
            <div class="card-content">
                <div class="card-header">
                    ${headerContent}
                </div>
                <div class="main-content">
                <br>
                </br>
                    <img src="images/doubleactlogo.png" alt="Double Act" class="logo-small">
                    <div class="clue-text">
                        ${currentCard.actors[0]}
                        <div style="margin: 10px 0;">&</div>
                        ${currentCard.actors[1]}
                    </div>
                    <div class="type-icons">
                        ${typeImages}
                    </div>
                </div>
                <div class="button-container">
                    <button class="pass-button" onclick="game.passCard()">Pass</button>
                </div>
                ${this.isMultiplayer ? `
                <div class="card-counter">
                    ${this.currentCardIndex + 1}/${this.cards.length}
                </div>` : ''}
            </div>
        `;

        const back = card.querySelector('.back');
        back.innerHTML = `
            <div class="card-content">
                <div class="title-container">
                    <div>
                        <div class="character">${currentCard.character}</div>
                        <div class="movies">
                            ${currentCard.movies[0]}
                            <div style="margin: 10px 0;">&</div>
                            ${currentCard.movies[1]}
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="correct-button" onclick="game.correctAnswer()">Correct</button>
                </div>
            </div>
        `;
    }

    showRules() {
        console.log('Showing rules...');
        const card = document.getElementById('currentCard');
        
        // If showing answer, return to front first
        if (card.classList.contains('flipped')) {
            card.classList.remove('flipped');
            setTimeout(() => {
                const back = card.querySelector('.back');
                back.className = 'back rules';
                this.displayRulesContent(back);
                setTimeout(() => {
                    card.classList.add('rules-flipped');
                }, 20);
            }, 200);
            return;
        }
        
        const back = card.querySelector('.back');
        back.className = 'back rules';
        this.displayRulesContent(back);
        setTimeout(() => {
            card.classList.add('rules-flipped');
        }, 20);
    }

    displayRulesContent(backElement) {
        console.log('Displaying rules content...');
        backElement.innerHTML = `
            <div class="card-content">
                <div class="main-content">
                    <h1 style="font-size: 1.5em; margin: 10px 0; text-align: center;">Rules</h1>
                    
                    <div style="color: #6bacfe; margin: 8px 0; text-align: center;">
                        <div style="font-size: 1em; margin-bottom: 0px;">Blue Cards</div>
                        <div style="margin-bottom: 0px; font-size: 0.8em;">Actors who have played the same character in movies</div>
                        <img src="images/type1.png" style="width: 25px; height: 25px;" alt="Movie to Movie">
                    </div>

                    <div style="color: #fe88b1; margin: 8px 0; text-align: center;">
                        <div style="font-size: 1em; margin-bottom: 0px;">Pink Cards</div>
                        <div style="margin-bottom: 0px; font-size: 0.8em;">Actors who have played the same character in movies and TV</div>
                        <div style="display: flex; justify-content: center; gap: 3px;">
                            <img src="images/type1.png" style="width: 25px; height: 25px;" alt="Movie">
                            <img src="images/type3.png" style="width: 25px; height: 25px;" alt="TV">
                        </div>
                    </div>

                    <div style="color: #dcb0f2; margin: 8px 0; text-align: center;">
                        <div style="font-size: 1em; margin-bottom: 0px;">Purple Cards</div>
                        <div style="margin-bottom: 0px; font-size: 0.8em;">Actors who have played the same character in TV shows</div>
                        <div style="display: flex; justify-content: center; gap: 3px;">
                            <img src="images/type3.png" style="width: 25px; height: 25px;" alt="TV">
                            <img src="images/type3.png" style="width: 25px; height: 25px;" alt="TV">
                        </div>
                    </div>

                    <div style="color: #87c55f; margin: 8px 0; text-align: center;">
                        <div style="font-size: 1em; margin-bottom: 0px;">Green Cards</div>
                        <div style="margin-bottom: 0px; font-size: 0.8em;">Actors who have played the same real life figure</div>
                        <img src="images/type4.png" style="width: 25px; height: 25px;" alt="Real Life Figure">
                    </div>

                    <div style="color: #ff7061; margin: 8px 0; text-align: center;">
                        <div style="font-size: 1em; margin-bottom: 0px;">Red Cards</div>
                        <div style="margin-bottom: 0px; font-size: 0.8em;">Actors who have played the same comic book character</div>
                        <img src="images/type5.png" style="width: 25px; height: 25px;" alt="Comic Book Characters">
                    </div>
                </div>
            </div>
        `;
    }

    exitRules() {
        console.log('Exiting rules...');
        const card = document.getElementById('currentCard');
        const back = card.querySelector('.back');
        
        card.classList.remove('rules-flipped');
        setTimeout(() => {
            back.className = 'back';
            setTimeout(() => {
                this.showCurrentCard();
            }, 20);
        }, 200);
    }

    correctAnswer() {
        console.log('Correct answer selected...');
        if (this.isMultiplayer) {
            this.playerScores[this.currentPlayer - 1].correct++;
            const card = document.getElementById('currentCard');
            const back = card.querySelector('.back');
            
            card.classList.remove('flipped');
            setTimeout(() => {
                back.className = 'back';
                this.currentCardIndex++;
                if (this.currentCardIndex >= this.cards.length) {
                    setTimeout(() => {
                        this.showEndCard();
                    }, 20);
                } else {
                    this.currentPlayer = (this.currentPlayer % this.numberOfPlayers) + 1;
                    setTimeout(() => {
                        this.showCurrentCard();
                    }, 20);
                }
            }, 200);
        } else {
            this.score += 10;
            this.correctAnswers++;
            const card = document.getElementById('currentCard');
            const back = card.querySelector('.back');
            
            card.classList.remove('flipped');
            setTimeout(() => {
                back.className = 'back';
                this.currentCardIndex++;
                setTimeout(() => {
                    this.showCurrentCard();
                }, 20);
            }, 200);
        }
    }

    toggleAnswer() {
        console.log('Toggling answer...');
        const card = document.getElementById('currentCard');
        const back = card.querySelector('.back');
        
        if (!card.classList.contains('flipped')) {
            back.className = 'back';
            setTimeout(() => {
                card.classList.add('flipped');
            }, 20);
        } else {
            card.classList.remove('flipped');
        }
    }

    passCard() {
        console.log('Passing card...');
        if (this.isMultiplayer) {
            this.playerScores[this.currentPlayer - 1].passed++;
            this.currentCardIndex++;
            if (this.currentCardIndex >= this.cards.length) {
                this.showEndCard();
            } else {
                this.currentPlayer = (this.currentPlayer % this.numberOfPlayers) + 1;
                this.showCurrentCard();
            }
        } else {
            this.passedAnswers++;
            this.currentCardIndex++;
            this.showCurrentCard();
        }
    }

    previousCard() {
        console.log('Going to previous card...');
        if (this.currentCardIndex > 0) {
            this.currentCardIndex--;
            if (this.isMultiplayer) {
                this.currentPlayer = ((this.currentPlayer - 2 + this.numberOfPlayers) % this.numberOfPlayers) + 1;
            }
            this.showCurrentCard();
        }
    }

    nextCard() {
        console.log('Going to next card...');
        if (this.currentCardIndex < this.cards.length - 1) {
            this.currentCardIndex++;
            if (this.isMultiplayer) {
                this.currentPlayer = (this.currentPlayer % this.numberOfPlayers) + 1;
            }
            this.showCurrentCard();
        }
    }

    showScoreCard() {
        console.log('Showing score card...');
        const card = document.getElementById('currentCard');
        const front = card.querySelector('.front');
        front.className = 'front start-card';
        
        if (this.isMultiplayer) {
            console.log('Number of players:', this.numberOfPlayers);
            console.log('Player scores:', this.playerScores);
            
            const scores = this.playerScores.map((score, index) => `
                <div class="player-score">
                    <h3>Player ${index + 1}</h3>
                    <p>Correct: ${score.correct}</p>
                    <p>Passed: ${score.passed}</p>
                </div>
            `).join('');

            front.innerHTML = `
                <div class="card-content score-card">
                    <h2 class="score-title">Score Card</h2>
                    <div class="scores-content">
                        <div class="score-grid ${this.numberOfPlayers === 2 ? 'players-2' : ''}">
                            ${scores}
                        </div>
                    </div>
                    <div class="button-container">
                        <button onclick="game.returnToGame()" class="green-button">Back To Game</button>
                        <button onclick="game.showEndCard()" class="red-button">End Game</button>
                    </div>
                </div>
            `;
        } else {
            front.innerHTML = `
                <div class="card-content score-card">
                    <h2 class="score-title">Score Card</h2>
                    <div class="scores-content">
                        <div class="player-score">
                            <p>Correct: ${this.score}</p>
                            <p>Passed: ${this.passedAnswers}</p>
                        </div>
                    </div>
                    <div class="button-container">
                        <button onclick="game.returnToGame()" class="green-button">Back To Game</button>
                        <button onclick="game.showEndCard()" class="red-button">End Game</button>
                    </div>
                </div>
            `;
        }
    }

    showSinglePlayerScore() {
        console.log('Showing single player score...');
        const card = document.getElementById('currentCard');
        const front = card.querySelector('.front');
        front.className = 'front start-card';
        
        front.innerHTML = `
            <div class="card-content score-card">
                <h2 class="score-title">Score Card</h2>
                <div class="scores-content">
                    <h3>Player</h3>
                    <div class="player-score">
                        <p>Correct: ${this.score}</p>
                        <p>Passed: ${this.passedAnswers}</p>
                    </div>
                </div>
                <div class="button-container">
                    <button onclick="game.returnToGame()" class="green-button">Back To Game</button>
                    <button onclick="game.showEndCard()" class="red-button">End Game</button>
                </div>
            </div>
        `;

        // Disable all navigation controls
        this.disableNavigation = true;
    }

    returnToGame() {
        this.disableNavigation = false;
        this.showCurrentCard();
    }

    getWinnerText() {
        const maxScore = Math.max(...this.playerScores.map(score => score.correct));
        const winners = this.playerScores
            .map((score, index) => ({ player: index + 1, score: score.correct }))
            .filter(player => player.score === maxScore);

        if (winners.length === 1) {
            return `Winner! Player ${winners[0].player}`;
        } else {
            const winnerText = winners
                .map(w => `Player ${w.player}`)
                .join(winners.length > 2 ? ', ' : ' and ');
            if (winners.length > 2) {
                const lastComma = winnerText.lastIndexOf(',');
                return `Winners! ${winnerText.substring(0, lastComma)} and${winnerText.substring(lastComma + 1)}`;
            }
            return `Winners! ${winnerText}`;
        }
    }

    showEndCard() {
        console.log('Showing end card...');
        const card = document.getElementById('currentCard');
        const front = card.querySelector('.front');
        front.className = 'front start-card';

        if (this.isMultiplayer) {
            console.log('Number of players:', this.numberOfPlayers);
            console.log('Player scores:', this.playerScores);
            
            const scores = this.playerScores.map((score, index) => `
                <div class="player-score">
                    <h3>Player ${index + 1}</h3>
                    <p>Correct: ${score.correct}</p>
                    <p>Passed: ${score.passed}</p>
                </div>
            `).join('');

            front.innerHTML = `
                <div class="card-content end-card">
                    <h2>Game Over</h2>
                    <div class="score-grid ${this.numberOfPlayers === 2 ? 'players-2' : ''}">
                        ${scores}
                    </div>
                    <div class="winner-text">${this.getWinnerText()}</div>
                    <p class="thank-you">Thank you for playing!</p>
                    <div class="button-container">
                        <button onclick="game.showStartCard()" class="green-button" style="width: fit-content">Start New Game</button>
                    </div>
                </div>
            `;
        } else {
            // Single player end card remains unchanged
            front.innerHTML = `
                <div class="card-content end-card">
                    <h2>Game Over</h2>
                    <div class="single-player-end-score">
                        <p>Correct: ${this.score}</p>
                        <p>Passed: ${this.passedAnswers}</p>
                    </div>
                    <p class="thank-you">Thank you for playing!</p>
                    <img src="images/doubleactlogo.png" alt="Double Act" class="logo-medium">
                    <div class="button-container">
                        <button onclick="game.showStartCard()" class="green-button" style="width: fit-content">Start New Game</button>
                    </div>
                </div>
            `;
        }
    }
}

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, creating game...');
    window.game = new DoubleActGame();
});
