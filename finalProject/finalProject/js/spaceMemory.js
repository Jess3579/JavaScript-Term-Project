$(document).ready(function () {
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
  
    // Sound Elements
    const flipSound = $('#flipSound')[0];
    const matchSound = $('#matchSound')[0];
    const victorySound = $('#victorySound')[0];
  
    // Modal Elements
    const victoryModal = $('#victoryModal');
    const playAgainBtn = $('#playAgainBtn');
  
    function shuffle(array) {
      return array.sort(() => Math.random() - 0.5);
    }
  
    function initializeGame() {
      const gameBoard = $('.game-board');
      gameBoard.empty();
      matchedPairs = 0;
      openedCards = [];
  
      const shuffled = shuffle(cards);
      shuffled.forEach(card => {
        const cardEl = $(`
          <div class="card" data-card="${card}">
            <div class="front"><img src="media/${card}" alt="${card}"></div>
            <div class="back"></div>
          </div>
        `);
        gameBoard.append(cardEl);
      });
  
      $('.card').on('click', handleCardClick);
    }
  
    function handleCardClick() {
      if ($(this).hasClass('flipped') || openedCards.length === 2) return;
  
      $(this).addClass('flipped');
      flipSound.currentTime = 0;
      flipSound.play();
  
      openedCards.push($(this));
  
      if (openedCards.length === 2) {
        checkForMatch();
      }
    }
  
    function checkForMatch() {
      const [card1, card2] = openedCards;
  
      if (card1.data('card') === card2.data('card')) {
        matchedPairs++;
        matchSound.currentTime = 0;
        matchSound.play();
        openedCards = [];
  
        if (matchedPairs === cards.length / 2) {
          setTimeout(showVictoryModal, 500);
        }
      } else {
        setTimeout(() => {
          card1.removeClass('flipped');
          card2.removeClass('flipped');
          openedCards = [];
        }, 1000);
      }
    }
  
    function showVictoryModal() {
      victoryModal.addClass('show');
      setTimeout(() => {
        victoryModal.find('.modal-content').addClass('show');
      }, 10);
  
      victorySound.currentTime = 0;
      victorySound.play();
    }
  
    function restartGame() {
      initializeGame();
      closeModal();
    }
  
    function closeModal() {
      victoryModal.removeClass('show');
      victoryModal.find('.modal-content').removeClass('show');
    }
  
    playAgainBtn.on('click', restartGame);
    $('#restart').on('click', restartGame);
  
    victoryModal.on('click', (e) => {
      if (e.target === victoryModal[0]) closeModal();
    });
  
    initializeGame();
  });

