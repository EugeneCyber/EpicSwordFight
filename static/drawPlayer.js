//неожиданно, но здесь мы рисуем игрока
const drawPlayer = (context, player) => {
    const playerX = player.positionX;
    const playerY = player.positionY;

    //функция для отрисовки "меча"
    function drawMyLine(x,y,angleDeg,length){
        var angle = angleDeg * Math.PI/180;
        var swordX = x + Math.cos(angle)*length;
        var swordY = y + Math.sin(angle)*length;
        context.beginPath();
        context.lineWidth = 2;
        context.strokeStyle = "red";
        context.moveTo(x,y);
        context.lineTo(swordX,swordY);  
        context.stroke();
    }

    //рисуем никнейм
    context.beginPath();
    context.fillStyle = "red";
    context.font = "20px sans-serif";
    context.fillText(`Player ${player._name}`, playerX-35, playerY-50);
    context.closePath();

    //рисуем кругляшок игрока
    context.beginPath();
    context.strokeStyle = "white";
    context.lineWidth = 5;
    context.arc(playerX, playerY, player._playerRadius, 0, Math.PI * 2);
    context.stroke();
    context.closePath();

    //рисуем меч
    context.beginPath();
    drawMyLine(playerX, playerY, player.swordAngle, player.swordLength);
    context.closePath();
}