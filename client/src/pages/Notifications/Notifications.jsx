import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function Notifications() {
  const { token } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH NOTIFICATIONS
  // ==========================================

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications(response.data);
    } catch (error) {
      console.error(
        "Fetch Notifications Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to fetch notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // ==========================================
  // MARK ONE AS READ
  // ==========================================

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(
        `/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((previous) =>
        previous.map((notification) =>
          notification._id === id
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.error(
        "Mark Notification Error:",
        error
      );
    }
  };

  // ==========================================
  // MARK ALL AS READ
  // ==========================================

  const handleMarkAllAsRead = async () => {
    try {
      await api.put(
        "/notifications/read-all",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error(
        "Mark All Notifications Error:",
        error
      );
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <div className="notifications-page">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="notifications-header">

        <div>
          <h1>Notifications</h1>

          <p>
            Stay updated with your CareerOS activity.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            className="mark-all-read-button"
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </button>
        )}

      </div>


      {/* ==========================================
          ERROR
      ========================================== */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      {/* ==========================================
          LOADING
      ========================================== */}

      {loading && (
        <div className="notifications-empty">
          Loading notifications...
        </div>
      )}


      {/* ==========================================
          EMPTY STATE
      ========================================== */}

      {!loading &&
        !error &&
        notifications.length === 0 && (
          <div className="notifications-empty">

            <div className="notifications-empty-icon">
              🔔
            </div>

            <h3>
              No notifications yet
            </h3>

            <p>
              Your application updates and reminders
              will appear here.
            </p>

          </div>
        )}


      {/* ==========================================
          NOTIFICATION LIST
      ========================================== */}

      {!loading &&
        notifications.length > 0 && (
          <div className="notifications-list">

            {notifications.map((notification) => (
              <div
                className={`notification-card ${
                  notification.isRead
                    ? "notification-read"
                    : "notification-unread"
                }`}
                key={notification._id}
              >

                <div className="notification-icon">
                  {notification.type === "interview"
                    ? "🎯"
                    : notification.type === "offer"
                    ? "🎉"
                    : notification.type ===
                      "follow-up"
                    ? "⏰"
                    : "💼"}
                </div>


                <div className="notification-content">

                  <div className="notification-title-row">

                    <h3>
                      {notification.title}
                    </h3>

                    {!notification.isRead && (
                      <span className="unread-dot"></span>
                    )}

                  </div>


                  <p>
                    {notification.message}
                  </p>


                  {notification.relatedJob && (
                    <span className="notification-job">
                      {notification.relatedJob.role}
                      {" • "}
                      {notification.relatedJob.company}
                    </span>
                  )}


                  <span className="notification-date">
                    {new Date(
                      notification.createdAt
                    ).toLocaleString()}
                  </span>

                </div>


                {!notification.isRead && (
                  <button
                    className="notification-read-button"
                    onClick={() =>
                      handleMarkAsRead(
                        notification._id
                      )
                    }
                  >
                    Mark as read
                  </button>
                )}

              </div>
            ))}

          </div>
        )}

    </div>
  );
}

export default Notifications;