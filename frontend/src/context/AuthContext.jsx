import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');
    const phoneNumber = localStorage.getItem('phoneNumber');

    if (token && role && userId) {
      return { token, role, userId: Number(userId), phoneNumber };
    }
    return null;
  });

  const loginUser = (authData) => {
    localStorage.setItem('token', authData.token);
    localStorage.setItem('role', authData.role);
    localStorage.setItem('userId', authData.userId);
    localStorage.setItem('phoneNumber', authData.phoneNumber);

    setUser({
      token: authData.token,
      role: authData.role,
      userId: Number(authData.userId),
      phoneNumber: authData.phoneNumber,
    });
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('phoneNumber');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
