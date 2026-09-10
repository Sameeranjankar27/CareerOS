import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get(
        "/notifications/unread-count",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUnreadCount(response.data.count);
    } catch (error) {
      console.error(
        "Unread Notification Error:",
        error
      );
    }
  };

  useEffect(() => {
    if (!token) return;

    fetchUnreadCount();

    const interval = setInterval(
      fetchUnreadCount,
      30000
    );

    return () => clearInterval(interval);
  }, [token]);

  const handleNotificationClick = () => {
    navigate("/notifications");
  };

  return (
    <header className="navbar">

      <div className="navbar-left">
        <h2>
          CareerOS
        </h2>
      </div>

      <div className="navbar-right">

        <button
          className="navbar-notification-button"
          onClick={handleNotificationClick}
          aria-label="Notifications"
        >
          <span className="navbar-notification-icon">
            🔔
          </span>

          {unreadCount > 0 && (
            <span className="navbar-notification-badge">
              {unreadCount > 99
                ? "99+"
                : unreadCount}
            </span>
          )}
        </button>

        <div className="navbar-user">

          <div className="navbar-avatar">
            {user?.name
              ? user.name.charAt(0).toUpperCase()
              : "U"}
          </div>

          <div className="navbar-user-info">
            <span className="navbar-user-name">
              {user?.name || "User"}
            </span>
          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;