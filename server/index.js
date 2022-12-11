const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
const arrUserInfo = [];

io.on("connection", (socket) => {
  socket.on("Nguoi_dung_dang_ky", (user) => {
    const isExist = arrUserInfo.some((e) => e.ten == user.ten);
    socket.peerId = user.peerId;
    if (isExist) {
      return socket.emit("Dang_ky_that_bai");
    }
    arrUserInfo.push(user);
    socket.emit("Danh_sach_online", arrUserInfo);
    socket.broadcast.emit("Co_nguoi_dung_moi", user);
  });
  socket.on("disconnect", () => {
    const index = arrUserInfo.findIndex((user) => user.peerId == socket.peerId);
    arrUserInfo.splice(index, 1);
    io.emit("Ai_do_ngat_ket_noi", socket.peerId);
  });
});
