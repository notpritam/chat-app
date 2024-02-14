import roomService from "../services/roomService.js";
const roomController = {
  getRooms: async (req, res) => {
    try {
      const rooms = await roomService.getRooms({ user: req.user });
      res.status(200).json(rooms);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  joinRoom: async (req, res) => {
    try {
      const { user } = req;

      const room = req.body.room;

      const result = await roomService.joinRoom({
        room,
        user,
      });
      if (result instanceof Error) {
        res.status(500).json({ message: result.message });
      } else {
        res.status(200).json(result);
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  createRoom: async (req, res) => {
    try {
      const { user } = req;
      const room = req.body.room;

      const result = await roomService.createRoom({
        room,
        user,
      });
      console.log(result, "this is result");

      if (result instanceof Error) {
        res.status(500).json({ message: result.message });
      } else {
        res.status(200).json(result);
      }
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
    } catch (e) {
      console.log(e);
    }
  },
};

export default roomController;
