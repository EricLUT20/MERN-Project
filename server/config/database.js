/* Database address and SECRET key for JWT */

// Could use either this or dotenv

const config = {
  database: "mongodb://localhost:27017/mern-project", // Database address for storing information and data
  secret: "VERYEPICSECRETKEY", // Secret key for JWT token generation
}

module.exports = config
