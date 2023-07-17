import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CustomerDB.css";
import axios from "axios";
import Swal from "sweetalert2";

export default function Home() {
  // This is a state variable that stores the list of customer details.
  const [data, setData] = useState([]);

  // This function fetches the list of customer details from the API.
  const loadData = async () => {
    const response = await axios.get("http://localhost:5000/testing");
    console.log("response-->", response);
    setData(response.data);
  };

  // This function is called when the component mounts.
  // It calls the `loadData` function to fetch the list of customer details.
  useEffect(() => {
    loadData();
  }, []);

  // This function is called when the user clicks the "Delete" button.
  // It deletes the customer detail from the database.
  const deleteContact = (email) => {
    if (window.confirm("Are you sure?")) {
      axios.delete(`http://localhost:5000/api/delete/${email}`);
      Swal.fire("User deleted successfully");
      setTimeout(() => {
        loadData();
      }, 500);
    }
  };

  return (
    <div className="container">
      <div className="table-wrapper">
        <table className="styled-table">
          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>Sr. no.</th>
              <th style={{ textAlign: "center" }}>user_name</th>
              <th style={{ textAlign: "center" }}>email</th>
              <th style={{ textAlign: "center" }}>age</th>
              <th style={{ textAlign: "center" }}>income</th>
              <th style={{ textAlign: "center" }}>spending_score</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              console.log(item.email);
              return (
                <tr key={item.email}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.user_name}</td>
                  <td>{item.email}</td>
                  <td>{item.age}</td>
                  <td>{item.income}</td>
                  <td>{item.spending_score}</td>
                  <td>
                    <button
                      className="btn btn-delete"
                      onClick={() => deleteContact(item.email)}
                    >
                      {" "}
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Link to="/Customer">
        <button className="loggin-button">Add Customer Details</button>
      </Link>
    </div>
  );
}
