var express = require("express")
var path = require("path")
var cookieParser = require("cookie-parser")
var logger = require("morgan")

// Routes paths
var indexRouter = require("./routes/index")
var usersRouter = require("./routes/users")
var messagesRouter = require("./routes/messages")

// Importing mongoose for database
const mongoose = require("mongoose")

// Initialize cors
const cors = require("cors")

// Intialize express
var app = express()

// Define middleware
app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))
app.use(cors({ origin: "http://localhost:3000", optionsSuccessStatus: 200 }))

// Define routes
app.use("/", indexRouter)
app.use("/users", usersRouter)
app.use("/messages", messagesRouter)

// Mongoose connecting to the database
const mongoDB = "mongodb://localhost:27017/mern-project"
mongoose.connect(mongoDB, {
  family: 4, // Using IPv4
})
mongoose.Promise = Promise
const db = mongoose.connection
// If connection is established
db.on("connected", () => console.log(`MongoDB connected: ${mongoDB}`))
// If error occurs
db.on("error", console.error.bind(console, "MongoDB connection error"))

module.exports = app
