class Game {
    constructor(x, y, size) {
        this.isPlaying = true
        this.snake = new Snake(x, y, size)
        this.apple = new Apple(this.snake)
    }

    rebootApple(){
        this.apple = new Apple(this.snake)
    }
}

class Snake {
    constructor(x, y, size) {
        // Posición actual (inicio) de la serpiente
        this.x = x;
        this.y = y;
        // Tamaño de inicio de la serpiente
        this.size = size;
        // Cola actual de la serpiente (1 (cabeza))
        this.tail = [
            {   x: this.x, 
                y: this.y 
            }
        ];
        // Posición actual de orientación (abajo)
        this.rotateX = 0;
        this.rotateY = 1;
    }

    move(){
        var newRect;
        var auxTail = {x: 0, y: 0} 
        if (this.tail.at(-1)) {
            auxTail.x = this.tail.at(-1).x
            auxTail.y = this.tail.at(-1).y
        }
        if(this.rotateX == 1){
            newRect = {
                x: auxTail.x + this.size,
                y: auxTail.y
            }
        } else if(this.rotateX == -1){
            newRect = {
                x: auxTail.x - this.size,
                y: auxTail.y
            }
        } else if(this.rotateY == 1){
            newRect = {
                x: auxTail.x,
                y: auxTail.y + this.size
            }
        } else if(this.rotateY == -1){
            newRect = {
                x: auxTail.x,
                y: auxTail.y - this.size
            }
        }
        // Borramos la cola
        this.tail.shift()
        // Añadimos nuevo movimiento
        this.tail.push(newRect)
    }
}

class Apple {
    constructor(snake) {
        var isTouching;
        while(true){
            isTouching = false;
            this.x = Math.floor(Math.random() * canvas.width / snake.size) * snake.size;
            this.y = Math.floor(Math.random() * canvas.height / snake.size) * snake.size;
            // Buscamos si la posición dada coincide con la serpiente
            isTouching = snake.tail.some((e) => e.x === this.x && e.y === this.y);
            // Si no toca, hemos dado con la posición
            if(!isTouching)
                break;
        }
        this.color = "red"
        this.size = snake.size
    }
}

var canvas = document.getElementById('canvas')

const size = canvas.width * 0.05
const x = Math.floor(Math.random() * canvas.width / size) * size;
const y = Math.floor(Math.random() * canvas.width / size) * size;

var game = new Game(x, y, size)

var mensaje = document.getElementById('mensaje')

var buttonNew = document.getElementById('buttonNewGame')

buttonNew.hidden = true
var canvasContext = canvas.getContext('2d')

window.onload = () => {
    gameLoop();
}

const gameLoop = () => {
    setInterval(show, 1000/15)
}

const show = () => {
    if(game.isPlaying){
        if(!update()) {
            game.isPlaying = false
            mensaje.innerHTML = "¡HAS PERDIDO! \nTu puntuación es de " + (game.snake.tail.length + 1)
            buttonNew.hidden = false
        }
        draw()
    }
}

const update = () => {
    canvasContext.clearRect(0,0, canvas.width, canvas.height)
    game.snake.move()
    if(checkIfLose()){
        return false
    }
    checkHitWall()
    eatApple()
    return true
}

const eatApple = () => {
    if(game.snake.tail.at(-1).x == game.apple.x && game.snake.tail.at(-1).y == game.apple.y){
        game.snake.tail.push({ x: game.apple.x, y: game.apple.y})
        game.rebootApple()
    }
}

const checkIfLose = () => {
    var lastMove = game.snake.tail.pop()
    result = game.snake.tail.some((element) => element.x === lastMove.x && element.y === lastMove.y)
    game.snake.tail.push(lastMove)
    return result
}

const checkHitWall = () => {
    if(game.snake.tail.at(-1).x == canvas.width){
        game.snake.tail.at(-1).x = 0
    } else if(game.snake.tail.at(-1).x < 0){
        game.snake.tail.at(-1).x = canvas.width - game.snake.size
    } else if(game.snake.tail.at(-1).y == canvas.height){
        game.snake.tail.at(-1).y = 0
    } else if(game.snake.tail.at(-1).y < 0){
        game.snake.tail.at(-1).y = canvas.height - game.snake.size
    }
}

const draw = () => {
    createRect(0,0, canvas.width, canvas.height, 'black')
    game.snake.tail.forEach( (element) => {
        createRect(element.x + game.snake.size * 0.125, element.y + game.snake.size * 0.125,
            game.snake.size - game.snake.size * 0.25, game.snake.size - game.snake.size * 0.25, 'white');
    });

    canvasContext.font = "20px Arial"
    canvasContext.fillStyle = "#00FF42"
    canvasContext.fillText("Score: " + (game.snake.tail.length + 1), canvas.width - canvas.width * 0.25, canvas.height * 0.05);
    createRect(game.apple.x + game.apple.size * 0.25, game.apple.y + game.apple.size * 0.25, 
        game.apple.size - game.apple.size * 0.5, game.apple.size - game.apple.size * 0.5, game.apple.color)
}

const createRect = (x, y, width, height, color) => {
    canvasContext.fillStyle = color
    canvasContext.fillRect(x, y, width, height)
}

// EVENTS

window.addEventListener("keydown", (event) => {
    setTimeout( () => {
        if(event.code == 'ArrowLeft' && game.snake.rotateX != 1){
            game.snake.rotateX = -1;
            game.snake.rotateY = 0;
        } else if(event.code == 'ArrowUp' && game.snake.rotateY != 1){
            game.snake.rotateX = 0;
            game.snake.rotateY = -1;
        } else if(event.code == 'ArrowRight' && game.snake.rotateX != -1){
            game.snake.rotateX = 1;
            game.snake.rotateY = 0;
        } else if(event.code == 'ArrowDown' && game.snake.rotateY != -1){
            game.snake.rotateX = 0;
            game.snake.rotateY = 1;
        }
    })
})

buttonNew.addEventListener("click", (event) => {
    game = new Game(x, y, size)
    buttonNew.hidden = true
    mensaje.innerHTML = ""
})