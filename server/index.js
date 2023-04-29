var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.get("/view", (req, res) => {
  res.sendFile(__dirname + "/display.html");
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join-message", (roomId) => {
    socket.join(roomId);
    console.log("User joined in a room : " + roomId);
  });

  socket.on("screen-data", function (data) {
    try {
      data = JSON.parse(data);
      var room = data.room;
      var imgStr = data.image;
      socket.broadcast.to(room).emit("screen-data", imgStr);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

var server_port = process.env.YOUR_PORT || process.env.PORT || 5000;
http.listen(server_port, () => {
  console.log("Started on : " + server_port);
});
