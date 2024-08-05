const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "member" },
  height: { type: Number, required: false },
  weight: { type: Number, required: false },
  age: { type: Number, required: false },
  gender: { type: String, required: false },
  trainer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trainer",
    required: false,
  },
});

const Member = mongoose.model("Member", MemberSchema);

module.exports = Member;
