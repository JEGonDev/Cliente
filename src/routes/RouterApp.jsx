import { Routes, Route } from 'react-router-dom';
import { ProtectedRoutes } from "../ui/components/ProtectedRoutes";
import { NotFoundPage } from "../pages/NotFoundPage";
// Importaciones del modulo de inicio y autenticacion
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../features/authentication/pages/LoginPage";
import { RegisterPage } from "../features/authentication/pages/RegisterPage";
import { ForgotPasswordPage } from "../features/authentication/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "../features/authentication/pages/ResetPasswordPage";
// Importaciones del modulo de comunidad
import { CommunityPage } from "../features/community/pages/CommunityPage";
// Importaciones de módulo educativo
import { EducationPage } from '../pages/EducationPage';
import { ModuleDetailPage } from '../features/education/pages/ModuleDetailPage';
import { AdminModulesPage } from '../features/education/pages/AdminModulesPage'; 
import { VideoManagementActions } from '../features/education/pages/VideoManagementActions';
import { DeleteModulePage } from '../features/education/pages/DeleteModulePage';
import { EditModulePage } from '../features/education/pages/EditModulePage';
import { CreateModulePage } from '../features/education/pages/CreateModulePage';

export const RouterApp = () => {
  return (

    // Rutas existentes de la aplicacion:
    <Routes>
      {/* Rutas publicas: */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="*" element={<NotFoundPage />} />

      {/* Estas rutas deberan ser agregadas en rutas protegidas mas adelante */}

      {/* Rutas del modulo educativo */}
      <Route path="/education" element={<EducationPage />} />
      <Route path="/education/module/:moduleId" element={<OpenModulePage />} />
      <Route path="/education/module-form/:moduleId?" element={<ModuleFormPage />} />

      {/* Rutas del modulo de comunidad */}
      <Route path="/community" element={<CommunityPage />} />

      {/* Rutas del modulo de profile */}
      <Route path="/profile/edit" element={<ProfileEditPage />} />

     

      {/* Rutas protegidas: */}
      <Route element={<ProtectedRoutes />} >
        {/* Aqui van las rutas protegidas */}
      </Route>
  </Routes>
  )
}
