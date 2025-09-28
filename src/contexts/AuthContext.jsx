import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser({ token }); 
    }
    setLoading(false);
  }, []);

  const login = async (email, senha) => {
    try {
        const response = await api.post('/auth/login', { email, senha });
        const { token } = response.data;
        localStorage.setItem('token', token);
        api.defaults.headers.Authorization = `Bearer ${token}`;
        setUser({ token });
        toast.success('Login efetuado com sucesso!');
    } catch (error) {
        toast.error('Credenciais inválidas. Verifique o seu e-mail e senha.');
        throw error;
    }
  };

  const register = async (nome, email, senha) => {
    try {
        const response = await api.post('/auth/registro', { nome, email, senha });
        const { token } = response.data;
        localStorage.setItem('token', token);
        api.defaults.headers.Authorization = `Bearer ${token}`;
        setUser({ token });
        toast.success('Registo concluído com sucesso!');
    } catch (error) {
        toast.error('Erro ao efetuar o registo. O e-mail já pode estar em uso.');
        throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.Authorization;
    setUser(null);
  };

  const value = { user, login, register, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};