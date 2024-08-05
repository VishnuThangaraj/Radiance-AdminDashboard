const mongoose = require("mongoose");

const TrainerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "trainer" },
  height: { type: Number, required: false },
  weight: { type: Number, required: false },
  age: { type: Number, required: false },
  gender: { type: String, required: false },
  status: { type: String, default: "InActive" },
});

const Trainer = mongoose.model("Trainer", TrainerSchema);

module.exports = Trainer;
