var express = require("express")
var router = express.Router()

// Importing validation tools for email and password
const { body, validationResult } = require("express-validator")

// ValidateToken middleware
const ValidateToken = require("../auth/ValidateToken")

// Importing dotenv to use .env for secret key
require("dotenv").config()
const SECRET = process.env.SECRET
console.log(SECRET)

// Importing authentication tools
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

// Importing the User model
const User = require("../models/User")

/* POST routes */

// Validate token
router.post("/tokenValid", ValidateToken, async (req, res) => {
  // return a success message if the token is valid
  return res
    .status(200)
    .json({ success: true, id: req.user, message: "Token is valid" })
})

// Register user
router.post("/register", async (req, res) => {
  const { name, email, password, birthdate } = req.body

  // If not all fields are entered respond back with false message
  if (!name || !email || !password || !birthdate) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter all fields" })
  }

  // Check for existing users with same email
  const existingUser = await User.findOne({ email })

  // If user is found respond back with false message
  if (existingUser) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists" })
  }
  // If no existing user already create a new user
  else {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) throw err
        User.create({
          name: req.body.name,
          email: req.body.email,
          birthdate: req.body.birthdate,
          password: hash,
        })
      })
    })
    // Respond with true message
    res
      .status(200)
      .json({ success: true, message: "User registered successfully" })
  }
})

// Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body
  // If no email or password is found respond with false message
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter all fields" })
  }

  // Check for existing users with same email
  const existingUser = await User.findOne({ email: req.body.email })

  // If user is found then compare the submitted password with the password in the database
  if (existingUser) {
    // Using bcrypt to compare the hashed password
    bcrypt.compare(password, existingUser.password, (err, isMatch) => {
      if (err) throw err
      // If passwords match then create JWT authentication token and respond with true message and the token
      if (isMatch) {
        // Create JWT token with the user email and SECRET key from config
        const token = jwt.sign({ email: existingUser.email }, SECRET, {
          expiresIn: "1h", // How long do we want the token to be valid for, currently 1h
        })
        return res.status(200).json({
          success: true,
          message: "Login successful",
          token: "Bearer " + token,
        })
      }

      // If user password is incorrect respond with false message
      else {
        return res
          .status(400)
          .json({ success: false, message: "Wrong credentials" })
      }
    })
  }

  // If user by email is not found respond with false message
  else {
    return res.status(400).json({ success: false, message: "User not found" })
  }
})

/* GET users listing. */

// Getting a new user for the current user to decide on (like or pass)
router.get("/newUser/:userId", ValidateToken, async function (req, res, next) {
  const { userId } = req.params

  try {
    // Find the current user to get their liked and passed users
    const currentUser = await User.findOne({ _id: userId })
    const likedUsers = currentUser.likedUsers || []
    const passedUsers = currentUser.passedUsers || []

    // Find a new user that the current user hasn't liked or passed
    const newUser = await User.findOne({
      _id: { $nin: [userId, ...likedUsers, ...passedUsers] },
    })

    // Calculating the new user's age to display on the client
    const currentDate = new Date()
    const birthYear = new Date(newUser.birthdate).getFullYear()
    const currentYear = new Date().getFullYear()
    const newBirthYear = newUser.birthdate.setFullYear(currentYear)
    let newUserAge = 0
    // Checking if new user already had their birthday, if they did -1
    if (currentDate < newBirthYear) {
      newUserAge = currentYear - birthYear - 1
    }
    // If they didn't have their birthday continue normally
    else {
      newUserAge = currentYear - birthYear
    }

    // If found a user that hasn't been matched yet respond with the new user relevant details
    if (newUser) {
      res.json({
        success: true,
        newUser: {
          _id: newUser._id,
          name: newUser.name,
          age: newUserAge,
          title: newUser.title,
          bio: newUser.bio,
        },
      })
    }

    // If no new user is found respond with a message
    else {
      res.json({ success: false, message: "No more users available" })
    }
  } catch (error) {
    // If an error with finding users respond with an error message
    res.status(500).json({ success: false, message: error.message })
  }
})

router.get("/", function (req, res, next) {
  res.send("respond with a resource")
})

module.exports = router
