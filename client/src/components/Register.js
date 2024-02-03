/* Register */
import React, { useState } from "react"

/* Importing react router dom */
import { Link, useNavigate } from "react-router-dom"

function Register() {
  /* For redirecting users */
  const navigate = useNavigate()

  /* States */
  const [name, setName] = useState("") // Storing user's name
  const [email, setEmail] = useState("") // Storing user's email
  const [password, setPassword] = useState("") // Storing user's password
  const [birthdate, setBirthdate] = useState("") // Storing user's birthdate
  const [hideNamePlaceholder, setHideNamePlaceholder] = useState(false) // Storing user's name placeholder
  const [hideEmailPlaceholder, setHideEmailPlaceholder] = useState(false) // Storing user's email placeholder
  const [hidePasswordPlaceholder, setHidePasswordPlaceholder] = useState(false) // Storing user's password placeholder
  const [hideBirthdatePlaceholder, setHideBirthdatePlaceholder] =
    useState(false) // Storing user's birthdate placeholder

  /* Updating changes user's name */
  const handleNameChange = (e) => {
    setName(e.target.value)
    setHideNamePlaceholder(e.target.value.trim() !== "")
  }

  /* Updating changes user's email */
  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    setHideEmailPlaceholder(e.target.value.trim() !== "")
  }

  /* Updating changes user's password */
  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    setHidePasswordPlaceholder(e.target.value.trim() !== "")
  }

  /* Updating changes user's birthdate */
  const handleBirthdateChange = (e) => {
    setBirthdate(e.target.value)
    setHideBirthdatePlaceholder(e.target.value.trim() !== "")
  }

  /* Handling registeration of user */
  const handleRegister = () => {
    // Sending POST request register user to server
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
        // If user is registered successfully redirect to login
        if (data.success) {
          navigate("/login")
        }

        // If user is not registered alert the user
        else {
          alert(data.message)
        }
      })
  }

  return (
    <div className="container">
      {/* Dating app title */}
      <h2 className="center">MERN Dating App</h2>
      <div className="divider" />
      {/* Registeration form */}
      <h4 className="center">Register</h4>
      <form className="col s12">
        <div className="row">
          {/* Input field for user's name */}
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
          {/* Input field for user's email */}
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
          {/* Input field for user's password */}
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
          {/* Input field for user's birthdate */}
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
        {/* Register button to send POST request to register the user */}
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
      {/* Link to login */}
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
