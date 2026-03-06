const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const tabs = document.querySelectorAll('.game-tab');

let currentGame = 'space';
window.gameLoopId = null; // Agora é global para o site conseguir pausar!
let score = 0;

// --- CONTROLES DA ABA ---
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentGame = tab.getAttribute('data-game');
        score = 0;
        updateScore();
        window.startGame(); // Reinicia o jogo certo
    });
});

function updateScore() {
    document.getElementById('local-score').innerText = `SCORE: ${score.toString().padStart(6, '0')}`;
}

// --- CONTROLES DE TECLADO (Sem rolar a página) ---
const keys = {};
window.addEventListener('keydown', e => {
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
        e.preventDefault(); // Impede o site de rolar
    }
    keys[e.code] = true;
});
window.addEventListener('keyup', e => keys[e.code] = false);

// --- MOTOR PRINCIPAL GLOBAL ---
window.startGame = function () {
    if (window.gameLoopId) cancelAnimationFrame(window.gameLoopId);
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (currentGame === 'space') initSpace();
    else if (currentGame === 'tennis') initTennis();
    else if (currentGame === 'tetris') initTetris();
};

// ==========================================
// JOGO 1: SPACE
// ==========================================
function initSpace() {
    let gameState = 'start'; // Estados: start, playing, gameover
    let player = { x: 180, y: 440, width: 40, height: 20, speed: 5 };
    let bullets = [];
    let enemies = [];
    let lastShot = 0;
    let lastEnemySpawn = 0;
    let frameCount = 0;

    function resetGame() {
        player.x = 180;
        bullets = [];
        enemies = [];
        score = 0;
        updateScore();
        gameState = 'playing';
        lastEnemySpawn = Date.now();
        frameCount = 0;
    }

    function loop() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // --- TELA INICIAL ---
        if (gameState === 'start') {
            ctx.fillStyle = '#fff';
            ctx.font = '14px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            ctx.fillText("SPACE DEFENDER", canvas.width / 2, canvas.height / 2 - 20);

            ctx.font = '10px "Press Start 2P", monospace';
            // Efeito piscante
            if (Math.floor(Date.now() / 500) % 2 === 0) {
                ctx.fillText("PRESS SPACE TO PLAY", canvas.width / 2, canvas.height / 2 + 20);
            }

            if (keys['Space']) {
                resetGame();
                keys['Space'] = false; // Evita que dispare logo no início
            }
        }
        // --- TELA GAME OVER ---
        else if (gameState === 'gameover') {
            ctx.fillStyle = '#fff';
            ctx.font = '16px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);

            ctx.font = '10px "Press Start 2P", monospace';
            if (Math.floor(Date.now() / 500) % 2 === 0) {
                ctx.fillText("PRESS SPACE TO RESTART", canvas.width / 2, canvas.height / 2 + 20);
            }

            if (keys['Space']) {
                resetGame();
                keys['Space'] = false;
            }
        }
        // --- JOGO A DECORRER ---
        else if (gameState === 'playing') {
            // 1. Pontuação baseada no tempo de sobrevivência
            frameCount++;
            if (frameCount % 6 === 0) { // Aumenta o score a cada 6 frames (~10x por segundo)
                score += 1;
                updateScore();
            }

            // 2. Movimento do Jogador
            if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
            if (keys['ArrowRight'] && player.x < canvas.width - player.width) player.x += player.speed;

            // 3. Disparo
            if (keys['Space'] && Date.now() - lastShot > 300) {
                bullets.push({ x: player.x + player.width / 2 - 2, y: player.y, width: 4, height: 10 });
                lastShot = Date.now();
            }

            // Desenhar Jogador (Nave)
            ctx.fillStyle = '#fff';
            ctx.fillRect(player.x, player.y, player.width, player.height); // Corpo
            ctx.fillRect(player.x + 15, player.y - 10, 10, 10); // Bico da nave

            // 4. Lógica dos Disparos (Balas)
            bullets.forEach((b, index) => {
                b.y -= 8;
                ctx.fillRect(b.x, b.y, b.width, b.height);
                if (b.y < 0) bullets.splice(index, 1);
            });

            // 5. Spawn Aleatório de Inimigos
            // Naves aparecem entre cada 0.4s e 1.2s
            if (Date.now() - lastEnemySpawn > Math.random() * 800 + 400) {
                enemies.push({
                    x: Math.random() * (canvas.width - 20), // Posição X aleatória
                    y: -20, // Nascem fora do ecrã em cima
                    width: 20,
                    height: 15,
                    speed: Math.random() * 2 + 1.5 // Velocidade aleatória para cada nave
                });
                lastEnemySpawn = Date.now();
            }

            // 6. Lógica dos Inimigos
            for (let i = enemies.length - 1; i >= 0; i--) {
                let e = enemies[i];
                e.y += e.speed; // Move para baixo
                ctx.fillRect(e.x, e.y, e.width, e.height);

                // Verifica colisão com os disparos do jogador
                let hit = false;
                for (let j = bullets.length - 1; j >= 0; j--) {
                    let b = bullets[j];
                    if (b.x < e.x + e.width && b.x + b.width > e.x && b.y < e.y + e.height && b.y + b.height > e.y) {
                        bullets.splice(j, 1); // Destrói a bala
                        hit = true;
                        break;
                    }
                }

                if (hit) {
                    enemies.splice(i, 1); // Destrói a nave inimiga (já não dá score, é só sobrevivência!)
                    continue;
                }

                // Verifica Condição de GAME OVER (Inimigo tocou no jogador ou passou a linha do bico da nave)
                // A linha do bico da nave é: player.y - 10
                let passLine = (e.y + e.height >= player.y - 10);

                if (passLine) {
                    gameState = 'gameover';
                }
            }
        }

        window.gameLoopId = requestAnimationFrame(loop);
    }
    loop();
} 

// ==========================================
// JOGO 2: TENNIS (PONG)
// ==========================================
function initTennis() {
    let p1 = { x: 20, y: 200, width: 10, height: 60, speed: 6 };
    let p2 = { x: 370, y: 200, width: 10, height: 60, speed: 4 };
    let ball = { x: 200, y: 240, size: 10, dx: 4, dy: 4 };

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (keys['ArrowUp'] && p1.y > 0) p1.y -= p1.speed;
        if (keys['ArrowDown'] && p1.y < canvas.height - p1.height) p1.y += p1.speed;

        if (ball.y < p2.y + p2.height / 2) p2.y -= p2.speed;
        if (ball.y > p2.y + p2.height / 2) p2.y += p2.speed;

        ball.x += ball.dx; ball.y += ball.dy;

        if (ball.y <= 0 || ball.y >= canvas.height - ball.size) ball.dy *= -1;

        if (ball.x <= p1.x + p1.width && ball.y + ball.size >= p1.y && ball.y <= p1.y + p1.height) {
            ball.dx *= -1; ball.x = p1.x + p1.width; score += 10; updateScore();
        }
        if (ball.x + ball.size >= p2.x && ball.y + ball.size >= p2.y && ball.y <= p2.y + p2.height) {
            ball.dx *= -1; ball.x = p2.x - ball.size;
        }

        if (ball.x < 0 || ball.x > canvas.width) { ball.x = 200; ball.y = 240; } // Ponto (Reset)

        ctx.fillStyle = '#fff';
        ctx.fillRect(p1.x, p1.y, p1.width, p1.height);
        ctx.fillRect(p2.x, p2.y, p2.width, p2.height);
        ctx.fillRect(ball.x, ball.y, ball.size, ball.size);

        window.gameLoopId = requestAnimationFrame(loop);
    }
    loop();
}

// ==========================================
// JOGO 3: TETRIS (Placeholder)
// ==========================================
function initTetris() {
    ctx.fillStyle = '#fff';
    ctx.font = '16px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText("TETRIS ENGINE", canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText("LOADING...", canvas.width / 2, canvas.height / 2 + 20);
}