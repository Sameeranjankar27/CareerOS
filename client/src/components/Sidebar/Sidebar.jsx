import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">
          C
        </div>

        <h2>CareerOS</h2>
      </div>

      <div className="sidebar-menu-title">
        WORKSPACE
      </div>

      <nav className="sidebar-nav">

        <NavLink
          to="/dashboard"
          className="sidebar-link"
        >
          <span className="sidebar-icon">⌂</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/jobs"
          className="sidebar-link"
        >
          <span className="sidebar-icon">▣</span>
          <span>Job Applications</span>
        </NavLink>

        <NavLink
          to="/resume"
          className="sidebar-link"
        >
          <span className="sidebar-icon">▤</span>
          <span>Resume</span>
        </NavLink>

        <NavLink
          to="/ai-analysis"
          className="sidebar-link"
        >
          <span className="sidebar-icon">✦</span>
          <span>AI Resume Analysis</span>
        </NavLink>

        <NavLink
          to="/ai-interview-prep"
          className="sidebar-link"
        >
          <span className="sidebar-icon">?</span>
          <span>AI Interview Prep</span>
        </NavLink>

        <NavLink
          to="/notifications"
          className="sidebar-link"
        >
          <span className="sidebar-icon">🔔</span>
          <span>Notifications</span>
        </NavLink>

      </nav>

      <div className="sidebar-bottom">

        <div className="sidebar-divider"></div>

        <button
          className="logout-button"
          onClick={logout}
        >
          <span className="sidebar-icon">↪</span>
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;