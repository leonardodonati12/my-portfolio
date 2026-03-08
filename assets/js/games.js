const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const tabs = document.querySelectorAll('.game-tab');

let currentGame = 'space';
window.gameLoopId = null; // Agora é global para o site conseguir pausar!
let score = 0;
let highScore = 0; // [NOVO] Variável para o recorde

// [NOVO] Recordes Genéricos Iniciais (Estilo Fliperama)
const genericHighScores = {
    'space': 122324,
    'tetris': 89920,
    'tennis': 45500
};

// [NOVO] Função para carregar o recorde (local ou genérico)
function loadHighScore() {
    let savedScore = localStorage.getItem('arcade_highscore_' + currentGame);
    if (savedScore) {
        highScore = parseInt(savedScore);
    } else {
        highScore = genericHighScores[currentGame];
    }
    const globalScoreEl = document.getElementById('global-score');
    if (globalScoreEl) globalScoreEl.innerText = `GLOBAL SCORE: ${highScore.toString().padStart(6, '0')}`;
}

// --- CONTROLES DA ABA ---
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentGame = tab.getAttribute('data-game');
        score = 0;
        loadHighScore(); // [NOVO] Carrega o recorde da aba selecionada
        updateScore();
        window.startGame(); // Reinicia o jogo certo
    });
});

function updateScore() {
    document.getElementById('local-score').innerText = `SCORE: ${score.toString().padStart(6, '0')}`;
    
    // [NOVO] Verifica se bateu o recorde e atualiza a tela/memória
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('arcade_highscore_' + currentGame, highScore);
        const globalScoreEl = document.getElementById('global-score');
        if (globalScoreEl) globalScoreEl.innerText = `GLOBAL SCORE: ${highScore.toString().padStart(6, '0')}`;
    }
}

// [NOVO] Carrega o recorde da aba inicial (Space) logo que abre
loadHighScore();

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
// JOGO 1: SPACE (Pixel Art, Mais Lento e Score por Tempo)
// ==========================================
function initSpace() {
    let gameState = 'start';
    let player = { x: 180, y: 440, width: 40, height: 20, speed: 5 };
    let bullets = [];
    let enemies = [];
    let lastShot = 0;
    let lastEnemySpawn = 0;
    let frameCount = 0;

    function resetGame() {
        player.x = 180; bullets = []; enemies = []; score = 0; updateScore();
        gameState = 'playing'; lastEnemySpawn = Date.now(); frameCount = 0;
    }

    function loop() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (gameState === 'start') {
            ctx.fillStyle = '#fff'; ctx.font = '16px "Press Start 2P", monospace'; ctx.textAlign = 'center';
            ctx.fillText("SPACE DEFENDER", canvas.width / 2, canvas.height / 2 - 20);
            ctx.font = '10px "Press Start 2P", monospace';
            if (Math.floor(Date.now() / 500) % 2 === 0) ctx.fillText("PRESS SPACE TO PLAY", canvas.width / 2, canvas.height / 2 + 20);
            if (keys['Space']) { resetGame(); keys['Space'] = false; }
        } else if (gameState === 'gameover') {
            ctx.fillStyle = '#fff'; ctx.font = '16px "Press Start 2P", monospace'; ctx.textAlign = 'center';
            ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);
            ctx.font = '10px "Press Start 2P", monospace';
            if (Math.floor(Date.now() / 500) % 2 === 0) ctx.fillText("PRESS SPACE TO RESTART", canvas.width / 2, canvas.height / 2 + 20);
            if (keys['Space']) { resetGame(); keys['Space'] = false; }
        } else if (gameState === 'playing') {
            frameCount++;
            if (frameCount % 6 === 0) { score += 1; updateScore(); }

            // Movimento do Jogador
            if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
            if (keys['ArrowRight'] && player.x < canvas.width - player.width) player.x += player.speed;
            if (keys['Space'] && Date.now() - lastShot > 300) {
                bullets.push({ x: player.x + player.width / 2 - 2, y: player.y, width: 4, height: 10 }); lastShot = Date.now();
            }

            // [NOVO] Nave Melhorada (Aerodinâmica e com propulsor)
            ctx.fillStyle = '#fff';
            ctx.fillRect(player.x + 16, player.y, 8, 6); // Bico/Canhão principal
            ctx.fillRect(player.x + 12, player.y + 6, 16, 10); // Corpo central
            ctx.fillRect(player.x + 4, player.y + 10, 8, 6); // Asa esquerda (superior)
            ctx.fillRect(player.x, player.y + 14, 8, 6); // Ponta da asa esquerda
            ctx.fillRect(player.x + 28, player.y + 10, 8, 6); // Asa direita (superior)
            ctx.fillRect(player.x + 32, player.y + 14, 8, 6); // Ponta da asa direita

            // Fogo do propulsor
            ctx.fillStyle = '#00ff88';
            if (Math.floor(Date.now() / 100) % 2 === 0) {
                ctx.fillRect(player.x + 16, player.y + 16, 8, 4);
            }

            // Balas (Velocidade aumentada de 8 para 16)
            ctx.fillStyle = '#fff';
            bullets.forEach((b, index) => { b.y -= 16; ctx.fillRect(b.x, b.y, b.width, b.height); if (b.y < 0) bullets.splice(index, 1); });

            // Inimigos - Quantidade reduzida (Delay de spawn aumentado)
            if (Date.now() - lastEnemySpawn > Math.random() * 1200 + 800) {
                enemies.push({
                    x: Math.random() * (canvas.width - 24), y: -20, width: 20, height: 16,
                    speed: Math.random() * 0.7 + 0.3 // Velocidade reduzida bruscamente
                });
                lastEnemySpawn = Date.now();
            }

            for (let i = enemies.length - 1; i >= 0; i--) {
                let e = enemies[i];
                e.y += e.speed;

                // Desenho Lúdico do Inimigo (Alien Pixelado)
                ctx.fillStyle = '#fff';
                ctx.fillRect(e.x + 2, e.y, 4, 4); // Antena Esq
                ctx.fillRect(e.x + 14, e.y, 4, 4); // Antena Dir
                ctx.fillRect(e.x, e.y + 4, 20, 8); // Corpo
                ctx.fillStyle = '#000';
                ctx.fillRect(e.x + 4, e.y + 6, 4, 4); // Olho Esq (Vazado preto)
                ctx.fillRect(e.x + 12, e.y + 6, 4, 4); // Olho Dir (Vazado preto)
                ctx.fillStyle = '#fff';
                ctx.fillRect(e.x + 2, e.y + 12, 4, 4); // Perna Esq
                ctx.fillRect(e.x + 14, e.y + 12, 4, 4); // Perna Dir

                // Colisão com Balas
                let hit = false;
                for (let j = bullets.length - 1; j >= 0; j--) {
                    let b = bullets[j];
                    if (b.x < e.x + e.width && b.x + b.width > e.x && b.y < e.y + e.height && b.y + b.height > e.y) {
                        bullets.splice(j, 1); hit = true; break;
                    }
                }
                if (hit) { enemies.splice(i, 1); continue; }

                // GAME OVER (Se a base do inimigo passar da ponta da arma do jogador)
                if (e.y + e.height >= player.y) gameState = 'gameover';
            }
        }
        window.gameLoopId = requestAnimationFrame(loop);
    }
    loop();
}

// ==========================================
// JOGO 2: TENNIS (-50% vel, Start/Over e Score por Tempo)
// ==========================================
function initTennis() {
    let gameState = 'start';
    let p1 = { x: 20, y: 200, width: 10, height: 60, speed: 6 };
    let p2 = { x: 370, y: 200, width: 10, height: 60, speed: 4 };
    let ball = { x: 200, y: 240, size: 10, dx: 2, dy: 2 }; // [NOVO] Velocidade de 4 para 2 (-50%)
    let frameCount = 0;

    function resetGame() {
        p1.y = 200; p2.y = 200; ball.x = 200; ball.y = 240; ball.dx = 2; ball.dy = 2;
        score = 0; updateScore(); frameCount = 0; gameState = 'playing';
    }

    function loop() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (gameState === 'start') {
            ctx.fillStyle = '#fff'; ctx.font = '16px "Press Start 2P", monospace'; ctx.textAlign = 'center';
            ctx.fillText("TENNIS DEFENDER", canvas.width / 2, canvas.height / 2 - 20);
            ctx.font = '10px "Press Start 2P", monospace';
            if (Math.floor(Date.now() / 500) % 2 === 0) ctx.fillText("PRESS SPACE TO PLAY", canvas.width / 2, canvas.height / 2 + 20);
            if (keys['Space']) { resetGame(); keys['Space'] = false; }
        } else if (gameState === 'gameover') {
            ctx.fillStyle = '#fff'; ctx.font = '16px "Press Start 2P", monospace'; ctx.textAlign = 'center';
            ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);
            ctx.font = '10px "Press Start 2P", monospace';
            if (Math.floor(Date.now() / 500) % 2 === 0) ctx.fillText("PRESS SPACE TO RESTART", canvas.width / 2, canvas.height / 2 + 20);
            if (keys['Space']) { resetGame(); keys['Space'] = false; }
        } else if (gameState === 'playing') {
            frameCount++;
            if (frameCount % 6 === 0) { score += 1; updateScore(); } // Score sobrevivência

            if (keys['ArrowUp'] && p1.y > 0) p1.y -= p1.speed;
            if (keys['ArrowDown'] && p1.y < canvas.height - p1.height) p1.y += p1.speed;

            // CPU Acompanha suavemente
            if (ball.y < p2.y + p2.height / 2) p2.y -= p2.speed;
            if (ball.y > p2.y + p2.height / 2) p2.y += p2.speed;

            ball.x += ball.dx; ball.y += ball.dy;

            // Rebate Teto e Chão
            if (ball.y <= 0 || ball.y >= canvas.height - ball.size) ball.dy *= -1;

            // Rebate Raquetes
            if (ball.x <= p1.x + p1.width && ball.y + ball.size >= p1.y && ball.y <= p1.y + p1.height) {
                ball.dx *= -1; ball.x = p1.x + p1.width;
            }
            if (ball.x + ball.size >= p2.x && ball.y + ball.size >= p2.y && ball.y <= p2.y + p2.height) {
                ball.dx *= -1; ball.x = p2.x - ball.size;
            }

            // O CPU não perde, mas se a bola passar de você (Esquerda), GAME OVER!
            if (ball.x < 0) gameState = 'gameover';
            if (ball.x > canvas.width) { ball.dx *= -1; ball.x = canvas.width - ball.size; } // Rebate se a CPU falhar

            ctx.fillStyle = '#fff';
            ctx.fillRect(p1.x, p1.y, p1.width, p1.height);
            ctx.fillRect(p2.x, p2.y, p2.width, p2.height);
            ctx.fillRect(ball.x, ball.y, ball.size, ball.size);
        }

        window.gameLoopId = requestAnimationFrame(loop);
    }
    loop();
}

// ==========================================
// JOGO 3: TETRIS (Tela Inteira!)
// ==========================================
function initTetris() {
    let gameState = 'start';

    // [NOVO] A matemática perfeita: blocos de 20px preenchem a tela de 400x480 sem deixar bordas!
    let blockSize = 20;
    let cols = canvas.width / blockSize;  // 20 colunas
    let rows = canvas.height / blockSize; // 24 linhas

    let grid = [], frameCount = 0, dropCounter = 0, lastMoveTime = 0, lastUpState = false;

    // As peças clássicas do Tetris
    const tetrominos = [
        [[1, 1, 1, 1]], // I
        [[1, 1], [1, 1]], // O
        [[0, 1, 0], [1, 1, 1]], // T
        [[1, 0, 0], [1, 1, 1]], // L
        [[0, 0, 1], [1, 1, 1]], // J
        [[0, 1, 1], [1, 1, 0]], // S
        [[1, 1, 0], [0, 1, 1]]  // Z
    ];

    let piece = { matrix: [], x: 0, y: 0 };

    function createGrid() { grid = Array(rows).fill().map(() => Array(cols).fill(0)); }

    function spawnPiece() {
        piece.matrix = tetrominos[Math.floor(Math.random() * tetrominos.length)];
        piece.y = 0;
        piece.x = Math.floor(cols / 2) - Math.floor(piece.matrix[0].length / 2); // Nasce no meio exato
        if (collide()) gameState = 'gameover'; // Morre se não houver espaço para nascer
    }

    function collide() {
        for (let y = 0; y < piece.matrix.length; y++) {
            for (let x = 0; x < piece.matrix[y].length; x++) {
                if (piece.matrix[y][x] !== 0) {
                    let gx = piece.x + x, gy = piece.y + y;
                    if (gx < 0 || gx >= cols || gy >= rows || (gy >= 0 && grid[gy][gx] !== 0)) return true;
                }
            }
        }
        return false;
    }

    function merge() {
        for (let y = 0; y < piece.matrix.length; y++) {
            for (let x = 0; x < piece.matrix[y].length; x++) {
                if (piece.matrix[y][x] !== 0 && piece.y + y >= 0) grid[piece.y + y][piece.x + x] = 1;
            }
        }
    }

    function clearLines() {
        for (let y = rows - 1; y >= 0; y--) {
            let isFull = true;
            for (let x = 0; x < cols; x++) { if (grid[y][x] === 0) { isFull = false; break; } }
            if (isFull) {
                grid.splice(y, 1); grid.unshift(Array(cols).fill(0)); y++; // Re-checa a linha que desceu
            }
        }
    }

    function rotate() {
        let rotated = [], N = piece.matrix.length, M = piece.matrix[0].length;
        for (let i = 0; i < M; i++) { rotated.push([]); for (let j = 0; j < N; j++) rotated[i].push(piece.matrix[N - j - 1][i]); }
        let oldMatrix = piece.matrix; piece.matrix = rotated;
        if (collide()) piece.matrix = oldMatrix; // Cancela giro se for bater na parede
    }

    function resetGame() { createGrid(); spawnPiece(); score = 0; updateScore(); frameCount = 0; gameState = 'playing'; }

    function loop() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (gameState === 'start') {
            ctx.fillStyle = '#fff'; ctx.font = '16px "Press Start 2P", monospace'; ctx.textAlign = 'center';
            ctx.fillText("TETRIS", canvas.width / 2, canvas.height / 2 - 20);
            ctx.font = '10px "Press Start 2P", monospace';
            if (Math.floor(Date.now() / 500) % 2 === 0) ctx.fillText("PRESS SPACE TO PLAY", canvas.width / 2, canvas.height / 2 + 20);
            if (keys['Space']) { resetGame(); keys['Space'] = false; }
        } else if (gameState === 'gameover') {
            ctx.fillStyle = '#fff'; ctx.font = '16px "Press Start 2P", monospace'; ctx.textAlign = 'center';
            ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);
            ctx.font = '10px "Press Start 2P", monospace';
            if (Math.floor(Date.now() / 500) % 2 === 0) ctx.fillText("PRESS SPACE TO RESTART", canvas.width / 2, canvas.height / 2 + 20);
            if (keys['Space']) { resetGame(); keys['Space'] = false; }
        } else if (gameState === 'playing') {
            frameCount++;
            if (frameCount % 6 === 0) { score += 1; updateScore(); } // Score sobrevivência

            // Controles
            if (Date.now() - lastMoveTime > 120) {
                if (keys['ArrowLeft']) { piece.x--; if (collide()) piece.x++; lastMoveTime = Date.now(); }
                if (keys['ArrowRight']) { piece.x++; if (collide()) piece.x--; lastMoveTime = Date.now(); }
                if (keys['ArrowDown']) { piece.y++; if (collide()) { piece.y--; merge(); clearLines(); spawnPiece(); } lastMoveTime = Date.now(); }
            }

            if (keys['ArrowUp']) { if (!lastUpState) { rotate(); lastUpState = true; } } else { lastUpState = false; }

            // Gravidade
            dropCounter++;
            if (dropCounter > 35) {
                piece.y++;
                if (collide()) { piece.y--; merge(); clearLines(); spawnPiece(); }
                dropCounter = 0;
            }

            // [NOVO] Desenhar Peças Mortas espalhadas pela tela inteira
            ctx.fillStyle = '#777'; // Um cinza um pouco mais escuro para o "fundo"
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    // O +1 e -2 criam aquele espaço de 1 pixel entre os blocos (estilo tijolo clássico)
                    if (grid[y][x]) ctx.fillRect(x * blockSize + 1, y * blockSize + 1, blockSize - 2, blockSize - 2);
                }
            }

            // [NOVO] Desenhar Peça Viva
            ctx.fillStyle = '#fff'; // Peça caindo sempre branca e brilhante
            for (let y = 0; y < piece.matrix.length; y++) {
                for (let x = 0; x < piece.matrix[y].length; x++) {
                    if (piece.matrix[y][x]) ctx.fillRect((piece.x + x) * blockSize + 1, (piece.y + y) * blockSize + 1, blockSize - 2, blockSize - 2);
                }
            }
        }
        window.gameLoopId = requestAnimationFrame(loop);
    }
    loop();
} 