import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import socket from "../socket";
import toast from "react-hot-toast";

const NotificationBell = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get("/notifications");
        setNotifications(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchNotifications();

    socket.on("newNotification", (notif) => {
      setNotifications((prev) => [notif, ...prev]);
      toast(notif.title, {
        icon: notif.type === "success" ? "✅" : notif.type === "warning" ? "⚠️" : "ℹ️",
        style: { background: "#0B1120", color: "#fff", border: "1px solid #1A2234" }
      });
    });

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      socket.off("newNotification");
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = async (id) => {
    try {
      await API.put(`/notifications/read/${id}`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* BELL ICON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#050816]">
            {unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {isOpen && (
        <div className="absolute right-0 mt-4 w-[calc(100vw-2rem)] max-w-80 md:w-96 md:max-w-none bg-[#0B1120] border border-[#1A2234] rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[100] backdrop-blur-xl">
          <div className="p-6 border-b border-[#1A2234] flex justify-between items-center bg-white/5">
            <h3 className="text-white font-bold text-xl">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-blue-400 text-xs font-semibold px-2 py-1 bg-blue-400/10 rounded-lg">
                {unreadCount} New
              </span>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-gray-500">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleMarkAsRead(n._id)}
                  className={`p-6 border-b border-[#1A2234] hover:bg-white/5 transition cursor-pointer relative ${!n.isRead ? 'bg-blue-500/5' : ''}`}
                >
                  {!n.isRead && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500"></div>
                  )}
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-sm font-bold ${!n.isRead ? 'text-white' : 'text-gray-400'}`}>
                      {n.title}
                    </h4>
                    <span className="text-[10px] text-gray-500">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{n.message}</p>
                </div>
              ))
            )}
          </div>

          <div className="p-4 text-center bg-white/5">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/notifications");
              }}
              className="text-blue-400 text-sm font-semibold hover:text-blue-300 transition cursor-pointer"
            >
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
