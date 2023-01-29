require("dotenv").config({ path: "./.env" });
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const { HOST, PORT } = process.env;

// ---------------------------------------- MIDDLEWARE ----------------------------------------- //
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// ---------------------------------------- DATABASE ----------------------------------------- //
// Database collections
const User = require("./models/users");
const Projects = require("./models/projects");

// Connection to mongoDB Atlas
const dbUrl = `mongodb+srv://ZweZeya:${process.env.DB_PASSWORD}@sgdevelopers.qwrknrr.mongodb.net/TelegramDB?retryWrites=true&w=majority`;
mongoose.set("strictQuery", false); // Prevent Mongoose DeprecationWarning
mongoose.connect(dbUrl, (err) => {
  if (err) console.log(err.message);
  else console.log("Successfully established connection to MongoDB");
});

// ---------------------------------------- ROUTES ----------------------------------------- //

// Route to access user credentials
app
  .route("/api/user/:telegramId?")
  // Get user details
  .get((req, res) => {
    User.findOne({ telegramId: req.params.telegramId }, (err, user) => {
      if (err) throw err;
      if (!user) return res.status(401).send("Unregistered user");
      else return res.status(200).send(user);
    });
  })
  // Create new user
  .post(async (req, res) => {
    const { name, age, education, description, contacts, telegramId } =
      req.body;
    const user = new User({
      name,
      age,
      education,
      description,
      contacts,
      telegramId,
    });
    try {
      await user.save();
      res.status(201).json({ message: "Created new user successfully" });
    } catch (err) {
      return next(err);
    }
  })
  // Update user details
  .patch(async (req, res) => {
    const { name, age, education, description, contacts, telegramId } =
      req.body;
    try {
      const user = await User.findById({ telegramId });
      user.name = name;
      user.age = age;
      user.education = education;
      user.description = description;
      user.contacts = contacts;
      await user.save();
      res.status(200).json({ message: "Edited user successfully" });
    } catch (err) {
      return next(err);
    }
  })
  // Delete user
  .delete(async (req, res) => {
    try {
      const user = await User.findById(req.params.telegramId);
      if (!user) {
        res.status(500).json({ message: "User does not exist" });
        return;
      }

      await User.findByIdAndDelete(req.params.telegramId);
    } catch (err) {
      return next(err);
    }
  });

app.use((error, req, res, next) => {
  console.log(error);
  res
    .status(error.status || 500)
    .json({ message: `Error: ${error.message || "Something went wrong!"}` });
});

// Run server
app.listen(PORT, () => {
  console.log(`Bot server has started on http://${HOST}:${PORT}`);
});
