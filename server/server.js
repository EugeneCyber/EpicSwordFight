//экспортируем все необходимые модули
const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
//const getPlayers = require("./player").getPlayers;

/*const storage = require('node-sessionstorage');
storage.setItem('foo', 'bar');
console.log('item set:', storage.getItem('foo'));*/

//создаем приложение для фреймворка экспресс
const app = express();
const server = http.Server(app);
//создаем объект для сокетИО
const io = socketIO(server);


////////////////////////////////////////
//         Тут мы делаем куки         //
////////////////////////////////////////

// need cookieParser middleware before we can do anything with cookies
const cookieParser = require('cookie-parser');
app.use(cookieParser());


let cookie;
// set a cookie
app.use(function (req, res, next) {
  // check if client sent cookie
  cookie = req.cookies.cookieLogin;
  if (cookie === undefined) {
    // no: set a new cookie
    res.cookie('cookieLogin', "Человек-без-имени");
    console.log('Такой печеньки нет!');
  } else {
    // yes, cookie was already present 
    console.log('Такая печенька есть! ', cookie);
  } 
  next(); // <-- important!
});
////////////////////////////////////////
////////////////////////////////////////

//установим порт
app.set("port", 3000);
//установим путь на папку static
app.use("/static", express.static(path.dirname(__dirname) + "/static"));

//здесь мы передаем на localhost html страницу
app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "index.html"));
})

//запускаем сервер
server.listen(3000, () => {
    console.log("Starting server...");
});


let players = {};
//let players = null;
io.on("connection", (socket) => {
    //эта функция возвращает объект players на сервер
    players = getPlayers(socket);
    //если мы хотим видеть подключившегося игрока в консоли, то надо поставить таймаут
    //setTimeout(() => {console.log(players);}, 100)
});

//отпарвляем объект с игроками на клиент
const gameLoop = (players, io) => {
    io.sockets.emit("state", players);
};

//отправляем с частотой 60 в секунду
setInterval(() => {
    if (players && io) {
        gameLoop(players, io);
    };
}, 1000/60);










////////////////////////////////////////
//  Тут мы работаем с данными игрока  //
////////////////////////////////////////

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
      this.killCount = 0;

      //рандомные позиции для игроков
      this.positionX = getRandomInt(50, 1200);
      this.positionY = getRandomInt(50, 500);
  }
}

//здесь мы обрабатываем взаимодействие с игроком (и между игроками)
getPlayers = (socket) => {
  //при присоединении создаем игрока
  socket.on("new player", () => {
      players[socket.id] = new Player({
          id: socket.id,
          //name: Object.keys(players).length+1,
          name: cookie,
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
          delete players[socket.id]; 
          delete cookie; }
      if ( Math.pow((1250 - player.positionX), 2) + Math.pow((1250 - player.positionX), 2) <= Math.pow((player._playerRadius), 2) ) {
          delete players[socket.id]; 
          delete cookie; }
      if ( Math.pow((0 - player.positionY), 2) + Math.pow((0 - player.positionY), 2) <= Math.pow((player._playerRadius), 2) ) {
          delete players[socket.id];
          delete cookie; }
      if ( Math.pow((550 - player.positionY), 2) + Math.pow((550 - player.positionY), 2) <= Math.pow((player._playerRadius), 2) ) {
          delete players[socket.id];
          delete cookie; }

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
              delete cookie;
              AnotherPlayer.killCount += 1;
          }
      }
  })

  //удаление при отключении
  socket.on("disconnect", () => {
      delete players[socket.id];
  });
  return players;
}
