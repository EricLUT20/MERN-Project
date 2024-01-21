import React, { useState } from "react"
import "materialize-css/dist/css/materialize.min.css"
import { Navigate } from "react-router-dom"

const Login = ({ jwt, setJwt }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [hideEmailPlaceholder, setHideEmailPlaceholder] = useState(false)
  const [hidePasswordPlaceholder, setHidePasswordPlaceholder] = useState(false)

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    setHideEmailPlaceholder(e.target.value.trim() !== "")
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    setHidePasswordPlaceholder(e.target.value.trim() !== "")
  }

  const enterToLogin = (e) => {
    if (e.key === "Enter" && e.target.id === "password") {
      handleLogin()
    }
  }

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
          setJwt(data.token)
        } else {
          alert(data.message)
        }
      })
  }

  return (
    <div className="container">
      {jwt ? <Navigate to="/" /> : null}
      <form>
        <div className="input-field">
          <label
            className={hideEmailPlaceholder ? "active" : ""}
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className="input-field">
          <label
            className={hidePasswordPlaceholder ? "active" : ""}
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onKeyDown={enterToLogin}
            onChange={handlePasswordChange}
          />
        </div>
        <button
          className="btn waves-effect waves-light"
          type="button"
          onClick={handleLogin}
        >
          Login
        </button>
        {jwt ? <Navigate to="/" /> : null}
      </form>
    </div>
  )
}

export default Login
