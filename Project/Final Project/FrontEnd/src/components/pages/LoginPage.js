// This is the `SignInPage` component.
// It renders a login form and handles the submission of the form.

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "./LoginPage.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import login from "E:/REACTMYSQL/FrontEnd/src/resources/loginpageimg.png";
const cors = require("cors");

export default function SignInPage() {
  const [loginStatus, setLoginStatus] = useState("");
  const [values, setValues] = useState({
    email: " ",
    password: " ",
  });
  // The `useState` hook is used to store the user's email and password.
  axios.defaults.withCredentials = true;
  const history = useHistory();

  // The `handleInput` function is used to update the state when the user changes the email or password input.

  const handleInput = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value }); // Updates the state with the new value of the input.
  };

  // The `handleSubmit` function is used to submit the form and log the user in.

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents the form from submitting normally.
    console.log(values);

    // Makes an API request to log the user in.

    axios
      .post("http://localhost:5000/login", values, { withCredentials: true })
      .then((res) => {
        console.log(res.data);
        // If the request is successful, navigates to the `Customer` page.
        if (res.data) {
          localStorage.setItem("key", res.data.data);
          history.push("/Customer");
        } else {
          Swal.fire("no record");
        }
        console.log(res);
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          Swal.fire(err.response.data.message);
        } else {
          console.log("0---->", err.response);
          Swal.fire("Internal Server Error");
        }
      });
  };

  useEffect(() => {
    axios.get("http://localhost:5000/login").then((res) => {
      console.log(res.data.user);
      if (res.data.user && res.data.user.length > 0) {
        if (res.data.loggedIn == true) {
          setLoginStatus(res.data.user[0].email);
        }
      }
    });
  }, []);

  // Returns the rendered component.
  return (
    <div className="img-form">
      <div className="login-container">
        <h2 className="login-title">Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            {/*  The `onChange` event handler is used to
            update the state when the user changes the email input. */}
            <input
              onChange={(e) => handleInput(e)}
              type="email"
              name="email"
              required
            />

            <div className="form-group">
              <label>Password:</label>
              <input
                onChange={handleInput}
                type="password"
                name="password"
                required
              />
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
          </div>
        </form>
        <div className="asasa">
          <div className="signup-link">
            <Link to="/register">Create New Account</Link>
          </div>

          <div className="signup-link">
            <Link to="/">Back to Home Page</Link>
          </div>
        </div>
      </div>
      <div className="img-container">
        <img src={login} alt="loginpageimage" />
      </div>
    </div>
  );
}
