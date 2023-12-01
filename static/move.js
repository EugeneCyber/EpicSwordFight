//здесь мы проверям движение игрока
const movement = {
    up: false,
    down: false,
    left: false,
    right: false,

    swordLeft: false,
    swordRight: false,
}

//здесь мы проверяем код клавиш
/*document.addEventListener("keydown", (event) => {
    console.log(event.keyCode);
    switch (event.keyCode) {
    }
});*/

//здесь мы смотрим, какие клавиши нажимает игрок
document.addEventListener("keydown", (event) => {
    switch (event.keyCode) {
        //движение игрока
        case 65: //A
            movement.left = true;
            break;
        case 87: //W
            movement.up = true;
            break;
        case 68: //D
            movement.right = true;
            break;
        case 83: //S
            movement.down = true;
            break;

        //поворот меча
        case 37: //меч налево
            movement.swordLeft = true;
            break;
        case 39: //меч вправо
            movement.swordRight = true;
            break;
    }
    
})

//в целом тоже самое
document.addEventListener("keyup", (event) => {
    switch (event.keyCode) {
        //движение игрока
        case 65: //A
            movement.left = false;
            break;
        case 87: //W
            movement.up = false;
            break;
        case 68: //D
            movement.right = false;
            break;
        case 83: //S
            movement.down = false;
            break;

        //поворот меча
        case 37: //меч налево
            movement.swordLeft = false;
            break;
        case 39: //меч вправо
            movement.swordRight = false;
            break;
    }
    
})

//установим обновление движения на 60 раз в секунду
setInterval(() => {
    socket.emit("movement", movement);
}, 1000 / 60);


