import mongoose, {Schema, model} from "mongoose";

const ChallengeSchema = new Schema({
  inviter: { type: Schema.Types.ObjectId, ref: "User", required: true },
  invitee: { type: String, required: true }, // Username of the invitee
  destination: { type: Schema.Types.ObjectId, ref: "Destination", required: true },
  status: { type: String, enum: ["pending", "accepted", "completed"], default: "pending" }
});

module.exports = model("Challenge", ChallengeSchema);
