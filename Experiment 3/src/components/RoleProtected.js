import { Navigate } from "react-router-dom";

function RoleProtected({ children }) {

  const role = localStorage.getItem("role");

  if (role === "Admin") {

    return children;

  }

  return <Navigate to="/unauthorized" />;

}

export default RoleProtected;