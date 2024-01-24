/* Home */
import React, { useEffect, useState } from "react"

/* My Components */
import Header from "./Header"

/* My services */
import { isAuthenticated } from "../services/Authentication"

/* Importing a loading spinner */
import { ClipLoader } from "react-spinners"

function Home({ jwt, setJwt }) {
  const [user, setUser] = useState({})
  const [loading, setLoading] = useState(true)

  // Fetching with GET request to get new users data to display it for the current user to decide on (like or pass)
  const loadUserId = async () => {
    try {
      // Check if the user is authenticated and getting userId
      const userId = await isAuthenticated()

      // Fetching the newUser data so we can display it for the current user to decide on (like or pass)
      const res = await fetch(`http://localhost:5000/users/newUser/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"), // Sending token in headers
        },
      })

      // Error handling
      if (!res.ok) throw Error("Something went wrong")

      // Waiting for data to load
      const data = await res.json()

      // Setting the newUser with the data
      const newUser = data.newUser || {}

      // Setting the user state with the new user to match
      setUser({
        name: newUser.name || "",
        age: newUser.age || "",
        title: newUser.title || "",
        bio: newUser.bio || "",
      })

      setLoading(false) // Setting loading to false so the spinner doesn't show and display the content
    } catch (error) {
      console.error(error) // Displaying error
    }
  }

  // When the component mounts calling in the loadUserId function
  useEffect(() => {
    loadUserId()
  }, []) // Making sure we run the useEffect only once otherwise it will keep reloading

  return (
    <div>
      {/* Getting Materialize Icons for the Buttons */}
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      ></link>
      <Header />
      <div className="container center-align">
        {loading ? (
          <div className="spinner-container">
            <ClipLoader color="#36d7b7" />
          </div>
        ) : (
          <div className="content-container">
            <div className="round-box z-depth-5 red lighten-5">
              <h3>{`${user.name}, ${user.age}`}</h3>
              <div className="divider red lighten-4" />
              <h5>{user.title}</h5>
              <p>{user.bio}</p>
            </div>
            <div className="button-container">
              {/* Button with the "close" icon */}
              {/* Circle button: className="btn-floating btn-large waves-effect waves-light red lighten-2"*/}
              <button
                className="btn waves-effect waves-light red lighten-2"
                type="button"
              >
                <i className="material-icons left">close</i>
                Pass
              </button>

              {/* Button with the "favorite" icon */}
              {/* Circle button: className="btn-floating btn-large waves-effect waves-light green lighten-2"*/}
              <button
                className="btn waves-effect waves-light green lighten-2"
                type="button"
              >
                <i className="material-icons left">favorite</i>
                Like
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
