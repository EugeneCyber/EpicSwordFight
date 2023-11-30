//неожиданно, но здесь мы рисуем игрока
const drawPlayer = (context, player) => {
    const playerX = player.positionX;
    const playerY = player.positionY;

    //функция для отрисовки "меча"
    function drawMyLine(x,y,angleDeg,length){
        var angle = angleDeg * Math.PI/180;
        var swordX = x + Math.cos(angle)*length;
        var swordY = y + Math.sin(angle)*length;

        var swordXstart = x + Math.cos(angle)*player._playerRadius;
        var swordYstart = y + Math.sin(angle)*player._playerRadius;

        context.beginPath();
        context.lineWidth = 3;
        context.strokeStyle = "red";
        context.moveTo(swordXstart,swordYstart);
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

    //рисуем счетчик
    context.beginPath();
    context.fillStyle = "red";
    context.font = "20px sans-serif";
    context.fillText(`${player.killCount}`, playerX-6, playerY+7);
    context.closePath();
}