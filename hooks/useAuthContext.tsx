import { userAuthContext } from '../context/UserAuthContext';
import { useContext } from 'react';

export const useAuthContext = () => {
  const context = useContext(userAuthContext);

  if (!context) {
    throw Error('useAuthContext must be used inside an AuthContextProvider');
  }

  return context;
};
