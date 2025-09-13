const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const UserRouter = express.Router();

// Register
UserRouter.post("/register", async (req, res) => {
  try {
    const { name, dob, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const user = new User({ name, dob, email, password });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

 
// Login
UserRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await user.validatePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = user.getJWT();


    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, dob: user.dob }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Protecting route
UserRouter.get("/all", auth, async (req, res) => {
 try {
    const users = await User.find({}, { password: 0, __v: 0 }); // exclude password and __v
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = UserRouter;

