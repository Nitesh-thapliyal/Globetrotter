import {model, Schema} from "mongoose";

const DestinationSchema = new Schema({
  name: { type: String, required: true, unique: true },
  clues: { type: [String], required: true }, 
  funFacts: { type: [String], required: true },
  trivia: { type: [String], required: true }
});

const Destination = model("Destination", DestinationSchema);

export default Destination;