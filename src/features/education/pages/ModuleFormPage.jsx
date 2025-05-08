import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ModuleFormLayout } from '../layouts/ModuleFormLayout';
import { AuthContext } from '../../authentication/context/AuthContext';
import { useModules } from '../hooks/useModules';

export const ModuleFormPage = () => {
  const { moduleId } = useParams();
  const isEditing = !!moduleId;
  const { isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: []
  });
  
  // Hook personalizado para operaciones con módulos
  const { fetchModuleById, handleCreateModule, handleUpdateModule } = useModules();
  
  // Verificar permisos de administrador
  useEffect(() => {
    if (!isAdmin) {
      navigate('/education');
    }
  }, [isAdmin, navigate]);
  
  // Cargar datos del módulo si estamos en modo edición
  useEffect(() => {
    if (isEditing && moduleId) {
      const loadModuleData = async () => {
        try {
          const moduleData = await fetchModuleById(moduleId);
          if (moduleData) {
            setFormData({
              title: moduleData.title || '',
              description: moduleData.description || '',
              tags: moduleData.tags || []
            });
          }
        } catch (error) {
          console.error('Error cargando datos del módulo:', error);
        }
      };
      
      loadModuleData();
    }
  }, [isEditing, moduleId, fetchModuleById]);
  
  // Manejadores de eventos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTagChange = (e) => {
    const { checked, value } = e.target;
    setFormData(prev => ({
      ...prev,
      tags: checked 
        ? [...prev.tags, value]
        : prev.tags.filter(tag => tag !== value)
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        await handleUpdateModule(moduleId, formData);
      } else {
        await handleCreateModule(formData);
      }
      
      // Navegar de vuelta a la página principal de educación
      navigate('/education');
    } catch (error) {
      console.error('Error guardando módulo:', error);
    }
  };
  
  const handleCancel = () => {
    navigate('/education');
  };
  
  return (
    <ModuleFormLayout
      title={isEditing ? "Editar Módulo Educativo" : "Crear Nuevo Módulo Educativo"}
      submitText={isEditing ? "Guardar Cambios" : "Crear Módulo"}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título del módulo
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
          ></textarea>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Etiquetas
          </label>
          <div className="flex flex-wrap gap-2">
            {['Principiante', 'Avanzado', 'Tomate', 'Lechuga', 'Infraestructura'].map((tag) => (
              <div key={tag} className="flex items-center">
                <input
                  type="checkbox"
                  id={`tag-${tag}`}
                  value={tag}
                  checked={formData.tags.includes(tag)}
                  onChange={handleTagChange}
                  className="h-4 w-4 border-gray-300 rounded text-green-600 focus:ring-green-500"
                />
                <label htmlFor={`tag-${tag}`} className="ml-2 text-sm text-gray-700">
                  {tag}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-600">
            {isEditing 
              ? "Modifica los campos necesarios y guarda los cambios." 
              : "Una vez creado el módulo, podrás agregar artículos, guías y videos desde la vista de detalle."}
          </p>
        </div>
      </div>
    </ModuleFormLayout>
  );
};