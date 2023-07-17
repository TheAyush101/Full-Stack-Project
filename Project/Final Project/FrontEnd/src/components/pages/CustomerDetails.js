// This is the `CustomerDetailsPage` component.
// It renders a form for users to enter their customer details.

import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import photo from "E:/REACTMYSQL/FrontEnd/src/resources/customerDetailspage.png";
import "./CustomerDetails.css";

const initialState = {
  user_name: "",
  email: "",
  age: "",
  income: "",
  spending_score: "",
};

const CustomerDetailsPage = () => {
  const [state, setState] = useState(initialState);
  const history = useHistory();

  const { user_name, email, age, income, spending_score } = state;

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:5000/api/customerDetails", state)
      .then((response) => {
        setState(initialState);
        Swal.fire("Success", response.data.message, "success");
        setTimeout(() => {
          history.push({
            pathname: "/PredictOutput",
            state: {
              user_name: user_name,
              email: email,
              age: age,
              income: income,
              spending_score: spending_score,
            },
          });
        }, 3000);
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const errorMessage = error.response.data.message;
          Swal.fire("Error", errorMessage, "error");
        } else if (error.request) {
          Swal.fire("Error", "No response from the server", "error");
        } else {
          Swal.fire("Error", "An unexpected error occurred", "error");
        }
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };
  function logout() {
    localStorage.clear();
    history.push("/login");
  }

  return (
    <div className="wholepage">
      <div className="logout">
        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      </div>
      <div className="prediction-img-form">
        <div className="Prediction-img-container">
          <img src={photo} alt="Predictionimage" />
        </div>
        <div className="Predictionn-formm">
          <div className="Predictionn-formm-h1">Customer Details</div>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="user_name">User Name</label>
              <input
                type="text"
                name="user_name"
                required
                onChange={handleInputChange}
                value={user_name}
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                required
                onChange={handleInputChange}
                value={email}
              />
            </div>
            <div className="input-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                name="age"
                required
                onChange={handleInputChange}
                value={age}
                min="18"
                max="100"
              />
            </div>
            <div className="input-group">
              <label htmlFor="income">Income</label>
              <input
                type="number"
                name="income"
                required
                onChange={handleInputChange}
                value={income}
                min="1"
                max="1000"
              />
            </div>
            <div className="input-group">
              <label htmlFor="spending_score">Spending Score</label>
              <input
                min="1"
                max="100"
                type="number"
                name="spending_score"
                required
                onChange={handleInputChange}
                value={spending_score}
              />
            </div>
            <button className="loggin-button" type="submit">
              Add Customer Details
            </button>
            <Link to="/CustomerDB">
              <button className="loggin-button">Go to Customer Database</button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsPage;
