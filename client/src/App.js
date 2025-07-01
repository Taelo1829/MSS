// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./screens/Login";
import Layout from "./layout";

function App() {
  let isConnected = Boolean(localStorage.getItem("connected"));
  return (
    <Router>
      {isConnected ? (
        <Routes></Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="*" element={<Login />} />
          </Route>
        </Routes>
      )}
    </Router>
  );
}

export default App;
