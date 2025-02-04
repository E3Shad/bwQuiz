const rateLimiter = require('./../middlewares/rateLimiter.js');
const rateLimiterForLeaderboard = require('./../middlewares/rateLimiterForLeaderboard.js');
const express = require("express");
const cryptoJS = require('crypto-js');
const quizRoutes = express.Router();
// This will help us connect to the database
const dbo = require("../db/conn");
const Joi = require('joi');
const validator = require('validator');
// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;
const User = require("../db/userModel");
const seedrandom = require('seedrandom');

// Validation schema
const quizCompletionSchema = Joi.object({
  quizId: Joi.string().required(),
  score: Joi.number().min(0).max(100).required(),
  userId: Joi.string().required()
});

// Generate code endpoint
quizRoutes.post('/generate-quiz-code', rateLimiter, async (req, res) => {
  try {
    const { error } = quizCompletionSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const { quizId, score, userId } = req.body;
    
    // Only generate code if score is above threshold
    if (score < 70) {
      return res.status(400).json({ 
        success: false, 
        message: "Score too low to generate prize code" 
      });
    }

    // Generate unique code
    const timestamp = Date.now();
    const seed = `${quizId}-${userId}-${timestamp}`;
    const rng = seedrandom(seed);
    const code = Math.floor(rng() * 900000 + 100000).toString();

    // Store in database
    const db_connect = dbo.getDb();
    await db_connect.collection("quiz_completion_codes").insertOne({
      code,
      quizId,
      userId,
      score,
      createdAt: new Date(),
      used: false
    });

    res.json({ success: true, code });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error generating code" });
  }
});

// Verify code endpoint
quizRoutes.get('/verify-quiz-code', rateLimiter, async (req, res) => {
  try {
    const { code } = req.query;

    const db_connect = dbo.getDb();
    const quizCode = await db_connect.collection("quiz_completion_codes").findOne({ 
      code, 
      used: false 
    });

    if (!quizCode) {
      return res.json({ match: false });
    }

    // Mark code as used
    await db_connect.collection("quiz_completion_codes").updateOne(
      { _id: quizCode._id },
      { $set: { used: true, usedAt: new Date() }}
    );

    res.json({ match: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error verifying code" });
  }
});

module.exports = quizRoutes;