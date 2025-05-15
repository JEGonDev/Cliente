import { Routes, Route } from "react-router-dom";
import { ProtectedRoutes } from "../ui/components/ProtectedRoutes";
import { NotFoundPage } from "../pages/NotFoundPage";
// Importaciones del modulo de inicio y autenticacion
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../features/authentication/pages/LoginPage";
import { RegisterPage } from "../features/authentication/pages/RegisterPage";
import { ForgotPasswordPage } from "../features/authentication/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "../features/authentication/pages/ResetPasswordPage";
// Importaciones del modulo de comunidad
import { ComunityPage } from "../features/community/pages/ComunityPage";


// Importaciones de modulo educativo
import { EducationPage } from "../pages/EducationPage";
import { OpenModulePage } from "../features/education/pages/OpenModulePage";
import { ModuleFormPage } from "../features/education/pages/ModuleFormPage";
// Importaciones del modulo de perfil
import { ProfileAdminPage } from "../features/profile/pages/ProfileAdminPage";
import { ProfileEditPage } from "../features/profile/pages/ProfileEditPage";
// Importaciones del modulo de Monitoreo
import { MonitoringPage } from "../pages/MonitoringPage";
import { RealTimeMonitoringPage } from "../features/crops/pages/RealTimeMonitoringPage";
import { AlertsPage } from "../features/crops/pages/AlertsPage";
import { DataHistoryPage } from "../features/crops/pages/DataHistoryPage";
import { CropsPage } from "../features/crops/pages/CropsPage";

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
        <Route path="/comunity" element={<ComunityPage />} />
       

        {/* Rutas del modulo de profile */}
        <Route path="/profile/edit" element={<ProfileEditPage />} />
        <Route path="/profile/admin" element={<ProfileAdminPage />} />

        {/* Rutas del modulo de monitoreo */}
        <Route path="/monitoring" element={<MonitoringPage />} />
        <Route path="/monitoring/history" element={<DataHistoryPage />} />
        <Route path="/monitoring/alerts" element={<AlertsPage />} />
        <Route
          path="/monitoring/real-time"
          element={<RealTimeMonitoringPage />}
        />
        <Route path="/monitoring/crops" element={<CropsPage />} />
      </Route>
    </Routes>
  );
};
