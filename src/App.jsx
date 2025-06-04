import { RouterApp } from "./routes/RouterApp"
import { Header } from "./ui/layouts/Header"
import { useEffect } from "react"
import { setAuthRedirectCallback } from './common/config/api'
import { useNavigate } from 'react-router-dom'

export const App = () => {
  const navigate = useNavigate()

  // Configurar callback para redirección en caso de sesión expirada
  useEffect(() => {
    setAuthRedirectCallback(() => {
      navigate('/login');
    });
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-0 pb-0"> {/* Ajusta el padding según la altura del Header/Footer */}
        <RouterApp />
      </main>
    </div>
  )
}
