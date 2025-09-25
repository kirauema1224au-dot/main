document.getElementById("btn").addEventListener("click", () => {
    // ゲーム開始時にボタンとタイトルを非表示にする
    document.getElementById("btn").style.display = "none";
    document.querySelector("h1").style.display = "none";

    startGame();
});

function startGame() {
    const gameArea = document.createElement("div");
    gameArea.style.position = "fixed";
    gameArea.style.top = "0";
    gameArea.style.left = "0";
    gameArea.style.width = "100%";
    gameArea.style.height = "100%";
    gameArea.style.background = "rgba(0, 0, 0, 0.8)";
    gameArea.style.zIndex = "9999";
    document.body.appendChild(gameArea);

    let score = 0;
    let enemySpeed = 2; // 敵の初期速度
    const scoreDisplay = document.createElement("div");
    scoreDisplay.style.position = "absolute";
    scoreDisplay.style.top = "10px";
    scoreDisplay.style.left = "10px";
    scoreDisplay.style.color = "white";
    scoreDisplay.style.fontSize = "24px";
    scoreDisplay.textContent = "Score: 0";
    gameArea.appendChild(scoreDisplay);

    const player = document.createElement("div");
    player.style.position = "absolute";
    player.style.bottom = "20px";
    player.style.left = "50%";
    player.style.transform = "translateX(-50%)";
    player.style.width = "50px";
    player.style.height = "50px";
    player.style.background = "linear-gradient(90deg, #26c6da 0%, #ab47bc 100%)";
    player.style.borderRadius = "50%";
    gameArea.appendChild(player);

    let playerX = 50; // プレイヤーの初期X位置（パーセンテージ）
    const playerSpeed = 2; // プレイヤーの移動速度

    const movePlayer = (e) => {
        if (e.key === 'a' || e.key === 'A') {
            playerX -= playerSpeed;
        } else if (e.key === 'd' || e.key === 'D') {
            playerX += playerSpeed;
        }

        // プレイヤーが画面外に出ないようにする
        if (playerX < 0) playerX = 0;
        if (playerX > 100) playerX = 100;

        player.style.left = playerX + '%';
    };

    document.addEventListener('keydown', movePlayer);

    const gameIntervals = []; // ゲーム内のインターバルを管理する配列

    const createEnemy = () => {
        const enemy = document.createElement("div");
        enemy.classList.add("enemy"); // 敵を識別するためのクラス
        enemy.style.position = "absolute";
        enemy.style.top = "-50px"; // 画面上部外からスタート
        enemy.style.left = Math.random() * 100 + "%"; // ランダムな横位置
        enemy.style.transform = "translateX(-50%)";
        enemy.style.width = "50px";
        enemy.style.height = "50px";
        enemy.style.background = "radial-gradient(circle, #f44336, #d32f2f)";
        enemy.style.borderRadius = "10px";
        gameArea.appendChild(enemy);

        const moveEnemy = setInterval(() => {
            const enemyTop = parseInt(enemy.style.top);
            if (enemyTop > window.innerHeight) {
                clearInterval(moveEnemy);
                enemy.remove();
            } else {
                enemy.style.top = enemyTop + enemySpeed + "px"; // 敵の速度を適用
            }
        }, 16);
        gameIntervals.push(moveEnemy);

        // スコアが20以上なら、この敵は攻撃する
        if (score >= 20) {
            const attackInterval = setInterval(() => createEnemyBullet(enemy), 1800);
            gameIntervals.push(attackInterval);
            // 攻撃していることを示す目印（データ属性）
            enemy.dataset.isAttacking = "true";
        }
    };

    const createEnemyBullet = (enemy) => {
        if (!enemy.parentNode) return; // 敵がすでに倒されていたら何もしない

        const enemyRect = enemy.getBoundingClientRect();
        const bullet = document.createElement("div");
        bullet.classList.add("enemy-bullet"); // 敵の弾を識別するクラス
        bullet.style.position = "absolute";
        bullet.style.top = enemyRect.bottom + "px";
        bullet.style.left = (enemyRect.left + enemyRect.width / 2 - 3) + "px"; // 敵の中央から
        bullet.style.width = "6px";
        bullet.style.height = "12px";
        bullet.style.background = "#ffeb3b"; // 黄色い弾
        bullet.style.borderRadius = "3px";
        gameArea.appendChild(bullet);

        const moveBullet = setInterval(() => {
            const bulletTop = parseInt(bullet.style.top);
            if (bulletTop > window.innerHeight) {
                clearInterval(moveBullet);
                bullet.remove();
            } else {
                bullet.style.top = (bulletTop + 4) + "px"; // 弾の落下速度
            }
        }, 16);
        gameIntervals.push(moveBullet);
    };

    // 1.5秒ごとに敵を生成
    let enemyCreationInterval = setInterval(createEnemy, 1500);
    gameIntervals.push(enemyCreationInterval);

    const checkCollision = (bullet, bulletInterval) => {
        // 弾が存在しない場合は処理を中断
        if (!bullet.parentNode) {
            return;
        }
        document.querySelectorAll('.enemy').forEach(enemy => {
            // 敵か弾がすでにシーンから削除されている場合は判定しない
            if (!enemy.parentNode || !bullet.parentNode) {
                return;
            }

            const rect1 = bullet.getBoundingClientRect();
            const rect2 = enemy.getBoundingClientRect();
            if (!(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom)) {
                enemy.remove();
                bullet.remove();
                clearInterval(bulletInterval);
                score++;
                scoreDisplay.textContent = "Score: " + score;
                // 5点ごとに敵を強化
                if (score % 5 === 0) {
                    enemySpeed += 0.5;
                }
                // スコアがちょうど20になった瞬間に、画面上の既存の敵も攻撃を開始させる
                if (score === 20) {
                    document.querySelectorAll('.enemy').forEach(existingEnemy => {
                        if (!existingEnemy.dataset.isAttacking) {
                            const attackInterval = setInterval(() => createEnemyBullet(existingEnemy), 1800);
                            gameIntervals.push(attackInterval);
                            existingEnemy.dataset.isAttacking = "true";
                        }
                    });
                }
            }
        });
    };

    const gameOver = () => {
        // すべてのインターバルをクリアしてゲームの動きを止める
        gameIntervals.forEach(interval => clearInterval(interval));
        gameIntervals.length = 0; // 配列を空にする

        // イベントリスナーを削除
        document.removeEventListener('keydown', movePlayer);
        gameArea.removeEventListener("click", shoot);

        // ゲームオーバー画面を作成
        const gameOverScreen = document.createElement("div");
        gameOverScreen.style.position = "absolute";
        gameOverScreen.style.top = "50%";
        gameOverScreen.style.left = "50%";
        gameOverScreen.style.transform = "translate(-50%, -50%)";
        gameOverScreen.style.color = "white";
        gameOverScreen.style.textAlign = "center";
        gameOverScreen.style.zIndex = "10000";

        const gameOverText = document.createElement("h2");
        gameOverText.textContent = "GAME OVER";
        gameOverText.style.fontSize = "48px";
        gameOverText.style.margin = "0";
        gameOverScreen.appendChild(gameOverText);

        const finalScoreText = document.createElement("p");
        finalScoreText.textContent = "Final Score: " + score;
        finalScoreText.style.fontSize = "24px";
        gameOverScreen.appendChild(finalScoreText);

        const retryButton = document.createElement("button");
        retryButton.textContent = "リトライ";
        // index.htmlのボタンのスタイルを参考に適用
        Object.assign(retryButton.style, {
            background: "linear-gradient(90deg, #26c6da 0%, #ab47bc 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "30px",
            padding: "18px 48px",
            fontSize: "1.3rem",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: "20px"
        });
        retryButton.onclick = () => {
            gameArea.remove();
            startGame(); // ゲームを再開
        };
        gameOverScreen.appendChild(retryButton);

        gameArea.appendChild(gameOverScreen);
    };

    const shoot = () => {
        const bullet = document.createElement("div");
        bullet.style.position = "absolute";
        bullet.style.bottom = "70px";
        bullet.style.left = playerX + "%";
        bullet.style.transform = "translateX(-50%)";
        bullet.style.width = "10px";
        bullet.style.height = "20px";
        bullet.style.background = "#fff";
        gameArea.appendChild(bullet);

        const moveBullet = setInterval(() => {
            const bulletTop = parseInt(bullet.style.bottom);
            if (bulletTop > window.innerHeight) {
                clearInterval(moveBullet);
                if (bullet.parentNode) { // 衝突後、すでに削除されていないか確認
                    bullet.remove();
                }
            } else {
                bullet.style.bottom = bulletTop + 5 + "px";
                checkCollision(bullet, moveBullet); // 弾が動くたびに衝突判定
            }
        }, 16);
        gameIntervals.push(moveBullet);
    };

    gameArea.addEventListener("click", shoot);

    // プレイヤーと敵の衝突判定
    const checkPlayerCollision = () => {
        const playerRect = player.getBoundingClientRect();
        // 敵本体との衝突
        document.querySelectorAll('.enemy').forEach(enemy => {
            const enemyRect = enemy.getBoundingClientRect();
            // 衝突判定
            if (!(playerRect.right < enemyRect.left || playerRect.left > enemyRect.right || playerRect.bottom < enemyRect.top || playerRect.top > enemyRect.bottom)) {
                gameOver(); // 衝突したらゲームオーバー
            }
        });
        // 敵の弾との衝突
        document.querySelectorAll('.enemy-bullet').forEach(bullet => {
            const bulletRect = bullet.getBoundingClientRect();
            if (!(playerRect.right < bulletRect.left || playerRect.left > bulletRect.right || playerRect.bottom < bulletRect.top || playerRect.top > bulletRect.bottom)) {
                gameOver(); // 衝突したらゲームオーバー
            }
        });
    };

    // 100msごとにプレイヤーと敵の衝突をチェック
    const playerCollisionInterval = setInterval(checkPlayerCollision, 100);
    gameIntervals.push(playerCollisionInterval);
}