import express from "express";
import Destination from "../models/Destination.js"
import { expandDestination } from "../controllers/destinationController.js";

const router = express.Router();

// ✅ Fetch all destinations
router.get("/", async (req, res) => {
    try {
        console.log("Fetching all destinations..."); // ✅ Debug log

        const destinations = await Destination.find();

        console.log("Destinations fetched:", destinations.length); // ✅ Debug log

        res.status(200).json(destinations);
    } catch (error) {
        console.error("Error fetching destinations:", error); // ✅ Debug log
        res.status(500).json({ message: "Error fetching destinations", error });
    }
});

// ✅ Fetch a random destination
router.get("/random", async (req, res) => {
    try {
        const count = await Destination.countDocuments();
        const randomIndex = Math.floor(Math.random() * count);
        const randomDestination = await Destination.findOne().skip(randomIndex);

        res.status(200).json(randomDestination);
    } catch (error) {
        res.status(500).json({ message: "Error fetching random destination", error });
    }
});


// ✅ Add a new destination
router.post("/", async (req, res) => {
    try {
        const { city, country, clues, fun_fact, trivia } = req.body;
        if (!city || !country) return res.status(400).json({ error: "City and Country are required." });

        const newDestination = new Destination({ city, country, clues, fun_fact, trivia });
        await newDestination.save();

        res.json({ message: "Destination added successfully!", destination: newDestination });
    } catch (error) {
        res.status(500).json({ error: "Failed to add destination", details: error.message });
    }
});


router.post("/expand", expandDestination);


export default router;
