$(document).ready(function() {
    const cards = [
        'earth.png', 'earth.png',
        'saturn.png', 'saturn.png',
        'mars.png', 'mars.png',
        'moon.png', 'moon.png',
        'jupiter.png', 'jupiter.png',
        'star.png', 'star.png',
        'asteroid.png', 'asteroid.png',
        'alien.png', 'alien.png',
        'ufo.png', 'ufo.png',
        'bonusTarget.png', 'bonusTarget.png',
        'satellite.png', 'satellite.png', 
        'bossEnemy.png', 'bossEnemy.png',  
    ];

    let openedCards = [];
    let matchedPairs = 0;

    // Modal Elements
    const victoryModal = $('#victoryModal');
    const playAgainBtn = $('#playAgainBtn');

    // Shuffle function
    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    // Initialize game
    function initializeGame() {
        const gameBoard = $('.game-board');
        gameBoard.empty();

        const shuffledCards = shuffle(cards);
        shuffledCards.forEach(card => {
            const cardElement = $(`
                <div class="card" data-card="${card}">
                    <div class="front">
                        <img src="media/${card}" alt="${card}">
                    </div>
                    <div class="back"></div>
                </div>
            `);
            gameBoard.append(cardElement);
        });

        $('.card').on('click', handleCardClick);
    }

    // Handle Card Click
    function handleCardClick() {
        if ($(this).hasClass('flipped') || openedCards.length === 2) return;

        $(this).addClass('flipped');
        openedCards.push($(this));

        if (openedCards.length === 2) {
            checkForMatch();
        }
    }

    // Check for Match
    function checkForMatch() {
        const [card1, card2] = openedCards;

        if (card1.data('card') === card2.data('card')) {
            matchedPairs++;
            openedCards = [];

            if (matchedPairs === cards.length / 2) {
                setTimeout(() => showVictoryModal(), 500);
            }
        } else {
            setTimeout(() => {
                card1.removeClass('flipped');
                card2.removeClass('flipped');
                openedCards = [];
            }, 1000);
        }
    }

    // ✅ Show Victory Modal
    function showVictoryModal() {
        victoryModal.addClass('show');
        setTimeout(() => {
            victoryModal.find('.modal-content').addClass('show');
        }, 10);

        // ✅ Optional: Add a sound when player wins
        let winSound = new Audio('media/victory.mp3');
        winSound.play();
    }

    // ✅ Restart Game
    function restartGame() {
        matchedPairs = 0;
        openedCards = [];
        initializeGame();

        // ✅ Close modal
        closeModal();
    }

    // ✅ Close Modal
    function closeModal() {
        victoryModal.removeClass('show');
        victoryModal.find('.modal-content').removeClass('show');
    }

    // ✅ Click "Play Again" to restart
    playAgainBtn.on('click', restartGame);

    // ✅ Allow click outside the modal to close
    victoryModal.on('click', (e) => {
        if (e.target === victoryModal[0]) closeModal();
    });
    // ✅ Restart game when "Restart" button is clicked
    $('#restart').on('click', restartGame);

    // ✅ Start Game
    initializeGame();
});

