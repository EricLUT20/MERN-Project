/* Match Schema for MongoDB database */

// Importing mongoose for database
const mongoose = require("mongoose")

// Creating MatchSchema with relevant fields
const MatchSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  match: {
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
