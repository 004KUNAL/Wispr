import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { user, token, loading, error, initialized } = useSelector(s => s.auth);
  return {
    user,
    token,
    loading,
    error,
    initialized,
    isAuthenticated: !!token && !!user,
    isGuest: user?.isGuest || false,
    isAdmin: user?.isAdmin || false,
    activeIdentity: user?.activeIdentity || null,
    identities: user?.identities || [],
    settings: user?.settings || {},
  };
};
