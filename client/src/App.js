import React, { useState } from "react";

// Main App component
const App = () => {
  // State variables for input fields
  const [serverName, setServerName] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  // State for displaying messages to the user
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  /**
   * Handles the click event of the Connect button.
   * Sends the input data to the Node.js backend.
   */
  const handleConnect = async () => {
    setMessage(""); // Clear previous messages
    setMessageType("");

    // Basic validation
    if (!serverName || !login || !password) {
      setMessage("Please fill in all fields.");
      setMessageType("error");
      return;
    }

    try {
      // Send data to the backend
      const response = await fetch("http://localhost:3001/api/connect", {
        // Ensure this URL matches your Node.js server
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ serverName, login, password }),
      });

      const data = await response.json();

      // Handle response from backend
      if (response.ok) {
        setMessage(data.message);
        setMessageType("success");
      } else {
        setMessage(data.message || "Connection failed.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error connecting to backend:", error);
      setMessage(
        "Could not connect to the server. Please ensure the backend is running."
      );
      setMessageType("error");
    }
  };

  return (
    // Main container with dark background inspired by VS Code editor
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-inter text-gray-200">
      {/* Form container with a slightly lighter dark background */}
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden border border-gray-700">
        {/* Header inspired by VS Code title bar */}
        <div className="bg-gray-700 text-white p-4 flex items-center justify-between rounded-t-lg border-b border-gray-600">
          <h2 className="text-xl font-semibold">Connect to Server</h2>
          {/* Placeholder for a close/minimize button icon, styled for dark theme */}
          <svg
            className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition duration-150 ease-in-out"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </div>

        <div className="p-6">
          {/* Server Name Input */}
          <div className="mb-4">
            <label
              htmlFor="serverName"
              className="block text-gray-300 text-sm font-medium mb-2"
            >
              Server Name:
            </label>
            <input
              type="text"
              id="serverName"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out text-gray-100 placeholder-gray-400"
              placeholder="e.g., localhost, yourserver.database.windows.net"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
            />
          </div>

          {/* Login Input */}
          <div className="mb-4">
            <label
              htmlFor="login"
              className="block text-gray-300 text-sm font-medium mb-2"
            >
              Login:
            </label>
            <input
              type="text"
              id="login"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out text-gray-100 placeholder-gray-400"
              placeholder="e.g., sa"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-300 text-sm font-medium mb-2"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out text-gray-100 placeholder-gray-400"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Message Box */}
          {message && (
            <div
              className={`p-3 mb-4 rounded-md text-sm ${
                messageType === "success"
                  ? "bg-green-700 text-green-100 border border-green-600" // Darker green for success
                  : "bg-red-700 text-red-100 border border-red-600" // Darker red for error
              }`}
            >
              {message}
            </div>
          )}

          {/* Connect Button - VS Code blue/purple accent */}
          <button
            onClick={handleConnect}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
