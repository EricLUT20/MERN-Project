import React, { useState } from "react"
import "./App.css"
import FormCard from "./components/FormCard"
import Home from "./components/Home"
import PrivateRoutes from "./components/PrivateRoutes"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { isAuthenticated } from "./services/Authentication"
import Login from "./components/Login"

function App() {
  const [jwt, setJwt] = useState(null)

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route element={<PrivateRoutes jwt={jwt} />}>
            <Route element={<Home />} path="/" exact />
          </Route>
          <Route
            element={<FormCard jwt={jwt} setJwt={setJwt} />}
            path="/login"
          />
        </Routes>
      </Router>
      {/* jwt ? <Home jwt={jwt} /> : <FormCard jwt={jwt} setJwt={setJwt} /> */}
    </div>
  )
}

export default App
