// This is the `SignUpPage` component.
// It renders a signup form and handles the submission of the form.

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./RegisterPage.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import image from "E:/REACTMYSQL/FrontEnd/src/resources/SIGNUP.png";

const initialState = {
  // The initial state of the component.
  name: "",
  email: "",
  password: "",
  confirm_password: "",
};

export default function SignUpPage() {
  const [state, setState] = useState(initialState); // The `useState` hook is used to store the user's name, email, password, and confirm password.

  const { name, email, password, confirm_password } = state;

  const history = useHistory(); // The `history` hook is used to navigate to the `login` page after the user signs up.

  const handleSubmit = (e) => {
    e.preventDefault();
    // Prevents the form from submitting normally.

    if (password !== confirm_password) {
      Swal.fire("Password and confirm password do not match");
      return;
    }

    // Makes an API request to sign up the user.
    axios
      .post("http://localhost:5000/api/post", {
        name,
        email,
        password,
        confirm_password,
      })
      .then((response) => {
        setState({ name: "", email: "", password: "", confirm_password: "" });
        Swal.fire("Success", response.data.message, "success");
        setTimeout(() => {
          history.push("/login");
        }, 3000);
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const errorMessage = error.response.data.message;
          Swal.fire("Error", errorMessage, "error");
        } else if (error.request) {
          // The request was made but no response was received
          Swal.fire("Error", "No response from the server", "error");
        } else {
          // Something happened in setting up the request that triggered an Error
          Swal.fire("Error", "An unexpected error occurred", "error");
        }
      });
  };

  // The `handleInputChange` function is used to update the state when the user changes an input.

  const handleInputChange = (e) => {
    // Updates the state with the new value of the input.
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  return (
    <div className="signup-img">
      <div className="signup-img-container">
        <img src={image} alt="signupmage" className="scaled-image" />
      </div>

      <form action="/login" onSubmit={handleSubmit} className="sign-up-form">
        <h2 className="login-title">Sign Up</h2>
        <div className="signupform-group">
          <label htmlFor="name">Full Name:</label>
          <input
            type="text"
            name="name"
            required
            onChange={handleInputChange}
            value={name}
          />

          <div className="signupform-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              required
              onChange={handleInputChange}
              value={email}
            />
          </div>
          <div className="signupform-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              required
              onChange={handleInputChange}
              value={password}
            />
          </div>
          <div className="signupform-group">
            <label htmlFor="confirm_password">Confirm Password:</label>
            <input
              type="password"
              name="confirm_password"
              required
              onChange={handleInputChange}
              value={confirm_password}
            />
          </div>
          <div className="signupbutton">
            <button type="submit">Sign Up</button>
          </div>
          <div className="loinlink">
            <Link to="/login">Already have an account? Log in</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
