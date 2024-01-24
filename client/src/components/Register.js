/* Register */
import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const Register = ({ jwt }) => {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [birthdate, setBirthdate] = useState("")
  const [hideNamePlaceholder, setHideNamePlaceholder] = useState(false)
  const [hideEmailPlaceholder, setHideEmailPlaceholder] = useState(false)
  const [hidePasswordPlaceholder, setHidePasswordPlaceholder] = useState(false)
  const [hideBirthdatePlaceholder, setHideBirthdatePlaceholder] =
    useState(false)

  const handleNameChange = (e) => {
    setName(e.target.value)
    setHideNamePlaceholder(e.target.value.trim() !== "")
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    setHideEmailPlaceholder(e.target.value.trim() !== "")
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    setHidePasswordPlaceholder(e.target.value.trim() !== "")
  }

  const handleBirthdateChange = (e) => {
    setBirthdate(e.target.value)
    setHideBirthdatePlaceholder(e.target.value.trim() !== "")
  }

  const handleRegister = () => {
    fetch("http://localhost:5000/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        birthdate,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          navigate("/login")
        } else {
          alert(data.message)
        }
      })
  }

  return (
    <div className="container">
      <h2 className="center">MERN Dating App</h2>
      <div className="divider" />
      <h4 className="center">Register</h4>
      <form className="col s12">
        <div className="row">
          <div className="input-field col s12">
            <input
              id="name"
              type="text"
              className={hideNamePlaceholder ? "validate" : ""}
              value={name}
              onChange={handleNameChange}
            />
            <label
              htmlFor="name"
              className={hideNamePlaceholder ? "active" : ""}
            >
              Name
            </label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
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
            <input
              id="password"
              type="password"
              className={hidePasswordPlaceholder ? "validate" : ""}
              value={password}
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
          <div className="input-field col s12">
            <input
              id="birthdate"
              type="date"
              className={hideBirthdatePlaceholder ? "validate" : ""}
              value={birthdate}
              onChange={handleBirthdateChange}
            />
            <label
              htmlFor="birthdate"
              className={hideBirthdatePlaceholder ? "active" : ""}
            >
              Birthdate
            </label>
          </div>
        </div>
        <div className="row">
          <button
            className="waves-effect waves-light btn"
            type="button"
            onClick={handleRegister}
          >
            Register
          </button>
        </div>
      </form>
      <div className="divider" />
      <h6 className="center">Already have an account?</h6>
      <Link
        to="/login"
        className="waves-effect waves-light btn red lighten-1"
        style={{ marginTop: "5px", marginBottom: "10px" }}
      >
        Login
      </Link>
    </div>
  )
}

export default Register
