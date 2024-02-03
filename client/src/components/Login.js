/* Login */
import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

/* Materialize CSS */
import "materialize-css/dist/css/materialize.min.css"

function Login() {
  /* For redirecting user */
  const navigate = useNavigate()

  /* States 
  Creating two states for email and password
  and for placeholders to show if they are empty or not
  */
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [hideEmailPlaceholder, setHideEmailPlaceholder] = useState(false)
  const [hidePasswordPlaceholder, setHidePasswordPlaceholder] = useState(false)

  /* Updating changes in email */
  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    setHideEmailPlaceholder(e.target.value.trim() !== "")
  }

  /* Updating changes in password */
  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    setHidePasswordPlaceholder(e.target.value.trim() !== "")
  }

  /* Using Enter key to Login */
  const enterToLogin = (e) => {
    if (e.key === "Enter" && e.target.id === "password") {
      handleLogin()
    }
  }

  /* POST request to /users/login to login */
  const handleLogin = () => {
    fetch("http://localhost:5000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem("token", data.token) // Storing token in localstorage
          navigate("/") // Redirecting to index page
        } else {
          alert(data.message)
        }
      })
  }

  return (
    <div className="container">
      {/* Title */}
      <h2 className="center">MERN Dating App</h2>
      {/* Divider */}
      <div className="divider" />
      {/* Login form */}
      <h4 className="center">Login</h4>
      <form className="col s12">
        <div className="row col s12">
          <div className="input-field col s12">
            {/* Email */}
            <input
              id="email"
              type="text"
              className={hideEmailPlaceholder ? "validate" : ""}
              value={email}
              onChange={handleEmailChange}
            />
            <label
              htmlFor="email"
              className={hideEmailPlaceholder ? "active" : ""}
            >
              Email
            </label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            {/* Password */}
            <input
              id="password"
              type="password"
              className={hidePasswordPlaceholder ? "validate" : ""}
              value={password}
              onKeyDown={enterToLogin}
              onChange={handlePasswordChange}
            />
            <label
              htmlFor="password"
              className={hidePasswordPlaceholder ? "active" : ""}
            >
              Password
            </label>
          </div>
        </div>
        <div className="row">
          {/* Login button to submit form */}
          <button
            className="waves-effect waves-light btn"
            type="button"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </form>
      <div className="divider" />
      {/* Register link */}
      <h6 className="center">Don't have an account?</h6>
      <Link
        to="/register"
        className="waves-effect waves-light btn red lighten-1"
        style={{ marginTop: "5px", marginBottom: "10px" }}
      >
        Register
      </Link>
    </div>
  )
}

export default Login
