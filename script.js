// Start of Selection
document.getElementById("btn").addEventListener("click", () => {
    // ゲームエリアの作成
    const gameArea = document.createElement("div");
    gameArea.style.position = "fixed";
    gameArea.style.top = "0";
    gameArea.style.left = "0";
    gameArea.style.width = "100%";
    gameArea.style.height = "100%";
    gameArea.style.background = "rgba(0, 0, 0, 0.8)";
    gameArea.style.zIndex = "9999";
    document.body.appendChild(gameArea);

    // プレイヤーの作成
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

    // 弾を発射する関数
    const shoot = () => {
        const bullet = document.createElement("div");
        bullet.className = "bullet"; // 当たり判定用にクラスを追加
        bullet.style.position = "absolute";
        bullet.style.bottom = "70px";
        // プレイヤーの現在の位置から発射
        bullet.style.left = player.style.left;
        bullet.style.transform = player.style.transform;
        bullet.style.width = "10px";
        bullet.style.height = "20px";
        bullet.style.background = "#fff";
        gameArea.appendChild(bullet);

        // 弾を動かす処理
        const moveBullet = setInterval(() => {
            const bulletBottom = parseInt(bullet.style.bottom);
            if (bulletBottom > window.innerHeight) {
                clearInterval(moveBullet);
                bullet.remove();
            } else {
                bullet.style.bottom = bulletBottom + 10 + "px";

                // 当たり判定
                const enemies = document.querySelectorAll(".enemy");
                const bulletRect = bullet.getBoundingClientRect();
                enemies.forEach(enemy => {
                    const enemyRect = enemy.getBoundingClientRect();
                    // 矩形が重なっているかチェック
                    if (bulletRect.left < enemyRect.right &&
                        bulletRect.right > enemyRect.left &&
                        bulletRect.top < enemyRect.bottom &&
                        bulletRect.bottom > enemyRect.top) {
                        
                        // 衝突したら敵と弾を消す
                        enemy.remove();
                        bullet.remove();
                        clearInterval(moveBullet); // 弾の動きを止める
                    }
                });
            }
        }, 16); // 約60fps
    };

    // 敵を作成する関数
    const createEnemy = () => {
        const enemy = document.createElement("div");
        enemy.className = "enemy"; // 当たり判定用にクラスを追加
        enemy.style.position = "absolute";
        enemy.style.top = "-50px"; // 画面外からスタート
        enemy.style.left = Math.random() * (window.innerWidth - 50) + "px"; // 横位置をランダムに
        enemy.style.width = "50px";
        enemy.style.height = "50px";
        enemy.style.background = "linear-gradient(135deg, #f44336, #e91e63)";
        enemy.style.borderRadius = "10px";
        gameArea.appendChild(enemy);

        // 敵を動かす処理
        const moveEnemy = setInterval(() => {
            const enemyTop = parseInt(enemy.style.top);
            if (enemyTop > window.innerHeight) {
                clearInterval(moveEnemy);
                enemy.remove();
            } else {
                enemy.style.top = enemyTop + 3 + "px";
            }
        }, 16);
    };

    // 1.5秒ごとに敵を生成
    const enemyInterval = setInterval(createEnemy, 1500);

    // クリックで弾を発射
    gameArea.addEventListener("click", shoot);

    // ゲームを終了する関数
    const closeGame = () => {
        // 生成ループを停止
        clearInterval(enemyInterval);
        // ゲームエリア内の全ての要素（弾、敵の移動インターバル）を止める必要があるが、
        // 簡単のため、ここではエリアごと削除する
        gameArea.remove();
    };

    // ゲームを30秒後に終了
    setTimeout(closeGame, 30000);
});