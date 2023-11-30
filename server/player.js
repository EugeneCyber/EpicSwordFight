const players = {};

//генерация рандомных чисел
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

class Player {
    //конструктор со всеми данными
    constructor(props) {
        this._name = props.name;
        this._id = props.id;
        this._playerRadius = 30;
        this.swordAngle = getRandomInt(0, 360);
        this.swordLength = 70;

        //рандомные позиции для игроков
        this.positionX = getRandomInt(50, 1200);
        this.positionY = getRandomInt(50, 500);
    }
}

//здесь мы обрабатываем взаимодействие с игроком (и между игроками)
module.exports.getPlayers = (socket) => {
    //при присоединении создаем игрока
    socket.on("new player", () => {
        players[socket.id] = new Player({
            id: socket.id,
            name: Object.keys(players).length+1,
        })
    });

    //тут игрок двигается
    socket.on("movement", (move) => {
        const player = players[socket.id] || {};
        //движение игрока
        if (move.left) {
            player.positionX -= 5;}
        if (move.up) {
            player.positionY -= 5;}
        if (move.right) {
            player.positionX += 5;}
        if (move.down) {
            player.positionY += 5;}

        //поворот меча
        if (move.swordLeft) {
            player.swordAngle += 5;}
        if (move.swordRight) {
            player.swordAngle -= 5;}

        //удаление игрока при попадании в киллбокс
        if ( Math.pow((0 - player.positionX), 2) + Math.pow((0 - player.positionX), 2) <= Math.pow((player._playerRadius), 2) ) {
            delete players[socket.id]; }
        if ( Math.pow((1250 - player.positionX), 2) + Math.pow((1250 - player.positionX), 2) <= Math.pow((player._playerRadius), 2) ) {
            delete players[socket.id]; }
        if ( Math.pow((0 - player.positionY), 2) + Math.pow((0 - player.positionY), 2) <= Math.pow((player._playerRadius), 2) ) {
            delete players[socket.id]; }
        if ( Math.pow((550 - player.positionY), 2) + Math.pow((550 - player.positionY), 2) <= Math.pow((player._playerRadius), 2) ) {
            delete players[socket.id]; }

        //удаление игрока при попадании в него меча
        for (const id in players) {
            const AnotherPlayer = players[id];
            //вычисляем угл меча
            var angle = AnotherPlayer.swordAngle * Math.PI/180;
            //вычисляем коодинаты меча
            var swordX = AnotherPlayer.positionX + Math.cos(angle)*player.swordLength;
            var swordY = AnotherPlayer.positionY + Math.sin(angle)*player.swordLength;
            if ( Math.pow((swordX - player.positionX), 2) + Math.pow((swordY - player.positionY), 2) <= Math.pow((player._playerRadius), 2) ) {
                delete players[socket.id];
            }
        }
    })

    //удаление при отключении
    socket.on("disconnect", () => {
        delete players[socket.id];
    });
    return players;
}






