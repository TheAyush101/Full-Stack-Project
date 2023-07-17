//This page is for website admin to see the login users and manage the database(basically to delete account)
// It renders a table of users and allows users to delete users.
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import axios from "axios";
import Swal from "sweetalert2";

// The `useState` hook is used to store the list of users.
export default function Home() {
  const [data, setData] = useState([]);
  // The `loadData` function is used to fetch the list of users from the API.
  const loadData = async () => {
    const response = await axios.get("http://localhost:5000/api/get");
    console.log(`login`, response);
    setData(response.data);
  };

  // The `useEffect` hook is used to load the list of users when the component mounts.
  useEffect(() => {
    loadData();
  }, []);

  // The `deleteContact` function is used to delete a user from the API.

  const deleteContact = (email) => {
    if (window.confirm("Are you sure?")) {
      axios.delete(`http://localhost:5000/api/remove/${email}`);
      Swal.fire("User deleted successfully");
      // Reloads the list of users.
      setTimeout(() => {
        loadData();
      }, 500);
    }
  };
  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "150px" }}
    >
      <table className="styled-table ">
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}> id </th>
            <th style={{ textAlign: "center" }}> name </th>
            <th style={{ textAlign: "center" }}> email </th>
            <th style={{ textAlign: "center" }}> password </th>
            <th style={{ textAlign: "center" }}> Action </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            console.log(item.email);
            return (
              <tr key={item.email}>
                <th scope="row">{index + 1}</th>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.password}</td>
                <td>
                  <button
                    className="btn btn-delete"
                    onClick={() => deleteContact(item.email)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
