/* Profile */
import React, { useState, useEffect } from "react"
import Header from "./Header"

/* Importing a loading spinner */
import { ClipLoader } from "react-spinners"

function Profile() {
  /* States */
  const [profilePicture, setProfilePicture] = useState("") // Storing user's profile picture
  const [name, setName] = useState("") // Storing user's name
  const [title, setTitle] = useState("") // Storing user's title
  const [bio, setBio] = useState("") // Storing user's bio
  const [characterCount, setCharacterCount] = useState(0) // Storing bio's character count
  const [loading, setLoading] = useState(true) // Storing loading state to display loading spinner while fetching data

  const maxCharacterCount = 1000 // Maximum character count variable

  /* Updating profile picture */
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0]
    setProfilePicture(file ? file.name : "")
  }

  /* Updating changes in user's bio */
  const handleBioChange = (e) => {
    if (e.target.value.length > maxCharacterCount) {
      return
    }
    const newBio = e.target.value
    setBio(newBio)
    setCharacterCount(newBio.length)
  }

  /* Updating changes in user's name */
  const handleNameChange = (e) => {
    setName(e.target.value)
  }

  /* Updating changes in user's title */
  const handleTitleChange = (e) => {
    setTitle(e.target.value)
  }

  /* Handling submittion of user's profile update */
  const handleSubmit = async (e) => {
    e.preventDefault() // Preventing default form submission

    /* Sending PUT request to update user's profile based on user's input fields */
    const res = await fetch("http://localhost:5000/users/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"), // Sending token in headers
      },
      body: JSON.stringify({
        name: name,
        title: title,
        bio: bio,
      }),
    })
    const data = await res.json()

    /* Alerting user of success */
    alert(data.message)
  }

  /* Loading previous user's profile data to display and make changes to */
  const loadUserProfile = async () => {
    try {
      /* Sending GET request to get user's profile from the database */
      const res = await fetch("http://localhost:5000/users/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"), // Sending token in headers
        },
      })

      /* If response is not ok, redirect to login and remove token */
      if (!res.ok) {
        console.log("Something went wrong")
        localStorage.removeItem("token")
        window.location.reload()
      }

      const data = await res.json()

      /* If response is ok, update the user's profile fields with the previous data */
      if (data.success) {
        setName(data.user.name)
        setTitle(data.user.title)
        setBio(data.user.bio)
        setCharacterCount(data.user.bio.length)
      }

      console.log(data.message) // Logging success message

      setLoading(false) // Remove loading spinner when data is fetched and displayed

      // If error occurs display error
    } catch (error) {
      console.error(error)
    }
  }

  /* When component mounts, load user's profile */
  useEffect(() => {
    loadUserProfile() // Load user's profile
  }, [])

  return (
    <div>
      {/* Header */}
      <Header />
      {/* Display Loading spinner while fetching data  */}
      {loading ? (
        <div className="spinner-container">
          <ClipLoader color="#36d7b7" />
        </div>
      ) : (
        <div className="row profile-form">
          {/* Editing Profile Form */}
          <h2 className="col s12">Edit Profile</h2>
          <form className="col s12" onSubmit={handleSubmit}>
            {/* Profile Picture Upload Input */}
            <div className="file-field input-field col s12">
              <div className="btn">
                <span>Upload Profile Picture</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                />
              </div>
              <div className="file-path">
                <input
                  type="text"
                  placeholder="Choose a profile picture"
                  value={profilePicture}
                  readOnly
                />
              </div>
            </div>

            {/* Name Input */}
            <div className="input-field col s12">
              <input
                id="name"
                type="text"
                value={name}
                onChange={handleNameChange}
              />
              <label className={name ? "active" : ""} htmlFor="name">
                Name
              </label>
            </div>

            {/* Title Input */}
            <div className="input-field col s12">
              <input
                id="title"
                type="text"
                value={title}
                onChange={handleTitleChange}
              />
              <label className={title ? "active" : ""} htmlFor="title">
                Title
              </label>
            </div>

            {/* Bio Input */}
            <div className="input-field col s12">
              <textarea
                id="bio"
                className="materialize-textarea"
                data-length={maxCharacterCount}
                value={bio}
                onChange={handleBioChange}
              ></textarea>
              <label className={bio ? "active" : ""} htmlFor="bio">
                Bio (Max {maxCharacterCount} characters)
              </label>
              <span className="character-counter">{`${characterCount}/${maxCharacterCount}`}</span>
            </div>

            {/* Submit Button to send PUT request and save changes */}
            <button
              className="btn waves-effect waves-light"
              type="submit"
              onClick={handleSubmit}
            >
              Save Changes
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default Profile
