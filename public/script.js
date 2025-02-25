const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 450;
canvas.height = 450;

const box = 20;
let snake = [{ x: 300, y: 300 }];
let direction = "RIGHT";
let food = getRandomFoodPosition();
let score = 0;
let gameRunning = true;
let speed = 200;
const eatSound = new Audio("/assets/eat.mp3");

// Apply selected theme from localStorage
const theme = localStorage.getItem("selectedTheme") || "classic";
applyTheme(theme);

function applyTheme(theme) {
    if (theme === "classic") {
        document.body.style.backgroundColor = "#ddd";
        canvas.style.backgroundColor = "white";
    } else if (theme === "neon") {
        document.body.style.backgroundColor = "black";
        document.body.style.color = "lime";
        canvas.style.backgroundColor = "#111";
    } else if (theme === "retro") {
        document.body.style.backgroundColor = "#F4A261";
        canvas.style.backgroundColor = "#264653";
    } else if (theme === "dark") {
        document.body.style.backgroundColor = "#222";
        document.body.style.color = "white";
        canvas.style.backgroundColor = "#333";
    }
}

// Handle keyboard input
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    else if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Generate random food position
function getRandomFoodPosition() {
    return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
}

// Update rank based on score
function updateRank(score) {
    let rank = "Beginner";
    if (score >= 3) rank = "Super Noob";
    if (score >= 10) rank = "Noob";
    if (score >= 20) rank = "Okayish";
    if (score >= 30) rank = "Not so cool";
    if (score >= 40) rank = "Life Jhinga Lala";
    if (score >= 50) rank = "Good Player";
    if (score >= 100) rank = "Expert";
    if (score >= 150) rank = "Master";
    document.getElementById("rank").innerText = rank;
}

// Update game state
function update() {
    if (!gameRunning) return;

    let head = { ...snake[0] };

    // Move the head
    if (direction === "UP") head.y -= box;
    if (direction === "DOWN") head.y += box;
    if (direction === "LEFT") head.x -= box;
    if (direction === "RIGHT") head.x += box;

    // Check if snake eats food
    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById("score").innerText = score;
        food = getRandomFoodPosition();
        eatSound.play();
        updateRank(score);
        speed = Math.max(80, speed - 5);
    } else {
        snake.pop();
    }

    // Check for collisions (Wall or Self)
    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height || checkCollision(head, snake)) {
        gameRunning = false;
        setTimeout(() => alert("Game Over! Your Score: " + score), 100);
        return;
    }

    snake.unshift(head);
}

// Check if snake collides with itself
function checkCollision(head, snake) {
    return snake.some((segment, index) => index !== 0 && head.x === segment.x && head.y === segment.y);
}

// Draw everything on the canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw food as a red circle (instead of a square)
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(food.x + box / 2, food.y + box / 2, box / 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw snake with circular segments and gradient effect
    for (let i = 0; i < snake.length; i++) {
        let segment = snake[i];

        let gradient = ctx.createRadialGradient(
            segment.x + box / 2, segment.y + box / 2, box / 4,
            segment.x + box / 2, segment.y + box / 2, box / 2
        );
        gradient.addColorStop(0, "lime");
        gradient.addColorStop(1, i === 0 ? "darkgreen" : "green");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(segment.x + box / 2, segment.y + box / 2, box / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Game loop
function gameLoop() {
    update();
    draw();
    if (gameRunning) setTimeout(gameLoop, speed);
}

// Start the game
gameLoop();
