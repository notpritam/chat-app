import mongoose from "mongoose";
import User from "../models/User.js";

const authService = {
  login: async (username, password) => {},
  register: async (username, image, password) => {
    try {
      const user = new User({
        username,
        image,
        password,
      });
      await user.save();
      return user;
    } catch (err) {
      console.log(err);
      res.status(401).json({ message: err.message });
    }
  },
};

export default authService;
