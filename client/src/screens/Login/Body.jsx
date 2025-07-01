import React, { useState } from "react";

const Body = () => {
  const [serverName, setServerName] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleConnect = async () => {
    setMessage(""); 
    setMessageType("");

    if (!serverName || !login || !password) {
      setMessage("Please fill in all fields.");
      setMessageType("error");
      return;
    }

    const PLACEHOLDER_SERVER = "testserver";
    const PLACEHOLDER_LOGIN = "admin";
    const PLACEHOLDER_PASSWORD = "password";

    // Simulate loading
    setMessage("Attempting to connect...");
    setMessageType("info"); // A new message type for loading/info
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

    if (
      serverName === PLACEHOLDER_SERVER &&
      login === PLACEHOLDER_LOGIN &&
      password === PLACEHOLDER_PASSWORD
    ) {
      setMessage("Connection successful!");
      setMessageType("success");

      if (rememberMe) {
        console.log("Remember Me checked: Credentials would be saved.");
        localStorage.setItem("rememberedServer", serverName);
        localStorage.setItem("rememberedLogin", login);
        localStorage.setItem("rememberedPassword", password);
      } else {
        console.log("Remember Me not checked: Credentials would not be saved.");
        // localStorage.removeItem('rememberedServer');
        // localStorage.removeItem('rememberedLogin');
      }

      // Clear input fields after successful connection
      setServerName("");
      setLogin("");
      setPassword("");
    } else {
      setMessage(
        "Invalid credentials. Please use testserver, admin, and password."
      );
      setMessageType("error");
    }
  };
  return (
    <div className="card-body-custom">
      <div className="form-group">
        <label htmlFor="serverName" className="form-label-custom">
          Server Name:
        </label>
        <input
          type="text"
          id="serverName"
          className="form-control-custom"
          placeholder="e.g., testserver"
          value={serverName}
          onChange={(e) => setServerName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="login" className="form-label-custom">
          Login:
        </label>
        <input
          type="text"
          id="login"
          className="form-control-custom"
          placeholder="e.g., admin"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password" className="form-label-custom">
          Password:
        </label>
        <input
          type="password"
          id="password"
          className="form-control-custom"
          placeholder="Enter password (e.g., password)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="checkbox-group">
        <input
          type="checkbox"
          id="rememberMe"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        <label htmlFor="rememberMe">Remember Me</label>
      </div>

      {message && (
        <div
          className={`alert-message ${
            messageType === "success"
              ? "alert-success-custom"
              : messageType === "error"
              ? "alert-error-custom"
              : "alert-info-custom"
          }`}
          role="alert"
        >
          {message}
        </div>
      )}

      <button onClick={handleConnect} className="connect-button">
        Connect
      </button>
    </div>
  );
};

export default Body;
