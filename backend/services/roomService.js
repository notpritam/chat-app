import Message from "../models/Message.js";
import Room from "../models/Room.js";
import { io } from "../server.js";

const roomService = {
  getRooms: async ({ user }) => {
    try {
      const rooms = await Room.find({ members: user._id });
      if (!rooms) {
        return new Error("No rooms found");
      } else {
        return rooms;
      }
    } catch (err) {
      return err;
    }
  },
  joinRoom: async ({ room, user }) => {
    try {
      const existingRoom = await Room.findOne({ name: room.name });
      if (!existingRoom) {
        return new Error("Room not found");
      } else if (!existingRoom.members.includes(user._id)) {
        existingRoom.members.push(user._id);
        await existingRoom.save();
        return existingRoom;
      } else {
        return new Error("You are already a member of this room");
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
        const newMessage = new Message({
          content: message.text,
          sender: user._id,
          room: existingRoom._id,
        });
        const messageRes = await newMessage.save();

        existingRoom.messages.push(messageRes._id);
        await existingRoom.save();

        // io.to(existingRoom.name).emit("message", message);

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
