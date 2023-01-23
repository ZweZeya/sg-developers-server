require('dotenv').config({ path: './.env' });
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const { HOST, PORT } = process.env

// ---------------------------------------- MIDDLEWARE ----------------------------------------- //
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// ---------------------------------------- DATABASE ----------------------------------------- //
// Database collections 
const User = require('./models/users');
const Projects = require('./models/projects')

// Connection to mongoDB Atlas 
const dbUrl = `mongodb+srv://ZweZeya:${process.env.DB_PASSWORD}@sgdevelopers.qwrknrr.mongodb.net/TelegramDB?retryWrites=true&w=majority`;
mongoose.set("strictQuery", false); // Prevent Mongoose DeprecationWarning 
mongoose.connect(dbUrl, (err) => {
    if (err) console.log(err.message);
    else console.log("Successfully established connection to MongoDB");
});

// ---------------------------------------- ROUTES ----------------------------------------- //

// Route to access user credentials
app.route("/api/user/:telegramId")
    // Get user details 
    .get((req, res) => {
        User.findOne({ telegramId: req.params.telegramId }, (err, user) => {
            if (err) throw err;
            if (!user) return res.status(401).send("Unregistered user");
            else return res.status(200).send(user);
        });
    })
    // Create new user
    .post((req, res) => {
        return res.status(200).send("hello")
    })
    // Update user details
    .patch((req, res) => {
        return res.status(200).send("hello")
    })
    // Delete user 
    .delete((req, res) => {
        return res.status(200).send("hello")
    })


// Run server
app.listen(PORT, () => {
    console.log(`Bot server has started on http://${HOST}:${PORT}`)
})