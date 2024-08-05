const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  member_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
    required: true,
  },
  payment_status: { type: Boolean, default: false },
});

const Subscription = mongoose.model("Subscription", SubscriptionSchema);

module.exports = Subscription;
