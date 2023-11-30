const socket = io();

const WINDOW_WIDTH = 1250;
const WINDOW_HEIGHT = 550;

//канвас для рисования
const canvas = document.getElementById("canvas");
canvas.width = WINDOW_WIDTH;
canvas.height = WINDOW_HEIGHT;
const context = canvas.getContext("2d");

socket.emit("new player");

socket.on("state", (players) => {
    //рисуем поле
    context.beginPath();
    context.fillStyle = "black";
    context.fillRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
    context.closePath();

    //рисуем коробку (киллбокс)
    context.beginPath();
    context.strokeStyle = "red";
    context.moveTo(0,0);
    context.lineTo(1250,0);
    context.lineTo(1250,550);
    context.lineTo(0,550);
    context.lineTo(0,0);
    context.lineWidth = 10; 
    context.stroke();
    context.closePath();

    //рисуем игроков
    for (const id in players) {
        const player = players[id];
        drawPlayer(context, player);
    }
});




