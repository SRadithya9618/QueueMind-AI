import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import socket from "../socket";
import {
  FiArrowLeft,
  FiBell,
  FiCheckCircle,
  FiClock,
  FiInfo,
  FiMenu,
} from "react-icons/fi";

function CustomerNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications]
  );

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await API.get("/notifications");
        setNotifications(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    socket.on("newNotification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.off("newNotification");
    };
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await API.put(`/notifications/read/${id}`);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter(
      (notification) => !notification.isRead
    );

    await Promise.all(
      unreadNotifications.map((notification) =>
        API.put(`/notifications/read/${notification._id}`)
      )
    );

    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  const getIcon = (type) => {
    if (type === "success") return <FiCheckCircle />;
    if (type === "warning") return <FiClock />;
    return <FiInfo />;
  };

  const getToneClass = (type) => {
    if (type === "success") return "text-green-400 bg-green-500/10";
    if (type === "warning") return "text-yellow-400 bg-yellow-500/10";
    return "text-blue-400 bg-blue-500/10";
  };

  return (
    <div
      className="
        min-h-screen
        w-full
        overflow-x-hidden
        text-white
        px-4
        sm:px-6
        md:px-10
        py-8
      "
      style={{
        background:
          "linear-gradient(135deg, #050816 0%, #0b1230 40%, #21002e 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-start sm:items-center gap-4 min-w-0">
            <button
              onClick={() => navigate("/dashboard/customer")}
              className="
                w-12
                h-12
                rounded-2xl
                bg-white/5
                border
                border-white/10
                text-gray-300
                hover:text-white
                hover:bg-white/10
                transition
                flex
                items-center
                justify-center
                cursor-pointer
                shrink-0
              "
            >
              <FiArrowLeft />
            </button>

            <div className="min-w-0">
              <p className="text-blue-400 font-semibold tracking-[4px] text-sm mb-3">
                CUSTOMER CENTER
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold break-words">
                Notifications
              </h1>
              <p className="text-gray-400 text-base sm:text-lg mt-3">
                Track queue updates, token alerts, and AI recommendations.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => navigate("/dashboard/customer")}
              className="
                px-5
                py-3
                rounded-2xl
                bg-[#111827]
                border
                border-[#1A2234]
                text-gray-300
                hover:text-white
                hover:bg-white/5
                transition
                cursor-pointer
                flex
                items-center
                justify-center
                gap-2
              "
            >
              <FiMenu />
              Dashboard
            </button>

            <button
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className="
                px-5
                py-3
                rounded-2xl
                bg-gradient-to-r
                from-blue-500
                to-purple-500
                text-white
                font-semibold
                disabled:opacity-40
                disabled:cursor-not-allowed
                hover:scale-[1.02]
                transition
                cursor-pointer
              "
            >
              Mark all read
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#0d1730]/80 backdrop-blur-xl border border-[#1d2942] rounded-3xl p-6">
            <p className="text-gray-400 mb-3">Total</p>
            <h2 className="text-3xl sm:text-4xl font-bold">
              {notifications.length}
            </h2>
          </div>
          <div className="bg-[#0d1730]/80 backdrop-blur-xl border border-[#1d2942] rounded-3xl p-6">
            <p className="text-gray-400 mb-3">Unread</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-400">
              {unreadCount}
            </h2>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl p-6">
            <p className="text-white/80 mb-3">Status</p>
            <h2 className="text-2xl sm:text-3xl font-bold">
              {unreadCount > 0 ? "Action needed" : "All caught up"}
            </h2>
          </div>
        </div>

        <div className="bg-[#0B1120]/90 border border-[#1A2234] rounded-[32px] overflow-hidden backdrop-blur-xl shadow-2xl">
          <div className="p-6 sm:p-8 border-b border-[#1A2234] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <FiBell />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">Recent Alerts</h2>
                <p className="text-gray-400 text-sm">
                  Latest updates from your active queues.
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-6 sm:p-8 space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-24 rounded-3xl bg-white/5 animate-pulse"
                ></div>
              ))}
            </div>
          ) : error ? (
            <div className="p-10 text-center">
              <p className="text-red-400 font-semibold">{error}</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-10 sm:p-16 text-center">
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 text-blue-400">
                <FiBell size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3">No notifications yet</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Queue updates, token status changes, and AI alerts will appear
                here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#1A2234]">
              {notifications.map((notification) => (
                <button
                  key={notification._id}
                  onClick={() => handleMarkAsRead(notification._id)}
                  className={`
                    w-full
                    text-left
                    p-5
                    sm:p-6
                    transition
                    cursor-pointer
                    hover:bg-white/5
                    ${!notification.isRead ? "bg-blue-500/5" : ""}
                  `}
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div
                      className={`
                        w-12
                        h-12
                        rounded-2xl
                        flex
                        items-center
                        justify-center
                        shrink-0
                        ${getToneClass(notification.type)}
                      `}
                    >
                      {getIcon(notification.type)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <h3 className="text-white font-bold break-words">
                          {notification.title}
                        </h3>
                        <span className="text-gray-500 text-xs whitespace-nowrap">
                          {new Date(notification.createdAt).toLocaleString([], {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>

                      <p className="text-gray-400 leading-relaxed break-words">
                        {notification.message}
                      </p>

                      {!notification.isRead && (
                        <span className="inline-flex mt-4 text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerNotifications;
