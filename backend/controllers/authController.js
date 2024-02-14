import authService from "../services/authService.js";

import jwt from "jsonwebtoken";

const authController = {
  register: async (req, res) => {
    try {
      const { username, password, image, name } = req.body;

      console.log(username, password, image, name);
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
    try {
      const { username, password } = req.body;
      console.log(username, password);
      const response = await authService.login({ username, password });
      if (response instanceof Error) {
        res.status(401).json({ message: response.message });
      } else {
        res.status(200).json(response);
      }
    } catch (err) {
      res.status(401).json({ message: err });
    }
  },

  verifyUser: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];

      console.log(token);

      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          throw new Error("Failed to authenticate token");
        }
        req.user = decoded.user;
      });

      res.status(200).json({
        message: "Token verified",
        user: req.user,
      });
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  },
};

export default authController;
