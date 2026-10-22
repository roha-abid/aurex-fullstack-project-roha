const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const userResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Never store the plain password - hash it first
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ token: generateToken(user._id), user: userResponse(user) });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // password has select:false, so we must ask for it explicitly
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password",
    );
    const passwordMatches = user && (await bcrypt.compare(password, user.password));

    if (!passwordMatches) {
      // same message for both cases so attackers can't tell which was wrong
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({ token: generateToken(user._id), user: userResponse(user) });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me  (protected)
const getMe = async (req, res) => {
  res.status(200).json({ user: userResponse(req.user) });
};

module.exports = { register, login, getMe };
