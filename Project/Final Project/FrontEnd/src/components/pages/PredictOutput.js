import React, { useState, useEffect } from "react";
import "./PredictOutput.css";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

// This is the `PredictOutput` component.
// It renders the customer details and the prediction made by the model.

const PredictOutput = () => {
  const history = useHistory();
  const [customerDetails, setCustomerDetails] = useState(null);
  const [prediction, setPrediction] = useState(null);

  function logout() {
    localStorage.clear();
    history.push("/login");
  }
  useEffect(() => {
    const fetchData = async () => {
      // Gets the customer details and prediction from the URL.
      const { state } = history.location;
      if (state) {
        try {
          // Makes a POST request to the API to get the prediction.
          const res = await axios.post("http://localhost:9000/predict", {
            age: parseInt(state.age),
            income: parseInt(state.income),
            score: parseInt(state.spending_score),
          });
          // Sets the customer details and prediction.
          setCustomerDetails(state);
          setPrediction(res.data);
        } catch (error) {
          console.log(error);
        }
      }
    };
    // Runs the fetchData function once the component mounts.

    fetchData();
  }, [history.location]);

  return (
    <div className="Prediction-form">
      {customerDetails && (
        <div className="User-Details">
          <h1>Customer Details</h1>
          <p>User Name: {customerDetails.user_name}</p>
          <p>Email: {customerDetails.email}</p>
          <p>Age: {customerDetails.age}</p>
          <p>Income: {customerDetails.income}</p>
          <p>Spending Score: {customerDetails.spending_score}</p>
        </div>
      )}
      {prediction ? (
        <div className="User-Output">
          <h1>Category: {prediction.cat}</h1>
          <p>{prediction.label}</p>
        </div>
      ) : (
        <p>Loading prediction...</p>
      )}

      <div className="button-wrapper">
        <Link to="/Customer">
          <button className="logout-button">Add Customer Details</button>
        </Link>
        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default PredictOutput;
