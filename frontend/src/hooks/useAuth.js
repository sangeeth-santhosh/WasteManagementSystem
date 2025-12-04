import { useAuthContext } from '../context/AuthContext';

/**
 * Custom hook to access authentication context
 * @returns {Object} Auth context values and methods
 */
export const useAuth = () => {
  return useAuthContext();
};

