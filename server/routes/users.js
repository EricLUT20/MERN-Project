// Express
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

/* PUT routes */
router.put("/:newId/:action", ValidateToken, async (req, res) => {
  try {
    // Get the user from parameters
    const { newId, action } = req.params

    // Find the user from the database using the id from the ValidateToken middleware
    const user = await User.findById(req.user)

    // If the action is like then push the new id to the likedUsers array
    if (action === "like") {
      user.likedUsers.push(newId)

      // If the action is pass then push the new id to the passedUsers array
    } else if (action === "pass") {
      user.passedUsers.push(newId)
    }

    // Save the user
    user.save()

    // Return success with message
    return res
      .status(200)
      .json({ success: true, message: `${user.name} Updated` })

    // If error occurs display error
  } catch (error) {
    console.log(error)

    // Return error with message
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" })
  }
})

// PUT route to Update user's Profile
router.put("/profile", ValidateToken, async (req, res) => {
  try {
    // Get the user from the database using the id from the ValidateToken middleware
    const { name, title, bio } = req.body

    // Find the user in database by id
    const user = await User.findById(req.user)

    // Update the user's name, title and bio
    user.name = name
    user.title = title
    user.bio = bio

    // Save the user
    user.save()

    // Return success with message
    return res
      .status(200)
      .json({ success: true, message: "Profile Succesfully Updated" })

    // If error occurs display error
  } catch (error) {
    console.log(error)

    // Return error with message
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" })
  }
})

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
  // Get the name, email, password and birthdate from the request body
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
    // Using bcrypt to hash the password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) throw err // If error occurs respond back with false message

        // Create new user to the database
        User.create({
          name: req.body.name,
          email: req.body.email,
          birthdate: req.body.birthdate,
          password: hash,
        })
      })
    })

    // Respond with success and message
    res
      .status(200)
      .json({ success: true, message: "User registered successfully" })
  }
})

// Login user
router.post("/login", async (req, res) => {
  // Get the email and password from the request body
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

        // Respond with success and token
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
router.get("/newUser", ValidateToken, async function (req, res, next) {
  // Get the current user id from the ValidateToken middleware
  const userId = req.user

  try {
    // Find the current user to get their liked and passed users
    const currentUser = await User.findOne({ _id: userId })
    const likedUsers = currentUser.likedUsers || []
    const passedUsers = currentUser.passedUsers || []

    // Find a new user that the current user hasn't liked or passed
    const newUser = await User.findOne({
      _id: { $nin: [userId, ...likedUsers, ...passedUsers] },
    })

    // If found a user that hasn't been matched yet respond with the new user relevant details
    if (newUser) {
      // Calculating the new user's age to display on the client
      const currentDate = new Date()
      const birthYear = new Date(newUser.birthdate).getFullYear()
      const currentYear = new Date().getFullYear()
      const newBirthYear = newUser.birthdate.setFullYear(currentYear)
      let newUserAge = 0

      // Checking if the new user already had their birthday, if they did -1
      if (currentDate < newBirthYear) {
        newUserAge = currentYear - birthYear - 1
      }
      // If they didn't have their birthday continue normally
      else {
        newUserAge = currentYear - birthYear
      }

      // Respond with success and the new user
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
    } else {
      // If no new user is found respond with a message
      res.json({ success: false, message: "No more users" })
    }

    // If error occurs respond with an error message
  } catch (error) {
    // If an error with finding users respond with an error message
    res.status(500).json({ success: false, message: error.message })
  }
})

// Getting the current user profile
router.get("/profile", ValidateToken, async function (req, res, next) {
  try {
    // Get the user from the database using the id from the ValidateToken middleware
    const user = await User.findById(req.user)

    // Respond with success and the user
    res.json({
      success: true,
      user: user,
      message: "Profile fetched succesfully",
    })

    // If error occurs respond with an error message
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" })
  }
})

// Getting the user's matches if both users liked each other
router.get("/matches", ValidateToken, async function (req, res, next) {
  try {
    let matchedUsers = []

    // Get the user from the database using the id from the ValidateToken middleware
    const user = await User.findById(req.user)

    // Loop through the user's liked users and if they liked the current user add them to the matchedUsers array
    for (let i = 0; i < user.likedUsers.length; i++) {
      // Get the liked user from the database
      const likedUser = await User.findById(user.likedUsers[i])
      // Check if the liked user has liked the current user
      if (likedUser.likedUsers.includes(user._id)) {
        console.log(likedUser)
        matchedUsers.push(likedUser)
      }
    }

    // Respond with success and the matched users
    res.status(200).json({
      success: true,
      message: "Matches fetched",
      matchedUsers: matchedUsers,
    })

    // If error occurs respond with an error message
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" })
  }
})

/* GET route */
router.get("/", function (req, res, next) {
  res.send("respond with a resource")
})

module.exports = router
