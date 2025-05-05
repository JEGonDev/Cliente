import PropTypes from "prop-types";
import { ArticleLink } from "../ui/ArticleLink";

/**
 * Sección de artículos recomendados
 *
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.articles - Lista de artículos
 */
export const ArticlesSection = ({ articles = [] }) => {
  // Datos quemados directamente si no hay artículos
  const demoArticles =
    articles.length > 0
      ? articles
      : [
          { id: "aravind.design1", text: "aravind.design", url: "#" },
          { id: "aravind.design2", text: "aravind.design", url: "#" },
          { id: "aravind.design3", text: "aravind.design", url: "#" },
          { id: "aravind.design4", text: "aravind.design", url: "#" },
          { id: "aravind.design5", text: "aravind.design", url: "#" },
          { id: "aravind.design6", text: "aravind.design", url: "#" },
          { id: "landify.design", text: "landify.design", url: "#" },
        ];

  return (
    <section>
      <h1 className="text-4xl font-bold text-black mb-6">
        Introducción del módulo
      </h1>
      <p className="text-sm text-gray-700 mb-4">
        Estos son algunos artículos que podrían ayudarte en tu proceso:
      </p>

      <div className="flex flex-wrap">
        {demoArticles.map((article) => (
          <ArticleLink
            key={article.id}
            id={article.id}
            text={article.text}
            url={article.url}
          />
        ))}
      </div>
    </section>
  );
};

ArticlesSection.propTypes = {
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      url: PropTypes.string,
    })
  ),
};
