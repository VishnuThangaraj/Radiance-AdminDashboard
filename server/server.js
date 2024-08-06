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
    subscriptionStartDate,
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
      trainer_id,
      password: hashedPassword,
    });

    const savedMember = await newMember.save();

    const startDate = moment(subscriptionStartDate);
    const endDate = startDate.add(1, "month").format("YYYY-MM-DD");

    const newSubscription = new Subscription({
      member_id: savedMember._id,
      start_date: subscriptionStartDate,
      end_date: endDate,
      name: subscription,
    });

    await newSubscription.save();

    // Sending Mail (Replay)
    const mailOptions = {
      from: `vishnuthangaraj.vedhanthi@gmail.com`,
      to: email,
      subject: `Your Member ID and Password Have Been Created | Radiance Yoga`,
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
    const members = await Member.aggregate([
      { $match: { role: "member" } },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "member_id",
          as: "subscriptions",
        },
      },
      {
        $unwind: {
          path: "$subscriptions",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          username: 1,
          name: 1,
          phone: 1,
          height: 1,
          weight: 1,
          gender: 1,
          email: 1,
          address: 1,
          age: 1,
          subscription: "$subscriptions.name",
          start_date: "$subscriptions.start_date",
          end_date: "$subscriptions.end_date",
        },
      },
    ]);
    res.status(200).json(members);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving Members", error: err });
  }
});

// Fetch Trainer by ID
app.get("/trainer-data/:id", async (req, res) => {
  const trainerId = req.params.id;

  try {
    const trainer = await Trainer.findById(trainerId);

    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    res.json(trainer);
  } catch (error) {
    console.error("Error fetching Trainer details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch Member by ID
app.get("/member-data/:id", async (req, res) => {
  const memberId = req.params.id;

  try {
    const memberObjectId = new mongoose.Types.ObjectId(memberId);

    const member = await Member.aggregate([
      { $match: { _id: memberObjectId } },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "member_id",
          as: "subscriptions",
        },
      },
      {
        $unwind: {
          path: "$subscriptions",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          username: 1,
          name: 1,
          phone: 1,
          height: 1,
          weight: 1,
          gender: 1,
          email: 1,
          address: 1,
          age: 1,
          trainer_id: 1,
          subscription: "$subscriptions.name",
          start_date: "$subscriptions.start_date",
          end_date: "$subscriptions.end_date",
        },
      },
    ]);

    if (!member || member.length === 0) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.json(member[0]);
  } catch (error) {
    console.error("Error fetching member details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update Trainer by ID
app.put("/trainer-data/:id", async (req, res) => {
  try {
    const updatedTrainer = await Trainer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedTrainer) {
      res.json(updatedTrainer);
    } else {
      res.status(404).json({ message: "Trainer not found" });
    }
  } catch (error) {
    console.error("Error updating trainer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update member by ID
app.put("/member-data/:id", async (req, res) => {
  const memberId = req.params.id;
  const {
    name,
    email,
    phone,
    address,
    height,
    weight,
    age,
    gender,
    trainer_id,
    subscription,
    start_date,
  } = req.body;

  try {
    // Update the member details
    const member = await Member.findByIdAndUpdate(
      memberId,
      {
        name,
        email,
        phone,
        address,
        height,
        weight,
        age,
        gender,
        trainer_id,
      },
      { new: true }
    );

    // Update or create the subscription details
    let subscriptionDoc = await Subscription.findOne({ member_id: memberId });
    if (subscriptionDoc) {
      subscriptionDoc.name = subscription;
      subscriptionDoc.start_date = start_date;
    }

    await subscriptionDoc.save();
    await member.save();

    res
      .status(200)
      .json({ message: "Member and subscription updated successfully" });
  } catch (error) {
    console.error("Error updating member details:", error);
    res.status(500).json({ message: "Failed to update member details" });
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
    await Subscription.deleteMany({ member_id: id });

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
