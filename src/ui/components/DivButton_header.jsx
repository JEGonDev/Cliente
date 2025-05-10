import React from 'react';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

export const DivButton_header = () => {
  const navigate = useNavigate(); // Inicializa el hook useNavigate

  return (
    <div>
      <Button
        variant="white"
        size="sm"
        type="button"
        disabled={false}
        onClick={() => navigate('/login')} // Redirige a la ruta "/login"
        className="m-2"
      >
        <span className="text-gray-700">Iniciar</span>
      </Button>
      <Button
        variant="header"
        size="sm"
        type="button"
        disabled={false}
        onClick={() => navigate('/register')} // Redirige a la ruta "/register"
        className="m-2"
      >
        <span className="text-gray-700">Registro</span>
      </Button>
    </div>
  );
};
