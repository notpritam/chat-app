import app from "./app.js";
import { Server } from "socket.io";
import http from "http";

const server = http.createServer(app);
export const io = new Server(server);

io.on("connection", (socket) => {
  console.log("New client connected");

  // Handle socket events here
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
