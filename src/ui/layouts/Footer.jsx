import { FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';

export const Footer = ({ id }) => {
  return (
     <footer id={id} className="bg-primary text-white">
      <div className="max-w-7xl mx-auto py-12 px-6 sm:px-8">
        <div className="flex flex-wrap justify-between">

          {/* Logo + Eslogan */}
          <div className="w-full md:w-1/4 mb-10 md:mb-0">
            <div className="flex items-end space-x-4 mb-4">
              <img src="src/assets/header/logo2.png" alt="Logo Cultivo" className="h-12" />
              <p className="text-sm font-semibold leading-snug">
                ¡Cultivo Conocimiento, <br /> Cosecha Comunidad!
              </p>
            </div>
            <div className="flex space-x-6 text-white">
              <a href="#" aria-label="Twitter" className="hover:text-green-400 transition-colors">
                <FaTwitter className="text-2xl" />
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-green-400 transition-colors">
                <FaInstagram className="text-2xl" />
              </a>
              <a href="#" aria-label="YouTube" className="hover:text-green-400 transition-colors">
                <FaYoutube className="text-2xl" />
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-green-400 transition-colors">
                <FaLinkedin className="text-2xl" />
              </a>
            </div>
          </div>

          {/* Navegación */}
          <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-10">
            {/* Casos de uso */}
            <div>
              <h3 className="text-lg font-semibold mb-5 border-b border-green-400 pb-2">Casos de uso</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-green-400 text-sm transition-colors">Aplicaciones en hidroponía</a></li>
                <li><a href="#" className="text-gray-300 hover:text-green-400 text-sm transition-colors">Monitoreo de cultivos</a></li>
                <li><a href="#" className="text-gray-300 hover:text-green-400 text-sm transition-colors">Educación en agricultura sostenible</a></li>
              </ul>
            </div>

            {/* Explora */}
            <div>
              <h3 className="text-lg font-semibold mb-5 border-b border-green-400 pb-2">Explora</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-green-400 text-sm transition-colors">Comunidad de cultivadores</a></li>
                <li><a href="#" className="text-gray-300 hover:text-green-400 text-sm transition-colors">Recursos educativos</a></li>
                <li><a href="#" className="text-gray-300 hover:text-green-400 text-sm transition-colors">Herramientas de monitoreo</a></li>
              </ul>
            </div>

            {/* Recursos */}
            <div>
              <h3 className="text-lg font-semibold mb-5 border-b border-green-400 pb-2">Recursos</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-green-400 text-sm transition-colors">UI Design para aplicaciones agrícolas</a></li>
                <li><a href="#" className="text-gray-300 hover:text-green-400 text-sm transition-colors">UX Design en plataformas de monitoreo</a></li>
                <li><a href="#" className="text-gray-300 hover:text-green-400 text-sm transition-colors">Prototyping de modelos de cultivo</a></li>
                <li><a href="#" className="text-gray-300 hover:text-green-400 text-sm transition-colors">Best Practices en hidroponía</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="bg-green-950 py-5 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-gray-300 text-sm">
          <p className="mb-4 sm:mb-0">&copy; 2025 Cultivo. Todos los derechos reservados.</p>
          <div className="flex space-x-8">
            <a href="#" className="hover:text-green-400 transition-colors">Términos y condiciones</a>
            <a href="#" className="hover:text-green-400 transition-colors">Política de privacidad</a>
            <a href="#" className="hover:text-green-400 transition-colors">Contacto</a>
          </div>
        </div>
      </div>
    </footer>
  );
};


