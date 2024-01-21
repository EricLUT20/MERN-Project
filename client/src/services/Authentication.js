async function login(username, password) {
  const response = await fetch("http://localhost:5000/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })
  return response.data
}

function logout() {
  localStorage.removeItem("token")
}

function isAuthenticated() {
  const token = localStorage.getItem("token")
  return token !== null
}

export { login, logout, isAuthenticated }
