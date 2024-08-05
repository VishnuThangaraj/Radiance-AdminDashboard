require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const nodemailer = require("nodemailer");
const Member = require("./models/Member");
const Subscription = require("./models/Subscription");
const Trainer = require("./models/Trainer");
const Transaction = require("./models/Transcation");
const bcrypt = require("bcryptjs");
const moment = require("moment");

const app = express();
const port = process.env.PORT || 6969;

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/Radiance_Yoga", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Middleware setup
app.use(
  cors({
    origin: "http://localhost:5174",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await Member.findOne({ username });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        req.session.user = {
          id: user._id,
          username: user.username,
          role: user.role,
          name: user.name,
        };
        return res.json({
          message: "Logged in as Member",
          user: req.session.user,
        });
      } else {
        return res.status(400).json({ error: "Invalid credentials" });
      }
    }

    user = await Trainer.findOne({ username });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        req.session.user = {
          id: user._id,
          username: user.username,
          role: user.role,
          name: user.name,
        };
        return res.json({
          message: "Logged in as Trainer",
          user: req.session.user,
        });
      } else {
        return res.status(400).json({ error: "Invalid credentials" });
      }
    }

    // If not found in either schema
    res.status(400).json({ error: "User not found" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Register Trainer
app.post("/register-trainer", async (req, res) => {
  const { name, email, address, phone, height, weight, age, gender } = req.body;

  let password = `${name}+1234`;

  try {
    const lastTrainer = await Trainer.findOne().sort({ _id: -1 });
    const username = `RYC-TR${
      lastTrainer ? parseInt(lastTrainer.username.split("RYC-TR")[1]) + 1 : 1
    }`;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newTrainer = new Trainer({
      username,
      name,
      email,
      address,
      phone,
      height,
      weight,
      age,
      gender,
      password: hashedPassword,
    });

    await newTrainer.save();

    // Sending Mail (Replay)
    const mailOptions = {
      from: `vishnuthangaraj.vedhanthi@gmail.com`,
      to: email,
      subject: `Your Trainer ID and Password Have Been Created | Radiance Yoga`,
      text: `Hello ${name},
We are pleased to inform you that your Trainer ID and Password have been successfully created. Below are your login details:

Trainer ID: ${username}
Password: ${password}

To access your account, please follow these steps:

Visit our Company Portal/Website at http://localhost:${port}/login.
Enter your Trainer ID and password.
Should you encounter any issues or have any questions, please do not hesitate to contact our IT support team at support@radiance.com or +91 6584 857 496.

We are excited to have you on board and look forward to your contributions to the team.

Best regards,
Vishnu Thangaraj
vishnuthangaraj@radiance.com
+91 6383 580 966`,
    };

    transporter.sendMail(mailOptions);

    res.status(201).json({ message: "User registered", user: newTrainer });
  } catch (err) {
    console.error("Error in /register:", err);
    if (err.code === 11000) {
      res.status(400).json({ error: "Username or Email already exists" });
    } else {
      res.status(500).json({ error: "Server error", details: err.message });
    }
  }
});

// Register Member
app.post("/register-member", async (req, res) => {
  const {
    name,
    email,
    address,
    phone,
    height,
    weight,
    age,
    gender,
    subscription,
    trainer_id,
  } = req.body;

  let password = `${name}+1234`;

  try {
    const lastMember = await Member.findOne().sort({ _id: -1 });
    const username = `RYC-MB${
      lastMember ? parseInt(lastMember.username.split("RYC-MB")[1]) + 1 : 1
    }`;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newMember = new Member({
      username,
      name,
      email,
      address,
      phone,
      height,
      weight,
      age,
      gender,
      subscription,
      trainer_id,
      password: hashedPassword,
    });

    await newMember.save();

    // Sending Mail (Replay)
    const mailOptions = {
      from: `vishnuthangaraj.vedhanthi@gmail.com`,
      to: email,
      subject: `Your Trainer ID and Password Have Been Created | Radiance Yoga`,
      text: `Hello ${name},
We are pleased to inform you that your Member ID and password have been successfully created. Below are your login details:

Member ID: ${username}
Password: ${password}

To access your account, please follow these steps:

Visit our Company Portal/Website at http://localhost:${port}/login.
Enter your Member ID and password.
Should you encounter any issues or have any questions, please do not hesitate to contact our IT support team at support@radiance.com or +91 6584 857 496.

We are excited to have you on board and look forward to your contributions to the team.

Best regards,
Vishnu Thangaraj
vishnuthangaraj@radiance.com
+91 6383 580 966`,
    };

    transporter.sendMail(mailOptions);

    res.status(201).json({ message: "User registered", user: newMember });
  } catch (err) {
    console.error("Error in /register:", err);
    if (err.code === 11000) {
      res.status(400).json({ error: "Username or Email already exists" });
    } else {
      res.status(500).json({ error: "Server error", details: err.message });
    }
  }
});

// Fetch Trainers
app.get("/get-trainers", async (req, res) => {
  try {
    const trainers = await Trainer.find();
    res.status(200).json(trainers);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving Trainers", error: err });
  }
});

// Fetch Members
app.get("/get-members", async (req, res) => {
  try {
    const members = await Member.find();
    res.status(200).json(members);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving Members", error: err });
  }
});

// Delete Trainer by ID
app.delete("/del-trainer/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Trainer.findByIdAndDelete(id);

    if (result) {
      res.status(200).json({ message: "Trainer deleted successfully" });
    } else {
      res.status(404).json({ message: "Trainer not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error deleting Trainer", error: err });
  }
});

// Delete Member by ID
app.delete("/del-member/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Member.findByIdAndDelete(id);

    if (result) {
      res.status(200).json({ message: "Member deleted successfully" });
    } else {
      res.status(404).json({ message: "Member not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error deleting Member", error: err });
  }
});

// Logout
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
});

// Profile Route
app.get("/profile", (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).send("Unauthorized");
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});