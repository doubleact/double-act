class DoubleActGame {
    constructor() {
        this.currentCardIndex = -1;
        this.cards = this.shuffleCards([...cardData]);
        this.score = 0;
        this.correctAnswers = 0;
        this.passedAnswers = 0;
        this.setupEventListeners();
        this.showStartCard();
    }

    shuffleCards(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keyup', (e) => {
            if (this.currentCardIndex === -1) {
                if (['ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key)) {
                    this.startGame();
                } else if (e.key === 'ArrowDown') {
                    this.showRules();
                }
            } else if (this.currentCardIndex < this.cards.length) {
                switch(e.key) {
                    case 'ArrowUp':
                        this.toggleAnswer();
                        break;
                    case 'ArrowLeft':
                        this.previousCard();
                        break;
                    case 'ArrowRight':
                        this.nextCard();
                        break;
                    case 'ArrowDown':
                        this.showRules();
                        break;
                }
            }
        });

        // Touch controls using Hammer.js
        const card = document.getElementById('currentCard');
        const hammer = new Hammer(card);
        hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

        hammer.on('swipe', (e) => {
            if (this.currentCardIndex === -1) {
                if (e.direction === Hammer.DIRECTION_UP) {
                    this.showRules();
                } else {
                    this.startGame();
                }
            } else if (this.currentCardIndex < this.cards.length) {
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
            }
        });

        // Double tap to show answer
        hammer.on('doubletap', () => {
            if (this.currentCardIndex >= 0 && this.currentCardIndex < this.cards.length) {
                this.toggleAnswer();
            }
        });
    }

    showStartCard() {
        const card = document.getElementById('currentCard');
        card.classList.remove('flipped', 'rules-flipped');
        
        const front = card.querySelector('.front');
        front.className = 'front start-card';
        front.innerHTML = `
            <div class="card-content">
                <div class="title-container">
                    <h1 class="title">Double Act</h1>
                </div>
                <div class="bottom-content">
                    <div class="button-container">
                        <button class="start-button" onclick="game.startGame()">Start Game</button>
                    </div>
                    <p style="margin-top: 20px;">Swipe up for rules</p>
                </div>
            </div>
        `;
    }

    startGame() {
        this.currentCardIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.passedAnswers = 0;
        this.showCurrentCard();
    }

    showCurrentCard() {
        const card = document.getElementById('currentCard');
        card.classList.remove('flipped', 'rules-flipped');
        
        if (this.currentCardIndex >= this.cards.length) {
            this.showEndCard();
            return;
        }

        const currentCard = this.cards[this.currentCardIndex];
        const front = card.querySelector('.front');
        front.className = `front clue-type-${currentCard.type}`;
        front.innerHTML = `
            <div class="card-content">
                <div>
                    <div class="card-info">${this.currentCardIndex + 1}/${this.cards.length}</div>
                    <div class="score">Score: ${this.score}</div>
                </div>
                <div class="title-container">
                    <div class="clue-text">
                        ${currentCard.actors[0]}<br>&<br>${currentCard.actors[1]}
                    </div>
                </div>
                <div class="bottom-content">
                    <div class="button-container">
                        <button class="pass-button" onclick="game.passCard()">Pass</button>
                    </div>
                </div>
            </div>
        `;

        const back = card.querySelector('.back');
        back.innerHTML = `
            <div class="card-content">
                <div class="title-container">
                    <div>
                        <div class="character">${currentCard.character}</div>
                        <div class="movies">
                            ${currentCard.movies[0]}<br>&<br>${currentCard.movies[1]}
                        </div>
                    </div>
                </div>
                <div class="bottom-content">
                    <div class="button-container">
                        <button class="correct-button" onclick="game.correctAnswer()">Correct</button>
                    </div>
                </div>
            </div>
        `;
    }

    showRules() {
        const card = document.getElementById('currentCard');
        card.classList.toggle('rules-flipped');
        
        const back = card.querySelector('.back');
        back.className = 'back rules';
        if (!card.classList.contains('rules-flipped')) {
            back.className = 'back';
        }
        back.innerHTML = `
            <div class="card-content">
                <div class="title-container">
                    <div class="rules-text">
                        <h2>How to Play</h2>
                        <p>1. Each card shows two actors who have played the same character</p>
                        <p>2. Try to guess the character they both played</p>
                        <p>3. Swipe up or double tap to see the answer</p>
                        <p>4. Mark if you got it correct or pass to skip</p>
                        <p>5. Swipe left/right or use arrow keys to navigate</p>
                        <p>6. Each correct answer is worth 10 points</p>
                    </div>
                </div>
                <div class="bottom-content">
                    <p>Swipe down or press down arrow to return</p>
                </div>
            </div>
        `;
    }

    showEndCard() {
        const card = document.getElementById('currentCard');
        const front = card.querySelector('.front');
        front.className = 'front end-card';
        front.innerHTML = `
            <div class="card-content">
                <div class="title-container">
                    <div>
                        <h1 class="title">No more cards left</h1>
                        <p>Thank you for playing</p>
                        <h2>Double Act</h2>
                        <div style="margin-top: 30px;">
                            <p>Correct Answers: ${this.correctAnswers}</p>
                            <p>Answers Passed: ${this.passedAnswers}</p>
                            <p>Final Score: ${this.score}/${this.cards.length * 10}</p>
                        </div>
                    </div>
                </div>
                <div class="bottom-content">
                    <div class="button-container">
                        <button class="start-button" onclick="game.showStartCard()">Play Again</button>
                    </div>
                </div>
            </div>
        `;
    }

    toggleAnswer() {
        const card = document.getElementById('currentCard');
        card.classList.toggle('flipped');
    }

    correctAnswer() {
        this.score += 10;
        this.correctAnswers++;
        this.nextCard();
    }

    passCard() {
        this.passedAnswers++;
        this.nextCard();
    }

    nextCard() {
        if (this.currentCardIndex < this.cards.length) {
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
}

// Initialize the game
const game = new DoubleActGame();
