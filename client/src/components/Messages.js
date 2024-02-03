/* Messages */
import React, { useEffect, useState, useRef } from "react"

/* My components Header */
import Header from "../components/Header"

/* Importing Loading Spinner */
import { ClipLoader } from "react-spinners"

function Messages() {
  /* States */
  const [matchedUsers, setMatchedUsers] = useState([]) // State for Storing All of the matches
  const [selectedUser, setSelectedUser] = useState(null) // State for Storing Currently selected user
  const [messages, setMessages] = useState([]) // State for Storing Messages between users
  const [loading, setLoading] = useState(true) // State for Storing Loading spinner boolean
  const [newMessage, setNewMessage] = useState("") // State for Storing Input values for sending
  const [currentPage, setCurrentPage] = useState(1) // State for Storing current page state

  /* Setting up the reference to the messages container */
  const messagesContainerRef = useRef(null)

  /* Loading all messages between users when selecting user */
  async function loadMatches() {
    try {
      // GET request to get all user matches
      const res = await fetch("http://localhost:5000/users/matches", {
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
        console.log("Something went wrong")
      }

      // Getting response json
      const data = await res.json()

      // Update the matchedUsers state with the fetched data
      setMatchedUsers(data.matchedUsers || [])

      // Removing loading spinner when done with getting all user matches
      setLoading(false)

      // If error occurs display error
    } catch (error) {
      console.error(error)
    }
  }

  /* After selecting user load messages between them */
  async function loadUserMessages(userId) {
    try {
      // GET request to get all messages between selected user and currently logged in
      const res = await fetch(`http://localhost:5000/messages/${userId}`, {
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
        console.log("Something went wrong")
      }

      // Getting response json
      const data = await res.json()

      // Update the messages state with the fetched data
      setMessages(data.messages || [])

      // If error occurs display error
    } catch (error) {
      console.error(error)
    }
  }

  /* When sending message to selected user */
  async function sendMessage() {
    try {
      // Check if a user is selected and a message is typed
      if (selectedUser && newMessage.trim() !== "") {
        const res = await fetch("http://localhost:5000/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({
            to: selectedUser._id,
            message: newMessage,
          }),
        })

        // If response is not ok, reload and remove token
        if (!res.ok) {
          localStorage.removeItem("token")
          window.location.reload()
          console.log("Something went wrong")
        }

        // Getting response json
        const data = await res.json()

        // Check for success, and update messages if successful
        if (data.success) {
          setNewMessage("") // Clear the input field after sending
          await loadUserMessages(selectedUser._id) // Load the messages between selected user again

          // Else if sending message wasn't succesful display error
        } else {
          console.error("Message sending failed")
        }
      }

      // If error occurs display error
    } catch (error) {
      console.error(error)
    }
  }

  /* Load messages and matched users when the component mounts */
  useEffect(() => {
    /* Load messages */
    loadMatches()

    /* Scrolling to bottom of messages when new message is sent */
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight
    }
  }, [messages])

  /* Load messages when a user is selected */
  async function handleUserSelect(user) {
    setSelectedUser(user) // Set the selected user when a list item is clicked
    await loadUserMessages(user._id) // Load messages for the selected user
  }

  /* Formatting the timestamp in more reasonable format */
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp)
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  }

  /* Handling pagination for displaying user matches */
  const indexOfLastItem = currentPage * 10
  const indexOfFirstItem = indexOfLastItem - 10
  const currentChats = matchedUsers.slice(indexOfFirstItem, indexOfLastItem)

  const renderChatList = currentChats.map((user) => (
    <li
      key={user._id}
      className="collection-item clickable"
      onClick={() => handleUserSelect(user)}
    >
      {user.name}
    </li>
  ))

  const pageNumbers = Array.from(
    { length: Math.ceil(matchedUsers.length / 10) },
    (_, index) => index + 1
  )

  return (
    <div>
      {/* Header component */}
      <Header />

      {/* Display loading spinner while loading user matches */}
      {loading ? (
        <div className="spinner-container">
          <ClipLoader color="#36d7b7" />
        </div>
      ) : (
        <div className="row">
          {/* Display chat list and messages when user matches are loaded */}
          {/* Left container with the user matches */}
          <div className="col s3 left-container">
            <h4>Chats</h4>

            {/* Display user matches */}
            <ul className="collection">{renderChatList}</ul>

            {/* Display pages */}
            <ul className="pagination">
              {pageNumbers.map((number) => (
                <li
                  key={number}
                  className={`${number === currentPage ? "active" : ""}`}
                  onClick={() => setCurrentPage(number)}
                >
                  <a>{number}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right container with the selected user's chat */}
          <div className="col s9 right-container">
            {/* If a user is selected display selected user's name and messages */}
            {selectedUser ? (
              <div>
                {/* Display selected user's name */}
                <h2>{selectedUser.name}'s Chat</h2>

                {/* Display selected user's messages */}
                <div className="messages-container" ref={messagesContainerRef}>
                  {/* Map through messages and display them to the user in chronological order and correct alignment */}
                  {messages.map((message) => (
                    <div className="message-container" key={message._id}>
                      <div
                        className={`message-bubble ${
                          message.to === selectedUser._id ? "sent" : "received"
                        }`}
                      >
                        {message.message}
                      </div>

                      {/* Display timestamp for each message */}
                      <div
                        className={`timestamp`}
                        style={{
                          alignSelf:
                            message.to === selectedUser._id
                              ? "flex-end"
                              : "flex-start",
                        }}
                      >
                        {/* Format timestamp to more readable format */}
                        {formatTimestamp(message.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Display input field for sending messages */}
                <div className="message-input">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />

                  {/* Display send button */}
                  <button
                    className="btn waves-effect waves-light red lighten-2"
                    onClick={sendMessage}
                  >
                    Send
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* Display chat list and messages when user matches are loaded */}
                <h2>No Chat Selected</h2>
                <p>Select a user from the left to start a chat.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Messages
