import axios from "axios";
import dotenv from "dotenv";
dotenv.config({
    path: '../.env'
});

export default async function generateDestinationPrompt(promptText) {
    try {
        const API_KEY = process.env.GEMINI_API_KEY;
        const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

        const response = await axios.post(
            GEMINI_API_URL,
            {
                contents: [
                    {
                        parts: [{ text: promptText }]
                    }
                ]
            },
            {
                headers: { "Content-Type": "application/json" }
            }
        );

        

        // ✅ Extracting the response properly
        const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if(generatedText){
            console.log("Generated Response:", generatedText);
            return generatedText
        }
        else{
            console.log("No valid response generated");
            return null;
            
        }

        //generatedText = generatedText.replace(/```json\n?|\n?```/g, "");
        //console.log("Generated Response:", generatedText);

    } catch (error) {
        console.error("Error generating destinations:", error.response?.data || error.message);
    }
}

// Example usage:
//generateDestinationPrompt("Generate a fun fact and trivia about Berlin");
