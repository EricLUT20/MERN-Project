/* PrivateRoutes 
Making routes only authenticated users can access like "/", "/messages"
*/
import React, { useState, useEffect } from "react"
import { Outlet, Navigate } from "react-router-dom"

/* My Services */
import { isAuthenticated } from "../services/Authentication"

/* Importing a loading spinner */
import { ClipLoader } from "react-spinners"

function PrivateRoutes() {
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

  /* If not authenticated, redirect to login */
  return isAuthenticatedValue ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoutes
