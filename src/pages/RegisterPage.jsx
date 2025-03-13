import React, { useState } from 'react'
import DivInput from '../ui/components/DivInput'
import { useNavigate, Link } from 'react-router-dom'
import { sendRequest } from '../ui/functions/functions'
import Storage from '../storage/Storage'
import { RiMailLockLine } from "react-icons/ri";
import { RiLockPasswordLine } from "react-icons/ri";
import { RiDoorOpenLine } from "react-icons/ri";
import { RiUserAddFill } from "react-icons/ri";

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const go = useNavigate();

  const register = async (e) => {
    e.preventDefault();
    const form = { name: name, lastName: lastName, email: email, password: password };
    const res = await sendRequest('POST', form, '/api/register', '', false);
    if (res.status == true) {
      go('/login');
    }
  }

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Registro de Usuario</h2>
      <form onSubmit={register} className="space-y-4">
        <div className="relative">
          <DivInput type='text' icon={<RiMailLockLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />}
            value={name} className='form-control' placeholder='Name' required='required'
            handleChange={(e) => setName(e.target.value)} />
        </div>
        <div className="relative">
          <DivInput type='text' icon={<RiMailLockLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />}
            value={lastName} className='form-control' placeholder='lastName' required='required'
            handleChange={(e) => setlastName(e.target.value)} />
        </div>
        <div className="relative">
          <DivInput type='email' icon={<RiMailLockLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />}
            value={email} className='form-control' placeholder='Email' required='required'
            handleChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="relative">
          <DivInput type='password' icon={<RiLockPasswordLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />}
            value={password} className='form-control' placeholder='password' required='required'
            handleChange={(e) => setPassword(e.target.value)} />
        </div>

       
        <button
          type="submit"
          className="bg-primary text-white w-full py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <RiDoorOpenLine className="text-lg" />
          Registrarse
        </button>
        <div className="text-center text-sm">
          <span className="text-gray-600">ya tienes una cuenta? </span>
          <Link to="/login" className="flex items-center justify-center gap-1 text-blue-600 hover:text-blue-800 font-semibold inline-block">
            <RiUserAddFill className="text-lg" />
            Iniciar Sesión
          </Link>
        </div>
      </form>
    </div>
  )
}