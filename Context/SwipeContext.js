import React, { createContext, useState, useContext } from 'react';

const SwipeContext = createContext();

export const SwipeProvider = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCollegeName, setSelectedCollegeName] = useState(null);

  return (
    <SwipeContext.Provider value={{ selectedCity, setSelectedCity, selectedCollegeName, setSelectedCollegeName }}>
      {children}
    </SwipeContext.Provider>
  );
};

export const useSwipe = () => useContext(SwipeContext);
