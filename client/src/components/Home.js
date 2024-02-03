/* Home */
import React, { useEffect, useState } from "react"

/* My Components */
import Header from "./Header"

/* Importing a loading spinner */
import { ClipLoader } from "react-spinners"

/* Importing Swipeable for swiping feature to like or pass on matches */
import { useSwipeable } from "react-swipeable"

function Home() {
  /* States */
  const [user, setUser] = useState({}) // Storing the new user
  const [loading, setLoading] = useState(true) // Storing the loading state to whether to display a loading spinner
  const [noUsers, setNoUsers] = useState(false) // Storing whether there are no new users to match with

  const handleLike = async () => {
    try {
      console.log(user)
      const res = await fetch(`http://localhost:5000/users/${user.id}/like`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"), // Sending token in headers
        },
      })
      const data = await res.json()
      console.log(data)
      loadUserId()
    } catch (error) {
      console.error(error)
    }
  }

  const handlePass = async () => {
    try {
      const res = await fetch(`http://localhost:5000/users/${user.id}/pass`, {
        method: "PUT", // Using PUT request method to update the database
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"), // Sending token in headers
        },
      })
      if (!res.ok) {
        window.location.reload()
      }
      const data = await res.json()
      console.log(data)
      loadUserId()
    } catch (error) {
      console.error(error)
    }
  }

  // Fetching with GET request to get new users data to display it for the current user to decide on (like or pass)
  const loadUserId = async () => {
    try {
      setNoUsers(false)

      // Fetching the newUser data so we can display it for the current user to decide on (like or pass)
      const res = await fetch(`http://localhost:5000/users/newUser`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"), // Sending token in headers
        },
      })

      if (!res.ok) {
        console.log("Something went wrong")
        localStorage.removeItem("token")
        window.location.reload()
      }

      // Getting the response in JSON
      const data = await res.json()

      // If a new user is found, set the state
      if (data.success) {
        const newUser = data.newUser || {}
        setUser({
          id: newUser._id || "",
          name: newUser.name || "",
          age: newUser.age || "",
          title: newUser.title || "",
          bio: newUser.bio || "",
        })
      } else {
        // If no new user is found, set the state to indicate that
        setNoUsers(true)
      }

      setLoading(false) // Setting loading to false so the spinner doesn't show and display the content
    } catch (error) {
      console.error(error) // Displaying error
    }
  }

  // When the component mounts calling in the loadUserId function
  useEffect(() => {
    loadUserId()
  }, []) // Making sure we run the useEffect only once otherwise it will keep reloading

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handlePass,
    onSwipedRight: handleLike,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  })

  return (
    <div {...swipeHandlers}>
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
        ) : noUsers ? (
          <h3>You have already matched with everyone</h3>
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
                onClick={handlePass}
              >
                <i className="material-icons left">close</i>
                Pass
              </button>

              {/* Button with the "favorite" icon */}
              {/* Circle button: className="btn-floating btn-large waves-effect waves-light green lighten-2"*/}
              <button
                className="btn waves-effect waves-light green lighten-2"
                type="button"
                onClick={handleLike}
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
