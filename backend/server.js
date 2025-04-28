const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const noteRoutes = require('./routes/noteRoutes');
const logger = require("./logger"); 

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.use('/api/notes', noteRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => logger.info("Connected to MongoDB Atlas"))
  .catch((err) => logger.error("MongoDB Atlas connection error:", err));

// User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model("User", UserSchema);
module.exports = User;

// Signup Route
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    logger.info(`New user signed up: ${email}`);

    res.status(201).json({ message: "User registered", token });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not registered" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    logger.info(`User logged in: ${email}`);

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


app.get("/profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("name email");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    logger.info(`Profile page visited by: ${user.email}`);

    res.status(200).json({ name: user.name, email: user.email });
  } catch (error) {
    logger.error(error);
    res.status(401).json({ message: "Invalid token" });
  }
});

// Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
