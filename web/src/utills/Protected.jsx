import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found — redirecting to signin");
    return <Navigate to="/signin" replace />;
  }
  return children;
};

export default ProtectedRoute;
