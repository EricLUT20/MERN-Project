/* Messages Schema for MongoDB database */

// Importing mongoose for database
const mongoose = require("mongoose")

// Creating MessageSchema with relevant fields
const MessageSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
})

// Exporting MessageSchema to other components
module.exports = mongoose.model("Message", MessageSchema)
