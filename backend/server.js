import app from "./app.js";
import { Server } from "socket.io";
import http from "http";

const server = http.createServer(app);
export const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("joinRoom", (details) => {
    console.log(details.room);
    socket.join(details.room);
  });

  socket.on("sendMessage", (message) => {
    console.log(message);
    io.to(message.room).emit("newMessage", message);
  });

  // Handle socket events here
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
