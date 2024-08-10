const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Attendance = mongoose.model("Attendance", AttendanceSchema);

module.exports = Attendance;
