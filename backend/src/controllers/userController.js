const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
    chooserole: (req, res) => {
        const { role } = req.body;
        if (!["recruiter", "candidate"].includes(role)) {
            return res.status(400).json({ message: "Invalid role entered" });
        }
        res.json({ message: `Proceed to sign in as a ${role}`, role });
    },

    signin: async (req, res) => {
        try {
            const { name, email, password, role } = req.body;
            if (!["recruiter", "candidate"].includes(role)) {
                return res.status(400).json({ message: "Invalid role" });
            }

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ name, email, password: hashedPassword, role });
            await user.save();

            const token = jwt.sign(
              { id: user._id, name: user.name, role: user.role }, 
              process.env.JWT_SECRET, 
              { expiresIn: "7d" }
          );
          
            res.status(201).json({ message: "User registered successfully", token, user });
        } catch (error) {
            console.error("Signup Error:", error);
            res.status(500).json({ message: "Error registering user", error: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign(
              { id: user._id, name: user.name, role: user.role }, 
              process.env.JWT_SECRET, 
              { expiresIn: "7d" }
          );
          
            res.json({ message: `Logged in as ${user.role}`, token });
        } catch (error) {
            console.error("Login Error:", error);
            res.status(500).json({ message: "Login failed", error: error.message });
        }
    }
};


module.exports.dashboard = async (req, res) => {
  try {
      res.json({ 
          message: `Welcome to your dashboard, ${req.user.name || "User"}`, 
          user: req.user 
      });
  } catch (error) {
      res.status(500).json({ message: "Error fetching dashboard", error: error.message });
  }
};
