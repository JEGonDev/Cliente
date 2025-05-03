import { Routes, Route } from 'react-router-dom'
import { HomePage } from "../pages/HomePage"
import { LoginPage } from "../features/authentication/pages/LoginPage"
import { RegisterPage } from "../features/authentication/pages/RegisterPage"
import { NotFoundPage } from "../pages/NotFoundPage"
import { CreatePassword } from "../features/user/pages/CreatePassword"
import { EditPassword } from "../features/user/pages/EditPassword"
import { CommunityPage } from "../features/community/pages/CommunityPage"
import { ProtectedRoutes } from "../ui/components/ProtectedRoutes"

// Importaciones de módulo educativo
import { EducationPage } from "../features/education/pages/EducationPage";
import { ModuleDetailPage } from "../features/education/pages/ModuleDetailPage";
import { AdminModulesPage } from "../features/education/pages/AdminModulesPage";
import { CreateModulePage } from "../features/education/pages/CreateModulePage";
import { EditModulePage } from "../features/education/pages/EditModulePage";
import { DeleteModulePage } from "../features/education/pages/DeleteModulePage";

export const RouterApp = () => {

  return (
    
    <Routes>
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
