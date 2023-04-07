require("dotenv").config({ path: "./.env" });
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

// ---------------------------------------- MIDDLEWARE ----------------------------------------- //
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// ---------------------------------------- DATABASE ----------------------------------------- //
// Database collections
const User = require("./models/users");
const Project = require("./models/projects");

// Connection to mongoDB Atlas
const dbUrl = `mongodb+srv://ZweZeya:${process.env.DB_PASSWORD}@sgdevelopers.qwrknrr.mongodb.net/TelegramDB?retryWrites=true&w=majority`;
mongoose.set("strictQuery", false); // Prevent Mongoose DeprecationWarning
mongoose.connect(dbUrl, (err) => {
    if (err) console.log(err.message);
    else console.log("Successfully established connection to MongoDB");
});

// ---------------------------------------- ROUTES ----------------------------------------- //
// Route to access user credentials
app.route("/api/user/:telegramId?")
    // Get user details
    .get((req, res) => {
        User.model.findOne({ telegramId: req.params.telegramId }, (err, user) => {
            if (err) throw err;
            if (!user) return res.status(401).send("Unregistered user");
            else return res.status(200).send(user);
        });
    })
    // Create new user
    .post(async (req, res) => {
        // console.log(req.body)
        const { name, age, education, description, contacts, telegramId } = req.body.user;
        const user = new User.model({
            name,
            age,
            education,
            description,
            contacts,
            telegramId,
        });
        try {
            await user.save();
            return res.status(201).json({ message: "Created new user successfully" });
        } 
        catch (err) {
            console.log(err.message)
            return res.status(500).json({ message: "Failure to register new user" });
        }
    })
    // Update user details
    .patch(async (req, res) => {
        const { name, age, education, description, contacts, telegramId } = req.body.user;
        try {
            const user = await User.model.findOne({ telegramId: telegramId });
            user.name = name;
            user.age = age;
            user.education = education;
            user.description = description;
            user.contacts = contacts;
            await user.save();
            return res.status(200).json({ message: "Edited user successfully" });
        } 
        catch (err) {
            console.log(err.message)
            return res.status(500).json({ message: "Failure to edit user" });
        }
    })
    // Delete user
    .delete(async (req, res) => {
        try {
            const user = await User.model.findOne({ telegramId: req.params.telegramId });
            if (!user) {
                return res.status(500).json({ message: "User does not exist" });
            };
            await User.model.deleteOne({ telegramId: req.params.telegramId });
            return res.status(200).json({ message: "User successfully deleted" })
        } 
        catch (err) {
            console.log(err.message)
            return res.status(500).json({ message: "Failure to delete user" });
        }
    });

// Route to access project information
app.route("/api/project/:id?")
    .get(async (req, res) => {
        try {
            const project = await Project.model.findById(req.params.id);
            return res.status(200).json(project);
        }
        catch (err) {
            console.log(err.message)
            return res.status(404).json({ message: `Project ${req.params.id} does not exist` });
        }
    })

    .post(async (req, res) => {
        // console.log(req.body)
        const { name, description, createdBy } = req.body.project;
        const project = new Project.model({
            name,
            description,
            createdBy,
        });
        try {
            await project.save();
            return res.status(201).json({ message: "Created new project successfully", project: project });
        }
        catch (err) {
            console.log(err.message)
            return res.status(500).json({ message: "Failure to create new project" });
        }
    })

    .delete(async (req, res) => {
        try {
            await Project.model.deleteMany();
            return res.status(200).json({ message: "Deleted all projects successfully" });
        }
        catch (err) {
            console.log(err.message)
            return res.status(500).json({ message: "Failure to delete all projects" });
        }
    })


// Run server
app.listen(PORT, () => {
  console.log(`Bot server has started.`);
});
