import { cardDataType1 } from './carddatatype1.js';
import { cardDataType2 } from './carddatatype2.js';
import { cardDataType3 } from './carddatatype3.js';
import { cardDataType4 } from './carddatatype4.js';
import { cardDataType5 } from './carddatatype5.js';
import { SinglePlayerClueCard } from './js/cards/SinglePlayerClueCard.js';

const cardData = [
    ...cardDataType1,
    ...cardDataType2,
    ...cardDataType3,
    ...cardDataType4,
    ...cardDataType5
];

// Debug logging for imported data
console.log('Total cards:', cardData.length);

// Export the game class
export class DoubleActGame {
    constructor() {
        console.log('Initializing game...');
        // Initialize cards without duplicates
        this.allCards = [...new Set(cardData)];
        this.cards = [...this.allCards]; // Create a copy
        this.shuffleCards(); // Shuffle initial deck
        this.currentCardIndex = -1;
        this.score = 0;
        this.passedAnswers = 0;
        this.isMultiplayer = false;
        this.numberOfPlayers = 0;
        this.currentPlayer = 1;
        this.playerScores = [];
        this.playerCorrectAnswers = [];
        this.playerWrongAnswers = [];
        this.disableNavigation = false;
        this.selectedTypes = new Set();
        this.previousSelections = new Set();
        this.totalPossiblePoints = 0;

        // Add card action event listener for swipe gestures
        const gameContainer = document.getElementById('game-container');
        gameContainer.addEventListener('cardAction', (event) => {
            console.log('Card action received:', event.detail.action);
            if (this.disableNavigation) return;
            
            if (event.detail.action === 'next') {
                this.nextCard();
            } else if (event.detail.action === 'previous') {
                this.previousCard();
            }
        });
    }

    cleanup() {
        // Remove keyboard event listener
        // Removed
    }

    shuffleCards() {
        console.log('Shuffling cards...');
        const array = this.cards;
        let currentIndex = array.length, randomIndex;
        
        // While there remain elements to shuffle
        while (currentIndex != 0) {
            // Pick a remaining element
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            
            // And swap it with the current element
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
    }

    filterCardsByType() {
        console.log('Filtering cards by types:', Array.from(this.selectedTypes));
        
        // Reset cards to all cards before filtering
        this.cards = [...this.allCards];
        
        if (this.selectedTypes.size > 0) {
            // Filter cards to only include selected types
            this.cards = this.cards.filter(card => 
                this.selectedTypes.has(card.type.toString())
            );
        }
        
        console.log('Cards after filtering:', this.cards.length);
        
        // Always shuffle after filtering
        this.shuffleCards();
        
        // Store total possible points
        this.totalPossiblePoints = this.cards.length;
    }

    toggleTypeSelection(type) {
        // Convert type to string for consistent comparison
        const typeStr = type.toString();
        
        // Toggle the type in the set
        if (this.selectedTypes.has(typeStr)) {
            this.selectedTypes.delete(typeStr);
        } else {
            this.selectedTypes.add(typeStr);
        }
        
        // Update the filtered cards immediately when types change
        this.filterCardsByType();
        
        return this.selectedTypes.has(typeStr);
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        const card = document.getElementById('currentCard');
        if (!card) {
            console.log('Card element not found, skipping event listener setup');
            return;
        }

        // Touch controls using Hammer.js
        const hammer = new Hammer(card);
        hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

        hammer.on('swipe', (e) => {
            console.log('Swipe detected:', e.type);
            
            if (this.disableNavigation) {
                return;
            }

            // Handle swipe directions for card navigation
            if (e.direction === Hammer.DIRECTION_LEFT) {
                console.log('Swipe left action');
                this.nextCard();
            } else if (e.direction === Hammer.DIRECTION_RIGHT) {
                console.log('Swipe right action');
                this.previousCard();
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
        // Reset game state
        this.currentCardIndex = -1;
        this.score = 0;
        this.correctAnswers = 0;
        this.passedAnswers = 0;
        this.isMultiplayer = false;
        this.numberOfPlayers = 0;
        this.currentPlayer = 1;
        this.playerScores = [];
        this.playerCorrectAnswers = [];
        this.playerWrongAnswers = [];
        this.cards = this.allCards;

        // Clear the game container
        const gameContainer = document.getElementById('game-container');
        gameContainer.innerHTML = '';

        // Create new base card structure
        gameContainer.innerHTML = `
            <div class="card">
                <div class="front start-card">
                    <div class="card-content">
                        <div class="logo-container">
                            <img src="images/doubleactlogo.png" alt="Double Act" class="logo-large-da">
                        </div>
                        <div class="card-footer">
                            <button onclick="game.showModeSelection()" class="footer-button">Next</button>
                        </div>
                    </div>
                </div>
                <div class="back"></div>
            </div>
        `;

        this.setupEventListeners();
    }

    showModeSelection() {
        console.log('Showing mode selection...');
        const card = document.getElementById('currentCard');
        const front = card.querySelector('.front');
        front.className = 'front start-card';
        front.innerHTML = `
            <div class="card-content">
                <div class="logo-container">
                    <img src="images/doubleactlogo.png" alt="Double Act" class="logo-large-da">
                </div>
                <div class="type-selection-container">
                    <div class="type-option">
                        <img src="images/type1msc.png" alt="Movie to Movie" class="type-icon" data-type="1" title="Movie to Movie (Blue Deck)">
                    </div>
                    <div class="type-option">
                        <img src="images/type1+3.png" alt="Movie to TV" class="type-icon" data-type="2" title="Movie to TV (Pink Deck)">
                    </div>
                    <div class="type-option">
                        <img src="images/type3+3.png" alt="TV to TV" class="type-icon" data-type="3" title="TV to TV (Purple Deck)">
                    </div>
                    <div class="type-option">
                        <img src="images/type4msc.png" alt="Real Life" class="type-icon" data-type="4" title="Real Life (Green Deck)">
                    </div>
                    <div class="type-option">
                        <img src="images/type5msc.png" alt="Comicbook Character" class="type-icon" data-type="5" title="Comicbook Character (Red Deck)">
                    </div>
                </div>
                <div class="mode-selection-container">
                    <button onclick="game.startSinglePlayer()" class="footer-button">Single Player</button>
                    <button onclick="game.showPlayerSelection()" class="footer-button">Multiplayer</button>
                </div>
            </div>
        `;

        // Add click handlers to type icons
        const typeIcons = document.querySelectorAll('.type-icon');
        typeIcons.forEach(icon => {
            icon.addEventListener('click', () => {
                const type = icon.getAttribute('data-type');
                this.handleTypeSelection(type);
            });
        });
    }

    handleTypeSelection(type) {
        const isSelected = this.toggleTypeSelection(type);
        const icon = document.querySelector(`.type-icon[data-type="${type}"]`);
        if (icon) {
            icon.classList.toggle('selected', isSelected);
        }
    }

    showPlayerSelection() {
        console.log('Showing player selection...');
        const card = document.getElementById('currentCard');
        const front = card.querySelector('.front');
        front.className = 'front start-card';
        this.isMultiplayer = true;
        
        front.innerHTML = `
            <div class="card-content">
                <div class="logo-container">
                    <img src="images/doubleactlogo.png" alt="Double Act" class="logo-large-da">
                </div>
                <div class="number-selection">
                    <h2>Number of Players</h2>
                    <div class="player-grid">
                        ${[2,3,4,5,6,7,8,9,10].map(num => `
                            <div class="player-number" data-players="${num}">
                                ${num}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // Add click handlers to type icons
        const typeIcons = front.querySelectorAll('.type-icon');
        typeIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const type = parseInt(icon.dataset.type);
                this.handleTypeSelection(type);
            });
        });

        // Add click handlers to player numbers
        const playerNumbers = front.querySelectorAll('.player-number');
        playerNumbers.forEach(number => {
            number.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const players = parseInt(number.dataset.players);
                this.selectPlayerCount(players);
                this.startMultiplayerGame();
            });
        });

        // Restore selected types visual state
        this.selectedTypes.forEach(type => {
            const icon = front.querySelector(`.type-icon[data-type="${type}"]`);
            if (icon) icon.classList.add('selected');
        });
    }

    selectPlayerCount(count) {
        console.log('Setting player count to:', count);
        this.numberOfPlayers = count;
        this.playerScores = Array(count).fill().map(() => ({ correct: 0, passed: 0 }));
        this.playerCorrectAnswers = Array(count).fill(0);
        this.playerWrongAnswers = Array(count).fill(0);
    }

    startSinglePlayer() {
        console.log('Starting single player game...');
        
        // Filter and shuffle cards
        this.filterCardsByType();
        
        if (this.cards.length === 0) {
            console.error('No cards available for selected types');
            alert('No cards available for the selected types. Please select different types.');
            return;
        }
        
        // Reset game state
        this.currentCardIndex = 0;
        this.isMultiplayer = false;
        this.score = 0;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        
        // Show first card
        const container = document.getElementById('game-container');
        import('./js/cards/SinglePlayerClueCard.js').then(module => {
            new module.SinglePlayerClueCard(
                container,
                this.cards[0],
                1,
                this.cards.length
            );
        });
    }

    startMultiplayerGame() {
        console.log('Starting multiplayer game...');
        
        // Filter and shuffle cards
        this.filterCardsByType();
        
        if (this.cards.length === 0) {
            console.error('No cards available for selected types');
            alert('No cards available for the selected types. Please select different types.');
            return;
        }
        
        // Reset game state
        this.currentCardIndex = 0;
        this.isMultiplayer = true;
        
        // Initialize player scores and stats
        this.playerScores = new Array(this.numberOfPlayers).fill(0);
        this.playerCorrectAnswers = new Array(this.numberOfPlayers).fill(0);
        this.playerWrongAnswers = new Array(this.numberOfPlayers).fill(0);
        this.currentPlayer = 1;
        
        // Show first card
        const container = document.getElementById('game-container');
        import('./js/cards/MultiplayerClueCard.js').then(module => {
            new module.MultiplayerClueCard(
                container,
                this.cards[0],
                1,
                this.cards.length
            );
        });
    }

    startGame() {
        console.log('Starting game...');
        console.log('Selected types before filtering:', Array.from(this.selectedTypes));
        this.shuffleCards();
        console.log('Cards after shuffle:', this.cards);
        this.currentCardIndex = 0;
        
        if (this.isMultiplayer) {
            this.currentPlayer = 1;
            this.playerScores = Array(this.numberOfPlayers).fill().map(() => ({
                correct: 0,
                passed: 0
            }));
            this.playerCorrectAnswers = Array(this.numberOfPlayers).fill(0);
            this.playerWrongAnswers = Array(this.numberOfPlayers).fill(0);
        } else {
            this.score = 0;
            this.correctAnswers = 0;
            this.passedAnswers = 0;
        }
        
        this.filterCardsByType();
        console.log('Filtered cards count:', this.cards.length);
        this.disableNavigation = false;
        this.showCurrentCard();
    }

    showCurrentCard() {
        console.log('Showing current card...');
        if (this.currentCardIndex >= 0 && this.currentCardIndex < this.cards.length) {
            const currentCard = this.cards[this.currentCardIndex];
            console.log('Current card data:', currentCard);
            const container = document.getElementById('game-container');
            
            // Create new clue card with current card data
            new SinglePlayerClueCard(
                container,
                currentCard,
                this.currentCardIndex + 1,
                this.cards.length,
                this.score
            );
        }
    }

    nextCard() {
        if (this.currentCardIndex < this.cards.length - 1) {
            this.currentCardIndex++;
            this.showCurrentCard();
        }
    }

    previousCard() {
        if (this.currentCardIndex > 0) {
            this.currentCardIndex--;
            this.showCurrentCard();
        }
    }

    handleCorrectAnswer() {
        this.score += 10;
        this.nextCard();
    }

    handlePassAnswer() {
        this.passedAnswers++;
        this.nextCard();
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
                    <div style="display: flex; flex-direction: column; width: 100%;">
                        <div class="logo-container" style="margin-top: 40px;">
                            <img src="images/doubleactlogo.png" alt="Double Act" class="logo-medium-da">
                        </div>
                        <h1 style="font-size: 1.5em; text-align: center; margin: 10px 0;">Rules</h1>
                        
                        <div style="display: flex; flex-direction: column; gap: 5px; align-items: center; margin-top: 20px;">
                            <div style="color: #6bacfe; text-align: center; line-height: 1.2;">
                                <div style="font-size: 1em;">Blue Cards</div>
                                <div style="font-size: 0.8em;">Actors who have played the same character in movies</div>
                                <img src="images/type1.png" style="width: 25px; height: 25px;" alt="Movie to Movie">
                            </div>

                            <b></b>

                            <div style="color: #fe88b1; text-align: center; line-height: 1.2;">
                                <div style="font-size: 1em;">Pink Cards</div>
                                <div style="font-size: 0.8em;">Actors who have played the same character in movies and TV</div>
                                <div style="display: flex; justify-content: center; gap: 3px;">
                                    <img src="images/type1.png" style="width: 25px; height: 25px;" alt="Movie">
                                    <img src="images/type3.png" style="width: 25px; height: 25px;" alt="TV">
                                </div>
                            </div>

                            <b></b>

                            <div style="color: #dcb0f2; text-align: center; line-height: 1.2;">
                                <div style="font-size: 1em;">Purple Cards</div>
                                <div style="font-size: 0.8em;">Actors who have played the same character in TV shows</div>
                                <div style="display: flex; justify-content: center; gap: 3px;">
                                    <img src="images/type3.png" style="width: 25px; height: 25px;" alt="TV">
                                    <img src="images/type3.png" style="width: 25px; height: 25px;" alt="TV">
                                </div>
                            </div>

                            <b></b>

                            <div style="color: #87c55f; text-align: center; line-height: 1.2;">
                                <div style="font-size: 1em;">Green Cards</div>
                                <div style="font-size: 0.8em;">Actors who have played the same real life figure</div>
                                <img src="images/type4.png" style="width: 25px; height: 25px;" alt="Real Life Figure">
                            </div>

                            <b></b>

                            <div style="color: #ff7061; text-align: center; line-height: 1.2;">
                                <div style="font-size: 1em;">Red Cards</div>
                                <div style="font-size: 0.8em;">Actors who have played the same comic book character</div>
                                <img src="images/type5.png" style="width: 25px; height: 25px;" alt="Comic Book Characters">
                            </div>
                        </div>
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
            this.playerCorrectAnswers[this.currentPlayer - 1]++;
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
            this.playerWrongAnswers[this.currentPlayer - 1]++;
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

    showSinglePlayerScore() {
        console.log('Showing single player score...');
        const card = document.getElementById('currentCard');
        const front = card.querySelector('.front');
        front.className = 'front start-card';
        
        front.innerHTML = `
            <div class="card-content">
                <div class="logo-container">
                    <img src="images/doubleactlogo.png" alt="Double Act" class="logo-small-da">
                </div>
                <h2 style="text-align: center; margin: 10px 0 20px;">Score Card</h2>
                <div class="main-content">
                    <div style="text-align: center;">
                        <p><strong>Player 1</strong></p>
                    </div>
                    <div class="single-player-score">
                        <p>Correct: ${this.score}</p>
                        <p>Passed: ${this.passedAnswers}</p>
                        <p>Total Possible Points: ${this.totalPossiblePoints}</p>
                    </div>
                </div>
                <div class="score-buttons">
                    <button onclick="game.showCurrentCard()" class="footer-button">Back to Game</button>
                    <button onclick="game.showEndCard()" class="footer-button red-button">End Game</button>
                </div>
            </div>
        `;
        
        this.disableNavigation = true;
    }

    showMultiPlayerScore() {
        console.log('Showing multiplayer score...');
        const card = document.getElementById('currentCard');
        const front = card.querySelector('.front');
        front.className = 'front start-card';

        const playerScores = this.playerScores.map((score, index) => `
            <div class="player-score">
                <h3>Player ${index + 1}</h3>
                <p>Correct: ${score.correct}</p>
                <p>Passed: ${score.passed}</p>
            </div>
        `).join('');

        front.innerHTML = `
            <div class="card-content">
                <div class="logo-container">
                    <img src="images/doubleactlogo.png" alt="Double Act" class="logo-small-da">
                </div>
                <h2 style="text-align: center; margin: 10px 0 20px;">Score Card</h2>
                <div class="main-content">
                    <div class="multiplayer-scores-grid">
                        ${playerScores}
                    </div>
                </div>
                <div class="score-buttons">
                    <button onclick="game.showCurrentCard()" class="footer-button">Back to Game</button>
                    <button onclick="game.showEndCard()" class="footer-button red-button">End Game</button>
                </div>
            </div>
        `;
        
        this.disableNavigation = true;
    }

    showEndCard() {
        console.log('Showing end card...');
        const card = document.getElementById('currentCard');
        const front = card.querySelector('.front');
        front.className = 'front start-card';

        let content;
        if (this.isMultiplayer) {
            const scores = this.playerScores.map((score, index) => `
                <div class="player-score">
                    <h3>Player ${index + 1}</h3>
                    <p>Correct: ${score.correct}</p>
                    <p>Passed: ${score.passed}</p>
                </div>
            `).join('');

            content = `
                <div class="end-card-header">
                    <div class="logo-container">
                        <img src="images/doubleactlogo.png" alt="Double Act" class="logo-medium-da">
                    </div>
                </div>
                <div style="margin-top: 50%;">
                    <h2 style="text-align: center; margin: 20px 0;">Game Over!</h2>
                    <div class="multiplayer-scores-grid">
                        ${scores}
                    </div>
                    <div style="text-align: center; margin-top: 20px; font-size: 0.9em; color: #000;">Winner: ${this.getWinnerText()}</div>
                </div>
            `;
        } else {
            content = `
                <div class="end-card-header">
                    <div class="logo-container">
                        <img src="images/doubleactlogo.png" alt="Double Act" class="logo-medium-da">
                    </div>
                </div>
                <h2 style="text-align: center; margin: 20px 0;">Game Over!</h2>
                <div style="text-align: center;">
                    <p><strong>Player 1</strong></p>
                </div>
                <div class="final-score">
                    <p>Correct: ${this.score}</p>
                    <p>Passed: ${this.passedAnswers}</p>
                    <p>Total Possible Points: ${this.totalPossiblePoints}</p>
                </div>
            `;
        }

        front.innerHTML = `
            <div class="card-content">
                <div class="main-content">
                    ${content}
                </div>
                <div class="card-footer">
                    <button onclick="game.showStartCard()" class="footer-button">Start New Game</button>
                </div>
            </div>
        `;
        
        this.disableNavigation = true;
    }

    getWinnerText() {
        const maxScore = Math.max(...this.playerScores.map(score => score.correct));
        const winners = this.playerScores
            .map((score, index) => ({ player: index + 1, score: score.correct }))
            .filter(player => player.score === maxScore);

        if (winners.length === 1) {
            return `Player ${winners[0].player}`;
        } else {
            const winnerText = winners
                .map(w => `Player ${w.player}`)
                .join(winners.length > 2 ? ', ' : ' and ');
            if (winners.length > 2) {
                const lastComma = winnerText.lastIndexOf(',');
                return `${winnerText.substring(0, lastComma)} and${winnerText.substring(lastComma + 1)}`;
            }
            return winnerText;
        }
    }

    returnToGame() {
        console.log('Returning to game...');
        this.disableNavigation = false;
        this.showCurrentCard();
    }

    showClueHelp(cardType) {
        import('./js/cards/SinglePlayerClueHelpCard.js').then(module => {
            new module.SinglePlayerClueHelpCard(
                document.getElementById('game-container'),
                cardType
            );
        });
    }

    returnToClueCard() {
        // Return to the current clue card
        const container = document.getElementById('game-container');
        new SinglePlayerClueCard(
            container,
            this.cards[this.currentCardIndex],
            this.currentCardIndex + 1,
            this.cards.length
        );
    }
}

// Create global game instance when the module loads
window.game = new DoubleActGame();
