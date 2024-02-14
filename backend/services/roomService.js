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
  sendMessageinPrivateRoom: async ({ room, message, user, socket }) => {
    console.log("sendMessageinPrivateRoom", room, message, user);
    try {
      const existingRoom = await Room.findOne({ name: room });
      const newMessage = new Message({
        content: message.content,
        sender: user._id,
        room: existingRoom._id,
      });
      const messageRes = await newMessage.save();
      console.log("messageRes", messageRes);

      existingRoom.messages.push(messageRes._id);
      await existingRoom.save();

      io.to(existingRoom.name).emit("newMessage", {
        message: {
          content: messageRes.content,
          user: user,
          room: "global",
          createdAt: messageRes.createdAt,
        },
      });
    } catch (err) {
      socket.emit("error", err.message);
      console.log(err.message);
    }
  },
  sendMessageinGlobalRoom: async ({ message, user }) => {
    try {
      console.log(message, "this is new message in global route");
      io.to("global").emit("newMessage", message, user);
    } catch (e) {
      // io.to("global").emit("error", {
      //   error: "something went wrong",
      // });
    }
  },

  joinChatRoom: async ({ room, user, socket }) => {
    try {
      const existingRoom = await Room.findOne({ name: room })
        .populate("members")
        .populate({
          path: "messages",
          populate: {
            path: "sender",
            model: "User", // Assuming "User" is the name of the User model
          },
        });
      if (!existingRoom) {
        socket.emit("error", "Room not found");
      }

      const isMember = existingRoom.members.some(
        (member) => member._id == user._id
      );
      console.log("isMember", isMember);

      if (isMember) {
        socket.join(room);
        socket.emit("intialMessage", {
          room: room,
          messages: existingRoom.messages,
          members: existingRoom.members,
        });
      } else {
        socket.emit("error", "You are not a member of this room");
      }
    } catch (err) {
      return { error: err.message };
    }
  },
};

export default roomService;
