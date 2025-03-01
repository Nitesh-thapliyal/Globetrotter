import mongoose, {Schema, model} from "mongoose";

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  score: { type: Number, default: 0 },
  challenges: [{ type: Schema.Types.ObjectId, ref: "Challenge" }]
});

module.exports = model("User", UserSchema);
