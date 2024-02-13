import mongoose from "mongoose";
import User from "../models/User.js";

const authService = {
  login: async (username, password) => {},
  register: async ({ username, image, password, name }) => {
    try {
      const user = new User({
        username,
        image,
        password,
        name,
      });
      await user.save();
      return user;
    } catch (err) {
      console.log(err);
      res.status(401).json({ message: err.message });
    }
  },
  generateToken: (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  },
};

export default authService;
