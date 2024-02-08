/* Home */
import React, { useEffect, useState } from "react"

/* Importing Link and useNavigate from react-router-dom */
import { Link, useNavigate } from "react-router-dom"

/* My Component Header */
import Header from "./Header"

/* Importing a loading spinner */
import { ClipLoader } from "react-spinners"

/* Importing Swipeable for swiping feature to like or pass on matches */
import { useSwipeable } from "react-swipeable"

function Home() {
  // Initializing the useNavigate for redirecting users
  const navigate = useNavigate()

  /* States */
  const [user, setUser] = useState({}) // Storing the new user
  const [loading, setLoading] = useState(true) // Storing the loading state to whether to display a loading spinner
  const [noUsers, setNoUsers] = useState(false) // Storing whether there are no new users to match with
  const [swipeOffset, setSwipeOffset] = useState(0) // Storing Swipe Offset value to display the movement when swiping on round box
  const [matchFound, setMatchFound] = useState(false) // Storing whether a match has been found when liking user
  const [selectedUser, setSelectedUser] = useState(null) // Storing the selected user when a match is found so we can redirect it to messages if user wants to start chatting now

  /* Functions */

  // If the Arrow is clicked when match found is found then redirect to messages
  function handleNow() {
    if (selectedUser) {
      navigate("/messages", { state: { selectedUser } })
    }

    // If no user.id is found then set match found to false so the message dissappear and you can continue normally
    else {
      navigate("/messages")
    }
  }

  // If the "X" is clicked when match found is found then set match found to false so the message dissappear and you can continue normally
  async function handleLater() {
    setLoading(true)
    setMatchFound(false)
    await loadUserId() // Loading all of the new users again so we can display it for the current user to decide on (like or pass)
  }

  // Checking if the matched user has liked the current user back
  async function checkMatch() {
    try {
      const res = await fetch(`http://localhost:5000/users/liked/${user.id}`, {
        method: "GET",
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

      // If data successes meaning that matched user has liked current user back, update the user state
      if (data.success) {
        setMatchFound(true) // Updating the state to display a match has been found
      } else {
        await loadUserId() // Loading all of the new users again so we can display it for the current user to decide on (like or pass)
      }

      // If error occurs display error
    } catch (error) {
      console.error(error)
    }
  }

  // Handling liking user
  async function handleLike() {
    try {
      setLoading(true) // Setting loading true so that there is loading spinner displayed meanwhile trying to find if the liked user has liked you back

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

      setSelectedUser({
        _id: user.id,
        name: user.name,
        age: user.age,
        title: user.title,
        bio: user.bio,
      }) // Setting the selected user before we load the new user

      await checkMatch() // Checking if the liked user has liked the current user back

      setLoading(false) // Set the loading state to false after everything is loaded so that user can continue

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
        ) : noUsers ? (
          <h3>You have already matched with everyone</h3>
        ) : matchFound ? (
          <div>
            {/* User matching box */}
            <div className="round-box z-depth-5 red lighten-5">
              {/* Match found! */}
              <h3 className="red-text text-lighten-1">Match found!</h3>
              <div className="divider red lighten-4" />

              {/* Start chatting now? */}
              <h5 className="red-text text-lighten-2">Start chatting now?</h5>
              <br />
              <div>
                {/* Button with the "close" icon to continue swiping */}
                <button
                  className="btn-floating btn-large waves-effect waves-light red lighten-2"
                  type="button"
                  onClick={handleLater}
                >
                  <i className="material-icons left">close</i>
                  Pass
                </button>

                {/* Button with the "send" icon to start chatting now */}
                <button
                  className="btn-floating btn-large waves-effect waves-light green lighten-2"
                  type="button"
                  onClick={handleNow}
                  style={{ marginLeft: "5vw" }}
                >
                  <i className="material-icons left">send</i>
                  Now
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="content-container">
            <div
              className="round-box z-depth-5 red lighten-5"
              style={{ transform: `translateX(${swipeOffset}px)` }}
              {...swipeHandlers}
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
