import { Navigate } from "react-router-dom";

function RoleProtectedRoute({
  children,
  allowedRole,
}) {

  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // check login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // check role
  if (user?.role !== allowedRole) {
    return <Navigate to="/" />;
  }

  return children;
}

export default RoleProtectedRoute;