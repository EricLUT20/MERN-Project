/* Home */
import React, { useEffect, useState } from "react"

/* Importing Link from react-router-dom */
import { Link } from "react-router-dom"

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
  const [swipeOffset, setSwipeOffset] = useState(0) // Storing Swipe Offset value to display the movement when swiping on round box

  // Handling liking user
  async function handleLike() {
    try {
      console.log(user) // Console logging the user to see if it is being passed correctly

      /* Sending PUT request to update the database and add the user to the list of likedUsers */
      const res = await fetch(`http://localhost:5000/users/${user.id}/like`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"), // Sending token in headers
        },
      })

      // If response is not ok, reload and remove token
      if (!res.ok) {
        localStorage.removeItem("token")
        window.location.reload()
      }

      // Getting response json
      const data = await res.json()

      console.log(data) // Console logging the data to see if it is being passed correctly

      loadUserId() // Loading all of the new users again so we can display it for the current user to decide on (like or pass)

      // If error occurs display error
    } catch (error) {
      console.error(error)
    }
  }

  /* Handling passing user */
  async function handlePass() {
    try {
      /* Sending PUT request to update the database and add the user to the list of passedUsers */
      const res = await fetch(`http://localhost:5000/users/${user.id}/pass`, {
        method: "PUT", // Using PUT request method to update the database
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"), // Sending token in headers
        },
      })

      // If response is not ok, reload and remove token
      if (!res.ok) {
        localStorage.removeItem("token")
        window.location.reload()
      }

      // Getting response json
      const data = await res.json()

      console.log(data) // Console logging the data to see if it is being passed correctly

      loadUserId() // Loading all of the new users again so we can display it for the current user to decide on (like or pass)

      // If error occurs display error
    } catch (error) {
      console.error(error)
    }
  }

  // Fetching with GET request to get new users data to display it for the current user to decide on (like or pass)
  async function loadUserId() {
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

      // If response is not ok, reload and remove token
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

  // Handling swiping user feature to like or pass on matches by using swiping left or right using useSwipeable
  const swipeHandlers = useSwipeable({
    onSwiping: (e) => {
      setSwipeOffset(e.deltaX)
    },
    onSwiped: () => {
      setSwipeOffset(0)
    },
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
            <div
              className="round-box z-depth-5 red lighten-5"
              style={{ transform: `translateX(${swipeOffset}px)` }}
            >
              <h3>
                <Link
                  className="link"
                  to={`/user/${user.id}`}
                >{`${user.name}, ${user.age}`}</Link>
              </h3>
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
