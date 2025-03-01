import express from "express"
import mongoose from "mongoose"
import destinationRoutes from "./routes/destinationRoutes.js";
import cors from "cors"
import errorHandler from "./middlewares/errorHandler.js"
import dotenv from "dotenv"
dotenv.config({
    path: '.env'
});


const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/api", (req, res) => {
  res.send("Globetrotter API Running");
});


app.use("/api/destinations", destinationRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
