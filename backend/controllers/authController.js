const User = require("../models/User");

// register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const role = email === "admin@gmail.com" ? "admin" : "user";

    const user = new User({
      name,
      email,
      password,
      role
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.status(200).json({
      message: "Login successful",
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser
};