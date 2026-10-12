let game = document.querySelector("#game");
let button = document.querySelector("#create");
let scoreText = document.querySelector("#score");
let timeText = document.querySelector("#time");
let timeInput = document.querySelector("#time-input");

let score = 0;
let figure = null;
let gameInterval = null;
let isPlaying = false;
let lastFigureType = null; // Переменная для хранения типа последней фигуры

button.addEventListener("click", function() {
    if (isPlaying) return; // Если игра уже идет, ничего не делаем

    // Сброс и инициализация игры
    isPlaying = true;
    score = 0;
    scoreText.textContent = score;
    button.disabled = true;
    timeInput.disabled = true;
    lastFigureType = null; // Сбрасываем при новом старте

    let timeLeft = parseInt(timeInput.value) || 10;
    timeText.textContent = timeLeft;

    function spawnFigure() {
        if (!isPlaying) return;

        // Удаляем старую фигуру, если она есть
        if (figure !== null) {
            figure.remove();
        }

        figure = document.createElement("div");
        figure.classList.add("figure");

        let size = Math.floor(Math.random() * 81) + 20;

        let red = Math.floor(Math.random() * 256);
        let green = Math.floor(Math.random() * 256);
        let blue = Math.floor(Math.random() * 256);
        let color = "rgb(" + red + ", " + green + ", " + blue + ")";

        // Выбираем тип фигуры так, чтобы он не повторялся подряд
        let number;
        do {
            number = Math.floor(Math.random() * 3);
        } while (number === lastFigureType);
        
        // Запоминаем текущий тип как последний
        lastFigureType = number;

        if (number == 0) {
            figure.style.width = size + "px";
            figure.style.height = size + "px";
            figure.style.backgroundColor = color;
            figure.style.borderRadius = "50%"; // Круг
        } else if (number == 1) {
            figure.style.width = size + "px";
            figure.style.height = size + "px";
            figure.style.backgroundColor = color; // Квадрат
        } else {
            figure.style.width = "0";
            figure.style.height = "0";
            figure.style.borderLeft = size / 2 + "px solid transparent";
            figure.style.borderRight = size / 2 + "px solid transparent";
            figure.style.borderBottom = size + "px solid " + color; // Треугольник
        }

        let maxX = game.clientWidth - size;
        let maxY = game.clientHeight - size;

        let x = Math.floor(Math.random() * Math.max(1, maxX));
        let y = Math.floor(Math.random() * Math.max(1, maxY));

        figure.style.left = x + "px";
        figure.style.top = y + "px";

        game.append(figure);

        // Клик по фигуре
        figure.onclick = function() {
            if (!isPlaying) return;
            score = score + 1;
            scoreText.textContent = score;
            spawnFigure();
        };
    }

    // Запускаем первую фигуру
    spawnFigure();

    // Таймер обратного отсчета
    gameInterval = setInterval(function() {
        timeLeft--;
        timeText.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(gameInterval);
            stopGame();
        }
    }, 1000);
});

function stopGame() {
    isPlaying = false;
    button.disabled = false;
    timeInput.disabled = false;

    if (figure !== null) {
        figure.remove();
        figure = null;
    }

    alert("Время вышло! Вы набрали очков: " + score);
}