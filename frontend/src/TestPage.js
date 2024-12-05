// src/components/TestPage.js
import React from "react";
import AuthTest from "./Auth-test"; // Import the AuthTest component

const TestPage = () => {
  return (
    <div>
      <h1>CRAM</h1>
      <AuthTest /> {/* Render the AuthTest component here */}
    </div>
  );
};

export default TestPage;
