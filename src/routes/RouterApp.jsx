import { Routes, Route } from 'react-router-dom'
import { HomePage } from "../pages/HomePage"
import { LoginPage } from "../features/authentication/pages/LoginPage"
import { RegisterPage } from "../features/authentication/pages/RegisterPage"
import { NotFoundPage } from "../pages/NotFoundPage"
import { CommunityPage } from "../features/community/pages/CommunityPage"
import { ProtectedRoutes } from "../ui/components/ProtectedRoutes"
<<<<<<< HEAD
import { ForgotPasswordPage } from "../features/authentication/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "../features/authentication/pages/ResetPasswordPage";
=======

// Importaciones de módulo educativo
import { EducationPage } from "../features/education/pages/EducationPage";
import { ModuleDetailPage } from "../features/education/pages/ModuleDetailPage";
import { AdminModulesPage } from "../features/education/pages/AdminModulesPage";
import { CreateModulePage } from "../features/education/pages/CreateModulePage";
import { EditModulePage } from "../features/education/pages/EditModulePage";
import { DeleteModulePage } from "../features/education/pages/DeleteModulePage";

export const RouterApp = () => {
>>>>>>> feature/maquetacion-moduloEducacion-v1

export const RouterApp = () => {
  return (
    // Rutas existentes de la aplicacion:
    <Routes>
<<<<<<< HEAD
      {/* Rutas publicas: */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/community" element={<CommunityPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="*" element={<NotFoundPage />} />
      {/* Rutas protegidas: */}
      <Route element={<ProtectedRoutes />} >
        {/* <Route path="/reset-password" element={<ResetPasswordPage />} /> */}
      </Route>
  </Routes>
  )
}
=======
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/community" element={<CommunityPage />} />
    <Route path="*" element={<NotFoundPage />} />
    <Route element={<ProtectedRoutes />} >
      <Route path="/create-password" element={<CreatePassword />} />
      <Route path="/edit-password/:id" element={<EditPassword />} />
    </Route>
 {/* Rutas del módulo educativo */}
 <Route path="/education" element={<EducationPage />} />
      <Route path="/education/modules/:id" element={<ModuleDetailPage />} />
      
      {/* Rutas protegidas: */}
      <Route element={<ProtectedRoutes />} >
        {/* Rutas protegidas del módulo educativo (administración) */}
        <Route path="/education/admin" element={<AdminModulesPage />} />
        <Route path="/education/create" element={<CreateModulePage />} />
        <Route path="/education/edit/:id" element={<EditModulePage />} />
        <Route path="/education/delete" element={<DeleteModulePage />} />
      </Route>
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )}
>>>>>>> feature/maquetacion-moduloEducacion-v1
