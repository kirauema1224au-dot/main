document.getElementById("btn").addEventListener("click", () => {
    const msg = document.createElement("div");
    msg.textContent = "🚀 Git実習スタート！";
    msg.style.position = "fixed";
    msg.style.top = "50%";
    msg.style.left = "50%";
    msg.style.transform = "translate(-50%, -50%) scale(1.2)";
    msg.style.background = "linear-gradient(90deg, #26c6da 0%, #ab47bc 100%)";
    msg.style.color = "#fff";
    msg.style.padding = "32px 64px";
    msg.style.borderRadius = "40px";
    msg.style.fontSize = "2rem";
    msg.style.fontWeight = "bold";
    msg.style.boxShadow = "0 8px 32px rgba(38,198,218,0.25)";
    msg.style.zIndex = "9999";
    msg.style.textAlign = "center";
    msg.style.letterSpacing = "2px";
    msg.style.opacity = "0";
    msg.style.transition = "opacity 0.4s, transform 0.4s";
    document.body.appendChild(msg);

    setTimeout(() => {
        msg.style.opacity = "1";
        msg.style.transform = "translate(-50%, -50%) scale(1.0)";
    }, 10);

    setTimeout(() => {
        msg.style.opacity = "0";
        msg.style.transform = "translate(-50%, -50%) scale(0.95)";
        setTimeout(() => {
            msg.remove();
        }, 400);
    }, 1800);
});