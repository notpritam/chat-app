import Room from "../models/Room.js";
import { io } from "../server.js";

const roomService = {
  getRooms: async ({ user }) => {
    try {
      const rooms = await Room.find({ members: user._id });
      return rooms;
    } catch (err) {
      return err;
    }
  },
  joinRoom: async ({ room, user }) => {
    try {
      const existingRoom = await Room.findOne({ name: room.name });
      if (!existingRoom) {
        return new Error("Room not found");
      } else {
        existingRoom.members.push(user._id);
        await existingRoom.save();
        return existingRoom;
      }
    } catch (err) {
      return err;
    }
  },
  createRoom: async ({ user, room }) => {
    try {
      const existingRoom = await Room.findOne({ name: room.name });
      if (existingRoom) {
        return new Error("Room already exists");
      } else {
        const newRoom = new Room({
          name: room.name,
          image: room.image,
          members: [user._id],
          createdBy: user._id,
        });
        await newRoom.save();
        return newRoom;
      }
    } catch (err) {
      return err;
    }
  },
  sendMessageinRoom: async ({ room, message, user }) => {
    try {
      const existingRoom = await Room.findOne({ name: room.name });
      if (!existingRoom) {
        return new Error("Room not found");
      } else if (existingRoom.members.includes(user._id)) {
        existingRoom.messages.push(message._id);
        await existingRoom.save();

        io.to(existingRoom.name).emit("message", message);

        return existingRoom;
      } else {
        return new Error("You are not a member of this room");
      }
    } catch (err) {
      return err;
    }
  },
};

export default roomService;
