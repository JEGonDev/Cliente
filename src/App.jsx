import { Header } from "./ui/layouts/Header"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Navegacion } from "./ui/components/Navegacion"
import { HomePage } from "./pages/HomePage"
import { LoginPage } from "./pages/LoginPage"
import { RegisterPage } from "./pages/RegisterPage"
import { NotFoundPage } from "./pages/NotFoundPage"
import { CreatePassword } from "./features/user/pages/CreatePassword"
import { EditPassword } from "./features/user/pages/EditPassword"
import { ProtectedRoutes } from "./ui/components/ProtectedRoutes"

export const App = () => {
  return (
    <div>
      <Header />
      <BrowserRouter >
        <Navegacion />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route element={<ProtectedRoutes />} >
            <Route path="/create-password" element={<CreatePassword />} />
            <Route path="/edit-password/:id" element={<EditPassword />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
