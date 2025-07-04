import React, { useState, useEffect, useRef } from "react";

// Main App component
const App = () => {
  // New state for "Remember Me" checkbox

  // New states for connected page
  const [showDatabasesDropdown, setShowDatabasesDropdown] = useState(false);
  const [databaseLoading, setDatabaseLoading] = useState(false);
  const [databaseName, setDatabaseName] = useState(""); // Will hold 'Izon' once loaded

  // New states for nested dropdowns
  const [showIzonContent, setShowIzonContent] = useState(false);
  const [showProgrammabilityContent, setShowProgrammabilityContent] =
    useState(false);
  const [selectedDatabaseItem, setSelectedDatabaseItem] = useState(""); // To show <NOT YET CREATED>

  const [showBurgerMenu, setShowBurgerMenu] = useState(false);

  // Context menu states
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const contextMenuRef = useRef(null);
  const longPressTimer = useRef(null); // Ref for long press timer

  // Query Playground states
  const [showQueryPlayground, setShowQueryPlayground] = useState(false);
  const [queryText, setQueryText] = useState("SELECT * FROM AccessRoles;");
  const [isExecutingQuery, setIsExecutingQuery] = useState(false);
  const [queryResult, setQueryResult] = useState([]);
  const [showQueryResult, setShowQueryResult] = useState(false);
  const [tableHeight, setTableHeight] = useState(200); // Initial height for the result table
  const resizeStartY = useRef(0);
  const initialTableHeight = useRef(0);
  const executionTimerRef = useRef(null); // To clear timeout if stop is pressed

  // New states for table actions
  const [isTableFullscreen, setIsTableFullscreen] = useState(false);

  // Ref for the sidebar element
  const sidebarRef = useRef(null);

  // Mock Data for Query Results
  const mockQueryResultData = [
    {
      id: 1,
      name: "UserA",
      status: "Active",
      lastLogin: "2025-06-29",
      email: "usera@example.com",
    },
    {
      id: 2,
      name: "UserB",
      status: "Inactive",
      lastLogin: "2025-06-20",
      email: "userb@example.com",
    },
    {
      id: 3,
      name: "UserC",
      status: "Active",
      lastLogin: "2025-06-28",
      email: "userc@example.com",
    },
    {
      id: 4,
      name: "UserD",
      status: "Pending",
      lastLogin: "2025-06-25",
      email: "userd@example.com",
    },
    {
      id: 5,
      name: "UserE",
      status: "Active",
      lastLogin: "2025-06-27",
      email: "usere@example.com",
    },
    {
      id: 6,
      name: "UserF",
      status: "Active",
      lastLogin: "2025-06-26",
      email: "userf@example.com",
    },
    {
      id: 7,
      name: "UserG",
      status: "Inactive",
      lastLogin: "2025-06-15",
      email: "userg@example.com",
    },
    {
      id: 8,
      name: "UserH",
      status: "Active",
      lastLogin: "2025-06-29",
      email: "userh@example.com",
    },
    {
      id: 9,
      name: "UserI",
      status: "Active",
      lastLogin: "2025-06-22",
      email: "useri@example.com",
    },
    {
      id: 10,
      name: "UserJ",
      status: "Pending",
      lastLogin: "2025-06-21",
      email: "userj@example.com",
    },
  ];

  // Effect to handle clicks outside the context menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target)
      ) {
        setShowContextMenu(false);
      }
    };

    if (showContextMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showContextMenu]);

  // Effect to handle clicks outside the sidebar
  useEffect(() => {
    const handleClickOutsideSidebar = (event) => {
      // If the sidebar is open and the click is outside the sidebar and not on the burger menu icon itself
      if (
        showBurgerMenu &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(".burger-menu-icon")
      ) {
        setShowBurgerMenu(false);
      }
    };

    if (showBurgerMenu) {
      document.addEventListener("mousedown", handleClickOutsideSidebar);
      document.addEventListener("touchstart", handleClickOutsideSidebar);
    } else {
      document.removeEventListener("mousedown", handleClickOutsideSidebar);
      document.removeEventListener("touchstart", handleClickOutsideSidebar);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideSidebar);
      document.removeEventListener("touchstart", handleClickOutsideSidebar);
    };
  }, [showBurgerMenu]);

  /**
   * Handles the click event of the Connect button.
   * Now uses placeholder credentials for direct frontend validation.
   */
  /**
   * Handles the click event for the Databases dropdown.
   * Simulates loading and then displays "Izon".
   */
  const handleDatabasesClick = () => {
    setShowDatabasesDropdown((prevState) => !prevState);
    if (!showDatabasesDropdown && !databaseName) {
      // Only load if not already shown and not loaded
      setDatabaseLoading(true);
      setTimeout(() => {
        setDatabaseName("Izon");
        setDatabaseLoading(false);
      }, 1000); // Simulate 1 second loading
    } else if (showDatabasesDropdown) {
      setDatabaseName(""); // Clear database name when closing dropdown
      setShowIzonContent(false); // Close nested content
      setShowProgrammabilityContent(false);
      setSelectedDatabaseItem("");
    }
  };

  /**
   * Handles click on 'Izon' database item.
   * Toggles the visibility of Tables, Views, and Programmability.
   */
  const handleIzonClick = () => {
    setShowIzonContent((prevState) => !prevState);
    setShowProgrammabilityContent(false); // Close programmability if Izon is toggled
    setSelectedDatabaseItem(""); // Clear selected item
  };

  /**
   * Handles click on 'Programmability' item.
   * Toggles the visibility of Functions.
   */
  const handleProgrammabilityClick = () => {
    setShowProgrammabilityContent((prevState) => !prevState);
    setSelectedDatabaseItem(""); // Clear selected item
  };

  /**
   * Handles click on 'Tables' or 'Views' item.
   */
  const handleTablesViewsClick = (item) => {
    setSelectedDatabaseItem(item);
    setShowContextMenu(false); // Close context menu if open
  };

  /**
   * Handles the Disconnect button click.
   * Resets the application to the login page.
   */
  const handleDisconnect = () => {
    setShowDatabasesDropdown(false);
    setDatabaseLoading(false);
    setDatabaseName("");
    setShowBurgerMenu(false);
    setShowIzonContent(false);
    setShowProgrammabilityContent(false);
    setSelectedDatabaseItem("");
    setMessage("");
    setMessageType("");
    setShowContextMenu(false); // Close context menu on disconnect
    setShowQueryPlayground(false); // Close playground on disconnect
    setIsExecutingQuery(false);
    setQueryResult([]);
    setShowQueryResult(false);
    if (executionTimerRef.current) {
      clearTimeout(executionTimerRef.current);
      executionTimerRef.current = null;
    }
    setIsTableFullscreen(false); // Reset fullscreen state
  };

  /**
   * Handles right-click (context menu) event for AccessRoles.
   * @param {Event} e - The event object.
   */
  const handleAccessRolesContextMenu = (e) => {
    e.preventDefault(); // Prevent default browser context menu
    setShowContextMenu(true);
    setContextMenuPos({ x: e.clientX, y: e.clientY });
  };

  /**
   * Handles touch start for long press simulation.
   * @param {Event} e - The touch event object.
   */
  const handleTouchStart = (e) => {
    // Clear any existing timer to prevent multiple menus
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    // Start a timer for 500ms (adjust for desired long press duration)
    longPressTimer.current = setTimeout(() => {
      setShowContextMenu(true);
      // Use clientX/Y from the first touch point
      setContextMenuPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }, 500); // 500ms for long press
  };

  /**
   * Handles touch move to cancel long press if finger moves.
   */
  const handleTouchMove = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  /**
   * Handles touch end to clear long press timer if it was a tap.
   */
  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  /**
   * Handles click on New Query button.
   * Opens the query playground.
   */
  const handleNewQueryClick = () => {
    setShowQueryPlayground(true);
    setQueryText("SELECT * FROM AccessRoles;"); // Default query
    setQueryResult([]);
    setShowQueryResult(false);
    setIsExecutingQuery(false);
    setMessage(""); // Clear any previous messages
    setMessageType("");
    setShowContextMenu(false); // Close context menu if open
    setIsTableFullscreen(false); // Ensure not in fullscreen when opening new query
  };

  /**
   * Handles execution of the query.
   * Simulates loading and then displays mock data.
   */
  const handleExecuteQuery = () => {
    setIsExecutingQuery(true);
    setShowQueryResult(false);
    setQueryResult([]);
    setMessage("Executing query...");
    setMessageType("info");

    executionTimerRef.current = setTimeout(() => {
      setIsExecutingQuery(false);
      setQueryResult(mockQueryResultData);
      setShowQueryResult(true);
      setMessage("Query executed successfully!");
      setMessageType("success");
    }, 2000); // Simulate 2 seconds execution
  };

  /**
   * Handles stopping the query execution.
   */
  const handleStopQuery = () => {
    if (executionTimerRef.current) {
      clearTimeout(executionTimerRef.current);
      executionTimerRef.current = null;
    }
    setIsExecutingQuery(false);
    setMessage("Query execution stopped.");
    setMessageType("info");
  };

  /**
   * Handles "Select Top 1000 Rows" context menu action.
   */
  const handleSelectTop1000 = () => {
    setMessage('Executing "SELECT TOP 1000" on AccessRoles (simulated).');
    setMessageType("info");
    setShowContextMenu(false); // Close context menu after action
    setShowQueryPlayground(true); // Open playground
    setQueryText("SELECT TOP 1000 * FROM AccessRoles;"); // Pre-fill query
    setQueryResult([]);
    setShowQueryResult(false);
    setIsExecutingQuery(false);
  };

  /**
   * Handles resizing of the table.
   * @param {Event} e - Mouse or touch event.
   */
  const handleResizeStart = (e) => {
    resizeStartY.current = e.clientY || e.touches[0].clientY;
    initialTableHeight.current = tableHeight;
    document.addEventListener("mousemove", handleResizing);
    document.addEventListener("mouseup", handleResizeEnd);
    document.addEventListener("touchmove", handleResizing);
    document.addEventListener("touchend", handleResizeEnd);
  };

  const handleResizing = (e) => {
    const currentY = e.clientY || e.touches[0].clientY;
    const deltaY = currentY - resizeStartY.current;
    setTableHeight(Math.max(50, initialTableHeight.current + deltaY)); // Minimum height of 50px
  };

  const handleResizeEnd = () => {
    document.removeEventListener("mousemove", handleResizing);
    document.removeEventListener("mouseup", handleResizeEnd);
    document.removeEventListener("touchmove", handleResizing);
    document.removeEventListener("touchend", handleResizeEnd);
  };

  /**
   * Toggles fullscreen mode for the query result table.
   */
  const toggleFullscreen = () => {
    setIsTableFullscreen((prevState) => !prevState);
  };

  // Determine which data to render (always original data as transpose is removed)
  const currentTableData = queryResult;

  // Determine headers for the table
  const tableHeaders =
    currentTableData.length > 0 ? Object.keys(currentTableData[0]) : [];

  return (
    <>
      {/* Custom CSS styles embedded directly in the component for self-containment */}
      <style>
        {`      .card-header-custom {
                    background-color: #333333; /* Header background */
                    color: #ffffff;
                    padding: 15px 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #444444; /* Header bottom border */
                }


                .close-icon {
                    width: 24px;
                    height: 24px;
                    color: #888888; /* Light grey icon */
                    cursor: pointer;
                    transition: color 0.15s ease-in-out;
                }

                .close-icon:hover {
                    color: #ffffff; /* White on hover */
                }
         


                .checkbox-group input[type="checkbox"] {
                    margin-right: 8px;
                    width: 16px;
                    height: 16px;
                    appearance: none; /* Hide default checkbox */
                    background-color: #3c3c3c;
                    border: 1px solid #555555;
                    border-radius: 3px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background-color 0.15s ease, border-color 0.15s ease;
                }

                .checkbox-group input[type="checkbox"]:checked {
                    background-color: #007acc; /* Checked color */
                    border-color: #007acc;
                }

                .checkbox-group input[type="checkbox"]:checked::before {
                    content: '✔'; /* Checkmark character */
                    color: white;
                    font-size: 0.8em;
                }

                .checkbox-group input[type="checkbox"]:focus {
                    outline: none;
                    box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.25);
                }

                .connect-button:hover {
                    background-color: #0063a8; /* Darker blue on hover */
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                }

                .connect-button:focus {
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(0, 122, 204, 0.5); /* Focus ring */
                }

                /* Connected Page Styles */
                .connected-page {
                    width: 100%;
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    background-color: #1e1e1e;
                    color: #cccccc;
                }

                .connected-header {
                    background-color: #333333;
                    color: #ffffff;
                    padding: 10px 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between; /* Distributes items */
                    border-bottom: 1px solid #444444;
                    position: relative;
                    z-index: 10; /* Ensure header is above sidebar */
                }

                .burger-menu-icon {
                    width: 30px;
                    height: 30px;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    align-items: center;
                    padding: 5px;
                }

                .burger-menu-icon div {
                    width: 24px;
                    height: 2px;
                    background-color: #ffffff;
                    border-radius: 2px;
                    transition: all 0.3s ease;
                }

                .burger-menu-icon.open div:nth-child(1) {
                    transform: translateY(8px) rotate(45deg);
                }
                .burger-menu-icon.open div:nth-child(2) {
                    opacity: 0;
                }
                .burger-menu-icon.open div:nth-child(3) {
                    transform: translateY(-8px) rotate(-45deg);
                }

                .db-logo-icon-wrapper {
                    flex-grow: 1; /* Allows the wrapper to take available space */
                    display: flex;
                    justify-content: center; /* Center the icon within its wrapper */
                    align-items: center;
                }

                .db-logo-icon {
                    width: 30px;
                    height: 30px;
                    color: #ffffff; /* Ensure icon color is visible */
                }

                .new-query-button {
                    background-color: #007acc; /* VS Code blue accent */
                    color: white;
                    padding: 8px 15px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: background-color 0.15s ease-in-out;
                }

                .new-query-button:hover {
                    background-color: #0063a8;
                }


                .main-content-area {
                    flex-grow: 1;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start; /* Align dropdown to left */
                    position: relative;
                }

                .sidebar {
                    position: fixed;
                    top: 0;
                    left: -250px; /* Hidden by default */
                    width: 250px;
                    height: 100vh;
                    background-color: #252526;
                    border-right: 1px solid #3c3c3c;
                    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.3);
                    transition: left 0.3s ease-in-out;
                    z-index: 20; /* Above main content */
                    display: flex;
                    flex-direction: column;
                    padding-top: 60px; /* Space for header */
                }

                .sidebar.open {
                    left: 0; /* Slide in */
                }

                .sidebar-menu {
                    list-style: none;
                    padding: 0;
                    margin: 20px 0;
                    flex-grow: 1; /* Push disconnect to bottom */
                }

                .sidebar-menu li {
                    padding: 10px 20px;
                    cursor: pointer;
                    color: #cccccc;
                    transition: background-color 0.2s ease;
                }

                .sidebar-menu li:hover {
                    background-color: #007acc; /* VS Code blue accent on hover */
                    color: white;
                }

                .sidebar-disconnect-button {
                    background-color: #cc0000; /* Red for disconnect */
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    width: calc(100% - 40px); /* Account for padding */
                    margin: 20px;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                    z-index: 2
                }

                .sidebar-disconnect-button:hover {
                    background-color: #990000;
                }

                .dropdown-container {
                    position: relative;
                    width: 100%; /* Make dropdown fill width */
                    max-width: 300px; /* Optional: max-width for larger screens */
                    margin-bottom: 20px;
                }

                .dropdown-header {
                    background-color: #3c3c3c;
                    color: #ffffff;
                    padding: 10px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border: 1px solid #555555;
                    transition: background-color 0.2s ease;
                }

                .dropdown-header:hover {
                    background-color: #4a4a4a;
                }

                .chevron-icon {
                    width: 16px;
                    height: 16px;
                    transition: transform 0.3s ease;
                }

                .chevron-icon.rotated {
                    transform: rotate(180deg);
                }

                .dropdown-content {
                    background-color: #2d2d2d;
                    border: 1px solid #444444;
                    border-radius: 4px;
                    position: absolute;
                    width: 100%;
                    max-height: 0; /* Hidden by default */
                    overflow: hidden;
                    transition: max-height 0.3s ease-out;
                    z-index: 5; /* Below sidebar */
                }

                .dropdown-content.open {
                    max-height: 300px; /* Increased max-height for nested content */
                }

                .dropdown-item {
                    padding: 10px 15px;
                    color: #cccccc;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                }

                .dropdown-item:hover {
                    background-color: #007acc;
                    color: white;
                }

                .nested-dropdown-content {
                    padding-left: 20px; /* Indent nested items */
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease-out;
                }

                .nested-dropdown-content.open {
                    max-height: 200px; /* Adjust as needed for nested content */
                }

                .loading-spinner {
                    border: 4px solid rgba(255, 255, 255, 0.3);
                    border-top: 4px solid #007acc;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    animation: spin 1s linear infinite;
                    display: inline-block;
                    margin-left: 10px;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

          

                /* Context Menu Styles */
                .context-menu {
                    position: fixed;
                    background-color: #2d2d2d;
                    border: 1px solid #444444;
                    border-radius: 4px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
                    z-index: 100; /* Ensure it's on top */
                    min-width: 150px;
                    padding: 5px 0;
                }

                .context-menu-item {
                    padding: 8px 15px;
                    color: #cccccc;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                }

                .context-menu-item:hover {
                    background-color: #007acc;
                    color: white;
                }

                /* Query Playground Styles */
                .query-playground {
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1; /* Take remaining space */
                    width: 100%; /* Fill width */
                    background-color: #1e1e1e; /* Match app background */
                    padding: 0; /* Remove padding from main-content-area */
                    box-sizing: border-box;
                    transition: all 0.3s ease-in-out; /* For fullscreen transition */
                }

                .query-playground.fullscreen {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    z-index: 99; /* Higher than sidebar, lower than context menu */
                    padding: 20px;
                    background-color: #1e1e1e;
                }

                .query-playground-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background-color: #333333;
                    padding: 10px 15px;
                    border-bottom: 1px solid #444444;
                    border-top-left-radius: 4px;
                    border-top-right-radius: 4px;
                    margin-bottom: 10px;
                }

                .query-playground-header h3 {
                    margin: 0;
                    font-size: 1rem;
                    color: #ffffff;
                }

                .query-action-buttons {
                    display: flex;
                    gap: 8px;
                }

                .query-action-button {
                    background-color: #007acc;
                    color: white;
                    padding: 6px 12px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: background-color 0.15s ease-in-out;
                }

                .query-action-button:hover {
                    background-color: #0063a8;
                }

                .query-editor-container {
                    flex-shrink: 0; /* Don't shrink */
                    margin-bottom: 10px;
                    border: 1px solid #444444;
                    border-radius: 4px;
                    overflow: hidden;
                }

                .query-editor-textarea {
                    width: 100%;
                    height: 150px; /* Fixed height for editor */
                    background-color: #252526; /* Editor background */
                    color: #d4d4d4; /* Editor text color */
                    border: none;
                    padding: 15px;
                    font-family: 'Cascadia Code', 'Consolas', 'Monaco', monospace; /* Code font */
                    font-size: 0.95rem;
                    resize: vertical; /* Allow vertical resize for textarea */
                    box-sizing: border-box;
                    outline: none;
                }

                .query-buttons {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 20px;
                }

                .execute-button, .stop-button {
                    background-color: #007acc;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: background-color 0.15s ease-in-out;
                }

                .execute-button:hover:not(:disabled) {
                    background-color: #0063a8;
                }

                .execute-button:disabled {
                    background-color: #007acc80; /* Lighter blue when disabled */
                    cursor: not-allowed;
                }

                .stop-button {
                    background-color: #cc0000; /* Red for stop */
                }

                .stop-button:hover {
                    background-color: #990000;
                }

                .query-result-container {
                    flex-grow: 1; /* Take remaining vertical space */
                    border: 1px solid #444444;
                    border-radius: 4px;
                    overflow: hidden; /* For table scrolling */
                    display: flex;
                    flex-direction: column;
                    position: relative; /* For resizer */
                }

                .result-table-wrapper {
                    overflow: auto; /* Enable horizontal and vertical scrolling */
                    flex-grow: 1; /* Take up available space */
                    position: relative; /* For the table inside */
                }

                .result-table {
                    width: 100%; /* Ensure table takes full width of its scrollable container */
                    border-collapse: collapse;
                    min-width: max-content; /* Allow table to grow horizontally if content is wide */
                }

                .result-table th, .result-table td {
                    padding: 10px 15px;
                    border: 1px solid #3c3c3c;
                    text-align: left;
                    white-space: nowrap; /* Prevent text wrapping in cells */
                }

                .result-table th {
                    background-color: #333333;
                    color: #ffffff;
                    font-weight: 600;
                    position: sticky;
                    top: 0;
                    z-index: 2; /* Keep header visible on vertical scroll */
                }

                .result-table td {
                    background-color: #2d2d2d;
                }

                .result-table tr:nth-child(even) td {
                    background-color: #252526; /* Alternate row color */
                }

                .table-resizer {
                    height: 8px;
                    background-color: #007acc;
                    cursor: ns-resize; /* North-south resize cursor */
                    flex-shrink: 0; /* Don't shrink resizer */
                    border-bottom-left-radius: 4px;
                    border-bottom-right-radius: 4px;
                    transition: background-color 0.15s ease;
                }

                .table-resizer:hover {
                    background-color: #0063a8;
                }


                `}
      </style>

      <div className="connected-page">
        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className={`sidebar ${showBurgerMenu ? "open" : ""}`}
        >
          <ul className="sidebar-menu">
            <li>SQL history</li>
            {/* Add more menu items here */}
          </ul>
          <button
            onClick={handleDisconnect}
            className="sidebar-disconnect-button"
          >
            Disconnect
          </button>
        </div>

        {/* Header */}
        <div className="connected-header">
          <div
            className={`burger-menu-icon ${showBurgerMenu ? "open" : ""}`}
            onClick={() => setShowBurgerMenu(!showBurgerMenu)}
          >
            <div></div>
            <div></div>
            <div></div>
          </div>
          {/* DB Container Logo - Centered */}
          <div className="db-logo-icon-wrapper">
            <svg
              className="db-logo-icon"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20 18H4V8h16v10zM20 6h-2V4h-4v2H8V4H6v2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM12 11c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
            </svg>
          </div>
          {/* New Query button */}
          <button className="new-query-button" onClick={handleNewQueryClick}>
            New Query
          </button>
        </div>

        {/* Main Content Area */}
        <div className="main-content-area">
          {/* Databases Dropdown */}
          <div className="dropdown-container">
            <div className="dropdown-header" onClick={handleDatabasesClick}>
              <span>Databases</span>
              <svg
                className={`chevron-icon ${
                  showDatabasesDropdown ? "rotated" : ""
                }`}
                fill="currentColor"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                />
              </svg>
            </div>
            <div
              className={`dropdown-content ${
                showDatabasesDropdown ? "open" : ""
              }`}
            >
              {databaseLoading ? (
                <div
                  className="dropdown-item"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  Loading... <span className="loading-spinner"></span>
                </div>
              ) : (
                databaseName && (
                  <>
                    <div className="dropdown-item" onClick={handleIzonClick}>
                      Izon
                      <svg
                        className={`chevron-icon ${
                          showIzonContent ? "rotated" : ""
                        }`}
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ float: "right" }}
                      >
                        <path
                          fillRule="evenodd"
                          d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                        />
                      </svg>
                    </div>
                    <div
                      className={`nested-dropdown-content ${
                        showIzonContent ? "open" : ""
                      }`}
                    >
                      <div
                        className="dropdown-item"
                        onClick={() => handleTablesViewsClick("Tables")}
                      >
                        Tables
                        <svg
                          className={`chevron-icon ${
                            selectedDatabaseItem === "Tables" ? "rotated" : ""
                          }`}
                          fill="currentColor"
                          viewBox="0 0 16 16"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ float: "right" }}
                        >
                          <path
                            fillRule="evenodd"
                            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                          />
                        </svg>
                      </div>
                      {selectedDatabaseItem === "Tables" && (
                        <div className="nested-dropdown-content open">
                          <div
                            className="dropdown-item"
                            onContextMenu={handleAccessRolesContextMenu}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                          >
                            AccessRoles
                          </div>
                        </div>
                      )}
                      <div
                        className="dropdown-item"
                        onClick={() => handleTablesViewsClick("Views")}
                      >
                        Views
                      </div>
                      <div
                        className="dropdown-item"
                        onClick={handleProgrammabilityClick}
                      >
                        Programmability
                        <svg
                          className={`chevron-icon ${
                            showProgrammabilityContent ? "rotated" : ""
                          }`}
                          fill="currentColor"
                          viewBox="0 0 16 16"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ float: "right" }}
                        >
                          <path
                            fillRule="evenodd"
                            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                          />
                        </svg>
                      </div>
                      <div
                        className={`nested-dropdown-content ${
                          showProgrammabilityContent ? "open" : ""
                        }`}
                      >
                        <div className="dropdown-item">Functions</div>
                      </div>
                    </div>
                  </>
                )
              )}
            </div>
          </div>

          {/* Content Area for Tables/Views/Functions or Query Playground */}
          {showQueryPlayground ? (
            <div
              className={`query-playground ${
                isTableFullscreen ? "fullscreen" : ""
              }`}
            >
              <div className="query-playground-header">
                <h3>Query Results</h3>
                <div className="query-action-buttons">
                  {!isTableFullscreen ? (
                    <button
                      className="query-action-button"
                      onClick={toggleFullscreen}
                    >
                      Fullscreen
                    </button>
                  ) : (
                    <button
                      className="query-action-button"
                      onClick={toggleFullscreen}
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>
              <div className="query-editor-container">
                <textarea
                  className="query-editor-textarea"
                  placeholder="Write your SQL query here..."
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  disabled={isExecutingQuery}
                ></textarea>
              </div>
              <div className="query-buttons">
                {!isExecutingQuery ? (
                  <button
                    className="execute-button"
                    onClick={handleExecuteQuery}
                  >
                    Execute
                  </button>
                ) : (
                  <button className="stop-button" onClick={handleStopQuery}>
                    Stop
                  </button>
                )}
                {isExecutingQuery && <span className="loading-spinner"></span>}
              </div>

              {message && ( // Display messages from query execution
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

              {showQueryResult && currentTableData.length > 0 && (
                <div
                  className="query-result-container"
                  style={{
                    height: isTableFullscreen ? "auto" : tableHeight + "px",
                  }}
                >
                  <div className="result-table-wrapper">
                    <table className="result-table">
                      <thead>
                        <tr>
                          {tableHeaders.map((key) => (
                            <th key={key}>{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {currentTableData.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {tableHeaders.map((key, colIndex) => (
                              <td key={colIndex}>{String(row[key])}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {!isTableFullscreen && ( // Hide resizer in fullscreen
                    <div
                      className="table-resizer"
                      onMouseDown={handleResizeStart}
                      onTouchStart={handleResizeStart}
                    ></div>
                  )}
                </div>
              )}
            </div>
          ) : (
            selectedDatabaseItem &&
            selectedDatabaseItem !== "AccessRoles" && ( // Only show if not AccessRoles and playground not open
              <div className="not-yet-created-message">
                &lt;NOT YET CREATED&gt; for {selectedDatabaseItem}
              </div>
            )
          )}
        </div>
      </div>

      {/* Context Menu */}
      {showContextMenu && (
        <div
          ref={contextMenuRef}
          className="context-menu"
          style={{ top: contextMenuPos.y, left: contextMenuPos.x }}
        >
          <div className="context-menu-item" onClick={handleSelectTop1000}>
            Select Top 1000 Rows
          </div>
        </div>
      )}
    </>
  );
};

export default App;
