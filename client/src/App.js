/* App */
import React, { useState } from "react"
import "./App.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

/* My Components */
import Home from "./components/Home"
import Login from "./components/Login"
import Register from "./components/Register"
import Profile from "./components/Profile"
import Messages from "./components/Messages"
import PrivateRoutes from "./components/PrivateRoutes"
import PublicRoutes from "./components/PublicRoutes"

function App() {
  const [jwt, setJwt] = useState(null)

  return (
    <div className="App">
      {/* Routes */}
      <Router>
        <Routes>
          {/* Private Routes */}
          <Route element={<PrivateRoutes jwt={jwt} />}>
            <Route
              element={<Home jwt={jwt} setJwt={setJwt} />}
              path="/"
              exact
            />
            <Route element={<Profile />} path="/profile" />
            <Route element={<Messages />} path="/messages" />
          </Route>
          {/* Public Routes */}
          <Route element={<PublicRoutes jwt={jwt} />}>
            <Route
              element={<Login jwt={jwt} setJwt={setJwt} />}
              path="/login"
            />
            <Route element={<Register jwt={jwt} />} path="/register" />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App
