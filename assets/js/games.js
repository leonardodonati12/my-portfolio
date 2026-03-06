const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const tabs = document.querySelectorAll('.game-tab');

let currentGame = 'space';
let gameLoopId;
let score = 0;

// --- CONTROLES DA ABA ---
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentGame = tab.getAttribute('data-game');
        score = 0;
        updateScore();
        startGame();
    });
});

function updateScore() {
    document.getElementById('local-score').innerText = `SCORE: ${score.toString().padStart(6, '0')}`;
}

// --- CONTROLES DE TECLADO ---
const keys = {};
window.addEventListener('keydown', e => {
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault(); // Trava a tela para não rolar
    }
    keys[e.code] = true;
});
window.addEventListener('keyup', e => keys[e.code] = false);

// --- MOTOR PRINCIPAL ---
function startGame() {
    cancelAnimationFrame(gameLoopId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (currentGame === 'space') initSpace();
    else if (currentGame === 'tennis') initTennis();
    else if (currentGame === 'tetris') initTetris();
}

// ==========================================
// JOGO 1: SPACE
// ==========================================
function initSpace() {
    let player = { x: 230, y: 550, width: 40, height: 20, speed: 5 };
    let bullets = [];
    let enemies = [];
    let lastShot = 0;

    // Criar Inimigos
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 8; j++) {
            enemies.push({ x: 50 + j * 50, y: 50 + i * 40, width: 20, height: 15, alive: true });
        }
    }
    let enemyDir = 1;

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Desenhar linha tracejada da sua imagem de referência
        ctx.setLineDash([10, 15]);
        ctx.beginPath(); ctx.moveTo(canvas.width / 2, 0); ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.strokeStyle = '#333'; ctx.stroke(); ctx.setLineDash([]);

        // Movimento Player
        if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
        if (keys['ArrowRight'] && player.x < canvas.width - player.width) player.x += player.speed;

        // Tiro
        if (keys['Space'] && Date.now() - lastShot > 300) {
            bullets.push({ x: player.x + player.width / 2 - 2, y: player.y, width: 4, height: 10 });
            lastShot = Date.now();
        }

        // Desenhar Player (Nave simplificada)
        ctx.fillStyle = '#fff';
        ctx.fillRect(player.x, player.y, player.width, player.height);
        ctx.fillRect(player.x + 15, player.y - 10, 10, 10);

        // Atualizar e Desenhar Tiros
        bullets.forEach((b, index) => {
            b.y -= 7;
            ctx.fillRect(b.x, b.y, b.width, b.height);
            if (b.y < 0) bullets.splice(index, 1);
        });

        // Atualizar Inimigos
        let hitWall = false;
        enemies.forEach(e => {
            if (!e.alive) return;
            e.x += 1 * enemyDir;
            if (e.x > canvas.width - e.width || e.x < 0) hitWall = true;

            // Desenhar inimigo
            ctx.fillRect(e.x, e.y, e.width, e.height);

            // Colisão com tiro
            bullets.forEach((b, bIndex) => {
                if (b.x < e.x + e.width && b.x + b.width > e.x && b.y < e.y + e.height && b.y + b.height > e.y) {
                    e.alive = false;
                    bullets.splice(bIndex, 1);
                    score += 150;
                    updateScore();
                }
            });
        });

        if (hitWall) {
            enemyDir *= -1;
            enemies.forEach(e => e.y += 20);
        }

        gameLoopId = requestAnimationFrame(loop);
    }
    loop();
}

// ==========================================
// JOGO 2: TENNIS (PONG)
// ==========================================
function initTennis() {
    let p1 = { x: 20, y: 250, width: 10, height: 80, speed: 6 };
    let p2 = { x: 470, y: 250, width: 10, height: 80, speed: 5 }; // CPU
    let ball = { x: 250, y: 300, size: 10, dx: 4, dy: 4 };

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Desenhar Rede
        ctx.setLineDash([10, 10]);
        ctx.beginPath(); ctx.moveTo(canvas.width / 2, 0); ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.strokeStyle = '#fff'; ctx.stroke(); ctx.setLineDash([]);

        // Movimento Player
        if (keys['ArrowUp'] && p1.y > 0) p1.y -= p1.speed;
        if (keys['ArrowDown'] && p1.y < canvas.width - p1.height) p1.y += p1.speed;

        // Movimento CPU Simples
        if (ball.y < p2.y + p2.height / 2) p2.y -= p2.speed;
        if (ball.y > p2.y + p2.height / 2) p2.y += p2.speed;

        // Movimento Bola
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Colisão Parede
        if (ball.y <= 0 || ball.y >= canvas.height - ball.size) ball.dy *= -1;

        // Colisão Raquetes
        if (ball.x <= p1.x + p1.width && ball.y + ball.size >= p1.y && ball.y <= p1.y + p1.height) {
            ball.dx *= -1;
            ball.x = p1.x + p1.width; // Previne bugar dentro da raquete
            score += 10;
            updateScore();
        }
        if (ball.x + ball.size >= p2.x && ball.y + ball.size >= p2.y && ball.y <= p2.y + p2.height) {
            ball.dx *= -1;
            ball.x = p2.x - ball.size;
        }

        // Ponto
        if (ball.x < 0 || ball.x > canvas.width) {
            ball.x = 250; ball.y = 300; // Reset
        }

        ctx.fillStyle = '#fff';
        ctx.fillRect(p1.x, p1.y, p1.width, p1.height);
        ctx.fillRect(p2.x, p2.y, p2.width, p2.height);
        ctx.fillRect(ball.x, ball.y, ball.size, ball.size);

        gameLoopId = requestAnimationFrame(loop);
    }
    loop();
}

// ==========================================
// JOGO 3: TETRIS (Placeholder)
// ==========================================
function initTetris() {
    ctx.fillStyle = '#fff';
    ctx.font = '20px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText("TETRIS ENGINE", canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText("LOADING...", canvas.width / 2, canvas.height / 2 + 20);
}

// Inicia o primeiro jogo
startGame();