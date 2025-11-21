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

    function jump() {
        if (isJumping) return;
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


    function actualizarNivelYFondo() {

        if (score % 5 === 0) {
            nivel = score / 5 + 1;


            if (nivel % 2 === 0) {

                juegoContenedor.style.background =
                    "linear-gradient(#0A0F24, #1C1C3C)";
            } else {

                juegoContenedor.style.background =
                    "linear-gradient(#87CEEB, #FFFFFF)";
            }
        }
    }

    function generarObstaculo() {
        if (gameOver) return;

        let obstaclePosition = gameWidth;
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstaculo');
        juegoContenedor.appendChild(obstacle);

        const moverObstaculo = setInterval(() => {
            if (obstaclePosition < -30) {
                clearInterval(moverObstaculo);
                juegoContenedor.removeChild(obstacle);


                score++;


                actualizarNivelYFondo();


                puntuacionDisplay.textContent =
                    `Jugador: ${apodo} | Puntos: ${score} | Nivel: ${nivel}`;
            }


            if (
                obstaclePosition > 50 &&
                obstaclePosition < 100 &&
                botBottom < 80
            ) {
                clearInterval(moverObstaculo);
                clearInterval(obstacleInterval);
                gameOver = true;

                mensajeJuego.textContent =
                    `GAME OVER!\nPuntuación final: ${score}\nNivel alcanzado: ${nivel}\nPresione ESPACIO para reiniciar`;
                mensajeJuego.style.display = 'block';
                suelo.style.animationPlayState = 'pause';
            }

            obstaclePosition -= 10;
            obstacle.style.left = obstaclePosition + 'px';
        }, 20);
    }

    function iniciarJuego() {
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
