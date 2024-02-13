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

      if (user instanceof Error) {
        res.status(401).json({ message: user.message });
      } else {
        const token = authService.generateToken(user);

        res.status(201).json({ user, token });
      }
    } catch (err) {
      console.log(err);
      res.status(401).json({ message: err.message });
    }
  },
  login: async (req, res) => {
    const { username, password } = req.body;
    const response = await authService.login({ username, password });

    if (response instanceof Error) {
      res.status(401).json({ message: response.message });
    } else {
      res.status(200).json(response);
    }
  },
};

export default authController;
