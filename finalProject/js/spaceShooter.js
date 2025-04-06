// ✅ Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ✅ Set fixed canvas size to prevent resizing issues
canvas.width = 600;
canvas.height = 400;

// ✅ Get buttons and background sound
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const backgroundSound = document.getElementById('backgroundSound');

// ✅ Load sounds
const laserSound = new Audio('./media/laserSound.mp3');
const explosionSound = new Audio('./media/explosionSound.mp3');

// ✅ Load images
const spaceshipImg = new Image();
spaceshipImg.src = './media/spaceShip.png';

const enemyImg = new Image();
enemyImg.src = './media/mainEnemy.png';

function resizeCanvas() {
    canvas.width = Math.min(window.innerWidth * 0.9, 600);
    canvas.height = Math.min(window.innerHeight * 0.8, 600);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// ✅ Game state variables
let gameOver = false;
let score = 0;
let enemyInterval = null;

// ✅ Spaceship properties
const spaceship = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    speed: 5,
    movingLeft: false,
    movingRight: false
};

// ✅ Arrays to hold bullets and enemies
const bullets = [];
const enemies = [];

// ✅ Handle player movement and shooting
document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft') spaceship.movingLeft = true;
    if (e.code === 'ArrowRight') spaceship.movingRight = true;
    if (e.code === 'Space') fireBullet(); // Fire bullet when pressing space
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft') spaceship.movingLeft = false;
    if (e.code === 'ArrowRight') spaceship.movingRight = false;
});

// ✅ Fire Bullets
function fireBullet() {
    bullets.push({
        x: spaceship.x + spaceship.width / 2 - 2,
        y: spaceship.y,
        width: 4,
        height: 12,
        speed: 6
    });

    // Play laser sound
    laserSound.currentTime = 0;
    laserSound.play();
}

// ✅ Add Enemies
function addEnemy() {
    enemies.push({
        x: Math.random() * (canvas.width - 40),
        y: -40, // Start above the screen
        width: 40,
        height: 40,
        speed: 2 // Enemy falls faster to keep gameplay engaging
    });
}

// ✅ Handle Collisions
function handleCollisions() {
    // Bullets hitting enemies
    bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                // Remove bullet and enemy
                bullets.splice(bIndex, 1);
                enemies.splice(eIndex, 1);

                // Increase score
                score += 10;
                
                // Play explosion sound
                explosionSound.currentTime = 0;
                explosionSound.play();
            }
        });
    });

    // Enemy hitting player
    enemies.forEach((enemy) => {
        if (
            enemy.x < spaceship.x + spaceship.width &&
            enemy.x + enemy.width > spaceship.x &&
            enemy.y < spaceship.y + spaceship.height &&
            enemy.y + enemy.height > spaceship.y
        ) {
            endGame(); // End game if player is hit by enemy
        }
    });
}

// ✅ Update Game State
function update() {
    if (gameOver) return;

    // Move spaceship left or right
    if (spaceship.movingLeft) spaceship.x -= spaceship.speed;
    if (spaceship.movingRight) spaceship.x += spaceship.speed;

    // Keep spaceship within canvas boundaries
    spaceship.x = Math.max(0, Math.min(canvas.width - spaceship.width, spaceship.x));

    // Update bullets
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) bullets.splice(index, 1); // Remove bullets off screen
    });

    // Update enemies
    enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;
        if (enemy.y > canvas.height) enemies.splice(index, 1); // Remove enemies off screen
    });

    handleCollisions();
}

// ✅ Draw Everything on the Canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw spaceship
    ctx.drawImage(spaceshipImg, spaceship.x, spaceship.y, spaceship.width, spaceship.height);

    // Draw bullets
    bullets.forEach(bullet => {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Draw enemies
    enemies.forEach(enemy => {
        ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);
    });

    // Display score
    document.getElementById('scoreDisplay').innerText = `Score: ${score}`;
}

// ✅ Main Game Loop
function gameLoop() {
    update();
    draw();
    if (!gameOver) requestAnimationFrame(gameLoop);
}

// ✅ Start Game
function startGame() {
    gameOver = false;
    score = 0;
    bullets.length = 0;
    enemies.length = 0;

    // Reset spaceship position
    spaceship.x = canvas.width / 2 - spaceship.width / 2;
    spaceship.y = canvas.height - spaceship.height - 20;

    backgroundSound.loop = true;
    backgroundSound.play();

    startButton.style.display = 'none';
    restartButton.style.display = 'none';
    document.getElementById('gameOver').style.display = 'none';

    enemyInterval = setInterval(addEnemy, 2000); // Add enemies every 2 seconds
    gameLoop();
}

// ✅ Restart Game
function restartGame() {
    backgroundSound.pause(); // Stop sound when restarting
    backgroundSound.currentTime = 0;
    startGame();
}

// ✅ End Game
function endGame() {
    if (!gameOver) {
        gameOver = true;
        document.getElementById('gameOver').style.display = 'block';
        restartButton.style.display = 'block';

        backgroundSound.pause(); // Stop sound when game ends
        clearInterval(enemyInterval);
    }
}

// ✅ Add event listeners for buttons
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", restartGame);

// ✅ Ensure images load before enabling buttons
spaceshipImg.onload = () => {
    enemyImg.onload = () => {
        console.log('Images loaded successfully.');
        startButton.style.display = 'block';
    };
};