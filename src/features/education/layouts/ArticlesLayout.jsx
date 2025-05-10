import PropTypes from 'prop-types';
import { ArticleItem } from './../ui/ArticleItem';
import { Button } from '../../../ui/components/Button';

export const ArticlesLayout = ({ 
  articles = [], 
  isAdmin = false,
  onAddArticle = () => {},
  onEditArticle = () => {},
  onDeleteArticle = () => {}
}) => {
  // Si no hay artículos y no es administrador, no mostrar nada
  if (articles.length === 0 && !isAdmin) {
    return null;
  }
  
  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Artículos que podrían interesarte</h2>
        
        {isAdmin && (
          <div className="flex gap-2">
            <Button 
              variant="primary" 
              size="sm" 
              onClick={onAddArticle}
            >
              Agregar
            </Button>
            
            {articles.length > 0 && (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onEditArticle}
                >
                  Editar
                </Button>
                
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={onDeleteArticle}
                >
                  Eliminar
                </Button>
              </>
            )}
          </div>
        )}
      </div>
      
      {articles.length === 0 ? (
        <p className="text-gray-500 italic">No hay artículos disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {articles.map(article => (
            <ArticleItem 
              key={article.id} 
              article={article} 
              isAdmin={isAdmin} 
            />
          ))}
        </div>
      )}
    </section>
  );
};