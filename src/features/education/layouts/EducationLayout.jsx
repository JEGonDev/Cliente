import { Search } from 'lucide-react';

/**
 * Layout principal para el módulo educativo de Germogli
 * Incluye sidebar, contenido principal y panel de filtros
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido principal
 * @param {boolean} props.isAdmin - Indica si es vista de administrador
 */
export const EducationLayout = ({ children, isAdmin = false }) => {
  // Color principal de la aplicación
  const primaryColor = '#043707'; // Verde oscuro de Germogli
  
  return (
    <div className="flex flex-col min-h-screen">
     
      <div className="flex flex-1">
        {/* Sidebar - Navegación lateral */}
        <aside className="w-64 bg-gray-100 p-4 hidden md:block">
          <div className="space-y-6">
            <div className="flex flex-col items-center py-2">
              <div className="rounded-full bg-gray-200 p-3">
                <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="mt-1 text-sm text-center">Configuración</span>
            </div>

            <div className="flex flex-col items-center py-2">
              <div className="rounded-full bg-gray-200 p-3">
                <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <span className="mt-1 text-sm text-center">Actividad</span>
            </div>

            <div className="flex flex-col items-center py-2">
              <div className="rounded-full bg-gray-200 p-3">
                <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="mt-1 text-sm text-center">Foro</span>
            </div>

            <div className="flex flex-col items-center py-2">
              <div className="rounded-full bg-gray-200 p-3">
                <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="mt-1 text-sm text-center">Grupos</span>
            </div>
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 p-6">
          {/* Título y buscador */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-4">Contenido educativo</h1>
    
            {isAdmin && (
              <div className="flex mt-4 gap-2">
                <button 
                  className="bg-[#043707] text-white px-4 py-2 rounded"
                >
                  Crear etiqueta
                </button>
                
                <button 
                  className="bg-[#043707] text-white px-4 py-2 rounded"
                >
                  Modificar etiqueta
                </button>
                
                <button 
                  className="bg-[#043707] text-white px-4 py-2 rounded"
                >
                  Eliminar etiqueta
                </button>
              </div>
            )}
          </div>
          
          {/* Contenido de módulos */}
          {children}
          
          {/* Botones de administración (solo para admin) */}
          {isAdmin && (
            <div className="flex flex-wrap gap-4 mt-8 justify-center">
              <button 
                className="bg-[#043707] text-white px-8 py-3 rounded-md text-lg font-medium"
              >
                Crear módulo
              </button>
              
              <button 
                className="bg-[#043707] text-white px-8 py-3 rounded-md text-lg font-medium"
              >
                Modificar módulo
              </button>
              
              <button 
                className="bg-[#043707] text-white px-8 py-3 rounded-md text-lg font-medium"
              >
                Eliminar módulo
              </button>
            </div>
          )}
        </main>
        
        {/* Panel lateral de filtros */}
        <aside className="w-64 p-4 hidden lg:block">
          <div className="space-y-2">
            <button className="bg-[#043707] text-white w-full py-2 px-4 rounded-md text-sm">
              #Principiante
            </button>
            
            <button className="bg-[#043707] text-white w-full py-2 px-4 rounded-md text-sm">
              #Tomate
            </button>
            
            <button className="bg-[#043707] text-white w-full py-2 px-4 rounded-md text-sm">
              #Arracacha
            </button>
            
            <button className="bg-[#043707] text-white w-full py-2 px-4 rounded-md text-sm">
              #Infraestructura
            </button>
            
            <button className="bg-[#043707] text-white w-full py-2 px-4 rounded-md text-sm">
              #Avanzado
            </button>
          </div>
          
          {isAdmin && (
            <div className="mt-8 space-y-2">
              <button className="bg-[#043707] text-white w-full py-2 px-4 rounded-md text-sm">
                Crear etiqueta
              </button>
              
              <button className="bg-[#043707] text-white w-full py-2 px-4 rounded-md text-sm">
                Modificar etiqueta
              </button>
              
              <button className="bg-[#043707] text-white w-full py-2 px-4 rounded-md text-sm">
                Eliminar etiqueta
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};