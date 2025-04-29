// src/pages/LoginPage.jsx
import { useState, useContext } from 'react';
import DivInput from '../../../ui/components/DivInput';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../../features/authentication/context/AuthContext';
import { RiUserLine, RiEyeLine, RiEyeOffLine, RiLockPasswordLine, RiDoorOpenLine, RiUserAddFill } from 'react-icons/ri';

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  // Cambiamos email por username
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = e => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await login(credentials);
      navigate('/'); // redirige al home/dashboard
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales inválidas');
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <DivInput
            name="username"                   // nombre cambiado a username
            type="text"                       // tipo text
            icon={<RiUserLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
            value={credentials.username}
            placeholder="Usuario"
            required
            handleChange={handleChange}
          />
        </div>
        <div className="relative">
          <DivInput
            name="password"
            type={showPassword ? 'text' : 'password'}
            icon={<RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
            value={credentials.password}
            placeholder="Contraseña"
            required
            handleChange={handleChange}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
          </button>
        </div>
        <button
          type="submit"
          className="bg-primary text-white w-full py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <RiDoorOpenLine className="text-lg" />
          Iniciar Sesión
        </button>
      </form>
      <p className="text-center text-sm mt-4">
        ¿No tienes cuenta?{' '}
        <Link to="/register" className="text-primary font-semibold hover:text-secondary inline-flex items-center gap-1">
          <RiUserAddFill /> Regístrate
        </Link>
      </p>
    </div>
  );
};
