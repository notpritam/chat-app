import authService from "../services/authService.js";

const authController = {
  register: async (req, res) => {
    try {
      const { username, password, image, name } = req.body;
      const user = await authService.register({
        username,
        password,
        image,
        name,
      });

      const token = authService.generateToken(user);

      res.status(201).json({ user, token });
    } catch (err) {
      console.log(err);
      res.status(401).json({ message: err.message });
    }
  },
  login: async (req, res) => {},
};

export default authController;
