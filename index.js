var app = require("express")();
var express = require("express");
var port = process.env.PORT || 8080;

const PORT = process.env.PORT || 3000;
const INDEX = "/index.html";

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.use(express.static("public"));

let todolist = [];
io.on("connection", function(socket) {
  console.log("a user connected");
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });

  socket.emit("updateTask", todolist);

  // Adds task on the todolist
  socket.on("addTask", function(task) {
    todolist.push(task); // Add task to server todolist array

    // Get the index position of task in array - to give kind of id
    index = todolist.length - 1;

    // console.log(task); // Debug task
    // console.log(index); // Debug index

    // Send task to all users in real-time
    socket.broadcast.emit("updateTask", todolist);
    // console.log(todolist); // Debug
  });

  // Delete tasks
  socket.on("deleteTask", function(index) {
    // Deletes task from the server todolist array
    todolist.splice(index, 1);

    // Updates todolist of all users in real-time - refresh index
    socket.broadcast.emit("updateTask", todolist);
  });
});

app.listen(port, function() {
  console.log("listening on *:4001");
});
