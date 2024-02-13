import mongoose from "mongoose";
import Room from "../models/Room";

const roomService = {
  getRooms: async ({ user }) => {
    try {
      const rooms = await Room.find({ members: user._id });
      return rooms;
    } catch (err) {
      return err;
    }
  },
  joinRoom: async () => {},
  createRoom: async () => {},
};

export default roomService;
