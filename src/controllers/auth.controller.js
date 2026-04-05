const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

async function register(req, res) {
  const { name, email, password, role = "viewer" } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email and password are required" });
  }

  if (!["admin", "analyst", "viewer"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  try {
    // Check if user already exists
    const userAlreadyExists = await userModel.findOne({ email });
    if (userAlreadyExists) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role,
      status: "inactive",
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function login(req, res) {
  const { email, name, password } = req.body;

  if (!password || (!email && !name)) {
    return res.status(400).json({ message: "Bad request" });
  }

  try {
    const user = await userModel.findOne({
      $or: [{ email }, { name }],
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    await userModel.findByIdAndUpdate(user._id, { status: "active" });

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.cookie("token", token);

    res.status(200).json({
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function logout(req, res) {
  try {
    const token = req.cookies.token;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
          ignoreExpiration: true,
        });

        if (decoded?.id) {
          await userModel.findByIdAndUpdate(decoded.id, { status: "inactive" });
        }
      } catch (error) {
        // Always clear cookie and return success even if token is invalid.
      }
    }
  } catch (error) {
    console.error("Error logging out user:", error);
  }

  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
}

module.exports = { register, login, logout };
