import { Routes, Route } from 'react-router-dom'
import { HomePage } from "../pages/HomePage"
import { LoginPage } from "../features/authentication/pages/LoginPage"
import { RegisterPage } from "../features/authentication/pages/RegisterPage"
import { NotFoundPage } from "../pages/NotFoundPage"
import { CreatePassword } from "../features/user/pages/CreatePassword"
import { EditPassword } from "../features/user/pages/EditPassword"
import { CommunityPage } from "../features/community/pages/CommunityPage"
import { ProtectedRoutes } from "../ui/components/ProtectedRoutes"
import { ForgotPasswordPage } from "../features/authentication/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "../features/authentication/pages/ResetPasswordPage";

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
      <Route path="/community" element={<CommunityPage />} />
      <Route path="*" element={<NotFoundPage />} />
      {/* Rutas protegidas: */}
      <Route element={<ProtectedRoutes />} >
        <Route path="/create-password" element={<CreatePassword />} />
        <Route path="/edit-password/:id" element={<EditPassword />} />
      </Route>
  </Routes>
  )
}
