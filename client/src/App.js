/* App */
import React from "react"
import "./App.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

/* My Components */
import Home from "./components/Home"
import Login from "./components/Login"
import Register from "./components/Register"
import Profile from "./components/Profile"
import User from "./components/User"
import Messages from "./components/Messages"

/* My Components for Public and Private Routes */
import PrivateRoutes from "./components/PrivateRoutes"
import PublicRoutes from "./components/PublicRoutes"

function App() {
  return (
    <div className="App">
      {/* Routes */}
      <Router>
        <Routes>
          {/* Private Routes */}
          <Route element={<PrivateRoutes />}>
            <Route element={<Home />} path="/" exact />
            <Route element={<Profile />} path="/profile" />
            <Route element={<User />} path="/user/:userId" />
            <Route element={<Messages />} path="/messages" />
          </Route>
          {/* Public Routes */}
          <Route element={<PublicRoutes />}>
            <Route element={<Login />} path="/login" />
            <Route element={<Register />} path="/register" />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App
