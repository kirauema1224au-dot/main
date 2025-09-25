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

    const shoot = () => {
        const bullet = document.createElement("div");
        bullet.style.position = "absolute";
        bullet.style.bottom = "70px";
        bullet.style.left = "50%";
        bullet.style.transform = "translateX(-50%)";
        bullet.style.width = "10px";
        bullet.style.height = "20px";
        bullet.style.background = "#fff";
        gameArea.appendChild(bullet);

        const moveBullet = setInterval(() => {
            const bulletTop = parseInt(bullet.style.bottom);
            if (bulletTop > window.innerHeight) {
                clearInterval(moveBullet);
                bullet.remove();
            } else {
                bullet.style.bottom = bulletTop + 5 + "px";
            }
        }, 16);
    };

    gameArea.addEventListener("click", shoot);

    const closeGame = () => {
        gameArea.remove();
    };

    setTimeout(closeGame, 10000); // ゲームを10秒後に終了
});