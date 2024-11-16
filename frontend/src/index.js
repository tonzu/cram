// src/index.js
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TestPage from "./TestPage"; // Login page with AuthTest
import App from "./App";                      // Main page after login
import "./Auth-test.css";



ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<TestPage />} />   {/* Initial Login Page */}
      <Route path="/app" element={<App />} />     {/* Main App Page after login */}
    </Routes>
  </Router>,
  document.getElementById("root")
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals