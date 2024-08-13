require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const nodemailer = require("nodemailer");
const Admin = require("./models/Admin");
const Attendance = require("./models/Attendance");
const Calendar = require("./models/Calendar");
const Member = require("./models/Member");
const Membership = require("./models/Membership");
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
    let user = await Admin.findOne({ username });
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
          message: "Logged in as Admin",
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
      subject: `Welcome to Radiance Yoga Center | Your Trainer Registration Details`,
      html: `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
          .header {height:180px; text-align: center; background: #f4f4f4; padding: 20px; border-bottom: 1px solid #ddd;background-image: url("https://static.vecteezy.com/system/resources/previews/029/353/586/non_2x/ai-generative-of-a-man-practicing-mindfulness-and-meditation-in-a-peaceful-natural-environment-sony-a7s-realistic-image-ultra-hd-high-design-very-detailed-free-photo.jpg"); background-size: cover; background-repeat: no-repeat; background-position: center center;}
          .header img { max-width: 150px; }
          .content { padding: 20px; }
          h1 { color: #333; }
          p { font-size: 14px; color: #555; }
          .footer { background: #f4f4f4; padding: 20px; border-top: 1px solid #ddd; margin-top: 20px; }
          .footer h2 { color: #333; font-size: 16px; }
          .footer p { margin: 0; font-size: 14px; color: #666; }
          .section { margin-bottom: 20px; }
          .section h3 { color: #333; font-size: 14px; }
          .section p { font-size: 14px; color: #555; }
          .head-title{padding-top:0px; color:white;text-shadow:0px 0px 15px black;}
          a { color: #1a73e8; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="head-title">Radiance Yoga Center</h1>
          </div>
          <div class="content">
            <p>Dear ${name},</p>
            <p>Welcome to Radiance Yoga Center!</p>
            <p>We are excited to have you join our team of trainers. Below are your registration details:</p>
            <p><strong>Trainer ID:</strong> ${username}</p>
            <p><strong>Password:</strong> ${password}</p>
            <p>To access your trainer account and start managing your classes, please visit:</p>
            <p><a href="http://localhost:${port}/login">http://localhost:${port}/login</a></p>
            <p>Simply enter your Trainer ID and password to log in.</p>
            <p>If you have any questions or need assistance, feel free to reach out to our support team:</p>
            <ul>
              <li>Email: <a href="mailto:support@radiance.com">support@radiance.com</a></li>
              <li>Phone: +91 6584 857 496</li>
            </ul>
            <p>We look forward to working with you and helping our clients achieve their wellness goals.</p>
            <p>Warm regards,</p>
            <p>The Radiance Yoga Team</p>
          </div>
          <div class="footer">
            <div class="section">
              <h2>Contact Information</h2>
              <p><strong>Radiance Yoga Center</strong></p>
              <p>12, Alpha Street, Sulur, Coimbatore - 641402</p>
              <p>Phone: 6383 580 946</p>
            </div>
            <div class="section">
              <h2>Support</h2>
              <p>If you need assistance, please contact our support team:</p>
              <p>Email: <a href="mailto:support@radiance.com">support@radiance.com</a></p>
              <p>Phone: +91 6584 857 496</p>
            </div>
            <div class="section">
              <h2>Follow Us</h2>
              <p>Stay connected with us on social media:</p>
              <p>Facebook | Twitter | Instagram</p>
            </div>
          </div>
        </div>
      </body>
    </html>`,
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
    subscriptionDetails,
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
      trainer_id,
      password: hashedPassword,
    });

    const savedMember = await newMember.save();

    const subscriptionStartDate = moment().format("YYYY-MM-DD");

    const startDate = moment(subscriptionStartDate);
    const endDate = startDate
      .add(subscriptionDetails.duration, "month")
      .format("YYYY-MM-DD");

    const newSubscription = new Subscription({
      member_id: savedMember._id,
      start_date: subscriptionStartDate,
      end_date: endDate,
      name: subscriptionDetails.name,
      membership_id: subscriptionDetails._id,
    });

    await newSubscription.save();

    // Sending Mail (Styled HTML)
    const mailOptions = {
      from: `vishnuthangaraj.vedhanthi@gmail.com`,
      to: email,
      subject: `Welcome to Radiance Yoga Center | Your Membership Details`,
      html: `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
              .header {height:180px; text-align: center; background: #f4f4f4; padding: 20px; border-bottom: 1px solid #ddd;background-image: url("https://static.vecteezy.com/system/resources/previews/029/353/586/non_2x/ai-generative-of-a-man-practicing-mindfulness-and-meditation-in-a-peaceful-natural-environment-sony-a7s-realistic-image-ultra-hd-high-design-very-detailed-free-photo.jpg"); background-size: cover; background-repeat: no-repeat; background-position: center center;}
              .header img { max-width: 150px; }
              .content { padding: 20px; }
              h1 { color: #333; }
              p { font-size: 14px; color: #555; }
              .footer { background: #f4f4f4; padding: 20px; border-top: 1px solid #ddd; margin-top: 20px; }
              .footer h2 { color: #333; font-size: 16px; }
              .footer p { margin: 0; font-size: 14px; color: #666; }
              .section { margin-bottom: 20px; }
              .section h3 { color: #333; font-size: 14px; }
              .section p { font-size: 14px; color: #555; }
              .head-title{padding-top:0px; color:white;text-shadow:0px 0px 15px black;}
              a { color: #1a73e8; text-decoration: none; }
              a:hover { text-decoration: underline; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 class="head-title">Radiance Yoga Center</h1>
              </div>
              <div class="content">
                <p>Dear ${name},</p>
                <p>Welcome to Radiance Yoga Center!</p>
                <p>We are thrilled to have you join our yoga community. Below are your membership details:</p>
                <p><strong>Member ID:</strong> ${username}</p>
                <p><strong>Password:</strong> ${password}</p>
                <p>To access your account and start your journey with us, please visit:</p>
                <p><a href="http://localhost:${port}/login">http://localhost:${port}/login</a></p>
                <p>Simply enter your Member ID and password to log in.</p>
                <p>If you have any questions or need assistance, feel free to reach out to our support team:</p>
                <ul>
                  <li>Email: <a href="mailto:support@radiance.com">support@radiance.com</a></li>
                  <li>Phone: +91 6584 857 496</li>
                </ul>
                <p>We look forward to seeing you at our center and helping you achieve your wellness goals.</p>
                <p>Warm regards,</p>
                <p>The Radiance Yoga Team</p>
              </div>
              <div class="footer">
                <div class="section">
                  <h2>Contact Information</h2>
                  <p><strong>Radiance Yoga Center</strong></p>
                  <p>12, Alpha Street, Sulur, Coimbatore - 641402</p>
                  <p>Phone: 6383 580 946</p>
                </div>
                <div class="section">
                  <h2>Support</h2>
                  <p>If you need assistance, please contact our support team:</p>
                  <p>Email: <a href="mailto:support@radiance.com">support@radiance.com</a></p>
                  <p>Phone: +91 6584 857 496</p>
                </div>
                <div class="section">
                  <h2>Follow Us</h2>
                  <p>Stay connected with us on social media:</p>
                  <p>Facebook | Twitter | Instagram</p>
                </div>
              </div>
            </div>
          </body>
        </html>`,
    };

    transporter.sendMail(mailOptions);

    res.status(200).json({ message: "User registered", user: newMember });
  } catch (err) {
    console.error("Error in /register:", err);
    if (err.code === 11000) {
      res.status(400).json({ error: "Username or Email already exists" });
    } else {
      res.status(500).json({ error: "Server error", details: err.message });
    }
  }
});

// Register Membership Plan
app.post("/register-membership", async (req, res) => {
  const { name, duration, price } = req.body;

  try {
    const newMembership = new Membership({ name, duration, price });
    await newMembership.save();
    res.status(200).json({
      message: "Membership registered successfully",
      membership: newMembership,
    });
  } catch (error) {
    console.log("Error Adding Membership Plan", error);
    res.status(500).json({ message: "Error Adding Membership Plan", error });
  }
});

// Register Event (Calendar)
app.post("/register-event", async (req, res) => {
  const { name, date, access } = req.body;

  try {
    const newEvent = new Calendar({
      name,
      date: new Date(date),
      access,
    });

    await newEvent.save();
    res
      .status(201)
      .json({ message: "Event added successfully", event: newEvent });
  } catch (err) {
    res.status(500).json({ message: err.message });
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

// Fetch Calendar
app.get("/get-calendar", async (req, res) => {
  try {
    const calendars = await Calendar.find();
    res.status(200).json({ calendars });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Fetch Attendance
app.get("/get-attendance", async (req, res) => {
  try {
    const attendances = await Attendance.find();
    res.status(200).json({ attendances });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Fetch Calendar and Attendance
app.get("/get-calendar-attendance", async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  try {
    const calendars = await Calendar.find();

    const trainerLoginCount = await Attendance.countDocuments({
      action: "login",
      role: "trainer",
      timestamp: { $gte: today, $lt: tomorrow },
    });

    const memberLoginCount = await Attendance.countDocuments({
      action: "login",
      role: "member",
      timestamp: { $gte: today, $lt: tomorrow },
    });

    res.status(200).json({
      calendars,
      trainerLoginCount,
      memberLoginCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
          subscriptionId: "$subscriptions.membership_id",
        },
      },
    ]);
    res.status(200).json(members);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving Members", error: err });
  }
});

// Fetch Membership
app.get("/get-membership", async (req, res) => {
  try {
    const memberships = await Membership.aggregate([
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "membership_id",
          as: "subscriptions",
        },
      },
      {
        $project: {
          name: 1,
          duration: 1,
          price: 1,
          num_members: { $size: "$subscriptions" },
        },
      },
    ]);

    res.status(200).json(memberships);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving Membership", error: err });
  }
});

// Fetch Transaction
app.get("/get-transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    if (transactions.length > 0) res.status(200).json(transactions);
    else res.status(201).json(transactions);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving Transcation", error: err });
  }
});

// Fetch Payment Details
app.get("/get-payments", async (req, res) => {
  try {
    const members = await Member.aggregate([
      {
        $match: { role: "member" },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "member_id",
          as: "subscription_details",
        },
      },
      {
        $unwind: "$subscription_details",
      },
      {
        $lookup: {
          from: "memberships",
          localField: "subscription_details.membership_id",
          foreignField: "_id",
          as: "membership_details",
        },
      },
      {
        $unwind: "$membership_details",
      },
      {
        $project: {
          _id: 1,
          name: 1,
          username: 1,
          "subscription_details._id": 1,
          "subscription_details.start_date": 1,
          "subscription_details.end_date": 1,
          "subscription_details.payment_status": 1,
          "membership_details.name": 1,
          "membership_details.duration": 1,
          "membership_details.price": 1,
        },
      },
    ]);

    res.status(200).json(members);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving lead members", error: err });
  }
});

// Fetch Attendance with Username
app.get("/recent-log/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const recentLog = await Attendance.findOne({ username: id })
      .sort({ timestamp: -1 })
      .exec();

    if (!recentLog) {
      return res
        .status(404)
        .json({ message: "No recent login found for this ID" });
    }

    res.json(recentLog);
  } catch (error) {
    console.error("Error fetching recent login:", error);
    res.status(500).json({ message: "Server error" });
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
        $lookup: {
          from: "trainers",
          localField: "trainer_id",
          foreignField: "_id",
          as: "trainer",
        },
      },
      {
        $unwind: {
          path: "$trainer",
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
          trainer_name: "$trainer.name",
          subscription: "$subscriptions.name",
          start_date: "$subscriptions.start_date",
          end_date: "$subscriptions.end_date",
          payment: "$subscriptions.payment_status",
          subscriptionId: "$subscriptions.membership_id",
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

// Fetch Members by Membership ID
app.get("/get-members/:membershipId", async (req, res) => {
  const { membershipId } = req.params;

  try {
    const subscriptions = await Subscription.find({
      membership_id: membershipId,
    });

    if (subscriptions.length > 0) {
      const memberIds = subscriptions.map(
        (subscription) => subscription.member_id
      );

      const members = await Member.find({ _id: { $in: memberIds } });

      const membersWithDates = members.map((member) => {
        const subscription = subscriptions.find(
          (sub) => sub.member_id.toString() === member._id.toString()
        );

        return {
          ...member.toObject(),
          start_date: subscription.start_date,
          end_date: subscription.end_date,
          payment_status: subscription.payment_status,
        };
      });

      res.status(200).json(membersWithDates);
    } else {
      res.status(200).json({});
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching members", error });
  }
});

// check ID (Trainer, Member or Invalid)
app.post("/check-id", async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const member = await Member.findOne({ username });
    if (member) {
      return res.status(200).json({ id: member._id, role: "member" });
    }

    const trainer = await Trainer.findOne({ username });
    if (trainer) {
      return res.status(200).json({ id: trainer._id, role: "trainer" });
    }

    res.status(200).json({ role: "invalid" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Log an action (login/logout)
app.post("/attendance-log", async (req, res) => {
  try {
    const { username, role } = req.body;

    if (!role) {
      return res.status(400).json({ error: "Role is required" });
    }

    if (!["trainer", "member"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    const recentLog = await Attendance.findOne({
      username,
      timestamp: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ timestamp: -1 });

    let action;

    if (recentLog && recentLog.action === "login") {
      if (role === "trainer") {
        await Trainer.findOneAndUpdate(
          { username },
          { status: "InActive" },
          { new: true }
        );
      }
      action = "logout";
    } else {
      if (role === "trainer") {
        await Trainer.findOneAndUpdate(
          { username },
          { status: "Active" },
          { new: true }
        );
      }
      action = "login";
    }

    const logEntry = new Attendance({ username, role, action });
    await logEntry.save();

    res
      .status(201)
      .json({ message: `Log entry created with action: ${action}`, logEntry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Make Payment with Subscription ID
app.post("/make-payment/:member_id", async (req, res) => {
  const { amount, subId } = req.body;
  const { member_id } = req.params;

  // Validate the input
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  if (!mongoose.Types.ObjectId.isValid(member_id)) {
    return res.status(400).json({ message: "Invalid member ID" });
  }

  if (!mongoose.Types.ObjectId.isValid(subId)) {
    return res.status(400).json({ message: "Invalid subscription ID" });
  }

  try {
    const newTransaction = new Transaction({
      member_id: member_id,
      payment: amount,
    });

    await newTransaction.save();

    const subscriptionUpdate = await Subscription.findByIdAndUpdate(
      subId,
      { payment_status: true },
      { new: true }
    );

    if (!subscriptionUpdate) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res
      .status(200)
      .json({ message: "Payment made and subscription updated successfully" });
  } catch (error) {
    console.error("Error making payment:", error);
    res
      .status(500)
      .json({ message: "Error making payment", error: error.message });
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
    subscriptionId,
  } = req.body;

  try {
    // Update the member details
    const member = await Member.findByIdAndUpdate(
      memberId,
      {
        name: name,
        email: email,
        phone: phone,
        address: address,
        height: height,
        weight: weight,
        age: age,
        gender: gender,
        trainer_id: trainer_id,
      },
      { new: true }
    );

    // Update or create the subscription details
    let subscriptionDoc = await Subscription.findOne({ member_id: memberId });
    let MembershipDoc = await Membership.findById(subscriptionId);

    const startDate = moment(subscriptionDoc.start_date);
    const endDate = startDate
      .add(MembershipDoc.duration, "month")
      .format("YYYY-MM-DD");

    if (subscriptionDoc) {
      subscriptionDoc.name = MembershipDoc.name;
      subscriptionDoc.membership_id = subscriptionId;
      subscriptionDoc.end_date = endDate;
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

// Update Membership By ID
app.put("/update-membership/:id", async (req, res) => {
  const { name, duration, price } = req.body;
  const membershipId = req.params.id;

  try {
    await Membership.findByIdAndUpdate(
      membershipId,
      {
        name: name,
        duration: duration,
        price: price,
      },
      { new: true }
    );
    res.status(200).json({ message: "Membership Updated Successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error Updating Membership", error: err });
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
    const memberObjectId = new mongoose.Types.ObjectId(id);

    const result = await Member.findByIdAndDelete(id);
    await Subscription.deleteMany({ member_id: memberObjectId });

    if (result) {
      res.status(200).json({ message: "Member deleted successfully" });
    } else {
      res.status(404).json({ message: "Member not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error deleting Member", error: err });
  }
});

// Delete Membership by ID
app.delete("/del-membership/:id", async (req, res) => {
  const membershipId = req.params.id;

  try {
    const subscriptionCount = await Subscription.countDocuments({
      membership_id: membershipId,
    });

    if (subscriptionCount > 0) {
      res.status(400).json({
        message:
          "Cannot delete membership plan as it has active subscriptions.",
      });
    } else {
      const result = await Membership.findByIdAndDelete(membershipId);

      if (result) {
        res
          .status(200)
          .json({ message: "Membership Plan Deleted Successfully" });
      } else {
        res.status(404).json({ message: "Membership Plan Not Found!" });
      }
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error Deleting Membership Plan", error: err });
  }
});

// Delete Events(Calendar) by ID
app.delete("/del-calendar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const calendarObjectId = new mongoose.Types.ObjectId(id);

    const result = await Calendar.findByIdAndDelete(id);

    if (result) {
      res.status(200).json({ message: "Event deleted successfully" });
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error deleting Event", error: err });
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
