/* User */
import React, { useEffect, useState } from "react"

/* Importing useParams from react-router-dom to get the userId */
import { useParams } from "react-router-dom"

/* My Components */
import Header from "./Header"

/* Importing a loading spinner */
import { ClipLoader } from "react-spinners"

function User() {
  /* States */
  const [user, setUser] = useState({}) // Storing the user data
  const [loading, setLoading] = useState(true) // Storing the loading state to wait for data to load

  const { userId } = useParams() // Getting the userId from the URL

  /* Load user data */
  async function loadUserData() {
    try {
      // GET request to load user data
      const res = await fetch(`http://localhost:5000/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      })

      // If response is not ok, reload and remove token
      if (!res.ok) {
        localStorage.removeItem("token")
        window.location.reload()
      }

      // Getting response json
      const data = await res.json()

      // Update the user state with the fetched data
      setUser(data.user)

      // Set loading to false so the data is displayed after it is loaded
      setLoading(false)

      // If error occurs display error
    } catch (error) {
      console.error(error)
    }
  }

  /* When the component mounts check if the  */
  useEffect(() => {
    loadUserData()
  }, [])

  /* Formatting the timestamp in more reasonable format */
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp)
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  }

  return (
    <div>
      {/* Header */}
      <Header />
      {/* Display the user's data/profile */}
      {loading ? (
        <div className="spinner-container">
          <ClipLoader color="#36d7b7" />
        </div>
      ) : (
        <div className="row">
          <div className="col s12">
            <h2>
              {user.name}
              <span className="red-text text-lighten-2">'s Profile</span>
            </h2>
            <div className="divider" />
            <div className="section">
              <h4 className="header red-text text-lighten-2">Name</h4>
              <p className="flow-text">{user.name}</p>
            </div>
            <div className="divider" />
            <div className="section">
              <h4 className="header red-text text-lighten-2">
                Registration Date
              </h4>
              <p className="flow-text">{formatTimestamp(user.registered)}</p>
            </div>
            <div className="divider" />
            <div className="section container">
              <h4 className="header red-text text-lighten-2">
                {user.name}'s Bio
              </h4>
              <p className="flow-text">{user.title}</p>
              <p>{user.bio}</p>
            </div>
            <div className="divider" />
          </div>
        </div>
      )}
    </div>
  )
}

export default User
