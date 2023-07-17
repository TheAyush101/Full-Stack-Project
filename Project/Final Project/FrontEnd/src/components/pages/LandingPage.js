import React from "react";
import { Link } from "react-router-dom";

import "./LandingPage.css";
import BackgroundImage from "../../assets/images/bg.png";

export default function LandingPage() {
  return (
    <div className="both-container">
      <div className="img-container">
        <img src={BackgroundImage} alt="BackgroundImage"></img>
      </div>
      <div className="buttons-text-center">
        <Link to="/login">
          <button>Login</button>
        </Link>
        <Link to="/register">
          <button>Register</button>
        </Link>
        {/* <Link to="/homes">
          <button>DB</button>
        </Link> */}
      </div>
    </div>
  );
}
