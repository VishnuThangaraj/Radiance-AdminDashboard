const mongoose = require("mongoose");

const MembershipSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  duration: { type: Number, required: true, default: 1, min: 1, max: 24 },
  price: { type: Number, required: true, min: 1 },
});

const Membership = mongoose.model("Membership", MembershipSchema);

module.exports = Membership;
