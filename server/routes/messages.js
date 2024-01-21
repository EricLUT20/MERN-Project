var express = require("express")
var router = express.Router()

// Importing Message model
const Message = require("../models/Message")

/* POST routes */

router.post("/", function (req, res) {
  const { email, message } = req.body
})

/* GET routes */

// Get user's messages
router.get("/:id", async function (req, res) {
  const { id } = req.params.id
  const messages = await Message.find({ owner: id })
  console.log(messages)
  res.send("respond with a resource")
})

// Get all messages
router.get("/", function (req, res, next) {
  res.send("respond with a resource")
})

module.exports = router
