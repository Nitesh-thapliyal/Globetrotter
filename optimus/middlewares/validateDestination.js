import { body, validationResult } from "express-validator";


const validateDestination = [
  body("name").notEmpty().withMessage("Destination name is required"),
  body("clues").isArray({ min: 1 }).withMessage("At least one clue is required"),
  body("funFacts").isArray({ min: 1 }).withMessage("At least one fun fact is required"),
  body("trivia").isArray({ min: 1 }).withMessage("At least one trivia question is required"),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = validateDestination;
