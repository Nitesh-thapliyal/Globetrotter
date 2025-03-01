import Destination from "../models/Destination.js";
import generateDestinationPrompt from "../utils/expandDestinations.js"; // Import AI function

// ✅ Fetch all destinations
export const getAllDestinations = async (req, res) => {
    try {
        const destinations = await Destination.find();
        res.status(200).json(destinations);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch destinations." });
    }
};

// ✅ Expand a destination with AI-generated content
export const expandDestination = async (req, res) => {
    try {
        const { city, difficulty = "medium" } = req.body; // Get city name from request
        if (!city) return res.status(400).json({ error: "City name is required." });

        // Find the existing destination in MongoDB
        let destination = await Destination.findOne({ name: new RegExp("^" + city + "$", "i") });

        // If destination doesn't exist, create a new one
        if (!destination) {
            destination = new Destination({
                name: city,  // ✅ Use 'name' instead of 'city'
                clues: [],
                funFacts: [],
                trivia: []
            });
            await destination.save(); // ✅ Ensure it's saved
        }

        // 🔹 Generate AI-based clues, fun facts & trivia
        const aiGeneratedData = await generateDestinationPrompt(
            `Generate three cryptic clues, two fun facts, and one trivia question for the travel destination: ${city}.
            
            - Clues should match the difficulty level:  
              - Easy: Simple hints referencing famous landmarks.  
              - Medium: Wordplay and cultural hints.  
              - Hard: Obscure historical references or local legends.  
            - Fun facts should be surprising and unique.  
            - Trivia should be challenging but answerable.  
            
            Difficulty: ${difficulty}

            Format as valid JSON (without Markdown, without backticks):
            {
              "clues": ["clue1", "clue2", "clue3"],
              "funFacts": ["fact1", "fact2"],
              "trivia": ["trivia1"]
            }`
        );

        if (!aiGeneratedData) return res.status(500).json({ error: "Failed to generate AI content." });

        // 🔹 Parse AI response
        let parsedData;
        try {
            // Remove unwanted markdown formatting
            const cleanedResponse = aiGeneratedData.replace(/```json|```/g, "").trim();
            parsedData = JSON.parse(cleanedResponse);
        } catch (parseError) {
            return res.status(500).json({ error: "Invalid AI response format.", details: parseError.message });
        }

        // Ensure valid structure from AI response
        if (!parsedData.clues || !parsedData.funFacts || !parsedData.trivia) {
            return res.status(500).json({ error: "AI response missing required fields." });
        }

        // Append AI-generated content
        // Append AI-generated content (avoid duplicates)
        destination.clues = Array.from(new Set([...destination.clues, ...parsedData.clues]));
        destination.funFacts = Array.from(new Set([...destination.funFacts, ...parsedData.funFacts]));
        destination.trivia = Array.from(new Set([...destination.trivia, ...parsedData.trivia]));


        // Save the updated destination
        await destination.save();

        res.status(200).json({ message: "Destination expanded successfully!", destination });

    } catch (error) {
        res.status(500).json({ error: "Error expanding destination.", details: error.message });
    }
};
