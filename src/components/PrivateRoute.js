import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

function PrivateRoute({ children }) {
  const { user } = useContext(UserContext);

  if (!user) {
    return <Navigate to="/sign-in" />;
  }

  return children;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
