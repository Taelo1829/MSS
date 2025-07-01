// components/Layout.js
import { Outlet, Link } from "react-router-dom";

export default function Layout() {
  return (
    <div className="app-container">
      <Outlet />
    </div>
  );
}
