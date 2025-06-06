import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoutes } from "../ui/components/ProtectedRoutes";
import { NotFoundPage } from "../pages/NotFoundPage";
// Importaciones del modulo de inicio y autenticacion
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../features/authentication/pages/LoginPage";
import { RegisterPage } from "../features/authentication/pages/RegisterPage";
import { ForgotPasswordPage } from "../features/authentication/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "../features/authentication/pages/ResetPasswordPage";

// Importaciones del modulo de administracion
import { AdminPage } from "../pages/AdminPage";
import { AdminCommunityPage } from "../features/community/pages/AdminCommunityPage";
import { AdminRegisterForm } from "../features/authentication/layouts/AdminRegisterForm";
// Importaciones del modulo de comunidad
import { CommunityLayout } from "../features/community/layouts/CommunityLayout";
import { PostListView } from "../features/community/pages/PostListView";
import { GroupListView } from "../features/community/pages/GroupListView";
import { GroupDetailsView } from "../features/community/pages/GroupDetailsView";
import { ThreadForumView } from "../features/community/pages/ThreadForumView";
import { AdminCommunityView } from "../features/community/pages/AdminCommunityView";
import { ThreadDetailView } from "../features/community/pages/ThreadDetailView";

// Importaciones de modulo educativo
import { EducationPage } from "../pages/EducationPage";
import { OpenModulePage } from "../features/education/pages/OpenModulePage";
import { ModuleFormPage } from "../features/education/pages/ModuleFormPage";
// Importaciones del modulo de perfil
import { ProfileAdminPage } from "../features/profile/pages/ProfileAdminPage";
import { ProfileEditPage } from "../features/profile/pages/ProfileEditPage";
import { ProfileView } from "../features/profile/ui/ProfileView";
// Importaciones del modulo de Monitoreo
import { MonitoringPage } from "../pages/MonitoringPage";
import { AlertsPage } from "../features/crops/pages/AlertsPage";
import { DataHistoryPage } from "../features/crops/pages/DataHistoryPage";
import { CropsPage } from "../features/crops/pages/CropsPage";
import { RealTimeMonitoringPage } from "../features/crops/pages/RealTimeMonitoringPage";
import { CreateCultivationPage } from "../features/crops/pages/CreateCultivationPage";

// Importaciones de administracion
import { AdminPage } from "../pages/AdminPage";
import { AdminRegisterPage } from "../features/authentication/pages/AdminRegisterPage";

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

      {/* Rutas del modulo de monitoreo */}
      <Route path="/monitoring" element={<MonitoringPage />} />
      <Route path="/monitoring/history" element={<DataHistoryPage />} />
      <Route path="/monitoring/alerts" element={<AlertsPage />} />
      <Route path="/monitoring/crops" element={<CropsPage />} />
      <Route
        path="/monitoring/crops/:cultivoId/real-time"
        element={<RealTimeMonitoringPage />}
      />
      <Route
        path="/monitoring/crops/create"
        element={<CreateCultivationPage />}
      />

      {/* Rutas protegidas: */}
      <Route element={<ProtectedRoutes />}>
        {/* Rutas del modulo educativo */}
        <Route path="/education" element={<EducationPage />} />
        <Route
          path="/education/module/:moduleId"
          element={<OpenModulePage />}
        />
        <Route
          path="/education/module-form/:moduleId?"
          element={<ModuleFormPage />}
        />

        {/* Rutas del modulo de comunidad */}
        <Route path="/comunity" element={<CommunityLayout />}>
          {/* Redirige por defecto a /comunity/posts */}
          <Route index element={<Navigate to="/comunity/posts" replace />} />
          {/* Subrutas del módulo de comunidad */}
          <Route path="posts" element={<PostListView />} />
          <Route path="groups" element={<GroupListView />} />
          <Route path="groups/:groupId" element={<GroupDetailsView />} />
          <Route path="ThreadForum" element={<ThreadForumView />} />
          <Route path="admin_comunity" element={<AdminCommunityView />} />
          
          <Route path="thread/:threadId" element={<ThreadDetailView />} />
        </Route>

        {/* Rutas del modulo de profile */}
        <Route path="/profile/edit" element={<ProfileEditPage />} />
        <Route path="/profile/admin" element={<ProfileAdminPage />} />

        {/* Rutas del modulo de administracion */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/community" element={<AdminCommunityPage />} />
        <Route path="/admin/register" element={<AdminRegisterForm />} />
      </Route>
    </Routes>
  );
};
