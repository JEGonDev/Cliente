import React from 'react';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

export const DivButton_header = () => {
  const navigate = useNavigate(); // Inicializa el hook useNavigate

  return (
   <div className="flex space-x-2">
      <Button
        variant="white"
        size="sm"
        type="button"
        disabled={false}
        onClick={() => navigate('/login')}
        className="m-2 hover:bg-gray-100">

        <span className="text-gray-700">Iniciar</span>
      </Button>

      <Button
        variant="white"
        size="sm"
        type="button"
        disabled={false}
        onClick={() => navigate('/register')} // Redirige a la ruta "/register"
        className="m-2 hover:bg-gray-100" >

        <span className="text-gray-700">Registro</span>
      </Button>
    </div>
  );
};
