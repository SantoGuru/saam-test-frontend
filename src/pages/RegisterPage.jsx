import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="form-container">
      <h1>Registo</h1>
      <RegisterForm />
      <p className="form-footer">
        Já tem uma conta? <Link to="/login">Faça o login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;