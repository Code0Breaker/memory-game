"use strict";

const express = require("express");
const http = require("http");
const socket = require("socket.io");
const cors = require("cors");
const v1Routes = require("./routes/v1");
const path = require("path");

const app = express();
const server = http.Server(app);
const io = socket(server);
const PORT = 5000;

let members = new Array(12).fill([]);
let roomStatuses = new Array(12).fill(true);
console.log(__dirname + "/dist/" + "index.html");
let dist = path.join(__dirname, "dist/");
app.use(express.static(dist));
app.get("*", (req, res, next) => {
  console.log(req.url, "=========ddd");
  // // console.log(/dashboard|sessions|openvidu|recordings|api/.test(req.url))
  if (req.url === "/v1/rooms") {
    // console.log('aaaa')
    next();
    // res.json('Openvidu route')
  } else {
    console.log("else======", req.url);
    
    res.sendFile(dist + "index.html");
  }
});
io.on("connection", (socket) => {
  socket.on("REQUEST_MEMBERS", () => {
    io.emit("GET_MEMBERS", members);
  });
  socket.on("ADD_MEMBER", (data) => {
    members[data] = [...members[data], socket.id];
    io.emit("GET_MEMBERS", members);
  });
  socket.on("REMOVE_MEMBER", (data) => {
    let removed = false;
    if (~members[data].indexOf(socket.id)) {
      members[data].splice(members[data].indexOf(socket.id), 1);
      removed = true;
    }
    io.emit("GET_MEMBERS", members);
    if (removed) {
      io.emit("REMOVED", true);
    }
  });
  socket.on("SET_ITEMS", (data) => {
    io.emit("GET_ITEMS", data);
  });
  socket.on("SET_FLIPPED", (data) => {
    io.emit("GET_FLIPPED", data);
  });
  socket.on("SET_ROOM_STATUSES", (data) => {
    roomStatuses[data.room] = data.status;
    io.emit("GET_ROOM_STATUSES", roomStatuses);
  });
  socket.on("REQUEST_ROOM_STATUSES", () => {
    io.emit("GET_ROOM_STATUSES", roomStatuses);
  });
});

app.use(
  cors({
    origin: "http://localhost:8080",
    optionsSuccessStatus: 200,
  })
);
app.use("/v1", v1Routes);

console.log("======================");

server.listen(PORT, console.log(`Listening to ${PORT}!`));
