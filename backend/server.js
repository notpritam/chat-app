import app from "./app.js";
import { Server } from "socket.io";
import http from "http";

import roomController from "./controllers/roomController.js";

const server = http.createServer(app);
export const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("joinRoom", (details) => {
    const room = details.room;
    const user = details.user;
    console.log("Client joind here");
    if (room == "global") {
      socket.join(details.room);
      io.to(room).emit("userJoined", {
        room: room,
        message: `${user.name} has joined the chat.`,
      });
    } else {
      // logic to verify and add user to database
    }
  });

  socket.on("sendMessage", async (details) => {
    console.log(details);

    const room = details.room;
    const newMessage = details.message;
    const user = details.user;

    if (room == "global") {
      io.to("global").emit("newMessage", {
        message: {
          content: newMessage.content,
          user: user,
          room: "global",
        },
      });
    } else {
      // If Room is not equal to global handle sending message here
    }
  });

  socket.on("leaveRoom", ({ roomId, user }) => {
    socket.leave(roomId);
    io.to(roomId).emit("userLeft", {
      user,
      message: `${user.username} has left the room`,
    });
  });

  // Handle when a user disconnects
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    // Emit a message to all rooms the user was in
    // You may need to track which rooms each user is in
    // and emit a message to each of those rooms
  });

  // Handle socket events here
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
