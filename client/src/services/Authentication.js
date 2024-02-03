/* Authentication & Logging out Services */

/* Logging out */
function logout() {
  localStorage.removeItem("token") // Removing token from localstorage
}

/* Checking if the token is valid or not using the /users/tokenValid POST route */
async function isAuthenticated() {
  try {
    if (!localStorage.getItem("token")) {
      // If no token in localstorage
      return false
    }
    const res = await fetch("http://localhost:5000/users/tokenValid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"), // Sending token in headers
      },
    })
    const data = await res.json() // Getting response from server
    const userId = data.id // Getting the user's id
    return userId // Returning the user's id so we can find him in the database
  } catch (error) {
    // If an error occurs return false so we can redirect to login
    localStorage.removeItem("token")
    console.log(error)
    return false
  }
}

export { logout, isAuthenticated }
