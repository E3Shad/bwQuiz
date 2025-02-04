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

const schema = Joi.object({
    firstName: Joi.string().regex(/^[a-zA-Z0-9\s\,\.\&\-]+$/).min(1).max(30).required(),
    // lastName: Joi.string().regex(/^[a-zA-Z0-9\s\,\.\&\-]+$/).min(1).max(30).required(),
    // email: Joi.string().regex(/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/).required(),
    // phoneNumber: Joi.string().regex(/^[0-9\s]+$/).min(1).max(30).required(),
    score: Joi.number().integer().required(),
});

const validateRegister = (req, res, next) => {
    const decryptedData = {
        firstName: cryptoJS.AES.decrypt(req.body.params.firstNameCiphertext, req.body.params.key).toString(cryptoJS.enc.Utf8),
        // lastName: cryptoJS.AES.decrypt(req.body.params.lastNameCiphertext, req.body.params.key).toString(cryptoJS.enc.Utf8),
        // email: cryptoJS.AES.decrypt(req.body.params.emailCiphertext, req.body.params.key).toString(cryptoJS.enc.Utf8),
        // phoneNumber: cryptoJS.AES.decrypt(req.body.params.phoneNumberCiphertext, req.body.params.key).toString(cryptoJS.enc.Utf8),
        score: parseInt(cryptoJS.AES.decrypt(req.body.params.scoreCiphertext, req.body.params.key).toString(cryptoJS.enc.Utf8), 10),
    };

    const { error } = schema.validate(decryptedData);

    if (error) {
        console.log("Validation error:", error);
        return res.status(400).send(error.details[0].message);
    }

    req.decryptedData = decryptedData; // Attach the decrypted data to the request object
    next();
};

quizRoutes.route("/register").post(rateLimiter, validateRegister, function (req, res) {
    // Remove or modify HTTPS redirect for local development
    // if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
    //     return res.redirect(`https://${req.header('host')}${req.url}`);
    // }

    // const { firstName, lastName, email, phoneNumber, score } = req.decryptedData;
    // const { firstName, email, score } = req.decryptedData;
    const { firstName, score } = req.decryptedData;



    const sanitizedFirstName = validator.escape(firstName);
    // const sanitizedLastName = validator.escape(lastName);
    // const sanitizedPhoneNumber = validator.escape(phoneNumber);

    // Ensure sanitizedScore is an integer
    const sanitizedScore = parseInt(score, 10);

    const decodedFirstName = decodeURIComponent(sanitizedFirstName);
    // const decodedLastName = decodeURIComponent(sanitizedLastName);
    // const decodedPhoneNumber = decodeURIComponent(sanitizedPhoneNumber);

    let newdate = new Date();
    let user = new User({
        date: new Date(newdate),
        firstName: decodedFirstName,
        // lastName: decodedLastName,
        // email: email,
        // phoneNumber: decodedPhoneNumber,
        score: sanitizedScore,
    });

    user.validate(function (error) {
        if (error) {
            console.log("Validation error on user:", error);
            res.json({
                "message": "Insert user record failed"
            });
        } else {
            let db_connect = dbo.getDb("quiz");

            try {
                db_connect.collection("users").insertOne(user, (err, insertResult) => {
                    if (err) {
                        console.log("Database insert error:", err);
                        res.status(500).send("Error inserting user record.");
                    } else {
                        const insertedId = insertResult.insertedId;
                        res.json({ insertedId });
                    }
                });
            } catch (e) {
                console.log("Database insert error:", e);
                res.status(500).send("Error inserting user record.");
            }
        }
    });
});

quizRoutes.route("/getLeaderboard").get(rateLimiterForLeaderboard, function (req, res) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(`https://${req.header('host')}${req.url}`);
    }
    const requiredFields = { _id: 1, firstName: 1, score: 1 };
    let db_connect = dbo.getDb("quiz");
    db_connect.collection("users").find({}, { projection: requiredFields })
        .toArray(function (err, result) {
            if (err) throw err;
            const encryptedKey = cryptoJS.AES.encrypt(JSON.stringify(process.env.LEADERBOARDSECRET), "thanksforplaying").toString();
            const encryptedData = cryptoJS.AES.encrypt(JSON.stringify(result), process.env.LEADERBOARDSECRET).toString();

            res.json({ encryptedData, encryptedKey });
        });
});

// Get top 10 highest scores
quizRoutes.get("/topScores", async (req, res) => {
    let db_connect = dbo.getDb("quiz");

    try {
        db_connect.collection("users").find({}, { projection: { firstName: 1, score: 1 } })
            .sort({ score: -1 })
            .limit(10)
            .toArray((err, result) => {
                if (err) throw err;
                res.json(result);
            });
    } catch (e) {
        console.log(e);
        res.status(500).send("Error fetching top scores");
    }
});

module.exports = quizRoutes;
