import PropTypes from 'prop-types';
import { GuideItem } from './../ui/GuideItem';
import { Button } from '../../../ui/components/Button';

export const GuidesLayout = ({ 
  guides = [],
  isAdmin = false,
  onAddGuide = () => {},
  onEditGuide = () => {},
  onDeleteGuide = () => {}
}) => {
  // Si no hay guías y no es administrador, no mostrar nada
  if (guides.length === 0 && !isAdmin) {
    return null;
  }
  
  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Guías descargables</h2>
        
        {isAdmin && (
          <div className="flex gap-2">
            <Button 
              variant="primary" 
              size="sm" 
              onClick={onAddGuide}
            >
              Agregar
            </Button>
            
            {guides.length > 0 && (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onEditGuide}
                >
                  Editar
                </Button>
                
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={onDeleteGuide}
                >
                  Eliminar
                </Button>
              </>
            )}
          </div>
        )}
      </div>
      
      {guides.length === 0 ? (
        <p className="text-gray-500 italic">No hay guías disponibles.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg">
          {guides.map((guide, index) => (
            <GuideItem 
              key={guide.id} 
              guide={guide} 
              index={index + 1}
            />
          ))}
        </div>
      )}
    </section>
  );
};