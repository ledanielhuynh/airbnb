import React, { createContext } from 'react';

export const initialValue = {
  userEmail: '',
};

export const Context = createContext(initialValue);
export const useContext = React.useContext;
