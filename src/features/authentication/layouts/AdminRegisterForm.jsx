import {
  RiUserLine,
  RiMailLockLine,
  RiDoorOpenLine,
  RiUserAddFill,
} from "react-icons/ri";
import DivInput from "../../../ui/components/DivInput";
import { FormButton } from "../../../ui/components/FormButton";
import { FormLink } from "../../../ui/components/FormLink";
import { PasswordInput } from "../ui/PasswordInput";
import { useRegisterForm } from "../hooks/useRegisterForm";
import { AlertError } from "../ui/AlertError";

export const AdminRegisterForm = () => {
  const { form, error, handleChange, handleSubmit } = useRegisterForm({ admin: true });

  return (
    <div className="max-w-md w-full mx-auto bg-white p-6 rounded-lg shadow-md">
      {/* Mostrar alerta de error si existe */}
      <AlertError message={error} show={!!error} />

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campos básicos de información */}
        <div className="relative">
          <DivInput
            name="name"
            type="text"
            icon={
              <RiUserLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            }
            value={form.name}
            placeholder="Nombre"
            required
            handleChange={handleChange}
          />
        </div>

        <div className="relative">
          <DivInput
            name="lastName"
            type="text"
            icon={
              <RiUserLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            }
            value={form.lastName}
            placeholder="Apellido"
            required
            handleChange={handleChange}
          />
        </div>

        <div className="relative">
          <DivInput
            name="userName"
            type="text"
            icon={
              <RiUserLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            }
            value={form.userName}
            placeholder="Nombre de usuario"
            required
            handleChange={handleChange}
          />
        </div>

        <div className="relative">
          <DivInput
            name="email"
            type="email"
            icon={
              <RiMailLockLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            }
            value={form.email}
            placeholder="Email"
            required
            handleChange={handleChange}
          />
        </div>

        {/* Campos de contraseña */}
        <PasswordInput
          name="password"
          value={form.password}
          onChange={handleChange}
        />

        <PasswordInput
          name="confirmPass"
          value={form.confirmPass}
          placeholder="Confirmar contraseña"
          onChange={handleChange}
        />

        {/* Botón de envío */}
        <FormButton
          text="Registrar Administrador"
          icon={<RiDoorOpenLine className="text-lg" />}
        />

        {/* Enlace a login */}
        <FormLink
          text="¿Ya tienes cuenta?"
          linkText="Iniciar Sesión"
          to="/login"
          icon={<RiUserAddFill />}
        />
      </form>
    </div>
  );
};
