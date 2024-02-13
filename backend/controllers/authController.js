import authService from "../services/authService.js";

const authController = {
  register: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await authService.register(username, password);
    } catch (err) {
      console.log(err);
      res.status(401).json({ message: err.message });
    }
  },
  login: async (req, res) => {},
};

export default authController;
