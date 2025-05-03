import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token"); 

  return isAuthenticated ? children : <Navigate to="/" />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default PrivateRoute;
