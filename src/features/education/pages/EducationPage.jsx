import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, BookOpen, Layers, Video, FileText } from 'lucide-rea


/**
 * Página principal del apartado educativo
 */
export const EducationPage = () => {
  // Datos de ejemplo para mostrar en la interfaz
  const [modules] = useState([
    {
      id: 1,
      title: 'Primeros pasos para comenzar con tu cultivo hidropónico',
      description: 'Aprende los conceptos básicos para iniciar en el mundo de la hidroponía y cómo montar tu primer sistema.',
      level: 'Principiante',
      type: 'guide',
      imageUrl: '/api/placeholder/400/300',
      duration: 30,
      tags: ['Infraestructura', 'Principiante', 'Conceptos básicos']
    },
    {
      id: 2,
      title: 'Cultivo de lechuga en sistema NFT',
      description: 'Todo lo que necesitas saber para cultivar lechuga en un sistema NFT de manera exitosa.',
      level: 'Intermedio',
      type: 'video',
      imageUrl: '/api/placeholder/400/300',
      duration: 15,
      tags: ['Lechuga', 'NFT', 'Cultivo']
    },
    {
      id: 3,
      title: 'Nutrientes esenciales para hidroponía',
      description: 'Guía completa sobre los nutrientes necesarios para tus cultivos hidropónicos y cómo manejarlos.',
      level: 'Avanzado',
      type: 'article',
      imageUrl: '/api/placeholder/400/300',
      duration: 20,
      tags: ['Nutrientes', 'Química', 'Soluciones']
    },
    {
      id: 4,
      title: 'Control de plagas en hidroponía',
      description: 'Aprende a identificar y controlar las plagas más comunes en cultivos hidropónicos de manera orgánica.',
      level: 'Intermedio',
      type: 'article',
      imageUrl: '/api/placeholder/400/300',
      duration: 25,
      tags: ['Plagas', 'Control biológico', 'Protección']
    },
    {
      id: 5,
      title: 'Construcción de un sistema hidropónico casero',
      description: 'Aprende a construir tu propio sistema hidropónico con materiales económicos y accesibles.',
      level: 'Principiante',
      type: 'guide',
      imageUrl: '/api/placeholder/400/300',
      duration: 45,
      tags: ['DIY', 'Construcción', 'Materiales']
    },
    {
      id: 6,
      title: 'Monitoreo de pH y EC en hidroponía',
      description: 'Importancia y técnicas para el correcto monitoreo del pH y la conductividad eléctrica en tus cultivos.',
      level: 'Avanzado',
      type: 'video',
      imageUrl: '/api/placeholder/400/300',
      duration: 18,
      tags: ['pH', 'EC', 'Monitoreo', 'Instrumentos']
    }
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Banner principal */}
      <div className="bg-primary rounded-xl p-6 mb-8 text-white flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0 md:mr-6">
          <h1 className="text-2xl font-bold mb-2">Centro de Aprendizaje Hidropónico</h1>
          <p className="text-green-100">
            Explora contenidos educativos sobre hidroponía para todos los niveles de experiencia
          </p>
        </div>
        <Link 
          to="/education/create"
          className="bg-white text-primary px-4 py-2 rounded-lg font-medium flex items-center hover:bg-gray-100 transition-colors"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Crear contenido
        </Link>
      </div>
      
      {/* Categorías de contenido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50 rounded-lg p-4 flex items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-gray-800">Guías Paso a Paso</h2>
            <p className="text-sm text-gray-600">Instrucciones detalladas para proyectos hidropónicos</p>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4 flex items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <Video className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-800">Videos Explicativos</h2>
            <p className="text-sm text-gray-600">Tutoriales visuales sobre técnicas y conceptos</p>
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 flex items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="bg-purple-100 p-3 rounded-full mr-4">
            <FileText className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-800">Artículos Técnicos</h2>
            <p className="text-sm text-gray-600">Información detallada y conocimiento especializado</p>
          </div>
        </div>
      </div>
      
      {/* Niveles de dificultad */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Layers className="h-5 w-5 mr-2 text-primary" />
          Explora por nivel
        </h2>
        
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 rounded-full bg-green-100 text-green-800 font-medium hover:bg-green-200 transition-colors">
            Principiante
          </button>
          <button className="px-4 py-2 rounded-full bg-blue-100 text-blue-800 font-medium hover:bg-blue-200 transition-colors">
            Intermedio
          </button>
          <button className="px-4 py-2 rounded-full bg-purple-100 text-purple-800 font-medium hover:bg-purple-200 transition-colors">
            Avanzado
          </button>
        </div>
      </div>
      
      {/* Lista de módulos */}
      <ModulesList modules={modules} />
    </div>
  );
};