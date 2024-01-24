/* Header */
import React from "react"
import { Link } from "react-router-dom"

/* My Services */
import { logout } from "../services/Authentication"

function Header() {
  /* Handling Logging out */
  async function handleLogout() {
    try {
      await logout()
      window.location.reload() // Reload the page to update localStorage
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <nav className="navbar">
        <div className="nav-wrapper">
          <ul className="left">
            <li>
              <Link to="/">MERN Dating App</Link>
            </li>
          </ul>
          <ul className="right">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/messages">Messages</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/login" onClick={handleLogout}>
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  )
}

export default Header
