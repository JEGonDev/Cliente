import React, { useState } from 'react'
import DivInput from '../ui/components/DivInput'
import { useNavigate, Link } from 'react-router-dom'
import { sendRequest } from '../ui/functions/functions'
import Storage from '../storage/Storage'
import { RiMailLockLine, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { RiLockPasswordLine } from "react-icons/ri";
import { RiDoorOpenLine } from "react-icons/ri";
import { RiUserAddFill } from "react-icons/ri";

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const go = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    const form = { email: email, password: password };

    const res = await sendRequest('/login', 'POST', form, '', false);


    if (res) {
      Storage.set('authToken', res.token);
      Storage.set('authUser', res.data);
      console.log(res.token);
      console.log(res.data)
      go('/');
    }
  };



  return (
    <div className=" p-6 max-w-sm mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesion</h2>
      <form onSubmit={login} className="space-y-6">
        <div className="relative">
          <DivInput type='email' icon={<RiMailLockLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />}
            value={email} className='form-control' placeholder='Email' required='required'
            handleChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="relative">
          <DivInput type={showPassword ? "text" : "password"} icon={<RiLockPasswordLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />}
            value={password} className='form-control' placeholder='password' required='required'
            handleChange={(e) => setPassword(e.target.value)} />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
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
      <br />
      <div className="text-center text-sm ">
        <span className="text-gray-600">No tienes una cuenta? </span>
        <Link to="/register" className="flex items-center justify-center gap-1 text-primary hover:text-secondary font-semibold inline-block">
          <RiUserAddFill className="text-lg" />
          Registrate
        </Link>
      </div>
      <br />
      <div className="text-center">
        <a href="/edit-password/:id" className="text-primary hover:text-secondary text-sm">¿Olvidó su contraseña?</a>
      </div>
    </div>
  )
}
