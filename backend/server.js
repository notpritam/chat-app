import app from "./app.js";
import { Server } from "socket.io";
import http from "http";
import { instrument } from "@socket.io/admin-ui";

import roomService from "./services/roomService.js";

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: [
      "*",
      "http://localhost:5173",
      "https://chat-app-git-main-notpritam.vercel.app",
      "https://chat-app-backend-0v3j.onrender.com/",
      "https://admin.socket.io",
    ],
    methods: ["GET", "POST"], // Add other allowed methods if needed
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("joinRoom", async (details) => {
    const room = details.room;
    const user = details.user;

    if (room === "global") {
      socket.join(room);
      io.to(room).emit("userJoined", {
        room: room,
        message: `${user.name} has joined the chat.`,
      });
    } else {
      await roomService.joinChatRoom({ room, user, socket });
    }
  });

  socket.on("sendMessage", async (details) => {
    console.log(details);

    const room = details.room;
    const newMessage = details.message;
    const user = details.user;

    if (room === "global") {
      io.to("global").emit("newMessage", {
        message: {
          content: newMessage.content,
          user: user,
          room: "global",
          createdAt: newMessage.createdAt,
        },
      });
    } else {
      // If Room is not equal to global handle sending message here
      await roomService.sendMessageinPrivateRoom({
        room,
        message: {
          content: newMessage.content,
          user: user._id,
          room: room,
        },
        user,
        socket,
      });
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

instrument(io, { auth: false, mode: "development" });
