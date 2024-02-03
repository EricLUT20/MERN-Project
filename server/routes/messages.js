// Express
var express = require("express")
var router = express.Router()

// ValidateToken middleware
const ValidateToken = require("../auth/ValidateToken")

// Importing Message model
const Message = require("../models/Message")

// Importing User model
const User = require("../models/User")

/* POST routes */

// POST route for Sending message to user
router.post("/", ValidateToken, async function (req, res) {
  const owner = req.user
  const { message, to } = req.body

  // Checking if all fields are filled
  if (!message || !to || !owner) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter all fields" })
  }

  // Finding the users in the database
  const ownerUser = await User.findById(owner)
  const toUser = await User.findById(to)

  // Checking if the users exist
  if (!ownerUser || !toUser) {
    return res.status(400).json({ success: false, message: "User not found" })
  }

  // Checking if the sender and receiver are the same user
  if (owner === to) {
    return res
      .status(400)
      .json({ success: false, message: "You can't message yourself" })
  }

  // Checking if the users have liked each other so they are allowed to send messages to each other
  if (
    !ownerUser.likedUsers.includes(to) &&
    !toUser.likedUsers.includes(owner)
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Users are not matched" })
  }

  // Creating the new message and saving in the database
  const newMessage = new Message({ owner, message, to })
  newMessage.save()

  console.log(newMessage)

  res.json({ success: true, message: "Message sent" })
})

/* GET routes */

// Get user's messages
router.get("/:id", ValidateToken, async function (req, res) {
  const owner = req.user
  const to = req.params.id

  try {
    // Fetch messages from owner to 'to'
    const messagesFromOwner = await Message.find({ owner, to })

    // Fetch messages from 'to' to owner
    const messagesToOwner = await Message.find({ owner: to, to: owner })

    const allMessages = [...messagesFromOwner, ...messagesToOwner]

    // Sort all messages by timestamp in ascending order
    allMessages.sort((a, b) => a.timestamp - b.timestamp)

    console.log(allMessages)

    res.json({ success: true, messages: allMessages })

    // If error occurs display error
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: "Something went wrong" })
  }
})

// Get all messages
router.get("/", function (req, res, next) {
  res.send("respond with a resource")
})

module.exports = router
