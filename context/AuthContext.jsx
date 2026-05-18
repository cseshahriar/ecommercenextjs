'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import api from '../utils/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const response = await api.get('/api/account/me');
      setUser(response.data);
      return response.data;
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (data) => {
    await api.post("/api/account/login", data);
    const loggedInUser = await fetchUser();
    const searchParams = new URLSearchParams(window.location.search);
    const redirect = searchParams.get("redirect") 
    console.log("Redirect", redirect, "user ", loggedInUser);

    if(redirect){
      console.log("1");
      router.push(redirect);
    } else if(loggedInUser?.is_admin){
      console.log("2");
      router.push("/user/dashboard");
    } else {
      console.log("3");
      router.push("/user/order");
    }
  };


  const logout = async () => {
    await api.post('/api/account/logout');
    setUser(null);
    router.push('/login');
  };

  const register = async (data) => {
    await api.post('/api/account/register', data);
    await fetchUser();
    router.push('/login');
  };

  useEffect(() => {
    if (!user && loading) {
      fetchUser();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

