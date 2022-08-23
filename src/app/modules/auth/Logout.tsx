import { useEffect } from 'react';

export function Logout() {
  useEffect(() => {
    sessionStorage.removeItem('rankme-auth');
    document.location.href = '/start-react-free/auth/login';
  }, []);

  return null;
}
