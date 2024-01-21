import React from "react"
import Login from "./Login"
import Register from "./Register"
import Home from "./Home"

function FormCard({ jwt, setJwt }) {
  return (
    <div>
      <h2 className="center container">MERN Dating App</h2>
      <div className="row">
        <div className="col s12 m6 offset-m3">
          <div className="card">
            <div className="card-content">
              <h4>Login</h4>
              <Login jwt={jwt} setJwt={setJwt} />
              <br />
              <div className="divider"></div>
              <div className="section">
                <h5>Don't have an account?</h5>
                <Register setJwt={setJwt} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormCard
