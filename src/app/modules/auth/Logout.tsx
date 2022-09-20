import { useEffect } from 'react';

export function Logout() {
  useEffect(() => {
    sessionStorage.removeItem('rankme-auth');
    document.location.href = '/auth';
  }, []);

  return null;
}
