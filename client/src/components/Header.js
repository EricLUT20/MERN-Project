import React, { useState } from "react"
import { Link } from "react-router-dom"
import { logout } from "../services/Authentication"

function Header() {
  const [showMenu, setShowMenu] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error(error)
    }
  }

  const toggleMenu = () => {
    setShowMenu(!showMenu)
  }

  return (
    <>
      <nav className="navbar">
        <div className="nav-wrapper">
          <ul className="left nav-logo">
            <li>
              <Link to="/">MERN Dating App</Link>
            </li>
          </ul>
          <div className="right">
            <div className="nav-toggle" onClick={toggleMenu}>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>
            <ul className={`nav-items ${showMenu ? "show" : ""}`}>
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
        </div>
      </nav>
    </>
  )
}

export default Header
