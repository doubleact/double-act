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
                const card = document.getElementById('currentCard');
                const isShowingAnswer = card.classList.contains('flipped');
                const isShowingRules = card.classList.contains('rules-flipped');

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
            }
        });

        // Double tap to show answer
        hammer.on('doubletap', () => {
            if (this.currentCardIndex >= 0 && this.currentCardIndex < this.cards.length) {
                const isShowingRules = card.classList.contains('rules-flipped');
                if (!isShowingRules) {
                    this.toggleAnswer();
                }
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
                typeImages = '<img src="images/type4.png" class="type-icon" alt="Real Life">';
                break;
            case 5:
                typeImages = '<img src="images/type5.png" class="type-icon" alt="Superhero">';
                break;
        }

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
                <div class="type-icons">
                    ${typeImages}
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
        const back = card.querySelector('.back');
        
        // If showing answer, return to front first
        if (card.classList.contains('flipped')) {
            card.classList.remove('flipped');
            setTimeout(() => {
                back.className = 'back rules';
                this.displayRulesContent(back);
                setTimeout(() => {
                    card.classList.add('rules-flipped');
                }, 20);
            }, 200);
            return;
        }
        
        back.className = 'back rules';
        this.displayRulesContent(back);
        setTimeout(() => {
            card.classList.add('rules-flipped');
        }, 20);
    }

    displayRulesContent(backElement) {
        backElement.innerHTML = `
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

    exitRules() {
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

    toggleAnswer() {
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
}

// Initialize the game
const game = new DoubleActGame();
