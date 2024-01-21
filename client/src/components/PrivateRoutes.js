import { Outlet, Navigate } from "react-router-dom"
import { isAuthenticated } from "../services/Authentication"

function PrivateRoutes({ jwt }) {
  return jwt ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoutes
