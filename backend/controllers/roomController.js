import roomService from "../services/roomService.js";
const roomController = {
  getRooms: async (req, res) => {
    try {
      console.log(req.user);
      const rooms = await roomService.getRooms();
      res.status(200).json(rooms);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  joinRoom: async (req, res) => {},
  createRoom: async (req, res) => {},
};

export default roomController;
