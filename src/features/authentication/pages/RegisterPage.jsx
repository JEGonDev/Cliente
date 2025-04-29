import { useState, useContext } from 'react';
import DivInput from '../../../ui/components/DivInput';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../../features/authentication/context/AuthContext';
import {
  RiUserLine,
  RiMailLockLine,
  RiLockPasswordLine,
  RiDoorOpenLine,
  RiUserAddFill
} from 'react-icons/ri';

export const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
    confirmPass: ''
  });

  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPass) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      await register({
        firstName: form.name,
        lastName: form.lastName,
        username: form.userName,
        email: form.email,
        password: form.password
      });
      navigate('/'); // O '/login' si así lo prefieres
    } catch (err) {
      console.error('Error en el registro:', err);

      const backendMessage =
        typeof err?.response?.data === 'string'
          ? err.response.data
          : err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            'Error en el registro';

      setError(backendMessage);
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Registro de Usuario</h2>

      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { name: 'name',        placeholder: 'Nombre',               icon: <RiUserLine /> },
          { name: 'lastName',    placeholder: 'Apellido',             icon: <RiUserLine /> },
          { name: 'userName',    placeholder: 'Nombre de usuario',    icon: <RiUserLine /> },
          { name: 'email',       placeholder: 'Email',                icon: <RiMailLockLine />, type: 'email' },
          { name: 'password',    placeholder: 'Contraseña',           icon: <RiLockPasswordLine />, type: 'password' },
          { name: 'confirmPass', placeholder: 'Confirmar contraseña', icon: <RiLockPasswordLine />, type: 'password' },
        ].map(({ name, placeholder, icon, type = 'text' }) => (
          <div className="relative" key={name}>
            <DivInput
              name={name}
              type={type}
              icon={
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {icon}
                </span>
              }
              value={form[name]}
              placeholder={placeholder}
              required
              handleChange={handleChange}
            />
          </div>
        ))}

        <button
          type="submit"
          className="bg-primary text-white w-full py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <RiDoorOpenLine className="text-lg" />
          Registrarse
        </button>

        <p className="text-center text-sm">
          ¿Ya tienes cuenta?{' '}
          <Link
            to="/login"
            className="text-primary font-semibold hover:text-secondary inline-flex items-center gap-1"
          >
            <RiUserAddFill /> Iniciar Sesión
          </Link>
        </p>
      </form>
    </div>
  );
};
