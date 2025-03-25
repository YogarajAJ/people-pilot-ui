
import React, { createContext, useContext, useState, ReactNode } from 'react';

type AppContextType = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  appName: string;
  username: string;
  isLoggedIn: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('Unicrore');
  const appName = 'People Pilot';

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const login = (username: string, password: string): boolean => {
    // Simple authentication logic
    if (username === 'unicrore_admin' && password === 'admin') {
      setIsLoggedIn(true);
      setUsername('Unicrore');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        currentPage,
        setCurrentPage,
        appName,
        username,
        isLoggedIn,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
