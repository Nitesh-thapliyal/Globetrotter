/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DestinationCard = ({ destination }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");
  const [progress, setProgress] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Auto-detect dark mode
    setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  const fetchExpandedData = async () => {
    setProgress(30);
    const response = await axios.post("http://localhost:5000/api/destinations/expand", {
      city: destination.name,
      difficulty,
    });
    setProgress(100);
    return response.data.destination;
  };

  const { data: expandedData, isLoading, error, refetch } = useQuery({
    queryKey: ["expandedDestination", destination.name, difficulty],
    queryFn: fetchExpandedData,
    enabled: false,
  });

  const handleExpand = async () => {
    try {
      setProgress(10);
      await refetch();
      setIsExpanded(true);
      toast.success("Destination expanded successfully! 🎉");
    } catch (err) {
      toast.error("Failed to expand destination. Try again later.");
    }
  };

  return (
    <motion.div 
      className={`border rounded-lg p-4 shadow-md cursor-pointer transition-all ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
      whileHover={{ scale: 1.02 }} 
      whileTap={{ scale: 0.98 }} 
    >
      <h2 className="text-xl font-bold">{destination.name}</h2>

      {/* Difficulty Selection */}
      <div className="mt-2">
        <label className="font-semibold">Select Difficulty: </label>
        <select 
          className="ml-2 p-1 border rounded-md bg-gray-100 dark:bg-gray-700"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Progress Bar */}
      {isLoading && (
        <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
          <motion.div 
            className="h-2 bg-blue-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}

      {isExpanded && expandedData ? (
        <motion.div 
          className="mt-4"
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: "auto" }} 
          transition={{ duration: 0.5 }}
        >
          <h3 className="font-semibold text-blue-400">Clues:</h3>
          <ul>
            {expandedData.clues.map((clue, index) => (
              <li key={index}>🔍 {clue}</li>
            ))}
          </ul>

          <h3 className="font-semibold text-green-400">Fun Facts:</h3>
          <ul>
            {expandedData.funFacts.map((fact, index) => (
              <li key={index}>💡 {fact}</li>
            ))}
          </ul>

          <h3 className="font-semibold text-purple-400">Trivia:</h3>
          <p>❓ {expandedData.trivia[0]}</p>

          {/* Collapse Button */}
          <motion.button
            className="bg-red-500 text-white px-4 py-2 rounded-md mt-3 hover:bg-red-600 transition"
            onClick={() => setIsExpanded(false)}
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
          >
            Collapse
          </motion.button>
        </motion.div>
      ) : (
        <motion.button
          className="bg-blue-500 text-white px-4 py-2 rounded-md mt-3 hover:bg-blue-600 transition flex items-center justify-center"
          onClick={handleExpand}
          disabled={isLoading}
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"></circle>
              <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          ) : "Expand Destination"}
        </motion.button>
      )}

      {error && <p className="text-red-500 mt-2">{error.message}</p>}
    </motion.div>
  );
};

export default DestinationCard;
