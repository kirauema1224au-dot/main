// Start of Selection
document.getElementById("btn").addEventListener("click", () => {
    const gameArea = document.createElement("div");
    gameArea.style.position = "fixed";
    gameArea.style.top = "0";
    gameArea.style.left = "0";
    gameArea.style.width = "100%";
    gameArea.style.height = "100%";
    gameArea.style.background = "rgba(0, 0, 0, 0.8)";
    gameArea.style.zIndex = "9999";
    document.body.appendChild(gameArea);

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
                enemy.style.top = enemyTop + 2 + "px";
            }
        }, 16);
        gameIntervals.push(moveEnemy);
    };

    // 1.5秒ごとに敵を生成
    const enemyCreationInterval = setInterval(createEnemy, 1500);
    gameIntervals.push(enemyCreationInterval);

    const checkCollision = (bullet, bulletInterval) => {
        document.querySelectorAll('.enemy').forEach(enemy => {
            const rect1 = bullet.getBoundingClientRect();
            const rect2 = enemy.getBoundingClientRect();
            if (!(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom)) {
                enemy.remove();
                bullet.remove();
                clearInterval(bulletInterval);
            }
        });
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

    const closeGame = () => {
        gameArea.remove();
        document.removeEventListener('keydown', movePlayer); // イベントリスナーを削除
        // すべてのインターバルをクリア
        gameIntervals.forEach(interval => clearInterval(interval));
    };

    setTimeout(closeGame, 10000); // ゲームを10秒後に終了
});