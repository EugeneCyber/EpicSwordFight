//заливаем обнову на гит

//экспортируем все необходимые модули
const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
const getPlayers = require("./player").getPlayers;

//создаем приложение для фреймворка экспресс
const app = express();
const server = http.Server(app);
//создаем объект для сокетИО
const io = socketIO(server);

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


let players = null;
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

