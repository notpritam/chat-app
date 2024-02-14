import authService from "../services/authService.js";
import roomService from "../services/roomService.js";
const roomController = {
  getRooms: async (req, res) => {
    try {
      console.log(req.user);
      console.log("getting here");
      const rooms = await roomService.getRooms({ user: req.user });
      res.status(200).json(rooms);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  joinRoom: async (req, res) => {
    try {
      const { room, user } = req;

      const res = await roomService.joinRoom({
        room,
        user,
      });
      res.status(200).json(room);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  createRoom: async (req, res) => {
    try {
      const { user } = req;
      const room = req.body.room;
      console.log(req, "this is room and user");

      console.log(room, user, "this is room and user");
      const result = await roomService.createRoom({
        room,
        user,
      });
      console.log(result, "this is result");
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  sendMessageinRoom: async ({ room, message, user }) => {
    try {
      if (room == "global") {
        const res = await roomService.sendMessageinGlobalRoom({
          message,
          user,
        });
      } else {
        const res = await roomService.sendMessageinPrivateRoom({
          room,
          user,
          message,
        });
      }
    } catch (e) {}
  },
};

export default roomController;
