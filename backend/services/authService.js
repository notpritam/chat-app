import mongoose from "mongoose";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const authService = {
  login: async ({ username, password }) => {
    try {
      const user = await User.findOne({ username });
      console.log(user);
      if (!user) {
        throw new Error("User not found");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new Error("Invalid password");
      } else {
        const token = authService.generateToken(user);
        return { user, token };
      }
    } catch (err) {
      return err;
    }
  },
  register: async ({ username, image, password, name }) => {
    try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return new Error("User already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        username,
        image,
        password: hashedPassword,
        name,
      });
      await user.save();
      return user;
    } catch (err) {
      return err;
    }
  },
  generateToken: (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  },
};

export default authService;
