import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  return (
    <div className="form-container">
      <h1>Login</h1>
      <LoginForm />
      <p className="form-footer">
        Não tem uma conta? <Link to="/register">Registe-se</Link>
      </p>
    </div>
  );
};

export default LoginPage;