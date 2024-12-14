document.addEventListener('DOMContentLoaded', () => {
    const card = document.querySelector('.card');
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let lastTap = 0;
    let isDragging = false;
    const doubleTapDelay = 500;
    let currentCardIndex = -1;
    let shuffledCards = [];
    let gameStarted = false;
    let showingRules = false;
    let currentCardScored = false;
    let incorrectGuesses = 0;
    let currentScore = 0;
    const POINTS_PER_CARD = 10;

    // Function to show start screen
    function showStartScreen() {
        const actorNames = document.querySelector('.actor-names');
        const cardFront = document.querySelector('.card-front');
        const scoreDisplay = document.querySelector('.score-display');
        const cardCounter = document.querySelector('.card-counter');
        const gotItButton = document.querySelector('.got-it-button');
        const passButton = document.querySelector('.pass-button');

        showingRules = false;
        cardFront.classList.add('start-screen');
        scoreDisplay.style.display = 'none';
        cardCounter.style.display = 'none';
        gotItButton.style.display = 'none';
        passButton.style.display = 'none';
        currentScore = 0;
        document.getElementById('current-score').textContent = '0';

        actorNames.innerHTML = `
            <div class="start-message">
                <div class="start-title">Double Act</div>
                <div class="tap-text">Swipe up for rules</div>
                <div class="start-text">Swipe to start game</div>
            </div>
        `;

        // Remove the rules content from the back of the start card
        document.querySelector('.character-info').innerHTML = '';
    }

    // Function to toggle rules
    function toggleRules() {
        if (!gameStarted) {
            showRules();  // Use the same rules function for both start screen and game
        }
    }

    // Function to start game
    function startGame() {
        if (!gameStarted) {
            const cardFront = document.querySelector('.card-front');
            const scoreDisplay = document.querySelector('.score-display');
            const cardCounter = document.querySelector('.card-counter');
            
            cardFront.classList.remove('start-screen');
            scoreDisplay.style.display = 'block';
            cardCounter.style.display = 'block';
            
            gameStarted = true;
            shuffleCards();
            currentCardIndex = 0;
            
            // Update total cards count
            document.getElementById('total-cards').textContent = shuffledCards.length;
            
            updateCardContent(currentCardIndex);
        }
    }

    // Function to restart game
    function restartGame() {
        const cardFront = document.querySelector('.card-front');
        cardFront.classList.remove('end-screen'); 
        gameStarted = false;
        showStartScreen();
    }

    // Function to show end card
    function showEndCard() {
        const actorNames = document.querySelector('.actor-names');
        const characterInfo = document.querySelector('.character-info');
        const scoreDisplay = document.querySelector('.score-display');
        const cardCounter = document.querySelector('.card-counter');
        const gotItButton = document.querySelector('.got-it-button');
        const passButton = document.querySelector('.pass-button');

        // Hide all game elements
        scoreDisplay.style.display = 'none';
        cardCounter.style.display = 'none';
        gotItButton.style.display = 'none';
        passButton.style.display = 'none';

        const correctGuesses = currentScore / POINTS_PER_CARD;
        const totalCards = cardData.length;
        const maxPossibleScore = totalCards * POINTS_PER_CARD;

        actorNames.innerHTML = `
            <div class="end-message">
                <div class="end-text">No more cards left</div>
                <div class="end-text">Thank you for playing</div>
                <div class="end-text">Double Act</div>
                <div class="score-breakdown">
                    <div>Correct Guesses: ${correctGuesses}</div>
                    <div>Incorrect Guesses: ${incorrectGuesses}</div>
                    <div class="final-score">Final Score: ${currentScore}/${maxPossibleScore}</div>
                </div>
                <div class="restart-text" onclick="window.location.href=window.location.href">Restart Game</div>
            </div>
        `;
        
        characterInfo.innerHTML = '';
        
        // Disable all game functionality
        gameStarted = false;
        card.classList.add('end-screen');
        card.classList.remove('flipped');
        card.style.pointerEvents = 'none';
    }

    // Function to shuffle cards
    function shuffleCards() {
        shuffledCards = [...cardData]; 
        for (let i = shuffledCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
        }
    }

    // Function to update card content
    function updateCardContent(index) {
        if (!gameStarted) {
            showStartScreen();
            return;
        }

        const actorNames = document.querySelector('.actor-names');
        const characterInfo = document.querySelector('.character-info');
        const cardFront = document.querySelector('.card-front');
        const gotItButton = document.querySelector('.got-it-button');
        const passButton = document.querySelector('.pass-button');
        const cardCounter = document.querySelector('.card-counter');

        // Reset scoring for new card
        currentCardScored = false;
        gotItButton.style.display = 'none';
        passButton.style.display = 'block'; // Show Pass button on front

        // Update card counter
        document.getElementById('current-card').textContent = index + 1;

        // Remove all special classes
        cardFront.classList.remove('start-screen', 'end-screen');
        card.classList.remove('type-1', 'type-2', 'type-3', 'type-4', 'type-5');

        if (index >= shuffledCards.length) {
            showEndCard();
            return;
        }

        const currentCard = shuffledCards[index];
        // Add the current card's type class
        card.classList.add(`type-${currentCard.type}`);

        // Update front of card
        actorNames.innerHTML = `
            <div class="actor">${currentCard.actors[0]}</div>
            <div class="and">&</div>
            <div class="actor">${currentCard.actors[1]}</div>
        `;

        // Update back of card
        characterInfo.innerHTML = `
            <div class="character-name">${currentCard.character}</div>
            <div class="movies">
                <div class="movie">${currentCard.movies[0]}</div>
                <div class="and">&</div>
                <div class="movie">${currentCard.movies[1]}</div>
            </div>
        `;

        resizeText();
    }

    // Function to navigate to next card
    function nextCard() {
        if (!gameStarted) {
            startGame();
            return;
        }
        if (currentCardIndex < shuffledCards.length) {
            currentCardIndex++;
            updateCardContent(currentCardIndex);
            if (card.classList.contains('flipped')) {
                card.classList.remove('flipped');
            }
        }
    }

    // Function to navigate to previous card
    function previousCard() {
        if (!gameStarted) {
            startGame();
            return;
        }
        if (currentCardIndex > 0) {
            currentCardIndex--;
            updateCardContent(currentCardIndex);
            if (card.classList.contains('flipped')) {
                card.classList.remove('flipped');
            }
        }
    }

    // Function to flip card
    function flipCard() {
        if (!gameStarted && !showingRules) return;
        
        card.classList.toggle('flipped');
        const gotItButton = document.querySelector('.got-it-button');
        const passButton = document.querySelector('.pass-button');
        
        if (card.classList.contains('flipped')) {
            gotItButton.style.display = 'block';
            passButton.style.display = 'none';
        } else {
            gotItButton.style.display = 'none';
            passButton.style.display = gameStarted ? 'block' : 'none';
        }
    }

    // Function to handle single tap on start screen
    function handleStartScreenTap(event) {
        if (!gameStarted && !isDragging) {
            toggleRules();
            event.preventDefault();
        }
    }

    // Function to handle Got It button click
    function handleGotIt() {
        if (!currentCardScored) {
            currentScore += POINTS_PER_CARD;
            document.getElementById('current-score').textContent = currentScore;
            currentCardScored = true;
            document.querySelector('.got-it-button').style.display = 'none';
        }
    }

    // Function to handle Pass button click
    function handlePass() {
        incorrectGuesses++;
        nextCard();
    }

    // Mouse/Touch event handlers
    function handleTouchStart(e) {
        if (!card.classList.contains('end-screen')) {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }
        e.preventDefault();
    }

    function handleTouchMove(e) {
        if (!card.classList.contains('end-screen')) {
            e.preventDefault();
        }
    }

    function handleTouchEnd(e) {
        if (!card.classList.contains('end-screen')) {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe(e);
        }
    }

    function handleMouseDown(e) {
        if (!card.classList.contains('end-screen')) {
            isDragging = true;
            touchStartX = e.clientX;
            touchStartY = e.clientY;
        }
        e.preventDefault();
    }

    function handleMouseMove(e) {
        if (!card.classList.contains('end-screen') && isDragging) {
            e.preventDefault();
        }
    }

    function handleMouseUp(e) {
        if (!card.classList.contains('end-screen') && isDragging) {
            touchEndX = e.clientX;
            touchEndY = e.clientY;
            isDragging = false;
            handleSwipe(e);
        }
    }

    // Add event listeners
    card.addEventListener('touchstart', handleTouchStart, { passive: false });
    card.addEventListener('touchmove', handleTouchMove, { passive: false });
    card.addEventListener('touchend', handleTouchEnd);
    card.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // Double tap/click handlers
    function handleDoubleTap(e) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        
        if (tapLength < doubleTapDelay && tapLength > 0) {
            if (!card.classList.contains('end-screen') && gameStarted) {
                flipCard();
                e.preventDefault();
            }
        }
        
        lastTap = currentTime;
    }

    card.addEventListener('touchend', handleDoubleTap);
    card.addEventListener('dblclick', flipCard);

    // Function to handle swipe
    function handleSwipe(e) {
        // If we're on the end screen, don't handle any swipes
        if (card.classList.contains('end-screen')) {
            return;
        }

        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        const absX = Math.abs(diffX);
        const absY = Math.abs(diffY);
        const swipeThreshold = 80; // Increased from 50 to 80
        const angleThreshold = 0.5; // Only count horizontal swipes if they're mostly horizontal

        // Ignore diagonal swipes that might be scrolling attempts
        const swipeAngle = absY / absX;
        if (swipeAngle > angleThreshold) {
            return;
        }

        // Handle horizontal swipe
        if (absX > swipeThreshold) {
            if (!gameStarted) {
                startGame();
            } else if (!card.classList.contains('showing-rules')) {
                if (diffX < 0) { // Swipe left
                    nextCard();
                } else { // Swipe right
                    previousCard();
                }
            }
            e.preventDefault();
        }
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (card.classList.contains('end-screen')) {
            e.preventDefault();
            return;
        }

        if (!gameStarted) {
            // Start screen controls
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                startGame();
            } else if (e.key === 'ArrowDown') {
                if (card.classList.contains('showing-rules')) {
                    hideRules();
                } else {
                    showRules();
                }
            }
            return;
        }

        if (card.classList.contains('showing-rules')) {
            // Rules card controls
            if (e.key === 'ArrowDown') {
                hideRules();
            }
            return;
        }

        // Clue card controls
        switch(e.key) {
            case 'ArrowLeft':
                if (!card.classList.contains('showing-rules')) {
                    previousCard();
                }
                break;
            case 'ArrowRight':
                if (!card.classList.contains('showing-rules')) {
                    nextCard();
                }
                break;
            case 'ArrowUp':
                flipCard();
                break;
            case 'ArrowDown':
                showRules();
                break;
        }
    });

    // Function to show rules during gameplay
    function showRules() {
        const actorNames = document.querySelector('.actor-names');
        
        // Save current card content to restore later
        card.dataset.savedContent = actorNames.innerHTML;
        
        // Show rules
        actorNames.innerHTML = `
            <div class="rules-container">
                <div class="rules-title">How to Play</div>
                
                <div class="rules-section">
                    <div class="rules-heading">Objective</div>
                    <div class="rules-text">
                        Match pairs of actors who have played the same character in different productions.
                        Each card reveals two actors who have shared a role, bringing to life the same character
                        across different movies or TV shows.
                    </div>
                </div>

                <div class="rules-section">
                    <div class="rules-heading">Card Colors</div>
                    <div class="rules-text">
                        • Blue: Both actors played the role in movies<br>
                        • Yellow: One actor in a movie, one in TV<br>
                        • Purple: Both actors played the role on TV<br>
                        • Red: Actors who played real-life people
                    </div>
                </div>

                <div class="rules-section">
                    <div class="rules-heading">Controls</div>
                    <div class="rules-text">
                        • Double tap/click to flip cards<br>
                        • Swipe left/right to navigate<br>
                        • Swipe down on clue card to view rules<br>
                        • Swipe up on rules card to return to game<br>
                    </div>
                </div>
            </div>
        `;
        
        card.classList.add('showing-rules');
    }

    function hideRules() {
        const actorNames = document.querySelector('.actor-names');
        
        // Restore saved card content
        if (card.dataset.savedContent) {
            actorNames.innerHTML = card.dataset.savedContent;
        }
        
        card.classList.remove('showing-rules');
    }

    // Function to dynamically resize text
    function resizeText() {
        const containers = [
            ...document.querySelectorAll('.actor'),
            ...document.querySelectorAll('.character-name'),
            ...document.querySelectorAll('.movie')
        ];

        containers.forEach(container => {
            let fontSize = 24;
            const maxWidth = container.offsetWidth;
            const maxHeight = container.offsetHeight;
            
            container.style.fontSize = fontSize + 'px';
            
            while ((container.scrollWidth > maxWidth || container.scrollHeight > maxHeight) && fontSize > 12) {
                fontSize--;
                container.style.fontSize = fontSize + 'px';
            }
        });
    }

    // Resize text initially and on window resize
    resizeText();
    window.addEventListener('resize', resizeText);

    // Add Got It button click handler
    document.querySelector('.got-it-button').addEventListener('click', handleGotIt);

    // Add Pass button click handler
    document.querySelector('.pass-button').addEventListener('click', handlePass);

    // Initialize with start screen
    showStartScreen();
});
