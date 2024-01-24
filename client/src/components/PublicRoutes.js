/* PublicRoutes
Making routes only unauthenticated users can access like "/login", "/register"
*/
import React, { useState, useEffect } from "react"
import { Outlet, Navigate } from "react-router-dom"

/* My Services */
import { isAuthenticated } from "../services/Authentication"

/* Importing a loading spinner */
import { ClipLoader } from "react-spinners"

function PrivateRoutes({ jwt }) {
  /* States */
  const [isAuthenticatedValue, setIsAuthenticatedValue] = useState(null)

  /* Checking authentication when the component mounts */
  useEffect(() => {
    const checkAuthentication = async () => {
      const result = await isAuthenticated()
      setIsAuthenticatedValue(result)
    }
    checkAuthentication()
  })

  /* While checking authentication display a loading spinner */
  if (isAuthenticatedValue === null) {
    return (
      <div className="spinner-container">
        <ClipLoader color="#36d7b7" />
      </div>
    )
  }

  /* If authenticated, redirect to home */
  return jwt || isAuthenticatedValue ? <Navigate to="/" /> : <Outlet />
}

export default PrivateRoutes
