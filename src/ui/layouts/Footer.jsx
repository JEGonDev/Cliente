import { FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6">
        <div className="flex flex-wrap justify-between">
          {/* Sección de logo y eslogan */}
          <div className="w-full md:w-1/4 mb-8">
            <div className="flex items-center mb-4">
              <img src="/path/to/logo.png" alt="Logo Cultivo" className="h-12" />
            </div>
            <p className="text-sm mb-4">¡Cultivo Conocimiento, Cosecha Comunidad!</p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Twitter" className="text-white hover:text-opacity-80 transition-colors">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" aria-label="Instagram" className="text-white hover:text-opacity-80 transition-colors">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" aria-label="YouTube" className="text-white hover:text-opacity-80 transition-colors">
                <FaYoutube className="text-xl" />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-white hover:text-opacity-80 transition-colors">
                <FaLinkedin className="text-xl" />
              </a>
            </div>
          </div>
          
          {/* Sección de navegación */}
          <div className="w-full md:w-2/3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {/* Columna Casos de uso */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Casos de uso</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-200 hover:text-green-300 text-sm">Aplicaciones en hidroponía</a></li>
                  <li><a href="#" className="text-gray-200 hover:text-green-300 text-sm">Monitoreo de cultivos</a></li>
                  <li><a href="#" className="text-gray-200 hover:text-green-300 text-sm">Educación en agricultura sostenible</a></li>
                </ul>
              </div>
              
              {/* Columna Explora */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Explora</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-200 hover:text-green-300 text-sm">Comunidad de cultivadores</a></li>
                  <li><a href="#" className="text-gray-200 hover:text-green-300 text-sm">Recursos educativos</a></li>
                  <li><a href="#" className="text-gray-200 hover:text-green-300 text-sm">Herramientas de monitoreo</a></li>
                </ul>
              </div>
              
              {/* Columna Recursos */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Recursos</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-200 hover:text-green-300 text-sm">UI Design para aplicaciones agrícolas</a></li>
                  <li><a href="#" className="text-gray-200 hover:text-green-300 text-sm">UX Design en plataformas de monitoreo</a></li>
                  <li><a href="#" className="text-gray-200 hover:text-green-300 text-sm">Prototyping de modelos de cultivo</a></li>
                  <li><a href="#" className="text-gray-200 hover:text-green-300 text-sm">Best Practices en hidroponía</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Barra inferior con derechos */}
      <div className="bg-green-950 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm mb-4 sm:mb-0">&copy; 2025 Cultivo. Todos los derechos reservados.</p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-200 hover:text-green-300 text-sm">Términos y condiciones</a>
            <a href="#" className="text-gray-200 hover:text-green-300 text-sm">Política de privacidad</a>
            <a href="#" className="text-gray-200 hover:text-green-300 text-sm">Contacto</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;