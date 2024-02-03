/* Users Schema for MongoDB database */

// Importing mongoose for database
const mongoose = require("mongoose")

/* Creating UserSchema with relevant fields
name, email, password, birthdate, likedUsers, passedUsers, title, bio
likedUsers and passedUsers are arrays for storing user's likes and passes
Birthdate for getting user's age
*/
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  likedUsers: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  passedUsers: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  title: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
})

// Exporting UserSchema to other components
module.exports = mongoose.model("User", UserSchema)
