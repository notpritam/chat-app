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
    console.log(details.room);
    if (details.room == "global") {
      socket.join(details.room);
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

  // Handle socket events here
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
