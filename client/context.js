import React, { useState, useEffect, createContext } from 'react';

export const UserContext = createContext();

export const UserProvider = (props) => {
  const [apolloToken, setToken] = useState(
    localStorage.getItem('apollo-token'),
  );

  const handleLogin = (token) => {
    localStorage.setItem('apollo-token', token);
    setToken(token);
  };

  const handleLogOut = (e) => {
    setToken('');
    localStorage.removeItem('apollo-token');
  };

  return (
    <UserContext.Provider
      value={{ apolloToken, handleLogin, handleLogOut }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
