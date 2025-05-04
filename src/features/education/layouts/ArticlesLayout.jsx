import PropTypes from 'prop-types';
import { ArticleItem } from './../ui/ArticleItem';

/**
 * Sección que muestra artículos recomendados
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.articles - Lista de artículos a mostrar
 */
export const ArticlesLayout = ({ articles = [] }) => {
  // Si no hay artículos, mostrar una sección vacía
  if (articles.length === 0) {
    return null;
  }
  
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-4">Artículos que podrían interesarte</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {articles.map(article => (
          <ArticleItem key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
};

// Validación de propiedades
ArticlesSection.propTypes = {
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string,
      date: PropTypes.string
    })
  )
};