const mongoose = require("mongoose");

const CalendarSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    access: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Calendar = mongoose.model("Calendar", CalendarSchema);

module.exports = Calendar;
