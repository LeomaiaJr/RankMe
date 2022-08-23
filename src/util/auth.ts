export interface AuthData {
  user?: UserData;
  token?: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  register_id: string;
  course?: any;
  created_at: string;
  updated_at: string;
}

export const getAuthUserData = () => {
  const data = sessionStorage.getItem('rankme-auth');
  const authData: AuthData = JSON.parse(data || '{}');

  return authData.user;
};

export const getAuthToken = () => {
  const data = sessionStorage.getItem('rankme-auth');
  const authData: AuthData = JSON.parse(data || '{}');

  return authData.token;
};
