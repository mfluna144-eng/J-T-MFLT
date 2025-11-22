document.addEventListener('DOMContentLoaded', () => {

    let apodo = prompt("Ingrese su apodo:");
    if (!apodo) apodo = "Jugador";

    const pixelBot = document.getElementById("pixel-bot");
    const juegoContenedor = document.getElementById("juego-contenedor");
    const mensajeJuego = document.getElementById("mensaje-juego");
    const puntuacionDisplay = document.getElementById("puntuacion");
    const suelo = document.getElementById("suelo");

    let isJumping = false;
    let botBottom = 30;
    let score = 0;
    let nivel = 1;
    let gameOver = true;
    let obstacleInterval;

    const gameWidth = 900;

    // ⚡ CREA CHISPAS DE ELECTRICIDAD
    function crearChispas() {
        for (let i = 0; i < 10; i++) {

            let chispa = document.createElement("div");
            chispa.classList.add("chispa");

            chispa.style.left = (pixelBot.offsetLeft + 10 + Math.random() * 50) + "px";
            chispa.style.top = (pixelBot.offsetTop + 10 + Math.random() * 50) + "px";

            juegoContenedor.appendChild(chispa);

            setTimeout(() => chispa.remove(), 300);
        }
    }

    // 🟦 SALTO DEL PERSONAJE
    function jump() {
        if (isJumping || gameOver) return;
        isJumping = true;

        let jumpHeight = 150;
        let jumpSpeed = 10;
        let currentJumpHeight = 0;

        const upTimerId = setInterval(() => {
            if (currentJumpHeight >= jumpHeight) {
                clearInterval(upTimerId);

                const downTimerId = setInterval(() => {
                    if (botBottom <= 30) {
                        clearInterval(downTimerId);
                        botBottom = 30;
                        pixelBot.style.bottom = botBottom + 'px';
                        isJumping = false;
                    }
                    botBottom -= jumpSpeed;
                    pixelBot.style.bottom = botBottom + 'px';
                }, 20);
            }

            botBottom += jumpSpeed;
            currentJumpHeight += jumpSpeed;
            pixelBot.style.bottom = botBottom + 'px';
        }, 20);
    }

    // 🌗 CAMBIO DE NIVEL + DÍA/NOCHE
    function actualizarNivelYFondo() {
        if (score % 5 === 0) {
            nivel = score / 5 + 1;

            if (nivel % 2 === 0) {
                juegoContenedor.style.background =
                    "linear-gradient(#0A0F24, #1C1C3C)"; // NOCHE
            } else {
                juegoContenedor.style.background =
                    "linear-gradient(#87CEEB, #FFFFFF)"; // DÍA
            }
        }
    }

    // 🟥 GENERAR OBSTÁCULO
    function generarObstaculo() {
        if (gameOver) return;

        let obstaclePosition = gameWidth;
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstaculo');
        juegoContenedor.appendChild(obstacle);

        let velocidad = 10 + (nivel - 1) * 2;

        const moverObstaculo = setInterval(() => {

            // Obstáculo salió → punto
            if (obstaclePosition < -30) {
                clearInterval(moverObstaculo);
                juegoContenedor.removeChild(obstacle);

                score++;
                actualizarNivelYFondo();

                puntuacionDisplay.textContent =
                    `Jugador: ${apodo} | Puntos: ${score} | Nivel: ${nivel}`;
            }

            // ⚡ COLISIÓN
            if (
                obstaclePosition > 50 &&
                obstaclePosition < 100 &&
                botBottom < 80
            ) {
                clearInterval(moverObstaculo);
                clearInterval(obstacleInterval);
                gameOver = true;

                // ELECTROCUCIÓN
                pixelBot.classList.add("electrocutado");
                crearChispas();

                setTimeout(() => {
                    pixelBot.classList.remove("electrocutado");
                }, 800);

                mensajeJuego.innerHTML =
                    `GAME OVER<br><br>` +
                    `<b>Jugador: ${apodo}</b><br>` +
                    `Puntuación final: <b>${score}</b><br>` +
                    `Nivel alcanzado: <b>${nivel}</b><br><br>` +
                    `<span style="font-size:18px">Presione ESPACIO para reiniciar</span>`;

                mensajeJuego.style.display = 'block';
                suelo.style.animationPlayState = 'pause';
            }

            obstaclePosition -= velocidad;
            obstacle.style.left = obstaclePosition + 'px';
        }, 20);
    }

    // 🟩 INICIAR JUEGO
    function iniciarJuego() {
        if (!gameOver) return;

        document.querySelectorAll('.obstaculo').forEach(obs => obs.remove());
        score = 0;
        nivel = 1;

        puntuacionDisplay.textContent =
            `Jugador: ${apodo} | Puntos: 0 | Nivel: 1`;

        botBottom = 30;
        pixelBot.style.bottom = botBottom + 'px';
        isJumping = false;
        gameOver = false;

        mensajeJuego.style.display = 'none';
        suelo.style.animationPlayState = 'running';

        juegoContenedor.style.background =
            "linear-gradient(#87CEEB, #FFFFFF)";

        obstacleInterval = setInterval(generarObstaculo, 2000);
    }

    // 🟧 CONTROLES
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            iniciarJuego();
        } else {
            jump();
        }
    });

    mensajeJuego.style.display = 'block';
    suelo.style.animationPlayState = 'pause';
});
