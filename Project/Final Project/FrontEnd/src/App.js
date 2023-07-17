import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import LandingPage from "./components/pages/LandingPage";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import HomePage from "./components/pages/HomePage";
import Home from "./components/pages/Home";
import CustomerDetails from "./components/pages/CustomerDetails";
import CustomerDB from "./components/pages/CustomerDB";
import PredictOutput from "./components/pages/PredictOutput";

import "./App.css";

function Protectedroutes() {
  const token = localStorage.getItem("key");
  console.log(token);
  return token ? <CustomerDetails /> : <LoginPage />;
}
function Protected() {
  const token = localStorage.getItem("key");
  console.log(token);
  return token ? <PredictOutput /> : <LoginPage />;
}

export default function App() {
  return (
    <BrowserRouter>
      <div>
        <Switch>
          {/* Landing Page */}
          <Route exact path="/" component={LandingPage} />

          {/* Login Page */}
          <Route path="/login" component={LoginPage} />

          {/* Register Page */}
          <Route path="/register" component={RegisterPage} />

          {/* Update Page (using email as parameter) */}
          <Route path="/update/:email" component={RegisterPage} />

          {/* Home Page */}
          <Route path="/home" component={HomePage} />

          {/* Homes Page */}
          <Route path="/homes" component={Home} />

          {/* Customer Details Page */}
          <Route path="/Customer" component={Protectedroutes} />

          {/* Customer Database Page */}
          <Route path="/CustomerDB" component={CustomerDB} />

          {/* Predict Output Page */}
          <Route path="/PredictOutput" component={Protected} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}
